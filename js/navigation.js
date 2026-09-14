/* ==========================================================================
   NAVIGATION.JS
   Controls which screen is active, the progress bar, and the back button.
   Other scripts call window.Nav.goTo(index) / window.Nav.next() to move.
   ========================================================================== */

(function () {
  const screens = Array.from(document.querySelectorAll('.screen'));
  const progressFill = document.getElementById('progressFill');
  const backBtn = document.getElementById('backBtn');
  const nextBtn = document.getElementById('nextBtn');
  let current = 0;
  let nextEnabled = true;

  // Screens where forward progress is gated behind an action, rather than
  // being free to advance immediately — the Next button starts disabled
  // on these and only unlocks once the relevant script calls
  // window.Nav.setNextEnabled(true).
  //   screen-cake     → all three candles blown out
  //   screen-proposal → "Yes" tapped on the playful question
  //   screen-secret   → correct 4-digit code entered AND "Yes" tapped
  const GATED_SCREENS = ['screen-cake', 'screen-proposal', 'screen-secret'];
  const unlockedScreens = new Set();

  function animateScreenIn(screenEl) {
    if (!window.gsap) return;

    // Shared entrance for headings/leads/buttons on every screen
    const common = screenEl.querySelectorAll('h1, h2, .lead, .continue-btn');
    gsap.fromTo(
      common,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'power2.out', overwrite: true }
    );

    // Extra, screen-specific choreography
    const id = screenEl.id;

    if (id === 'screen-welcome') {
      gsap.fromTo('.glass-card', { y: 24, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' });
    }

    if (id === 'screen-cake') {
      gsap.fromTo('.cake-svg', { y: 30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)', delay: 0.15 });
    }

    if (id === 'screen-journey') {
      const items = screenEl.querySelectorAll('.timeline-item');
      gsap.fromTo(
        items,
        { x: (i) => (i % 2 === 0 ? -24 : 24), opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.18, ease: 'power2.out', delay: 0.2 }
      );
    }

    if (id === 'screen-letter') {
      gsap.fromTo('.letter p', { opacity: 0, filter: 'blur(4px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.7, stagger: 0.25, ease: 'power2.out', delay: 0.15 });
      gsap.fromTo('.signoff', { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.6, delay: 1.1 });
    }

    if (id === 'screen-lovemeter') {
      gsap.fromTo('.lovemeter-wrap', { y: 16, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out', delay: 0.15 });
    }

    if (id === 'screen-reasons') {
      gsap.fromTo(
        '.reason',
        { y: 20, opacity: 0, rotate: -1.5 },
        { y: 0, opacity: 1, rotate: 0, duration: 0.55, stagger: 0.09, ease: 'back.out(1.5)', delay: 0.1 }
      );
    }

    if (id === 'screen-gallery') {
      gsap.fromTo('.slideshow', { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.1 });
    }

    if (id === 'screen-videos') {
      gsap.fromTo('.video-carousel', { scale: 0.92, opacity: 0, rotate: -1 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.3)', delay: 0.1 });
    }

    if (id === 'screen-proposal') {
      gsap.fromTo('.question-stage', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.15 });
    }

    if (id === 'screen-secret') {
      gsap.fromTo('.lock-icon', { scale: 0.6, opacity: 0, rotate: -8 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.6)', delay: 0.1 });
      gsap.fromTo('.pin-row', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.3 });
    }

    if (id === 'screen-closing') {
      gsap.fromTo('.closing-letter p', { opacity: 0, filter: 'blur(4px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.7, stagger: 0.22, ease: 'power2.out', delay: 0.15 });
      gsap.fromTo('#screen-closing .signoff', { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.6, delay: 1.3 });
    }

    if (id === 'screen-floating') {
      gsap.fromTo('.fp-item', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.12, ease: 'back.out(1.4)', delay: 0.15 });
    }

    if (id === 'screen-counter') {
      gsap.fromTo('.live-counter-card', { y: 20, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out', delay: 0.15 });
    }
  }

  function goTo(index) {
    if (index < 0 || index >= screens.length) return;
    if (index === current) return;

    screens[current].classList.remove('active');
    current = index;
    screens[current].classList.add('active');

    const pct = ((current + 1) / screens.length) * 100;
    progressFill.style.width = pct + '%';

    backBtn.classList.toggle('visible', current > 0);

    // Next button: hidden on the very first screen (the "Begin Our Story"
    // button already handles that step) and the very last screen (nothing
    // left to advance to). Everywhere else, it's gated per GATED_SCREENS.
    const screenId = screens[current].id;
    const isFirst = current === 0;
    const isLast = current === screens.length - 1;
    nextBtn.classList.toggle('visible', !isFirst && !isLast);
    nextEnabled = !GATED_SCREENS.includes(screenId) || unlockedScreens.has(screenId);
    nextBtn.disabled = !nextEnabled;

    animateScreenIn(screens[current]);

    document.dispatchEvent(new CustomEvent('screen:change', { detail: { index: current } }));
  }

  function next() {
    if (!nextEnabled) return;
    goTo(current + 1);
  }
  function prev() { goTo(current - 1); }
  function getCurrent() { return current; }
  function setNextEnabled(enabled) {
    nextEnabled = enabled;
    nextBtn.disabled = !enabled;
    if (enabled) unlockedScreens.add(screens[current].id);
  }

  backBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'Enter') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Swipe support (mobile)
  // let touchX = null;
  // document.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  // document.addEventListener('touchend', (e) => {
  //   if (touchX === null) return;
  //   const dx = e.changedTouches[0].clientX - touchX;
  //   if (dx > 60) prev();
  //   if (dx < -60) next();
  //   touchX = null;
  // }, { passive: true });

  window.Nav = { goTo, next, prev, getCurrent, setNextEnabled };
})();
