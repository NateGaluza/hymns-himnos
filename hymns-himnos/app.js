const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const scrub = document.getElementById('scrub');
const curTimeEl = document.getElementById('curTime');
const durTimeEl = document.getElementById('durTime');
const volume = document.getElementById('volume');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const playlistEl = document.getElementById('playlist');

let tracks = [];
let currentIndex = 0;
let isScrubbing = false;

function formatTime(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

async function loadManifest() {
  try {
    const res = await fetch('manifest.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('manifest not found');
    tracks = await res.json();
  } catch (e) {
    tracks = [];
  }

  if (!tracks.length) {
    nowPlayingTitle.textContent = 'No hymns yet';
    playlistEl.innerHTML = '<li class="empty-state">Add audio files to the "hymns" folder and redeploy.</li>';
    return;
  }

  renderPlaylist();
  loadTrack(0, { autoplay: false });
}

function renderPlaylist() {
  playlistEl.innerHTML = '';
  tracks.forEach((track, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.innerHTML = `<span class="track-num">${i + 1}</span><span>${track.title}</span>`;
    btn.addEventListener('click', () => loadTrack(i, { autoplay: true }));
    li.appendChild(btn);
    li.id = `track-${i}`;
    playlistEl.appendChild(li);
  });
}

function loadTrack(index, { autoplay }) {
  if (!tracks.length) return;
  currentIndex = (index + tracks.length) % tracks.length;
  const track = tracks[currentIndex];

  audio.src = 'hymns/' + encodeURIComponent(track.file);
  nowPlayingTitle.textContent = track.title;

  document.querySelectorAll('.playlist li').forEach(li => li.classList.remove('active'));
  const activeLi = document.getElementById(`track-${currentIndex}`);
  if (activeLi) activeLi.classList.add('active');

  updateMediaSessionMetadata(track);

  if (autoplay) {
    audio.play().catch(() => {});
  }
}

function togglePlay() {
  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}

function setPlayingUI(playing) {
  playIcon.style.display = playing ? 'none' : 'block';
  pauseIcon.style.display = playing ? 'block' : 'none';
  playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  }
}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => loadTrack(currentIndex - 1, { autoplay: true }));
nextBtn.addEventListener('click', () => loadTrack(currentIndex + 1, { autoplay: true }));

audio.addEventListener('play', () => setPlayingUI(true));
audio.addEventListener('pause', () => setPlayingUI(false));
audio.addEventListener('ended', () => loadTrack(currentIndex + 1, { autoplay: true }));

audio.addEventListener('loadedmetadata', () => {
  durTimeEl.textContent = formatTime(audio.duration);
  scrub.max = Math.floor(audio.duration) || 100;
});

audio.addEventListener('timeupdate', () => {
  if (isScrubbing) return;
  curTimeEl.textContent = formatTime(audio.currentTime);
  scrub.value = Math.floor(audio.currentTime);
});

scrub.addEventListener('input', () => {
  isScrubbing = true;
  curTimeEl.textContent = formatTime(Number(scrub.value));
});
scrub.addEventListener('change', () => {
  audio.currentTime = Number(scrub.value);
  isScrubbing = false;
});

volume.addEventListener('input', () => {
  audio.volume = Number(volume.value);
});
audio.volume = Number(volume.value);

// Lock-screen / notification controls
function updateMediaSessionMetadata(track) {
  if (!('mediaSession' in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: 'Hymns & Himnos',
  });
}

if ('mediaSession' in navigator) {
  navigator.mediaSession.setActionHandler('play', () => audio.play().catch(() => {}));
  navigator.mediaSession.setActionHandler('pause', () => audio.pause());
  navigator.mediaSession.setActionHandler('previoustrack', () => loadTrack(currentIndex - 1, { autoplay: true }));
  navigator.mediaSession.setActionHandler('nexttrack', () => loadTrack(currentIndex + 1, { autoplay: true }));
  navigator.mediaSession.setActionHandler('seekto', (details) => {
    if (details.seekTime != null) audio.currentTime = details.seekTime;
  });
}

// Register service worker so the page can keep running / be added to home screen
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

loadManifest();
