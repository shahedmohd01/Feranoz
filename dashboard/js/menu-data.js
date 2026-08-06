// ============================================================
//  Feranoz Patisserie & Cafe — Complete Real Menu Dataset (100 Items)
//  Extracted from Swiggy & Real Photo Library
// ============================================================

// ── Cafe Configuration (Location, Tables, Auth) ───────────────
const CAFE_CONFIG = {
  // Real cafe coordinates — Feranoz, Road No 7, Banjara Hills, Hyderabad
  lat: 17.4241,
  lng: 78.4449,

  // Test/owner location — used during development to bypass strict geo check
  // (user's current test location: https://maps.app.goo.gl/34Qay1yVN4iWnuSk7)
  testLat: 17.4730431,
  testLng: 78.4895939,
  testLocationName: 'Test Location (Owner Device)',

  // Radius in meters around the real cafe within which ordering is allowed
  radiusMeters: 400,

  // Set to true to bypass geolocation check entirely during development
  testModeEnabled: false,

  // Total number of dine-in tables shown in the ordering modal
  totalTables: 10,

  // Owner dashboard passcode
  dashboardPassword: 'feranoz2024'
};

const MENU_DATA = [
  {
    "id": 101,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Red Velvet",
    "price": 200,
    "image": "images/menu/Desserts/Red Velvet.png",
    "description": "Red cocoa sponge topped with cream cheese frosting",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 102,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Basque Cheesecake",
    "price": 280,
    "image": "images/menu/Desserts/Basque Cheesecake.jpg",
    "description": "Baked cheesecake with a caramelized exterior and rich, soft and creamy center",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 103,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Fruit Danish",
    "price": 280,
    "image": "images/menu/Desserts/Fruit Danish.jpg",
    "description": "Flaky laminated Danish filled with vanilla pastry cream, berry compote & topped with seasonal fresh fruits",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 104,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Honey Almond Frangipane Cake",
    "price": 220,
    "image": "images/menu/Desserts/Honey Almond Frangipane Cake.jpg",
    "description": "A moist, buttery almond cake infused with honey & topped with slivered Almonds",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 105,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Medovik",
    "price": 150,
    "image": "images/menu/Desserts/Medovik.png",
    "description": "Honey biscuit infused with honey syrup and layered with russian honey creme",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 106,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Vanilla Choux",
    "price": 140,
    "image": "images/menu/Desserts/Vanilla Choux.png",
    "description": "Choux bun filled with Vanilla diplomat cream & dipped in Vanilla Glaze",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 107,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Tiramisu",
    "price": 210,
    "image": "images/menu/Desserts/Tiramisu.png",
    "description": "Coffee infused italian savoiardi biscuit assembled with italian mascarpone cream & cocoa powder",
    "isVeg": false,
    "popular": true
  },
  {
    "id": 108,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Chocolate Eclair",
    "price": 220,
    "image": "images/menu/Desserts/Chocolate Eclair.png",
    "description": "Choux pastry filled with chocolate diplomat cream and glazed with chocolate",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 109,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Salted Caramel Eclair",
    "price": 220,
    "image": "images/menu/Desserts/Salted Caramel Eclair.png",
    "description": "Choux Pastry Filled With Salted Caramel Cream & Glazed With Caramel Glaze.",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 110,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Rocher",
    "price": 280,
    "image": "images/menu/Desserts/Rocher.png",
    "description": "Hazelnut chocolate mousse, hazelnut french biscuit, chocolate sponge, chocolate crunchy base and hazelnut gourmand glaze.",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 111,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Opera",
    "price": 225,
    "image": "images/menu/Desserts/Opera.png",
    "description": "Almond sponge infused with coffee syrup & layered with coffee butter cream and chocolate ganache",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 112,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Spanish Tresleches",
    "price": 220,
    "image": "images/menu/Desserts/Spanish Tresleches.png",
    "description": "Vanilla sponge soaked in 3 kinds of milk, pared with fresh Berry compote",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 113,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Chocolate Noir",
    "price": 295,
    "image": "images/menu/Desserts/Chocolate Noir.png",
    "description": "Chocolate sponge, 55% Belgian chocolate ganache, 70% chocolate cream, chocolate diplomat cream",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 114,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Blueberry Cheesecake",
    "price": 280,
    "image": "images/menu/Desserts/Blueberry Cheesecake.JPG",
    "description": "New york styled cheesecake on crunchy biscuit base and topped with blueberry tourbillon & fresh blueberries",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 115,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Lemon Cheesecake",
    "price": 280,
    "image": "images/menu/Desserts/Lemon Cheesecake.png",
    "description": "Classic New York baked cheesecake on a crunchy biscuit base, paired with Lemon Curd",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 116,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Lotus Biscoff Cheesecake",
    "price": 280,
    "image": "images/menu/Desserts/Lotus Biscoff Cheesecake.png",
    "description": "",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 117,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Paris Brest",
    "price": 290,
    "image": "images/menu/Desserts/Paris Brest.png",
    "description": "Choux pastry layered with Hazelnut chocolate cream & crunchy hazelnut.",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 118,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Chocolate Caramel Verrine",
    "price": 295,
    "image": "images/menu/Desserts/Chocolate Caramel Verrine.png",
    "description": "Milk chocolate cream, soft caramel whipped ganache, biscuit crumble, chocolate sponge",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 119,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Chocolate Tart",
    "price": 235,
    "image": "images/menu/Desserts/Chocolate Tart.png",
    "description": "Sable start shell filled with Belgian Chocolate Ganache & finished with chocolate decor.",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 120,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Brownie Box Of 6",
    "price": 450,
    "image": "images/menu/Desserts/Brownie Box Of 6.png",
    "description": "6 Pcs of our signature brownies in a box",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 121,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Brownie Box Of 12",
    "price": 900,
    "image": "images/menu/Desserts/Brownie Box Of 12.png",
    "description": "12 pcs of our signature brownie in a premium box",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 122,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Macaron Box Of 5",
    "price": 450,
    "image": "images/menu/Desserts/Macaron Box Of 5.png",
    "description": "Assorted box of macaron: chocolate, coffee, caramel, mango, raspberry",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 123,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Banana Walnut Teacake [300 grams]",
    "price": 300,
    "image": "images/menu/Desserts/Banana Walnut Teacake [300 grams].png",
    "description": "Banana walnut teacake loaf (300 Gms)",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 124,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Vanilla Teacake (300 Gms)",
    "price": 300,
    "image": "images/menu/Desserts/Vanilla Teacake (300 Gms).png",
    "description": "Vanilla Teacake loaf.",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 125,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Chocolate Teacake [300 grams]",
    "price": 300,
    "image": "images/menu/Desserts/Chocolate Teacake [300 grams].png",
    "description": "Belgian chocolate teacake loaf (300 Gms)",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 126,
    "category": "desserts",
    "categoryDir": "Desserts",
    "name": "Dulce Banana",
    "price": 210,
    "image": "images/menu/Desserts/Dulce Banana.png",
    "description": "Banana mousse, dulce de leche, moist banana sponge, crunchy biscuit base",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 127,
    "category": "cakes",
    "categoryDir": "Cakes",
    "name": "Chocolate Caramel Fudge Cake",
    "price": 1400,
    "image": "images/menu/Cakes/Chocolate Caramel Fudge Cake.png",
    "description": "A medley of Chocolate & Caramel, this rich cake uses chocolate sponge layered with Chocolate ganache & Caramel frosting & topped with Soft Caramel. This item is customizable.",
    "isVeg": true,
    "popular": true
  },
  {
    "id": 128,
    "category": "cakes",
    "categoryDir": "Cakes",
    "name": "Russian Medovik Cake [800 grams]",
    "price": 1800,
    "image": "images/menu/Cakes/Russian Medovik Cake [800 grams].png",
    "description": "This Russian classic is made with Honey soaked biscuit sponge, layered with mild Honey cream frosting & finished with salted caramel crisp pearls.",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 129,
    "category": "cakes",
    "categoryDir": "Cakes",
    "name": "Blueberry French Vanilla Cake [1kg]",
    "price": 2250,
    "image": "images/menu/Cakes/Blueberry French Vanilla Cake [1kg].png",
    "description": "A decadent cake to tease your taste buds, this cake is made with fluffy vanilla genoise layered with Blueberry compote, French Vanilla cream and fresh blueberries.",
    "isVeg": false,
    "popular": true
  },
  {
    "id": 130,
    "category": "cakes",
    "categoryDir": "Cakes",
    "name": "Rocher Cake",
    "price": 1600,
    "image": "images/menu/Cakes/Rocher Cake.png",
    "description": "One of our bestsellers, this multi textured cake is made with layers of Chocolate sponge, Chocolate hazelnut ganache, Crunchy praline French Biscuit  & glazed with a thin layer of Hazelnut Gourmand. This item is customizable.",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 131,
    "category": "cakes",
    "categoryDir": "Cakes",
    "name": "Pineapple Cake",
    "price": 1350,
    "image": "images/menu/Cakes/Pineapple Cake.png",
    "description": "Pure Nostalgia! The age old classic done with real pineapple compote &  vanilla  French whipped cream paired with pineapple fruit.",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 132,
    "category": "cakes",
    "categoryDir": "Cakes",
    "name": "Tiramisu Cake",
    "price": 1275,
    "image": "images/menu/Cakes/Tiramisu Cake.png",
    "description": "Coffee infused genoise sponge frosted with Italian Mascarpone cream frosting & finished with cocoa powder and chocolate decor This item is customizable.",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 133,
    "category": "cakes",
    "categoryDir": "Cakes",
    "name": "Opera Cake [800 Grams]",
    "price": 1900,
    "image": "images/menu/Cakes/Opera Cake [800 Grams].png",
    "description": "A French Classic, layers of Almond sponge soaked in coffee syrup are frosted alternately with Belgian Chocolate Ganache & Coffee butter cream & the cake is then glazed with Chocolate & garnished with Chocolate Macarons",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 134,
    "category": "cakes",
    "categoryDir": "Cakes",
    "name": "Eggless Belgian Chocolate Cake",
    "price": 1400,
    "image": "images/menu/Cakes/Eggless Belgian Chocolate Cake.png",
    "description": "Made with Belgian chocolate, rich chocolate sponge is layered & frosted with smooth chocolate ganache and finished with grated chocolate This item is customizable.",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 135,
    "category": "cakes",
    "categoryDir": "Cakes",
    "name": "Belgian Chocolate Cake",
    "price": 1400,
    "image": "images/menu/Cakes/Belgian Chocolate Cake.png",
    "description": "Made with Belgian chocolate, rich chocolate sponge is layered & frosted with smooth chocolate ganache & garnished with  Chocolate French Macarons. This item is customizable.",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 136,
    "category": "pizza",
    "categoryDir": "Pizza",
    "name": "BBQ Chicken Pizza [12 Inches]",
    "price": 580,
    "image": "images/menu/Pizza/BBQ Chicken Pizza [12 Inches].jpg",
    "description": "Mozzarella, marinara sauce, Bbq chicken, bell pepper & onion",
    "isVeg": false,
    "popular": true
  },
  {
    "id": 137,
    "category": "pizza",
    "categoryDir": "Pizza",
    "name": "Chicken Fajita Pizza [12 Inches]",
    "price": 580,
    "image": "images/menu/Pizza/Chicken Fajita Pizza [12 Inches].jpg",
    "description": "Chicken in fajita sauce, bell peppers, onion, mozzarella & marinara sauce",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 138,
    "category": "pizza",
    "categoryDir": "Pizza",
    "name": "Farmers Fresh Pizza [12 Inches]",
    "price": 560,
    "image": "images/menu/Pizza/Farmers Fresh Pizza [12 Inches].jpg",
    "description": "Broccoli, baby corn, bell peppers, onion, marinara sauce & mozzarella",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 139,
    "category": "pizza",
    "categoryDir": "Pizza",
    "name": "Lamb Pepperoni Pizza [12 Inches]",
    "price": 595,
    "image": "images/menu/Pizza/Lamb Pepperoni Pizza [12 Inches].jpg",
    "description": "",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 140,
    "category": "pizza",
    "categoryDir": "Pizza",
    "name": "Margherita Pizza [12 Inches]",
    "price": 490,
    "image": "images/menu/Pizza/Margherita Pizza [12 Inches].jpg",
    "description": "Classic italian pizza made with fresh marinara tomato sauce & topped with mozzarella cheese",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 141,
    "category": "pizza",
    "categoryDir": "Pizza",
    "name": "Mexican Cottage Cheese Pizza [12 Inches]",
    "price": 560,
    "image": "images/menu/Pizza/Mexican Cottage Cheese Pizza [12 Inches].jpg",
    "description": "Paneer in mexican pepper sauce, bell peppers, onion, marinara sauce & mozzarella",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 142,
    "category": "pizza",
    "categoryDir": "Pizza",
    "name": "Paprika Smoked Chicken Pizza [12 Inches]",
    "price": 580,
    "image": "images/menu/Pizza/Paprika Smoked Chicken Pizza [12 Inches].jpg",
    "description": "Mozzarella, marinara sauce, smoked paprika chicken, bell pepper & onion",
    "isVeg": false,
    "popular": true
  },
  {
    "id": 143,
    "category": "pizza",
    "categoryDir": "Pizza",
    "name": "Viennese Pizza [12 Inches]",
    "price": 560,
    "image": "images/menu/Pizza/Viennese Pizza [12 Inches].jpg",
    "description": "Mozzarella, marinara sauce, chicken sausage & onion",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 144,
    "category": "pizza",
    "categoryDir": "Pizza",
    "name": "Meat Lovers",
    "price": 610,
    "image": "images/menu/Pizza/Meat Lovers.jpg",
    "description": "Mozzarella, Marinara Sauce& Lamb Pepperoni",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 145,
    "category": "appetizers",
    "categoryDir": "Appetizers",
    "name": "Cheesy Garlic Bread",
    "price": 310,
    "image": "images/menu/Appetizers/Cheesy Garlic Bread.jpg",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 146,
    "category": "appetizers",
    "categoryDir": "Appetizers",
    "name": "Southwest Chicken Tenders",
    "price": 435,
    "image": "images/menu/Appetizers/Southwest Chicken Tenders.jpg",
    "description": "",
    "isVeg": false,
    "popular": true
  },
  {
    "id": 147,
    "category": "appetizers",
    "categoryDir": "Appetizers",
    "name": "Chicken Loaded Fries",
    "price": 450,
    "image": "images/menu/Appetizers/Chicken Loaded Fries.jpg",
    "description": "",
    "isVeg": false,
    "popular": true
  },
  {
    "id": 148,
    "category": "appetizers",
    "categoryDir": "Appetizers",
    "name": "Peri-peri Fries",
    "price": 310,
    "image": "images/menu/Appetizers/Peri-peri Fries.jpg",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 149,
    "category": "appetizers",
    "categoryDir": "Appetizers",
    "name": "French Fries",
    "price": 280,
    "image": "images/menu/Appetizers/French Fries.jpg",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 150,
    "category": "appetizers",
    "categoryDir": "Appetizers",
    "name": "Plain Garlic Bread",
    "price": 265,
    "image": "images/menu/Appetizers/Plain Garlic Bread.jpg",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 151,
    "category": "appetizers",
    "categoryDir": "Appetizers",
    "name": "Veg Loaded Fries",
    "price": 350,
    "image": "images/menu/Appetizers/Veg Loaded Fries.jpg",
    "description": "",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 152,
    "category": "appetizers",
    "categoryDir": "Appetizers",
    "name": "Paneer Tenders",
    "price": 435,
    "image": "images/menu/Appetizers/Paneer Tenders.jpg",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 153,
    "category": "appetizers",
    "categoryDir": "Appetizers",
    "name": "Dynamite Chicken Wings",
    "price": 435,
    "image": "images/menu/Appetizers/Dynamite Chicken Wings.png",
    "description": "",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 154,
    "category": "appetizers",
    "categoryDir": "Appetizers",
    "name": "Honey Chilli Lotus Stem",
    "price": 380,
    "image": "images/menu/Appetizers/Honey Chilli Lotus Stem.JPG",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 155,
    "category": "appetizers",
    "categoryDir": "Appetizers",
    "name": "Potato Croquette Poppers",
    "price": 350,
    "image": "images/menu/Appetizers/Potato Croquette Poppers.jpg",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 156,
    "category": "grilled-sandwich",
    "categoryDir": "Grilled Sandwich",
    "name": "Grilled Veg Sandwich",
    "price": 360,
    "image": "images/menu/Grilled Sandwich/Grilled Veg Sandwich.jpg",
    "description": "Broccoli, corn, bell pepper, onion & lettuce tossed in bechamel sauce & grilled between freshly baked bread. served with a portion of crispy fries on the side",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 157,
    "category": "grilled-sandwich",
    "categoryDir": "Grilled Sandwich",
    "name": "BBQ Chicken Sandwich",
    "price": 395,
    "image": "images/menu/Grilled Sandwich/BBQ Chicken Sandwich.jpg",
    "description": "Creamy bbq chicken tossed with bell pepper, onion, lettuce and layered between freshly baked bread. served with crispy fries on the side.",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 158,
    "category": "grilled-sandwich",
    "categoryDir": "Grilled Sandwich",
    "name": "Chicken Club Sandwich",
    "price": 470,
    "image": "images/menu/Grilled Sandwich/Chicken Club Sandwich.jpg",
    "description": "Grilled Chicken, Chicken Mortadella, Mayo, Lettuce, Onion, tomato & cheese sandwiched between white bread",
    "isVeg": false,
    "popular": true
  },
  {
    "id": 159,
    "category": "grilled-sandwich",
    "categoryDir": "Grilled Sandwich",
    "name": "Marinara Melt Sandwich",
    "price": 360,
    "image": "images/menu/Grilled Sandwich/Marinara Melt Sandwich.jpg",
    "description": "Melted mozzarella, emmental, gouda & cheddar cheese blend paired with marinara sauce. served with a portion of crispy fries on the side.",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 160,
    "category": "pasta",
    "categoryDir": "Pasta",
    "name": "Veg Alfredo Pasta",
    "price": 530,
    "image": "images/menu/Pasta/Veg Alfredo Pasta.jpg",
    "description": "Penne pasta tossed in parmesan Alfredo sauce, exotic veggies & served with garlic bread on the side This item is customizable.",
    "isVeg": true,
    "popular": true
  },
  {
    "id": 161,
    "category": "pasta",
    "categoryDir": "Pasta",
    "name": "Veg Arrabbiata Pasta",
    "price": 495,
    "image": "images/menu/Pasta/Veg Arrabbiata Pasta.jpg",
    "description": "Penne pasta tossed in spicy red Arrabbiata, exotic veggies & served with garlic bread on the side This item is customizable.",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 162,
    "category": "pasta",
    "categoryDir": "Pasta",
    "name": "Veg Parmarosa Pink Sauce Pasta",
    "price": 540,
    "image": "images/menu/Pasta/Veg Parmarosa Pink Sauce Pasta.jpg",
    "description": "Penne pasta tossed in delicious mix of Alfredo white & Marinara red sauce pasta along with seasonal veggies This item is customizable.",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 163,
    "category": "croissants",
    "categoryDir": "Croissants",
    "name": "Chocolate Croissant",
    "price": 210,
    "image": "images/menu/Croissants/Chocolate Croissant.png",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 164,
    "category": "croissants",
    "categoryDir": "Croissants",
    "name": "Almond Croissant",
    "price": 210,
    "image": "images/menu/Croissants/Almond Croissant.png",
    "description": "",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 165,
    "category": "croissants",
    "categoryDir": "Croissants",
    "name": "Cinnamon Roll",
    "price": 185,
    "image": "images/menu/Croissants/Cinnamon Roll.png",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 166,
    "category": "croissants",
    "categoryDir": "Croissants",
    "name": "Butter Croissant",
    "price": 160,
    "image": "images/menu/Croissants/Butter Croissant.png",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 167,
    "category": "croissants",
    "categoryDir": "Croissants",
    "name": "Nutella Knot",
    "price": 210,
    "image": "images/menu/Croissants/Nutella Knot.png",
    "description": "",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 168,
    "category": "croissants",
    "categoryDir": "Croissants",
    "name": "Baklava Croissant",
    "price": 210,
    "image": "images/menu/Croissants/Baklava Croissant.png",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 169,
    "category": "burger",
    "categoryDir": "Burger",
    "name": "Crunchy Chicken Burger",
    "price": 440,
    "image": "images/menu/Burger/Crunchy Chicken Burger.jpg",
    "description": "Buttermilk Fried Chicken, Signature sauce, Lettuce, Onion, Tomato & cheese sandwiched between soft burger bun",
    "isVeg": false,
    "popular": true
  },
  {
    "id": 170,
    "category": "burger",
    "categoryDir": "Burger",
    "name": "Veg Tikki Burger",
    "price": 370,
    "image": "images/menu/Burger/Veg Tikki Burger.jpg",
    "description": "Crispy veg patty, Mayo, Lettuce, Onion, tomato & cheese sandwiched between soft pillowy burger bun",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 171,
    "category": "hot-beverages",
    "categoryDir": "Hot Beverages",
    "name": "Belgian Hot Chocolate",
    "price": 375,
    "image": "images/menu/Hot Beverages/Belgian Hot Chocolate.jpg",
    "description": "Our signature rich hot chocolate is made with a blend of Belgian Chocolate.",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 172,
    "category": "hot-beverages",
    "categoryDir": "Hot Beverages",
    "name": "Cafe Latte Classic [250 Ml]",
    "price": 250,
    "image": "images/menu/Hot Beverages/Cafe Latte Classic [250 Ml].jpg",
    "description": "Espresso with steamed milk & a thin layer of microfoam",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 173,
    "category": "hot-beverages",
    "categoryDir": "Hot Beverages",
    "name": "Cafe Mocha [250 Ml]",
    "price": 285,
    "image": "images/menu/Hot Beverages/Cafe Mocha [250 Ml].jpg",
    "description": "A sinful combination of Espresso, steamed milk & chocolate sauce",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 174,
    "category": "hot-beverages",
    "categoryDir": "Hot Beverages",
    "name": "Cappuccino Classic [250 Ml]",
    "price": 250,
    "image": "images/menu/Hot Beverages/Cappuccino Classic [250 Ml].jpg",
    "description": "Espresso with equal parts of milk & microfoam",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 175,
    "category": "hot-beverages",
    "categoryDir": "Hot Beverages",
    "name": "Caramel Cappuccino",
    "price": 275,
    "image": "images/menu/Hot Beverages/Caramel Cappuccino.jpg",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 176,
    "category": "hot-beverages",
    "categoryDir": "Hot Beverages",
    "name": "Spanish Latte",
    "price": 290,
    "image": "images/menu/Hot Beverages/Spanish Latte.jpg",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 177,
    "category": "hot-beverages",
    "categoryDir": "Hot Beverages",
    "name": "Long Black",
    "price": 230,
    "image": "images/menu/Hot Beverages/Long Black.jpg",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 178,
    "category": "cold-blends",
    "categoryDir": "Cold Blends",
    "name": "Classic Cold Coffee",
    "price": 315,
    "image": "images/menu/Cold Blends/Classic Cold Coffee.jpg",
    "description": "[300 Ml]. Double shot espresso blended with vanilla ice cream",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 179,
    "category": "cold-blends",
    "categoryDir": "Cold Blends",
    "name": "Brownie Cold Coffee",
    "price": 335,
    "image": "images/menu/Cold Blends/Brownie Cold Coffee.jpg",
    "description": "[300 Ml].  Double shot espresso blended with vanilla ice cream & our signature brownies",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 180,
    "category": "cold-blends",
    "categoryDir": "Cold Blends",
    "name": "Caramel Cold Coffee",
    "price": 335,
    "image": "images/menu/Cold Blends/Caramel Cold Coffee.jpg",
    "description": "Espresso blended with caramel & vanilla ice cream",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 181,
    "category": "cold-blends",
    "categoryDir": "Cold Blends",
    "name": "Chocolate Cold Coffee",
    "price": 335,
    "image": "images/menu/Cold Blends/Chocolate Cold Coffee.jpg",
    "description": "Espresso blended with chocolate ice cream & chocolate sauce",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 182,
    "category": "croissant-sandwich",
    "categoryDir": "Croissant Sandwich",
    "name": "Chicken Salami Croissant Sandwich",
    "price": 395,
    "image": "images/menu/Croissant Sandwich/Chicken Salami Croissant Sandwich.jpg",
    "description": "Flaky buttery croissant sandwiched with chicken salami, mozzarella cheese & chipotle sauce. Served with a portion of crispy fries on the side.",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 183,
    "category": "croissant-sandwich",
    "categoryDir": "Croissant Sandwich",
    "name": "Herb Chicken Croissant Sandwich",
    "price": 385,
    "image": "images/menu/Croissant Sandwich/Herb Chicken Croissant Sandwich.jpg",
    "description": "Flaky buttery croissant sandwiched with pesto chicken & mozzarella cheese. Served with a portion of crispy fries on the side.",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 184,
    "category": "croissant-sandwich",
    "categoryDir": "Croissant Sandwich",
    "name": "Lamb Pepperoni Croissant Sandwich",
    "price": 395,
    "image": "images/menu/Croissant Sandwich/Lamb Pepperoni Croissant Sandwich.jpg",
    "description": "Flaky buttery croissant sandwiched with lamb pepperoni & mozzarella cheese. Served with a portion of crispy fries on the side.",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 185,
    "category": "croissant-sandwich",
    "categoryDir": "Croissant Sandwich",
    "name": "Pesto Mozzarella Croissant Sandwich",
    "price": 385,
    "image": "images/menu/Croissant Sandwich/Pesto Mozzarella Croissant Sandwich.jpg",
    "description": "Flaky buttery croissant sandwiched with italian pesto & mozzarella cheese. Served with a portion of crispy fries on the side.",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 186,
    "category": "wraps",
    "categoryDir": "Wraps",
    "name": "Chicken Wrap",
    "price": 435,
    "image": "images/menu/Wraps/Chicken Wrap.jpg",
    "description": "",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 187,
    "category": "wraps",
    "categoryDir": "Wraps",
    "name": "Paneer Wrap",
    "price": 425,
    "image": "images/menu/Wraps/Paneer Wrap.jpg",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 188,
    "category": "calzone",
    "categoryDir": "Calzone",
    "name": "Vegetariana Calzone",
    "price": 395,
    "image": "images/menu/Calzone/Vegetariana Calzone.jpg",
    "description": "Italian turnover made with fresh exotic veggies, fresh italian tomato sauce, four cheese house blend",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 189,
    "category": "calzone",
    "categoryDir": "Calzone",
    "name": "Grilled Chicken Calzone",
    "price": 425,
    "image": "images/menu/Calzone/Grilled Chicken Calzone.jpg",
    "description": "Italian turnover made with grilled chicken, bell peppers, onion fresh italian tomato sauce, 4 cheese blend",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 190,
    "category": "calzone",
    "categoryDir": "Calzone",
    "name": "Quattro Formaggi 4 Cheese Calzone",
    "price": 395,
    "image": "images/menu/Calzone/Quattro Formaggi 4 Cheese Calzone.jpg",
    "description": "Italian turnover made with four cheese blend of mozzarella, emmental, gouda & cheddar.",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 191,
    "category": "calzone",
    "categoryDir": "Calzone",
    "name": "Viennese Calzone",
    "price": 425,
    "image": "images/menu/Calzone/Viennese Calzone.jpg",
    "description": "Italian turnover made with chicken sausage, onion, italian tomato sauce & house blend four cheese",
    "isVeg": false,
    "popular": false
  },
  {
    "id": 192,
    "category": "iced-coffee",
    "categoryDir": "Iced Coffee",
    "name": "Cranberry Coffee",
    "price": 285,
    "image": "images/menu/Iced Coffee/Cranberry Coffee.jpg",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 193,
    "category": "iced-coffee",
    "categoryDir": "Iced Coffee",
    "name": "Iced Latte",
    "price": 280,
    "image": "images/menu/Iced Coffee/Iced Latte.jpg",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 194,
    "category": "iced-coffee",
    "categoryDir": "Iced Coffee",
    "name": "Iced Long Black",
    "price": 250,
    "image": "images/menu/Iced Coffee/Iced Long Black.jpg",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 195,
    "category": "iced-coffee",
    "categoryDir": "Iced Coffee",
    "name": "Iced Spanish Latte",
    "price": 295,
    "image": "images/menu/Iced Coffee/Iced Spanish Latte.jpg",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 196,
    "category": "iced-coffee",
    "categoryDir": "Iced Coffee",
    "name": "Vietnamese Coffee",
    "price": 320,
    "image": "images/menu/Iced Coffee/Vietnamese Coffee.jpg",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 197,
    "category": "quenchers",
    "categoryDir": "Quenchers",
    "name": "Lemon Iced Tea",
    "price": 265,
    "image": "images/menu/Quenchers/Lemon Iced Tea.png",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 198,
    "category": "quenchers",
    "categoryDir": "Quenchers",
    "name": "Peach Salt",
    "price": 265,
    "image": "images/menu/Quenchers/Peach Salt.jpg",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 199,
    "category": "quenchers",
    "categoryDir": "Quenchers",
    "name": "Shirley Temple",
    "price": 265,
    "image": "images/menu/Quenchers/Shirley Temple.jpg",
    "description": "",
    "isVeg": true,
    "popular": false
  },
  {
    "id": 200,
    "category": "quenchers",
    "categoryDir": "Quenchers",
    "name": "Virgin Mojito",
    "price": 265,
    "image": "images/menu/Quenchers/Virgin Mojito.jpg",
    "description": "",
    "isVeg": true,
    "popular": false
  }
];

const CATEGORIES = [
  {
    "id": "all",
    "label": "All Items"
  },
  {
    "id": "bestseller",
    "label": "⭐ Bestsellers"
  },
  {
    "id": "appetizers",
    "label": "Appetizers"
  },
  {
    "id": "burger",
    "label": "Burgers"
  },
  {
    "id": "cakes",
    "label": "Cakes"
  },
  {
    "id": "calzone",
    "label": "Calzones"
  },
  {
    "id": "cold-blends",
    "label": "Cold Blends"
  },
  {
    "id": "croissant-sandwich",
    "label": "Croissant Sandwiches"
  },
  {
    "id": "croissants",
    "label": "Croissants & Rolls"
  },
  {
    "id": "desserts",
    "label": "Desserts & Pastries"
  },
  {
    "id": "grilled-sandwich",
    "label": "Grilled Sandwiches"
  },
  {
    "id": "hot-beverages",
    "label": "Hot Beverages"
  },
  {
    "id": "iced-coffee",
    "label": "Iced Coffees"
  },
  {
    "id": "pasta",
    "label": "Pastas"
  },
  {
    "id": "pizza",
    "label": "Gourmet Pizzas"
  },
  {
    "id": "quenchers",
    "label": "Quenchers & Cold Teas"
  },
  {
    "id": "wraps",
    "label": "Wraps"
  }
];

const FEATURED_IDS = [
  107,
  127,
  129,
  136,
  142,
  146,
  147,
  158,
  160,
  169
];

// ── Active Custom Menu State & Persistence Helper Functions ───
function getActiveMenuData() {
  const customStr = localStorage.getItem('feranoz_custom_menu');
  if (customStr) {
    try {
      const parsed = JSON.parse(customStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch(e) {}
  }
  // Initialize default menu with available = true
  const initial = MENU_DATA.map(item => ({ ...item, available: item.available !== false }));
  localStorage.setItem('feranoz_custom_menu', JSON.stringify(initial));
  return initial;
}

function saveActiveMenuData(dataList) {
  localStorage.setItem('feranoz_custom_menu', JSON.stringify(dataList));
  try {
    const bc = new BroadcastChannel('feranoz_menu_channel');
    bc.postMessage({ type: 'MENU_UPDATED' });
  } catch(e) {}
}

function getMenuCategories() {
  const data = getActiveMenuData();
  const catSet = new Set(data.map(i => i.category));
  return CATEGORIES.filter(c => c.id === 'all' || catSet.has(c.id));
}
