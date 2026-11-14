/**
 * AFYALISHE WELLNESS - MAIN CONTROLLER & PAGE ROUTER
 * Coordinates dynamic views, product catalog rendering, filters, variations & 3D re-binding
 */

window.AFYALISHE_APP = {
  currentCategory: 'all',
  currentSizeFilter: 'all',
  searchQuery: '',

  init() {
    this.renderHeaderAndFooter();
    this.routePage();
  },

  // ------------------------------------------------------------------------
  // Global Header and Footer Sync
  // ------------------------------------------------------------------------
  renderHeaderAndFooter() {
    // Header stickiness & scroll effect
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.site-header');
      if (header) {
        if (window.scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });

    // Newsletter submit handling
    document.querySelectorAll('.footer-newsletter-form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        if (input && input.value) {
          window.AFYALISHE_UI?.showToast('Thank you for subscribing to Afyalishe health insights!');
          input.value = '';
        }
      });
    });
  },

  // ------------------------------------------------------------------------
  // Route current page based on pathname / params
  // ------------------------------------------------------------------------
  routePage() {
    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);

    if (path.includes('shop.html') || document.getElementById('shop-product-grid')) {
      this.initShopPage();
    } else if (path.includes('product.html') || document.getElementById('product-detail-view')) {
      const productId = params.get('id') || 'chia-oil';
      this.initProductPage(productId);
    } else if (path.includes('where-to-buy.html') || document.getElementById('stockists-grid')) {
      this.initStockistsPage();
    } else if (path.includes('services.html') || document.getElementById('services-grid-container')) {
      this.initServicesPage();
    } else if (path.includes('blog.html') || document.getElementById('blog-grid-container')) {
      this.initBlogPage();
    } else if (path.includes('checkout.html') || document.getElementById('checkout-form')) {
      window.AFYALISHE_CHECKOUT?.init();
    } else {
      // Home page
      this.initHomePage();
    }
  },

  // ------------------------------------------------------------------------
  // 1. Home Page Initialization
  // ------------------------------------------------------------------------
  initHomePage() {
    const featuredContainer = document.getElementById('home-featured-products');
    if (!featuredContainer) return;

    // Show 4 iconic products on Home (one from each category)
    const featuredIds = ['chia-oil', 'chia-yoghurt', 'hibiscus-herbal-blend', 'granola'];
    const products = window.AFYALISHE_STORE.products.filter((p) => featuredIds.includes(p.id));

    let html = '';
    products.forEach((p) => {
      html += this.buildProductCardHtml(p);
    });
    featuredContainer.innerHTML = html;

    this.rebindMotion();
  },

  // ------------------------------------------------------------------------
  // 2. Shop Page Catalog & Dynamic Filters
  // ------------------------------------------------------------------------
  initShopPage() {
    const grid = document.getElementById('shop-product-grid');
    if (!grid) return;

    // Read URL params for pre-selected category
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category');
    if (catParam) this.currentCategory = catParam;

    this.renderCategoryFilterSidebar();
    this.renderShopProducts();

    // Search input listener
    const searchInput = document.getElementById('shop-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderShopProducts();
      });
    }

    // Sort listener
    const sortSelect = document.getElementById('shop-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        this.renderShopProducts();
      });
    }
  },

  renderCategoryFilterSidebar() {
    const list = document.getElementById('sidebar-category-list');
    if (!list) return;

    let html = '';
    window.AFYALISHE_STORE.categories.forEach((cat) => {
      const count = cat.id === 'all'
        ? window.AFYALISHE_STORE.products.length
        : window.AFYALISHE_STORE.products.filter((p) => p.category === cat.id).length;

      const isActive = this.currentCategory === cat.id;
      html += `
        <li>
          <button class="filter-btn ${isActive ? 'active' : ''}" onclick="window.AFYALISHE_APP.setCategoryFilter('${cat.id}')">
            <span>${cat.name}</span>
            <span class="filter-count">${count}</span>
          </button>
        </li>
      `;
    });
    list.innerHTML = html;
  },

  setCategoryFilter(catId) {
    this.currentCategory = catId;
    this.renderCategoryFilterSidebar();
    this.renderShopProducts();
  },

  renderShopProducts() {
    const grid = document.getElementById('shop-product-grid');
    const countDisplay = document.getElementById('shop-results-count');
    if (!grid) return;

    let filtered = window.AFYALISHE_STORE.products.filter((p) => {
      const matchCat = this.currentCategory === 'all' || p.category === this.currentCategory;
      const matchSearch = !this.searchQuery || 
        p.name.toLowerCase().includes(this.searchQuery) || 
        p.description.toLowerCase().includes(this.searchQuery);
      return matchCat && matchSearch;
    });

    // Optional sort
    const sortVal = document.getElementById('shop-sort-select')?.value;
    if (sortVal === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortVal === 'name-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (countDisplay) {
      countDisplay.textContent = `Showing all ${filtered.length} products`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <h3 style="color: var(--color-text-secondary); margin-bottom: 12px;">No products match your filter</h3>
          <p style="margin-bottom: 24px;">Try selecting another category or resetting search keywords.</p>
          <button class="btn btn-outline" onclick="window.AFYALISHE_APP.setCategoryFilter('all')">View All 11 Products</button>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach((p) => {
      html += this.buildProductCardHtml(p);
    });
    grid.innerHTML = html;

    this.rebindMotion();
  },

  // ------------------------------------------------------------------------
  // Product Card Template
  // ------------------------------------------------------------------------
  buildProductCardHtml(p) {
    const waLink = window.AFYALISHE_STORE.getWhatsAppOrderLink(p);

    let sizePills = '';
    if (p.sizes && p.sizes.length) {
      p.sizes.forEach((s, idx) => {
        sizePills += `<span class="size-pill ${idx === 0 ? 'active' : ''}" onclick="event.stopPropagation(); window.AFYALISHE_APP.selectCardSize(this, '${p.id}', '${s}')">${s}</span>`;
      });
    }

    const allergenHtml = p.allergenWarning
      ? `<span class="allergen-badge">⚠️ ${p.allergenWarning}</span>`
      : '';

    return `
      <div class="product-card" data-tilt="true" id="card-${p.id}" onclick="window.location.href='product.html?id=${p.id}'">
        <div class="product-card-badge-row">
          <span class="category-tag">${p.categoryName}</span>
          ${allergenHtml}
        </div>

        <div class="product-image-wrap">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </div>

        <div class="product-card-body">
          <h3 class="product-title">${p.name}</h3>
          <p class="product-desc">${p.description}</p>

          <div class="suggested-use-callout">
            <strong>Suggested use:</strong> ${p.suggestedUse}
          </div>

          <div class="product-variants-pill-row">
            ${sizePills}
          </div>

          <div class="product-card-footer">
            <div class="price-status">
              <span class="price-on-request-badge">${p.priceText}</span>
            </div>

            <div class="card-actions">
              <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm" onclick="event.stopPropagation();" title="Order directly on WhatsApp">
                <span>💬 WhatsApp to Order</span>
              </a>
              <button class="btn btn-primary-lime btn-sm btn-add-quick" onclick="event.stopPropagation(); window.AFYALISHE_APP.quickAddToCart('${p.id}')" title="Add to Inquiry Bag">
                <span>+ Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  selectCardSize(pill, productId, size) {
    const card = document.getElementById(`card-${productId}`);
    if (card) {
      card.querySelectorAll('.size-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      card.dataset.selectedSize = size;
    }
  },

  quickAddToCart(productId) {
    const card = document.getElementById(`card-${productId}`);
    const selectedSize = card?.dataset.selectedSize || null;
    window.AFYALISHE_STORE.addToCart(productId, selectedSize, null, 1);
    window.AFYALISHE_UI?.showToast('Added to order inquiry bag!');
  },

  // ------------------------------------------------------------------------
  // 3. Single Product View Initialization
  // ------------------------------------------------------------------------
  initProductPage(productId) {
    const product = window.AFYALISHE_STORE.products.find((p) => p.id === productId) || window.AFYALISHE_STORE.products[0];
    const container = document.getElementById('product-detail-view');
    if (!container) return;

    let sizeOptionsHtml = '';
    product.sizes.forEach((s, idx) => {
      sizeOptionsHtml += `
        <button class="variant-btn ${idx === 0 ? 'active' : ''}" onclick="window.AFYALISHE_APP.selectDetailVariant(this, 'size')">
          ${s}
        </button>
      `;
    });

    let flavourOptionsHtml = '';
    if (product.flavours && product.flavours.length) {
      flavourOptionsHtml = `
        <div class="product-variant-selector">
          <span class="variant-label">Choose Flavour:</span>
          <div class="variant-options-grid" id="detail-flavour-options">
            ${product.flavours.map((f, idx) => `
              <button class="variant-btn ${idx === 0 ? 'active' : ''}" onclick="window.AFYALISHE_APP.selectDetailVariant(this, 'flavour')">
                ${f}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    let highlightsHtml = '';
    product.highlights.forEach((h) => {
      highlightsHtml += `
        <li>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${h}</span>
        </li>
      `;
    });

    const allergenBanner = product.allergenWarning ? `
      <div style="background: #fef2f2; border: 1.5px solid #b91c1c; border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 20px; color: #b91c1c; font-weight: 600; display: flex; align-items: center; gap: 8px;">
        <span>⚠️</span> Allergen Notice: ${product.allergenWarning}
      </div>
    ` : '';

    container.innerHTML = `
      <div class="container section">
        <div class="product-hero-stage">
          <!-- 3D Interactive Viewport -->
          <div class="product-interactive-viewer">
            <img src="${product.image}" alt="${product.name}" class="product-3d-target-img">
            <div class="product-viewer-controls">
              <span>🖱️ Move cursor to tilt • Drag to rotate 3D</span>
              <button class="btn-sm btn-outline btn-zoom-toggle" style="margin-left: 10px; padding: 2px 10px; font-size: 11px;">Zoom</button>
            </div>
          </div>

          <!-- Product Details Column -->
          <div class="product-details-content">
            <span class="product-detail-badge">${product.categoryName}</span>
            <h1 class="product-detail-title">${product.name}</h1>
            <p class="serif-tagline" style="font-size: 18px; margin-bottom: 16px;">"Food as medicine"</p>

            <div class="product-detail-price-box">
              <div>
                <span class="price-box-label">Availability & Pricing</span>
                <div class="price-box-value">${product.priceText}</div>
              </div>
              <span style="background: rgba(122, 193, 67, 0.2); color: var(--color-primary); font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 99px;">In Stock (Kenya)</span>
            </div>

            ${allergenBanner}

            <p style="font-size: 16px; line-height: 1.6; color: var(--color-text-charcoal); margin-bottom: 24px;">
              ${product.description}
            </p>

            <div class="product-detail-suggested-use">
              <h4>Suggested Use</h4>
              <p>${product.suggestedUse}</p>
            </div>

            <!-- Size Selector -->
            <div class="product-variant-selector">
              <span class="variant-label">Select Package Size:</span>
              <div class="variant-options-grid" id="detail-size-options">
                ${sizeOptionsHtml}
              </div>
            </div>

            ${flavourOptionsHtml}

            <!-- Product Highlights -->
            <ul class="product-highlights-list">
              ${highlightsHtml}
            </ul>

            <!-- Action Buttons -->
            <div class="product-actions-cluster">
              <button class="btn btn-whatsapp btn-lg" onclick="window.AFYALISHE_APP.orderProductViaWhatsApp('${product.id}')">
                <span>💬 WhatsApp Direct Order (+254 759 561657)</span>
              </button>
              <button class="btn btn-primary-lime btn-lg" onclick="window.AFYALISHE_APP.addProductToCart('${product.id}')">
                <span>+ Add to Inquiry / Quote Bag</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Extended Info Tabs -->
        <div style="margin-top: 60px; background: #FFFFFF; border-radius: var(--radius-xl); border: 1px solid rgba(88,144,56,0.15); padding: 40px; box-shadow: var(--shadow-card);">
          <h3 style="margin-bottom: 16px;">Nutritional Integrity & Sourcing</h3>
          <p style="font-size: 16px; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 20px;">
            ${product.details}
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 24px;">
            <div>
              <strong style="color: var(--color-primary); display: block; margin-bottom: 4px;">Zero Additives</strong>
              <span style="font-size: 13.5px; color: var(--color-text-secondary);">100% natural ingredients, no synthetic colors or preservatives.</span>
            </div>
            <div>
              <strong style="color: var(--color-primary); display: block; margin-bottom: 4px;">Nyeri Highlands Sourced</strong>
              <span style="font-size: 13.5px; color: var(--color-text-secondary);">Grown in fertile volcanic soils under Mount Kenya.</span>
            </div>
            <div>
              <strong style="color: var(--color-primary); display: block; margin-bottom: 4px;">Nationwide Delivery</strong>
              <span style="font-size: 13.5px; color: var(--color-text-secondary);">Direct delivery across Nairobi, Nyeri, and all Kenyan counties.</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Rebind interactive 3D viewer
    window.initProductViewer?.();
  },

  selectDetailVariant(btn, type) {
    const container = type === 'size' ? document.getElementById('detail-size-options') : document.getElementById('detail-flavour-options');
    container?.querySelectorAll('.variant-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
  },

  orderProductViaWhatsApp(productId) {
    const product = window.AFYALISHE_STORE.products.find((p) => p.id === productId);
    const activeSize = document.querySelector('#detail-size-options .variant-btn.active')?.textContent.trim();
    const activeFlavour = document.querySelector('#detail-flavour-options .variant-btn.active')?.textContent.trim() || null;

    const item = {
      name: product.name,
      size: activeSize,
      flavour: activeFlavour,
      quantity: 1,
    };

    const link = window.AFYALISHE_STORE.getWhatsAppOrderLink(item);
    window.open(link, '_blank');
  },

  addProductToCart(productId) {
    const activeSize = document.querySelector('#detail-size-options .variant-btn.active')?.textContent.trim();
    const activeFlavour = document.querySelector('#detail-flavour-options .variant-btn.active')?.textContent.trim() || null;
    window.AFYALISHE_STORE.addToCart(productId, activeSize, activeFlavour, 1);
    window.AFYALISHE_UI?.showToast('Item added to inquiry bag!');
    window.AFYALISHE_UI?.openCartDrawer();
  },

  // ------------------------------------------------------------------------
  // 4. Stockists (Where to Buy) Page
  // ------------------------------------------------------------------------
  initStockistsPage() {
    const container = document.getElementById('stockists-grid');
    const tabsContainer = document.getElementById('town-filter-tabs');
    if (!container) return;

    let activeTown = 'all';

    const renderTabs = () => {
      if (!tabsContainer) return;
      let html = `<button class="town-tab-btn ${activeTown === 'all' ? 'active' : ''}" onclick="window.AFYALISHE_APP.filterTown('all')">All Towns (${window.AFYALISHE_STORE.stockists.reduce((acc, s) => acc + s.stores.length, 0)} Stores)</button>`;
      window.AFYALISHE_STORE.stockists.forEach((s) => {
        html += `<button class="town-tab-btn ${activeTown === s.town ? 'active' : ''}" onclick="window.AFYALISHE_APP.filterTown('${s.town}')">${s.town} (${s.stores.length})</button>`;
      });
      tabsContainer.innerHTML = html;
    };

    const renderStockistCards = () => {
      let filtered = window.AFYALISHE_STORE.stockists;
      if (activeTown !== 'all') {
        filtered = filtered.filter((s) => s.town === activeTown);
      }

      let html = '';
      filtered.forEach((group) => {
        group.stores.forEach((storeName) => {
          html += `
            <div class="stockist-card" data-tilt="true">
              <span class="stockist-town-badge">${group.town}</span>
              <h3 class="stockist-name">${storeName}</h3>
              <p class="stockist-note">Authorized retail distributor of Afyalishe fermented foods & chia range.</p>
              <div style="margin-top: auto; display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 12px; color: var(--color-primary); font-weight: 600;">✓ In Stock</span>
                <a href="https://wa.me/${window.AFYALISHE_STORE.whatsappNumber}?text=${encodeURIComponent(`Hello, I would like to check Afyalishe product availability at ${storeName} in ${group.town}.`)}" target="_blank" class="btn btn-outline btn-sm">Verify Stock</a>
              </div>
            </div>
          `;
        });
      });

      container.innerHTML = html;
      this.rebindMotion();
    };

    this.filterTown = (town) => {
      activeTown = town;
      renderTabs();
      renderStockistCards();
    };

    renderTabs();
    renderStockistCards();
  },

  // ------------------------------------------------------------------------
  // 5. Services Page
  // ------------------------------------------------------------------------
  initServicesPage() {
    const container = document.getElementById('services-grid-container');
    if (!container) return;

    let html = '';
    window.AFYALISHE_STORE.services.forEach((s) => {
      html += `
        <div class="service-card" data-tilt="true">
          <div class="service-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h3 class="service-title">${s.title}</h3>
          <p class="serif-tagline" style="margin-bottom: 12px; font-size: 15px;">${s.tagline}</p>
          <p class="service-desc">${s.description}</p>
          
          <ul style="list-style: none; margin-bottom: 24px; display: flex; flex-direction: column; gap: 8px;">
            ${s.deliverables.map((d) => `<li style="font-size: 13.5px; color: var(--color-text-charcoal); display: flex; align-items: center; gap: 8px;"><span style="color: var(--color-accent-lime);">✔</span> ${d}</li>`).join('')}
          </ul>

          <div style="margin-top: auto;">
            <button class="btn btn-primary-lime btn-full btn-book-service" data-service-id="${s.id}">
              <span>Enquire About ${s.title}</span>
            </button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
    this.rebindMotion();
  },

  // ------------------------------------------------------------------------
  // 6. Blog Page
  // ------------------------------------------------------------------------
  initBlogPage() {
    const container = document.getElementById('blog-grid-container');
    if (!container) return;

    let html = '';
    window.AFYALISHE_STORE.blogPosts.forEach((post) => {
      html += `
        <article class="stockist-card" data-tilt="true" style="padding: 24px;">
          <img src="${post.image}" alt="${post.title}" style="height: 180px; width: 100%; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 16px;">
          <div style="display: flex; gap: 8px; margin-bottom: 10px;">
            <span class="category-tag">${post.category}</span>
            <span style="font-size: 12px; color: var(--color-text-secondary);">${post.readTime}</span>
          </div>
          <h3 style="font-size: 19px; line-height: 1.35; margin-bottom: 10px;">${post.title}</h3>
          <p style="font-size: 14px; color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 18px;">${post.excerpt}</p>
          <div style="margin-top: auto; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 12px; color: var(--color-text-muted);">${post.date}</span>
            <a href="https://wa.me/${window.AFYALISHE_STORE.whatsappNumber}?text=${encodeURIComponent(`Hello, I read your article "${post.title}" and would like to learn more.`)}" target="_blank" class="btn btn-outline btn-sm">Read & Discuss</a>
          </div>
        </article>
      `;
    });
    container.innerHTML = html;
    this.rebindMotion();
  },

  // Re-bind motion handlers after dynamic content injection
  rebindMotion() {
    window.initTiltCards?.();
    window.initMagneticButtons?.();
    window.initCustomCursorHover?.();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.AFYALISHE_APP.init();
});
