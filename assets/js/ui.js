/**
 * AFYALISHE WELLNESS - UI INTERACTIONS
 * Cart drawer, Search modal, Mobile navigation, Toast notifications
 * Adheres to:
 * - Rule 1: No filler badges
 * - Rule 12: Consistent SVG icons (no emojis in headings or toasts)
 * - Rule 18: Tabular numbers
 * - Rule 20: Fast, purposeful feedback
 */

window.AFYALISHE_UI = {
  init() {
    this.initCartDrawer();
    this.initMobileNav();
    this.initSearchModal();
    this.initServiceModal();
    this.initToastSystem();
    this.updateCartBadge();

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
    const overlay = document.querySelector('.cart-overlay');
    const panel = document.querySelector('.cart-drawer-panel');

    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCartDrawer();
      });
    });

    closeBtn?.addEventListener('click', () => this.closeCartDrawer());
    overlay?.addEventListener('click', () => this.closeCartDrawer());

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
    const overlay = document.querySelector('.cart-overlay');
    const panel = document.querySelector('.cart-drawer-panel');
    if (overlay && panel) {
      overlay.classList.add('open');
      panel.classList.add('open');
      this.renderCartDrawerItems();
    }
  },

  closeCartDrawer() {
    const overlay = document.querySelector('.cart-overlay');
    const panel = document.querySelector('.cart-drawer-panel');
    if (overlay && panel) {
      overlay.classList.remove('open');
      panel.classList.remove('open');
    }
  },

  renderCartDrawerItems() {
    const container = document.getElementById('cart-drawer-items');
    const countBadge = document.getElementById('drawer-items-count');
    if (!container) return;

    const cart = window.AFYALISHE_STORE.getCart();
    const count = window.AFYALISHE_STORE.getCartCount();
    if (countBadge) countBadge.textContent = `${count} items`;

    if (cart.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px 16px;">
          <h4 style="margin-bottom: 6px;">Your inquiry bag is empty</h4>
          <p style="font-size: 13.5px; color: var(--color-text-secondary); margin-bottom: 16px;">
            Explore our probiotic beverages, chia seeds, and herbal teas.
          </p>
          <a href="shop.html" class="btn btn-secondary btn-sm" onclick="window.AFYALISHE_UI.closeCartDrawer()">Browse Products</a>
        </div>
      `;
      return;
    }

    let html = '';
    cart.forEach((item, index) => {
      html += `
        <div class="cart-drawer-item">
          <div class="cart-drawer-item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div>
            <h4 style="font-size: 14px; margin-bottom: 2px;">${item.name}</h4>
            <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 4px;">
              ${item.size ? `<span class="tabular-nums">${item.size}</span>` : ''}
              ${item.flavour ? ` &bull; ${item.flavour}` : ''}
            </div>
            <div class="cart-stepper">
              <button class="cart-stepper-btn" onclick="window.AFYALISHE_STORE.updateQuantity(${index}, -1)" aria-label="Decrease">&minus;</button>
              <span class="cart-stepper-val">${item.quantity}</span>
              <button class="cart-stepper-btn" onclick="window.AFYALISHE_STORE.updateQuantity(${index}, 1)" aria-label="Increase">+</button>
            </div>
          </div>
          <div>
            <button class="cart-stepper-btn" style="color: var(--color-allergen);" onclick="window.AFYALISHE_STORE.removeFromCart(${index})" title="Remove item" aria-label="Remove item">&times;</button>
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
    const mobilePanel = document.querySelector('.mobile-nav-drawer');
    const overlay = document.querySelector('.mobile-nav-overlay');

    if (!hamburger) return;

    hamburger.addEventListener('click', () => {
      mobilePanel?.classList.toggle('open');
      overlay?.classList.toggle('open');
    });

    overlay?.addEventListener('click', () => {
      mobilePanel?.classList.remove('open');
      overlay?.classList.remove('open');
    });
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
        setTimeout(() => input?.focus(), 80);
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
          resultsContainer.innerHTML = '<p style="padding: 12px; color: var(--color-text-secondary); font-size: 13.5px;">Type at least 2 characters to search...</p>';
          return;
        }

        const matches = window.AFYALISHE_STORE.products.filter(
          (p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
          resultsContainer.innerHTML = `<p style="padding: 12px; color: var(--color-text-secondary); font-size: 13.5px;">No products found matching "${query}".</p>`;
          return;
        }

        let html = '';
        matches.forEach((p) => {
          html += `
            <a href="product.html?id=${p.id}" style="display: flex; align-items: center; gap: 12px; padding: 10px; border-bottom: 1px solid var(--color-border-subtle); text-decoration: none; color: inherit;">
              <img src="${p.image}" alt="${p.name}" style="width: 44px; height: 44px; object-fit: contain; border-radius: 4px; background: #f7f4f2;">
              <div>
                <strong style="display: block; font-family: var(--font-heading); font-size: 14.5px; color: var(--color-text-primary);">${p.name}</strong>
                <span style="font-size: 12px; color: var(--color-primary);">${p.categoryName}</span>
              </div>
            </a>
          `;
        });
        resultsContainer.innerHTML = html;
      });
    }
  },

  // ------------------------------------------------------------------------
  // 4. Service Enquiry Modal
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
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const serviceName = document.getElementById('service-modal-title')?.textContent || 'Service';
      modal.classList.remove('open');
      this.showToast(`Enquiry for "${serviceName}" received. Our team will contact you.`);
      form.reset();
    });

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
  // 5. Toast System (Rule 12: No random emojis, clean feedback)
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

  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.style.cssText = `
      background: #FFFFFF;
      color: var(--color-text-primary);
      border-left: 3px solid var(--color-primary);
      padding: 10px 16px;
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow-hover);
      font-size: 13.5px;
      font-weight: 500;
      pointer-events: auto;
      transform: translateY(12px);
      opacity: 0;
      transition: all 0.2s var(--ease-feedback);
      max-width: 360px;
    `;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 10);

    setTimeout(() => {
      toast.style.transform = 'translateY(12px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.AFYALISHE_UI.init();
});
