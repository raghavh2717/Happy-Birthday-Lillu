/* ==========================================================================
   SECRET.JS
   Screen 9 — Locked Note. She enters a 4-digit code; if it matches,
   the lock screen fades out and a marriage-proposal note fades in.

   >>> CHANGE THE CODE HERE <<<
   Set CORRECT_PIN to any 4 digits that mean something to the two of you —
   an anniversary, a birthday, anything.
   ========================================================================== */

(function () {
  const CORRECT_PIN = '1517'; // <-- change this to your own 4-digit code

  const lockWrap = document.getElementById('lockWrap');
  const secretNote = document.getElementById('secretNote');
  const pinInputs = Array.from(document.querySelectorAll('.pin-digit'));
  const unlockBtn = document.getElementById('unlockBtn');
  const pinError = document.getElementById('pinError');
  const secretYesBtns = document.getElementById('secretYesRow');
  const finalReveal = document.getElementById('finalReveal');

  if (!lockWrap || !pinInputs.length) return;

  // --- Auto-advance focus between the four digit boxes ---
  pinInputs.forEach((input, i) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^0-9]/g, '').slice(0, 1);
      if (input.value && i < pinInputs.length - 1) {
        pinInputs[i + 1].focus();
      }
      pinError.classList.remove('show');
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && i > 0) {
        pinInputs[i - 1].focus();
      }
      if (e.key === 'Enter') attemptUnlock();
    });
  });

  unlockBtn.addEventListener('click', attemptUnlock);

  function attemptUnlock() {
    const entered = pinInputs.map((i) => i.value).join('');

    if (entered.length < 4) {
      shakeAndError("that's only " + entered.length + ' digits — try all 4');
      return;
    }

    if (entered === CORRECT_PIN) {
      unlock();
    } else {
      shakeAndError("that's not quite it — try again");
    }
  }

  function shakeAndError(message) {
    pinError.textContent = message;
    pinError.classList.add('show');
    lockWrap.classList.remove('shake');
    // Re-trigger the CSS animation
    void lockWrap.offsetWidth;
    lockWrap.classList.add('shake');
    pinInputs.forEach((i) => { i.value = ''; });
    pinInputs[0].focus();
  }

  function unlock() {
    lockWrap.classList.add('hide');
    secretNote.classList.add('show');

    // Let music.js know she's just unlocked the note, so it can swap
    // to the second track.
    document.dispatchEvent(new CustomEvent('secret:unlocked'));

    if (window.Effects) {
      window.Effects.burstConfetti(40);
    }

    if (window.gsap) {
      gsap.fromTo(
        secretNote.querySelectorAll('.ring-icon, .eyebrow, h2, .lead, .secret-yes'),
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.15 }
      );
    }
  }

  // --- Either "Yes" button on the marriage proposal note ---
  // There's no "No" button here on purpose — this one only asks once.
  if (secretYesBtns) {
    secretYesBtns.querySelectorAll('.secret-yes-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        secretYesBtns.classList.add('hidden');
        finalReveal.classList.add('show');

        if (window.Effects) {
          window.Effects.burstConfetti(90);
          window.Effects.fireworksShow(8);
        }

        if (window.gsap) {
          gsap.fromTo(
            finalReveal.querySelectorAll('.secret-answer, .final-photo-frame, .final-message'),
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay: 0.15 }
          );
        }

        if (window.Nav) window.Nav.setNextEnabled(true);
      });
    });
  }
})();
