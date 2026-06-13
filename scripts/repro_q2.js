// Reproduction script for Q2: Excessive debug logs in production
// Run in browser console

console.log('=== Q2 REPRODUCTION: Debug logs in optimized-comment-generator.js ===');

function countDebugLogs() {
    // Fetch the source and count console.log statements
    return fetch('optimized-comment-generator.js')
        .then(r => r.text())
        .then(content => {
            const logMatches = content.match(/console\.(log|warn|error)\(/g) || [];
            const debugLogMatches = content.match(/console\.log\(['"][\s\S]*?[🔍✅⚠️❌📊📦⭐]/g) || [];
            
            console.log(`Total console.log/warn/error calls: ${logMatches.length}`);
            console.log(`Emoji-prefixed debug logs: ${debugLogMatches.length}`);
            
            // Check if gated by __TP_DEBUG__
            const debugGated = content.match(/window\.__TP_DEBUG__/g) || [];
            console.log(`References to window.__TP_DEBUG__: ${debugGated.length}`);
            
            // List all log lines with line numbers
            const lines = content.split('\n');
            console.log('\n--- All console.log statements ---');
            lines.forEach((line, i) => {
                if (line.includes('console.log') || line.includes('console.warn') || line.includes('console.error')) {
                    console.log(`  Line ${i + 1}: ${line.trim()}`);
                }
            });
            
            return {
                totalLogs: logMatches.length,
                debugLogs: debugLogMatches.length,
                debugGated: debugGated.length
            };
        });
}

countDebugLogs().then(result => {
    console.log('\n=== SUMMARY ===');
    console.log(`Total console calls: ${result.totalLogs}`);
    console.log(`Debug logs (emoji): ${result.debugLogs}`);
    console.log(`Gated by __TP_DEBUG__: ${result.debugGated > 0 ? 'YES' : 'NO'}`);
    console.log(`${result.debugLogs > 0 && result.debugGated === 0 ? '❌ FAIL: Debug logs not gated' : '✅ PASS'}`);
});