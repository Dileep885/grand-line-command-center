/**
 * Cloudflare Worker for GitHub Pages–independent hosting of the static build.
 * Serves everything from the assets binding; unknown routes fall back to
 * index.html (SPA fallback) because `spa: true` is also set in the manifest.
 */
export default {
  fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
