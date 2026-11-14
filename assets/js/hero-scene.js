/**
 * AFYALISHE WELLNESS - THREE.JS 3D HERO SCENE
 * Floating Afyalishe products, drifting ingredients (chia seeds, hibiscus petals, leaves, granola),
 * logo curved swoosh ring, and smooth cursor-driven parallax tilt.
 */

(function () {
  const config = window.AFYALISHE_MOTION_CONFIG?.heroScene;
  if (!config || !config.enabled || typeof THREE === 'undefined') {
    return;
  }

  // Check prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  function initHeroScene() {
    const container = document.getElementById('hero-3d-scene-container');
    const fallbackVisual = document.querySelector('.hero-fallback-visual');
    if (!container) return;

    // Dimensions
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 560;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    // Warm Cream background matching page
    scene.background = new THREE.Color(0xF0EBE9);
    // Subtle scene fog for depth-of-field effect
    scene.fog = new THREE.FogExp2(0xF0EBE9, 0.035);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL not supported, keeping static hero fallback', e);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, config.maxPixelRatio));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    // Insert canvas into container
    renderer.domElement.className = 'hero-3d-canvas';
    container.appendChild(renderer.domElement);

    // Fade out static fallback visual once WebGL is ready
    if (fallbackVisual) {
      setTimeout(() => {
        fallbackVisual.classList.add('hidden');
      }, 300);
    }

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfff8f2, 1.1);
    scene.add(ambientLight);

    // Key Light (Sunlight from upper left)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    scene.add(keyLight);

    // Fresh Lime Rim Light (Brand glow #7AC143)
    const limeRimLight = new THREE.DirectionalLight(0x7AC143, 1.0);
    limeRimLight.position.set(-6, -2, -2);
    scene.add(limeRimLight);

    // Warm Terracotta Bounce Light (#BE7133)
    const terracottaBounce = new THREE.PointLight(0xBE7133, 0.8, 15);
    terracottaBounce.position.set(0, -5, 2);
    scene.add(terracottaBounce);

    // Soft Green Point Light for core depth
    const greenGlowLight = new THREE.PointLight(0x589038, 0.9, 12);
    greenGlowLight.position.set(0, 0, -1);
    scene.add(greenGlowLight);

    // 3. Hierarchical Groups for Parallax
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const productsGroup = new THREE.Group();
    mainGroup.add(productsGroup);

    const backgroundGroup = new THREE.Group();
    mainGroup.add(backgroundGroup);

    const ingredientsGroup = new THREE.Group();
    mainGroup.add(ingredientsGroup);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // 4. Background: Afyalishe Logo Curved Green Swoosh Ring
    const swooshCurve = new THREE.EllipseCurve(
      0, 0,             // ax, aY
      3.2, 2.2,         // xRadius, yRadius
      0, 2 * Math.PI,   // aStartAngle, aEndAngle
      false,            // aClockwise
      0                 // aRotation
    );
    const swooshPoints = swooshCurve.getPoints(64);
    const swooshGeometry = new THREE.TorusGeometry(3.0, 0.08, 16, 100);
    const swooshMaterial = new THREE.MeshStandardMaterial({
      color: 0x589038,
      roughness: 0.35,
      metalness: 0.25,
      emissive: 0x7AC143,
      emissiveIntensity: 0.15,
    });
    const swooshRing = new THREE.Mesh(swooshGeometry, swooshMaterial);
    swooshRing.position.set(0, 0.1, -1.5);
    swooshRing.rotation.set(0.35, -0.2, 0.6);
    swooshRing.scale.set(1.1, 0.85, 1);
    backgroundGroup.add(swooshRing);

    // Second inner thin lime swoosh ring
    const innerSwooshGeo = new THREE.TorusGeometry(2.3, 0.04, 16, 80);
    const innerSwooshMat = new THREE.MeshStandardMaterial({
      color: 0x7AC143,
      roughness: 0.2,
      metalness: 0.4,
    });
    const innerSwoosh = new THREE.Mesh(innerSwooshGeo, innerSwooshMat);
    innerSwoosh.position.set(0, 0.1, -1.4);
    innerSwoosh.rotation.set(-0.4, 0.3, -0.4);
    backgroundGroup.add(innerSwoosh);

    // 5. Build 3D Product Meshes with real textures
    // Helper to create product cylinders/boxes
    function createBottleMesh(texturePath, options = {}) {
      const group = new THREE.Group();
      const radius = options.radius || 0.65;
      const height = options.height || 2.1;
      const bodyColor = options.bodyColor || 0xffffff;

      // Bottle body
      const bodyGeo = new THREE.CylinderGeometry(radius, radius * 0.95, height, 32);
      let bodyMat;

      if (texturePath) {
        const tex = textureLoader.load(texturePath);
        tex.wrapS = THREE.RepeatWrapping;
        tex.repeat.set(1, 1);
        bodyMat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.3,
          metalness: 0.1,
          color: 0xffffff,
        });
      } else {
        bodyMat = new THREE.MeshStandardMaterial({
          color: bodyColor,
          roughness: 0.25,
          metalness: 0.1,
        });
      }

      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      // Bottle neck & cap
      const neckGeo = new THREE.CylinderGeometry(radius * 0.35, radius * 0.45, 0.4, 24);
      const neckMat = new THREE.MeshStandardMaterial({
        color: options.capColor || 0xd4af37, // gold/cap
        roughness: 0.2,
        metalness: 0.6,
      });
      const neck = new THREE.Mesh(neckGeo, neckMat);
      neck.position.y = height / 2 + 0.18;
      neck.castShadow = true;
      group.add(neck);

      // Cap / bulb top
      const capGeo = options.isDropper
        ? new THREE.SphereGeometry(radius * 0.28, 16, 16)
        : new THREE.CylinderGeometry(radius * 0.38, radius * 0.38, 0.3, 24);
      const capMat = new THREE.MeshStandardMaterial({
        color: options.isDropper ? 0xffffff : (options.capColor || 0x589038),
        roughness: 0.3,
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = height / 2 + 0.45;
      group.add(cap);

      return group;
    }

    // Helper for Tea Box Mesh
    function createBoxMesh(texturePath, width = 1.3, height = 1.7, depth = 0.9) {
      const group = new THREE.Group();
      const geo = new THREE.BoxGeometry(width, height, depth);
      const tex = textureLoader.load(texturePath);
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.4,
        metalness: 0.05,
      });
      const box = new THREE.Mesh(geo, mat);
      box.castShadow = true;
      box.receiveShadow = true;
      group.add(box);
      return group;
    }

    // 1. Chia Oil Dropper Bottle (Center-Left foreground)
    const chiaOil = createBottleMesh('assets/products/chia-oil.jpg', {
      radius: 0.6,
      height: 1.9,
      capColor: 0xd4af37, // Gold dropper
      isDropper: true,
    });
    chiaOil.position.set(-1.4, -0.2, 0.8);
    chiaOil.rotation.set(0.12, 0.35, -0.15);
    productsGroup.add(chiaOil);

    // 2. Chia Yoghurt Tub (Center foreground, prominent)
    const chiaYoghurt = createBottleMesh('assets/products/chia-yoghurt.jpg', {
      radius: 0.85,
      height: 2.2,
      capColor: 0x7AC143, // Fresh lime cap
      isDropper: false,
    });
    chiaYoghurt.position.set(0.7, 0.3, 0.5);
    chiaYoghurt.rotation.set(-0.15, -0.4, 0.1);
    productsGroup.add(chiaYoghurt);

    // 3. Yacon Kefir Bottle (Back-Left floating)
    const yaconKefir = createBottleMesh('assets/products/yacon-probiotic-syrup-kefir.jpg', {
      radius: 0.55,
      height: 2.3,
      capColor: 0x3f6828,
    });
    yaconKefir.position.set(-2.2, 1.2, -0.6);
    yaconKefir.rotation.set(-0.25, 0.5, -0.2);
    productsGroup.add(yaconKefir);

    // 4. Hibiscus Herbal Tea Box (Right floating)
    const hibiscusBox = createBoxMesh('assets/products/hibiscus-herbal-blend.jpg', 1.35, 1.75, 0.85);
    hibiscusBox.position.set(2.4, -0.4, -0.2);
    hibiscusBox.rotation.set(0.2, -0.45, 0.18);
    productsGroup.add(hibiscusBox);

    // 6. Drifting 3D Ingredients
    const particles = [];

    // (A) Chia Seeds: glossy dark spheroids
    const chiaGeo = new THREE.SphereGeometry(0.065, 8, 8);
    chiaGeo.scale(1, 1.45, 0.7);
    const chiaMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.15,
      metalness: 0.4,
    });

    for (let i = 0; i < config.particleCount.chiaSeeds; i++) {
      const mesh = new THREE.Mesh(chiaGeo, chiaMat);
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5 + 0.5
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      ingredientsGroup.add(mesh);
      particles.push({
        mesh,
        rotSpeed: { x: (Math.random() - 0.5) * 0.03, y: (Math.random() - 0.5) * 0.03 },
        floatSpeed: 0.008 + Math.random() * 0.012,
        initialY: mesh.position.y,
        rangeY: 0.8 + Math.random() * 0.6,
      });
    }

    // (B) Hibiscus Petals: ruby curved planes
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.quadraticCurveTo(0.18, 0.25, 0.12, 0.5);
    petalShape.quadraticCurveTo(0, 0.7, -0.12, 0.5);
    petalShape.quadraticCurveTo(-0.18, 0.25, 0, 0);
    const petalGeo = new THREE.ShapeGeometry(petalShape);
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0x981A3C, // Deep roselle ruby
      roughness: 0.4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92,
    });

    for (let i = 0; i < config.particleCount.hibiscusPetals; i++) {
      const mesh = new THREE.Mesh(petalGeo, petalMat);
      mesh.position.set(
        (Math.random() - 0.5) * 7.5,
        (Math.random() - 0.5) * 5.5,
        (Math.random() - 0.5) * 4
      );
      const scale = 0.7 + Math.random() * 0.6;
      mesh.scale.set(scale, scale, scale);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      ingredientsGroup.add(mesh);
      particles.push({
        mesh,
        rotSpeed: { x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02, z: (Math.random() - 0.5) * 0.02 },
        floatSpeed: 0.006 + Math.random() * 0.01,
        initialY: mesh.position.y,
        rangeY: 1.2,
      });
    }

    // (C) Green Leaves: fresh lime & leaf green curved leaves
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x7AC143,
      roughness: 0.35,
      side: THREE.DoubleSide,
    });
    for (let i = 0; i < config.particleCount.greenLeaves; i++) {
      const mesh = new THREE.Mesh(petalGeo, leafMat);
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4.5
      );
      const s = 0.6 + Math.random() * 0.5;
      mesh.scale.set(s, s * 1.2, s);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      ingredientsGroup.add(mesh);
      particles.push({
        mesh,
        rotSpeed: { x: 0.015, y: 0.01, z: 0.008 },
        floatSpeed: 0.007 + Math.random() * 0.01,
        initialY: mesh.position.y,
        rangeY: 1.0,
      });
    }

    // (D) Granola Pieces: textured golden clusters
    const granolaGeo = new THREE.DodecahedronGeometry(0.12, 1);
    const granolaMat = new THREE.MeshStandardMaterial({
      color: 0xD4A359,
      roughness: 0.7,
      metalness: 0.05,
    });
    for (let i = 0; i < config.particleCount.granolaPieces; i++) {
      const mesh = new THREE.Mesh(granolaGeo, granolaMat);
      mesh.position.set(
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4
      );
      mesh.scale.set(
        0.8 + Math.random() * 0.5,
        0.6 + Math.random() * 0.5,
        0.7 + Math.random() * 0.5
      );
      ingredientsGroup.add(mesh);
      particles.push({
        mesh,
        rotSpeed: { x: 0.01, y: 0.015 },
        floatSpeed: 0.005 + Math.random() * 0.008,
        initialY: mesh.position.y,
        rangeY: 0.7,
      });
    }

    // 7. Cursor Interaction & Spring Damping
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isVisible = true;

    // Mouse movement listener across entire window
    window.addEventListener('mousemove', (e) => {
      // Normalized coordinates: -1 to 1
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      const maxRad = THREE.MathUtils.degToRad(config.maxTiltAngle);
      targetRotationY = mouseX * maxRad;
      targetRotationX = -mouseY * maxRad;
    });

    // Touch tilt (for mobile orientation if supported)
    if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          const normGamma = Math.min(Math.max(e.gamma / 30, -1), 1);
          const normBeta = Math.min(Math.max((e.beta - 45) / 30, -1), 1);
          const maxRad = THREE.MathUtils.degToRad(8);
          targetRotationY = normGamma * maxRad;
          targetRotationX = -normBeta * maxRad;
        }
      });
    }

    // Drag rotation on the 3D canvas
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - prevPointerX;
        const deltaY = e.clientY - prevPointerY;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;

        productsGroup.rotation.y += deltaX * 0.008;
        productsGroup.rotation.x += deltaY * 0.008;
      }
    });

    // Pause rendering when scrolled offscreen for 60fps performance
    if (config.pauseOffscreen && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
      }, { threshold: 0.1 });
      observer.observe(container);
    }

    // Handle Resize
    function onResize() {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', onResize);

    // 8. Animation Render Loop
    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // (A) Smooth Lerp Tilt for Whole Scene
      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * config.lerpDamping;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * config.lerpDamping;

      // Camera gentle parallax
      camera.position.x += (mouseX * 0.45 - camera.position.x) * 0.04;
      camera.position.y += (mouseY * 0.35 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // (B) Rotate Background Logo Swoosh Ring
      swooshRing.rotation.z += config.rotationSpeedRing;
      innerSwoosh.rotation.z -= config.rotationSpeedRing * 1.3;

      // (C) Gentle Organic Bobbing of Floating Products
      chiaOil.position.y = -0.2 + Math.sin(elapsedTime * 1.4) * 0.08;
      chiaOil.rotation.y += 0.004;

      chiaYoghurt.position.y = 0.3 + Math.cos(elapsedTime * 1.2) * 0.1;
      chiaYoghurt.rotation.y -= 0.003;

      yaconKefir.position.y = 1.2 + Math.sin(elapsedTime * 1.1 + 1.5) * 0.09;
      yaconKefir.rotation.y += 0.0035;

      hibiscusBox.position.y = -0.4 + Math.cos(elapsedTime * 1.3 + 2.0) * 0.08;
      hibiscusBox.rotation.y += 0.003;

      // (D) Animate Drifting Ingredients with sinusoidal motion
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.mesh.position.y = p.initialY + Math.sin(elapsedTime * 1.5 + i) * (p.rangeY * 0.15);
        if (p.rotSpeed.x) p.mesh.rotation.x += p.rotSpeed.x;
        if (p.rotSpeed.y) p.mesh.rotation.y += p.rotSpeed.y;
        if (p.rotSpeed.z) p.mesh.rotation.z += p.rotSpeed.z;
      }

      renderer.render(scene, camera);
    }

    animate();
  }

  // Lazy-load after first paint
  if (document.readyState === 'complete') {
    setTimeout(initHeroScene, config.lazyLoadDelayMs);
  } else {
    window.addEventListener('load', () => {
      setTimeout(initHeroScene, config.lazyLoadDelayMs);
    });
  }
})();
