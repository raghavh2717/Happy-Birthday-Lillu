/* ==========================================================================
   CAKE.JS
   Screen 2 — tap each candle flame to "blow it out". Once all three are
   out, the global Next button (bottom-right, same as every other screen)
   unlocks and a little confetti puff plays. Blowing is touch/click only —
   there's no microphone involved.
   ========================================================================== */

(function () {
  const candles = Array.from(document.querySelectorAll('.candle-group'));
  const wishHint = document.getElementById('wishHint');
  let blownCount = 0;
 let trickCount = 0;
const REQUIRED_TRICKS = 2; // how many times it flares back before it actually works
  const DEFAULT_HINT = 'tap each flame to blow it out';

  if (!candles.length) return;

  candles.forEach((candle) => {
    candle.addEventListener('click', () => {
      if (candle.classList.contains('blown')) return;
      candle.classList.add('blown');
      blownCount++;

      if (window.gsap) {
        gsap.fromTo(candle, { scale: 1 }, { scale: 1.08, duration: 0.15, yoyo: true, repeat: 1, transformOrigin: '50% 100%' });

        // Rising smoke wisp from the extinguished wick
        const flame = candle.querySelector('.flame');
        if (flame) {
          const rect = flame.getBoundingClientRect();
          const smoke = document.createElement('div');
          smoke.style.cssText = `position:fixed; left:${rect.left + rect.width / 2 - 3}px; top:${rect.top}px; width:6px; height:6px; border-radius:50%; background:rgba(200,200,200,0.5); pointer-events:none; z-index:20; filter:blur(2px);`;
          document.body.appendChild(smoke);
          gsap.to(smoke, {
            y: -40, x: (Math.random() * 20 - 10), opacity: 0, scale: 3,
            duration: 1.2, ease: 'power1.out',
            onComplete: () => smoke.remove()
          });
        }
      }

            if (blownCount === candles.length) {
        if (trickCount < REQUIRED_TRICKS) {
          trickCount++;
          wishHint.textContent = 'a magic candle… try again ✦';

          setTimeout(() => {
            candles.forEach((c) => {
              c.classList.remove('blown');
              c.classList.add('flare');
              setTimeout(() => c.classList.remove('flare'), 550);
            });
            blownCount = 0;
            setTimeout(() => {
              if (wishHint.textContent === 'a magic candle… try again ✦') {
                wishHint.textContent = DEFAULT_HINT;
              }
            }, 900);
          }, 700);
        } else {
          wishHint.textContent = 'wish made ✦';
          if (window.Effects) window.Effects.burstConfetti(28);
          if (window.Nav) window.Nav.setNextEnabled(true);
        }
      }
    });
  });
})();
