/**
 * Comment Engine Bundle
 * Single entry point that bundles all comment generation dependencies
 * This ensures Vite includes all engine modules in the same chunk
 */

// Engine modules
import { EnhancedCommentEngine } from './engine/core.js';
import { TeachersPetProcessor } from './engine/processor.js';
import { TeachersPetTemplates } from './engine/templates.js';
import { TeachersPetUtils } from './engine/utils.js';

// Data modules
import { TeachersPetData } from './data/engine-data.js';

// Utility modules
import { synonymManager } from './synonym-manager.js';
import { debugLog, createDebugLog } from './utils/debug.js';

// Re-export everything
export { 
  EnhancedCommentEngine,
  TeachersPetProcessor,
  TeachersPetTemplates,
  TeachersPetUtils,
  TeachersPetData,
  synonymManager,
  debugLog,
  createDebugLog,
};

// Also make them available as properties for dynamic access
export const CommentEngineBundle = {
  EnhancedCommentEngine,
  TeachersPetProcessor,
  TeachersPetTemplates,
  TeachersPetUtils,
  TeachersPetData,
  synonymManager,
  debugLog,
  createDebugLog,
};
