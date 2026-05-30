/* eslint-env es6 */
/* global window */
/**
 * Legacy compatibility shim for EnhancedCommentEngine.
 * Prefer importing assets/js/engine/core.js directly.
 */
(function () {
  if (typeof window === "undefined") {
    return;
  }

  const warn = () => {
    console.warn(
      "⚠️ Deprecated: enhanced-comment-engine.js is a legacy shim. Use assets/js/engine/core.js instead.",
    );
  };

  const load = async () => {
    try {
      const module = await import("./assets/js/engine/core.js");
      window.EnhancedCommentEngine = module.EnhancedCommentEngine;
      warn();
    } catch (error) {
      console.error("❌ Failed to load EnhancedCommentEngine module:", error);
    }
  };

  load();
})();
