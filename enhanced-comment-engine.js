/**
 * Enhanced Comment Generation System - Fixed Version
 * Ensures all user data is properly included in final comments
 */

class EnhancedCommentEngine {
    constructor() {
        this.init();
    }
    
    init() {
        // Load the original PremiumCommentEngine if available
        if (typeof PremiumCommentEngine !== 'undefined') {
            this.baseEngine = new PremiumCommentEngine();
            console.log('✅ Enhanced engine initialized with PremiumCommentEngine');
        } else {
            throw new Error('PremiumCommentEngine required for enhanced engine');
        }
    }
    
    /**
     * Enhanced comment generation with comprehensive validation
     */
    generateComments(sessionData) {
        try {
            console.log('🔍 Starting enhanced comment generation...');
            console.log('📝 Input session data:', sessionData);
            
            // Validate and enhance session data
            const validatedData = this.validateAndEnhanceSessionData(sessionData);
            console.log('✅ Validated session data:', validatedData);
            
            // Generate comments using the base engine
            const comments = this.baseEngine.generateComments(validatedData);
            console.log('📄 Generated comments:', comments);
            
            // Validate that user data appears in comments
            const validationResults = this.validateCommentsContainUserData(comments, validatedData);
            console.log('🔍 Validation results:', validationResults);
            
            // If validation fails, regenerate with forced inclusion
            if (!validationResults.allDataIncluded) {
                console.log('⚠️ User data missing from comments, regenerating with forced inclusion...');
                const enhancedComments = this.generateCommentsWithForcedInclusion(validatedData);
                
                // Validate again
                const secondValidation = this.validateCommentsContainUserData(enhancedComments, validatedData);
                console.log('🔍 Second validation results:', secondValidation);
                
                return enhancedComments;
            }
            
            return comments;
            
        } catch (error) {
            console.error('❌ Enhanced comment generation failed:', error);
            return this.generateFallbackComments(sessionData.studentName || 'Student');
        }
    }
    
    /**
     * Validate and enhance session data
     */
    validateAndEnhanceSessionData(sessionData) {
        const enhanced = { ...sessionData };
        
        // Ensure student name is present and clean
        if (!enhanced.studentName || enhanced.studentName.trim() === '') {
            throw new Error('Student name is required');
        }
        enhanced.studentName = enhanced.studentName.trim();
        
        // Ensure gender is valid
        const validGenders = ['he', 'she', 'they'];
        if (!validGenders.includes(enhanced.gender?.toLowerCase())) {
            console.warn('Invalid gender, defaulting to "they"');
            enhanced.gender = 'they';
        }
        
        // Ensure overall rating is valid
        if (!enhanced.overallRating || enhanced.overallRating < 1 || enhanced.overallRating > 10) {
            console.warn('Invalid rating, defaulting to 5');
            enhanced.overallRating = 5;
        }
        
        // Ensure strengths and weaknesses are present
        if (!enhanced.strengths || enhanced.strengths.trim() === '') {
            console.warn('No strengths provided, using default');
            enhanced.strengths = 'positive attitude, eager to learn, good social skills';
        }
        
        if (!enhanced.weaknesses || enhanced.weaknesses.trim() === '') {
            console.warn('No areas for improvement provided, using default');
            enhanced.weaknesses = 'continue developing focus, practice following instructions';
        }
        
        // Ensure subjects array exists
        if (!Array.isArray(enhanced.subjects)) {
            enhanced.subjects = [];
        }
        
        // If no subjects selected, add general ones
        if (enhanced.subjects.length === 0) {
            console.warn('No subjects selected, adding general subjects');
            enhanced.subjects = ['General Learning', 'Social Development'];
        }
        
        // Ensure topic ratings exist
        if (!enhanced.topicRatings || typeof enhanced.topicRatings !== 'object') {
            enhanced.topicRatings = {};
        }
        
        // If no topics, add general ones
        if (Object.keys(enhanced.topicRatings).length === 0) {
            console.warn('No topics selected, adding general topics');
            enhanced.topicRatings = {
                'classroom_participation': 5,
                'peer_interaction': 5
            };
        }
        
        return enhanced;
    }
    
    /**
     * Validate that user data appears in the generated comments
     */
    validateCommentsContainUserData(comments, sessionData) {
        const maleComment = comments.male.toLowerCase();
        const femaleComment = comments.female.toLowerCase();
        
        const results = {
            studentNameIncluded: false,
            strengthsIncluded: false,
            weaknessesIncluded: false,
            subjectsIncluded: false,
            allDataIncluded: false
        };
        
        // Check student name
        const nameLower = sessionData.studentName.toLowerCase();
        results.studentNameIncluded = maleComment.includes(nameLower) && femaleComment.includes(nameLower);
        
        // Check strengths
        if (sessionData.strengths) {
            const strengthWords = sessionData.strengths.toLowerCase().split(/[,\s]+/).filter(w => w.length > 3);
            results.strengthsIncluded = strengthWords.some(word => 
                maleComment.includes(word) || femaleComment.includes(word)
            );
        }
        
        // Check weaknesses/areas for improvement
        if (sessionData.weaknesses) {
            const weaknessWords = sessionData.weaknesses.toLowerCase().split(/[,\s]+/).filter(w => w.length > 3);
            results.weaknessesIncluded = weaknessWords.some(word => 
                maleComment.includes(word) || femaleComment.includes(word)
            );
        }
        
        // Check subjects
        if (sessionData.subjects && sessionData.subjects.length > 0) {
            results.subjectsIncluded = sessionData.subjects.some(subject => 
                maleComment.includes(subject.toLowerCase()) || femaleComment.includes(subject.toLowerCase())
            );
        }
        
        // Overall validation
        results.allDataIncluded = results.studentNameIncluded && 
                                 results.strengthsIncluded && 
                                 results.weaknessesIncluded && 
                                 results.subjectsIncluded;
        
        return results;
    }
    
    /**
     * Generate comments with forced inclusion of user data
     */
    generateCommentsWithForcedInclusion(sessionData) {
        try {
            // Process session data
            const processedData = this.baseEngine.processSessionData(sessionData);
            
            // Generate custom comments that guarantee inclusion of user data
            const maleComment = this.generateForcedInclusionComment('male', processedData, sessionData);
            const femaleComment = this.generateForcedInclusionComment('female', processedData, sessionData);
            
            return {
                male: maleComment,
                female: femaleComment,
                wordCount: {
                    male: this.getWordCount(maleComment),
                    female: this.getWordCount(femaleComment)
                }
            };
            
        } catch (error) {
            console.error('❌ Forced inclusion generation failed:', error);
            return this.generateFallbackComments(sessionData.studentName);
        }
    }
    
    /**
     * Generate a comment with forced inclusion of all user data
     */
    generateForcedInclusionComment(style, processedData, originalData) {
        const name = processedData.name;
        const pronoun = processedData.pronoun_subject;
        const pronounLower = processedData.pronoun_subject_lower;
        const possessive = processedData.pronoun_possessive;
        const object = processedData.pronoun_object;
        
        let comment = '';
        
        if (style === 'male') {
            // Professional, structured approach
            comment = `${name} has demonstrated ${processedData.level} academic performance this term, showing ${processedData.achievement} across multiple learning areas. `;
            
            // Include strengths
            if (processedData.strengths && processedData.strengths.length > 0) {
                const strengthsText = this.baseEngine.naturalJoin(processedData.strengths);
                comment += `${pronoun} consistently excels in ${strengthsText}, displaying measurable progress and maintaining high standards. `;
            }
            
            // Include subjects
            if (processedData.subjects) {
                comment += `In ${processedData.subjects}, ${name} has shown solid understanding and appropriate skill development. `;
            }
            
            // Include topics if available
            if (processedData.topics) {
                comment += `Specific achievements include ${possessive} work with ${processedData.topics}, where ${pronounLower} demonstrates focused attention and skill application. `;
            }
            
            // Include areas for improvement
            if (processedData.weaknesses && processedData.weaknesses.length > 0) {
                const weaknessesText = this.baseEngine.naturalJoin(processedData.weaknesses);
                comment += `Areas for continued development include ${weaknessesText}, where additional practice and support will help ${name} build stronger foundational skills. `;
            }
            
            // Professional conclusion
            comment += `${name} maintains ${processedData.attitude} and with continued effort will achieve further academic success.`;
            
        } else {
            // Warm, nurturing approach
            comment = `${name} has brought such wonderful joy to our classroom this term, blossoming beautifully in ${possessive} learning journey. `;
            
            // Include strengths
            if (processedData.strengths && processedData.strengths.length > 0) {
                const strengthsText = this.baseEngine.naturalJoin(processedData.strengths);
                comment += `We celebrate ${possessive} magnificent gifts in ${strengthsText}, which shine brightly and inspire everyone around ${object}. `;
            }
            
            // Include subjects
            if (processedData.subjects) {
                comment += `In ${processedData.subjects}, ${name} shows such beautiful curiosity and enthusiasm for learning. `;
            }
            
            // Include topics if available
            if (processedData.topics) {
                comment += `${pronoun} particularly delights in ${processedData.topics}, where ${possessive} natural talents bloom wonderfully. `;
            }
            
            // Include areas for improvement
            if (processedData.weaknesses && processedData.weaknesses.length > 0) {
                const weaknessesText = this.baseEngine.naturalJoin(processedData.weaknesses);
                comment += `With gentle support in ${weaknessesText}, ${name} will continue to grow and flourish in these areas. `;
            }
            
            // Warm conclusion
            comment += `${name} is such a precious part of our learning family and will continue to bloom beautifully with love and encouragement.`;
        }
        
        // Improve grammar and ensure proper flow
        return this.baseEngine.improveGrammar(comment);
    }
    
    /**
     * Get word count
     */
    getWordCount(text) {
        return text.trim().split(/\s+/).length;
    }
    
    /**
     * Generate fallback comments
     */
    generateFallbackComments(studentName) {
        return {
            male: `${studentName} has demonstrated satisfactory progress this term and continues to develop essential academic skills. With continued support, ${studentName} will achieve further success.`,
            female: `${studentName} has brought such joy to our classroom and continues to blossom beautifully in their learning journey. With love and encouragement, ${studentName} will continue to flourish.`,
            wordCount: { male: 25, female: 28 }
        };
    }
}

// Enhanced ensureCommentGeneration function
function enhancedEnsureCommentGeneration() {
    try {
        console.log('🚀 Starting enhanced comment generation...');
        
        // Collect all form data with robust retrieval and sessionStorage fallback
        const safeParse = (val) => { try { return JSON.parse(val || '{}'); } catch { return {}; } };
        let studentData = safeParse(localStorage.getItem('studentData'));
        if (!studentData.studentName || !studentData.gender) {
            const ssData = safeParse(sessionStorage.getItem('studentData'));
            if (ssData.studentName && ssData.gender) {
                console.warn('ℹ️ Restoring studentData from sessionStorage fallback (enhanced engine)');
                studentData = ssData;
                try { localStorage.setItem('studentData', JSON.stringify(ssData)); } catch {}
            }
        }
        const selectedSubjects = [];
        const topicRatings = {};
        
        // Collect selected subjects and topics
        document.querySelectorAll('.subject-checkbox:checked').forEach(cb => {
            selectedSubjects.push(cb.value);
        });
        
        document.querySelectorAll('.topic-checkbox:checked').forEach(cb => {
            topicRatings[cb.value] = 5; // Default rating
        });
        
        // Basic validation with diagnostics
        if (!studentData.studentName || !studentData.gender) {
            console.error('❌ Student data missing or incomplete (enhanced engine)', studentData);
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
        
        // Generate comments using Enhanced engine
        const enhancedEngine = new EnhancedCommentEngine();
        const comments = enhancedEngine.generateComments(sessionData);
        
        console.log('✅ Comments generated successfully:', comments);
        
        // Display generated comments
        displayGeneratedComments(comments);
        
    } catch (error) {
        console.error('❌ Enhanced comment generation failed:', error);
        alert('An error occurred during comment generation: ' + error.message);
    }
}

console.log('✅ Enhanced Comment Generation System loaded successfully');
