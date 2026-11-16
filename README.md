<<<<<<< HEAD
# Afyalishe Wellness LTD — 3D Motion E-Commerce Redesign

> **Brand Identity:** AFYALISHE WELLNESS LTD, Nyeri, Kenya  
> **Tagline:** *"Food as medicine"*  
> **Official Website:** [afyalishewellness.co.ke](https://afyalishewellness.co.ke/)  
> **Deployment Target:** Cloudflare Pages / Static Hosting

---

## 🌿 About The Project

A modern, high-performance, mobile-first redesign of **Afyalishe Wellness**, transforming the online presence into an immersive, tactile, 3D-feeling online flagship store. Inspired by the depth, cursor physics, and buttery motion of [bar-topas.ch](https://bar-topas.ch/), while maintaining an accessible, fast-loading e-commerce experience tailored for Kenya.

### Key Highlights
- **Three.js 3D Hero Scene:** Floating Afyalishe products with realistic 3D mesh rendering and real packaging textures, surrounded by drifting organic ingredients (chia seeds, ruby hibiscus petals, green leaves, granola clusters) and a slow-rotating 3D brand swoosh ring with cursor-driven parallax tilt.
- **Sitewide Cursor Effects:** Lime Green follower dot with elastic trailing ring and contextual labels (`View`, `Add`, `Drag`). Gracefully disabled on touchscreens.
- **Magnetic Buttons:** Primary Lime Green buttons pull toward the cursor within a 60px radius.
- **3D Tilt Cards:** Product cards, category tiles, and stockist cards tilt up to 10° in perspective with moving specular light reflections (`glare`) and reactive drop shadows.
- **Scroll-Driven 360° Showcase:** GSAP ScrollTrigger rotates the cold-pressed Chia Oil bottle 360° as the visitor scrolls through the story.
- **Interactive Single Product Viewer:** Perspective tilt, inertia-based drag-to-rotate, and hover zoom.
- **Kenyan E-Commerce & Logistics:**
  - Standardized delivery zones: Nairobi Metro (KES 350), Nyeri & Central (KES 250), Rest of Kenya (KES 450).
  - Simulated **M-Pesa STK Push** with phone prompt dialog, Paybill instructions, and Card payments.
  - One-click **WhatsApp Direct Order** routing pre-filled orders to `+254 759 561657`.
  - Comprehensive stockist directory across 10 Kenyan towns (Nyeri, Nairobi, Juja, Nyahururu, Nanyuki, Naromoru, Meru, Embu, Mweiga, Chaka).

---

## 📦 Product Catalog (11 Products Across 4 Ranges)

| Category | Products | Sizes & Variations |
| :--- | :--- | :--- |
| **Probiotic Drinks & Dairy** | Yacon Probiotic Immune Boost | 250ml, 500ml |
| | Yacon Probiotic Syrup Kefir (Dairy-Free, Vegan) | 500ml, 1L |
| | Chia Yoghurt | 250ml to 5L • Mango, Vanilla, Strawberry, Natural |
| **Chia Range** | Chia Seeds | 100g, 200g, 500g |
| | Chia Oil (Virgin Cold-Pressed) | 30ml, 60ml, 100ml |
| | Chia Uji Porridge Flour | 500g, 1kg |
| **Hibiscus & Herbal Teas** | Hibiscus Herbal Blend Teabags | 50g (25 teabags) |
| | Hibiscus Dried Flowers | 100g |
| | Hibiscus Powder | 100g, 200g |
| **Snacks & Supplements** | Granola *(Allergen: Contains groundnuts)* | 100g, 200g, 400g |
| | Yacon Inulin Capsules | 40-capsule pack |

---

## 🎨 Brand Design Tokens & Strict Typography

Declared once in [`assets/css/variables.css`](assets/css/variables.css) and reused across the entire design system:

- **Deep Leaf Green (`#589038`):** Primary branding, footer, logo rings.
- **Fresh Lime Green (`#7AC143`):** Primary action buttons, active highlights, hover glows.
- **Catalogue Green (`#67901B` / `#71A21E`):** Flavour markers, lines.
- **Warm Terracotta (`#BE7133`):** *"Food as medicine"* tagline, suggested use callouts.
- **Warm Cream (`#F0EBE9`):** Page background.
- **Fonts:** League Spartan (Headings/Buttons), Hanken Grotesk (Body/Forms/Nav), Lora (Quotes/Taglines), Caveat (Callout badges).

---

## ⚙️ Motion Configuration (`assets/js/motion-config.js`)

All 3D motion and cursor physics are modular and can be fine-tuned or toggled from a single file:

```javascript
window.AFYALISHE_MOTION_CONFIG = {
  enabled: true,                         // Master switch
  customCursor: {
    enabled: true,
    dotColor: '#7AC143',
    damping: 0.18,                       // Spring responsiveness
    hideOnTouch: true                    // Auto-disable on touch devices
  },
  magneticButtons: {
    enabled: true,
    radius: 60,                          // Attraction distance in px
    intensity: 0.35                      // Pull strength
  },
  cardTilt: {
    enabled: true,
    maxTiltAngle: 10,                    // Max degrees of tilt
    glare: true,                         // Specular light reflection
    glareOpacity: 0.38
  },
  heroScene: {
    enabled: true,
    maxTiltAngle: 12,                    // Max degrees scene tilts toward cursor
    lerpDamping: 0.05,                   // Smooth interpolation factor
    rotationSpeedRing: 0.003,            // Logo swoosh ring rotation
    maxPixelRatio: 2,                    // Capped for mobile GPU optimization
    pauseOffscreen: true                 // Auto-pause with IntersectionObserver
  }
};
```

---

## 🚀 Cloudflare Pages Deployment

This repository is ready for instant deployment to Cloudflare Pages:
- `_redirects`: Clean URL routes (`/shop`, `/about`, `/services`, etc.).
- `_headers`: Strict security headers and 1-year immutable caching for 3D textures, images, and vendor libraries.

1. Connect this GitHub repository in the **Cloudflare Dashboard** under **Workers & Pages**.
2. Framework preset: **None** (Static HTML).
3. Build command: *(leave empty)*.
4. Build output directory: `/`.
5. Under **Custom domains**, attach `afyalishewellness.co.ke`.

---

## 📁 Repository Structure

```
.
├── index.html                   # Master homepage with Three.js 3D scene & 360 showcase
├── shop.html                    # 11-Product catalog with live category & size filters
├── product.html                 # Interactive 3D / zoom / drag-to-rotate product view
├── where-to-buy.html            # Retail stockists directory filterable by Kenyan town
├── services.html                # 5 Nutritional services with booking modal
├── about.html                   # Brand story & Dr. Monica video embed
├── blog.html                    # 6 Authentic health & prebiotic articles
├── contact.html                 # Direct contact info, Nyeri P.O. Box & form
├── checkout.html                # Kenyan delivery zones & simulated M-Pesa STK push
├── privacy-terms.html           # Kenya Data Protection Act 2019 & shipping policies
├── _headers                     # Cloudflare caching and security headers
├── _redirects                   # Clean URL routing rules
├── assets/
│   ├── css/
│   │   ├── variables.css        # Brand color tokens & typography scale
│   │   ├── base.css             # Base reset, typography, utilities
│   │   ├── components.css       # Header, footer, cards, drawers, buttons
│   │   ├── 3d-motion.css        # Cursor, tilt cards, WebGL container
│   │   └── pages.css            # Page-specific layouts
│   ├── js/
│   │   ├── motion-config.js     # Master motion settings tuning file
│   │   ├── custom-cursor.js     # Lime follower dot & elastic ring
│   │   ├── magnetic-btn.js      # Magnetic button attraction
│   │   ├── tilt-card.js         # 3D tilt with specular light reflection
│   │   ├── hero-scene.js        # Three.js 3D WebGL hero scene
│   │   ├── scroll-showcase.js   # GSAP ScrollTrigger 360° bottle showcase
│   │   ├── product-viewer-3d.js # Interactive 3D single product viewer
│   │   ├── store.js             # 11 products, variations, stockists, cart state
│   │   ├── checkout.js          # M-Pesa STK simulation & delivery calculation
│   │   ├── ui.js                # Drawer, modal, cookie banner, toast alerts
│   │   └── main.js              # Page router & motion re-binding
│   ├── products/                # 11 Real product photos
│   ├── images/                  # Real brand logo
│   └── vendor/                  # Three.js r128, GSAP 3.12.5, ScrollTrigger
```

---

## 📞 Company Contact

- **Company:** AFYALISHE WELLNESS LTD
- **Address:** P.O. Box 2579-10100, Nyeri, Kenya
- **Phone:** +254 759 561657 | +254 100 901170 | +254 714 915397
- **Email:** info@afyalishewellness.co.ke
- **WhatsApp:** [+254 759 561657](https://wa.me/254759561657)
- **Copyright:** &copy; 2026 AFYALISHE WELLNESS LTD. All rights reserved.
=======
# Afyalishe-website
Developing a website for afyalishe wellness
>>>>>>> 6900a139d5445a26f168692cb2200cdcf5aa9a3a
