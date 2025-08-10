const video = document.getElementById('videoPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const stopBtn = document.getElementById('stopBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progressContainer');
const currentTimeElem = document.getElementById('currentTime');
const durationElem = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const muteBtn = document.getElementById('muteBtn');
const fileInput = document.getElementById('fileInput');
const loadingOverlay = document.getElementById('loadingOverlay');

// Format time helper
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Play/Pause toggle
playPauseBtn.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        playPauseBtn.textContent = '⏸';
    } else {
        video.pause();
        playPauseBtn.textContent = '▶';
    }
});

// Stop
stopBtn.addEventListener('click', () => {
    video.pause();
    video.currentTime = 0;
    playPauseBtn.textContent = '▶';
});

// Fullscreen
fullscreenBtn.addEventListener('click', () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
    }
});

// Volume control
volumeSlider.addEventListener('input', () => {
    video.volume = volumeSlider.value;
    if (video.volume === 0) {
        muteBtn.textContent = '🔇';
    } else {
        muteBtn.textContent = '🔊';
    }
});

// Mute/unmute button
muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    if (video.muted) {
        muteBtn.textContent = '🔇';
        volumeSlider.value = 0;
    } else {
        muteBtn.textContent = '🔊';
        volumeSlider.value = video.volume;
    }
});

// Update progress bar and time
video.addEventListener('timeupdate', () => {
    if (video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        progress.style.width = percent + '%';
        currentTimeElem.textContent = formatTime(video.currentTime);
    }
});

video.addEventListener('loadedmetadata', () => {
    durationElem.textContent = formatTime(video.duration);
});

// Seek when clicking progress bar
progressContainer.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = clickX / width;
    video.currentTime = percent * video.duration;
});

// Load video file
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        video.src = url;
        video.load();
        playPauseBtn.textContent = '▶';
        currentTimeElem.textContent = '0:00';
        durationElem.textContent = '0:00';
        progress.style.width = '0%';
    }
});

// Loading overlay
video.addEventListener('loadstart', () => {
    loadingOverlay.classList.add('show');
});
video.addEventListener('canplay', () => {
    loadingOverlay.classList.remove('show');
});

// Reset play button on video end
video.addEventListener('ended', () => {
    playPauseBtn.textContent = '▶';
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        playPauseBtn.click();
    } else if (e.code === 'KeyF') {
        fullscreenBtn.click();
    } else if (e.code === 'KeyM') {
        muteBtn.click();
    }
});
