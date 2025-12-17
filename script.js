// ============================================
// AUDIO CONTEXT & SETUP
// ============================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
let masterGain = audioContext.createGain();
masterGain.connect(audioContext.destination);

// Note frequencies (extended range)
const noteFrequencies = {
    'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56,
    'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00,
    'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
    'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
    'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
    'C5': 523.25
};

// Extended song library
const songs = {
    twinkle: [
        ['C4', 500], ['C4', 500], ['G4', 500], ['G4', 500],
        ['A4', 500], ['A4', 500], ['G4', 1000],
        ['F4', 500], ['F4', 500], ['E4', 500], ['E4', 500],
        ['D4', 500], ['D4', 500], ['C4', 1000]
    ],
    happy: [
        ['C4', 300], ['C4', 200], ['D4', 500], ['C4', 500],
        ['F4', 500], ['E4', 1000],
        ['C4', 300], ['C4', 200], ['D4', 500], ['C4', 500],
        ['G4', 500], ['F4', 1000]
    ],
    jingle: [
        ['E4', 500], ['E4', 500], ['E4', 1000],
        ['E4', 500], ['E4', 500], ['E4', 1000],
        ['E4', 500], ['G4', 500], ['C4', 500], ['D4', 500],
        ['E4', 1500]
    ],
    mario: [
        ['E4', 200], ['E4', 200], ['E4', 200], ['C4', 200],
        ['E4', 400], ['G4', 800], ['G3', 800],
        ['C4', 400], ['G3', 400], ['E3', 400]
    ],
    starwars: [
        ['C4', 500], ['G4', 500], ['F4', 150], ['E4', 150], ['D4', 150],
        ['C5', 500], ['G4', 250], ['F4', 150], ['E4', 150], ['D4', 150],
        ['C5', 500], ['G4', 250]
    ],
    tetris: [
        ['E4', 400], ['B3', 200], ['C4', 200], ['D4', 400],
        ['C4', 200], ['B3', 200], ['A3', 400], ['A3', 200],
        ['C4', 200], ['E4', 400], ['D4', 200], ['C4', 200],
        ['B3', 600], ['C4', 200], ['D4', 400], ['E4', 400]
    ],
    pirates: [
        ['D4', 300], ['D4', 300], ['D4', 200], ['D4', 200],
        ['D4', 200], ['D4', 200], ['D4', 200], ['E4', 200],
        ['F4', 600], ['F4', 600], ['F4', 200], ['F4', 200],
        ['F4', 200], ['F4', 200], ['F4', 200], ['G4', 200]
    ],
    zelda: [
        ['B4', 500], ['A4', 1000], ['B4', 500], ['A4', 1000],
        ['B4', 500], ['A4', 500], ['G4', 500], ['F#4', 1000]
    ]
};

// ============================================
// STATE MANAGEMENT
// ============================================
let state = {
    currentSong: 'twinkle',
    isPlaying: false,
    isPaused: false,
    isRecording: false,
    isLooping: false,
    metronomeActive: false,
    currentInstrument: 'sine',
    currentEffect: 'none',
    playbackSpeed: 1.0,
    volume: 0.7,
    bpm: 120,
    recording: [],
    recordingStartTime: 0,
    notesPlayed: 0,
    streak: 0,
    sessionStartTime: Date.now(),
    activeOscillators: [],
    playbackTimeouts: [],
    metronomeInterval: null
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    keys: document.querySelectorAll('.key'),
    songButtons: document.querySelectorAll('.song-btn'),
    playBtn: document.getElementById('playBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    stopBtn: document.getElementById('stopBtn'),
    recordBtn: document.getElementById('recordBtn'),
    playRecordingBtn: document.getElementById('playRecordingBtn'),
    volumeSlider: document.getElementById('volumeSlider'),
    speedSlider: document.getElementById('speedSlider'),
    instrumentSelect: document.getElementById('instrumentSelect'),
    effectButtons: document.querySelectorAll('.effect-btn'),
    metronomeBtn: document.getElementById('metronomeBtn'),
    loopBtn: document.getElementById('loopBtn'),
    randomBtn: document.getElementById('randomBtn'),
    clearBtn: document.getElementById('clearBtn'),
    bpmInput: document.getElementById('bpmInput'),
    nowPlaying: document.getElementById('nowPlaying'),
    currentSongSpan: document.getElementById('currentSong'),
    recordingStatus: document.getElementById('recordingStatus'),
    volumeValue: document.getElementById('volumeValue'),
    speedValue: document.getElementById('speedValue'),
    notesPlayedSpan: document.getElementById('notesPlayed'),
    sessionTimeSpan: document.getElementById('sessionTime'),
    streakSpan: document.getElementById('streak'),
    canvas: document.getElementById('visualizer'),
    ctx: document.getElementById('visualizer').getContext('2d'),
    helpBtn: document.getElementById('helpBtn'),
    helpModal: document.getElementById('helpModal'),
    closeModal: document.getElementById('closeModal'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    themeBtn: document.getElementById('themeBtn'),
    shareBtn: document.getElementById('shareBtn')
};

// ============================================
// INITIALIZATION
// ============================================
function init() {
    setupEventListeners();
    createParticles();
    setupVisualizer();
    updateVolume();
    selectSong('twinkle');
    startSessionTimer();
    updateStats();
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Piano keys
    elements.keys.forEach(key => {
        key.addEventListener('click', () => handleKeyPress(key));
    });

    // Physical keyboard
    document.addEventListener('keydown', handleKeyboardDown);
    document.addEventListener('keyup', handleKeyboardUp);

    // Song selection
    elements.songButtons.forEach(btn => {
        btn.addEventListener('click', () => selectSong(btn.dataset.song));
    });

    // Playback controls
    elements.playBtn.addEventListener('click', playSong);
    elements.pauseBtn.addEventListener('click', pauseSong);
    elements.stopBtn.addEventListener('click', stopSong);

    // Recording
    elements.recordBtn.addEventListener('click', toggleRecording);
    elements.playRecordingBtn.addEventListener('click', playRecording);

    // Controls
    elements.volumeSlider.addEventListener('input', updateVolume);
    elements.speedSlider.addEventListener('input', updateSpeed);
    elements.instrumentSelect.addEventListener('change', changeInstrument);
    elements.bpmInput.addEventListener('change', updateBPM);

    // Effects
    elements.effectButtons.forEach(btn => {
        btn.addEventListener('click', () => selectEffect(btn.dataset.effect));
    });

    // Tools
    elements.metronomeBtn.addEventListener('click', toggleMetronome);
    elements.loopBtn.addEventListener('click', toggleLoop);
    elements.randomBtn.addEventListener('click', playRandomNotes);
    elements.clearBtn.addEventListener('click', clearRecording);

    // Modal & UI
    elements.helpBtn.addEventListener('click', () => elements.helpModal.classList.remove('hidden'));
    elements.closeModal.addEventListener('click', () => elements.helpModal.classList.add('hidden'));
    elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
    elements.themeBtn.addEventListener('click', changeTheme);
    elements.shareBtn.addEventListener('click', shareApp);

    // Window resize
    window.addEventListener('resize', resizeVisualizer);
}

// ============================================
// KEYBOARD HANDLING
// ============================================
function handleKeyPress(keyElement) {
    const note = keyElement.dataset.note;
    playNote(note);
    animateKey(keyElement);

    if (state.isRecording) {
        recordNote(note);
    }

    state.notesPlayed++;
    state.streak++;
    updateStats();
}

function handleKeyboardDown(e) {
    // Prevent default for special keys
    if (['Space', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
    }

    // Shortcuts
    if (e.code === 'Space') return state.isPlaying ? pauseSong() : playSong();
    if (e.code === 'Escape') return stopSong();
    if (e.key === 'r' || e.key === 'R') return toggleRecording();
    if (e.key === 'p' || e.key === 'P') return playRecording();
    if (e.key === 'l' || e.key === 'L') return toggleLoop();
    if (e.key === 'm' || e.key === 'M') return toggleMetronome();
    if (e.code === 'ArrowUp') return adjustVolume(5);
    if (e.code === 'ArrowDown') return adjustVolume(-5);
    if (e.code === 'ArrowRight') return adjustSpeed(0.1);
    if (e.code === 'ArrowLeft') return adjustSpeed(-0.1);

    // Piano keys
    const key = document.querySelector(`[data-key="${e.key.toLowerCase()}"]`);
    if (key && !key.classList.contains('active')) {
        handleKeyPress(key);
    }
}

function handleKeyboardUp(e) {
    const key = document.querySelector(`[data-key="${e.key.toLowerCase()}"]`);
    if (key) {
        key.classList.remove('active');
    }
}

// ============================================
// AUDIO PLAYBACK
// ============================================
function playNote(note, duration = 300) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);

    // Apply effects
    const effectNode = applyEffect(gainNode);
    effectNode.connect(masterGain);

    oscillator.frequency.value = noteFrequencies[note];
    oscillator.type = state.currentInstrument;

    // ADSR Envelope
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);

    oscillator.start(now);
    oscillator.stop(now + duration / 1000);

    state.activeOscillators.push(oscillator);

    // Visual effects
    animateVisualizer(note);
    createMusicNote();

    // Cleanup
    setTimeout(() => {
        const index = state.activeOscillators.indexOf(oscillator);
        if (index > -1) state.activeOscillators.splice(index, 1);
    }, duration);
}

function applyEffect(inputNode) {
    switch (state.currentEffect) {
        case 'reverb':
            const convolver = audioContext.createConvolver();
            convolver.buffer = createReverbBuffer();
            inputNode.connect(convolver);
            return convolver;

        case 'delay':
            const delay = audioContext.createDelay();
            const feedback = audioContext.createGain();
            delay.delayTime.value = 0.3;
            feedback.gain.value = 0.4;
            inputNode.connect(delay);
            delay.connect(feedback);
            feedback.connect(delay);
            return delay;

        case 'distortion':
            const distortion = audioContext.createWaveShaper();
            distortion.curve = makeDistortionCurve(400);
            inputNode.connect(distortion);
            return distortion;

        default:
            return inputNode;
    }
}

function createReverbBuffer() {
    const rate = audioContext.sampleRate;
    const length = rate * 2;
    const buffer = audioContext.createBuffer(2, length, rate);
    for (let channel = 0; channel < 2; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
        }
    }
    return buffer;
}

function makeDistortionCurve(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < samples; i++) {
        const x = (i * 2) / samples - 1;
        curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
}

// ============================================
// SONG PLAYBACK
// ============================================
function playSong() {
    if (state.isPlaying && !state.isPaused) return;

    if (state.isPaused) {
        state.isPaused = false;
        elements.playBtn.innerHTML = '<i class="fas fa-play"></i> Play';
        return;
    }

    state.isPlaying = true;
    state.isPaused = false;
    elements.playBtn.disabled = true;
    elements.pauseBtn.disabled = false;
    elements.nowPlaying.classList.remove('hidden');
    elements.currentSongSpan.textContent = formatSongName(state.currentSong);

    const songData = songs[state.currentSong];
    playSongSequence(songData);
}

function playSongSequence(songData) {
    let currentTime = 0;

    songData.forEach(([note, duration], index) => {
        const adjustedDuration = duration / state.playbackSpeed;

        const timeout = setTimeout(() => {
            if (!state.isPlaying || state.isPaused) return;

            playNote(note, adjustedDuration);

            const keyElement = document.querySelector(`[data-note="${note}"]`);
            if (keyElement) animateKey(keyElement);

            if (index === songData.length - 1) {
                setTimeout(() => {
                    if (state.isLooping) {
                        playSongSequence(songData);
                    } else {
                        stopSong();
                    }
                }, adjustedDuration);
            }
        }, currentTime);

        state.playbackTimeouts.push(timeout);
        currentTime += adjustedDuration;
    });
}

function pauseSong() {
    state.isPaused = !state.isPaused;
    if (state.isPaused) {
        elements.pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
    } else {
        elements.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    }
}

function stopSong() {
    state.isPlaying = false;
    state.isPaused = false;
    elements.playBtn.disabled = false;
    elements.pauseBtn.disabled = false;
    elements.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    elements.nowPlaying.classList.add('hidden');

    // Stop all oscillators
    state.activeOscillators.forEach(osc => {
        try { osc.stop(); } catch (e) { }
    });
    state.activeOscillators = [];

    // Clear timeouts
    state.playbackTimeouts.forEach(timeout => clearTimeout(timeout));
    state.playbackTimeouts = [];
}

function selectSong(songName) {
    state.currentSong = songName;
    elements.songButtons.forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.song === songName);
    });
}

// ============================================
// RECORDING
// ============================================
function toggleRecording() {
    if (state.isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

function startRecording() {
    state.isRecording = true;
    state.recording = [];
    state.recordingStartTime = Date.now();
    elements.recordBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
    elements.recordBtn.classList.add('bg-red-700');
    elements.recordingStatus.classList.remove('hidden');
}

function stopRecording() {
    state.isRecording = false;
    elements.recordBtn.innerHTML = '<i class="fas fa-circle"></i> Record';
    elements.recordBtn.classList.remove('bg-red-700');
    elements.recordingStatus.classList.add('hidden');

    if (state.recording.length > 0) {
        elements.playRecordingBtn.disabled = false;
    }
}

function recordNote(note) {
    const timestamp = Date.now() - state.recordingStartTime;
    state.recording.push({ note, timestamp });
}

function playRecording() {
    if (state.recording.length === 0) return;

    elements.playRecordingBtn.disabled = true;

    state.recording.forEach(({ note, timestamp }) => {
        setTimeout(() => {
            playNote(note);
            const keyElement = document.querySelector(`[data-note="${note}"]`);
            if (keyElement) animateKey(keyElement);
        }, timestamp / state.playbackSpeed);
    });

    const lastNote = state.recording[state.recording.length - 1];
    setTimeout(() => {
        elements.playRecordingBtn.disabled = false;
    }, lastNote.timestamp / state.playbackSpeed + 500);
}

function clearRecording() {
    state.recording = [];
    elements.playRecordingBtn.disabled = true;
    state.notesPlayed = 0;
    state.streak = 0;
    updateStats();
}

// ============================================
// CONTROLS & SETTINGS
// ============================================
function updateVolume() {
    state.volume = elements.volumeSlider.value / 100;
    masterGain.gain.value = state.volume;
    elements.volumeValue.textContent = elements.volumeSlider.value + '%';
}

function updateSpeed() {
    state.playbackSpeed = parseFloat(elements.speedSlider.value);
    elements.speedValue.textContent = state.playbackSpeed.toFixed(1) + 'x';
}

function changeInstrument() {
    state.currentInstrument = elements.instrumentSelect.value;
}

function selectEffect(effect) {
    state.currentEffect = effect;
    elements.effectButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.effect === effect);
    });
}

function updateBPM() {
    state.bpm = parseInt(elements.bpmInput.value);
    if (state.metronomeActive) {
        stopMetronome();
        startMetronome();
    }
}

function adjustVolume(delta) {
    const newValue = Math.max(0, Math.min(100, parseInt(elements.volumeSlider.value) + delta));
    elements.volumeSlider.value = newValue;
    updateVolume();
}

function adjustSpeed(delta) {
    const newValue = Math.max(0.5, Math.min(2, parseFloat(elements.speedSlider.value) + delta));
    elements.speedSlider.value = newValue.toFixed(1);
    updateSpeed();
}

function toggleLoop() {
    state.isLooping = !state.isLooping;
    elements.loopBtn.classList.toggle('bg-purple-700', state.isLooping);
    elements.loopBtn.innerHTML = state.isLooping
        ? '<i class="fas fa-redo"></i> Loop ON'
        : '<i class="fas fa-redo"></i> Loop';
}

// ============================================
// METRONOME
// ============================================
function toggleMetronome() {
    if (state.metronomeActive) {
        stopMetronome();
    } else {
        startMetronome();
    }
}

function startMetronome() {
    state.metronomeActive = true;
    elements.metronomeBtn.classList.add('bg-indigo-700');
    elements.metronomeBtn.innerHTML = '<i class="fas fa-drum"></i> Stop';

    const interval = (60 / state.bpm) * 1000;

    playMetronomeClick();
    state.metronomeInterval = setInterval(() => {
        playMetronomeClick();
    }, interval);
}

function stopMetronome() {
    state.metronomeActive = false;
    elements.metronomeBtn.classList.remove('bg-indigo-700');
    elements.metronomeBtn.innerHTML = '<i class="fas fa-drum"></i> Metronome';

    if (state.metronomeInterval) {
        clearInterval(state.metronomeInterval);
        state.metronomeInterval = null;
    }
}

function playMetronomeClick() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(masterGain);

    oscillator.frequency.value = 1000;
    oscillator.type = 'sine';

    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    oscillator.start(now);
    oscillator.stop(now + 0.05);
}

// ============================================
// RANDOM NOTES
// ============================================
function playRandomNotes() {
    const notes = Object.keys(noteFrequencies);
    const duration = 5000;
    const interval = 200;
    const iterations = duration / interval;

    for (let i = 0; i < iterations; i++) {
        setTimeout(() => {
            const randomNote = notes[Math.floor(Math.random() * notes.length)];
            playNote(randomNote, 150);

            const keyElement = document.querySelector(`[data-note="${randomNote}"]`);
            if (keyElement) animateKey(keyElement);
        }, i * interval);
    }
}

// ============================================
// ANIMATIONS
// ============================================
function animateKey(keyElement) {
    keyElement.classList.add('active', 'ripple');

    setTimeout(() => keyElement.classList.remove('active'), 150);
    setTimeout(() => keyElement.classList.remove('ripple'), 600);
}

function animateVisualizer(note) {
    const bars = 64;
    const barHeights = [];

    const frequency = noteFrequencies[note];
    const intensity = (frequency / 523.25) * 0.8 + 0.2;

    for (let i = 0; i < bars; i++) {
        const height = Math.random() * elements.canvas.height * intensity;
        barHeights.push(height);
    }

    drawVisualizer(barHeights);

    setTimeout(() => {
        const fadedHeights = barHeights.map(h => h * 0.3);
        drawVisualizer(fadedHeights);
    }, 100);

    setTimeout(() => drawVisualizer([]), 200);
}

function drawVisualizer(barHeights) {
    const ctx = elements.ctx;
    const canvas = elements.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bars = 64;
    const barWidth = canvas.width / bars;

    for (let i = 0; i < bars; i++) {
        const height = barHeights[i] || 3;
        const x = i * barWidth;
        const y = canvas.height - height;

        const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(0.5, '#764ba2');
        gradient.addColorStop(1, '#f093fb');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 1, height);
    }
}

// ============================================
// VISUAL EFFECTS
// ============================================
function createParticles() {
    const container = document.querySelector('.particles-container');
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 4 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 3) + 's';
        particle.style.width = (Math.random() * 3 + 2) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

function createMusicNote() {
    const container = document.querySelector('.music-notes-container');
    const note = document.createElement('div');
    note.className = 'music-note';
    note.textContent = ['♪', '♫', '♬', '♩'][Math.floor(Math.random() * 4)];
    note.style.left = Math.random() * 100 + '%';
    note.style.color = ['#667eea', '#764ba2', '#f093fb', '#4facfe'][Math.floor(Math.random() * 4)];
    note.style.fontSize = (Math.random() * 20 + 20) + 'px';

    container.appendChild(note);

    setTimeout(() => note.remove(), 8000);
}

function setupVisualizer() {
    resizeVisualizer();
    drawVisualizer([]);
}

function resizeVisualizer() {
    elements.canvas.width = elements.canvas.offsetWidth;
    elements.canvas.height = elements.canvas.offsetHeight;
}

// ============================================
// STATS & SESSION
// ============================================
function updateStats() {
    elements.notesPlayedSpan.textContent = state.notesPlayed;
    elements.streakSpan.textContent = state.streak;
}

function startSessionTimer() {
    setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.sessionStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        elements.sessionTimeSpan.textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// ============================================
// UI FEATURES
// ============================================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        elements.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        document.exitFullscreen();
        elements.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
}

const themes = [
    'from-purple-900 via-blue-900 to-indigo-900',
    'from-pink-900 via-red-900 to-orange-900',
    'from-green-900 via-teal-900 to-cyan-900',
    'from-yellow-900 via-orange-900 to-red-900',
    'from-indigo-900 via-purple-900 to-pink-900'
];
let currentThemeIndex = 0;

function changeTheme() {
    document.body.classList.remove(themes[currentThemeIndex]);
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    document.body.classList.add(themes[currentThemeIndex]);
}

function shareApp() {
    const text = `🎹 Check out this awesome Musical Keyboard! I've played ${state.notesPlayed} notes so far!`;

    if (navigator.share) {
        navigator.share({
            title: 'Ultimate Musical Keyboard',
            text: text,
            url: window.location.href
        }).catch(() => { });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(text + ' ' + window.location.href);
        alert('Link copied to clipboard!');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatSongName(songName) {
    const names = {
        twinkle: 'Twinkle Twinkle Little Star',
        happy: 'Happy Birthday',
        jingle: 'Jingle Bells',
        mario: 'Super Mario Theme',
        starwars: 'Star Wars Theme',
        tetris: 'Tetris Theme',
        pirates: 'Pirates of the Caribbean',
        zelda: 'Legend of Zelda'
    };
    return names[songName] || songName;
}

// ============================================
// INITIALIZE APP
// ============================================
document.addEventListener('DOMContentLoaded', init);

// Prevent context menu on keys
elements.keys.forEach(key => {
    key.addEventListener('contextmenu', e => e.preventDefault());
});

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.isPlaying) {
        pauseSong();
    }
});

// Console easter egg
console.log('%c🎹 Ultimate Musical Keyboard', 'font-size: 24px; font-weight: bold; color: #667eea;');
console.log('%cBuilt with ❤️ using Web Audio API', 'font-size: 14px; color: #764ba2;');
console.log('%cTry these shortcuts: Space (play/pause), R (record), M (metronome)', 'font-size: 12px; color: #999;');
