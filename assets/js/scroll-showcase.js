/**
 * AFYALISHE WELLNESS - SCROLL-DRIVEN 3D & SHOWCASE MODULE
 * Uses GSAP ScrollTrigger to choreograph 360° bottle rotation and depth reveals
 */

(function () {
  const config = window.AFYALISHE_MOTION_CONFIG?.scrollShowcase;
  if (!config || !config.enabled) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  function initScrollAnimations() {
    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 1. 360° Bottle Showcase Section
    const bottleTarget = document.querySelector('.showcase-rotating-object');
    const showcaseSection = document.querySelector('.showcase-scroll-section');

    if (bottleTarget && showcaseSection && typeof ScrollTrigger !== 'undefined') {
      gsap.to(bottleTarget, {
        rotationY: config.rotationDegrees,
        ease: 'none',
        scrollTrigger: {
          trigger: showcaseSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: config.scrubSpeed,
        },
      });

      // Subtle scale and aura pulse during scroll
      gsap.fromTo(
        bottleTarget.querySelector('img'),
        { scale: 0.9, y: 30 },
        {
          scale: 1.08,
          y: -20,
          scrollTrigger: {
            trigger: showcaseSection,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: true,
          },
        }
      );
    }

    // 2. Headings 3D Reveal with subtle Z rotation
    const revealHeadings = document.querySelectorAll('h2, .section-eyebrow, .hero-headline');
    if (typeof ScrollTrigger !== 'undefined') {
      revealHeadings.forEach((heading) => {
        gsap.from(heading, {
          y: 28,
          opacity: 0,
          rotationX: 10,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      });
    }

    // 3. Staggered Products Glide In from Depth
    const productGrids = document.querySelectorAll('.grid-products');
    if (typeof ScrollTrigger !== 'undefined') {
      productGrids.forEach((grid) => {
        const cards = grid.querySelectorAll('.product-card');
        gsap.from(cards, {
          y: 40,
          opacity: 0,
          scale: 0.94,
          stagger: 0.08,
          duration: 0.75,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: grid,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }

  window.initScrollAnimations = initScrollAnimations;
})();
