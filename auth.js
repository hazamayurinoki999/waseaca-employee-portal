// ===================================
// 認証・暗号化ユーティリティモジュール
// ===================================

// 定数
const AUTH_CONFIG = {
    PASSWORD_HASH: 'Wo67341969', // 固定パスワード（実際はハッシュ化して比較）
    ALLOWED_DOMAINS: ['waseaca.com', 'waseaca.jp'], // 許可されたメールドメイン（拡張用）
    SESSION_DURATION: 24 * 60 * 60 * 1000, // 24時間（ミリ秒）
    TOKEN_DURATION: 60 * 60 * 1000, // 1時間（ミリ秒）- FAQ用トークン
    MAX_LOGIN_ATTEMPTS: 10, // 最大ログイン試行回数（10回に変更）
    LOCKOUT_DURATION: 5 * 60 * 1000, // ロックアウト時間: 5分
    STORAGE_KEY: 'waseaca_auth',
    ATTEMPTS_KEY: 'waseaca_login_attempts',
    SECRET_KEY: 'waseaca-portal-secret-2024' // HMAC署名用の秘密鍵
};

// 従業員メールアドレスホワイトリスト
// ※ここに登録されたメールアドレスのみログイン可能
const EMPLOYEE_EMAILS = [
    // シンガポール校の従業員メールアドレス
    'admin@waseaca.com',
    'teacher@waseaca.com',
    'staff@waseaca.com',
    'mizobata.y@waseaca.com',
    // テスト用
    'test@waseaca.com',
    'demo@example.com'
    // 新しい従業員を追加する場合は、ここに追加してください
];

// ===================================
// ユーティリティ関数
// ===================================

/**
 * SHA-256ハッシュを生成
 */
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * HMAC-SHA256署名を生成
 */
async function generateHMAC(data, secret) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(signature));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * HMAC署名を検証
 */
async function verifyHMAC(data, signature, secret) {
    const expectedSignature = await generateHMAC(data, secret);
    return signature === expectedSignature;
}

/**
 * Base64エンコード（URL safe）
 */
function base64UrlEncode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode('0x' + p1);
    })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Base64デコード（URL safe）
 */
function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
        str += '=';
    }
    return decodeURIComponent(Array.prototype.map.call(atob(str), c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

// ===================================
// ログイン試行回数制限
// ===================================

/**
 * ログイン試行回数を取得
 */
function getLoginAttempts() {
    try {
        const data = localStorage.getItem(AUTH_CONFIG.ATTEMPTS_KEY);
        if (!data) return { count: 0, lockedUntil: null };
        return JSON.parse(data);
    } catch (e) {
        return { count: 0, lockedUntil: null };
    }
}

/**
 * ログイン試行回数を記録
 */
function recordLoginAttempt(success = false) {
    if (success) {
        // ログイン成功時はリセット
        localStorage.removeItem(AUTH_CONFIG.ATTEMPTS_KEY);
        return;
    }

    const attempts = getLoginAttempts();
    attempts.count += 1;

    if (attempts.count >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
        attempts.lockedUntil = Date.now() + AUTH_CONFIG.LOCKOUT_DURATION;
    }

    localStorage.setItem(AUTH_CONFIG.ATTEMPTS_KEY, JSON.stringify(attempts));
}

/**
 * アカウントがロックされているかチェック
 */
function isAccountLocked() {
    const attempts = getLoginAttempts();
    if (!attempts.lockedUntil) return false;

    if (Date.now() < attempts.lockedUntil) {
        return true;
    } else {
        // ロック期間終了
        localStorage.removeItem(AUTH_CONFIG.ATTEMPTS_KEY);
        return false;
    }
}

/**
 * ロック解除までの残り時間（秒）
 */
function getLockoutRemainingSeconds() {
    const attempts = getLoginAttempts();
    if (!attempts.lockedUntil) return 0;

    const remaining = Math.ceil((attempts.lockedUntil - Date.now()) / 1000);
    return Math.max(0, remaining);
}

// ===================================
// メールバリデーション
// ===================================

/**
 * メールアドレスの形式をチェック
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 従業員メールアドレスのホワイトリストチェック
 */
function isEmployeeEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    return EMPLOYEE_EMAILS.map(e => e.toLowerCase()).includes(normalizedEmail);
}

/**
 * メールドメインのホワイトリストチェック（オプション）
 * 現在は従業員メールリストを優先
 */
function isAllowedDomain(email) {
    // 従業員メールリストで管理しているため、現在は使用していない
    // ドメインベースの制限が必要な場合は以下を有効化
    /*
    const domain = email.split('@')[1]?.toLowerCase();
    return AUTH_CONFIG.ALLOWED_DOMAINS.some(allowed => domain === allowed || domain.endsWith('.' + allowed));
    */
    return true;
}

/**
 * メールアドレスを検証
 */
function validateEmail(email) {
    if (!email || !isValidEmail(email)) {
        return { valid: false, error: 'メールアドレスの形式が正しくありません' };
    }

    // 従業員メールアドレスのホワイトリストチェック
    if (!isEmployeeEmail(email)) {
        return { valid: false, error: 'このメールアドレスはログインが許可されていません' };
    }

    return { valid: true };
}

// ===================================
// パスワード検証
// ===================================

/**
 * パスワードを検証（シンプルな比較）
 */
async function validatePassword(password) {
    if (!password) {
        return { valid: false, error: 'パスワードを入力してください' };
    }

    // 固定パスワードと比較
    if (password === AUTH_CONFIG.PASSWORD_HASH) {
        return { valid: true };
    } else {
        return { valid: false, error: 'パスワードが正しくありません' };
    }
}

// ===================================
// セッション管理
// ===================================

/**
 * セッショントークンを生成
 */
async function generateSessionToken(email, schoolId) {
    const payload = {
        email: email,
        schoolId: schoolId,
        timestamp: Date.now(),
        expiresAt: Date.now() + AUTH_CONFIG.SESSION_DURATION
    };

    const payloadStr = JSON.stringify(payload);
    const signature = await generateHMAC(payloadStr, AUTH_CONFIG.SECRET_KEY);

    return {
        payload: base64UrlEncode(payloadStr),
        signature: signature
    };
}

/**
 * セッショントークンを検証
 */
async function verifySessionToken(token) {
    try {
        const payloadStr = base64UrlDecode(token.payload);
        const isValid = await verifyHMAC(payloadStr, token.signature, AUTH_CONFIG.SECRET_KEY);

        if (!isValid) {
            return { valid: false, error: 'トークンが改ざんされています' };
        }

        const payload = JSON.parse(payloadStr);

        // 有効期限チェック
        if (Date.now() > payload.expiresAt) {
            return { valid: false, error: 'セッションの有効期限が切れています' };
        }

        return { valid: true, payload: payload };
    } catch (e) {
        return { valid: false, error: 'トークンが無効です' };
    }
}

/**
 * セッションをlocalStorageに保存
 */
function saveSession(token) {
    try {
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEY, JSON.stringify(token));
        return true;
    } catch (e) {
        console.error('Failed to save session:', e);
        return false;
    }
}

/**
 * セッションをlocalStorageから読み込み
 */
function loadSession() {
    try {
        const data = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY);
        if (!data) return null;
        return JSON.parse(data);
    } catch (e) {
        console.error('Failed to load session:', e);
        return null;
    }
}

/**
 * セッションを削除
 */
function clearSession() {
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
    localStorage.removeItem(AUTH_CONFIG.ATTEMPTS_KEY);
}

/**
 * 現在のセッションを取得して検証
 */
async function getCurrentSession() {
    const token = loadSession();
    if (!token) return null;

    const verification = await verifySessionToken(token);
    if (!verification.valid) {
        clearSession();
        return null;
    }

    return verification.payload;
}

// ===================================
// ユーザー環境設定管理
// ===================================

/**
 * ユーザーの環境設定を保存
 */
function saveUserPreferences(email, preferences) {
    try {
        const key = `waseaca_prefs_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        localStorage.setItem(key, JSON.stringify(preferences));
        return true;
    } catch (e) {
        console.error('Failed to save user preferences:', e);
        return false;
    }
}

/**
 * ユーザーの環境設定を読み込み
 */
function loadUserPreferences(email) {
    try {
        const key = `waseaca_prefs_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        const data = localStorage.getItem(key);
        if (!data) return null;
        return JSON.parse(data);
    } catch (e) {
        console.error('Failed to load user preferences:', e);
        return null;
    }
}

/**
 * 現在のユーザーの環境設定を保存
 */
async function saveCurrentUserPreferences(preferences) {
    const user = await getCurrentUser();
    if (!user) return false;

    return saveUserPreferences(user.email, preferences);
}

/**
 * 現在のユーザーの環境設定を読み込み
 */
async function loadCurrentUserPreferences() {
    const user = await getCurrentUser();
    if (!user) return null;

    return loadUserPreferences(user.email);
}


// ===================================
// FAQ用トークン生成（1時間有効）
// ===================================

/**
 * FAQ用の短期トークンを生成（HMAC署名付き）
 */
async function generateFAQToken(email, schoolId) {
    const payload = {
        email: email,
        schoolId: schoolId,
        mode: 'teacher',
        timestamp: Date.now(),
        expiresAt: Date.now() + AUTH_CONFIG.TOKEN_DURATION // 1時間
    };

    const payloadStr = JSON.stringify(payload);
    const signature = await generateHMAC(payloadStr, AUTH_CONFIG.SECRET_KEY);

    // ペイロード + 署名を結合してBase64エンコード
    const tokenData = {
        p: base64UrlEncode(payloadStr),
        s: signature
    };

    return base64UrlEncode(JSON.stringify(tokenData));
}

/**
 * FAQ用トークンを検証（FAQ側で使用）
 */
async function verifyFAQToken(tokenString) {
    try {
        const tokenData = JSON.parse(base64UrlDecode(tokenString));
        const payloadStr = base64UrlDecode(tokenData.p);

        const isValid = await verifyHMAC(payloadStr, tokenData.s, AUTH_CONFIG.SECRET_KEY);
        if (!isValid) {
            return { valid: false, error: 'トークンが改ざんされています' };
        }

        const payload = JSON.parse(payloadStr);

        // 有効期限チェック
        if (Date.now() > payload.expiresAt) {
            return { valid: false, error: 'トークンの有効期限が切れています' };
        }

        return { valid: true, payload: payload };
    } catch (e) {
        return { valid: false, error: 'トークンが無効です' };
    }
}

// ===================================
// 認証API
// ===================================

/**
 * ログイン処理
 */
async function login(email, password, schoolId) {
    // アカウントロックチェック
    if (isAccountLocked()) {
        const remaining = getLockoutRemainingSeconds();
        return {
            success: false,
            error: `ログイン試行回数が上限に達しました。${Math.ceil(remaining / 60)}分後に再試行してください。`
        };
    }

    // メール検証
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        recordLoginAttempt(false);
        return { success: false, error: emailValidation.error };
    }

    // パスワード検証
    const passwordValidation = await validatePassword(password);
    if (!passwordValidation.valid) {
        recordLoginAttempt(false);
        const attempts = getLoginAttempts();
        const remaining = AUTH_CONFIG.MAX_LOGIN_ATTEMPTS - attempts.count;
        return {
            success: false,
            error: `${passwordValidation.error}（残り${remaining}回）`
        };
    }

    // ログイン成功
    recordLoginAttempt(true);

    // セッショントークン生成
    const token = await generateSessionToken(email, schoolId);
    saveSession(token);

    return {
        success: true,
        session: {
            email: email,
            schoolId: schoolId
        }
    };
}

/**
 * ログアウト処理
 */
function logout() {
    clearSession();
}

/**
 * 認証状態チェック
 */
async function isAuthenticated() {
    const session = await getCurrentSession();
    return session !== null;
}

/**
 * 現在のユーザー情報を取得
 */
async function getCurrentUser() {
    return await getCurrentSession();
}

// ===================================
// エクスポート
// ===================================

window.WaseacaAuth = {
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    generateFAQToken,
    verifyFAQToken,
    isAccountLocked,
    getLockoutRemainingSeconds,
    // ユーザー環境設定
    saveCurrentUserPreferences,
    loadCurrentUserPreferences
};
