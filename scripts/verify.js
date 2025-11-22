const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COLORS = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m'
};

function log(type, message) {
    const color = type === 'error' ? COLORS.red : (type === 'success' ? COLORS.green : COLORS.yellow);
    console.log(`${color}[${type.toUpperCase()}] ${message}${COLORS.reset}`);
}

let hasError = false;

// 1. Check File Synchronization
const rootEnginePath = path.join(__dirname, '..', 'enhanced-comment-engine.js');
const assetsEnginePath = path.join(__dirname, '..', 'assets', 'js', 'enhanced-comment-engine.js');

if (fs.existsSync(rootEnginePath) && fs.existsSync(assetsEnginePath)) {
    const rootContent = fs.readFileSync(rootEnginePath, 'utf8');
    const assetsContent = fs.readFileSync(assetsEnginePath, 'utf8');

    if (rootContent !== assetsContent) {
        log('error', 'File Sync Mismatch: "enhanced-comment-engine.js" in root does not match "assets/js/enhanced-comment-engine.js".');
        log('info', 'Run: Copy-Item "assets/js/enhanced-comment-engine.js" "enhanced-comment-engine.js" -Force');
        hasError = true;
    } else {
        log('success', 'Engine files are in sync.');
    }
} else {
    log('error', 'Missing critical engine files.');
    hasError = true;
}

// 2. Check for Forbidden Hardcoded Curriculum in Templates
// We want to avoid "K1", "K2", "August", "November" in the generation logic, 
// but they are allowed in the configuration maps.
// This is a heuristic check.
const forbiddenPatterns = [
    { pattern: /return `.*(K1|K2|August|November).*`/g, message: 'Potential hardcoded grade/month in template return string' },
    { pattern: /const opening = \".*(K1|K2|August|November).*\"/g, message: 'Potential hardcoded grade/month in opening variable' }
];

if (fs.existsSync(assetsEnginePath)) {
    const content = fs.readFileSync(assetsEnginePath, 'utf8');
    forbiddenPatterns.forEach(({ pattern, message }) => {
        if (pattern.test(content)) {
            log('warn', `${message} detected in enhanced-comment-engine.js. Verify this is intentional.`);
            // Warning only, not error, as it might be a false positive
        }
    });
}

// 3. Check Documentation Existence
const requiredDocs = [
    'docs/PROJECT_STATUS.md',
    'docs/jobcard.md',
    '.github/copilot-instructions.md'
];

requiredDocs.forEach(doc => {
    if (!fs.existsSync(path.join(__dirname, '..', doc))) {
        log('error', `Missing documentation file: ${doc}`);
        hasError = true;
    }
});

// 4. Check for "console.log" in production files (optional, but good practice)
// We'll just warn
const jsFilesToCheck = [
    'assets/js/enhanced-comment-engine.js',
    'assets/js/synonym-manager.js'
];

jsFilesToCheck.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('console.log')) {
            log('warn', `Console.log detected in ${file}. Ensure this is for debugging only.`);
        }
    }
});

// 5. Run ESLint
try {
    log('info', 'Running ESLint...');
    execSync('npx eslint .', { stdio: 'inherit' });
    log('success', 'ESLint passed.');
} catch (error) {
    log('error', 'ESLint failed. Please fix linting errors.');
    hasError = true;
}

if (hasError) {
    console.log('\n' + COLORS.red + 'Verification FAILED. Please fix the errors above before committing.' + COLORS.reset);
    process.exit(1);
} else {
    console.log('\n' + COLORS.green + 'Verification PASSED. You are good to commit!' + COLORS.reset);
    process.exit(0);
}
