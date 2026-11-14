/**
 * AFYALISHE WELLNESS - 3D TILT CARDS MODULE
 * Perspective card tilt with specular light reflection and reactive dynamic shadows
 */

(function () {
  const config = window.AFYALISHE_MOTION_CONFIG?.cardTilt;
  if (!config || !config.enabled) return;

  if (('ontouchstart' in window) || window.matchMedia('(hover: none)').matches) {
    return;
  }

  function initTiltCards() {
    const cards = document.querySelectorAll(
      '.product-card, .category-tile, .stockist-card, .service-card, [data-tilt="true"]'
    );

    cards.forEach((card) => {
      // Add dynamic glare overlay if enabled
      let glare = card.querySelector('.card-glare');
      if (config.glare && !glare) {
        glare = document.createElement('div');
        glare.className = 'card-glare';
        card.appendChild(glare);
      }

      card.style.perspective = `${config.perspective}px`;
      card.style.transformStyle = 'preserve-3d';

      let bounds = null;

      function updateBounds() {
        bounds = card.getBoundingClientRect();
      }

      card.addEventListener('mouseenter', () => {
        updateBounds();
        if (glare) glare.style.opacity = config.glareOpacity;
        card.style.transition = 'box-shadow 0.15s ease, transform 0.1s ease';
      });

      card.addEventListener('mousemove', (e) => {
        if (!bounds) updateBounds();

        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const normX = (mouseX / bounds.width) * 2 - 1; // -1 to 1
        const normY = (mouseY / bounds.height) * 2 - 1; // -1 to 1

        const tiltX = -normY * config.maxTiltAngle;
        const tiltY = normX * config.maxTiltAngle;

        // Shadow shifts opposite to tilt direction
        const shadowX = -normX * 18;
        const shadowY = -normY * 18 + 14;

        card.style.transform = `perspective(${config.perspective}px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(${config.scaleOnHover}, ${config.scaleOnHover}, 1)`;
        card.style.boxShadow = `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 35px -5px rgba(88, 144, 56, 0.18), 0 4px 10px rgba(46, 46, 46, 0.05)`;

        if (glare) {
          const glareX = (mouseX / bounds.width) * 100;
          const glareY = (mouseY / bounds.height) * 100;
          glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 65%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = `transform ${config.speed}ms ${config.easing}, box-shadow ${config.speed}ms ${config.easing}`;
        card.style.transform = `perspective(${config.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.boxShadow = '';
        if (glare) {
          glare.style.opacity = '0';
        }
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
