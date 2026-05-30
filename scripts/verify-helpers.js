import fs from "fs";

export function validateRootEngineShim(content) {
  const issues = [];

  if (!/Legacy compatibility shim/.test(content)) {
    issues.push(
      'Root enhanced-comment-engine.js must identify itself as a legacy compatibility shim.',
    );
  }

  if (!/import\("\.\/assets\/js\/engine\/core\.js"\)/.test(content)) {
    issues.push(
      'Root enhanced-comment-engine.js must dynamically import ./assets/js/engine/core.js.',
    );
  }

  if (!/window\.EnhancedCommentEngine\s*=\s*module\.EnhancedCommentEngine/.test(content)) {
    issues.push(
      'Root enhanced-comment-engine.js must expose module.EnhancedCommentEngine on window.',
    );
  }

  if (/class\s+EnhancedCommentEngine/.test(content)) {
    issues.push(
      'Root enhanced-comment-engine.js must not redefine class EnhancedCommentEngine.',
    );
  }

  return issues;
}

export function validateRootEngineShimFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return ['Missing root enhanced-comment-engine.js compatibility file.'];
  }

  return validateRootEngineShim(fs.readFileSync(filePath, 'utf8'));
}