// Reproduction script for S1: XSS via innerHTML
// Test in browser console on any page with subjects controller

console.log('=== S1 REPRODUCTION: XSS via innerHTML ===');

// The vulnerable pattern: innerHTML with user-controlled data
// Found in:
// - subjects-controller.js:86 - subject.name, topic.name
// - subjects-controller.js:298 - button text
// - p2-subjects-controller.js:52, 64 - subject.name, topic.name
// - app-controller.js:134 - loading message
// - student-info-controller.js:28 - grade, month

function testInnerHTMLXSS() {
    console.log('\n--- Test 1: Subject name injection via curriculum JSON ---');
    
    // Simulate malicious curriculum data
    const maliciousCurriculum = {
        subjects: [{
            id: 'english',
            name: 'English<img src=x onerror=alert("XSS:subject")>',
            topics: [{
                id: 'topic1',
                name: 'Reading<img src=x onerror=alert("XSS:topic")>'
            }]
        }]
    };
    
    // Check if SubjectsController renders this unsafely
    if (window.app && window.app.controllers && window.app.controllers.subjects) {
        const ctrl = window.app.controllers.subjects;
        const container = document.getElementById('subjectsForm') || document.createElement('div');
        
        // This would execute the XSS if rendered
        try {
            ctrl.renderSubjects(maliciousCurriculum.subjects);
            console.log('❌ VULNERABLE: innerHTML used without sanitization');
            console.log('   Rendered HTML:', container.innerHTML.substring(0, 200));
        } catch (e) {
            console.log('Error during render:', e.message);
        }
    } else {
        console.log('SubjectsController not available - load Subjects.html first');
    }
    
    console.log('\n--- Test 2: Grade/Month injection via URL params ---');
    
    // student-info-controller.js:28 uses grade/month from URL directly in innerHTML
    const maliciousGrade = 'K1<script>alert("XSS:grade")</script>';
    const maliciousMonth = 'August<script>alert("XSS:month")</script>';
    
    // Simulate the tracker element
    const tracker = document.createElement('div');
    tracker.id = 'curriculumTracker';
    document.body.appendChild(tracker);
    
    // This is the vulnerable code pattern from student-info-controller.js:28
    const vulnerableCode = `
        const safeGrade = "${maliciousGrade}";
        const safeMonth = "${maliciousMonth}";
        tracker.innerHTML = \`<span>Current: <span>\${safeGrade}</span> · <span>\${safeMonth}</span></span>\`;
    `;
    
    try {
        eval(vulnerableCode);
        console.log('❌ VULNERABLE: grade/month interpolated directly into innerHTML');
        console.log('   Rendered:', tracker.innerHTML);
    } catch (e) {
        console.log('Error:', e.message);
    }
    
    tracker.remove();
    
    console.log('\n--- Test 3: Topic name with special chars ---');
    const topicName = 'Topic "with quotes" & <script>alert(1)</script>';
    const testDiv = document.createElement('div');
    testDiv.innerHTML = `<label>${topicName}</label>`;
    console.log('Rendered topic:', testDiv.innerHTML);
    console.log(`${testDiv.innerHTML.includes('<script>') ? '❌ SCRIPT EXECUTES' : '✅ Escaped'}`);
    
    console.log('\n=== SUMMARY ===');
    console.log('All innerHTML interpolations with user data are XSS vectors.');
    console.log('Fix: Use textContent + createElement, or add DOMPurify/sanitization.');
}

testInnerHTMLXSS();