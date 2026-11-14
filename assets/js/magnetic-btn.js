/**
 * AFYALISHE WELLNESS - MAGNETIC BUTTONS MODULE
 * Primary buttons smoothly pull toward the cursor within 60px radius
 */

(function () {
  const config = window.AFYALISHE_MOTION_CONFIG?.magneticButtons;
  if (!config || !config.enabled) return;

  if (('ontouchstart' in window) || window.matchMedia('(hover: none)').matches) {
    return;
  }

  function initMagneticButtons() {
    const magneticElements = document.querySelectorAll(
      '.btn-primary-lime, .btn-deep-green, .whatsapp-circle-btn, [data-magnetic="true"]'
    );

    magneticElements.forEach((el) => {
      let isHovered = false;
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      let animFrameId = null;

      function render() {
        currentX += (targetX - currentX) * config.damping;
        currentY += (targetY - currentY) * config.damping;

        el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

        if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
          animFrameId = requestAnimationFrame(render);
        } else {
          animFrameId = null;
        }
      }

      window.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        const radius = config.radius + Math.max(rect.width, rect.height) / 2;

        if (dist < radius) {
          isHovered = true;
          const pullFactor = (1 - dist / radius) * config.intensity;
          targetX = (e.clientX - centerX) * pullFactor;
          targetY = (e.clientY - centerY) * pullFactor;

          if (!animFrameId) {
            animFrameId = requestAnimationFrame(render);
          }
        } else if (isHovered) {
          isHovered = false;
          targetX = 0;
          targetY = 0;
          if (!animFrameId) {
            animFrameId = requestAnimationFrame(render);
          }
        }
      });

      el.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMagneticButtons);
  } else {
    initMagneticButtons();
  }

  window.initMagneticButtons = initMagneticButtons;
})();
