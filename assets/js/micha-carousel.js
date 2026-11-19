/**
 * AFYALISHE WELLNESS - MICHA-INSPIRED MID-FRAME PRODUCT HERO CAROUSEL
 * Single mid-frame product with symmetric arrows, animated botanical burst,
 * per-family colour-blocking, 4-family bottom tabs, and dismissible side info pop-up.
 */

(function () {
  'use strict';

  const FAMILIES = {
    chia: {
      label: 'Chia Range',
      bg: '#EEF3E4',
      dot: 'rgba(63, 110, 36, 0.14)',
      accent: '#3F6E24',
      accentHover: '#2E5419',
      accentSoft: 'rgba(63, 110, 36, 0.10)',
      word: 'rgba(42, 77, 22, 0.08)',
      svg: `
        <svg viewBox="0 0 400 400" fill="none" aria-hidden="true">
          <circle cx="200" cy="200" r="142" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 9" opacity="0.24"/>
          <g class="burst-piece-a">
            <path d="M58 148 C44 126, 56 96, 86 92 C98 118, 86 146, 58 148 Z" fill="currentColor" opacity="0.22"/>
            <path d="M336 244 C354 222, 344 190, 314 186 C300 212, 312 242, 336 244 Z" fill="currentColor" opacity="0.20"/>
            <ellipse cx="106" cy="286" rx="7" ry="11" transform="rotate(-24 106 286)" fill="currentColor" opacity="0.28"/>
            <ellipse cx="308" cy="112" rx="6" ry="10" transform="rotate(28 308 112)" fill="currentColor" opacity="0.26"/>
          </g>
          <g class="burst-piece-b">
            <path d="M312 72 C328 54, 356 62, 354 88 C332 96, 310 88, 312 72 Z" fill="currentColor" opacity="0.18"/>
            <path d="M62 248 C44 268, 54 298, 82 296 C94 274, 84 250, 62 248 Z" fill="currentColor" opacity="0.18"/>
            <circle cx="132" cy="86" r="6" fill="currentColor" opacity="0.22"/>
            <circle cx="272" cy="316" r="7" fill="currentColor" opacity="0.20"/>
            <ellipse cx="348" cy="154" rx="5" ry="9" transform="rotate(-18 348 154)" fill="currentColor" opacity="0.22"/>
          </g>
        </svg>
      `
    },
    hibiscus: {
      label: 'Hibiscus Teas',
      bg: '#F9EAEE',
      dot: 'rgba(184, 46, 99, 0.14)',
      accent: '#B82E63',
      accentHover: '#92204D',
      accentSoft: 'rgba(184, 46, 99, 0.10)',
      word: 'rgba(138, 28, 70, 0.08)',
      svg: `
        <svg viewBox="0 0 400 400" fill="none" aria-hidden="true">
          <circle cx="200" cy="200" r="144" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 9" opacity="0.24"/>
          <g class="burst-piece-a">
            <path d="M72 114 C56 96, 70 72, 92 84 C104 68, 122 86, 108 106 C122 122, 100 138, 86 126 C72 140, 56 128, 72 114 Z" fill="currentColor" opacity="0.20"/>
            <path d="M326 266 C344 250, 358 272, 340 288 C354 304, 332 320, 316 306 C298 318, 286 296, 304 282 C292 264, 310 250, 326 266 Z" fill="currentColor" opacity="0.20"/>
          </g>
          <g class="burst-piece-b">
            <path d="M320 96 C340 82, 358 104, 342 122 C318 130, 306 112, 320 96 Z" fill="currentColor" opacity="0.22"/>
            <path d="M68 272 C50 288, 66 312, 90 298 C98 278, 84 264, 68 272 Z" fill="currentColor" opacity="0.20"/>
            <circle cx="144" cy="72" r="6" fill="currentColor" opacity="0.24"/>
            <circle cx="264" cy="328" r="7" fill="currentColor" opacity="0.22"/>
            <circle cx="352" cy="186" r="5" fill="currentColor" opacity="0.22"/>
          </g>
        </svg>
      `
    },
    yacon: {
      label: 'Yacon Probiotics',
      bg: '#F5ECE3',
      dot: 'rgba(140, 78, 31, 0.14)',
      accent: '#8C4E1F',
      accentHover: '#6B3A14',
      accentSoft: 'rgba(140, 78, 31, 0.10)',
      word: 'rgba(107, 58, 20, 0.08)',
      svg: `
        <svg viewBox="0 0 400 400" fill="none" aria-hidden="true">
          <circle cx="200" cy="200" r="142" stroke="currentColor" stroke-width="1.5" stroke-dasharray="8 8" opacity="0.24"/>
          <g class="burst-piece-a">
            <path d="M78 134 C68 108, 92 84, 108 112 C116 128, 92 146, 78 134 Z" fill="currentColor" opacity="0.22"/>
            <path d="M324 236 C340 212, 322 182, 300 202 C288 214, 304 242, 324 236 Z" fill="currentColor" opacity="0.20"/>
            <circle cx="94" cy="264" r="10" stroke="currentColor" stroke-width="2" opacity="0.24"/>
            <circle cx="308" cy="108" r="12" stroke="currentColor" stroke-width="2" opacity="0.22"/>
          </g>
          <g class="burst-piece-b">
            <circle cx="342" cy="158" r="6" fill="currentColor" opacity="0.24"/>
            <circle cx="62" cy="212" r="7" fill="currentColor" opacity="0.20"/>
            <circle cx="142" cy="316" r="6" fill="currentColor" opacity="0.22"/>
            <path d="M256 78 C274 66, 294 82, 282 100 C268 104, 252 92, 256 78 Z" fill="currentColor" opacity="0.18"/>
          </g>
        </svg>
      `
    },
    granola: {
      label: 'Granola & Snacks',
      bg: '#F6EFE0',
      dot: 'rgba(156, 97, 24, 0.14)',
      accent: '#9C6118',
      accentHover: '#78490E',
      accentSoft: 'rgba(156, 97, 24, 0.10)',
      word: 'rgba(120, 73, 14, 0.08)',
      svg: `
        <svg viewBox="0 0 400 400" fill="none" aria-hidden="true">
          <circle cx="200" cy="200" r="142" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 8" opacity="0.24"/>
          <g class="burst-piece-a">
            <rect x="64" y="110" width="24" height="16" rx="8" transform="rotate(-22 64 110)" fill="currentColor" opacity="0.22"/>
            <rect x="314" y="256" width="26" height="16" rx="8" transform="rotate(20 314 256)" fill="currentColor" opacity="0.20"/>
            <ellipse cx="92" cy="272" rx="8" ry="12" transform="rotate(18 92 272)" fill="currentColor" opacity="0.22"/>
          </g>
          <g class="burst-piece-b">
            <ellipse cx="322" cy="108" rx="9" ry="13" transform="rotate(-24 322 108)" fill="currentColor" opacity="0.22"/>
            <circle cx="136" cy="76" r="7" fill="currentColor" opacity="0.24"/>
            <circle cx="268" cy="322" r="7" fill="currentColor" opacity="0.20"/>
            <path d="M56 196 C46 180, 62 162, 78 172 C84 186, 70 202, 56 196 Z" fill="currentColor" opacity="0.18"/>
          </g>
        </svg>
      `
    }
  };

  const PRODUCTS = [
    {
      id: 'chia-oil',
      family: 'chia',
      name: 'Chia Oil',
      bgWord: 'CHIA OIL',
      sizes: '100 ml · 60 ml · 30 ml',
      flavours: '',
      desc: 'Cold-pressed virgin extraction rich in heart-friendly ALA Omega-3 fatty acids, antioxidants, and essential lipids.',
      use: 'Suggested use: consume one tablespoon daily',
      image: 'assets/products/chia-oil.png',
      isCutout: true,
      scale: 1.18,
      offsetX: '0%',
      clip: 'inset(0% 38% 12% 37% round 24px)'
    },
    {
      id: 'chia-seeds',
      family: 'chia',
      name: 'Chia Seeds',
      bgWord: 'CHIA SEEDS',
      sizes: '100 g · 200 g · 500 g',
      flavours: '',
      desc: 'Packed with Omega-3, dietary fiber, calcium, iron, magnesium, zinc, and B vitamins to support heart, bone, and digestive wellness.',
      use: 'Suggested use: soak overnight in water and drink',
      image: 'assets/products/chia-seeds.jpg',
      isCutout: false,
      scale: 1,
      offsetX: '0%'
    },
    {
      id: 'chia-uji',
      family: 'chia',
      name: 'Chia Uji',
      bgWord: 'CHIA UJI',
      sizes: '1 kg · 500 g',
      flavours: '',
      desc: 'Nutrient-dense stone-milled chia composite porridge flour with natural protein, calcium, zinc, magnesium, and whole-grain fiber.',
      use: 'Suggested use: cook and consume like regular porridge',
      image: 'assets/products/chia-uji.jpg',
      isCutout: false,
      scale: 1,
      offsetX: '0%'
    },
    {
      id: 'chia-yoghurt',
      family: 'chia',
      name: 'Chia Yoghurt',
      bgWord: 'YOGHURT',
      sizes: '250 ml · 500 ml · 1 L to 5 L',
      flavours: 'Flavours: Mango, Vanilla, Strawberry, Natural',
      desc: 'Probiotic cultured yoghurt blended with whole chia seeds for a nourishing, smooth, gut-friendly daily drink.',
      use: 'Suggested use: smoothies, mix with muesli or granola, porridge',
      image: 'assets/products/chia-yoghurt.jpg',
      isCutout: false,
      scale: 1,
      offsetX: '0%'
    },
    {
      id: 'hibiscus-herbal-blend',
      family: 'hibiscus',
      name: 'Hibiscus Herbal Blend',
      bgWord: 'HIBISCUS',
      sizes: '50 g (25 teabags)',
      flavours: '',
      desc: 'Caffeine-free herbal infusion balancing tangy roselle hibiscus petals with rosemary and fragrant lemongrass.',
      use: 'Suggested use: add a teabag to a cup of hot water, brew for 5 minutes and enjoy',
      image: 'assets/products/hibiscus-herbal-blend.jpg',
      isCutout: false,
      scale: 1,
      offsetX: '0%'
    },
    {
      id: 'hibiscus-dried-flowers',
      family: 'hibiscus',
      name: 'Hibiscus Dried Flowers',
      bgWord: 'ROSELLE',
      sizes: '100 g',
      flavours: '',
      desc: 'Whole sun-dried roselle calyces naturally rich in anthocyanins and vitamin C to support healthy blood pressure and digestion.',
      use: 'Suggested use: as a herbal tea or infused in drinking water',
      image: 'assets/products/hibiscus-dried-flowers.jpg',
      isCutout: false,
      scale: 1,
      offsetX: '0%'
    },
    {
      id: 'hibiscus-powder',
      family: 'hibiscus',
      name: 'Hibiscus Powder',
      bgWord: 'HIBISCUS',
      sizes: '200 g · 100 g',
      flavours: '',
      desc: 'Finely milled whole hibiscus petals ideal for culinary antioxidant boosts, smoothies, or natural botanical skincare masks.',
      use: 'Suggested use: add to ready food, salads or baked goods; mix with water for a hair or face masque',
      image: 'assets/products/hibiscus-powder.jpg',
      isCutout: false,
      scale: 1,
      offsetX: '0%'
    },
    {
      id: 'yacon-probiotic-immune-boost',
      family: 'yacon',
      name: 'Yacon Probiotic Immune Boost',
      bgWord: 'PROBIOTIC',
      sizes: '250 ml · 500 ml',
      flavours: '',
      desc: 'Slow-fermented yacon root tonic rich in natural FOS prebiotics that nourish beneficial gut flora and everyday immunity.',
      use: 'Suggested use: drink directly or mix with smoothies',
      image: 'assets/products/yacon-immune.webp',
      isCutout: true,
      scale: 1.0,
      offsetX: '25%',
      clip: 'inset(0% 54% 4% 2% round 18px)'
    },
    {
      id: 'yacon-probiotic-syrup-kefir',
      family: 'yacon',
      name: 'Yacon Probiotic Syrup Kefir',
      bgWord: 'KEFIR',
      sizes: '500 ml · 1 L',
      flavours: '',
      desc: 'Non-dairy living water kefir fermented with highland yacon syrup to deliver active probiotic cultures without refined sugar.',
      use: 'Suggested use: drink directly or mix with smoothies',
      image: 'assets/products/yacon-probiotic-syrup-kefir.jpg',
      isCutout: false,
      scale: 1,
      offsetX: '0%'
    },
    {
      id: 'yacon-inulin-capsules',
      family: 'yacon',
      name: 'Yacon Inulin Capsules',
      bgWord: 'INULIN',
      sizes: '40-capsule pack',
      flavours: '',
      desc: 'Concentrated soluble prebiotic inulin extract from highland yacon tubers in convenient daily plant capsules.',
      use: 'Suggested use: take two capsules daily',
      image: 'assets/products/yacon-inulin-capsules.jpg',
      isCutout: false,
      scale: 1,
      offsetX: '0%'
    },
    {
      id: 'granola',
      family: 'granola',
      name: 'Granola',
      bgWord: 'GRANOLA',
      sizes: '400 g · 200 g · 100 g',
      flavours: '',
      desc: 'Crunchy oven-toasted clusters made with whole oats, roasted chia seeds, pumpkin seeds, peanuts, and natural honey.',
      use: 'Suggested use: snack directly or add yoghurt for a healthy delicious breakfast',
      image: 'assets/products/granola.webp',
      isCutout: true,
      scale: 1.06,
      offsetX: '-7%',
      clip: 'inset(0% 5% 0% 18% round 18px)'
    }
  ];

  class MichaCarousel {
    constructor(root) {
      this.root = root;
      if (!this.root) return;

      this.stage = document.getElementById('micha-product-stage');
      this.viewport = document.getElementById('micha-product-viewport');
      this.img = document.getElementById('micha-active-img');
      this.burst = document.getElementById('micha-botanical-burst');
      this.bgWord = document.getElementById('micha-bg-word');
      this.prevBtn = document.getElementById('micha-prev');
      this.nextBtn = document.getElementById('micha-next');
      this.counterEl = document.getElementById('micha-counter-num');
      this.counterNameEl = document.getElementById('micha-counter-name');
      this.dotsContainer = document.getElementById('micha-dots');
      this.toggleBtn = document.getElementById('micha-info-toggle');
      this.toggleLabel = document.getElementById('micha-info-toggle-label');

      // Side Info Pop-Up elements
      this.popup = document.getElementById('micha-info-popup');
      this.popupClose = document.getElementById('micha-popup-close');
      this.popupFamily = document.getElementById('micha-popup-family');
      this.popupTitle = document.getElementById('micha-popup-title');
      this.popupSizes = document.getElementById('micha-popup-sizes');
      this.popupFlavours = document.getElementById('micha-popup-flavours');
      this.popupDesc = document.getElementById('micha-popup-desc');
      this.popupUse = document.getElementById('micha-popup-use');
      this.popupWa = document.getElementById('micha-popup-wa');
      this.popupDetails = document.getElementById('micha-popup-details');

      this.familyTabs = Array.from(this.root.querySelectorAll('.micha-family-tab'));

      this.currentIndex = 0;
      this.activeFamily = 'chia';
      this.isTransitioning = false;
      this.transitionTimer = null;
      this.isPopupOpen = this.popup ? this.popup.classList.contains('is-open') : true;

      // Drag tracking
      this.isDragging = false;
      this.dragStartX = 0;
      this.dragMoved = false;

      this.init();
    }

    init() {
      this.buildDots();
      this.bindEvents();
      this.renderFamilyTheme(PRODUCTS[0].family, true);
      this.applyImagePresentation(PRODUCTS[0]);
      this.updateUI(0, true);
      this.preloadNeighbors(0);
    }

    buildDots() {
      if (!this.dotsContainer) return;
      this.dotsContainer.innerHTML = '';
      this.dots = PRODUCTS.map((product, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `micha-dot${idx === 0 ? ' is-active' : ''}`;
        dot.setAttribute('aria-label', `Show ${product.name}`);
        dot.addEventListener('click', () => {
          const dir = idx > this.currentIndex ? 1 : -1;
          this.goTo(idx, dir);
        });
        this.dotsContainer.appendChild(dot);
        return dot;
      });
    }

    bindEvents() {
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.step(-1);
        });
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.step(1);
        });
      }

      this.familyTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          const family = tab.dataset.family;
          const targetIdx = PRODUCTS.findIndex((p) => p.family === family);
          if (targetIdx !== -1 && targetIdx !== this.currentIndex) {
            const dir = targetIdx > this.currentIndex ? 1 : -1;
            this.goTo(targetIdx, dir);
          }
        });
      });

      if (this.toggleBtn) {
        this.toggleBtn.addEventListener('click', () => {
          this.setPopupOpen(!this.isPopupOpen);
        });
      }

      if (this.popupClose) {
        this.popupClose.addEventListener('click', () => {
          this.setPopupOpen(false);
        });
      }

      if (this.viewport) {
        this.viewport.addEventListener('click', () => {
          if (this.dragMoved) return;
          if (!this.isPopupOpen) {
            this.setPopupOpen(true);
          } else {
            this.triggerPopupRefresh();
          }
        });
      }

      // Pointer drag / horizontal swipe on stage
      if (this.stage) {
        this.stage.addEventListener('pointerdown', (e) => {
          if (e.target.closest('button')) return;
          this.isDragging = true;
          this.dragStartX = e.clientX;
          this.dragMoved = false;
          this.stage.classList.add('is-dragging');
          try {
            this.stage.setPointerCapture(e.pointerId);
          } catch (_) {}
        });

        this.stage.addEventListener('pointermove', (e) => {
          if (!this.isDragging) return;
          const dx = e.clientX - this.dragStartX;
          if (Math.abs(dx) > 10) {
            this.dragMoved = true;
          }
          if (Math.abs(dx) >= 48) {
            this.isDragging = false;
            this.stage.classList.remove('is-dragging');
            try {
              this.stage.releasePointerCapture(e.pointerId);
            } catch (_) {}
            this.step(dx < 0 ? 1 : -1);
          }
        });

        const endDrag = (e) => {
          if (!this.isDragging) return;
          this.isDragging = false;
          this.stage.classList.remove('is-dragging');
          try {
            this.stage.releasePointerCapture(e.pointerId);
          } catch (_) {}
        };

        this.stage.addEventListener('pointerup', endDrag);
        this.stage.addEventListener('pointercancel', endDrag);
      }

      // Keyboard navigation
      window.addEventListener('keydown', (e) => {
        const activeTag = document.activeElement ? document.activeElement.tagName : '';
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') return;

        if (e.key === 'ArrowLeft') {
          this.step(-1);
        } else if (e.key === 'ArrowRight') {
          this.step(1);
        } else if (e.key === 'Escape' && this.isPopupOpen) {
          this.setPopupOpen(false);
        }
      });
    }

    step(direction) {
      const nextIdx = (this.currentIndex + direction + PRODUCTS.length) % PRODUCTS.length;
      this.goTo(nextIdx, direction);
    }

    goTo(index, direction = 1) {
      if (index === this.currentIndex) return;
      const product = PRODUCTS[index];
      if (!product) return;

      if (this.transitionTimer) {
        clearTimeout(this.transitionTimer);
        this.transitionTimer = null;
      }

      this.currentIndex = index;
      this.renderFamilyTheme(product.family, false);
      this.updateUI(index, false);
      this.preloadNeighbors(index);
      this.triggerBurstBloom();

      if (!this.img) return;

      const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        this.applyImagePresentation(product);
        this.img.src = product.image;
        this.img.alt = product.name;
        return;
      }

      this.img.classList.remove('exit-left', 'exit-right', 'enter-from-left', 'enter-from-right');
      this.img.classList.add(direction >= 0 ? 'exit-left' : 'exit-right');

      this.transitionTimer = setTimeout(() => {
        this.img.classList.remove('exit-left', 'exit-right');
        this.img.classList.add(direction >= 0 ? 'enter-from-right' : 'enter-from-left');

        this.applyImagePresentation(product);
        this.img.src = product.image;
        this.img.alt = product.name;

        // Force reflow so entry transition slides smoothly back to center
        void this.img.offsetWidth;
        this.img.classList.remove('enter-from-right', 'enter-from-left');
      }, 170);
    }

    applyImagePresentation(product) {
      if (!this.img) return;
      this.img.classList.toggle('is-cutout', Boolean(product.isCutout));
      this.img.classList.toggle('is-photo', !product.isCutout);
      this.img.style.setProperty('--img-shift-x', product.offsetX || '0%');
      this.img.style.setProperty('--img-scale', String(product.scale || 1));
      this.img.style.setProperty('--img-clip', product.clip || 'none');
      if (this.viewport) {
        this.viewport.classList.toggle('has-cutout', Boolean(product.isCutout));
      }
    }

    renderFamilyTheme(familyKey, forceSvg) {
      const theme = FAMILIES[familyKey] || FAMILIES.chia;
      this.root.style.setProperty('--micha-bg', theme.bg);
      this.root.style.setProperty('--micha-dot', theme.dot);
      this.root.style.setProperty('--micha-accent', theme.accent);
      this.root.style.setProperty('--micha-accent-hover', theme.accentHover);
      this.root.style.setProperty('--micha-accent-soft', theme.accentSoft);
      this.root.style.setProperty('--micha-word', theme.word);
      this.root.setAttribute('data-family', familyKey);

      if (this.burst && (forceSvg || this.activeFamily !== familyKey)) {
        this.burst.innerHTML = theme.svg;
      }
      this.activeFamily = familyKey;

      this.familyTabs.forEach((tab) => {
        const isMatch = tab.dataset.family === familyKey;
        tab.classList.toggle('is-active', isMatch);
        tab.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });
    }

    triggerBurstBloom() {
      if (!this.burst) return;
      this.burst.classList.remove('is-blooming');
      void this.burst.offsetWidth;
      this.burst.classList.add('is-blooming');
    }

    setPopupOpen(open) {
      this.isPopupOpen = Boolean(open);
      if (this.popup) {
        this.popup.classList.toggle('is-open', this.isPopupOpen);
        this.popup.setAttribute('aria-hidden', this.isPopupOpen ? 'false' : 'true');
      }
      if (this.toggleBtn) {
        this.toggleBtn.setAttribute('aria-expanded', this.isPopupOpen ? 'true' : 'false');
      }
      if (this.toggleLabel) {
        this.toggleLabel.textContent = this.isPopupOpen ? 'Hide Info' : 'Product Info';
      }
    }

    triggerPopupRefresh() {
      if (!this.popup || !this.isPopupOpen) return;
      this.popup.classList.remove('is-refreshing');
      void this.popup.offsetWidth;
      this.popup.classList.add('is-refreshing');
    }

    updateUI(index, immediate) {
      const product = PRODUCTS[index];
      const theme = FAMILIES[product.family] || FAMILIES.chia;

      if (this.bgWord) {
        this.bgWord.textContent = product.bgWord;
      }

      if (this.counterEl) {
        const current = String(index + 1).padStart(2, '0');
        const total = String(PRODUCTS.length).padStart(2, '0');
        this.counterEl.textContent = `${current} / ${total}`;
      }

      if (this.counterNameEl) {
        this.counterNameEl.textContent = product.name;
      }

      if (this.dots) {
        this.dots.forEach((dot, i) => {
          dot.classList.toggle('is-active', i === index);
          dot.setAttribute('aria-current', i === index ? 'true' : 'false');
        });
      }

      // Side Info Pop-Up updates
      if (this.popupFamily) this.popupFamily.textContent = theme.label;
      if (this.popupTitle) this.popupTitle.textContent = product.name;
      if (this.popupSizes) this.popupSizes.textContent = `Available in ${product.sizes}`;
      if (this.popupFlavours) {
        if (product.flavours) {
          this.popupFlavours.textContent = product.flavours;
          this.popupFlavours.hidden = false;
        } else {
          this.popupFlavours.textContent = '';
          this.popupFlavours.hidden = true;
        }
      }
      if (this.popupDesc) this.popupDesc.textContent = product.desc;
      if (this.popupUse) this.popupUse.textContent = product.use;

      if (this.popupWa) {
        const msg = encodeURIComponent(`Hello Afyalishe Wellness, I would like to order ${product.name} (${product.sizes}).`);
        this.popupWa.href = `https://wa.me/254759561657?text=${msg}`;
      }

      if (this.popupDetails) {
        this.popupDetails.href = `product.html?id=${product.id}`;
      }

      if (!immediate) {
        this.triggerPopupRefresh();
      }
    }

    preloadNeighbors(index) {
      const prevIdx = (index - 1 + PRODUCTS.length) % PRODUCTS.length;
      const nextIdx = (index + 1) % PRODUCTS.length;
      [prevIdx, nextIdx].forEach((idx) => {
        const src = PRODUCTS[idx] && PRODUCTS[idx].image;
        if (src) {
          const pre = new Image();
          pre.src = src;
        }
      });
    }
  }

  function mountCarousel() {
    const hero = document.getElementById('micha-hero');
    if (hero && !window.afyalisheMichaCarousel) {
      window.afyalisheMichaCarousel = new MichaCarousel(hero);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountCarousel);
  } else {
    mountCarousel();
  }
})();
