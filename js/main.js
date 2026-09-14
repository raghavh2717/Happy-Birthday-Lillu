/* ==========================================================================
   MAIN.JS
   Entry point. Waits for the loading screen to finish, then runs the
   Screen 1 typewriter effect and wires up the "Begin Our Story" button.
   ========================================================================== */

(function () {
  const beginBtn = document.getElementById('beginBtn');
  const twEl = document.getElementById('typewriterText');
  const twText = "Every day with you feels like something worth celebrating.";

  function typeNext(i) {
    if (i <= twText.length) {
      twEl.innerHTML = twText.slice(0, i) + '<span class="tw-cursor">|</span>';
      setTimeout(() => typeNext(i + 1), 42);
    }
  }

  function startIntro() {
    // Typewriter subtitle
    setTimeout(() => typeNext(0), 500);

    // GSAP entrance for the welcome card, if GSAP loaded successfully
    if (window.gsap) {
      gsap.fromTo(
        '.glass-card',
        { y: 24, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }
      );
    }

    // Ripple + tilt micro-interactions
    if (window.Effects) {
      window.Effects.attachRipples();
      window.Effects.attachTilt('.glass-card, .reason, .timeline-card, .slide-photo .frame, .letter');
    }
  }

  beginBtn.addEventListener('click', () => window.Nav.next());

  document.addEventListener('app:loaded', startIntro);

  // Re-bind ripple/tilt after each screen change, in case new buttons/cards
  // entered the DOM flow (defensive — most elements exist from the start).
  document.addEventListener('screen:change', () => {
    if (window.Effects) {
      window.Effects.attachRipples();
      window.Effects.attachTilt('.glass-card, .reason, .timeline-card, .slide-photo .frame, .letter');
    }
  });
})();
