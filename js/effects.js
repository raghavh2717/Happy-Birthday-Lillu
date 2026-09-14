/* ==========================================================================
   EFFECTS.JS
   Reusable visual effects: floating hearts, cursor glow, confetti, fireworks.
   Exposes window.Effects so other scripts (proposal.js) can trigger bursts.
   ========================================================================== */

(function () {
  const HEART_PATH = 'M12 21s-7.5-4.6-10-9.2C.5 8.2 2.3 4.5 6 4a5 5 0 0 1 6 2 5 5 0 0 1 6-2c3.7.5 5.5 4.2 4 7.8C19.5 16.4 12 21 12 21z';
  const heartSVG = `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="${HEART_PATH}"/></svg>`;

  /* ---------------- Floating ambient hearts ---------------- */
  const fhWrap = document.getElementById('floatingHearts');

  function spawnFloatingHeart() {
    const h = document.createElement('div');
    h.className = 'fh';
    h.innerHTML = heartSVG;
    const size = 10 + Math.random() * 18;
    h.style.width = size + 'px';
    h.style.height = size + 'px';
    h.style.left = Math.random() * 100 + 'vw';
    h.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    const duration = 9 + Math.random() * 8;
    h.style.animationDuration = duration + 's';
    fhWrap.appendChild(h);
    setTimeout(() => h.remove(), duration * 1000 + 200);
  }

  setInterval(spawnFloatingHeart, 650);
  for (let i = 0; i < 10; i++) setTimeout(spawnFloatingHeart, i * 300);

  /* ---------------- Falling rose petals (variety alongside hearts) ---------------- */
  function spawnPetal() {
    const p = document.createElement('div');
    p.className = 'petal';
    const size = 8 + Math.random() * 10;
    p.style.width = size + 'px';
    p.style.height = size * 0.75 + 'px';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
    const hue = Math.random() > 0.5 ? '#ff6fa0' : '#e91e63';
    p.style.background = hue;
    p.style.borderRadius = '0 60% 0 60%';
    const duration = 10 + Math.random() * 9;
    p.style.animationDuration = duration + 's';
    fhWrap.appendChild(p);
    setTimeout(() => p.remove(), duration * 1000 + 200);
  }
  setInterval(spawnPetal, 1400);

  /* ---------------- Floating romantic words — soft ambient text ---------------- */
  const romanticWords = ['adored', 'cherished', 'treasured', 'always', 'forever', 'beloved', 'darling', 'mine'];

  function spawnRomanticWord() {
    const w = document.createElement('div');
    w.className = 'fh romantic-word';
    w.textContent = romanticWords[Math.floor(Math.random() * romanticWords.length)];
    w.style.left = (10 + Math.random() * 80) + 'vw';
    w.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    const duration = 11 + Math.random() * 6;
    w.style.animationDuration = duration + 's';
    fhWrap.appendChild(w);
    setTimeout(() => w.remove(), duration * 1000 + 200);
  }
  setInterval(spawnRomanticWord, 3200);

  /* ---------------- Twinkling stars ---------------- */
  const twinkleLayer = document.createElement('div');
  twinkleLayer.className = 'twinkle-layer';
  document.body.insertBefore(twinkleLayer, fhWrap.nextSibling);

  for (let i = 0; i < 40; i++) {
    const t = document.createElement('div');
    t.className = 'twinkle';
    t.style.left = Math.random() * 100 + 'vw';
    t.style.top = Math.random() * 100 + 'vh';
    t.style.animationDuration = (2 + Math.random() * 3) + 's';
    t.style.animationDelay = (Math.random() * 4) + 's';
    twinkleLayer.appendChild(t);
  }

  /* ---------------- Cursor glow (desktop only) ---------------- */
  const glow = document.getElementById('cursorGlow');
  const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (!isCoarsePointer) {
    let glowX = window.innerWidth / 2;
    let glowY = window.innerHeight / 2;
    let targetX = glowX;
    let targetY = glowY;

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      glow.classList.add('active');
    });

    document.addEventListener('mouseleave', () => glow.classList.remove('active'));

    function animateGlow() {
      glowX += (targetX - glowX) * 0.15;
      glowY += (targetY - glowY) * 0.15;
      glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  /* ---------------- Confetti burst ---------------- */
  const confettiLayer = document.getElementById('confettiLayer');
  const confettiColors = ['#ff3e7f', '#ff6fa0', '#d4af37', '#ff9dc0', '#e8cd7a'];

  function burstConfetti(count = 60) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const piece = document.createElement('div');
        const isHeart = Math.random() > 0.4;
        piece.className = 'confetti-piece' + (isHeart ? ' heart' : '');
        if (isHeart) {
          piece.innerHTML = heartSVG;
          const size = 10 + Math.random() * 16;
          piece.style.width = size + 'px';
          piece.style.height = size + 'px';
        } else {
          piece.style.width = piece.style.height = (5 + Math.random() * 6) + 'px';
          piece.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
          piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        }
        piece.style.left = Math.random() * 100 + 'vw';
        const dur = 3 + Math.random() * 2.5;
        piece.style.animationDuration = dur + 's';
        confettiLayer.appendChild(piece);
        setTimeout(() => piece.remove(), dur * 1000 + 200);
      }, i * 30);
    }
  }

  /* ---------------- Fireworks burst ---------------- */
  const fireworksLayer = document.getElementById('fireworksLayer');
  const fireworkColors = ['#ff3e7f', '#ff9dc0', '#d4af37', '#fff0f6'];

  function launchFirework(x, y) {
    const particleCount = 22;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const distance = 60 + Math.random() * 60;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      const p = document.createElement('div');
      p.className = 'firework-particle';
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.background = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
      p.style.boxShadow = `0 0 8px ${p.style.background}`;
      fireworksLayer.appendChild(p);

      if (window.gsap) {
        gsap.to(p, {
          x: dx, y: dy,
          opacity: 0,
          duration: 0.9 + Math.random() * 0.5,
          ease: 'power2.out',
          onComplete: () => p.remove()
        });
      } else {
        p.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
        requestAnimationFrame(() => {
          p.style.transform = `translate(${dx}px, ${dy}px)`;
          p.style.opacity = '0';
        });
        setTimeout(() => p.remove(), 1000);
      }
    }
  }

  function fireworksShow(bursts = 5) {
    for (let i = 0; i < bursts; i++) {
      setTimeout(() => {
        const x = window.innerWidth * (0.2 + Math.random() * 0.6);
        const y = window.innerHeight * (0.15 + Math.random() * 0.4);
        launchFirework(x, y);
      }, i * 450);
    }
  }

  /* ---------------- Click ripple, attached to every button ---------------- */
  function attachRipples() {
    document.querySelectorAll('button').forEach((btn) => {
      if (btn.dataset.rippleBound) return;
      btn.dataset.rippleBound = 'true';
      btn.classList.add('ripple-btn');
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.4;
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });
    });
  }

  /* ---------------- 3D tilt-on-hover for cards/photos ---------------- */
  function attachTilt(selector) {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    document.querySelectorAll(selector).forEach((el) => {
      if (el.dataset.tiltBound) return;
      el.dataset.tiltBound = 'true';
      el.classList.add('tilt');
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(600px) rotateX(${py * -8}deg) rotateY(${px * 8}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* ---------------- Animated heart-draw (SVG stroke reveal) ---------------- */
  function drawHeart(svgEl) {
    if (!svgEl) return;
    const path = svgEl.querySelector('path');
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    if (window.gsap) {
      gsap.to(path, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' });
      gsap.fromTo(svgEl, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' });
    } else {
      path.style.transition = 'stroke-dashoffset 1.4s ease';
      requestAnimationFrame(() => { path.style.strokeDashoffset = '0'; });
    }
  }

  /* Expose a small public API for other scripts */
  window.Effects = {
    burstConfetti,
    fireworksShow,
    attachRipples,
    attachTilt,
    drawHeart,
    heartSVG
  };
})();
