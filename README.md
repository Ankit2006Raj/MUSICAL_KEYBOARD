# 🎹 Ultimate Musical Keyboard - Pro Edition

A professional web-based music creation studio built with vanilla JavaScript and the Web Audio API. Create, record, and share your musical masterpieces directly in your browser!
<img width="1363" height="638" alt="image" src="https://github.com/user-attachments/assets/e60b9771-39a1-40c5-b564-6fcbfdf091a8" />
<img width="1102" height="536" alt="image" src="https://github.com/user-attachments/assets/fe6693ea-8a28-4849-9125-ffb8e28abf0d" />

## ✨ Features

### 🎵 Core Features
- **25-Key Virtual Piano** - Extended keyboard with 2+ octaves (C3 to C5)
- **8 Pre-loaded Songs** - Twinkle Twinkle, Happy Birthday, Jingle Bells, Mario, Star Wars, Tetris, Pirates of the Caribbean, and Zelda themes
- **Recording & Playback** - Record your performances and play them back
- **Real-time Audio Visualizer** - Dynamic waveform visualization with gradient effects

### 🎸 Instruments & Effects
- **4 Instrument Types**: Piano (sine), Guitar (square), Brass (sawtooth), Strings (triangle)
- **5 Sound Effects**: Reverb, Delay, Distortion, Chorus, Vibrato
- **Adjustable Volume & Speed** - Control playback speed (0.5x - 2x) and volume (0-100%)

### 🎼 Advanced Tools
- **Metronome** - Adjustable BPM (40-240) for practice
- **Loop Mode** - Continuous song playback
- **Random Notes** - Generate random musical sequences
- **Session Statistics** - Track notes played, session time, and streak

### ⌨️ Keyboard Shortcuts
- `Space` - Play/Pause current song
- `Esc` - Stop playback
- `R` - Start/Stop recording
- `P` - Play recording
- `L` - Toggle loop mode
- `M` - Toggle metronome
- `↑/↓` - Adjust volume
- `←/→` - Adjust playback speed

### 🎨 UI Features
- **Animated Background** - Floating particles and musical notes
- **Theme Switcher** - 5 different gradient themes
- **Fullscreen Mode** - Immersive experience
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern Glass-morphism UI** - Beautiful backdrop blur effects

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or build process required!

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ankit2006Rajand/ultimate-musical-keyboard.git
```

2. Navigate to the project directory:
```bash
cd ultimate-musical-keyboard
```

3. Open `index.html` in your browser:
```bash
# On Windows
start index.html

# On macOS
open index.html

# On Linux
xdg-open index.html
```

Or simply double-click the `index.html` file!

## 📖 Usage

### Playing Notes
- **Click** on piano keys with your mouse
- **Use keyboard** - Keys are mapped to QWERTY layout:
  - Lower octave: Z, S, X, D, C, V, G, B, H, N, J, M
  - Middle octave: Q, 2, W, 3, E, R, 5, T, 6, Y, 7, U, I

### Playing Songs
1. Select a song from the Song Library
2. Click the **Play** button
3. Adjust speed and volume as needed
4. Enable **Loop** for continuous playback

### Recording
1. Click the **Record** button (or press `R`)
2. Play notes on the keyboard
3. Click **Stop** to finish recording
4. Click **Play** in the Recording section to hear your recording

### Changing Instruments & Effects
- Select an instrument from the dropdown menu
- Click on effect buttons to apply audio effects
- Only one effect can be active at a time

## 🛠️ Technologies Used

- **HTML5** - Structure and semantic markup
- **CSS3** - Styling with animations and glass-morphism effects
- **JavaScript (ES6+)** - Core functionality and interactivity
- **Web Audio API** - Audio synthesis and effects processing
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Font Awesome** - Icon library

## 📁 Project Structure

```
ultimate-musical-keyboard/
│
├── index.html          # Main HTML file with UI structure
├── script.js           # JavaScript logic and Web Audio API implementation
├── style.css           # Custom styles and animations
└── README.md           # Project documentation
```

## 🎯 Key Components

### Audio Engine (`script.js`)
- **Audio Context Management** - Web Audio API initialization
- **Note Frequencies** - Precise frequency mapping for musical notes
- **Oscillator Control** - Dynamic sound generation
- **Effect Processing** - Real-time audio effect chains
- **ADSR Envelope** - Attack, Decay, Sustain, Release for natural sound

### Visual Effects (`style.css`)
- **Particle System** - Animated background particles
- **Music Notes Animation** - Floating musical symbols
- **Key Press Animations** - Ripple and press effects
- **Visualizer Canvas** - Real-time frequency visualization

## 🌟 Features in Detail

### Song Library
Each song is stored as an array of `[note, duration]` pairs:
```javascript
twinkle: [
    ['C4', 500], ['C4', 500], ['G4', 500], ['G4', 500],
    // ... more notes
]
```

### Recording System
Records notes with timestamps for accurate playback:
```javascript
{ note: 'C4', timestamp: 1250 }
```

### Effect Processing
Effects are applied using Web Audio API nodes:
- **Reverb**: ConvolverNode with impulse response
- **Delay**: DelayNode with feedback loop
- **Distortion**: WaveShaperNode with custom curve

## 📱 Responsive Design

The keyboard adapts to different screen sizes:
- **Desktop** (1024px+): Full 60px keys
- **Tablet** (768px-1024px): 50px keys
- **Mobile** (480px-768px): 45px keys
- **Small Mobile** (<480px): 35px keys

## 🎨 Customization

### Adding New Songs
Edit the `songs` object in `script.js`:
```javascript
const songs = {
    yourSong: [
        ['C4', 500], ['D4', 500], ['E4', 1000]
    ]
};
```

### Changing Themes
Modify the `themes` array in `script.js`:
```javascript
const themes = [
    'from-purple-900 via-blue-900 to-indigo-900',
    // Add your custom gradient
];
```

## 🐛 Known Issues

- Audio may not play on some mobile browsers until user interaction
- Safari may require additional permissions for Web Audio API
- Performance may vary on older devices

## 🔮 Future Enhancements

- [ ] MIDI keyboard support
- [ ] Export recordings as audio files
- [ ] More instruments and effects
- [ ] Sheet music display
- [ ] Multiplayer mode
- [ ] Cloud save for recordings
- [ ] Tutorial mode for beginners

## 👨‍💻 Author

**Ankit Raj**

- GitHub: [@Ankit2006Rajand](https://github.com/Ankit2006Raj)
- LinkedIn: [Ankit Raj](https://www.linkedin.com/in/ankit-raj-226a36309)
- Email: ankit9905163014@gmail.com

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Web Audio API documentation and community
- Font Awesome for icons
- Tailwind CSS for styling utilities
- All the musicians who inspired this project

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Ankit2006Rajand/ultimate-musical-keyboard/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⭐ Show Your Support

Give a ⭐️ if you like this project!

---

Made with ❤️ and passion for music by Ankit Raj
