// ===================================
// GLOBAL STATE
// ===================================

let currentSchool = null;

// ===================================
// PAGE NAVIGATION
// ===================================

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// ===================================
// ENTRANCE PAGE
// ===================================

function initEntrancePage() {
    const entrancePage = document.getElementById('entrancePage');

    entrancePage.addEventListener('click', () => {
        showPage('schoolSelectionPage');
    });
}

// ===================================
// SCHOOL SELECTION PAGE
// ===================================

function initSchoolSelection() {
    const schoolGrid = document.getElementById('schoolGrid');

    SCHOOLS.forEach(school => {
        const schoolCard = document.createElement('div');
        schoolCard.className = 'school-card';
        schoolCard.style.setProperty('--school-color', school.color);

        schoolCard.innerHTML = `
            <div class="school-icon">🏫</div>
            <div class="school-name">${school.nameJa}</div>
            <div class="school-name-sub">${school.nameEn}</div>
        `;

        schoolCard.addEventListener('click', () => {
            selectSchool(school);
        });

        schoolGrid.appendChild(schoolCard);
    });
}

function selectSchool(school) {
    currentSchool = school;

    // シンガポール校以外は認証不要で直接校舎ページへ
    if (!school.requiresAuth) {
        showSchoolPage();
        return;
    }

    // シンガポール校は認証チェック
    checkAuthenticationAndProceed();
}

// 認証チェックして進む
async function checkAuthenticationAndProceed() {
    const isAuth = await WaseacaAuth.isAuthenticated();

    if (isAuth) {
        // 既にログイン済み
        showSchoolPage();
    } else {
        // ログインページを表示
        showLoginPage();
    }
}

// ログインページを表示
function showLoginPage() {
    // Update login page with school info
    const schoolNameDisplay = document.getElementById('selectedSchoolName');
    schoolNameDisplay.textContent = currentSchool.nameJa;

    // Show login page
    showPage('loginPage');
}

// ===================================
// LOGIN PAGE
// ===================================

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const loginBackBtn = document.getElementById('loginBackBtn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // エラーメッセージをクリア
        clearLoginErrors();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // ローディング表示
        const submitBtn = loginForm.querySelector('.login-submit');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="btn-main">ログイン中...</span>';
        submitBtn.disabled = true;

        try {
            // ログイン試行
            const result = await WaseacaAuth.login(email, password, currentSchool.id);

            if (result.success) {
                // ログイン成功
                showSchoolPage();
                // フォームをリセット
                loginForm.reset();
            } else {
                // ログイン失敗
                showLoginError(result.error);
            }
        } catch (error) {
            console.error('Login error:', error);
            showLoginError('ログイン処理中にエラーが発生しました');
        } finally {
            // ローディング解除
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // Back button
    loginBackBtn.addEventListener('click', () => {
        currentSchool = null;
        clearLoginErrors();
        loginForm.reset();
        showPage('schoolSelectionPage');
    });
}

// ログインエラーを表示
function showLoginError(message) {
    // エラーメッセージ要素を作成または取得
    let errorDiv = document.querySelector('.login-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'login-error';
        const loginForm = document.getElementById('loginForm');
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// ログインエラーをクリア
function clearLoginErrors() {
    const errorDiv = document.querySelector('.login-error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
    }
}

// ===================================
// SCHOOL PAGE
// ===================================

function showSchoolPage() {
    if (!currentSchool) return;

    // Update school page content
    const schoolPageTitle = document.getElementById('schoolPageTitle');
    const schoolDescription = document.getElementById('schoolDescription');

    schoolPageTitle.textContent = currentSchool.nameJa;
    schoolDescription.textContent = currentSchool.description;

    // Show school page
    showPage('schoolPage');

    // ユーザー環境設定を復元（ログイン成功後）
    restoreUserPreferences();
}

function initSchoolPage() {
    const schoolBackBtn = document.getElementById('schoolBackBtn');
    const feeCheckLink = document.getElementById('feeCheckLink');
    const faqLink = document.getElementById('faqLink');

    // Logout button
    schoolBackBtn.addEventListener('click', async () => {
        // ログアウト処理
        WaseacaAuth.logout();
        currentSchool = null;
        showPage('entrancePage');
    });

    // Fee check link
    feeCheckLink.addEventListener('click', () => {
        showPage('feeCheckPage');
    });

    // FAQ link - 認証トークンを付与
    faqLink.addEventListener('click', async (e) => {
        // currentSchoolが認証必須の場合のみトークンを付与
        if (currentSchool && currentSchool.requiresAuth) {
            e.preventDefault(); // デフォルトのリンク動作を停止

            try {
                // FAQ用トークンを生成
                const user = await WaseacaAuth.getCurrentUser();
                if (user) {
                    const token = await WaseacaAuth.generateFAQToken(user.email, user.schoolId);
                    const faqUrl = `https://waseaca-faq.pages.dev/?authToken=${token}&mode=teacher`;

                    // 新しいタブで開く
                    window.open(faqUrl, '_blank');
                } else {
                    // セッションが切れている場合はログインページへ
                    showPage('loginPage');
                }
            } catch (error) {
                console.error('Failed to generate FAQ token:', error);
                // エラー時は通常のリンクとして開く
                window.open('https://waseaca-faq.pages.dev/', '_blank');
            }
        }
        // 認証不要の校舎の場合はデフォルトのリンク動作（通常モード）
    });
}

// ===================================
// FEE CHECK PAGE
// ===================================

function initFeeCheckPage() {
    const feeBackBtn = document.getElementById('feeBackBtn');
    const feeCheckForm = document.getElementById('feeCheckForm');
    const feeResult = document.getElementById('feeResult');
    const feeAmount = document.getElementById('feeAmount');

    // Back button
    feeBackBtn.addEventListener('click', () => {
        showPage('schoolPage');
        feeResult.style.display = 'none';
        feeCheckForm.reset();
    });

    // Form submission
    feeCheckForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Calculate dummy fee based on selections
        const formData = new FormData(feeCheckForm);
        let baseFee = 50000;

        // Add for subjects
        const subjects = formData.getAll('subject');
        baseFee += subjects.length * 15000;

        // Add for bus
        if (formData.get('bus') === 'yes') {
            baseFee += 10000;
        }

        // Discount for siblings
        if (formData.get('siblings') === 'yes') {
            baseFee *= 0.9; // 10% discount
        }

        // Show result
        feeAmount.textContent = `¥${baseFee.toLocaleString()}`;
        feeResult.style.display = 'block';

        // Scroll to result
        feeResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// ===================================
// THEME CONTROLS
// ===================================

function initThemeControls() {
    const themeToggle = document.getElementById('themeToggle');
    const seasonSelect = document.getElementById('seasonSelect');
    const body = document.body;

    // Theme toggle
    themeToggle.addEventListener('click', async () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);

        // Update animation colors
        if (window.updateAnimationTheme) {
            window.updateAnimationTheme(newTheme);
        }

        // ユーザー環境設定を保存
        await saveUserPreferencesToStorage();
    });

    // Season select
    seasonSelect.addEventListener('change', async (e) => {
        const season = e.target.value;
        body.setAttribute('data-season', season);

        // Update animation season
        if (window.updateAnimationSeason) {
            window.updateAnimationSeason(season);
        }

        // ユーザー環境設定を保存
        await saveUserPreferencesToStorage();
    });
}

// ユーザー環境設定を保存
async function saveUserPreferencesToStorage() {
    const body = document.body;
    const preferences = {
        theme: body.getAttribute('data-theme'),
        season: body.getAttribute('data-season')
    };

    await WaseacaAuth.saveCurrentUserPreferences(preferences);
}

// ユーザー環境設定を復元
async function restoreUserPreferences() {
    const preferences = await WaseacaAuth.loadCurrentUserPreferences();

    if (preferences) {
        const body = document.body;

        // テーマを復元
        if (preferences.theme) {
            body.setAttribute('data-theme', preferences.theme);
            if (window.updateAnimationTheme) {
                window.updateAnimationTheme(preferences.theme);
            }
        }

        // 季節を復元
        if (preferences.season) {
            body.setAttribute('data-season', preferences.season);
            const seasonSelect = document.getElementById('seasonSelect');
            if (seasonSelect) {
                seasonSelect.value = preferences.season;
            }
            if (window.updateAnimationSeason) {
                window.updateAnimationSeason(preferences.season);
            }
        }
    }
}

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', async () => {
    initEntrancePage();
    initSchoolSelection();
    initLoginPage();
    initSchoolPage();
    initFeeCheckPage();
    initThemeControls();

    // Initialize animations
    if (window.initAnimations) {
        window.initAnimations();
    }

    // 自動ログインチェック
    await checkAutoLogin();

    // ユーザー環境設定を復元（ログイン済みの場合）
    if (currentSchool) {
        await restoreUserPreferences();
    }

    // Show entrance page by default (unless auto-login succeeded)
    if (!currentSchool) {
        showPage('entrancePage');
    }
});

// 自動ログイン処理
async function checkAutoLogin() {
    try {
        const user = await WaseacaAuth.getCurrentUser();
        if (user) {
            // セッションが有効な場合、対応する校舎を設定
            const school = SCHOOLS.find(s => s.id === user.schoolId);
            if (school && school.requiresAuth) {
                currentSchool = school;
                showSchoolPage();
            }
        }
    } catch (error) {
        console.error('Auto-login check failed:', error);
    }
}
