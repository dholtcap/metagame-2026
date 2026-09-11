import { FALLBACK_GAME, GAMES } from "./store";

// Inline script, mounted in the root layout via next/script
// beforeInteractive: it runs before hydration on every page load, so the
// backdrop's CSS variable is set before first paint and only the chosen
// image ever loads. Picks uniformly at random on every load (nothing is
// persisted); if anything throws it falls back to FALLBACK_GAME, matching
// the store's default. Keep it ES5-ish and tiny — it's not bundled.
export const PUZZLE_BOOT_SCRIPT = `(function(){var G=${JSON.stringify(GAMES)},g=${JSON.stringify(FALLBACK_GAME)};try{g=G[Math.floor(Math.random()*G.length)]}catch(e){}var el=document.documentElement;el.dataset.game=g;el.style.setProperty("--puzzle-image","url(/images/puzzle/library_"+g+".jpg)")})();`;
