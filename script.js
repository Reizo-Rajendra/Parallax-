/**
 * ZEARS • Spatial 3D Multiplane Scenery, Shooting Stars & Motion Engine
 * Single-Loop Compositor • 60 FPS Butter Smooth • Zero Lag
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================
  // 1. DATA: CURATED EXPEDITIONS FOR THE REEL
  // ==========================================================
  // 1. DATA: CURATED EXPEDITIONS FOR THE REEL (WITH LOCAL ASSETS)
  // ==========================================================
  const expeditionData = [
    {
      badge: "01 / SWISS ALPS",
      region: "VALAIS RANGE",
      title: "Matterhorn Ice Ridge",
      year: "2025",
      summary: "Piramida granit paling ikonik di Eropa Barat di ketinggian 4.478 meter dengan lereng glasial abadi.",
      image: "assets/images/card-glacier.svg",
      fallbackGrad: "linear-gradient(135deg, #181528, #302847)",
      elevation: "4,478 M",
      coords: "45°58′N 7°39′E",
      temp: "-18°C"
    },
    {
      badge: "02 / ARCTIC NORWAY",
      region: "LOFOTEN ARCHIPELAGO",
      title: "Reinebringen Midnight",
      year: "2025",
      summary: "Dinding tebing purba yang menjulang menantang samudra Arktik di bawah gemerlap aurora borealis.",
      image: "assets/images/card-aurora.svg",
      fallbackGrad: "linear-gradient(135deg, #091a24, #12383c)",
      elevation: "1,146 M",
      coords: "67°56′N 13°05′E",
      temp: "-4°C"
    },
    {
      badge: "03 / 3D ARTIFACT",
      region: "SPATIAL LAB",
      title: "Monolith of Aetheria",
      year: "2025",
      summary: "Monolit kristal geometris 3D yang berotasi bebas dalam gravitasi nol WebGL Three.js.",
      image: "assets/images/card-monolith.svg",
      fallbackGrad: "linear-gradient(135deg, #1f1412, #3b241d)",
      elevation: "2,999 M",
      coords: "46°37′N 12°18′E",
      temp: "+2°C"
    },
    {
      badge: "04 / ICELANDIC RIFT",
      region: "OBSIDIAN VALLEY",
      title: "Obsidian Ridge Caldera",
      year: "2025",
      summary: "Punggung tebing batuan beku vulkanik yang membelah lautan kabut geotermal aktif.",
      image: "assets/images/card-ridge.svg",
      fallbackGrad: "linear-gradient(135deg, #121f24, #1e3c45)",
      elevation: "4,392 M",
      coords: "46°51′N 121°45′W",
      temp: "-8°C"
    },
    {
      badge: "05 / ATACAMA HORIZON",
      region: "STELLAR LAB",
      title: "Stellar Galaxy Expanse",
      year: "2025",
      summary: "Kubah langit paling jernih di bumi dengan hujan meteor dan 500 partikel bintang berkelip.",
      image: "assets/images/card-stellar.svg",
      fallbackGrad: "linear-gradient(135deg, #171c18, #2e3d31)",
      elevation: "5,100 M",
      coords: "24°37′S 70°24′W",
      temp: "+1°C"
    },
    {
      badge: "06 / BERNESE ALPS",
      region: "OBERLAND PASS",
      title: "Jungfrau North Wall",
      year: "2025",
      summary: "Puncak berselimut salju abadi menghadap lembah Lauterbrunnen dengan jurang granit sedalam 1.000 meter.",
      image: "assets/images/card-glacier.svg",
      fallbackGrad: "linear-gradient(135deg, #101622, #263345)",
      elevation: "4,158 M",
      coords: "46°32′N 7°57′E",
      temp: "-14°C"
    }
  ];

  // ==========================================================
  // 2. CELESTIAL CANVAS: STARS & METEORS (BINTANG JATUH)
  // ==========================================================
  const heroCanvas = document.getElementById('webglCanvas');
  let heroRenderer, heroScene, heroCamera;
  let heroParticles;
  const hasThree = typeof THREE !== 'undefined';

  const meteors = [];
  const maxMeteors = 2;

  function createMeteor() {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(6);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const line = new THREE.Line(geo, mat);
    line.visible = false;
    heroScene.add(line);

    return {
      line: line,
      geo: geo,
      active: false,
      head: new THREE.Vector3(),
      tail: new THREE.Vector3(),
      speed: 0,
      length: 0,
      dx: 0,
      dy: 0,
      life: 0
    };
  }

  function spawnMeteor(m) {
    const startX = (Math.random() - 0.2) * 1400;
    const startY = 350 + Math.random() * 250;
    const startZ = -800 - Math.random() * 200;

    m.head.set(startX, startY, startZ);
    m.tail.copy(m.head);
    m.speed = 16 + Math.random() * 12;
    m.length = 100 + Math.random() * 70;
    m.dx = -(Math.random() * 0.7 + 0.6);
    m.dy = -(Math.random() * 0.5 + 0.5);
    m.active = true;
    m.life = 1.0;
    m.line.visible = true;
  }

  if (hasThree && heroCanvas) {
    try {
      heroScene = new THREE.Scene();
      heroCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 3000);
      heroCamera.position.set(0, 0, 100);

      heroRenderer = new THREE.WebGLRenderer({
        canvas: heroCanvas,
        alpha: true,
        antialias: false, // Performance boost
        powerPreference: 'high-performance'
      });
      heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      heroRenderer.setSize(window.innerWidth, window.innerHeight);

      // 500 Stardust Particles
      const starCount = 500;
      const starGeo = new THREE.BufferGeometry();
      const starPositions = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount * 3; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 2400;
        starPositions[i + 1] = Math.random() * 900 - 50;
        starPositions[i + 2] = -Math.random() * 1200 + 50;
      }

      starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0xeef5fc,
        size: 2.2,
        transparent: true,
        opacity: 0.8
      });
      heroParticles = new THREE.Points(starGeo, starMat);
      heroScene.add(heroParticles);

      // Initialize Meteors
      for (let i = 0; i < maxMeteors; i++) {
        meteors.push(createMeteor());
      }

      setInterval(() => {
        const inactive = meteors.find(m => !m.active);
        if (inactive) spawnMeteor(inactive);
      }, 3000);

      window.addEventListener('resize', () => {
        heroCamera.aspect = window.innerWidth / window.innerHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(window.innerWidth, window.innerHeight);
      });
    } catch (e) {
      console.warn("Hero WebGL note:", e);
    }
  }

  // ==========================================================
  // 3. PARALLAX LAYERS (GPU TRANSFORM ENGINE - SILKY SMOOTH)
  // ==========================================================
  const layers = document.querySelectorAll('.scenery-layer');
  const heroSection = document.getElementById('hero');
  const scrollProgress = document.getElementById('scrollProgress');

  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollY = 0;
  let targetScrollY = 0;

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = (e.clientY / window.innerHeight) * 2 - 1;

    if (cursorDot && cursorFollow) {
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
      cursorFollow.style.left = `${e.clientX}px`;
      cursorFollow.style.top = `${e.clientY}px`;
    }
  });

  const cursorDot = document.getElementById('cursorDot');
  const cursorFollow = document.getElementById('cursorFollow');

  // Interactive Hover Magnifier
  const clickables = document.querySelectorAll('a, button, .editorial-card, [data-mood]');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursorFollow) {
        cursorFollow.style.width = '48px';
        cursorFollow.style.height = '48px';
        cursorFollow.style.borderColor = 'var(--accent-glow)';
        cursorFollow.style.backgroundColor = 'rgba(224, 159, 103, 0.08)';
      }
    });
    el.addEventListener('mouseleave', () => {
      if (cursorFollow) {
        cursorFollow.style.width = '32px';
        cursorFollow.style.height = '32px';
        cursorFollow.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        cursorFollow.style.backgroundColor = 'transparent';
      }
    });
  });

  // Main Render Loop (Single Unified 60 FPS Clock)
  function masterLoop() {
    // 0.09 lerp for instant responsive smoothness without lag
    scrollY += (targetScrollY - scrollY) * 0.09;
    mouse.x += (mouse.targetX - mouse.x) * 0.07;
    mouse.y += (mouse.targetY - mouse.y) * 0.07;

    // Progress bar
    const totalDocHeight = document.documentElement.scrollHeight - window.innerHeight;
    const docPercent = totalDocHeight > 0 ? (window.scrollY / totalDocHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${docPercent}%`;

    const heroHeight = heroSection ? heroSection.offsetHeight : 1200;
    const pinDistance = Math.max(heroHeight - window.innerHeight, 500);
    const progress = Math.min(Math.max(scrollY / pinDistance, 0), 1.0);

    // 1. Update Celestial Three.js Scene
    if (hasThree && heroRenderer && heroCamera) {
      // Shooting Stars update
      meteors.forEach(m => {
        if (m.active) {
          m.head.x += m.dx * m.speed;
          m.head.y += m.dy * m.speed;
          m.tail.set(m.head.x - m.dx * m.length, m.head.y - m.dy * m.length, m.head.z);

          const posArr = m.geo.attributes.position.array;
          posArr[0] = m.head.x; posArr[1] = m.head.y; posArr[2] = m.head.z;
          posArr[3] = m.tail.x; posArr[4] = m.tail.y; posArr[5] = m.tail.z;
          m.geo.attributes.position.needsUpdate = true;

          m.life -= 0.024;
          m.line.material.opacity = Math.max(m.life, 0);

          if (m.life <= 0 || m.head.y < -200) {
            m.active = false;
            m.line.visible = false;
          }
        }
      });

      if (heroParticles) {
        heroParticles.rotation.y = Date.now() * 0.00002;
      }

      heroRenderer.render(heroScene, heroCamera);
    }

    // 2. Multi-Layer Scenery Parallax (Vibrant, Lively, and Zero Lag!)
    if (scrollY <= heroHeight) {
      layers.forEach(layer => {
        const depth = parseFloat(layer.getAttribute('data-depth')) || 0.5;
        const moveY = -progress * 280 * depth;
        const moveX = -mouse.x * 24 * depth;

        if (layer.classList.contains('layer-typography')) {
          // Typography descends and dissolves gently
          const typoY = progress * 130;
          const typoScale = Math.max(1 - progress * 0.22, 0.78);
          const typoOpacity = Math.max(1 - progress * 1.35, 0);
          layer.style.transform = `translate3d(${moveX}px, ${typoY}px, 0) scale(${typoScale})`;
          layer.style.opacity = typoOpacity;
        } else {
          layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        }
      });
    }

    requestAnimationFrame(masterLoop);
  }
  requestAnimationFrame(masterLoop);

  // ==========================================================
  // 4. REFINED SHOWCASE REEL (COMPACT, FAST & NON-LAGGY)
  // ==========================================================
  const lane = document.getElementById('infiniteLane');

  function buildCard(item) {
    const card = document.createElement('div');
    card.className = 'editorial-card';

    card.innerHTML = `
      <div class="card-backdrop-image" style="background-image: url('${item.image}'), ${item.fallbackGrad};"></div>
      <div class="card-gradient-veil"></div>
      
      <div class="card-header-meta">
        <span class="card-badge">${item.badge}</span>
        <span class="card-year">${item.year}</span>
      </div>

      <div class="card-body-meta">
        <span class="card-region">${item.region}</span>
        <h4 class="card-name">${item.title}</h4>
        <p class="card-summary">${item.summary}</p>
        <div class="card-cta">
          <span>EXPLORE</span>
          <span>→</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openModal(item));
    return card;
  }

  // Populate single lane with 3 sets for lightweight infinite gliding
  if (lane) {
    for (let c = 0; c < 3; c++) {
      expeditionData.forEach(item => lane.appendChild(buildCard(item)));
    }
  }

  let laneOffset = 0;
  let streamSpeed = 1.0;
  let streamDirection = 1;
  let isHoverLane = false;

  const wrap = document.getElementById('laneContainer');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => isHoverLane = true);
    wrap.addEventListener('mouseleave', () => isHoverLane = false);
  }

  function animateReel() {
    if (lane) {
      const half = lane.scrollWidth / 2;
      const currentSpeed = (isHoverLane ? 0.3 : 1.0) * streamSpeed * streamDirection;

      laneOffset -= currentSpeed;
      if (Math.abs(laneOffset) >= half) {
        laneOffset = 0;
      } else if (laneOffset > 0) {
        laneOffset = -half;
      }
      lane.style.transform = `translate3d(${laneOffset}px, 0, 0)`;
    }

    requestAnimationFrame(animateReel);
  }
  requestAnimationFrame(animateReel);

  // Reel Controls
  const btnInvert = document.getElementById('btnToggleDirection');
  const btnSpeed = document.getElementById('btnToggleSpeed');

  if (btnInvert) {
    btnInvert.addEventListener('click', () => streamDirection *= -1);
  }

  const speedCycle = [1.0, 2.0, 0.5];
  let speedIdx = 0;

  if (btnSpeed) {
    btnSpeed.addEventListener('click', () => {
      speedIdx = (speedIdx + 1) % speedCycle.length;
      streamSpeed = speedCycle[speedIdx];
      btnSpeed.textContent = `${streamSpeed.toFixed(1)}X VELOCITY`;
    });
  }

  // Drag Gesture Scrubbing
  if (wrap) {
    let dragging = false;
    let startX = 0;

    wrap.addEventListener('mousedown', (e) => {
      dragging = true;
      startX = e.pageX;
    });
    window.addEventListener('mouseup', () => dragging = false);
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const delta = (e.pageX - startX) * 1.5;
      startX = e.pageX;
      laneOffset += delta;
    });

    wrap.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX;
    }, { passive: true });

    wrap.addEventListener('touchmove', (e) => {
      const delta = (e.touches[0].pageX - startX) * 1.2;
      startX = e.touches[0].pageX;
      laneOffset += delta;
    }, { passive: true });
  }

  // ==========================================================
  // 5. INTERACTIVE 3D MONOLITH (LIGHTWEIGHT & SLEEK)
  // ==========================================================
  const monolithCanvas = document.getElementById('monolithCanvas');
  let monoRenderer, monoScene, monoCamera, monoMesh;
  let isDraggingMono = false;
  let monoPrevX = 0, monoPrevY = 0;

  if (hasThree && monolithCanvas) {
    try {
      monoScene = new THREE.Scene();
      monoCamera = new THREE.PerspectiveCamera(45, monolithCanvas.clientWidth / monolithCanvas.clientHeight, 1, 1000);
      monoCamera.position.set(0, 0, 180);

      monoRenderer = new THREE.WebGLRenderer({
        canvas: monolithCanvas,
        alpha: true,
        antialias: true
      });
      monoRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      monoRenderer.setSize(monolithCanvas.clientWidth, monolithCanvas.clientHeight);

      // Crystal Monolith Geometry
      const geo = new THREE.OctahedronGeometry(48, 1);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x1f2937,
        roughness: 0.3,
        metalness: 0.8,
        flatShading: true
      });
      monoMesh = new THREE.Mesh(geo, mat);
      monoScene.add(monoMesh);

      // Wireframe overlay for architectural tech feel
      const wireMat = new THREE.MeshBasicMaterial({ color: 0xe09f67, wireframe: true, transparent: true, opacity: 0.5 });
      const wireMesh = new THREE.Mesh(geo, wireMat);
      monoMesh.add(wireMesh);

      // Lights
      const ambLight = new THREE.AmbientLight(0xffffff, 0.6);
      monoScene.add(ambLight);

      const dirLight = new THREE.DirectionalLight(0xe09f67, 1.8);
      dirLight.position.set(80, 120, 100);
      monoScene.add(dirLight);

      // Mouse drag rotation
      monolithCanvas.addEventListener('mousedown', (e) => {
        isDraggingMono = true;
        monoPrevX = e.clientX;
        monoPrevY = e.clientY;
      });
      window.addEventListener('mouseup', () => isDraggingMono = false);
      monolithCanvas.addEventListener('mousemove', (e) => {
        if (!isDraggingMono || !monoMesh) return;
        const deltaX = e.clientX - monoPrevX;
        const deltaY = e.clientY - monoPrevY;
        monoPrevX = e.clientX;
        monoPrevY = e.clientY;

        monoMesh.rotation.y += deltaX * 0.015;
        monoMesh.rotation.x += deltaY * 0.01;
      });

      // Touch drag
      monolithCanvas.addEventListener('touchstart', (e) => {
        isDraggingMono = true;
        monoPrevX = e.touches[0].clientX;
        monoPrevY = e.touches[0].clientY;
      }, { passive: true });
      monolithCanvas.addEventListener('touchmove', (e) => {
        if (!isDraggingMono || !monoMesh) return;
        const deltaX = e.touches[0].clientX - monoPrevX;
        const deltaY = e.touches[0].clientY - monoPrevY;
        monoPrevX = e.touches[0].clientX;
        monoPrevY = e.touches[0].clientY;

        monoMesh.rotation.y += deltaX * 0.015;
        monoMesh.rotation.x += deltaY * 0.01;
      }, { passive: true });

      function animateMono() {
        if (monoMesh && !isDraggingMono) {
          monoMesh.rotation.y += 0.008;
          monoMesh.rotation.x += 0.004;
        }
        monoRenderer.render(monoScene, monoCamera);
        requestAnimationFrame(animateMono);
      }
      requestAnimationFrame(animateMono);

      window.addEventListener('resize', () => {
        if (monolithCanvas) {
          monoCamera.aspect = monolithCanvas.clientWidth / monolithCanvas.clientHeight;
          monoCamera.updateProjectionMatrix();
          monoRenderer.setSize(monolithCanvas.clientWidth, monolithCanvas.clientHeight);
        }
      });
    } catch (e) {
      console.warn("Monolith WebGL note:", e);
    }
  }

  // ==========================================================
  // 6. EDITORIAL MODAL DETAIL VIEWER
  // ==========================================================
  const modalView = document.getElementById('modalView');
  const modalTitle = document.getElementById('modalTitle');
  const modalLocation = document.getElementById('modalLocation');
  const modalIndex = document.getElementById('modalIndex');
  const modalImageWrap = document.getElementById('modalImageWrap');
  const modalText = document.getElementById('modalText');
  const modalGrid = document.getElementById('modalGrid');
  const modalDismiss = document.getElementById('modalDismiss');

  function openModal(item) {
    if (!modalView) return;
    modalIndex.textContent = `${item.badge} — ZEARS`;
    modalTitle.textContent = item.title;
    modalLocation.textContent = `${item.coords} • ELEVATION ${item.elevation}`;
    modalImageWrap.style.backgroundImage = `url('${item.image}'), ${item.fallbackGrad}`;
    modalText.textContent = item.summary;

    modalGrid.innerHTML = `
      <div class="modal-detail-item">
        <span>TEMPERATURE</span>
        <span>${item.temp}</span>
      </div>
      <div class="modal-detail-item">
        <span>YEAR</span>
        <span>${item.year}</span>
      </div>
      <div class="modal-detail-item">
        <span>STATUS</span>
        <span>Spatial Mapped</span>
      </div>
    `;

    modalView.classList.add('open');
    modalView.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    if (!modalView) return;
    modalView.classList.remove('open');
    modalView.setAttribute('aria-hidden', 'true');
  }

  if (modalDismiss) modalDismiss.addEventListener('click', closeModal);
  if (modalView) {
    modalView.addEventListener('click', (e) => {
      if (e.target === modalView) closeModal();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ==========================================================
  // 7. MOOD THEME SWITCHER
  // ==========================================================
  const moodButtons = document.querySelectorAll('.mood-btn');
  const htmlRoot = document.documentElement;

  moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      moodButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mood = btn.getAttribute('data-mood');
      htmlRoot.setAttribute('data-theme', mood);
    });
  });

  // ==========================================================
  // 8. NATIVE WEB AUDIO HARMONIC SOUNDSCAPE
  // ==========================================================
  let audioContext = null;
  const audioToggle = document.getElementById('audioToggle');

  function setupSoundscape() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtx();

      const bufferSize = audioContext.sampleRate * 2;
      const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const bandpass = audioContext.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(260, audioContext.currentTime);
      bandpass.Q.setValueAtTime(3.0, audioContext.currentTime);

      const windGain = audioContext.createGain();
      windGain.gain.setValueAtTime(0.2, audioContext.currentTime);

      noiseSource.connect(bandpass);
      bandpass.connect(windGain);
      windGain.connect(audioContext.destination);

      const drone1 = audioContext.createOscillator();
      const drone2 = audioContext.createOscillator();
      drone1.type = 'sine';
      drone2.type = 'sine';
      drone1.frequency.setValueAtTime(98, audioContext.currentTime);
      drone2.frequency.setValueAtTime(147.2, audioContext.currentTime);

      const droneGain = audioContext.createGain();
      droneGain.gain.setValueAtTime(0.03, audioContext.currentTime);

      drone1.connect(droneGain);
      drone2.connect(droneGain);
      droneGain.connect(audioContext.destination);

      noiseSource.start();
      drone1.start();
      drone2.start();
    } catch (err) {
      console.warn("Web Audio note:", err);
    }
  }

  // ==========================================================
  // 8. AUDIO SOUNDSCAPE & TACTILE MICRO-SOUNDS
  // ==========================================================
  const audioWind = document.getElementById('audioWind');
  const audioDrone = document.getElementById('audioDrone');
  const audioHover = document.getElementById('audioHover');
  const audioClick = document.getElementById('audioClick');

  let lastHoverSound = 0;
  function playHoverSound() {
    const now = Date.now();
    if (now - lastHoverSound > 80) { // Throttle 80ms
      lastHoverSound = now;
      if (audioHover) {
        audioHover.currentTime = 0;
        audioHover.volume = 0.2;
        audioHover.play().catch(() => {});
      }
    }
  }

  function playClickSound() {
    if (audioClick) {
      audioClick.currentTime = 0;
      audioClick.volume = 0.35;
      audioClick.play().catch(() => {});
    }
  }

  // Attach tactile sound listeners to interactive elements
  const interactiveElements = document.querySelectorAll(
    'button, .nav-link, .editorial-card, .peak-hotspot, .mood-btn, .brand-link, .footer-link'
  );
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', playHoverSound, { passive: true });
    el.addEventListener('click', playClickSound, { passive: true });
  });

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      playClickSound();

      if (!audioContext) {
        setupSoundscape();
        if (audioWind) { audioWind.volume = 0.3; audioWind.play().catch(() => {}); }
        if (audioDrone) { audioDrone.volume = 0.2; audioDrone.play().catch(() => {}); }
        audioToggle.classList.add('active');
        audioToggle.querySelector('.sound-text').textContent = 'SOUND ACTIVE';
      } else {
        if (audioContext.state === 'suspended') {
          audioContext.resume();
          if (audioWind) audioWind.play().catch(() => {});
          if (audioDrone) audioDrone.play().catch(() => {});
          audioToggle.classList.add('active');
          audioToggle.querySelector('.sound-text').textContent = 'SOUND ACTIVE';
        } else if (audioContext.state === 'running') {
          audioContext.suspend();
          if (audioWind) audioWind.pause();
          if (audioDrone) audioDrone.pause();
          audioToggle.classList.remove('active');
          audioToggle.querySelector('.sound-text').textContent = 'SOUNDSCAPE';
        }
      }
    });
  }

  // ==========================================================
  // 9. DYNAMIC ALPINE TELEMETRY HUD
  // ==========================================================
  const hudBearing = document.getElementById('hudBearing');
  const hudAltitude = document.getElementById('hudAltitude');

  window.addEventListener('mousemove', (e) => {
    if (hudBearing) {
      const ratio = e.clientX / window.innerWidth;
      const deg = Math.round(308 + ratio * 8); // 308° - 316° NW
      hudBearing.textContent = `${deg}° NW`;
    }
  }, { passive: true });

  window.addEventListener('scroll', () => {
    if (hudAltitude) {
      const extra = Math.min(600, Math.round(window.scrollY * 0.35));
      const alt = (3842 + extra).toLocaleString();
      hudAltitude.textContent = `${alt} M`;
    }
  }, { passive: true });

  // ==========================================================
  // 10. ACTIVE NAVIGATION SCROLL SPY
  // ==========================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header-nav .nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollMark = window.scrollY + 200;

    sections.forEach(sec => {
      if (scrollMark >= sec.offsetTop && scrollMark < sec.offsetTop + sec.offsetHeight) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

});

