/* ==========================================================================
   LIVE-COUNTER.JS
   Screen 12 — the final screen. Counts up, live, from a set start date/
   time to right now, and keeps ticking every second so it's genuinely
   "live" if she leaves it open — good for a screenshot keepsake.

   >>> SET WHEN "US" STARTED HERE <<<
   Use the format 'YYYY-MM-DDTHH:MM:SS' — pick whatever date/time actually
   marks the start for the two of you.
   ========================================================================== */

(function () {
  const RELATIONSHIP_START = new Date('2026-06-14T12:45:00'); // the day we first met

  const dEl = document.getElementById('ucDays');
  const hEl = document.getElementById('ucHours');
  const mEl = document.getElementById('ucMinutes');
  const sEl = document.getElementById('ucSeconds');

  if (!dEl) return;

  let tickInterval = null;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function tick() {
    const diff = Date.now() - RELATIONSHIP_START.getTime();
    const totalSeconds = Math.max(0, Math.floor(diff / 1000));

    dEl.textContent = Math.floor(totalSeconds / 86400);
    hEl.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
    mEl.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
    sEl.textContent = pad(totalSeconds % 60);
  }

  // Only run the ticking clock while she's actually on this screen —
  // no point updating a counter no one can see, and it's one less
  // interval running in the background for the rest of the experience.
  document.addEventListener('screen:change', (e) => {
    const counterScreen = document.getElementById('screen-counter');
    const screenIndex = Array.from(document.querySelectorAll('.screen')).indexOf(counterScreen);

    if (e.detail.index === screenIndex) {
      tick();
      if (!tickInterval) tickInterval = setInterval(tick, 1000);
    } else if (tickInterval) {
      clearInterval(tickInterval);
      tickInterval = null;
    }
  });

  // In case she lands here first somehow (e.g. a future deep link).
  const counterScreen = document.getElementById('screen-counter');
  if (counterScreen && counterScreen.classList.contains('active')) {
    tick();
    tickInterval = setInterval(tick, 1000);
  }
})();
