/**
 * AFYALISHE WELLNESS - DRAG-TO-ORBIT WHEEL CAROUSEL
 * 
 * Mathematical Orbit Architecture:
 * - 11 authentic products positioned in a 3D perspective orbit.
 * - Each product's angle is converted to sin/cos and baked into a single CSS matrix(a, b, c, d, tx, ty) transform.
 * - Recalculated every single frame of drag, momentum inertia, and idle drift.
 * - Features pointer drag, momentum physics, click-to-focus, arrow/dot navigation, and live product spotlight.
 */

(function () {
  'use strict';

  function initOrbitWheel() {
    const stage = document.getElementById('orbit-wheel-stage');
    if (!stage) return;

    const store = window.AFYALISHE_STORE;
    if (!store || !store.products || store.products.length === 0) {
      setTimeout(initOrbitWheel, 50);
      return;
    }

    const products = store.products; // All 11 authentic products
    const N = products.length; // 11
    const angleStep = (Math.PI * 2) / N;

    // DOM Containers
    const wheelTrack = document.getElementById('orbit-wheel-track');
    const spotlightTitle = document.getElementById('orbit-spotlight-title');
    const spotlightCategory = document.getElementById('orbit-spotlight-category');
    const spotlightDesc = document.getElementById('orbit-spotlight-desc');
    const spotlightUse = document.getElementById('orbit-spotlight-use');
    const spotlightSizes = document.getElementById('orbit-spotlight-sizes');
    const spotlightWhatsApp = document.getElementById('orbit-spotlight-whatsapp');
    const spotlightView = document.getElementById('orbit-spotlight-view');
    const dotsContainer = document.getElementById('orbit-dots-container');
    const prevBtn = document.getElementById('orbit-prev-btn');
    const nextBtn = document.getElementById('orbit-next-btn');

    // Create 11 Product Card Elements
    const cardElements = [];
    wheelTrack.innerHTML = '';

    products.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = 'orbit-card';
      card.dataset.index = idx;
      card.dataset.id = p.id;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${p.name} - ${p.categoryName}`);

      card.innerHTML = `
        <div class="orbit-card-inner">
          <div class="orbit-card-badge-wrap">
            <span class="orbit-card-cat-badge">${p.categoryName}</span>
          </div>
          <div class="orbit-card-media">
            <img src="${p.image}" alt="${p.name}" draggable="false" loading="eager">
          </div>
          <div class="orbit-card-info">
            <h4 class="orbit-card-title">${p.name}</h4>
            <div class="orbit-card-sizes">
              ${p.sizes.slice(0, 3).map(s => `<span class="size-pill">${s}</span>`).join('')}
              ${p.sizes.length > 3 ? `<span class="size-pill">+${p.sizes.length - 3}</span>` : ''}
            </div>
            <div class="orbit-card-footer">
              <span class="orbit-card-action-cue">Tap to Focus &rarr;</span>
            </div>
          </div>
        </div>
      `;

      wheelTrack.appendChild(card);
      cardElements.push(card);
    });

    // Create 11 Dot Indicators
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      products.forEach((p, idx) => {
        const dot = document.createElement('button');
        dot.className = `orbit-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `View ${p.name}`);
        dot.addEventListener('click', () => {
          rotateToProduct(idx);
        });
        dotsContainer.appendChild(dot);
      });
    }

    // Mathematical Orbit Physics State
    let currentAngle = 0; // Current rotation (rad)
    let targetAngle = 0;  // Target rotation for smooth snapping (rad)
    let velocity = 0;     // Angular velocity for inertia (rad/frame)
    let isDragging = false;
    let dragStartX = 0;
    let dragStartAngle = 0;
    let lastDragX = 0;
    let lastDragTime = 0;
    let autoRotate = true;
    let activeIndex = 0;

    // Viewport-aware orbital radius
    let Rx = 340; // Horizontal radius
    let Ry = 95;  // Vertical depth radius (elliptical tilt)

    function updateRadii() {
      const containerWidth = stage.clientWidth || 600;
      if (containerWidth < 480) {
        Rx = Math.min(180, containerWidth * 0.44);
        Ry = 65;
      } else if (containerWidth < 768) {
        Rx = Math.min(260, containerWidth * 0.42);
        Ry = 80;
      } else if (containerWidth < 1200) {
        Rx = Math.min(330, containerWidth * 0.38);
        Ry = 95;
      } else {
        Rx = 360;
        Ry = 105;
      }
    }
    updateRadii();
    window.addEventListener('resize', updateRadii);

    // Spotlight Update Function
    function updateSpotlight(index) {
      if (index === activeIndex && spotlightTitle && spotlightTitle.textContent) return;
      activeIndex = index;
      const p = products[index];
      if (!p) return;

      if (spotlightCategory) {
        spotlightCategory.textContent = p.categoryName;
      }
      if (spotlightTitle) {
        spotlightTitle.textContent = p.name;
      }
      if (spotlightDesc) {
        spotlightDesc.textContent = p.description;
      }
      if (spotlightUse) {
        spotlightUse.innerHTML = `<em>Suggested use:</em> ${p.suggestedUse || 'Enjoy daily as part of a balanced diet.'}`;
      }
      if (spotlightSizes) {
        spotlightSizes.innerHTML = p.sizes.map(s => `<span class="size-chip active">${s}</span>`).join('');
      }
      if (spotlightWhatsApp) {
        const msg = encodeURIComponent(`Hello Afyalishe Wellness, I would like to order ${p.name} (${p.sizes.join(', ')}).`);
        spotlightWhatsApp.href = `https://wa.me/254759561657?text=${msg}`;
      }
      if (spotlightView) {
        spotlightView.href = `product.html?id=${p.id}`;
      }

      // Update dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.orbit-dot');
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
      }
    }

    // Rotate to exact product index
    function rotateToProduct(targetIdx) {
      // Calculate current normalized index
      const normalizedAngle = currentAngle % (Math.PI * 2);
      let currIdx = Math.round(-currentAngle / angleStep) % N;
      if (currIdx < 0) currIdx += N;

      // Find shortest angular direction
      let diff = targetIdx - currIdx;
      if (diff > N / 2) diff -= N;
      if (diff < -N / 2) diff += N;

      targetAngle = currentAngle - diff * angleStep;
      autoRotate = false;
    }

    // Main Matrix Calculation & Render Loop (Recalculated every single frame)
    function renderFrame() {
      requestAnimationFrame(renderFrame);

      if (isDragging) {
        // Direct tracking while dragging
        autoRotate = false;
      } else {
        // Inertia coasting
        if (Math.abs(velocity) > 0.0003) {
          currentAngle += velocity;
          velocity *= 0.93; // Inertia friction damping
          targetAngle = currentAngle;
        } else {
          velocity = 0;
          // Smooth spring damping toward target angle
          currentAngle += (targetAngle - currentAngle) * 0.12;

          // Gentle auto-rotation drift when idle
          if (autoRotate) {
            targetAngle += 0.0016;
            currentAngle += 0.0016;
          }
        }
      }

      let closestDist = Infinity;
      let closestIdx = 0;

      // Calculate single CSS matrix() for every product card
      for (let i = 0; i < N; i++) {
        // Angular position
        const angle = currentAngle + i * angleStep;
        const cosVal = Math.cos(angle);
        const sinVal = Math.sin(angle);

        // Track closest to front (cosVal closest to 1)
        const distFromFront = 1 - cosVal;
        if (distFromFront < closestDist) {
          closestDist = distFromFront;
          closestIdx = i;
        }

        // Translation coordinates along perspective ellipse
        const tx = sinVal * Rx;
        const ty = cosVal * Ry;

        // Scale factor: larger in front (cosVal = 1), smaller in back (cosVal = -1)
        const scale = 0.60 + (cosVal + 1) * 0.5 * 0.44; // 0.60 to 1.04

        // Banking tilt angle: subtle perspective lean as cards orbit
        const bankAngle = -sinVal * 0.09; // radians

        // Mathematical 2D Affine Transformation Matrix:
        // [ a   c   tx ]
        // [ b   d   ty ]
        const a = scale * Math.cos(bankAngle);
        const b = scale * Math.sin(bankAngle);
        const c = -scale * Math.sin(bankAngle);
        const d = scale * Math.cos(bankAngle);

        const card = cardElements[i];

        // Bake sin/cos directly into a single CSS matrix() transform
        card.style.transform = `matrix(${a.toFixed(5)}, ${b.toFixed(5)}, ${c.toFixed(5)}, ${d.toFixed(5)}, ${tx.toFixed(2)}, ${ty.toFixed(2)})`;

        // Z-Index layering (front cards always overlap back cards)
        card.style.zIndex = Math.round((cosVal + 1) * 250);

        // Opacity & Depth Fog
        const opacity = (0.32 + (cosVal + 1) * 0.34).toFixed(3); // 0.32 back, 1.0 front
        card.style.opacity = opacity;

        // Dynamic Lighting & Specular Drop Shadow based on depth
        const shadowY = Math.round(4 + (cosVal + 1) * 10);
        const shadowBlur = Math.round(8 + (cosVal + 1) * 16);
        const shadowAlpha = (0.06 + (cosVal + 1) * 0.09).toFixed(2);
        const brightness = (0.80 + (cosVal + 1) * 0.10).toFixed(2);

        card.style.filter = `brightness(${brightness}) drop-shadow(0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowAlpha}))`;

        // Front card highlight styling
        const isFront = cosVal > 0.94;
        card.classList.toggle('orbit-card-front', isFront);
        card.setAttribute('aria-current', isFront ? 'true' : 'false');
      }

      // Update spotlight with current front card
      updateSpotlight(closestIdx);
    }

    // Start Animation Loop
    renderFrame();

    // -------------------------------------------------------------------------
    // DRAG INTERACTION (Pointer Events with Velocity Tracking & Inertia)
    // -------------------------------------------------------------------------
    stage.addEventListener('pointerdown', (e) => {
      // Don't intercept button clicks inside the card
      if (e.target.closest('button') || e.target.closest('a')) return;

      isDragging = true;
      dragStartX = e.clientX;
      dragStartAngle = currentAngle;
      lastDragX = e.clientX;
      lastDragTime = performance.now();
      velocity = 0;
      autoRotate = false;
      stage.classList.add('is-dragging');
      stage.setPointerCapture(e.pointerId);
    });

    stage.addEventListener('pointermove', (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStartX;
      // Convert linear pixel drag to angular rotation
      const sensitivity = 0.0042;
      currentAngle = dragStartAngle + deltaX * sensitivity;
      targetAngle = currentAngle;

      // Track instantaneous velocity for momentum flick
      const now = performance.now();
      const dt = Math.max(1, now - lastDragTime);
      const dx = e.clientX - lastDragX;
      velocity = (dx / dt) * 0.055;
      lastDragX = e.clientX;
      lastDragTime = now;
    });

    function endDrag(e) {
      if (!isDragging) return;
      isDragging = false;
      stage.classList.remove('is-dragging');
      try {
        stage.releasePointerCapture(e.pointerId);
      } catch (_) {}

      // Snap to nearest product when drag completes
      const nearestSlot = Math.round(-currentAngle / angleStep);
      targetAngle = -nearestSlot * angleStep;

      // Resume auto-drift after 4 seconds of inactivity
      setTimeout(() => {
        if (!isDragging && Math.abs(velocity) < 0.0001) {
          autoRotate = true;
        }
      }, 4000);
    }

    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    // -------------------------------------------------------------------------
    // CARD CLICK TO FOCUS
    // -------------------------------------------------------------------------
    cardElements.forEach((card, idx) => {
      card.addEventListener('click', (e) => {
        // If clicking the card already in front, navigate to product detail
        if (card.classList.contains('orbit-card-front')) {
          const productId = card.dataset.id;
          window.location.href = `product.html?id=${productId}`;
          return;
        }

        // Otherwise, orbit wheel to bring clicked card to front
        e.preventDefault();
        e.stopPropagation();
        rotateToProduct(idx);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          rotateToProduct(idx);
        }
      });
    });

    // -------------------------------------------------------------------------
    // NAVIGATION BUTTONS & KEYBOARD CONTROLS
    // -------------------------------------------------------------------------
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        autoRotate = false;
        targetAngle += angleStep;
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        autoRotate = false;
        targetAngle -= angleStep;
      });
    }

    // Arrow keys when hovering stage
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        autoRotate = false;
        targetAngle += angleStep;
      } else if (e.key === 'ArrowRight') {
        autoRotate = false;
        targetAngle -= angleStep;
      }
    });

    // Horizontal wheel / swipe support
    stage.addEventListener('wheel', (e) => {
      // If user is scrolling horizontally or holding Shift
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
      if (Math.abs(delta) > 5) {
        e.preventDefault();
        autoRotate = false;
        targetAngle -= delta * 0.003;
      }
    }, { passive: false });

    // Pause auto-rotation when hovering over spotlight or controls
    stage.addEventListener('mouseenter', () => {
      autoRotate = false;
    });
    stage.addEventListener('mouseleave', () => {
      if (!isDragging) {
        autoRotate = true;
      }
    });
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOrbitWheel);
  } else {
    initOrbitWheel();
  }
})();
