/**
 * Shared UI Functions
 * Common navigation and utility functions used across pages.
 */

function goBack() {
    // Try to preserve grade/month in navigation
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
        // fallback: try to get from current URL
        const params = new URLSearchParams(window.location.search);
        grade = params.get('grade') || '';
        month = params.get('month') || '';
    }
    let url = 'student-information.html';
    if (grade && month) {
        url += `?grade=${encodeURIComponent(grade)}&month=${encodeURIComponent(month)}`;
    }
    window.location.href = url;
}

function startOver() {
    if (confirm('This will clear all data and start over. Are you sure?')) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}

function refreshReport() {
    if (confirm('This will clear all current data and start over. Are you sure?')) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}
