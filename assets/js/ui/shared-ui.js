/**
 * Shared UI Functions
 * Common navigation and utility functions used across pages.
 */

/**
 * Helper function to capture current grade/month from storage or URL
 * @returns {Object} - Object containing grade and month
 */
function captureGradeMonth() {
    let grade = '';
    let month = '';
    
    try {
        const saved = localStorage.getItem('studentData');
        if (saved) {
            const data = JSON.parse(saved);
            grade = data.grade || '';
            month = data.month || '';
        }
    } catch (e) {
        // Fallback to URL params
        const params = new URLSearchParams(window.location.search);
        grade = params.get('grade') || '';
        month = params.get('month') || '';
    }
    
    return { grade, month };
}

/**
 * Helper function to clear storage and navigate with preserved grade/month
 * @param {string} grade - Grade to preserve
 * @param {string} month - Month to preserve
 */
function clearAndNavigate(grade, month) {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Restore grade/month if they existed and navigate to student-information
    if (grade && month) {
        const preservedData = { grade: grade, month: month };
        localStorage.setItem('studentData', JSON.stringify(preservedData));
        console.log('🧹 Data cleared (Grade/Month preserved)');
        window.location.href = `student-information.html?grade=${grade}&month=${month}`;
    } else {
        // Full reset if no curriculum was selected
        console.log('🧹 All data cleared - starting fresh!');
        window.location.href = 'index.html';
    }
}

function goBack() {
    // Try to preserve grade/month in navigation
    const { grade, month } = captureGradeMonth();
    let url = 'student-information.html';
    if (grade && month) {
        url += `?grade=${encodeURIComponent(grade)}&month=${encodeURIComponent(month)}`;
    }
    window.location.href = url;
}

function startOver() {
    if (confirm('This will clear all data and start over. Are you sure?')) {
        const { grade, month } = captureGradeMonth();
        clearAndNavigate(grade, month);
    }
}

function refreshReport() {
    if (confirm('This will clear all current data and start over. Are you sure?')) {
        const { grade, month } = captureGradeMonth();
        clearAndNavigate(grade, month);
    }
}
