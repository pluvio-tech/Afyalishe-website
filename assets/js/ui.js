/**
 * AFYALISHE WELLNESS - UI CONTROLLER
 * Cart drawer, Search modal, Mobile navigation, Cookie banner, Toast notifications
 */

window.AFYALISHE_UI = {
  init() {
    this.initCartDrawer();
    this.initMobileNav();
    this.initSearchModal();
    this.initCookieBanner();
    this.initServiceModal();
    this.initToastSystem();
    this.updateCartBadge();

    // Listen for cart changes
    window.addEventListener('cart:updated', () => {
      this.updateCartBadge();
      this.renderCartDrawerItems();
    });
  },

  // ------------------------------------------------------------------------
  // 1. Cart Drawer
  // ------------------------------------------------------------------------
  initCartDrawer() {
    const openBtns = document.querySelectorAll('.btn-open-cart, .icon-btn-cart');
    const closeBtn = document.querySelector('.cart-close-btn');
    const overlay = document.querySelector('.cart-drawer-overlay');
    const drawer = document.querySelector('.cart-drawer');

    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCartDrawer();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeCartDrawer());
    }

    if (overlay) {
      overlay.addEventListener('click', () => this.closeCartDrawer());
    }

    // Direct WhatsApp order from cart drawer
    const waCartBtn = document.getElementById('drawer-whatsapp-btn');
    if (waCartBtn) {
      waCartBtn.addEventListener('click', () => {
        const cart = window.AFYALISHE_STORE.getCart();
        const link = window.AFYALISHE_STORE.getWhatsAppOrderLink(cart);
        window.open(link, '_blank');
      });
    }
  },

  openCartDrawer() {
    const overlay = document.querySelector('.cart-drawer-overlay');
    const drawer = document.querySelector('.cart-drawer');
    if (overlay && drawer) {
      overlay.classList.add('open');
      drawer.classList.add('open');
      this.renderCartDrawerItems();
    }
  },

  closeCartDrawer() {
    const overlay = document.querySelector('.cart-drawer-overlay');
    const drawer = document.querySelector('.cart-drawer');
    if (overlay && drawer) {
      overlay.classList.remove('open');
      drawer.classList.remove('open');
    }
  },

  renderCartDrawerItems() {
    const container = document.getElementById('cart-drawer-items');
    const countBadge = document.getElementById('drawer-items-count');
    if (!container) return;

    const cart = window.AFYALISHE_STORE.getCart();
    if (countBadge) countBadge.textContent = `${window.AFYALISHE_STORE.getCartCount()} items`;

    if (cart.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 40px; margin-bottom: 12px; color: var(--color-primary);">🌿</div>
          <h4 style="margin-bottom: 6px;">Your inquiry bag is empty</h4>
          <p style="font-size: 13.5px; color: var(--color-text-secondary); margin-bottom: 20px;">
            Explore our probiotic ferments, chia superfoods, and herbal teas.
          </p>
          <a href="shop.html" class="btn btn-primary-lime btn-sm">Browse Products</a>
        </div>
      `;
      return;
    }

    let html = '';
    cart.forEach((item, index) => {
      html += `
        <div class="cart-item">
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <div class="cart-item-meta">
              ${item.size ? `Size: <strong>${item.size}</strong>` : ''}
              ${item.flavour ? ` | Flavour: <strong>${item.flavour}</strong>` : ''}
            </div>
            <div class="quantity-stepper">
              <button class="quantity-btn" onclick="window.AFYALISHE_STORE.updateQuantity(${index}, -1)">−</button>
              <span class="quantity-val">${item.quantity}</span>
              <button class="quantity-btn" onclick="window.AFYALISHE_STORE.updateQuantity(${index}, 1)">+</button>
            </div>
          </div>
          <div>
            <button class="quantity-btn" style="color: var(--color-danger);" onclick="window.AFYALISHE_STORE.removeFromCart(${index})" title="Remove item">✕</button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  updateCartBadge() {
    const badges = document.querySelectorAll('.cart-count-badge');
    const count = window.AFYALISHE_STORE.getCartCount();
    badges.forEach((b) => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  // ------------------------------------------------------------------------
  // 2. Mobile Navigation
  // ------------------------------------------------------------------------
  initMobileNav() {
    const hamburger = document.querySelector('.hamburger-btn');
    const mobileMenu = document.querySelector('.mobile-nav-drawer');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');

    if (!hamburger) return;

    hamburger.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.toggle('open');
      if (mobileOverlay) mobileOverlay.classList.toggle('open');
    });

    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', () => {
        if (mobileMenu) mobileMenu.classList.remove('open');
        mobileOverlay.classList.remove('open');
      });
    }
  },

  // ------------------------------------------------------------------------
  // 3. Search Modal
  // ------------------------------------------------------------------------
  initSearchModal() {
    const openBtns = document.querySelectorAll('.btn-open-search');
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('modal-search-input');
    const resultsContainer = document.getElementById('search-results-list');
    const closeBtn = document.querySelector('.search-modal-close');

    if (!modal) return;

    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('open');
        setTimeout(() => input?.focus(), 100);
      });
    });

    closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });

    if (input && resultsContainer) {
      input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) {
          resultsContainer.innerHTML = '<p style="padding: 15px; color: var(--color-text-secondary);">Type at least 2 characters to search...</p>';
          return;
        }

        const matchedProducts = window.AFYALISHE_STORE.products.filter(
          (p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
        );

        if (matchedProducts.length === 0) {
          resultsContainer.innerHTML = `<p style="padding: 15px; color: var(--color-text-secondary);">No products found matching "${query}".</p>`;
          return;
        }

        let html = '';
        matchedProducts.forEach((p) => {
          html += `
            <a href="product.html?id=${p.id}" class="search-result-item" style="display: flex; align-items: center; gap: 14px; padding: 12px; border-bottom: 1px solid rgba(0,0,0,0.06); text-decoration: none; color: inherit;">
              <img src="${p.image}" alt="${p.name}" style="width: 48px; height: 48px; object-fit: contain; border-radius: 6px; background: #f7f5f4;">
              <div>
                <strong style="display: block; font-family: var(--font-heading); font-size: 15px; color: var(--color-text-charcoal);">${p.name}</strong>
                <span style="font-size: 12px; color: var(--color-catalogue-green);">${p.categoryName}</span>
              </div>
            </a>
          `;
        });
        resultsContainer.innerHTML = html;
      });
    }
  },

  // ------------------------------------------------------------------------
  // 4. Cookie Banner
  // ------------------------------------------------------------------------
  initCookieBanner() {
    const banner = document.querySelector('.cookie-banner');
    if (!banner) return;

    const accepted = localStorage.getItem('afyalishe_cookie_consent');
    if (!accepted) {
      setTimeout(() => banner.classList.add('visible'), 1200);
    }

    const acceptBtn = banner.querySelector('.btn-accept-cookies');
    const rejectBtn = banner.querySelector('.btn-reject-cookies');

    acceptBtn?.addEventListener('click', () => {
      localStorage.setItem('afyalishe_cookie_consent', 'all');
      banner.classList.remove('visible');
      this.showToast('Cookie preferences saved.');
    });

    rejectBtn?.addEventListener('click', () => {
      localStorage.setItem('afyalishe_cookie_consent', 'necessary');
      banner.classList.remove('visible');
      this.showToast('Only necessary cookies enabled.');
    });
  },

  // ------------------------------------------------------------------------
  // 5. Service Enquiry Modal
  // ------------------------------------------------------------------------
  initServiceModal() {
    const modal = document.getElementById('service-enquiry-modal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close-btn');
    closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });

    const form = document.getElementById('service-enquiry-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const serviceName = document.getElementById('service-modal-title')?.textContent || 'Service';
        modal.classList.remove('open');
        this.showToast(`Thank you! Your enquiry for "${serviceName}" has been received. Our team will contact you shortly.`);
        form.reset();
      });
    }

    // Open buttons
    document.querySelectorAll('.btn-book-service').forEach((btn) => {
      btn.addEventListener('click', () => {
        const serviceId = btn.dataset.serviceId;
        const service = window.AFYALISHE_STORE.services.find((s) => s.id === serviceId);
        if (service) {
          const titleEl = document.getElementById('service-modal-title');
          const serviceInput = document.getElementById('enquiry-service-input');
          if (titleEl) titleEl.textContent = service.title;
          if (serviceInput) serviceInput.value = service.title;
          modal.classList.add('open');
        }
      });
    });
  },

  // ------------------------------------------------------------------------
  // 6. Toast System
  // ------------------------------------------------------------------------
  initToastSystem() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 24px;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        gap: 8px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }
  },

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.style.cssText = `
      background: #FFFFFF;
      color: var(--color-text-charcoal);
      border-left: 4px solid ${type === 'success' ? '#7AC143' : '#BE7133'};
      padding: 12px 18px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.12);
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
      pointer-events: auto;
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      max-width: 380px;
    `;
    toast.innerHTML = `<span>🌿</span> <div>${message}</div>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 10);

    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.AFYALISHE_UI.init();
});
