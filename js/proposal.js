/* ==========================================================================
   PROPOSAL.JS
   Screen 7 — Final Proposal. The "No" button dodges on hover/click/touch
   so only "Yes" can ever be pressed. Clicking "Yes" reveals the
   celebration state in place (confetti + fireworks + message).
   ========================================================================== */

(function () {
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const stage = document.getElementById('questionStage');
  const questionBlock = document.getElementById('proposalQuestion');
  const celebrationBlock = document.getElementById('proposalCelebration');

  if (!yesBtn || !noBtn) return;

  const funnyNoTexts = [
    'No',
    'Are you sure?',
    'Really?',
    'Think again!',
    'Nope, try again',
    'Not happening',
    'Yes is right there →',
    'Wrong button!',
    'Nice try 😏',
    'Still no?',
    'Ha! Missed me',
    "You can't catch me",
    'Pick Yes already 😄',
    'Access denied',
    'Try harder',
    "That won't work",
  ];
  let lastTextIndex = 0;

  function nextFunnyText() {
    let i = Math.floor(Math.random() * funnyNoTexts.length);
    if (funnyNoTexts.length > 1) {
      while (i === lastTextIndex) i = Math.floor(Math.random() * funnyNoTexts.length);
    }
    lastTextIndex = i;
    return funnyNoTexts[i];
  }

  function dodge() {
    noBtn.textContent = nextFunnyText();
    const stageRect = stage.getBoundingClientRect();
    const btnW = noBtn.offsetWidth || 120;
    const btnH = noBtn.offsetHeight || 44;
    const maxLeft = Math.max(stageRect.width - btnW, 20);
    const maxTop = Math.max(stageRect.height - btnH, 20);
    const newLeft = Math.random() * maxLeft;
    const newTop = Math.random() * maxTop;
    noBtn.style.left = newLeft + 'px';
    noBtn.style.top = newTop + 'px';
    noBtn.style.transform = 'none';
  }

  noBtn.addEventListener('mouseenter', dodge);
  noBtn.addEventListener('click', (e) => { e.preventDefault(); dodge(); });
  noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); dodge(); }, { passive: false });

  yesBtn.addEventListener('click', () => {
    questionBlock.classList.add('hide');
    celebrationBlock.classList.add('show');

    if (window.Effects) {
      window.Effects.burstConfetti(70);
      window.Effects.fireworksShow(6);
      window.Effects.drawHeart(document.getElementById('celebrationHeart'));
    }

    if (window.gsap) {
      gsap.fromTo(
        celebrationBlock.querySelectorAll('.eyebrow, h1, .celebrate-mark, .lead'),
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power2.out', delay: 0.3 }
      );
    }

    if (window.Nav) window.Nav.setNextEnabled(true);
  });

  // Reset back to the question if the visitor navigates away and returns
  document.addEventListener('screen:change', (e) => {
    const proposalScreen = document.getElementById('screen-proposal');
    const idx = Array.from(document.querySelectorAll('.screen')).indexOf(proposalScreen);
    if (e.detail.index !== idx) {
      // no-op: keep celebration state once reached, so returning shows the same result
    }
  });
})();
