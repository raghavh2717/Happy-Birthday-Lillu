/* ==========================================================================
   LOADING.JS
   Shows a loading screen with a progress bar while fonts/GSAP settle,
   then fades it out and hands off to js/countdown-gate.js, which either
   reveals the site immediately or shows a countdown first.
   ========================================================================== */

(function () {
  const loadingScreen = document.getElementById('loading-screen');
  const fill = document.getElementById('loaderFill');

  let progress = 0;
  const target = 100;

  // Simulated progressive loading — feels natural even though there's
  // nothing heavy to actually wait for. Replace with real asset-loading
  // promises (e.g. Promise.all of image loads) if you add more media.
  function tick() {
    const remaining = target - progress;
    progress += Math.max(1, remaining * 0.12);
    if (progress >= target) progress = target;
    fill.style.width = progress + '%';

    if (progress < target) {
      requestAnimationFrame(() => setTimeout(tick, 40));
    } else {
      setTimeout(finishLoading, 300);
    }
  }

  function finishLoading() {
    loadingScreen.classList.add('hidden');
    document.dispatchEvent(new CustomEvent('preload:done'));
  }

  // Kick off once the DOM is ready.
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(tick, 200);
  });
})();
