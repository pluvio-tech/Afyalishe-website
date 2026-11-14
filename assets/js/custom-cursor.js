/**
 * AFYALISHE WELLNESS - CUSTOM CURSOR MODULE
 * Lime Green dot with elastic trailing ring and contextual badge labels ("View", "Add", "Drag")
 */

(function () {
  const config = window.AFYALISHE_MOTION_CONFIG?.customCursor;
  if (!config || !config.enabled) return;

  // Don't initialize on touch screens or small mobile viewports
  if (config.hideOnTouch && (('ontouchstart' in window) || (window.matchMedia('(hover: none)').matches))) {
    return;
  }

  // Create cursor elements
  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';

  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isMoving = false;
  let ringLabel = '';

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    if (!isMoving) {
      isMoving = true;
      ring.classList.add('active');
    }
  });

  window.addEventListener('mouseleave', () => {
    ring.classList.remove('active');
    dot.style.opacity = '0';
  });

  window.addEventListener('mouseenter', () => {
    ring.classList.add('active');
    dot.style.opacity = '1';
  });

  // Smooth lerp loop for the trailing ring
  function animateRing() {
    ringX += (mouseX - ringX) * config.damping;
    ringY += (mouseY - ringY) * config.damping;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  requestAnimationFrame(animateRing);

  // Contextual Hover Detection
  function setupHoverListeners() {
    // Buttons & Links
    document.querySelectorAll('a, button, .btn, .icon-btn, input, select').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('hover-button');
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('hover-button');
      });
    });

    // Product Cards: Contextual "View"
    document.querySelectorAll('.product-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        ring.classList.add('hover-product');
        ring.textContent = 'View';
      });
      card.addEventListener('mouseleave', () => {
        ring.classList.remove('hover-product');
        ring.textContent = '';
      });
    });

    // Quick Add buttons: Contextual "Add"
    document.querySelectorAll('.btn-add-quick').forEach((btn) => {
      btn.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        ring.classList.add('hover-product');
        ring.textContent = 'Add';
      });
      btn.addEventListener('mouseleave', (e) => {
        e.stopPropagation();
        ring.classList.remove('hover-product');
        ring.textContent = '';
      });
    });

    // 3D Canvas / Interactive Viewers: Contextual "Drag"
    document.querySelectorAll('.hero-3d-scene-wrap, .product-interactive-viewer').forEach((canvas) => {
      canvas.addEventListener('mouseenter', () => {
        ring.classList.add('hover-drag');
        ring.textContent = 'Drag';
      });
      canvas.addEventListener('mouseleave', () => {
        ring.classList.remove('hover-drag');
        ring.textContent = '';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupHoverListeners);
  } else {
    setupHoverListeners();
  }

  // Expose hook to rebind on dynamic content
  window.initCustomCursorHover = setupHoverListeners;
})();
