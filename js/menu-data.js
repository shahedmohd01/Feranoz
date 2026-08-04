// ============================================================
//  Feranoz Patisserie & Cafe — Complete Real Menu (from Swiggy Video)
//  All images are real photographs extracted directly from menu_video.MP4
// ============================================================

const MENU_DATA = [

  // ─── DESSERTS & CAKES ────────────────────────────────────
  {
    id: 101, category: "desserts", name: "Basque Cheesecake",
    price: 280, image: "images/swiggy_items/basque_cheesecake.jpg",
    description: "Baked cheesecake with a caramelized exterior and rich, soft and creamy center",
    popular: true
  },
  {
    id: 102, category: "desserts", name: "Rocher Cake",
    price: 1600, image: "images/swiggy_items/rocher_cake.jpg",
    description: "Rich hazelnut chocolate mousse cake inspired by Ferrero Rocher",
    popular: true
  },
  {
    id: 103, category: "desserts", name: "Chocolate Noir",
    price: 295, image: "images/swiggy_items/chocolate_noir.jpg",
    description: "Chocolate sponge, Belgian chocolate ganache, 70% chocolate cream",
    popular: true
  },
  {
    id: 104, category: "desserts", name: "Blueberry French Vanilla Cake [1kg]",
    price: 2250, image: "images/swiggy_items/blueberry_vanilla_cake.jpg",
    description: "Layers of french vanilla sponge, blueberry compote & mascarpone cream",
    popular: true
  },
  {
    id: 105, category: "desserts", name: "Belgian Chocolate Cake",
    price: 1400, image: "images/swiggy_items/belgian_chocolate_cake.jpg",
    description: "Rich dark Belgian chocolate fudge cake",
    popular: false
  },
  {
    id: 106, category: "desserts", name: "Chocolate Caramel Fudge Cake",
    price: 1400, image: "images/swiggy_items/chocolate_caramel_fudge_cake.jpg",
    description: "Decadent chocolate sponge layered with creamy caramel fudge",
    popular: true
  },
  {
    id: 107, category: "desserts", name: "Red Velvet Cake",
    price: 200, image: "images/swiggy_items/red_velvet.jpg",
    description: "Red cocoa sponge topped with smooth cream cheese frosting",
    popular: false
  },
  {
    id: 108, category: "desserts", name: "Medovik (Russian Honey Cake)",
    price: 150, image: "images/swiggy_items/medovik.jpg",
    description: "Honey biscuit infused with honey syrup and layered with russian honey creme",
    popular: false
  },
  {
    id: 109, category: "desserts", name: "Blueberry Cheesecake",
    price: 280, image: "images/swiggy_items/blueberry_cheesecake.jpg",
    description: "Creamy baked cheesecake with blueberry coulis",
    popular: false
  },
  {
    id: 110, category: "desserts", name: "Chocolate Caramel Verrine",
    price: 295, image: "images/swiggy_items/chocolate_caramel_verrine.jpg",
    description: "Layered glass dessert with chocolate ganache & salted caramel",
    popular: false
  },
  {
    id: 111, category: "desserts", name: "Chocolate Teacake [300g]",
    price: 300, image: "images/swiggy_items/chocolate_teacake.jpg",
    description: "Belgian chocolate teacake loaf (300 Gms)",
    popular: false
  },
  {
    id: 112, category: "desserts", name: "Mango Cheesecake",
    price: 280, image: "images/swiggy_items/mango_cheesecake.jpg",
    description: "Creamy cheesecake with fresh Alphonso mango coulis",
    popular: true
  },
  {
    id: 113, category: "desserts", name: "Tiramisu",
    price: 295, image: "images/swiggy_items/tiramisu.jpg",
    description: "Classic Italian tiramisu with espresso & mascarpone",
    popular: true
  },
  {
    id: 114, category: "desserts", name: "Vanilla Choux",
    price: 140, image: "images/swiggy_items/vanilla_choux.jpg",
    description: "Choux bun filled with Vanilla diplomat cream & dipped in Vanilla Glaze",
    popular: true
  },
  {
    id: 115, category: "desserts", name: "Opera Cake",
    price: 225, image: "images/swiggy_items/opera_cake.jpg",
    description: "Almond sponge infused with coffee syrup & layered with coffee buttercream and chocolate ganache",
    popular: true
  },
  {
    id: 116, category: "desserts", name: "Spanish Tres Leches",
    price: 250, image: "images/swiggy_items/spanish_tresleches.jpg",
    description: "Moist sponge soaked in three milks, topped with whipped cream",
    popular: false
  },
  {
    id: 117, category: "desserts", name: "Hazelnut Cake",
    price: 280, image: "images/swiggy_items/hazelnut_cake.jpg",
    description: "Light hazelnut sponge layered with hazelnut praline cream",
    popular: false
  },
  {
    id: 118, category: "desserts", name: "Lemon Tart",
    price: 180, image: "images/swiggy_items/lemon_tart.jpg",
    description: "Buttery tart shell filled with bright lemon curd & meringue",
    popular: false
  },
  {
    id: 119, category: "desserts", name: "Choux Pastry",
    price: 140, image: "images/swiggy_items/choux_pastry.jpg",
    description: "Classic light choux filled with vanilla custard cream",
    popular: false
  },
  {
    id: 120, category: "desserts", name: "Macaron (Assorted)",
    price: 450, image: "images/swiggy_items/macaron_assorted.jpg",
    description: "Box of assorted delicate almond meringue shells with ganache",
    popular: true
  },
  {
    id: 121, category: "desserts", name: "Banana Walnut Teacake [300g]",
    price: 300, image: "images/swiggy_items/banana_walnut_teacake.jpg",
    description: "Banana walnut teacake loaf (300 Gms)",
    popular: false
  },
  {
    id: 122, category: "desserts", name: "Vanilla Teacake [300g]",
    price: 300, image: "images/swiggy_items/vanilla_teacake.jpg",
    description: "Classic vanilla teacake loaf (300 Gms)",
    popular: false
  },
  {
    id: 123, category: "desserts", name: "Walnut Brownie",
    price: 185, image: "images/swiggy_items/walnut_brownie.jpg",
    description: "Fudgy chocolate brownie with crunchy walnut pieces",
    popular: true
  },
  {
    id: 124, category: "desserts", name: "Madeleine",
    price: 120, image: "images/swiggy_items/madeleine.jpg",
    description: "Classic French shell-shaped sponge cake",
    popular: false
  },

  // ─── PIZZAS (12 INCHES) ──────────────────────────────────
  {
    id: 201, category: "pizza", name: "Chicken Fajita Pizza [12 Inches]",
    price: 580, image: "images/swiggy_items/chicken_fajita_pizza.jpg",
    description: "Spiced chicken fajita strips, bell peppers, onions & mozzarella",
    popular: false
  },
  {
    id: 202, category: "pizza", name: "BBQ Chicken Pizza [12 Inches]",
    price: 580, image: "images/swiggy_items/bbq_chicken_pizza.jpg",
    description: "Smoky BBQ sauce, grilled chicken, caramelized onions & cheese",
    popular: true
  },
  {
    id: 203, category: "pizza", name: "Paprika Smoked Chicken Pizza [12 Inches]",
    price: 580, image: "images/swiggy_items/paprika_smoked_chicken_pizza.jpg",
    description: "Smoked paprika chicken, roasted peppers, garlic oil & mozzarella",
    popular: false
  },
  {
    id: 204, category: "pizza", name: "Lamb Pepperoni Pizza [12 Inches]",
    price: 595, image: "images/swiggy_items/lamb_pepperoni_pizza.jpg",
    description: "Crispy lamb pepperoni slices, tomato base, fresh basil & cheese",
    popular: false
  },
  {
    id: 205, category: "pizza", name: "Meat Lovers Pizza [12 Inches]",
    price: 650, image: "images/swiggy_items/meat_lovers_pizza.jpg",
    description: "Loaded with chicken, pepperoni, lamb & three cheese blend",
    popular: true
  },
  {
    id: 206, category: "pizza", name: "Margherita Pizza [12 Inches]",
    price: 490, image: "images/swiggy_items/margherita_pizza.jpg",
    description: "Classic Italian pizza with fresh marinara sauce & mozzarella",
    popular: false
  },
  {
    id: 207, category: "pizza", name: "Mexican Cottage Cheese Pizza [12 Inches]",
    price: 540, image: "images/swiggy_items/mexican_cottage_cheese_pizza.jpg",
    description: "Mexican spiced paneer with jalapeños, peppers & cheese blend",
    popular: false
  },

  // ─── SAVORY / BURGERS / SANDWICHES ───────────────────────
  {
    id: 301, category: "savory", name: "Crunchy Chicken Burger",
    price: 440, image: "images/swiggy_items/crunchy_chicken_burger.jpg",
    description: "Crispy fried chicken patty, special mayo, lettuce & brioche bun",
    popular: true
  },
  {
    id: 302, category: "savory", name: "Chicken Club Sandwich",
    price: 420, image: "images/swiggy_items/chicken_club_sandwich.jpg",
    description: "Toasted club sandwich with grilled chicken, bacon & coleslaw",
    popular: true
  },
  {
    id: 303, category: "savory", name: "Chicken Loaded Fries",
    price: 360, image: "images/swiggy_items/chicken_loaded_fries.jpg",
    description: "Crispy fries loaded with spiced chicken, cheese sauce & jalapeños",
    popular: true
  },
  {
    id: 304, category: "savory", name: "Chicken Wrap",
    price: 380, image: "images/swiggy_items/chicken_wrap.jpg",
    description: "Grilled chicken, fresh vegetables & garlic mayo in a soft flour tortilla",
    popular: false
  },
  {
    id: 305, category: "savory", name: "Almond Croissant",
    price: 220, image: "images/swiggy_items/almond_croissant.jpg",
    description: "Buttery croissant filled with rich almond frangipane & flaked almonds",
    popular: true
  },
  {
    id: 306, category: "savory", name: "Herb Chicken Croissant",
    price: 290, image: "images/swiggy_items/herb_chicken_croissant.jpg",
    description: "Flaky croissant filled with herbed chicken salad",
    popular: false
  },
  {
    id: 307, category: "savory", name: "Southwest Chicken Tenders",
    price: 435, image: "images/swiggy_items/southwest_chicken_tenders.jpg",
    description: "Crispy chicken tenders with southwest spice rub and house dip",
    popular: true
  },
  {
    id: 308, category: "savory", name: "Vegetariana Calzone",
    price: 395, image: "images/swiggy_items/vegetariana_calzone.jpg",
    description: "Italian turnover made with fresh exotic veggies, four cheese house blend",
    popular: false
  },

  // ─── PASTA ───────────────────────────────────────────────
  {
    id: 401, category: "pasta", name: "Veg Parmarosa Pink Sauce Pasta",
    price: 540, image: "images/swiggy_items/veg_parmarosa_pasta.jpg",
    description: "Penne tossed in Alfredo white & Marinara red sauce with seasonal veggies",
    popular: true
  },
  {
    id: 402, category: "pasta", name: "Chicken Penne Pasta",
    price: 580, image: "images/swiggy_items/chicken_penne_pasta.jpg",
    description: "Tender chicken with penne in a rich tomato herb sauce",
    popular: true
  },
  {
    id: 403, category: "pasta", name: "Mushroom Pasta",
    price: 520, image: "images/swiggy_items/mushroom_pasta.jpg",
    description: "Sautéed mixed mushrooms in a creamy garlic white sauce",
    popular: false
  },

  // ─── DRINKS ──────────────────────────────────────────────
  {
    id: 601, category: "drinks", name: "Signature Cold Chocolate",
    price: 375, image: "images/Cold Chocolate.jpg",
    description: "Rich 70% dark Belgian chocolate served chilled with fresh cream",
    popular: true
  },

  {
    id: 602, category: "drinks", name: "Belgian Hot Chocolate",
    price: 295, image: "images/swiggy_items/belgian_hot_chocolate.jpg",
    description: "Velvety steamed milk with premium Belgian chocolate",
    popular: true
  },
  {
    id: 603, category: "drinks", name: "Classic Cold Coffee",
    price: 315, image: "images/swiggy_items/classic_cold_coffee.jpg",
    description: "Chilled espresso blended with rich milk & ice",
    popular: true
  },
  {
    id: 604, category: "drinks", name: "Cappuccino",
    price: 245, image: "images/swiggy_items/cappuccino_classic.jpg",
    description: "Espresso with equal parts steamed and frothed milk",
    popular: false
  },
  {
    id: 605, category: "drinks", name: "Iced Latte",
    price: 295, image: "images/swiggy_items/iced_latte.jpg",
    description: "Espresso poured over ice with cold milk",
    popular: false
  }
];

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "desserts", label: "Cakes & Desserts" },
  { id: "pizza", label: "Gourmet Pizzas" },
  { id: "savory", label: "Burgers & Croissants" },
  { id: "pasta", label: "Pasta" },
  { id: "drinks", label: "Coffee & Drinks" }
];

const FEATURED_IDS = [101, 103, 113, 202, 301, 601];
