/**
 * AFYALISHE WELLNESS - SINGLE PRODUCT INTERACTIVE 3D/ZOOM VIEWER
 * Cursor tilt, drag-to-rotate with inertia, and hover zoom
 */

(function () {
  const config = window.AFYALISHE_MOTION_CONFIG?.productViewer;
  if (!config || !config.enabled) return;

  function initProductViewer() {
    const viewer = document.querySelector('.product-interactive-viewer');
    const targetImg = document.querySelector('.product-3d-target-img');
    if (!viewer || !targetImg) return;

    let rotY = 0;
    let rotX = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let isZoomed = false;
    let animId = null;

    function render() {
      rotY += (targetRotY - rotY) * 0.12;
      rotX += (targetRotX - rotX) * 0.12;

      const scale = isZoomed ? config.zoomFactor : 1.0;
      targetImg.style.transform = `perspective(1000px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) scale3d(${scale}, ${scale}, 1)`;

      if (Math.abs(targetRotY - rotY) > 0.05 || Math.abs(targetRotX - rotX) > 0.05 || isDragging) {
        animId = requestAnimationFrame(render);
      } else {
        animId = null;
      }
    }

    // Cursor Follow Tilt
    viewer.addEventListener('mousemove', (e) => {
      if (isDragging) return;
      const rect = viewer.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      targetRotY = normX * config.maxTiltAngle;
      targetRotX = -normY * config.maxTiltAngle;

      if (!animId) animId = requestAnimationFrame(render);
    });

    viewer.addEventListener('mouseleave', () => {
      if (!isDragging) {
        targetRotY = 0;
        targetRotX = 0;
        isZoomed = false;
        if (!animId) animId = requestAnimationFrame(render);
      }
    });

    // Drag-to-Rotate
    if (config.allowDragRotate) {
      viewer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        viewer.style.cursor = 'grabbing';
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;

        targetRotY += deltaX * 0.75;
        targetRotX -= deltaY * 0.5;

        // Clamp vertical tilt
        targetRotX = Math.max(-35, Math.min(35, targetRotX));

        if (!animId) animId = requestAnimationFrame(render);
      });

      window.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          viewer.style.cursor = 'grab';
        }
      });

      // Touch drag
      viewer.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          isDragging = true;
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        targetRotY += deltaX * 0.75;
        targetRotX -= deltaY * 0.5;
        targetRotX = Math.max(-30, Math.min(30, targetRotX));

        if (!animId) animId = requestAnimationFrame(render);
      }, { passive: true });

      window.addEventListener('touchend', () => {
        isDragging = false;
      });
    }

    // Zoom Toggle Button
    const zoomBtn = viewer.querySelector('.btn-zoom-toggle');
    if (zoomBtn) {
      zoomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isZoomed = !isZoomed;
        zoomBtn.textContent = isZoomed ? 'Reset View' : 'Zoom 1.25x';
        if (!animId) animId = requestAnimationFrame(render);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductViewer);
  } else {
    initProductViewer();
  }

  window.initProductViewer = initProductViewer;
})();
