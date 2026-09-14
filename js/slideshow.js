/* ==========================================================================
   SLIDESHOW.JS
   Screen 6 — Memory Gallery. A static photo slideshow: it never moves on
   its own. It only advances when she taps the Next/Prev arrows or a dot —
   no auto-play, no swipe.
   ========================================================================== */

(function () {
  const track = document.getElementById('slideshowTrack');
  const dotsWrap = document.getElementById('slideshowDots');
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');

  if (!track) return;

  const slides = Array.from(track.children);
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'sdot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
    dot.addEventListener('click', () => show(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function show(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
  }

  function nextSlide() { show(index + 1); }
  function prevSlide() { show(index - 1); }

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // Intentionally no auto-advance timer and no swipe/drag handling here —
  // the gallery stays completely still until a button or dot is tapped.
})();
