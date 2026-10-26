const fs = require('fs');
const path = require('path');

// Ensure directories exist
const dirs = [
  path.join(__dirname, 'assets', 'audio'),
  path.join(__dirname, 'assets', 'images'),
  path.join(__dirname, 'assets', 'data')
];

dirs.forEach(d => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

// ==========================================
// 1. WAV FILE SYNTHESIS (16-bit PCM Mono)
// ==========================================
function createWavBuffer(sampleRate, durationSeconds, generatorFn) {
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const dataByteLength = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataByteLength);

  // RIFF Chunk
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataByteLength, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // PCM format
  buffer.writeUInt16LE(1, 22);  // Mono (1 channel)
  buffer.writeUInt32LE(sampleRate, 24); // Sample rate
  buffer.writeUInt32LE(sampleRate * 2, 28); // Byte rate
  buffer.writeUInt16LE(2, 32);  // Block align
  buffer.writeUInt16LE(16, 34); // Bits per sample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataByteLength, 40);

  // Write samples
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = generatorFn(t, i, numSamples);
    // Clamp to -1.0 .. 1.0
    sample = Math.max(-1, Math.min(1, sample));
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

// A. Ambient Wind Gust (2.5 seconds loopable feeling)
const windWav = createWavBuffer(44100, 3.0, (t, i, total) => {
  // Filtered white noise with slow sine modulation
  const envelope = Math.sin((t / 3.0) * Math.PI); // Smooth in & out
  const noise = (Math.random() * 2 - 1) * 0.4;
  const lowDrone = Math.sin(2 * Math.PI * 65 * t) * 0.25;
  const breeze = Math.sin(2 * Math.PI * 110 * t + Math.sin(2 * Math.PI * 1.5 * t)) * 0.15;
  return (noise + lowDrone + breeze) * envelope * 0.5;
});
fs.writeFileSync(path.join(__dirname, 'assets', 'audio', 'ambient-wind.wav'), windWav);

// B. Celestial Drone (4.0 seconds warm sub-bass & ethereal resonance)
const droneWav = createWavBuffer(44100, 4.0, (t, i, total) => {
  const envelope = Math.sin((t / 4.0) * Math.PI);
  const f1 = Math.sin(2 * Math.PI * 55 * t); // A1 note
  const f2 = Math.sin(2 * Math.PI * 110 * t) * 0.5;
  const f3 = Math.sin(2 * Math.PI * 165 * t) * 0.25;
  const shimmer = Math.sin(2 * Math.PI * 440 * t) * 0.05 * Math.sin(2 * Math.PI * 2 * t);
  return (f1 + f2 + f3 + shimmer) * envelope * 0.4;
});
fs.writeFileSync(path.join(__dirname, 'assets', 'audio', 'celestial-drone.wav'), droneWav);

// C. UI Hover (Short 50ms tactile micro-tone)
const hoverWav = createWavBuffer(44100, 0.06, (t) => {
  const freq = 580 + (0.06 - t) * 1200;
  const envelope = Math.exp(-t * 60);
  return Math.sin(2 * Math.PI * freq * t) * envelope * 0.25;
});
fs.writeFileSync(path.join(__dirname, 'assets', 'audio', 'ui-hover.wav'), hoverWav);

// D. UI Click (Short 80ms resonant tactile pop)
const clickWav = createWavBuffer(44100, 0.08, (t) => {
  const freq = 420 - t * 1800;
  const envelope = Math.exp(-t * 45);
  return Math.sin(2 * Math.PI * Math.max(80, freq) * t) * envelope * 0.35;
});
fs.writeFileSync(path.join(__dirname, 'assets', 'audio', 'ui-click.wav'), clickWav);

console.log('✔ Audio assets successfully generated in assets/audio/');

// ==========================================
// 2. VECTOR ASSETS (assets/images/)
// ==========================================

// Favicon SVG
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="favGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4facfe" />
      <stop offset="100%" stop-color="#00f2fe" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#040609" />
  <path d="M32 10 L44 26 L38 26 L48 42 L38 42 L46 54 L18 54 L26 42 L16 42 L26 26 L20 26 Z" fill="url(#favGrad)" />
  <circle cx="32" cy="18" r="3" fill="#ffffff" />
</svg>`;
fs.writeFileSync(path.join(__dirname, 'assets', 'images', 'favicon.svg'), faviconSvg);

// Brand Emblem
const emblemSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <defs>
    <linearGradient id="embGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f2fe" />
      <stop offset="100%" stop-color="#4facfe" />
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="54" fill="none" stroke="url(#embGrad)" stroke-width="1.5" stroke-dasharray="4 4" />
  <circle cx="60" cy="60" r="42" fill="#080e18" stroke="#1d2e46" stroke-width="1.5" />
  <polygon points="60,28 70,52 94,60 70,68 60,92 50,68 26,60 50,52" fill="url(#embGrad)" />
  <circle cx="60" cy="60" r="4" fill="#ffffff" />
</svg>`;
fs.writeFileSync(path.join(__dirname, 'assets', 'images', 'brand-emblem.svg'), emblemSvg);

// Card 1: Glacier
const cardGlacier = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
  <defs>
    <linearGradient id="gSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#08101a" />
      <stop offset="60%" stop-color="#0c2338" />
      <stop offset="100%" stop-color="#19486a" />
    </linearGradient>
    <linearGradient id="gIce" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#90e0ef" />
      <stop offset="100%" stop-color="#0077b6" />
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#gSky)" />
  <circle cx="300" cy="220" r="70" fill="#ffffff" opacity="0.85" filter="blur(8px)" />
  <circle cx="300" cy="220" r="65" fill="#f0f8ff" />
  <path d="M0,450 L120,320 L240,410 L350,260 L460,370 L600,290 L600,800 L0,800 Z" fill="#0b1b2b" />
  <polygon points="350,260 330,310 370,310" fill="#ffffff" opacity="0.8" />
  <path d="M0,560 L180,440 L380,590 L500,470 L600,530 L600,800 L0,800 Z" fill="url(#gIce)" opacity="0.75" />
  <path d="M0,660 L240,540 L400,640 L600,560 L600,800 L0,800 Z" fill="#040910" />
</svg>`;
fs.writeFileSync(path.join(__dirname, 'assets', 'images', 'card-glacier.svg'), cardGlacier);

// Card 2: Aurora
const cardAurora = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
  <defs>
    <linearGradient id="aSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#020810" />
      <stop offset="100%" stop-color="#081826" />
    </linearGradient>
    <linearGradient id="aGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00ff87" stop-opacity="0" />
      <stop offset="50%" stop-color="#60efff" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#00ff87" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#aSky)" />
  <path d="M-50,280 C150,160 300,340 650,200 L650,420 C400,520 200,380 -50,480 Z" fill="url(#aGlow)" filter="blur(25px)" />
  <path d="M0,520 L160,380 L320,490 L480,360 L600,430 L600,800 L0,800 Z" fill="#05121e" />
  <path d="M0,630 L220,530 L420,620 L600,510 L600,800 L0,800 Z" fill="#020810" />
</svg>`;
fs.writeFileSync(path.join(__dirname, 'assets', 'images', 'card-aurora.svg'), cardAurora);

// Card 3: Monolith
const cardMonolith = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
  <defs>
    <linearGradient id="mSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#090a12" />
      <stop offset="100%" stop-color="#1d1e2c" />
    </linearGradient>
    <linearGradient id="mPoly" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9d4edd" />
      <stop offset="100%" stop-color="#3c096c" />
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#mSky)" />
  <polygon points="300,200 400,420 300,600 200,420" fill="url(#mPoly)" stroke="#c77dff" stroke-width="2" />
  <polygon points="300,200 300,600 400,420" fill="#ffffff" opacity="0.18" />
  <circle cx="300" cy="400" r="140" fill="none" stroke="#7b2cbf" stroke-width="1.5" stroke-dasharray="6 6" />
  <path d="M0,680 L200,620 L400,650 L600,600 L600,800 L0,800 Z" fill="#050508" />
</svg>`;
fs.writeFileSync(path.join(__dirname, 'assets', 'images', 'card-monolith.svg'), cardMonolith);

// Card 4: Ridge
const cardRidge = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
  <defs>
    <linearGradient id="rSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#130912" />
      <stop offset="50%" stop-color="#381822" />
      <stop offset="100%" stop-color="#73322c" />
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#rSky)" />
  <circle cx="460" cy="280" r="80" fill="#ffb703" opacity="0.75" />
  <path d="M0,480 L180,310 L350,460 L500,280 L600,390 L600,800 L0,800 Z" fill="#240e15" />
  <path d="M0,600 L240,480 L420,580 L600,490 L600,800 L0,800 Z" fill="#0d0407" />
</svg>`;
fs.writeFileSync(path.join(__dirname, 'assets', 'images', 'card-ridge.svg'), cardRidge);

// Card 5: Stellar
const cardStellar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
  <defs>
    <radialGradient id="starCore" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#48cae4" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#03045e" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="600" height="800" fill="#02040a" />
  <rect width="600" height="800" fill="url(#starCore)" />
  <circle cx="150" cy="180" r="1.5" fill="#ffffff" />
  <circle cx="380" cy="120" r="2" fill="#ffffff" />
  <circle cx="480" cy="240" r="1.5" fill="#ffffff" />
  <circle cx="220" cy="310" r="2.5" fill="#90e0ef" />
  <circle cx="340" cy="260" r="1.5" fill="#ffffff" />
  <path d="M0,580 L140,460 L310,560 L480,440 L600,520 L600,800 L0,800 Z" fill="#040813" />
</svg>`;
fs.writeFileSync(path.join(__dirname, 'assets', 'images', 'card-stellar.svg'), cardStellar);

console.log('✔ Vector artwork generated in assets/images/');

// ==========================================
// 3. DATABASE JSON (assets/data/expeditions.json)
// ==========================================
const expeditionsData = {
  project: "ZEARS Spatial Experience",
  version: "2.4.0",
  telemetryDefaults: {
    bearing: "312° NW",
    altitude: "3,842 M",
    temperature: "-4°C",
    windSpeed: "14 KT",
    coordinates: "45°50'01\"N 06°51'54\"E"
  },
  peakHotspots: [
    {
      id: "peak-mont-blanc",
      name: "Mont Blanc Massif",
      elevation: "4,809 M",
      xPercent: 22.5,
      yPercent: 30.5,
      temp: "-12°C",
      status: "Glacial Ridge",
      notes: "Puncak tertinggi pegunungan Alpen berselimut salju abadi."
    },
    {
      id: "peak-matterhorn",
      name: "Matterhorn Crest",
      elevation: "4,478 M",
      xPercent: 61.2,
      yPercent: 27.0,
      temp: "-9°C",
      status: "Granite Pyramid",
      notes: "Piramida batu granit terjal dengan hembusan angin glasial 22 knot."
    },
    {
      id: "peak-jungfrau",
      name: "Jungfrau Pass",
      elevation: "4,158 M",
      xPercent: 82.0,
      yPercent: 32.0,
      temp: "-7°C",
      status: "Alpine Col",
      notes: "Lembah es terpanjang di Eropa dengan fenomena cahaya bintang jernih."
    }
  ],
  expeditions: [
    {
      id: "01",
      title: "Nordic Glacier",
      category: "GLACIAL LAB",
      location: "SWITZERLAND • 2025",
      coords: "46.5° N, 8.0° E",
      image: "assets/images/card-glacier.svg",
      tag: "GLACIER",
      desc: "Menjelajahi ceruk es biru purba dengan refleksi kristal WebGL.",
      specs: { Elevation: "3,842 M", IceDepth: "850 M", Route: "North Ridge", Risk: "Moderate" }
    },
    {
      id: "02",
      title: "Aurora Borealis",
      category: "CELESTIAL LAB",
      location: "TROMSØ • 2025",
      coords: "69.6° N, 18.9° E",
      image: "assets/images/card-aurora.svg",
      tag: "ATMOSPHERE",
      desc: "Pita cahaya magnetik aurora meliuk di langit malam kutub utara.",
      specs: { Latitude: "69.6° N", Radiation: "0.12 μSv", KpIndex: "6.4 Storm", Visibility: "Optimal" }
    },
    {
      id: "03",
      title: "Monolith of Aetheria",
      category: "SPATIAL ARTIFACT",
      location: "ALTIPLANO • 2025",
      coords: "22.3° S, 67.5° W",
      image: "assets/images/card-monolith.svg",
      tag: "3D ARTIFACT",
      desc: "Monolit kristal geometris 3D yang berotasi bebas dalam gravitasi nol.",
      specs: { Geometry: "Octahedron", Shader: "Specular PBR", Rotation: "360° Free", FPS: "60.0 Lock" }
    },
    {
      id: "04",
      title: "Obsidian Ridge",
      category: "VOLCANIC TRAIL",
      location: "ICELAND • 2025",
      coords: "64.1° N, 21.9° W",
      image: "assets/images/card-ridge.svg",
      tag: "TOPOGRAPHY",
      desc: "Punggung tebing batuan beku vulkanik yang membelah samudera awan.",
      specs: { RockType: "Basalt/Pumice", Incline: "48° Angle", Wind: "28 Knots", Terrain: "Class 4" }
    },
    {
      id: "05",
      title: "Stellar Horizon",
      category: "DEEP SPACE LAB",
      location: "ATACAMA • 2025",
      coords: "24.6° S, 70.4° W",
      image: "assets/images/card-stellar.svg",
      tag: "COSMOS",
      desc: "Kubah langit paling jernih di bumi dengan hujan meteor periodik.",
      specs: { Seeing: "0.45 Arcsec", Humidity: "4%", StarPool: "500 Points", Meteors: "Dynamic" }
    }
  ]
};

fs.writeFileSync(path.join(__dirname, 'assets', 'data', 'expeditions.json'), JSON.stringify(expeditionsData, null, 2));
console.log('✔ Dataset JSON successfully generated in assets/data/expeditions.json');
