// Reproduction script for C1: Large validateAndCleanSessionData function
// Analyze cyclomatic complexity and responsibilities

console.log('=== C1 REPRODUCTION: Large validateAndCleanSessionData function ===');

function analyzeValidateFunction() {
    return fetch('optimized-comment-generator.js')
        .then(r => r.text())
        .then(content => {
            // Find the validateAndCleanSessionData function
            const fnMatch = content.match(
                /validateAndCleanSessionData\s*\([^)]*\)\s*\{[\s\S]*?^\s*\}/m
            );
            
            if (!fnMatch) {
                console.log('Function not found');
                return;
            }
            
            const fnBody = fnMatch[0];
            const lines = fnBody.split('\n');
            
            console.log(`Function length: ${lines.length} lines`);
            
            // Count conditionals (cyclomatic complexity indicators)
            const ifCount = (fnBody.match(/\bif\s*\(/g) || []).length;
            const elseCount = (fnBody.match(/\belse\b/g) || []).length;
            const ternaryCount = (fnBody.match(/\?/g) || []).length;
            const logicalCount = (fnBody.match(/&&|\|\|/g) || []).length;
            const consoleLogCount = (fnBody.match(/console\.(log|warn|error)/g) || []).length;
            
            // Estimate cyclomatic complexity
            const complexity = 1 + ifCount + elseCount + ternaryCount + logicalCount;
            
            console.log(`  if statements: ${ifCount}`);
            console.log(`  else branches: ${elseCount}`);
            console.log(`  ternary operators: ${ternaryCount}`);
            console.log(`  logical operators: ${logicalCount}`);
            console.log(`  console.log calls: ${consoleLogCount}`);
            console.log(`  Estimated cyclomatic complexity: ${complexity}`);
            
            // Identify responsibilities
            const responsibilities = [];
            if (fnBody.includes('buildFallbackSessionData')) responsibilities.push('Fallback data building');
            if (fnBody.includes('overallRating')) responsibilities.push('Rating validation/coercion');
            if (fnBody.includes('studentName')) responsibilities.push('Student name validation');
            if (fnBody.includes('console.log')) responsibilities.push('Debug logging');
            if (fnBody.includes('throw new Error')) responsibilities.push('Error throwing');
            
            console.log('\n--- Responsibilities detected ---');
            responsibilities.forEach(r => console.log(`  - ${r}`));
            
            console.log('\n--- Function preview (first 80 lines) ---');
            console.log(fnBody.substring(0, 3000));
            
            return {
                lines: lines.length,
                complexity,
                consoleLogs: consoleLogCount,
                responsibilities: responsibilities.length
            };
        });
}

analyzeValidateFunction().then(result => {
    console.log('\n=== SUMMARY ===');
    console.log(`Lines: ${result.lines}`);
    console.log(`Cyclomatic complexity: ${result.complexity} (${result.complexity > 10 ? 'HIGH' : 'OK'})`);
    console.log(`Console logs: ${result.consoleLogs}`);
    console.log(`Responsibilities: ${result.responsibilities}`);
    console.log(`${result.complexity > 15 || result.responsibilities > 3 ? '❌ FAIL: Too complex, too many responsibilities' : '✅ PASS'}`);
});