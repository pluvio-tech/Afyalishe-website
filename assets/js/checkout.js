/**
 * AFYALISHE WELLNESS - CHECKOUT & PAYMENT SYSTEM
 * Guest checkout, Kenyan delivery zones calculation, simulated M-Pesa STK Push, Card payment & WhatsApp routing
 */

window.AFYALISHE_CHECKOUT = {
  currentZone: 'nairobi',
  paymentMethod: 'mpesa-stk',

  init() {
    this.bindEvents();
    this.renderCartSummary();
  },

  bindEvents() {
    // Delivery zone selector
    document.querySelectorAll('.delivery-option-item').forEach((opt) => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.delivery-option-item').forEach((o) => o.classList.remove('active'));
        opt.classList.add('active');
        this.currentZone = opt.dataset.zoneId;
        this.renderCartSummary();
      });
    });

    // Payment method tabs
    document.querySelectorAll('.payment-tab-btn').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.payment-tab-btn').forEach((t) => t.classList.remove('active'));
        document.querySelectorAll('.payment-panel').forEach((p) => p.classList.remove('active'));
        tab.classList.add('active');
        this.paymentMethod = tab.dataset.paymentMethod;
        const panel = document.getElementById(`panel-${this.paymentMethod}`);
        if (panel) panel.classList.add('active');
      });
    });

    // M-Pesa STK Push button
    const mpesaBtn = document.getElementById('btn-mpesa-pay');
    if (mpesaBtn) {
      mpesaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.processMpesaPayment();
      });
    }

    // Card Payment button
    const cardBtn = document.getElementById('btn-card-pay');
    if (cardBtn) {
      cardBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.processCardPayment();
      });
    }

    // Direct WhatsApp checkout button
    const waCheckoutBtn = document.getElementById('btn-whatsapp-checkout');
    if (waCheckoutBtn) {
      waCheckoutBtn.addEventListener('click', () => {
        const cart = window.AFYALISHE_STORE.getCart();
        const name = document.getElementById('checkout-name')?.value || '';
        const town = document.getElementById('checkout-town')?.value || '';
        const link = window.AFYALISHE_STORE.getWhatsAppOrderLink(cart, `Customer: ${name}, Delivery Town: ${town}`);
        window.open(link, '_blank');
      });
    }
  },

  renderCartSummary() {
    const summaryContainer = document.getElementById('checkout-cart-items');
    const feeDisplay = document.getElementById('checkout-delivery-fee');
    const totalDisplay = document.getElementById('checkout-total-val');
    if (!summaryContainer) return;

    const cart = window.AFYALISHE_STORE.getCart();
    if (cart.length === 0) {
      summaryContainer.innerHTML = '<p class="text-muted">Your order inquiry bag is empty.</p>';
      return;
    }

    let html = '';
    cart.forEach((item) => {
      html += `
        <div class="cart-item" style="margin-bottom: 10px;">
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <div class="cart-item-meta">
              ${item.size ? `Size: ${item.size}` : ''} 
              ${item.flavour ? `| Flavour: ${item.flavour}` : ''}
              | Qty: ${item.quantity}
            </div>
            <span class="price-on-request-badge">${item.priceText}</span>
          </div>
        </div>
      `;
    });
    summaryContainer.innerHTML = html;

    const zone = window.AFYALISHE_STORE.deliveryZones.find((z) => z.id === this.currentZone);
    const fee = zone ? zone.fee : 350;
    if (feeDisplay) feeDisplay.textContent = `KES ${fee}`;
    if (totalDisplay) totalDisplay.textContent = `KES ${fee} (Delivery) + Products (Pricing confirmed on order)`;
  },

  processMpesaPayment() {
    const phoneInput = document.getElementById('mpesa-phone');
    const phone = phoneInput ? phoneInput.value.trim() : '';

    if (!phone || phone.length < 9) {
      alert('Please enter a valid Safaricom phone number (e.g. 0759561657 or 254759561657).');
      return;
    }

    const modal = document.getElementById('mpesa-stk-modal');
    if (modal) {
      modal.classList.add('open');
      const phoneSpan = modal.querySelector('.mpesa-target-phone');
      if (phoneSpan) phoneSpan.textContent = phone;

      // Simulate STK push sequence
      const statusText = modal.querySelector('.mpesa-status-step');
      if (statusText) statusText.textContent = 'Sending STK Push prompt to your phone...';

      setTimeout(() => {
        if (statusText) statusText.textContent = 'Prompt displayed on mobile screen! Please enter your M-Pesa PIN.';
      }, 1800);

      setTimeout(() => {
        if (statusText) {
          statusText.innerHTML = `
            <span style="color: #00a859; font-weight: 700;">Payment Successful!</span><br>
            Receipt: <strong>QKG${Math.floor(100000 + Math.random() * 900000)}</strong> Confirmed.
            <br>Afyalishe Wellness has received your delivery booking.
          `;
        }
        setTimeout(() => {
          this.completeOrder('M-Pesa STK');
        }, 1500);
      }, 4000);
    }
  },

  processCardPayment() {
    const cardNum = document.getElementById('card-number')?.value;
    if (!cardNum || cardNum.length < 12) {
      alert('Please enter a valid 16-digit card number.');
      return;
    }

    const btn = document.getElementById('btn-card-pay');
    if (btn) btn.textContent = 'Processing 3D Secure...';

    setTimeout(() => {
      this.completeOrder('Credit/Debit Card (3D Secure)');
    }, 2000);
  },

  completeOrder(paymentMethod) {
    const cart = window.AFYALISHE_STORE.getCart();
    const orderNumber = `AFY-${Math.floor(10000 + Math.random() * 90000)}`;
    const zone = window.AFYALISHE_STORE.deliveryZones.find((z) => z.id === this.currentZone);

    const confirmationData = {
      orderNumber,
      paymentMethod,
      date: new Date().toLocaleDateString('en-GB'),
      deliveryZone: zone ? zone.name : 'Nairobi Metro',
      items: cart,
    };

    // Store completed order receipt
    localStorage.setItem('afyalishe_latest_order', JSON.stringify(confirmationData));
    window.AFYALISHE_STORE.clearCart();

    // Redirect to confirmation screen
    window.location.href = 'checkout.html?confirmed=1';
  }
};
