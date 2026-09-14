/* ==========================================================================
   MUSIC.JS
   Background music player. Browsers block autoplay-with-sound, so this
   toggles on explicit click, and also makes one quiet attempt to start
   on the visitor's first tap anywhere on the page.

   There are THREE tracks, played in order and never reverted:
   - assets/audio/music.mp3         → plays from the very start
   - assets/audio/music-secret.mp3  → swaps in the moment she enters the
     correct 4-digit code on the locked-note screen (screen-secret)
   - assets/audio/music-final.mp3   → swaps in the moment the closing
     letter (screen-closing, the very last letter) becomes active

   Each swap is one-way: once she's unlocked the note or reached the
   closing letter, the music never swaps back, even if she navigates
   backward with the back button.
   ========================================================================== */

(function () {
  const bgm = document.getElementById('bgm');
  const bgmSecret = document.getElementById('bgmSecret');
  const bgmFinal = document.getElementById('bgmFinal');
  const musicToggle = document.getElementById('musicToggle');
  const musicBars = document.querySelector('.music-bars');

  let playing = false;
  let currentTrack = bgm;

  function setPlayingUI(isPlaying) {
    playing = isPlaying;
    musicBars.classList.toggle('playing', isPlaying);
  }

  function playCurrent() {
    currentTrack.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
  }

  function switchTrack(nextTrack) {
    if (nextTrack === currentTrack) return;

    const wasPlaying = playing;
    currentTrack.pause();
    currentTrack.currentTime = 0;
    currentTrack = nextTrack;

    if (wasPlaying) {
      playCurrent();
    } else {
      setPlayingUI(false);
    }
  }

  musicToggle.addEventListener('click', () => {
    if (playing) {
      currentTrack.pause();
      setPlayingUI(false);
    } else {
      playCurrent();
    }
  });

  function tryAutoStart() {
    if (!playing) playCurrent();
    document.removeEventListener('click', tryAutoStart);
  }
  document.addEventListener('click', tryAutoStart);

  // Stage 2: the moment she enters the correct code on the lock screen,
  // swap to the second track. Dispatched by secret.js.
  document.addEventListener('secret:unlocked', () => {
    switchTrack(bgmSecret);
  });

  // Stage 3: the moment the closing letter (the last letter of the site)
  // becomes the active screen, swap to the third track — for good.
  const closingScreen = document.getElementById('screen-closing');
  const screens = Array.from(document.querySelectorAll('.screen'));
  const closingIndex = closingScreen ? screens.indexOf(closingScreen) : -1;

  // The video screen has its own sound, so the background track ducks
  // out while it's showing and comes back once she moves on (Next).
  const videosScreen = document.getElementById('screen-videos');
  const videosIndex = videosScreen ? screens.indexOf(videosScreen) : -1;
  let resumeAfterVideo = false;

  document.addEventListener('screen:change', (e) => {
    if (closingIndex !== -1 && e.detail.index === closingIndex) {
      switchTrack(bgmFinal);
    }

    if (videosIndex !== -1) {
      if (e.detail.index === videosIndex) {
        resumeAfterVideo = playing;
        if (playing) {
          currentTrack.pause();
          setPlayingUI(false);
        }
      } else if (resumeAfterVideo) {
        resumeAfterVideo = false;
        playCurrent();
      }
    }
  });
})();
