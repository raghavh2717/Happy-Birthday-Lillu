/* ==========================================================================
   VIDEO.JS
   Screen 7 — Our Video. A single clip that autoplays muted (required by
   browsers for autoplay) the moment its screen becomes active, and pauses
   + resets whenever the visitor navigates away. No native controls are
   shown — just a small mute/unmute toggle in the corner.
   To use your own clip: drop an MP4 into assets/videos/ named video1.mp4
   (optional poster image: assets/images/video-poster1.jpg).
   ========================================================================== */

(function () {
  const video = document.getElementById('mainVideo');
  const soundToggle = document.getElementById('soundToggle');
  const videosScreen = document.getElementById('screen-videos');

  if (!video || !videosScreen) return;

  const screenIndex = Array.from(document.querySelectorAll('.screen')).indexOf(videosScreen);

  function playVideo() {
    video.currentTime = 0;
    video.muted = false;
    soundToggle.classList.add('unmuted');
    const playPromise = video.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {
        // Some browsers still block autoplay-with-sound even after a
        // navigation click — fall back to muted autoplay so the clip
        // still plays, and let her unmute manually via the toggle.
        video.muted = true;
        soundToggle.classList.remove('unmuted');
        video.play().catch(() => { /* autoplay blocked entirely — silently ignore */ });
      });
    }
  }

  function stopVideo() {
    video.pause();
  }

  document.addEventListener('screen:change', (e) => {
    if (e.detail.index === screenIndex) {
      playVideo();
    } else {
      stopVideo();
    }
  });

  // Play immediately if the videos screen already happens to be active
  // (e.g. someone navigates straight in via a deep link in the future).
  if (videosScreen.classList.contains('active')) playVideo();

  soundToggle.addEventListener('click', () => {
    video.muted = !video.muted;
    soundToggle.classList.toggle('unmuted', !video.muted);
  });

  // Robust error handling — inline onerror already swaps in the
  // placeholder, this is a backup since media error events don't bubble.
  video.addEventListener('error', () => {
    video.style.display = 'none';
    const placeholder = video.nextElementSibling;
    if (placeholder) placeholder.style.display = 'flex';
  }, true);
})();
