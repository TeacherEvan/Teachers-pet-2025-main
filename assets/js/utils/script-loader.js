/**
 * ScriptLoader
 * Minimal, cached runtime loader for classic scripts in a no-build static app.
 *
 * Usage:
 *   await ScriptLoader.loadSequential([
 *     'assets/js/engine/utils.js',
 *     'assets/js/engine/core.js'
 *   ]);
 */

(function () {
  const loaded = new Map();

  function isBrowser() {
    return typeof window !== "undefined" && typeof document !== "undefined";
  }

  function toAbsoluteUrl(src) {
    try {
      return new URL(src, window.location.href).toString();
    } catch {
      return src;
    }
  }

  function loadScript(src, options = {}) {
    if (!isBrowser()) {
      return Promise.reject(
        new Error("ScriptLoader can only run in a browser environment")
      );
    }

    const abs = toAbsoluteUrl(src);
    if (loaded.has(abs)) return loaded.get(abs);

    const promise = new Promise((resolve, reject) => {
      const existing = Array.from(
        document.querySelectorAll("script[data-script-loader]")
      ).find((s) => s.dataset && s.dataset.scriptLoader === abs);
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () =>
          reject(new Error(`Failed loading script: ${src}`))
        );
        return;
      }

      const script = document.createElement("script");
      script.src = abs;
      script.async = false; // preserve execution order for sequential loads
      script.dataset.scriptLoader = abs;

      if (options.id) script.id = options.id;
      if (options.type) script.type = options.type;
      if (options.defer) script.defer = true;
      if (options.crossOrigin) script.crossOrigin = options.crossOrigin;

      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed loading script: ${src}`));

      document.head.appendChild(script);
    });

    loaded.set(abs, promise);
    return promise;
  }

  async function loadSequential(scripts) {
    for (const src of scripts) {
      // eslint-disable-next-line no-await-in-loop
      await loadScript(src);
    }
  }

  window.ScriptLoader = {
    loadScript,
    loadSequential,
  };
})();
