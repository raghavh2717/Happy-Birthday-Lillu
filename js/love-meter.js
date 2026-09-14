/* ==========================================================================
   LOVE-METER.JS
   Screen 5 — a playful gauge that fills up to 100%, then "overloads" and
   keeps climbing anyway, with escalating status messages. Runs once each
   time the screen becomes active.
   ========================================================================== */

(function () {
  const fill = document.getElementById('lovemeterFill');
  const percentEl = document.getElementById('lovemeterPercent');
  const statusEl = document.getElementById('lovemeterStatus');
  const footnoteEl = document.getElementById('lovemeterFootnote');
  const lovemeterScreen = document.getElementById('screen-lovemeter');

  if (!fill || !lovemeterScreen) return;

  const stages = [
    { at: 0, status: 'calibrating…' },
    { at: 15, status: 'reading initial signs…' },
    { at: 35, status: 'yep, that checks out' },
    { at: 55, status: 'still climbing' },
    { at: 75, status: 'this is a lot, actually' },
    { at: 92, status: 'approaching maximum capacity' },
    { at: 100, status: 'MAXIMUM REACHED' },
    { at: 115, status: 'that shouldn\'t be possible' },
    { at: 130, status: 'system does not know what to do' },
    { at: 143, status: 'OVERLOAD' },
  ];

  let running = false;
  let animationId = null;

  function statusFor(value) {
    let current = stages[0].status;
    for (const stage of stages) {
      if (value >= stage.at) current = stage.status;
    }
    return current;
  }

  function reset() {
    running = false;
    if (animationId) cancelAnimationFrame(animationId);
    fill.style.width = '0%';
    fill.classList.remove('overload');
    percentEl.textContent = '0%';
    percentEl.classList.remove('overload');
    statusEl.textContent = stages[0].status;
    footnoteEl.textContent = '';
  }

  function run() {
    if (running) return;
    running = true;
    reset();
    running = true;

    const duration = 5000;
    const maxValue = 143; // deliberately, comically over 100
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out so it slows down dramatically as it "strains" past 100
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * maxValue);

      const displayWidth = Math.min(value, 100);
      fill.style.width = displayWidth + '%';
      percentEl.textContent = value + '%';
      statusEl.textContent = statusFor(value);

      if (value >= 100) {
        fill.classList.add('overload');
        percentEl.classList.add('overload');
      }

      if (progress < 1) {
        animationId = requestAnimationFrame(tick);
      } else {
        footnoteEl.textContent = "Reading may not be scientifically accurate. It is, however, completely true.";
      }
    }

    animationId = requestAnimationFrame(tick);
  }

  document.addEventListener('screen:change', (e) => {
    const screenIndex = Array.from(document.querySelectorAll('.screen')).indexOf(lovemeterScreen);
    if (e.detail.index === screenIndex) {
      run();
    } else {
      running = false;
      if (animationId) cancelAnimationFrame(animationId);
    }
  });

  // In case she somehow lands here first (e.g. a future deep link).
  if (lovemeterScreen.classList.contains('active')) run();
})();
