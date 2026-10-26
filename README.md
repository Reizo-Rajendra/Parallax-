# ZEARS — Spatial 3D Multiplane Scenery & Parallax Experience

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.4.0-emerald.svg)
![FPS](https://img.shields.io/badge/framerate-60%20FPS%20Locked-green.svg)
![Engine](https://img.shields.io/badge/engine-Three.js%20%2B%20Native%20WebGL-cyan.svg)

Proyek website visual arsitektural berskala agensi/studio kreatif profesional (*Awwwards standard*) untuk brand **ZEARS**:
1. **Multi-Layer 3D Scenery Parallax**: 8 lapisan pemandangan dinamis (Bulan, Aurora, Kanvas Bintang & Bintang Jatuh WebGL, Pegunungan Alpen Bersalju, Kawanan Burung Elang Melayang, Pin Puncak Interaktif, Punggung Tebing Granit, Tipografi 3D ZEARS, Kabut Bergulung, Hutan Pinus, dan Tebing Batu Depan).
2. **Infinite Kinetic Showcase Reel**: Aliran kartu editorial majalah modern dua arah (*continuous loop*) dengan inersia seret mouse/touch, pengaturan arah (Invert), dan pengatur kecepatan stream.
3. **Interactive 3D Monolith**: Monolit kristal geometris 3D berbasis Three.js dengan rotasi orbit 360° menggunakan kursor/touchscreen.
4. **Alpine Telemetry HUD**: Indikator kompas live (bearing), elevasi ketinggian dinamis, suhu glasial, dan koordinat GPS.
5. **Tactile Sound System**: Generator audio Web Audio API + file suara fisik `.wav` (desau angin, drone kosmik, dan micro-click feedback saat hover/klik elemen interaktif).

---

## 📁 Struktur Direktori Proyek

```
d:\animasi 3d\
├── .gitignore               # Konfigurasi ignore file Git
├── package.json             # Konfigurasi npm script (npm start, npm run dev)
├── serve.js                 # Zero-dependency local dev server berbasis Node.js
├── generate-assets.js       # Script generator audio WAV & gambar SVG vektor
├── README.md                # Dokumentasi arsitektur dan panduan proyek
├── index.html               # Struktur semantik 8-layer parallax & WebGL canvas
├── style.css                # Sistem tema (Midnight, Golden, Mist) & CSS layout
├── script.js                # Single 60 FPS master compositor & audio controller
└── assets/
    ├── audio/
    │   ├── ambient-wind.wav     # Audio fisik desau angin pegunungan
    │   ├── celestial-drone.wav  # Audio fisik dengung atmosferik kosmik
    │   ├── ui-hover.wav         # Audio tactile micro-sound saat hover
    │   └── ui-click.wav         # Audio tactile pop saat tombol diklik
    ├── images/
    │   ├── favicon.svg          # Favicon resmi ZEARS
    │   ├── brand-emblem.svg     # Emblem logo vektor spatial lab
    │   ├── card-glacier.svg     # Ilustrasi vektor kartu Swiss Glacier
    │   ├── card-aurora.svg      # Ilustrasi vektor kartu Tromsø Aurora
    │   ├── card-monolith.svg    # Ilustrasi vektor kartu 3D Monolith
    │   ├── card-ridge.svg       # Ilustrasi vektor kartu Obsidian Ridge
    │   └── card-stellar.svg     # Ilustrasi vektor kartu Stellar Horizon
    └── data/
        └── expeditions.json     # Database JSON ekspedisi, elevasi & koordinat
```

---

## 🚀 Cara Menjalankan Secara Lokal

### Metode 1: Menggunakan Node.js Dev Server (Direkomendasikan)
Buka terminal atau VS Code terminal di folder proyek dan jalankan:
```bash
npm start
```
atau
```bash
node serve.js
```
Lalu buka browser di: `http://localhost:3000`

### Metode 2: Buka Langsung Tanpa Instalasi Apapun
Buka File Explorer di Windows, masuk ke folder `D:\animasi 3d`, lalu **klik ganda file `index.html`** di browser Chrome, Edge, atau Firefox.

---

## 🌐 Cara Meng-Online-kan di GitHub Pages

Repositori GitHub: [https://github.com/Reizo-Rajendra/Parallax-](https://github.com/Reizo-Rajendra/Parallax-)

Untuk mengaktifkan website agar bisa diakses online secara publik:
1. Buka repositori Anda di browser: `https://github.com/Reizo-Rajendra/Parallax-`
2. Klik tab **Settings** (Pengaturan repositori).
3. Di bilah menu kiri, pilih **Pages** (di bawah menu *Code and automation*).
4. Pada bagian **Build and deployment** -> **Source**:
   - Pilih **Deploy from a branch**.
   - Pada dropdown Branch, pilih **main** (atau **master**), dan folder pilih **/(root)**.
   - Klik **Save**.
5. Tunggu sekitar 1-2 menit, GitHub akan menampilkan link website online Anda:
   `https://reizo-rajendra.github.io/Parallax-/`

---

## 🛠️ Lisensi & Hak Cipta
Dilisensikan di bawah **MIT License**. Dibuat untuk eksplorasi kreatif estetika lanskap 3D dan web development tingkat lanjut.
