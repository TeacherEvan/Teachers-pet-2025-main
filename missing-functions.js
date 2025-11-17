/**
 * Missing Functions - Essential fallback functions for HTML onclick handlers
 * Provides compatibility and fallback implementations for referenced functions
 */

// Global error handler for missing functions
window.addEventListener('error', function (e) {
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

function refreshReport() {
    if (confirm('This will clear all current data and start over. Are you sure?')) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}

/**
 * Infer parent subjects from selected topics
 * This ensures that if a user only checks topics without checking the parent subject,
 * the parent subject is still included in the comment
 */
function inferSubjectsFromTopics(topicRatings, selectedSubjects) {
    // Map of keywords to subjects (matches the subjectTopicMap in enhanced-comment-engine.js)
    const topicToSubjectMap = {
        // Expanded to mirror EnhancedCommentEngine.subjectTopicMap
        "English": [
            "draw lines", "trace", "match", "circle", "letter", "alphabet", "phonics",
            "nancy", "nurse", "nose", "oscar", "octopus", "on",
            "penny", "panda", "pen", "queenie", "quick", "quiet",
            "rev", "n/o/p", "n o p"
        ],
        "Mathematics": ["count", "number", "match", "trace", "dotted"],
        "I.Q": ["color", "same", "fatter", "taller", "hot", "cold", "shape"],
        "Social Studies": ["identify", "animal", "sounds", "habits", "hygiene", "gestures"],
        "Science": ["tissue", "lava", "magnet", "volcano", "experiment"],
        "Cooking": ["look chop", "sugar", "bean", "salt", "coconut"],
        "Conversation 1": ["pet", "feel", "lunch", "want to be", "like to go"],
        "Conversation 2": ["drink", "going", "school"],
        // Added for K1 November
        "Conversation 3": [
            "food", "eat", "rice", "colors", "color", "yellow", "purple", "green", "orange",
            "daily routines", "wake", "take a shower", "sleep", "go to sleep", "morning"
        ],
        "Arts": ["finger painting", "ladybug", "play dough", "sponge", "origami"],
        "Physical Education": ["football", "balance", "ball", "ring", "jump", "zigzag", "hurdle"],
        "Puppet Show": ["noond", "vegetables", "panicked rabbit"],
        "Super Safari": ["listen", "colour", "numbers", "circle", "pets", "food", "maze", "train", "mask"],
        "Story Time": ["harry frog", "bird", "lovely animals", "ox and the frog"]
    };

    const topicList = Object.keys(topicRatings);
    const inferredSubjects = new Set();

    topicList.forEach(topic => {
        const topicLower = topic.toLowerCase();

        // Try to match topic with subject using keywords
        for (const [subject, keywords] of Object.entries(topicToSubjectMap)) {
            if (keywords.some(keyword => topicLower.includes(keyword.toLowerCase()))) {
                inferredSubjects.add(subject);
                break;
            }
        }

        // Try direct subject name matching
        for (const subject of Object.keys(topicToSubjectMap)) {
            if (topicLower.includes(subject.toLowerCase())) {
                inferredSubjects.add(subject);
                break;
            }
        }
    });

    // Add inferred subjects to selectedSubjects if not already present
    inferredSubjects.forEach(subject => {
        if (!selectedSubjects.some(s => s.toLowerCase() === subject.toLowerCase())) {
            console.log('✅ Inferred subject from topic:', subject);
            selectedSubjects.push(subject);
        }
    });

    console.log('📋 Final subjects after inference:', selectedSubjects);
}

function ensureCommentGeneration() {
    try {
        console.log('🚀 Starting comment generation...');

        // Collect all form data with robust retrieval and diagnostics
        const safeParse = (val) => {
            try { return JSON.parse(val || '{}'); } catch { return {}; }
        };

        let studentData = safeParse(localStorage.getItem('studentData'));
        // If required fields are missing, try to recover from sessionStorage (navigation fallback)
        if (!studentData.studentName || !studentData.gender) {
            const ssData = safeParse(sessionStorage.getItem('studentData'));
            if (ssData.studentName && ssData.gender) {
                console.warn('ℹ️ Restoring studentData from sessionStorage fallback');
                studentData = ssData;
                try { localStorage.setItem('studentData', JSON.stringify(ssData)); } catch { }
            }
        }

        console.log('📦 Retrieved studentData:', studentData);
        const selectedSubjects = [];
        const topicRatings = {};

        // Collect selected subjects and topics - STRICT: only what user actually checked
        document.querySelectorAll('.subject-checkbox:checked').forEach(cb => {
            if (cb.value && cb.value.trim() !== '') {
                console.log('✅ Found checked subject checkbox:', cb.id, '→ value:', cb.value);
                selectedSubjects.push(cb.value);
            } else {
                console.warn('⚠️ Subject checkbox checked but has no value:', cb.id, cb);
            }
        });

        console.log('📋 Total subject checkboxes found:', document.querySelectorAll('.subject-checkbox').length);
        console.log('📋 Total CHECKED subject checkboxes:', document.querySelectorAll('.subject-checkbox:checked').length);
        console.log('📋 Selected subjects array:', selectedSubjects);

        document.querySelectorAll('.topic-checkbox:checked').forEach(cb => {
            if (cb.value && cb.value.trim() !== '') {
                console.log('✅ Found checked topic checkbox:', cb.id, '→ value:', cb.value);
                topicRatings[cb.value] = 5; // Default rating
            } else {
                console.warn('⚠️ Topic checkbox checked but has no value:', cb.id, cb);
            }
        });

        console.log('📋 Total topic checkboxes found:', document.querySelectorAll('.topic-checkbox').length);
        console.log('📋 Total CHECKED topic checkboxes:', document.querySelectorAll('.topic-checkbox:checked').length);
        console.log('📋 Topic ratings object:', topicRatings);

        // Infer parent subjects from selected topics if not already in selectedSubjects
        // This handles the case where users only check topics without checking the parent subject
        inferSubjectsFromTopics(topicRatings, selectedSubjects);

        // Validate required data with clearer diagnostics
        if (!studentData.studentName || !studentData.gender) {
            console.error('❌ Student data missing or incomplete', {
                hasName: !!studentData.studentName,
                hasGender: !!studentData.gender,
                localStorageKeys: Object.keys(localStorage || {})
            });
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

        // STRICT: Do NOT inject fake subjects/topics - only use what teacher actually selected
        if (!hasSubjects && !hasTopics) {
            console.warn('⚠️ No subjects/topics selected by teacher');
            alert('Please select at least one subject or topic before generating comments.');
            return;
        }

        // Generate comments using Enhanced engine (now async)
        (async () => {
            let comments;
            if (typeof EnhancedCommentEngine !== 'undefined') {
                console.log('✅ Using Enhanced Comment Engine');
                const enhancedEngine = new EnhancedCommentEngine();
                comments = await enhancedEngine.generateComments(sessionData);
            } else if (typeof PremiumCommentEngine !== 'undefined') {
                console.log('✅ Using Premium Comment Engine');
                const engine = new PremiumCommentEngine();
                comments = await engine.generateComments(sessionData);
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

        })().catch(error => {
            console.error('❌ Async comment generation failed:', error);
            alert('An error occurred during comment generation: ' + error.message);
        });

    } catch (error) {
        console.error('❌ Comment generation setup failed:', error);
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
document.addEventListener('DOMContentLoaded', function () {
    // Add change listeners to topic checkboxes for selection count
    document.querySelectorAll('.topic-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectionCount);
    });

    // Initial count update
    updateSelectionCount();

    console.log('Missing functions initialized successfully');
});

console.log('Missing functions loaded successfully');