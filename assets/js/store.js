/**
 * AFYALISHE WELLNESS - STORE & PRODUCT DATA SYSTEM
 * Complete database of 11 products, categories, variations, stockists, and cart state
 */

window.AFYALISHE_STORE = {
  currency: 'KES',
  whatsappNumber: '254759561657',
  contactPhonePrimary: '+254 759 561657',
  contactPhones: ['+254 759 561657', '+254 100 901170', '+254 714 915397'],
  contactEmail: 'info@afyalishewellness.co.ke',
  postalAddress: 'P.O. Box 2579-10100, Nyeri, Kenya',

  categories: [
    { id: 'all', name: 'All Products' },
    { id: 'probiotic-drinks-dairy', name: 'Probiotic Drinks & Dairy' },
    { id: 'chia-range', name: 'Chia Range' },
    { id: 'hibiscus-herbal-teas', name: 'Hibiscus & Herbal Teas' },
    { id: 'snacks-supplements', name: 'Snacks & Supplements' },
  ],

  // ALL 11 EXACT PRODUCTS WITH VARIATIONS
  products: [
    // 1. Probiotic Drinks & Dairy
    {
      id: 'yacon-probiotic-immune-boost',
      name: 'Yacon Probiotic Immune Boost',
      category: 'probiotic-drinks-dairy',
      categoryName: 'Probiotic Drinks & Dairy',
      sizes: ['250ml', '500ml'],
      flavours: [],
      priceText: 'Price on request / WhatsApp to order',
      priceNumeric: null,
      image: 'assets/products/yacon-probiotic-immune-boost.jpg',
      badge: 'Gut & Immunity',
      description: 'This drink is made by fermenting Yacon, a root vegetable that is rich in fiber and prebiotics. Great for digestive health and overall immunity.',
      suggestedUse: 'Drink directly or mix with smoothies',
      highlights: [
        'Rich in fiber and prebiotic FOS',
        'Supports healthy gut microbiome',
        '100% natural slow fermentation',
        'Free from artificial additives & preservatives'
      ],
      details: 'Fermented naturally using traditional artisanal cultures and nutrient-rich Kenyan yacon roots. Rich in fructooligosaccharides (FOS) which nourish beneficial gut bacteria without spiking blood sugar.'
    },
    {
      id: 'yacon-probiotic-syrup-kefir',
      name: 'Yacon Probiotic Syrup Kefir',
      category: 'probiotic-drinks-dairy',
      categoryName: 'Probiotic Drinks & Dairy',
      sizes: ['500ml', '1L'],
      flavours: [],
      priceText: 'Price on request / WhatsApp to order',
      priceNumeric: null,
      image: 'assets/products/yacon-probiotic-syrup-kefir.jpg',
      badge: 'Dairy-Free & Vegan',
      description: 'A dairy free vegan friendly alternative to traditional kefir with live cultures and yacon syrup. Yacon syrup is a natural source of FOS, a prebiotic fiber that feeds healthy gut bacteria. Supports digestive wellness and overall immunity.',
      suggestedUse: 'Drink directly or mix with smoothies',
      highlights: [
        'Dairy-free & vegan-friendly',
        'Live active kefir microflora',
        'Natural source of prebiotic FOS',
        'Supports digestive wellness & immunity'
      ],
      details: 'Crafted for those seeking authentic water/syrup kefir benefits without dairy. Delivers billions of living probiotic organisms alongside organic yacon syrup.'
    },
    {
      id: 'chia-yoghurt',
      name: 'Chia Yoghurt',
      category: 'probiotic-drinks-dairy',
      categoryName: 'Probiotic Drinks & Dairy',
      sizes: ['250ml', '500ml', '1L', '2L', '5L'],
      flavours: ['Mango', 'Vanilla', 'Strawberry', 'Natural'],
      priceText: 'Price on request / WhatsApp to order',
      priceNumeric: null,
      image: 'assets/products/chia-yoghurt.jpg',
      badge: 'Probiotic + Omega-3',
      description: 'Combining the goodness of chia seeds with that of rich, probiotic yoghurt to make a filling, tasty and nutrition packed drink.',
      suggestedUse: 'Smoothies, mix with muesli or granola, porridge',
      highlights: [
        'Available in Mango, Vanilla, Strawberry & Natural',
        'Rich in probiotics and bioavailable calcium',
        'Packed with omega-3 fatty acids from soaked chia',
        'Thick, velvety, nutrition-dense formula'
      ],
      details: 'A signature Afyalishe favourite blending freshly cultured probiotic yoghurt with suspended, soaked chia seeds for sustained energy and gut comfort.'
    },

    // 2. Chia Range
    {
      id: 'chia-seeds',
      name: 'Chia Seeds',
      category: 'chia-range',
      categoryName: 'Chia Range',
      sizes: ['100g', '200g', '500g'],
      flavours: [],
      priceText: 'Price on request / WhatsApp to order',
      priceNumeric: null,
      image: 'assets/products/chia-seeds.jpg',
      badge: 'Superfood Seeds',
      description: 'Chia seeds are packed with health benefits; Omega-3, calcium, iron, magnesium, zinc, vitamin B1 and B2. They’re great for maintaining a healthy heart, bones, joints and digestive system.',
      suggestedUse: 'Soak overnight in water and drink',
      highlights: [
        'Highest plant source of omega-3 (ALA)',
        'Rich in dietary fiber, iron & magnesium',
        'Great for joint mobility and heart health',
        '100% pure pesticide-free Kenyan harvest'
      ],
      details: 'Carefully sorted and cleaned raw whole chia seeds. Creates a gentle mucilage gel when soaked, aiding slow digestion, hydration, and prolonged satiety.'
    },
    {
      id: 'chia-oil',
      name: 'Chia Oil',
      category: 'chia-range',
      categoryName: 'Chia Range',
      sizes: ['30ml', '60ml', '100ml'],
      flavours: [],
      priceText: 'Price on request / WhatsApp to order',
      priceNumeric: null,
      image: 'assets/products/chia-oil.jpg',
      badge: 'Cold Pressed Virgin',
      description: 'Chia seeds contain the most Omega-3 of any plant source. Chia seed oil offers a range of health and beauty benefits due to its rich content of omega-3 fatty acids (especially heart friendly alpha-linolenic acid or ALA), antioxidants, and essential nutrients.',
      suggestedUse: 'Consume one tablespoon daily',
      highlights: [
        'Over 60% Alpha-Linolenic Acid (ALA Omega-3)',
        'Cold-pressed virgin extraction without heat',
        'Dual benefit: daily consumption or skin/hair serum',
        'Rich in natural antioxidants'
      ],
      details: 'Extracted in small artisan batches in Nyeri using hydraulic cold-press technology to protect delicate heat-sensitive polyunsaturated fatty acids.'
    },
    {
      id: 'chia-uji',
      name: 'Chia Uji porridge flour',
      category: 'chia-range',
      categoryName: 'Chia Range',
      sizes: ['500g', '1kg'],
      flavours: [],
      priceText: 'Price on request / WhatsApp to order',
      priceNumeric: null,
      image: 'assets/products/chia-uji.jpg',
      badge: 'Whole Grain Porridge',
      description: 'This nutrient dense porridge flour contains all the benefits of chia seeds; calcium, protein, dietary fiber, zinc and magnesium. It is a filling well balanced meal for the whole family.',
      suggestedUse: 'Cook and consume like regular porridge',
      highlights: [
        'Milled with heritage sorghum, millet & chia',
        'Balanced complex carbohydrates & dietary fiber',
        'High in natural zinc, calcium & plant protein',
        'Nourishing breakfast for adults and growing children'
      ],
      details: 'A modern nutrient-dense tribute to traditional Kenyan porridge. Provides sustained low-glycaemic morning fuel without energy crashes.'
    },

    // 3. Hibiscus & Herbal Teas
    {
      id: 'hibiscus-herbal-blend',
      name: 'Hibiscus Herbal Blend teabags',
      category: 'hibiscus-herbal-teas',
      categoryName: 'Hibiscus & Herbal Teas',
      sizes: ['50g (25 teabags)'],
      flavours: [],
      priceText: 'Price on request / WhatsApp to order',
      priceNumeric: null,
      image: 'assets/products/hibiscus-herbal-blend.jpg',
      badge: 'Herbal Infusion',
      description: 'These teabags are a refreshing blend of hibiscus, rosemary and lemongrass. They offer an unrivaled aroma that relaxes the body and mind, while boosting immunity.',
      suggestedUse: 'Add a teabag to a cup of hot water, brew for 5 minutes and enjoy',
      highlights: [
        'Hibiscus, rosemary and fresh lemongrass',
        'Rich in anthocyanins and vitamin C',
        'Naturally caffeine-free calming ritual',
        '25 unbleached pyramid teabags per pack'
      ],
      details: 'An exquisite aromatic infusion combining tart ruby hibiscus calyxes with garden rosemary and uplifting lemongrass for cardiovascular and immune support.'
    },
    {
      id: 'hibiscus-dried-flowers',
      name: 'Hibiscus Dried Flowers',
      category: 'hibiscus-herbal-teas',
      categoryName: 'Hibiscus & Herbal Teas',
      sizes: ['100g'],
      flavours: [],
      priceText: 'Price on request / WhatsApp to order',
      priceNumeric: null,
      image: 'assets/products/hibiscus-dried-flowers.jpg',
      badge: 'Whole Roselle Calyxes',
      description: 'Hibiscus flowers offer a wide range of health benefits; from being rich in antioxidants, to maintaining a healthy heart and aiding digestion.',
      suggestedUse: 'As a herbal tea or infused in drinking water',
      highlights: [
        '100% whole sun-dried roselle calyxes',
        'Deep ruby-red tart infusion (hot or iced)',
        'Great for blood pressure & heart health support',
        'Rich natural organic acids & polyphenols'
      ],
      details: 'Whole dried calyxes sourced directly from smallholder farms in Kenya. Yields a deeply coloured, tangy herbal beverage packed with bioflavonoids.'
    },
    {
      id: 'hibiscus-powder',
      name: 'Hibiscus Powder',
      category: 'hibiscus-herbal-teas',
      categoryName: 'Hibiscus & Herbal Teas',
      sizes: ['100g', '200g'],
      flavours: [],
      priceText: 'Price on request / WhatsApp to order',
      priceNumeric: null,
      image: 'assets/products/hibiscus-powder.jpg',
      badge: 'Culinary & Botanical',
      description: 'Hibiscus flowers offer a wide range of health benefits; from being rich in antioxidants, to maintaining a healthy heart and aiding digestion.',
      suggestedUse: 'Add to ready food, salads or baked goods. Mix with water to make a hair or face masque.',
      highlights: [
        'Finely ground pure roselle powder',
        'Versatile: drinks, smoothie bowls, dressings, baking',
        'Natural botanical beauty: face masque & hair rinse',
        'Supports heart health and radiant skin'
      ],
      details: 'Micro-milled from whole dried hibiscus to preserve delicate active botanical compounds. Adds brilliant natural ruby color and tangy zest to recipes.'
    },

    // 4. Snacks & Supplements
    {
      id: 'granola',
      name: 'Granola',
      category: 'snacks-supplements',
      categoryName: 'Snacks & Supplements',
      sizes: ['100g', '200g', '400g'],
      flavours: [],
      allergenWarning: 'Contains groundnuts',
      priceText: 'Price on request / WhatsApp to order',
      priceNumeric: null,
      image: 'assets/products/granola.jpg',
      badge: 'Artisan Crunch',
      description: 'A combination of plantain, pumpkin seeds and groundnuts, this healthy snack offers a rich source of fiber and zinc.',
      suggestedUse: 'Snack directly or add yoghurt for a healthy delicious breakfast meal.',
      highlights: [
        'Crunchy plantain crisps & raw pumpkin seeds',
        'Rich source of dietary fiber and natural zinc',
        'Allergen notice: Contains groundnuts',
        'No artificial sweeteners or hydrogenated fats'
      ],
      details: 'Slow-baked with natural spices, crisp plantain, roasted groundnuts, and zinc-rich pumpkin seeds. Irresistible on its own or stirred into Chia Yoghurt.'
    },
    {
      id: 'yacon-inulin-capsules',
      name: 'Yacon Inulin Capsules',
      category: 'snacks-supplements',
      categoryName: 'Snacks & Supplements',
      sizes: ['40-capsule pack'],
      flavours: [],
      priceText: 'Price on request / WhatsApp to order',
      priceNumeric: null,
      image: 'assets/products/yacon-inulin-capsules.jpg',
      badge: 'Daily Prebiotic',
      description: 'Yacon Inulin is packed with dietary fiber to support gut health and overall immunity.',
      suggestedUse: 'Take two capsules daily',
      highlights: [
        'Concentrated prebiotic inulin from fresh yacon',
        'Nourishes healthy bifidobacteria & lactobacilli',
        'Supports gentle digestive regularity',
        'Vegetable capsule shells, 40 capsules per bottle'
      ],
      details: 'Convenient daily prebiotic support for travellers and busy lifestyles. Helps maintain optimal digestive flora and colon health every day.'
    }
  ],

  // STOCKISTS (Show store name and town only, no PINs or personal phones)
  stockists: [
    { town: 'Nyeri', stores: ['Chieni', 'Chieni Downtown', 'Centralmart', 'Carrymore', 'Siel', 'Dekutes'] },
    { town: 'Nyahururu', stores: ['JMart Bargain', 'Shirikisho'] },
    { town: 'Nanyuki', stores: ['Chieni Metro', 'Siel', 'Roadmap Group'] },
    { town: 'Naromoru', stores: ['Noble'] },
    { town: 'Meru', stores: ['Bei Sawa'] },
    { town: 'Embu', stores: ['Cylet'] },
    { town: 'Mweiga', stores: ['Siel'] },
    { town: 'Juja', stores: ['Lakewood Mini Mart', 'Ecomatt', 'Alkins', 'County', 'Tea Depot'] },
    { town: 'Nairobi', stores: ['Mkulima', 'Jambo', 'Skyhome'] },
    { town: 'Chaka', stores: ['Yeston'] },
  ],

  // SERVICES
  services: [
    {
      id: 'nutritional-consulting',
      title: 'Nutritional Consulting',
      icon: 'heart-pulse',
      tagline: 'Evidence-based functional dietary guidance',
      description: 'Personalized nutritional evaluations rooted in the philosophy of food as medicine. Our certified nutrition specialists collaborate with you to address gut sensitivities, energy dips, and holistic metabolic wellness.',
      deliverables: ['Comprehensive dietary analysis', 'Gut microbiome nourishment protocol', 'Ongoing progress monitoring']
    },
    {
      id: 'product-development',
      title: 'Product Development',
      icon: 'flask-round',
      tagline: 'Formulating innovative functional foods',
      description: 'Consultancy for food producers, bakeries, and beverage startups looking to incorporate functional botanicals like yacon inulin, chia seed gel, and hibiscus extracts without artificial additives.',
      deliverables: ['Formulation & stability testing', 'Ingredient sourcing from Kenyan growers', 'Label compliance and nutritional profiling']
    },
    {
      id: 'workshops-education',
      title: 'Workshops & Education',
      icon: 'graduation-cap',
      tagline: 'Empowering communities through practical knowledge',
      description: 'Interactive corporate wellness workshops, school nutrition sessions, and community masterclasses on fermentation, dietary prebiotics, and natural wholesome cooking.',
      deliverables: ['Hands-on fermentation demos', 'Corporate wellness packages', 'Educational takeaway guides']
    },
    {
      id: 'wellness-retreats',
      title: 'Wellness Retreats',
      icon: 'mountain-sun',
      tagline: 'Immersive restorative experiences around Mt. Kenya',
      description: 'Guided weekend escapes set against the foothills of Mount Kenya and the Aberdares. Reset your digestive system with farm-fresh organic meals, guided nature walks, mindful meditation, and gut-health workshops.',
      deliverables: ['Organic chef-prepared functional meals', 'Expert wellness coaching', 'Serene natural setting']
    },
    {
      id: 'customized-meal-plans',
      title: 'Customized Meal Plans',
      icon: 'utensils',
      tagline: 'Tailored weekly recipes for your family',
      description: 'Nutritious, easy-to-follow meal plans incorporating affordable, locally available Kenyan whole foods, fortified with chia, prebiotic fibres, and herbal teas.',
      deliverables: ['Weekly shopping lists with local market staples', 'Quick 30-minute balanced recipes', 'Kid-friendly healthy snack ideas']
    }
  ],

  // BLOG ARTICLES (Authentic Afyalishe Content)
  blogPosts: [
    {
      id: 'yacon-supporting-gut-health',
      title: 'Yacon: Supporting Gut Health Through Probiotics, Prebiotics and Better Glycaemic Balance',
      date: 'November 2026',
      readTime: '4 min read',
      excerpt: 'Discover why yacon root is nature’s prebiotic miracle. Packed with fructooligosaccharides (FOS), it feeds beneficial gut flora without spiking glucose levels.',
      category: 'Gut Health',
      image: 'assets/products/yacon-probiotic-immune-boost.jpg'
    },
    {
      id: 'chia-uji-sorghum-millet',
      title: 'Chia Uji Flour: A Nutritious Blend of Sorghum, Millet and Chia Seeds',
      date: 'October 2026',
      readTime: '3 min read',
      excerpt: 'Revitalizing the traditional Kenyan breakfast. How combining ancient grains with omega-3-packed chia seeds creates sustained morning stamina for all ages.',
      category: 'Family Nutrition',
      image: 'assets/products/chia-uji.jpg'
    },
    {
      id: 'chia-oil-plant-omega-3',
      title: 'Chia Oil: A Plant-Based Source of Omega-3 for Everyday Wellness',
      date: 'September 2026',
      readTime: '5 min read',
      excerpt: 'Chia oil contains the highest plant-based concentration of ALA omega-3. Learn how a daily spoonful supports cardiovascular flexibility and glowing skin.',
      category: 'Healthy Fats',
      image: 'assets/products/chia-oil.jpg'
    },
    {
      id: 'chia-yoghurt-probiotics-nutrition',
      title: 'Chia Yoghurt: A Delicious Combination of Probiotics, Chia and Everyday Nutrition',
      date: 'August 2026',
      readTime: '4 min read',
      excerpt: 'The symbiotic power of live active cultures combined with soaked chia fiber. Why this creamy functional yoghurt is the ultimate afternoon restorative.',
      category: 'Probiotics',
      image: 'assets/products/chia-yoghurt.jpg'
    },
    {
      id: 'understanding-prebiotics-probiotics',
      title: 'Understanding Why Your Gut Needs Both Prebiotics and Probiotics',
      date: 'July 2026',
      readTime: '6 min read',
      excerpt: 'Probiotics are the good bacteria; prebiotics are the food that keeps them thriving. Here is how synbiotics transform everyday digestion and vitality.',
      category: 'Science & Wellness',
      image: 'assets/products/yacon-probiotic-syrup-kefir.jpg'
    },
    {
      id: 'food-as-medicine-everyday-wellness',
      title: 'Why Choose "Food as Medicine"? The Power of Food in Everyday Wellness',
      date: 'June 2026',
      readTime: '5 min read',
      excerpt: 'Our founding philosophy: nature provides the most potent preventative nourishment. How intentional daily dietary choices build lasting resilience.',
      category: 'Philosophy',
      image: 'assets/products/hibiscus-dried-flowers.jpg'
    }
  ],

  // KENYAN DELIVERY ZONES
  deliveryZones: [
    { id: 'nairobi', name: 'Nairobi Metro (Same / Next Day)', fee: 350, turnaround: '24 hours' },
    { id: 'nyeri-central', name: 'Nyeri & Central Kenya (Local Courier)', fee: 250, turnaround: '12-24 hours' },
    { id: 'rest-of-kenya', name: 'Rest of Kenya (Parcel Courier / Matatu Service)', fee: 450, turnaround: '24-48 hours' }
  ],

  // ------------------------------------------------------------------------
  // CART STATE & OPERATIONS
  // ------------------------------------------------------------------------
  getCart() {
    try {
      const stored = localStorage.getItem('afyalishe_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  saveCart(cart) {
    try {
      localStorage.setItem('afyalishe_cart', JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } }));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  },

  addToCart(productId, size = null, flavour = null, quantity = 1) {
    const product = this.products.find((p) => p.id === productId);
    if (!product) return;

    const chosenSize = size || (product.sizes.length ? product.sizes[0] : 'Standard');
    const chosenFlavour = flavour || (product.flavours.length ? product.flavours[0] : null);

    const cart = this.getCart();
    const existingIndex = cart.findIndex(
      (item) => item.id === productId && item.size === chosenSize && item.flavour === chosenFlavour
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        image: product.image,
        size: chosenSize,
        flavour: chosenFlavour,
        quantity: quantity,
        priceText: product.priceText,
      });
    }

    this.saveCart(cart);
    return cart;
  },

  updateQuantity(index, delta) {
    const cart = this.getCart();
    if (cart[index]) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      this.saveCart(cart);
    }
  },

  removeFromCart(index) {
    const cart = this.getCart();
    if (cart[index]) {
      cart.splice(index, 1);
      this.saveCart(cart);
    }
  },

  clearCart() {
    this.saveCart([]);
  },

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  // Generates a pre-filled WhatsApp link for direct ordering or product inquiry
  getWhatsAppOrderLink(itemOrCart, customerNotes = '') {
    const phone = this.whatsappNumber;
    let message = 'Hello Afyalishe Wellness,\nI would like to place an order / request pricing for:\n\n';

    if (Array.isArray(itemOrCart)) {
      if (itemOrCart.length === 0) {
        message += 'I am interested in exploring your natural wellness products.\n';
      } else {
        itemOrCart.forEach((item, idx) => {
          message += `${idx + 1}. *${item.name}*\n`;
          if (item.size) message += `   Size: ${item.size}\n`;
          if (item.flavour) message += `   Flavour: ${item.flavour}\n`;
          message += `   Quantity: ${item.quantity}\n\n`;
        });
      }
    } else if (itemOrCart && itemOrCart.name) {
      message += `*${itemOrCart.name}*\n`;
      if (itemOrCart.size) message += `Size: ${itemOrCart.size}\n`;
      if (itemOrCart.flavour) message += `Flavour: ${itemOrCart.flavour}\n`;
      if (itemOrCart.quantity) message += `Quantity: ${itemOrCart.quantity}\n`;
    }

    if (customerNotes) {
      message += `Note: ${customerNotes}\n`;
    }
    message += '\nPlease confirm availability and delivery to my location in Kenya. Thank you!';

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }
};
