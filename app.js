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

    // Update login page with school info
    const schoolNameDisplay = document.getElementById('selectedSchoolName');
    schoolNameDisplay.textContent = school.nameJa;

    // Show login page
    showPage('loginPage');
}

// ===================================
// LOGIN PAGE
// ===================================

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const loginBackBtn = document.getElementById('loginBackBtn');

    // Form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Test mode - allow login without validation
        showSchoolPage();
    });

    // Back button
    loginBackBtn.addEventListener('click', () => {
        showPage('schoolSelectionPage');
    });
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
}

function initSchoolPage() {
    const schoolBackBtn = document.getElementById('schoolBackBtn');
    const feeCheckLink = document.getElementById('feeCheckLink');

    // Logout button
    schoolBackBtn.addEventListener('click', () => {
        currentSchool = null;
        showPage('entrancePage');
    });

    // Fee check link
    feeCheckLink.addEventListener('click', () => {
        showPage('feeCheckPage');
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
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);

        // Update animation colors
        if (window.updateAnimationTheme) {
            window.updateAnimationTheme(newTheme);
        }
    });

    // Season select
    seasonSelect.addEventListener('change', (e) => {
        const season = e.target.value;
        body.setAttribute('data-season', season);

        // Update animation season
        if (window.updateAnimationSeason) {
            window.updateAnimationSeason(season);
        }
    });
}

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
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

    // Show entrance page by default
    showPage('entrancePage');
});
