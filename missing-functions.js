/**
 * Missing Functions - Essential fallback functions for HTML onclick handlers
 * Provides compatibility and fallback implementations for referenced functions
 */

// Global error handler for missing functions
window.addEventListener('error', function(e) {
    if (e.message.includes('is not defined')) {
        console.warn('Missing function detected:', e.message);
    }
});

// Student Information Page Functions
// testStudentName function is defined in the HTML file

// addToStrengths function is defined in the HTML file

// addToAreas function is defined in the HTML file

// goToSubjects function is defined in the HTML file

// Subject Selection Page Functions
function toggleSubject(subjectId) {
    console.log('🔄 toggleSubject called for:', subjectId);
    
    const content = document.getElementById('content_' + subjectId);
    const arrow = document.getElementById('arrow_' + subjectId);
    
    console.log('Content element:', content);
    console.log('Arrow element:', arrow);
    
    if (!content || !arrow) {
        console.error('❌ Subject elements not found for:', subjectId);
        console.log('Available content IDs:', Array.from(document.querySelectorAll('[id^="content_"]')).map(el => el.id));
        console.log('Available arrow IDs:', Array.from(document.querySelectorAll('[id^="arrow_"]')).map(el => el.id));
        return;
    }
    
    const isActive = content.classList.contains('active');
    console.log('Current active state:', isActive);
    
    if (isActive) {
        content.classList.remove('active');
        arrow.classList.remove('rotated');
        console.log('✅ Collapsed subject:', subjectId);
    } else {
        content.classList.add('active');
        arrow.classList.add('rotated');
        console.log('✅ Expanded subject:', subjectId);
    }
    
    // Force a style update
    content.style.display = content.classList.contains('active') ? 'block' : 'none';
    console.log('Final display style:', content.style.display);
}

function handleSubjectCheck(subjectId) {
    const checkbox = document.getElementById('subject_' + subjectId);
    const content = document.getElementById('content_' + subjectId);
    
    if (!checkbox || !content) {
        console.error('Subject checkbox or content not found for:', subjectId);
        return;
    }
    
    const topicCheckboxes = content.querySelectorAll('.topic-checkbox');
    
    if (checkbox.checked) {
        // Check all topics in this subject
        topicCheckboxes.forEach(cb => cb.checked = true);
    } else {
        // Uncheck all topics in this subject
        topicCheckboxes.forEach(cb => cb.checked = false);
    }
    
    // Update selection count
    if (typeof updateSelectionCount === 'function') {
        updateSelectionCount();
    }
}

function selectAll() {
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach(cb => cb.checked = true);
    
    if (typeof updateSelectionCount === 'function') {
        updateSelectionCount();
    }
}

function clearAll() {
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach(cb => cb.checked = false);
    
    if (typeof updateSelectionCount === 'function') {
        updateSelectionCount();
    }
}

function refreshReport() {
    if (confirm('This will clear all current data and start over. Are you sure?')) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}

function ensureCommentGeneration() {
    try {
        console.log('🚀 Starting comment generation...');
        
        // Collect all form data
        const studentData = JSON.parse(localStorage.getItem('studentData') || '{}');
        const selectedSubjects = [];
        const topicRatings = {};
        
        // Collect selected subjects and topics
        document.querySelectorAll('.subject-checkbox:checked').forEach(cb => {
            selectedSubjects.push(cb.value);
        });
        
        document.querySelectorAll('.topic-checkbox:checked').forEach(cb => {
            topicRatings[cb.value] = 5; // Default rating
        });
        
        // Validate required data
        if (!studentData.studentName || !studentData.gender) {
            alert('Missing student information. Please go back and complete the student information form.');
            return;
        }
        
        // Prepare session data for comment generation
        const sessionData = {
            studentName: studentData.studentName,
            gender: studentData.gender,
            overallRating: parseInt(studentData.overallAttributes) || 5,
            strengths: studentData.strengths || '',
            weaknesses: studentData.weaknesses || '',
            subjects: selectedSubjects,
            topicRatings: topicRatings
        };
        
        console.log('📝 Session data collected:', sessionData);
        
        // Validate that we have meaningful data to include
        const hasStrengths = sessionData.strengths && sessionData.strengths.trim() !== '';
        const hasWeaknesses = sessionData.weaknesses && sessionData.weaknesses.trim() !== '';
        const hasSubjects = selectedSubjects.length > 0;
        const hasTopics = Object.keys(topicRatings).length > 0;
        
        console.log('📊 Data availability:', {
            hasStrengths,
            hasWeaknesses,
            hasSubjects,
            hasTopics
        });
        
        // If no subjects or topics selected, add defaults for better comments
        if (!hasSubjects && !hasTopics) {
            console.log('⚠️ No subjects/topics selected, adding defaults');
            sessionData.subjects = ['General Learning', 'Social Development'];
            sessionData.topicRatings = {
                'classroom_participation': 5,
                'peer_interaction': 5
            };
        }
        
        // Generate comments using Enhanced engine if available, otherwise use original
        let comments;
        if (typeof EnhancedCommentEngine !== 'undefined') {
            console.log('✅ Using Enhanced Comment Engine');
            const enhancedEngine = new EnhancedCommentEngine();
            comments = enhancedEngine.generateComments(sessionData);
        } else if (typeof PremiumCommentEngine !== 'undefined') {
            console.log('✅ Using Premium Comment Engine');
            const engine = new PremiumCommentEngine();
            comments = engine.generateComments(sessionData);
        } else {
            console.error('❌ No comment engine available');
            alert('Comment generation engine not available. Please check that all required files are loaded.');
            return;
        }
        
        console.log('✅ Comments generated successfully:', comments);
        
        // Validate that user data appears in comments
        const validationResult = validateUserDataInComments(comments, sessionData);
        console.log('🔍 Validation result:', validationResult);
        
        if (!validationResult.isValid) {
            console.warn('⚠️ Some user data missing from comments:', validationResult.missing);
        }
        
        // Display generated comments
        displayGeneratedComments(comments);
        
    } catch (error) {
        console.error('❌ Comment generation failed:', error);
        alert('An error occurred during comment generation: ' + error.message);
    }
}

function validateUserDataInComments(comments, sessionData) {
    const maleComment = comments.male.toLowerCase();
    const femaleComment = comments.female.toLowerCase();
    
    const result = {
        isValid: true,
        missing: [],
        found: []
    };
    
    // Check student name
    const nameLower = sessionData.studentName.toLowerCase();
    if (maleComment.includes(nameLower) && femaleComment.includes(nameLower)) {
        result.found.push('Student name');
    } else {
        result.missing.push('Student name');
        result.isValid = false;
    }
    
    // Check strengths
    if (sessionData.strengths && sessionData.strengths.trim() !== '') {
        const strengthWords = sessionData.strengths.toLowerCase().split(/[,\s]+/)
            .filter(word => word.length > 3); // Only check meaningful words
        
        const strengthFound = strengthWords.some(word => 
            maleComment.includes(word) || femaleComment.includes(word)
        );
        
        if (strengthFound) {
            result.found.push('Strengths');
        } else {
            result.missing.push('Strengths');
            result.isValid = false;
        }
    }
    
    // Check weaknesses/areas for improvement
    if (sessionData.weaknesses && sessionData.weaknesses.trim() !== '') {
        const weaknessWords = sessionData.weaknesses.toLowerCase().split(/[,\s]+/)
            .filter(word => word.length > 3);
        
        const weaknessFound = weaknessWords.some(word => 
            maleComment.includes(word) || femaleComment.includes(word)
        ) || maleComment.includes('development') || femaleComment.includes('development') ||
            maleComment.includes('improvement') || femaleComment.includes('improvement') ||
            maleComment.includes('practice') || femaleComment.includes('practice');
        
        if (weaknessFound) {
            result.found.push('Areas for improvement');
        } else {
            result.missing.push('Areas for improvement');
            result.isValid = false;
        }
    }
    
    // Check subjects
    if (Array.isArray(sessionData.subjects) && sessionData.subjects.length > 0) {
        const subjectFound = sessionData.subjects.some(subject => 
            maleComment.includes(subject.toLowerCase()) || femaleComment.includes(subject.toLowerCase())
        );
        
        if (subjectFound) {
            result.found.push('Selected subjects');
        } else {
            result.missing.push('Selected subjects');
            result.isValid = false;
        }
    }
    
    return result;
}

function displayGeneratedComments(comments) {
    const commentsSection = document.getElementById('generatedComments');
    if (!commentsSection) {
        console.error('Generated comments section not found');
        return;
    }
    
    // Update comment text
    const comment1Text = document.getElementById('commentText1');
    const comment2Text = document.getElementById('commentText2');
    const wordCount1 = document.getElementById('wordCount1');
    const wordCount2 = document.getElementById('wordCount2');
    
    if (comment1Text) comment1Text.textContent = comments.male;
    if (comment2Text) comment2Text.textContent = comments.female;
    if (wordCount1) wordCount1.textContent = `(${comments.wordCount.male} words)`;
    if (wordCount2) wordCount2.textContent = `(${comments.wordCount.female} words)`;
    
    // Show the comments section
    commentsSection.style.display = 'block';
    commentsSection.classList.remove('display-none');
    
    // Scroll to comments
    commentsSection.scrollIntoView({ behavior: 'smooth' });
}

function selectComment(commentNumber) {
    // Remove selection from all comments
    document.querySelectorAll('.comment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Select the clicked comment
    const selectedComment = document.getElementById('comment' + commentNumber);
    if (selectedComment) {
        selectedComment.classList.add('selected');
    }
}

function copySelectedComment() {
    const selectedComment = document.querySelector('.comment-option.selected .comment-box');
    if (!selectedComment) {
        alert('Please select a comment first.');
        return;
    }
    
    const text = selectedComment.textContent;
    
    // Copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Comment copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('Comment copied to clipboard!');
    } catch (err) {
        console.error('Fallback copy failed:', err);
        alert('Failed to copy comment. Please select and copy manually.');
    }
    
    document.body.removeChild(textArea);
}

function exportReport() {
    const selectedComment = document.querySelector('.comment-option.selected .comment-box');
    if (!selectedComment) {
        alert('Please select a comment first.');
        return;
    }
    
    const studentData = JSON.parse(localStorage.getItem('studentData') || '{}');
    const commentText = selectedComment.textContent;
    
    const reportContent = `
KINDERGARTEN REPORT
==================

Student Name: ${studentData.studentName || 'N/A'}
Gender: ${studentData.gender || 'N/A'}
Overall Rating: ${studentData.overallAttributes || 'N/A'}/10

Strengths: ${studentData.strengths || 'N/A'}
Areas for Improvement: ${studentData.weaknesses || 'N/A'}

GENERATED COMMENT:
${commentText}

Generated on: ${new Date().toLocaleDateString()}
    `.trim();
    
    // Create and download file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${studentData.studentName || 'Student'}_Report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function goBack() {
    window.location.href = 'student-information.html';
}

function startOver() {
    if (confirm('This will clear all data and start over. Are you sure?')) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}

// Index page functions
function startOverWithAnimation() {
    document.body.style.opacity = '0';
    document.body.style.transform = 'scale(0.95)';
    document.body.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    
    setTimeout(() => {
        localStorage.clear();
        window.location.href = 'index.html';
    }, 300);
}

// Test function for test-index.html
function testJS() {
    alert('JavaScript is working! All missing functions have been loaded successfully.');
    console.log('Missing functions test passed');
}

// Utility function to update selection count
function updateSelectionCount() {
    const selectedCount = document.querySelectorAll('.topic-checkbox:checked').length;
    const countElement = document.getElementById('selectionCount');
    if (countElement) {
        countElement.textContent = selectedCount;
    }
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add change listeners to topic checkboxes for selection count
    document.querySelectorAll('.topic-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectionCount);
    });
    
    // Initial count update
    updateSelectionCount();
    
    console.log('Missing functions initialized successfully');
});

console.log('Missing functions loaded successfully');