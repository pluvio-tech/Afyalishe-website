/**
 * AFYALISHE WELLNESS - SCROLL-AND-CURSOR PRODUCT POP-UP HERO SCENE
 * Three.js + GSAP ScrollTrigger (600vh scrub)
 * Features:
 * - Central Chia Oil bottle (amber glass, green label, gold dropper) with idle bob and specular sheen
 * - Concentric green swoosh rings (radii 1.9 & 2.7)
 * - 10 cut-out product planes with soft halos and contact shadows popping up on scroll with spring overshoot & arc
 * - Drifting seeds and petals repelled by cursor
 * - Dynamic caption cross-fades (Hero -> Chia -> Hibiscus -> Yacon -> Granola)
 * - 4-tick progress rail
 * - Raycast hover with forward lift, halo glow, and custom tooltip
 * - Touch & prefers-reduced-motion support
 */

(function () {
  'use strict';

  // 1. PRODUCT METADATA (Exact from Catalogue)
  const PRODUCTS = [
    { slug: "chia-oil",        name: "Chia Oil",                     sizes: "100 ml · 60 ml · 30 ml",                 use: "consume one tablespoon daily", group: "hero" },
    { slug: "chia-seeds",      name: "Chia Seeds",                   sizes: "100 g · 200 g · 500 g",                  use: "soak overnight in water and drink", group: "chia" },
    { slug: "chia-uji",        name: "Chia Uji",                     sizes: "1 kg · 500 g",                           use: "cook and consume like regular porridge", group: "chia" },
    { slug: "chia-yoghurt",    name: "Chia Yoghurt",                 sizes: "250 ml · 500 ml · 1 L to 5 L",           use: "smoothies, mix with muesli or granola, porridge", note: "Flavours: Mango, Vanilla, Strawberry, Natural", group: "chia" },
    { slug: "hibiscus-blend",  name: "Hibiscus Herbal Blend",        sizes: "50 g (25 teabags)",                      use: "add a teabag to a cup of hot water, brew for 5 minutes and enjoy", group: "hibiscus" },
    { slug: "hibiscus-dried",  name: "Hibiscus Dried Flowers",       sizes: "100 g",                                  use: "as a herbal tea or infused in drinking water", group: "hibiscus" },
    { slug: "hibiscus-powder", name: "Hibiscus Powder",              sizes: "200 g · 100 g",                          use: "add to ready food, salads or baked goods; mix with water for a hair or face masque", group: "hibiscus" },
    { slug: "yacon-immune",    name: "Yacon Probiotic Immune Boost", sizes: "250 ml · 500 ml",                        use: "drink directly or mix with smoothies", group: "yacon" },
    { slug: "yacon-kefir",     name: "Yacon Probiotic Syrup Kefir",  sizes: "500 ml · 1 L",                           use: "drink directly or mix with smoothies", group: "yacon" },
    { slug: "yacon-inulin",    name: "Yacon Inulin Capsules",        sizes: "40 capsule pack",                        use: "take two capsules daily", group: "yacon" },
    { slug: "granola",         name: "Granola",                      sizes: "400 g · 200 g · 100 g",                  use: "snack directly or add yoghurt for a healthy delicious breakfast", group: "granola" }
  ];

  // 2. LAYOUT CONFIGURATION (Section 6)
  const LAYOUT = {
    'chia-yoghurt':    { x: -2.7, y:  0.35, z: -1.0, rotZ: -6, height: 1.50, group: 'chia',     popStart: 0.24, popEnd: 0.35 },
    'hibiscus-blend':  { x:  2.8, y:  0.30, z: -1.0, rotZ:  7, height: 1.30, group: 'hibiscus', popStart: 0.35, popEnd: 0.45 },
    'chia-seeds':      { x: -1.7, y:  1.10, z: -1.8, rotZ:  5, height: 1.30, group: 'chia',     popStart: 0.10, popEnd: 0.20 },
    'chia-uji':        { x:  1.7, y:  1.10, z: -1.8, rotZ: -4, height: 1.35, group: 'chia',     popStart: 0.17, popEnd: 0.27 },
    'granola':         { x: -1.0, y: -1.40, z: -2.0, rotZ:  4, height: 0.80, group: 'granola',  popStart: 0.85, popEnd: 0.95 },
    'hibiscus-dried':  { x:  2.5, y: -0.95, z: -2.2, rotZ: -5, height: 1.15, group: 'hibiscus', popStart: 0.42, popEnd: 0.52 },
    'hibiscus-powder': { x: -2.4, y: -0.95, z: -2.2, rotZ:  6, height: 1.30, group: 'hibiscus', popStart: 0.49, popEnd: 0.60 },
    'yacon-inulin':    { x:  0.9, y: -1.45, z: -2.6, rotZ:  0, height: 0.90, group: 'yacon',    popStart: 0.74, popEnd: 0.85 },
    'yacon-immune':    { x: -0.8, y:  1.35, z: -3.0, rotZ: -3, height: 1.20, group: 'yacon',    popStart: 0.60, popEnd: 0.70 },
    'yacon-kefir':     { x:  0.9, y:  1.45, z: -3.2, rotZ:  3, height: 1.50, group: 'yacon',    popStart: 0.67, popEnd: 0.77 }
  };

  // Group Brand Colors
  const GROUP_COLORS = {
    chia:     0x6FB03A, // chia green #6FB03A
    hibiscus: 0xE0559B, // hibiscus pink #E0559B
    yacon:    0xC47A3A, // yacon amber-brown #C47A3A
    granola:  0xD4A359  // granola clay #D4A359
  };

  // Spring Overshoot Helper (equivalent to back.out(1.9))
  function easeOutBack(t, s = 1.9) {
    t = Math.max(0, Math.min(1, t));
    t = t - 1;
    return t * t * ((s + 1) * t + s) + 1;
  }

  function initHeroScene() {
    const container = document.getElementById('hero-3d-scene-container');
    if (!container || typeof THREE === 'undefined') return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Viewport dimensions
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xEFE9E6); // Brand warm off-white #EFE9E6

    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.0);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL failed, maintaining static fallback', e);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.domElement.className = 'hero-3d-canvas';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfff8f2, 1.15);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(5, 8, 6);
    scene.add(sunLight);

    const limeRimLight = new THREE.DirectionalLight(0x6FB03A, 0.9);
    limeRimLight.position.set(-6, -2, -2);
    scene.add(limeRimLight);

    const terracottaBounce = new THREE.PointLight(0xC47A3A, 0.8, 15);
    terracottaBounce.position.set(0, -5, 2);
    scene.add(terracottaBounce);

    const centerGlow = new THREE.PointLight(0x6FB03A, 0.8, 12);
    centerGlow.position.set(0, 0, -1);
    scene.add(centerGlow);

    // 3. Hierarchical Groups
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const ringsGroup = new THREE.Group();
    mainGroup.add(ringsGroup);

    const productsGroup = new THREE.Group();
    mainGroup.add(productsGroup);

    const particlesGroup = new THREE.Group();
    mainGroup.add(particlesGroup);

    const burstGroup = new THREE.Group();
    mainGroup.add(burstGroup);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // Procedural Halo & Shadow textures
    function createRadialTexture(colorStr, alphaCenter) {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, colorStr);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      const tex = new THREE.CanvasTexture(canvas);
      tex.encoding = THREE.sRGBEncoding;
      return tex;
    }

    const haloTexture = createRadialTexture('rgba(255, 255, 255, 1.0)', 1.0);
    const shadowTexture = createRadialTexture('rgba(30, 25, 20, 0.45)', 0.45);

    // 4. Concentric Green Torus Rings (radii 1.9 & 2.7)
    const ring1Geo = new THREE.TorusGeometry(1.9, 0.045, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x6FB03A,
      roughness: 0.3,
      metalness: 0.25,
      emissive: 0x6FB03A,
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.95
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.position.set(0, 0, -1.4);
    ring1.rotation.set(0.25, -0.2, 0.4);
    ringsGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.7, 0.055, 16, 120);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x2E7D32,
      roughness: 0.35,
      metalness: 0.2,
      emissive: 0x6FB03A,
      emissiveIntensity: 0.12,
      transparent: true,
      opacity: 0.9
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.position.set(0, 0, -1.45);
    ring2.rotation.set(-0.35, 0.3, -0.3);
    ringsGroup.add(ring2);

    // 5. Hero Chia Oil Bottle (center (0,0,0), height 2.3)
    const heroBottleGroup = new THREE.Group();
    heroBottleGroup.position.set(0, 0, 0);
    mainGroup.add(heroBottleGroup);

    // Transparent cut-out texture plane for Chia Oil
    const chiaOilTex = textureLoader.load('public/products/chia-oil.webp', undefined, undefined, () => {
      // Fallback path
      return textureLoader.load('assets/products/chia-oil.webp');
    });
    chiaOilTex.encoding = THREE.sRGBEncoding;
    chiaOilTex.generateMipmaps = true;
    chiaOilTex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);

    const bottleAspect = 0.85;
    const bottleHeight = 2.3;
    const bottleWidth = bottleAspect * bottleHeight;

    const bottleGeo = new THREE.PlaneGeometry(bottleWidth, bottleHeight);
    const bottleMat = new THREE.MeshStandardMaterial({
      map: chiaOilTex,
      transparent: true,
      alphaTest: 0.02,
      roughness: 0.25,
      metalness: 0.15,
      side: THREE.DoubleSide
    });
    const bottleMesh = new THREE.Mesh(bottleGeo, bottleMat);
    heroBottleGroup.add(bottleMesh);

    // Specular sheen highlight mesh moving with pointer
    const sheenGeo = new THREE.PlaneGeometry(bottleWidth * 0.95, bottleHeight * 0.95);
    const sheenMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const sheenMesh = new THREE.Mesh(sheenGeo, sheenMat);
    sheenMesh.position.set(0, 0, 0.01);
    heroBottleGroup.add(sheenMesh);

    // Contact shadow under hero bottle
    const heroShadowGeo = new THREE.PlaneGeometry(1.4, 0.45);
    const heroShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });
    const heroShadow = new THREE.Mesh(heroShadowGeo, heroShadowMat);
    heroShadow.position.set(0, -1.18, -0.05);
    heroBottleGroup.add(heroShadow);

    // 6. Build 10 Transparent Cut-out / Sticker Product Planes
    const productPlanes = [];
    const interactiveMeshes = [];

    Object.keys(LAYOUT).forEach((slug) => {
      const cfg = LAYOUT[slug];
      const prodMeta = PRODUCTS.find(p => p.slug === slug) || { name: slug, sizes: '', use: '', group: cfg.group };

      const cardGroup = new THREE.Group();
      cardGroup.position.set(cfg.x * 0.15, cfg.y * 0.15, cfg.z - 0.6);
      cardGroup.scale.set(0.001, 0.001, 0.001);
      cardGroup.rotation.z = (cfg.rotZ + (cfg.rotZ >= 0 ? 25 : -25)) * (Math.PI / 180);

      // Texture loading with fallback
      const texPath = `public/products/${slug}.webp`;
      const tex = textureLoader.load(texPath, undefined, undefined, () => {
        return textureLoader.load(`assets/products/${slug}.webp`);
      });
      tex.encoding = THREE.sRGBEncoding;
      tex.generateMipmaps = true;
      tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);

      // Depth treatment for z below -2
      const isBackLayer = cfg.z < -2.0;
      if (isBackLayer) {
        tex.mipMapBias = Math.abs(cfg.z) * 0.6;
      }

      const pHeight = cfg.height;
      const pWidth = pHeight * 0.88; // Default aspect ratio

      const planeGeo = new THREE.PlaneGeometry(pWidth, pHeight);
      const planeMat = new THREE.MeshStandardMaterial({
        map: tex,
        transparent: true,
        alphaTest: 0.02,
        roughness: isBackLayer ? 0.45 : 0.3,
        metalness: 0.05,
        opacity: isBackLayer ? 0.94 : 1.0,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(planeGeo, planeMat);
      mesh.userData = {
        slug,
        meta: prodMeta,
        config: cfg,
        group: cardGroup,
        baseZ: cfg.z,
        baseScale: 1.0,
        isHovered: false
      };
      cardGroup.add(mesh);
      interactiveMeshes.push(mesh);

      // Soft Halo in group color at 25% alpha
      const haloColor = GROUP_COLORS[cfg.group] || 0x6FB03A;
      const haloGeo = new THREE.PlaneGeometry(pWidth * 1.5, pHeight * 1.5);
      const haloMat = new THREE.MeshBasicMaterial({
        map: haloTexture,
        color: haloColor,
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
        blending: THREE.NormalBlending
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(0, 0, -0.05);
      cardGroup.add(halo);

      // Faint contact shadow blob
      const shadowGeo = new THREE.PlaneGeometry(pWidth * 0.9, 0.35);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.28,
        depthWrite: false
      });
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.position.set(0, -pHeight * 0.52, -0.02);
      cardGroup.add(shadow);

      productsGroup.add(cardGroup);

      productPlanes.push({
        slug,
        meta: prodMeta,
        config: cfg,
        group: cardGroup,
        mesh,
        halo,
        shadow,
        material: planeMat,
        hasBurst: false,
        currentParallax: { x: 0, y: 0 }
      });
    });

    // 7. Drifting Particles: Chia Seeds (black & cream) + Petals (pink & green)
    const particles = [];
    const seedGeo = new THREE.SphereGeometry(0.055, 8, 8);
    seedGeo.scale(1, 1.45, 0.7);

    const blackSeedMat = new THREE.MeshStandardMaterial({
      color: 0x1F1F1F,
      roughness: 0.2,
      metalness: 0.3
    });
    const creamSeedMat = new THREE.MeshStandardMaterial({
      color: 0xE8DFC8,
      roughness: 0.35,
      metalness: 0.1
    });

    // 400 Seeds
    const seedCount = width < 820 ? 120 : 380;
    for (let i = 0; i < seedCount; i++) {
      const mat = (i % 6 === 0) ? creamSeedMat : blackSeedMat;
      const mesh = new THREE.Mesh(seedGeo, mat);
      const initialPos = new THREE.Vector3(
        (Math.random() - 0.5) * 11,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6 - 0.5
      );
      mesh.position.copy(initialPos);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      particlesGroup.add(mesh);

      particles.push({
        mesh,
        basePos: initialPos.clone(),
        velocity: new THREE.Vector3(0, 0, 0),
        rotSpeed: { x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02 },
        floatSpeed: 0.006 + Math.random() * 0.01,
        phase: Math.random() * Math.PI * 2,
        isPetal: false
      });
    }

    // 60 Petals (pink & green)
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.quadraticCurveTo(0.18, 0.25, 0.12, 0.5);
    petalShape.quadraticCurveTo(0, 0.7, -0.12, 0.5);
    petalShape.quadraticCurveTo(-0.18, 0.25, 0, 0);
    const petalGeo = new THREE.ShapeGeometry(petalShape);

    const pinkPetalMat = new THREE.MeshStandardMaterial({
      color: 0xE0559B, // hibiscus pink #E0559B
      roughness: 0.4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92
    });
    const greenPetalMat = new THREE.MeshStandardMaterial({
      color: 0x6FB03A, // leaf green #6FB03A
      roughness: 0.35,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });

    const petalCount = width < 820 ? 24 : 65;
    for (let i = 0; i < petalCount; i++) {
      const mat = (i % 3 === 0) ? greenPetalMat : pinkPetalMat;
      const mesh = new THREE.Mesh(petalGeo, mat);
      const scale = 0.55 + Math.random() * 0.5;
      mesh.scale.set(scale, scale, scale);
      const initialPos = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 7.5,
        (Math.random() - 0.5) * 5
      );
      mesh.position.copy(initialPos);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      particlesGroup.add(mesh);

      particles.push({
        mesh,
        basePos: initialPos.clone(),
        velocity: new THREE.Vector3(0, 0, 0),
        rotSpeed: { x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02, z: (Math.random() - 0.5) * 0.015 },
        floatSpeed: 0.005 + Math.random() * 0.008,
        phase: Math.random() * Math.PI * 2,
        isPetal: true
      });
    }

    // 8. One-Shot Burst Particle System
    const activeBursts = [];
    function emitPopBurst(pos) {
      const burstObj = new THREE.Group();
      burstObj.position.copy(pos);
      burstGroup.add(burstObj);

      const items = [];
      // 14 chia seeds
      for (let i = 0; i < 14; i++) {
        const sm = new THREE.Mesh(seedGeo, blackSeedMat);
        sm.scale.set(0.7, 0.7, 0.7);
        burstObj.add(sm);
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        const speed = 1.2 + Math.random() * 1.8;
        items.push({
          mesh: sm,
          vx: Math.cos(theta) * Math.cos(phi) * speed,
          vy: Math.sin(phi) * speed,
          vz: Math.sin(theta) * Math.cos(phi) * speed
        });
      }
      // 6 petals
      for (let i = 0; i < 6; i++) {
        const pm = new THREE.Mesh(petalGeo, pinkPetalMat);
        pm.scale.set(0.4, 0.4, 0.4);
        burstObj.add(pm);
        const theta = Math.random() * Math.PI * 2;
        const speed = 0.9 + Math.random() * 1.4;
        items.push({
          mesh: pm,
          vx: Math.cos(theta) * speed,
          vy: Math.sin(theta) * speed + 0.3,
          vz: (Math.random() - 0.5) * 0.8
        });
      }

      // Soft ring ripple expanding from 0.2 to 1.6
      const rippleGeo = new THREE.RingGeometry(0.18, 0.22, 32);
      const rippleMat = new THREE.MeshBasicMaterial({
        color: 0x6FB03A,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      const ripple = new THREE.Mesh(rippleGeo, rippleMat);
      burstObj.add(ripple);

      activeBursts.push({
        group: burstObj,
        items,
        ripple,
        startTime: performance.now(),
        duration: 800 // 0.8s
      });
    }

    // 9. Pointer & Cursor State
    const pointer = { x: 0, y: 0 };
    const smoothPointer = { x: 0, y: 0 };
    let mouseWorldPos = new THREE.Vector3(0, 0, 0);
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2(-999, -999);
    let hoveredMesh = null;

    // Tooltip Element
    let tooltipEl = document.getElementById('hero-product-tooltip');
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'hero-product-tooltip';
      tooltipEl.className = 'hero-product-tooltip';
      document.body.appendChild(tooltipEl);
    }

    window.addEventListener('mousemove', (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

      mouseCoord.x = pointer.x;
      mouseCoord.y = pointer.y;

      // Position tooltip near cursor
      if (tooltipEl.classList.contains('visible')) {
        const offset = 18;
        let left = e.clientX + offset;
        let top = e.clientY + offset;
        if (left + 280 > window.innerWidth) left = e.clientX - 290;
        if (top + 160 > window.innerHeight) top = e.clientY - 170;
        tooltipEl.style.left = `${left}px`;
        tooltipEl.style.top = `${top}px`;
      }
    });

    // Tap/Click on product
    window.addEventListener('click', () => {
      if (hoveredMesh && hoveredMesh.userData) {
        const slug = hoveredMesh.userData.slug;
        window.location.href = `product.html?id=${slug}`;
      }
    });

    // Touch support (drag tilt)
    let isTouching = false;
    let touchStartX = 0;
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isTouching = true;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    });
    window.addEventListener('touchmove', (e) => {
      if (isTouching && e.touches.length === 1) {
        const dx = (e.touches[0].clientX - touchStartX) / (window.innerWidth * 0.5);
        const dy = (e.touches[0].clientY - touchStartY) / (window.innerHeight * 0.5);
        pointer.x = Math.max(-1, Math.min(1, dx));
        pointer.y = Math.max(-1, Math.min(1, -dy));
      }
    });
    window.addEventListener('touchend', () => {
      isTouching = false;
    });

    // 10. Scroll Integration via GSAP ScrollTrigger
    let scrollProgress = isReducedMotion ? 1.0 : 0.0;
    let prevScrollProgress = 0.0;
    let scrollVelocity = 0.0;

    const scrollContainer = document.getElementById('hero-scroll-container');
    const captionBlock = document.getElementById('hero-caption-block');
    const railBar = document.getElementById('hero-rail-bar');
    const railTicks = document.querySelectorAll('.hero-rail-tick');
    const finaleCtas = document.getElementById('hero-finale-ctas');

    function updateCaptions(p) {
      if (!captionBlock) return;

      let section = 'hero';
      if (p >= 0.10 && p < 0.35) section = 'chia';
      else if (p >= 0.35 && p < 0.60) section = 'hibiscus';
      else if (p >= 0.60 && p < 0.85) section = 'yacon';
      else if (p >= 0.85) section = 'granola';

      if (captionBlock.dataset.currentSection !== section) {
        captionBlock.dataset.currentSection = section;

        if (section === 'hero') {
          captionBlock.innerHTML = `
            <span class="hero-caption-tagline">"Food as medicine"</span>
            <h2 class="hero-caption-title">Chia Oil Superfood Elixir</h2>
            <p class="hero-caption-body">We're all about natural innovative food products that promote vitality and wellbeing. All our products are free from artificial additives.</p>
            <div style="font-size: 13px; color: var(--color-primary); font-weight: 600;">Scroll to unpack the harvest &darr;</div>
          `;
        } else if (section === 'chia') {
          captionBlock.innerHTML = `
            <span class="hero-caption-tagline">Mount Kenya Harvest</span>
            <h2 class="hero-caption-title">Chia Range</h2>
            <p class="hero-caption-body">Plant-based Omega-3, calcium, protein, and soluble dietary fiber for heart and gut vitality.</p>
            <div class="hero-caption-products">
              <div class="hero-caption-item"><strong>Chia Seeds</strong> <span>100g · 200g · 500g</span></div>
              <div class="hero-caption-item"><strong>Chia Uji Porridge</strong> <span>1kg · 500g</span></div>
              <div class="hero-caption-item"><strong>Chia Yoghurt</strong> <span>250ml to 5L</span></div>
            </div>
          `;
        } else if (section === 'hibiscus') {
          captionBlock.innerHTML = `
            <span class="hero-caption-tagline">Natural Vitality</span>
            <h2 class="hero-caption-title">Hibiscus &amp; Herbal Teas</h2>
            <p class="hero-caption-body">Sun-dried ruby roselle calyxes rich in anthocyanin antioxidants, blood pressure support, and soothing aromatics.</p>
            <div class="hero-caption-products">
              <div class="hero-caption-item"><strong>Hibiscus Herbal Blend</strong> <span>50g (25 bags)</span></div>
              <div class="hero-caption-item"><strong>Hibiscus Dried Flowers</strong> <span>100g</span></div>
              <div class="hero-caption-item"><strong>Hibiscus Powder</strong> <span>200g · 100g</span></div>
            </div>
          `;
        } else if (section === 'yacon') {
          captionBlock.innerHTML = `
            <span class="hero-caption-tagline">Fermented Probiotics</span>
            <h2 class="hero-caption-title">Yacon Probiotics</h2>
            <p class="hero-caption-body">Living microflora fermented with Kenyan yacon roots, naturally rich in prebiotic FOS to nourish gut microbiota.</p>
            <div class="hero-caption-products">
              <div class="hero-caption-item"><strong>Yacon Immune Boost</strong> <span>250ml · 500ml</span></div>
              <div class="hero-caption-item"><strong>Yacon Syrup Kefir</strong> <span>500ml · 1L</span></div>
              <div class="hero-caption-item"><strong>Yacon Inulin Capsules</strong> <span>40 capsules</span></div>
            </div>
          `;
        } else if (section === 'granola') {
          captionBlock.innerHTML = `
            <span class="hero-caption-tagline">Whole Food Snacks</span>
            <h2 class="hero-caption-title">Complete 11-Product Ring</h2>
            <p class="hero-caption-body">Stone-milled, slow-fermented, and cold-pressed without a single artificial additive.</p>
            <div class="hero-caption-products">
              <div class="hero-caption-item"><strong>Plantain &amp; Pumpkin Granola</strong> <span>400g · 200g · 100g</span></div>
            </div>
          `;
        }
      }

      // Update 4-tick progress rail
      if (railBar) {
        railBar.style.width = `${Math.min(100, p * 100)}%`;
      }
      railTicks.forEach(tick => {
        const group = tick.dataset.group;
        if (group === section) {
          tick.classList.add('active');
        } else {
          tick.classList.remove('active');
        }
      });

      // Show finale CTAs at 85-100%
      if (finaleCtas) {
        if (p >= 0.85) {
          finaleCtas.classList.add('visible');
        } else {
          finaleCtas.classList.remove('visible');
        }
      }
    }

    if (window.gsap && window.ScrollTrigger && scrollContainer && !isReducedMotion) {
      window.gsap.registerPlugin(window.ScrollTrigger);

      window.ScrollTrigger.create({
        trigger: scrollContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          scrollProgress = self.progress;
          updateCaptions(scrollProgress);
        }
      });
    } else {
      updateCaptions(scrollProgress);
    }

    // 11. Render Loop & Animation Physics
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const dt = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Velocity calculation
      scrollVelocity = (scrollProgress - prevScrollProgress) / Math.max(0.001, dt);
      prevScrollProgress = scrollProgress;

      // Smooth pointer lerp (6% per frame)
      smoothPointer.x += (pointer.x - smoothPointer.x) * 0.06;
      smoothPointer.y += (pointer.y - smoothPointer.y) * 0.06;

      // Mouse world position on z = 0 plane for particle repulsion
      mouseWorldPos.set(smoothPointer.x * 4.5, smoothPointer.y * 3.5, 0);

      // (A) Hero Chia Oil Bottle Motion
      // Idle bob ±0.04 over 5 seconds
      const bobY = Math.sin(elapsedTime * (Math.PI * 2 / 5.0)) * 0.04;
      heroBottleGroup.position.y = bobY;

      // Bottle moves opposite to cursor at +pointer * 0.05
      heroBottleGroup.position.x = smoothPointer.x * 0.05;

      // Bottle tilts up to ±0.22 rad toward cursor
      heroBottleGroup.rotation.y = smoothPointer.x * 0.22;
      heroBottleGroup.rotation.x = -smoothPointer.y * 0.16;

      // Specular sheen follows cursor across glass
      sheenMesh.position.x = smoothPointer.x * 0.12;
      sheenMesh.position.y = smoothPointer.y * 0.12;

      // (B) Concentric Rings Animation
      // Rings rotate progress * 2PI + slow idle spin
      ring1.rotation.z = scrollProgress * Math.PI * 2 + elapsedTime * 0.15;
      ring2.rotation.z = -(scrollProgress * Math.PI * 2) - elapsedTime * 0.12;

      // Yacon range (60-85%): rings glow brighter
      if (scrollProgress >= 0.60 && scrollProgress <= 0.85) {
        const glowBoost = Math.sin(((scrollProgress - 0.60) / 0.25) * Math.PI);
        ring1Mat.emissiveIntensity = 0.15 + glowBoost * 0.45;
        ring2Mat.emissiveIntensity = 0.12 + glowBoost * 0.40;
      } else {
        ring1Mat.emissiveIntensity = 0.15;
        ring2Mat.emissiveIntensity = 0.12;
      }

      // (C) Camera Dolly Back (85-100%: z 7 -> 7.8)
      if (scrollProgress > 0.85) {
        const dollyP = (scrollProgress - 0.85) / 0.15;
        camera.position.z = 7.0 + dollyP * 0.8;
      } else {
        camera.position.z = 7.0;
      }

      // (D) Animate 10 Product Cut-out Planes
      productPlanes.forEach((prod) => {
        const cfg = prod.config;
        const grp = prod.group;
        const mesh = prod.mesh;

        // Calculate pop local progress
        let t = 0;
        if (isReducedMotion) {
          t = 1.0;
        } else {
          t = Math.max(0, Math.min(1, (scrollProgress - cfg.popStart) / (cfg.popEnd - cfg.popStart)));
        }

        // Trigger burst on forward pass
        if (t > 0 && !prod.hasBurst) {
          prod.hasBurst = true;
          emitPopBurst(new THREE.Vector3(cfg.x, cfg.y, cfg.z));
        } else if (t === 0 && prod.hasBurst) {
          prod.hasBurst = false;
        }

        const easeVal = easeOutBack(t, 1.9);
        const currentScale = isReducedMotion ? 1.0 : Math.max(0, easeVal);

        // Position: start at (x*0.15, y*0.15, z-0.6), end at layout pos with arc
        const startX = cfg.x * 0.15;
        const startY = cfg.y * 0.15;
        const startZ = cfg.z - 0.6;
        const arcY = Math.sin(t * Math.PI) * 0.35;

        const posX = startX + (cfg.x - startX) * t;
        const posY = startY + (cfg.y - startY) * t + arcY;
        const posZ = startZ + (cfg.z - startZ) * t;

        // Layer Parallax offset: -pointer * (0.10 + 0.07 * |z|)
        const parallaxFactor = 0.10 + 0.07 * Math.abs(cfg.z);
        const targetParallaxX = -smoothPointer.x * parallaxFactor;
        const targetParallaxY = -smoothPointer.y * parallaxFactor;
        prod.currentParallax.x += (targetParallaxX - prod.currentParallax.x) * 0.06;
        prod.currentParallax.y += (targetParallaxY - prod.currentParallax.y) * 0.06;

        // Tilt: rotY = pointer.x * 0.25 * depthFactor, rotX = -pointer.y * 0.18 * depthFactor
        const depthFactor = 1.0 - Math.abs(cfg.z) / 4.0;
        const tiltY = smoothPointer.x * 0.25 * depthFactor;
        const tiltX = -smoothPointer.y * 0.18 * depthFactor;

        // Idle life float ±0.03 on own phase offset
        const idleFloat = Math.sin(elapsedTime * 1.5 + (cfg.rotZ || 0)) * 0.03;

        // Hover effect: z += 0.8, scale * 1.12
        const isHovered = mesh.userData.isHovered;
        const hoverZOffset = isHovered ? 0.8 : 0.0;
        const hoverScaleMult = isHovered ? 1.12 : 1.0;

        grp.position.set(
          posX + prod.currentParallax.x,
          posY + prod.currentParallax.y + idleFloat,
          posZ + hoverZOffset
        );

        const targetRotRad = (cfg.rotZ * Math.PI) / 180;
        const startRotRad = (cfg.rotZ + (cfg.rotZ >= 0 ? 25 : -25)) * (Math.PI / 180);
        grp.rotation.z = startRotRad + (targetRotRad - startRotRad) * t;
        grp.rotation.y = tiltY;
        grp.rotation.x = tiltX;

        grp.scale.set(
          currentScale * hoverScaleMult,
          currentScale * hoverScaleMult,
          currentScale * hoverScaleMult
        );

        // Opacity
        prod.material.opacity = Math.min(cfg.z < -2 ? 0.94 : 1.0, t * 1.4);

        // Hover brightness dimming
        if (hoveredMesh && !isHovered) {
          prod.material.color.setScalar(0.8);
        } else {
          prod.material.color.setScalar(1.0);
        }

        // Halo brighten
        prod.halo.material.opacity = isHovered ? 0.65 : 0.25;
      });

      // (E) Raycasting for Hover Interaction
      raycaster.setFromCamera(mouseCoord, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const topMesh = intersects[0].object;
        if (hoveredMesh !== topMesh) {
          if (hoveredMesh) hoveredMesh.userData.isHovered = false;
          hoveredMesh = topMesh;
          hoveredMesh.userData.isHovered = true;

          // Populate and show tooltip
          const meta = hoveredMesh.userData.meta;
          if (meta && tooltipEl) {
            tooltipEl.innerHTML = `
              <div class="tooltip-title">${meta.name}</div>
              <div class="tooltip-sizes">Available in: ${meta.sizes}</div>
              ${meta.note ? `<div class="tooltip-note">${meta.note}</div>` : ''}
              <p class="tooltip-use">Suggested use: ${meta.use}</p>
            `;
            tooltipEl.classList.add('visible');
          }
        }
      } else {
        if (hoveredMesh) {
          hoveredMesh.userData.isHovered = false;
          hoveredMesh = null;
        }
        if (tooltipEl) {
          tooltipEl.classList.remove('visible');
        }
      }

      // (F) Animate Drifting Particles & Cursor Repulsion
      const stretchY = 1.0 + Math.min(1.2, Math.abs(scrollVelocity) * 0.4);
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        const m = pt.mesh;

        // Idle float
        const floatY = Math.sin(elapsedTime * 1.6 + pt.phase) * 0.35;
        let targetX = pt.basePos.x;
        let targetY = pt.basePos.y + floatY;

        // Repel from cursor within 1.4 units
        const dx = targetX - mouseWorldPos.x;
        const dy = targetY - mouseWorldPos.y;
        const distSq = dx * dx + dy * dy;
        const repelRadius = 1.4;

        if (distSq < repelRadius * repelRadius && distSq > 0.001) {
          const dist = Math.sqrt(distSq);
          const force = (repelRadius - dist) / repelRadius;
          targetX += (dx / dist) * force * 0.7;
          targetY += (dy / dist) * force * 0.7;
        }

        m.position.x += (targetX - m.position.x) * 0.08;
        m.position.y += (targetY - m.position.y) * 0.08;

        // Stretch along scroll direction
        m.scale.y = stretchY * (pt.isPetal ? 0.7 : 1.45);

        // Rotation
        if (pt.rotSpeed.x) m.rotation.x += pt.rotSpeed.x;
        if (pt.rotSpeed.y) m.rotation.y += pt.rotSpeed.y;
        if (pt.rotSpeed.z) m.rotation.z += pt.rotSpeed.z;
      }

      // (G) Animate Active Bursts
      const now = performance.now();
      for (let b = activeBursts.length - 1; b >= 0; b--) {
        const burst = activeBursts[b];
        const elapsed = now - burst.startTime;
        const progress = elapsed / burst.duration;

        if (progress >= 1.0) {
          burstGroup.remove(burst.group);
          activeBursts.splice(b, 1);
        } else {
          // Radiate items
          burst.items.forEach(item => {
            item.mesh.position.x += item.vx * dt;
            item.mesh.position.y += item.vy * dt;
            item.mesh.position.z += item.vz * dt;
            item.mesh.scale.multiplyScalar(0.98);
          });
          // Ripple expands 0.2 -> 1.6
          const ripScale = 0.2 + progress * 1.4;
          burst.ripple.scale.set(ripScale, ripScale, 1);
          burst.ripple.material.opacity = (1 - progress) * 0.7;
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    // 12. Resize Listener
    window.addEventListener('resize', () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
  }

  // Initialize
  if (document.readyState === 'complete') {
    setTimeout(initHeroScene, 100);
  } else {
    window.addEventListener('load', () => {
      setTimeout(initHeroScene, 100);
    });
  }
})();
