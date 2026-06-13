// Reproduction script for Q1: Duplicate getWordCount
// Run in browser console

console.log('=== Q1 REPRODUCTION: Duplicate getWordCount implementations ===');

function findGetWordCountImplementations() {
    const implementations = [];
    
    // Check TeachersPetUtils
    if (window.TeachersPetUtils && typeof window.TeachersPetUtils.getWordCount === 'function') {
        implementations.push({
            location: 'TeachersPetUtils.getWordCount',
            source: 'assets/js/engine/utils.js',
            fn: window.TeachersPetUtils.getWordCount.toString()
        });
    }
    
    // Check SubjectsController
    if (window.app && window.app.controllers && window.app.controllers.subjects) {
        const ctrl = window.app.controllers.subjects;
        if (typeof ctrl.getWordCount === 'function') {
            implementations.push({
                location: 'SubjectsController.getWordCount',
                source: 'assets/js/controllers/subjects-controller.js',
                fn: ctrl.getWordCount.toString()
            });
        }
    }
    
    // Check P2SubjectsController
    if (window.app && window.app.controllers && window.app.controllers.p2Subjects) {
        const ctrl = window.app.controllers.p2Subjects;
        if (typeof ctrl.getWordCount === 'function') {
            implementations.push({
                location: 'P2SubjectsController.getWordCount',
                source: 'assets/js/controllers/p2-subjects-controller.js',
                fn: ctrl.getWordCount.toString()
            });
        }
    }
    
    // Check OptimizedCommentGenerator
    if (window.OptimizedCommentGenerator) {
        const proto = window.OptimizedCommentGenerator.prototype;
        if (typeof proto.getWordCount === 'function') {
            implementations.push({
                location: 'OptimizedCommentGenerator.prototype.getWordCount',
                source: 'optimized-comment-generator.js',
                fn: proto.getWordCount.toString()
            });
        }
        
        // Also check instance
        if (window.commentGenerator && typeof window.commentGenerator.getWordCount === 'function') {
            implementations.push({
                location: 'window.commentGenerator.getWordCount (instance)',
                source: 'optimized-comment-generator.js (instance)',
                fn: window.commentGenerator.getWordCount.toString()
            });
        }
    }
    
    // Check enhanced-comment-engine.js (legacy shim)
    if (window.EnhancedCommentEngine) {
        const proto = window.EnhancedCommentEngine.prototype;
        if (typeof proto.getWordCount === 'function') {
            implementations.push({
                location: 'EnhancedCommentEngine.prototype.getWordCount',
                source: 'assets/js/enhanced-comment-engine.js (legacy)',
                fn: proto.getWordCount.toString()
            });
        }
    }
    
    // Check TeachersPetTemplates (uses TeachersPetUtils)
    if (window.TeachersPetTemplates) {
        // This uses TeachersPetUtils.getWordCount internally
    }
    
    return implementations;
}

const impls = findGetWordCountImplementations();

console.log(`\nFound ${impls.length} getWordCount implementations:\n`);

impls.forEach((impl, i) => {
    console.log(`${i + 1}. ${impl.location}`);
    console.log(`   Source: ${impl.source}`);
    console.log(`   Function: ${impl.fn.substring(0, 150)}...`);
    console.log('');
});

// Test if they all produce same output
const testText = "Hello   world  this is a test";
console.log('--- Output comparison ---');
impls.forEach(impl => {
    try {
        const result = impl.fn.call(null, testText);
        console.log(`${impl.location}: ${result}`);
    } catch (e) {
        console.log(`${impl.location}: ERROR - ${e.message}`);
    }
});

console.log('\n✅ Expected: All should return 6');
console.log(`${impls.length > 1 ? '❌ FAIL: Duplicate implementations' : '✅ PASS: Single implementation'}`);