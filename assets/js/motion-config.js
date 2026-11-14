/**
 * AFYALISHE WELLNESS - 3D MOTION & INTERACTION CONFIGURATION
 * Single master settings file to tune intensity or toggle any effect on/off.
 * 
 * Libraries Used:
 * - Three.js (r128) - 3D Hero Scene, WebGL shaders & procedural ingredient meshes
 * - GSAP (3.12.5) & ScrollTrigger - Scroll choreography & 360° bottle showcase
 */

window.AFYALISHE_MOTION_CONFIG = {
  // Global Motion Master Switch (set false to disable all 3D motion)
  enabled: true,

  // Custom Cursor (small Lime Green dot with trailing elastic ring)
  customCursor: {
    enabled: true,
    dotColor: '#7AC143',
    ringColor: 'rgba(122, 193, 67, 0.7)',
    dotSize: 8,
    ringSize: 38,
    damping: 0.18,          // Spring responsiveness (0.05 to 0.3)
    hideOnTouch: true,      // Automatically disables on touchscreens
  },

  // Magnetic Buttons (primary buttons pull slightly within radius)
  magneticButtons: {
    enabled: true,
    radius: 60,             // Activation distance in px
    intensity: 0.35,        // Magnetic attraction strength
    damping: 0.2,
  },

  // 3D Card Tilt (perspective tilt toward cursor with specular highlight & shadow shift)
  cardTilt: {
    enabled: true,
    maxTiltAngle: 10,       // Maximum degrees of tilt (5-15 deg)
    perspective: 1000,      // CSS 3D perspective in px
    glare: true,            // Dynamic moving light reflection highlight
    glareOpacity: 0.38,
    scaleOnHover: 1.025,
    speed: 400,             // Transition speed in ms
    easing: 'cubic-bezier(0.03, 0.98, 0.52, 0.99)',
  },

  // Three.js Hero 3D Scene
  heroScene: {
    enabled: true,
    maxTiltAngle: 12,       // Max degrees scene tilts toward cursor
    lerpDamping: 0.05,       // Smooth interpolation factor
    cameraParallax: 0.08,   // Camera position shift intensity
    rotationSpeedRing: 0.003, // Background logo swoosh ring slow rotation
    particleCount: {
      chiaSeeds: 35,
      hibiscusPetals: 16,
      greenLeaves: 18,
      granolaPieces: 20
    },
    maxPixelRatio: 2,       // Cap pixel ratio for mobile performance
    pauseOffscreen: true,   // IntersectionObserver auto-pause
    lazyLoadDelayMs: 120,   // Wait after first paint before mounting WebGL
  },

  // 360° Scroll-Driven Showcase
  scrollShowcase: {
    enabled: true,
    rotationDegrees: 360,
    scrubSpeed: 1,
  },

  // Single Product Interactive 3D/Zoom Viewport
  productViewer: {
    enabled: true,
    maxTiltAngle: 16,
    zoomFactor: 1.25,
    allowDragRotate: true,
    inertiaDamping: 0.92,
  },

  // Accessibility: automatically disables all motion when user requested reduced motion
  respectPrefersReducedMotion: true,
};

// Check if user has requested reduced motion
if (window.AFYALISHE_MOTION_CONFIG.respectPrefersReducedMotion && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.AFYALISHE_MOTION_CONFIG.enabled = false;
  window.AFYALISHE_MOTION_CONFIG.customCursor.enabled = false;
  window.AFYALISHE_MOTION_CONFIG.cardTilt.enabled = false;
  window.AFYALISHE_MOTION_CONFIG.magneticButtons.enabled = false;
  window.AFYALISHE_MOTION_CONFIG.heroScene.enabled = false;
  window.AFYALISHE_MOTION_CONFIG.scrollShowcase.enabled = false;
  window.AFYALISHE_MOTION_CONFIG.productViewer.enabled = false;
}
