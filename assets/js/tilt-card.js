/**
 * AFYALISHE WELLNESS - 3D TILT CARDS
 * Subtle, tactile perspective tilt toward cursor with realistic specular glare and shadow shift
 * Adheres to:
 * - Rule 13: Remove embellishments (restrained, physical tilt)
 * - Rule 20: Fast, purposeful feedback
 */

(function () {
  const config = window.AFYALISHE_MOTION_CONFIG?.cardTilt;
  if (!config || !config.enabled) return;

  if (('ontouchstart' in window) || window.matchMedia('(hover: none)').matches) {
    return;
  }

  function initTiltCards() {
    const cards = document.querySelectorAll('.product-card, .stockist-item-card, [data-tilt="true"]');

    cards.forEach((card) => {
      let bounds = null;

      function updateBounds() {
        bounds = card.getBoundingClientRect();
      }

      card.addEventListener('mouseenter', () => {
        updateBounds();
        card.style.transition = 'box-shadow 0.15s ease, transform 0.1s ease';
      });

      card.addEventListener('mousemove', (e) => {
        if (!bounds) updateBounds();

        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const normX = (mouseX / bounds.width) * 2 - 1; // -1 to 1
        const normY = (mouseY / bounds.height) * 2 - 1; // -1 to 1

        const maxAngle = config.maxTiltAngle || 8;
        const tiltX = -normY * maxAngle;
        const tiltY = normX * maxAngle;

        // Shadow shifts opposite to tilt
        const shadowX = -normX * 10;
        const shadowY = -normY * 10 + 8;

        card.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.015, 1.015, 1)`;
        card.style.boxShadow = `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 20px rgba(34, 34, 34, 0.08)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.boxShadow = '';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTiltCards);
  } else {
    initTiltCards();
  }

  window.initTiltCards = initTiltCards;
})();
