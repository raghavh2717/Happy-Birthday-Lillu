/* ==========================================================================
   SCROLL-HINT.JS
   Some screens (long letters, the reasons grid, etc.) can be taller than
   the viewport on smaller screens, which pushes the Continue button below
   the fold. This shows a small bouncing "keep scrolling" hint whenever
   that's the case, and hides it once she's scrolled near the bottom
   (or the button is otherwise visible) so it never lingers unnecessarily.
   ========================================================================== */

(function () {
  const hint = document.getElementById('scrollHint');
  if (!hint) return;

  let currentInner = null;

  function getActiveInner() {
    const activeScreen = document.querySelector('.screen.active');
    return activeScreen ? activeScreen.querySelector('.screen-inner') : null;
  }

  function checkOverflow() {
    const inner = getActiveInner();
    if (!inner) {
      hint.classList.remove('show');
      return;
    }
    const hasOverflow = inner.scrollHeight > inner.clientHeight + 16;
    const nearBottom = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 24;
    hint.classList.toggle('show', hasOverflow && !nearBottom);
  }

  function bindActiveScreenScroll() {
    if (currentInner) currentInner.removeEventListener('scroll', checkOverflow);
    currentInner = getActiveInner();
    if (currentInner) currentInner.addEventListener('scroll', checkOverflow, { passive: true });
  }

  // Clicking the hint itself scrolls the current screen down a bit —
  // a helpful shortcut, not just a passive indicator.
  hint.addEventListener('click', () => {
    const inner = getActiveInner();
    if (inner) inner.scrollBy({ top: inner.clientHeight * 0.7, behavior: 'smooth' });
  });

  document.addEventListener('screen:change', () => {
    bindActiveScreenScroll();
    // Wait for the screen transition + entrance animation to finish
    // before measuring, otherwise heights can be measured mid-animation.
    setTimeout(checkOverflow, 550);
  });

  document.addEventListener('app:loaded', () => {
    bindActiveScreenScroll();
    setTimeout(checkOverflow, 700);
  });

  window.addEventListener('resize', checkOverflow);

  // Fallback in case app:loaded is missed for any reason.
  window.addEventListener('load', () => {
    bindActiveScreenScroll();
    setTimeout(checkOverflow, 900);
  });
})();
