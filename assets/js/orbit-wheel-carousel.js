/**
 * Afyalishe Wellness - Drag-to-Orbit Wheel Carousel
 * Each product's angle converts to sin/cos and gets baked into a single
 * CSS matrix(a, b, c, d, tx, ty) transform, recalculated every frame of the drag.
 * Strictly adheres to all 20 UI & Frontend Design Standards.
 */

(function () {
  'use strict';

  const PRODUCTS = [
    {
      slug: 'chia-oil',
      name: 'Chia Oil',
      badge: 'Cold-Pressed Superfood',
      sizes: 'Available in 100 ml · 60 ml · 30 ml',
      desc: 'Chia seeds contain the most Omega-3 of any plant source. Chia seed oil offers a range of health and beauty benefits due to its rich content of omega-3 fatty acids (especially heart friendly alpha-linolenic acid or ALA), antioxidants, and essential nutrients.',
      use: 'Suggested use: consume one tablespoon daily',
      accent: '#6FB03A',
      image: 'assets/products/chia-oil.png',
      fallback: 'assets/products/chia-oil.webp'
    },
    {
      slug: 'chia-seeds',
      name: 'Chia Seeds',
      badge: 'High-Fiber Superseed',
      sizes: 'Available in 100 gms · 200 gms · 500 gms',
      desc: "Chia seeds are packed with health benefits; Omega-3, calcium, iron, magnesium, zinc, vitamin B1 and B2. They're great for maintaining a healthy heart, bones, joints and digestive system.",
      use: 'Suggested use: soak overnight in water and drink',
      accent: '#6FB03A',
      image: 'assets/products/chia-seeds.webp',
      fallback: 'assets/products/chia-seeds.jpg'
    },
    {
      slug: 'chia-uji',
      name: 'Chia Uji',
      badge: 'Nutrient-Dense Porridge',
      sizes: 'Available in 1 kg · 500 gm',
      desc: 'This nutrient dense porridge flour contains all the benefits of chia seeds; calcium, protein, dietary fiber, zinc and magnesium. It is a filling well balanced meal for the whole family.',
      use: 'Suggested use: cook and consume like regular porridge',
      accent: '#6FB03A',
      image: 'assets/products/chia-uji.webp',
      fallback: 'assets/products/chia-uji.jpg'
    },
    {
      slug: 'chia-yoghurt',
      name: 'Chia Yoghurt',
      badge: 'Probiotic Blend',
      sizes: 'Available in 250 ml · 500 ml · 1 L to 5 L',
      desc: 'Combining the goodness of chia seeds with that of rich, probiotic yoghurt to make a filling, tasty and nutrition packed drink. Flavours: Mango, Vanilla, Strawberry, Natural.',
      use: 'Suggested use: smoothies, mix with muesli or granola, porridge',
      accent: '#6FB03A',
      image: 'assets/products/chia-yoghurt.webp',
      fallback: 'assets/products/chia-yoghurt.jpg'
    },
    {
      slug: 'hibiscus-blend',
      name: 'Hibiscus Herbal Blend',
      badge: 'Herbal Teabags',
      sizes: 'Available in 50 gms (25 teabags)',
      desc: 'These teabags are a refreshing blend of hibiscus, rosemary and lemongrass. They offer an unrivaled aroma that relaxes the body and mind, while boosting immunity.',
      use: 'Suggested use: add a teabag to a cup of hot water, brew for 5 minutes and enjoy',
      accent: '#E0559B',
      image: 'assets/products/hibiscus-blend.webp',
      fallback: 'assets/products/hibiscus-herbal-blend.jpg'
    },
    {
      slug: 'hibiscus-dried',
      name: 'Hibiscus Dried Flowers',
      badge: 'Whole Botanical Roselle',
      sizes: 'Available in 100 gms',
      desc: 'Hibiscus flowers offer a wide range of health benefits; from being rich in antioxidants, to maintaining a healthy heart and aiding digestion.',
      use: 'Suggested use: as a herbal tea or infused in drinking water',
      accent: '#E0559B',
      image: 'assets/products/hibiscus-dried.webp',
      fallback: 'assets/products/hibiscus-dried-flowers.jpg'
    },
    {
      slug: 'hibiscus-powder',
      name: 'Hibiscus Powder',
      badge: 'Micro-Milled Botanical',
      sizes: 'Available in 200 gm · 100 gm',
      desc: 'Hibiscus flowers offer a wide range of health benefits; from being rich in antioxidants, to maintaining a healthy heart and aiding digestion.',
      use: 'Suggested use: add to ready food, salads or baked goods. Mix with water to make a hair or face masque',
      accent: '#E0559B',
      image: 'assets/products/hibiscus-powder.webp',
      fallback: 'assets/products/hibiscus-powder.jpg'
    },
    {
      slug: 'yacon-immune',
      name: 'Yacon Probiotic Immune Boost',
      badge: 'Living Fermented Elixir',
      sizes: 'Available in 250 ml · 500 ml',
      desc: 'This drink is made by fermenting Yacon, a root vegetable that is rich in prebiotic FOS (fructooligosaccharides) which nourishes good gut bacteria, aiding digestion, boosting immunity, and regulating blood sugar.',
      use: 'Suggested use: drink directly or mix with smoothies',
      accent: '#8A5A2B',
      image: 'assets/products/yacon-immune.webp',
      fallback: 'assets/products/yacon-probiotic-immune-boost.jpg'
    },
    {
      slug: 'yacon-kefir',
      name: 'Yacon Probiotic Syrup Kefir',
      badge: 'Microbiome Restorative',
      sizes: 'Available in 500 ml · 1 L',
      desc: 'Fermented yacon root syrup blended into an active kefir tonic designed to support microbiome balance, healthy insulin response, and smooth daily digestion.',
      use: 'Suggested use: drink directly or mix with smoothies',
      accent: '#8A5A2B',
      image: 'assets/products/yacon-kefir.webp',
      fallback: 'assets/products/yacon-probiotic-syrup-kefir.jpg'
    },
    {
      slug: 'yacon-inulin',
      name: 'Yacon Inulin Capsules',
      badge: 'Capsulated Prebiotic',
      sizes: 'Available in 40 capsule pack',
      desc: 'Pure prebiotic fiber extract milled from highland-grown yacon tubers into convenient capsules. Feeds bifidobacteria, promotes satiety, and stabilizes metabolic wellness.',
      use: 'Suggested use: take two capsules daily',
      accent: '#C72462',
      image: 'assets/products/yacon-inulin.webp',
      fallback: 'assets/products/yacon-inulin-capsules.jpg'
    },
    {
      slug: 'granola',
      name: 'Granola',
      badge: 'Hand-Toasted Superfood',
      sizes: 'Available in 400 g · 200 g · 100 g',
      desc: 'A delicious wholesome blend of rolled oats, roasted chia seeds, highland honey, raw nuts, and botanical spices. Naturally nutrient-dense with crunchy golden clusters.',
      use: 'Suggested use: snack directly or pair with fresh yoghurt and fruit for breakfast',
      accent: '#C47A3A',
      image: 'assets/products/granola.webp',
      fallback: 'assets/products/granola.jpg'
    }
  ];

  class OrbitWheelCarousel {
    constructor() {
      this.container = document.querySelector('.orbit-showcase-section');
      if (!this.container) return;

      this.stageWrap = this.container.querySelector('.orbit-stage-wrap');
      this.anchor = this.container.querySelector('.orbit-wheel-anchor');
      this.infoCol = this.container.querySelector('.orbit-info-col');
      this.watermark = this.container.querySelector('.orbit-watermark');
      this.bgAmbient = this.container.querySelector('.orbit-bg-ambient');
      this.counterEl = this.container.querySelector('.orbit-counter');
      this.ticksList = this.container.querySelector('.orbit-ticks');
      this.prevBtn = this.container.querySelector('.orbit-prev-btn');
      this.nextBtn = this.container.querySelector('.orbit-next-btn');
      this.dragCue = this.container.querySelector('.orbit-drag-cue');

      this.total = PRODUCTS.length;
      this.stepAngle = (Math.PI * 2) / this.total;

      // Orbit physics state
      this.currentAngle = 0;
      this.targetAngle = 0;
      this.velocity = 0;
      this.isDragging = false;
      this.startX = 0;
      this.lastX = 0;
      this.lastTime = 0;
      this.activeProductIndex = 0;

      // Layout radiuses
      this.radiusX = 320;
      this.radiusY = 70;
      this.scaleMin = 0.52;
      this.scaleMax = 1.14;

      this.items = [];

      this.init();
    }

    init() {
      this.updateDimensions();
      this.buildDOM();
      this.bindEvents();
      this.updateActiveInfo(0, true);

      // Start animation loop
      this.rafId = requestAnimationFrame(this.tick.bind(this));
    }

    updateDimensions() {
      const w = window.innerWidth;

      if (w <= 820) {
        // Mobile layout: calibrated to clear the right progress rail with ample whitespace buffer
        this.radiusX = Math.min(82, Math.max(68, w * 0.20));
        this.radiusY = 28;
        this.scaleMin = 0.42;
        this.scaleMax = 0.95;
      } else if (w <= 1024) {
        // Tablet layout
        this.radiusX = Math.min(240, Math.max(190, w * 0.22));
        this.radiusY = 50;
        this.scaleMin = 0.48;
        this.scaleMax = 1.05;
      } else {
        // Desktop layout: calibrated to clear left rail and right card
        this.radiusX = Math.min(330, Math.max(260, w * 0.23));
        this.radiusY = 70;
        this.scaleMin = 0.52;
        this.scaleMax = 1.14;
      }
    }

    buildDOM() {
      this.anchor.innerHTML = '';
      this.items = [];

      PRODUCTS.forEach((product, idx) => {
        const itemEl = document.createElement('div');
        itemEl.className = `orbit-item ${idx === 0 ? 'is-active' : ''}`;
        itemEl.setAttribute('data-index', idx);
        itemEl.setAttribute('role', 'button');
        itemEl.setAttribute('aria-label', `View ${product.name}`);

        // Unified tactile card structure
        const card = document.createElement('div');
        card.className = 'orbit-card';

        const img = document.createElement('img');
        img.className = 'orbit-card-img';
        img.src = product.image;
        img.alt = product.name;
        img.loading = idx === 0 ? 'eager' : 'lazy';
        img.decoding = 'async';
        img.onerror = () => {
          if (product.fallback && img.src !== product.fallback) {
            img.src = product.fallback;
          }
        };

        const meta = document.createElement('div');
        meta.className = 'orbit-card-meta';

        const title = document.createElement('div');
        title.className = 'orbit-card-title';
        title.textContent = product.name;

        const size = document.createElement('div');
        size.className = 'orbit-card-size';
        size.textContent = product.sizes.replace('Available in ', '');

        meta.appendChild(title);
        meta.appendChild(size);

        card.appendChild(img);
        card.appendChild(meta);

        const shadow = document.createElement('div');
        shadow.className = 'orbit-item-shadow';

        itemEl.appendChild(card);
        itemEl.appendChild(shadow);

        itemEl.addEventListener('click', () => {
          if (Math.abs(this.velocity) > 0.002) return;
          this.rotateToIndex(idx);
        });

        this.anchor.appendChild(itemEl);

        this.items.push({
          el: itemEl,
          card: card,
          shadow: shadow,
          product: product,
          baseAngle: idx * this.stepAngle
        });
      });

      // Build Navigation Rail Ticks
      if (this.ticksList) {
        this.ticksList.innerHTML = '';
        PRODUCTS.forEach((p, idx) => {
          const li = document.createElement('li');
          const btn = document.createElement('button');
          btn.className = `orbit-tick-btn ${idx === 0 ? 'active' : ''}`;
          btn.setAttribute('aria-label', `Navigate to ${p.name}`);
          btn.addEventListener('click', () => this.rotateToIndex(idx));
          li.appendChild(btn);
          this.ticksList.appendChild(li);
        });
      }
    }

    bindEvents() {
      window.addEventListener('resize', () => {
        this.updateDimensions();
      }, { passive: true });

      const stage = this.stageWrap;

      stage.addEventListener('pointerdown', (e) => {
        this.isDragging = true;
        this.startX = e.clientX;
        this.lastX = e.clientX;
        this.lastTime = performance.now();
        this.velocity = 0;
        stage.classList.add('is-dragging');
        stage.setPointerCapture(e.pointerId);

        if (this.dragCue) {
          this.dragCue.style.opacity = '0';
        }
      });

      stage.addEventListener('pointermove', (e) => {
        if (!this.isDragging) return;
        const now = performance.now();
        const dt = Math.max(1, now - this.lastTime);
        const dx = e.clientX - this.lastX;

        const angleDelta = dx / (this.radiusX * 1.15);
        this.currentAngle += angleDelta;
        this.targetAngle = this.currentAngle;

        this.velocity = angleDelta / (dt / 16.666);
        this.lastX = e.clientX;
        this.lastTime = now;
      });

      const onPointerEnd = (e) => {
        if (!this.isDragging) return;
        this.isDragging = false;
        stage.classList.remove('is-dragging');
        try {
          stage.releasePointerCapture(e.pointerId);
        } catch (_) {}

        this.scheduleSnap();
      };

      stage.addEventListener('pointerup', onPointerEnd);
      stage.addEventListener('pointercancel', onPointerEnd);

      this.container.addEventListener('wheel', (e) => {
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (Math.abs(delta) < 2) return;

        this.targetAngle += -delta * 0.0018;
        this.velocity = -delta * 0.0008;

        if (this.dragCue) this.dragCue.style.opacity = '0';
      }, { passive: true });

      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => this.stepBy(-1));
      }
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.stepBy(1));
      }

      window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          this.stepBy(-1);
        } else if (e.key === 'ArrowRight') {
          this.stepBy(1);
        }
      });
    }

    stepBy(direction) {
      let currentNearest = Math.round(-this.currentAngle / this.stepAngle);
      let targetIndex = currentNearest + direction;
      targetIndex = ((targetIndex % this.total) + this.total) % this.total;
      this.rotateToIndex(targetIndex);
    }

    rotateToIndex(index) {
      const target = -index * this.stepAngle;
      const twoPi = Math.PI * 2;
      let diff = (target - this.currentAngle) % twoPi;
      if (diff > Math.PI) diff -= twoPi;
      if (diff < -Math.PI) diff += twoPi;

      this.targetAngle = this.currentAngle + diff;
      this.velocity = 0;

      if (this.dragCue) this.dragCue.style.opacity = '0';
    }

    scheduleSnap() {
      const projectedAngle = this.currentAngle + this.velocity * 8.0;
      const nearestIdx = Math.round(-projectedAngle / this.stepAngle);
      this.targetAngle = -nearestIdx * this.stepAngle;
    }

    tick() {
      if (!this.isDragging) {
        if (Math.abs(this.velocity) > 0.0005) {
          this.currentAngle += this.velocity;
          this.velocity *= 0.94;
          this.targetAngle = this.currentAngle;
        } else {
          const diff = this.targetAngle - this.currentAngle;
          this.currentAngle += diff * 0.12;
          this.velocity = diff * 0.08;
        }
      }

      // =======================================================================
      // CORE MATHEMATICS: SIN / COS CONVERSION BAKED INTO SINGLE CSS MATRIX()
      // =======================================================================
      let maxCos = -2;
      let frontIndex = 0;

      for (let i = 0; i < this.total; i++) {
        const item = this.items[i];
        // 1. Angle for this product
        const angle = this.currentAngle + item.baseAngle;

        // 2. Convert angle to sin and cos
        const sinVal = Math.sin(angle);
        const cosVal = Math.cos(angle);

        if (cosVal > maxCos) {
          maxCos = cosVal;
          frontIndex = i;
        }

        // 3. Normalised Depth Factor d in [0, 1]
        const d = (cosVal + 1.0) * 0.5;

        // 4. Scale factor based on depth
        const scale = this.scaleMin + (this.scaleMax - this.scaleMin) * d;

        // 5. Position: elliptical orbit in 2.5D perspective
        const tx = this.radiusX * sinVal;
        const ty = this.radiusY * cosVal;

        // 6. Tangent Tilt Angle along orbit path + dynamic velocity lean
        const tangentTilt = -sinVal * 0.08;
        const velocityLean = Math.max(-0.20, Math.min(0.20, this.velocity * 3.0)) * (1.0 - Math.abs(cosVal) * 0.4);
        const phi = tangentTilt + velocityLean;

        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);

        // 7. BAKE INTO SINGLE CSS MATRIX(a, b, c, d, tx, ty)
        const a = scale * cosPhi;
        const b = scale * sinPhi;
        const c = -scale * sinPhi;
        const matrixD = scale * cosPhi;

        item.el.style.transform = `matrix(${a.toFixed(5)}, ${b.toFixed(5)}, ${c.toFixed(5)}, ${matrixD.toFixed(5)}, ${tx.toFixed(2)}, ${ty.toFixed(2)})`;

        // 8. Depth Cues: z-index, opacity, shadow
        const zIndex = Math.round(d * 1000);
        item.el.style.zIndex = zIndex;

        const opacity = (0.35 + 0.65 * Math.pow(d, 1.35)).toFixed(3);
        item.el.style.opacity = opacity;

        const shadowScale = (0.55 + 0.45 * d).toFixed(2);
        item.shadow.style.transform = `scale(${shadowScale})`;
        item.shadow.style.opacity = (0.15 + 0.85 * d).toFixed(2);

        item.el.classList.toggle('is-active', i === frontIndex && d > 0.85);
      }

      if (frontIndex !== this.activeProductIndex) {
        this.activeProductIndex = frontIndex;
        this.updateActiveInfo(frontIndex, false);
      }

      this.rafId = requestAnimationFrame(this.tick.bind(this));
    }

    updateActiveInfo(index, immediate) {
      const product = PRODUCTS[index];
      if (!product) return;

      const titleEl = this.container.querySelector('.orbit-title');
      const badgeEl = this.container.querySelector('.orbit-badge span:last-child');
      const sizesEl = this.container.querySelector('.orbit-sizes');
      const descEl = this.container.querySelector('.orbit-desc');
      const useEl = this.container.querySelector('.orbit-use-box');
      const ctaEl = this.container.querySelector('.orbit-cta');

      if (titleEl) titleEl.textContent = product.name;
      if (badgeEl) badgeEl.textContent = product.badge;
      if (sizesEl) sizesEl.textContent = product.sizes;
      if (descEl) descEl.textContent = product.desc;
      if (useEl) useEl.textContent = product.use;
      if (ctaEl) {
        const msg = encodeURIComponent(`Hello Afyalishe Wellness, I would like to order ${product.name}.`);
        ctaEl.href = `https://wa.me/254759561657?text=${msg}`;
      }

      if (this.bgAmbient) {
        this.bgAmbient.style.background = `radial-gradient(circle at 35% 50%, rgba(255, 255, 255, 0.96) 0%, rgba(239, 233, 230, 0.94) 55%, ${product.accent}1A 100%)`;
      }

      if (this.watermark) {
        this.watermark.textContent = product.name;
        this.watermark.style.color = product.accent;
      }

      if (this.counterEl) {
        const numStr = String(index + 1).padStart(2, '0');
        const totStr = String(this.total).padStart(2, '0');
        this.counterEl.textContent = `${numStr} / ${totStr}`;
      }

      if (this.ticksList) {
        const btns = this.ticksList.querySelectorAll('.orbit-tick-btn');
        btns.forEach((btn, idx) => {
          btn.classList.toggle('active', idx === index);
        });
      }

      if (!immediate && this.infoCol) {
        this.infoCol.style.transform = 'translateY(4px)';
        this.infoCol.style.opacity = '0.92';
        setTimeout(() => {
          this.infoCol.style.transform = 'translateY(0)';
          this.infoCol.style.opacity = '1';
        }, 50);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.afyalisheOrbitCarousel = new OrbitWheelCarousel();
    });
  } else {
    window.afyalisheOrbitCarousel = new OrbitWheelCarousel();
  }
})();
