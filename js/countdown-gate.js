/* ==========================================================================
   COUNTDOWN-GATE.JS
   This is Part 2 of 2 — the main site. Blocks the entire site behind a
   live countdown until an exact date/time, then fades away and hands off
   to the rest of the app. If that time has already passed when the page
   loads, the gate never shows at all.

   >>> SET HER BIRTHDAY HERE <<<
   Use the format 'YYYY-MM-DDTHH:MM:SS' — this is interpreted in whatever
   timezone the *visitor's browser* is set to, so if you and she are in
   the same timezone this will line up correctly with local midnight.
   ========================================================================== */

(function () {
  const REVEAL_AT = new Date('2026-09-15T00:00:00'); // <-- change this to her actual birthday, at midnight

  const gate = document.getElementById('countdownGate');
  const dEl = document.getElementById('cdDays');
  const hEl = document.getElementById('cdHours');
  const mEl = document.getElementById('cdMinutes');
  const sEl = document.getElementById('cdSeconds');

  let tickInterval = null;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function tick() {
    const diff = REVEAL_AT.getTime() - Date.now();

    if (diff <= 0) {
      clearInterval(tickInterval);
      openGate();
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    dEl.textContent = pad(Math.floor(totalSeconds / 86400));
    hEl.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
    mEl.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
    sEl.textContent = pad(totalSeconds % 60);
  }

  function openGate() {
    if (gate) {
      gate.classList.add('hidden');
      setTimeout(() => gate.remove(), 900);
    }
    // Hand off to the rest of the app — main.js's typewriter and
    // scroll-hint.js both listen for this.
    document.dispatchEvent(new CustomEvent('app:loaded'));
  }

  function start() {
    if (!gate) {
      document.dispatchEvent(new CustomEvent('app:loaded'));
      return;
    }

    if (Date.now() >= REVEAL_AT.getTime()) {
      gate.remove();
      document.dispatchEvent(new CustomEvent('app:loaded'));
      return;
    }

    tick();
    tickInterval = setInterval(tick, 1000);
  }

  // loading.js dispatches this once its own progress bar finishes.
  document.addEventListener('preload:done', start);

  // Fallback in case that event is ever missed.
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (gate && !gate.classList.contains('hidden') && !tickInterval) start();
    }, 1800);
  });
})();
