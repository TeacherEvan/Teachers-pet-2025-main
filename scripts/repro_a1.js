// Reproduction script for A1: Service instantiated per request
// Run in browser console on Subjects.html or p2-subjects.html

console.log('=== A1 REPRODUCTION: Service instantiated per request ===');

// Check how many times OptimizedCommentGenerator is constructed
let constructCount = 0;
const OriginalOptimizedCommentGenerator = window.OptimizedCommentGenerator;

window.OptimizedCommentGenerator = class extends OriginalOptimizedCommentGenerator {
    constructor() {
        super();
        constructCount++;
        console.log(`🔴 OptimizedCommentGenerator constructed! Total: ${constructCount}`);
        console.trace('Construction stack:');
    }
};

// Simulate clicking generate button multiple times
async function testMultipleGenerations() {
    console.log('\n--- Test 1: Click generate button 3 times ---');
    
    // Need to be on Subjects.html or p2-subjects.html with subjects selected
    const generateBtn = document.getElementById('generateBtn') || document.getElementById('generate-comments');
    if (!generateBtn) {
        console.log('Generate button not found - need to be on subjects page with selection');
        return;
    }
    
    // Select a subject first if not already
    const firstCheckbox = document.querySelector('.topic-checkbox, .subject-checkbox');
    if (firstCheckbox && !firstCheckbox.checked) {
        firstCheckbox.click();
    }
    
    for (let i = 0; i < 3; i++) {
        console.log(`\n--- Generation ${i + 1} ---`);
        generateBtn.click();
        await new Promise(r => setTimeout(r, 2500)); // Wait for async generation
    }
    
    console.log(`\n✅ RESULT: OptimizedCommentGenerator constructed ${constructCount} times`);
    console.log(`${constructCount > 1 ? '❌ FAIL: New instance per request' : '✅ PASS: Singleton'}`);
}

testMultipleGenerations();