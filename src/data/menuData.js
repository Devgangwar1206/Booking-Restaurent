import { butterchicken, butternan, chillipaner, cholebhature, Dalmakni, garlicnan, gulabjamun, hakkanoodles, harakabab, hydrabadibiryani, idlisambar, jerarice, kadaipaneer, malaichikentikka, mangolassi, masalachai, masaladosa, mixveg, mutonrogan, pannertikka, rasmalai, tandoorichichekn, tandooriroti, vegbiryani, vegseekkabab } from "../assets/assets";

export const menuData = [
  // Starters
  {
    id: 1,
    name: "Paneer Tikka",
    category: "Starters",
    description:
      "Char-grilled cottage cheese marinated in aromatic Indian spices and yogurt.",
    price: 280,
    image: pannertikka,
    isVeg: true,
    popular: true,
  },
  {
    id: 2,
    name: "Hara Bhara Kebab",
    category: "Starters",
    description:
      "Healthy and delicious pan-fried patties made with spinach, peas, and potatoes.",
    price: 240,
    image: harakabab,
    isVeg: true,
  },
  {
    id: 3,
    name: "Tandoori Chicken",
    category: "Starters",
    description:
      "Iconic bone-in chicken marinated in yogurt and spices, roasted in a clay oven.",
    price: 350,
    image: tandoorichichekn,
    isVeg: false,
    popular: true,
  },
  {
    id: 4,
    name: "Veg Seekh Kebab",
    category: "Starters",
    description:
      "Minced vegetable and cheese skewers, grilled to perfection.",
    price: 250,
    image: vegseekkabab,
    isVeg: true,
  },
  {
    id: 5,
    name: "Malai Chicken Tikka",
    category: "Starters",
    description:
      "Melt-in-mouth chicken chunks marinated in cream, cheese, and mild spices.",
    price: 320,
    image: malaichikentikka,
    isVeg: false,
  },

  // Main Course
  {
    id: 6,
    name: "Butter Chicken",
    category: "Main Course",
    description:
      "Tender chicken cooked in a rich, creamy, and mildly spiced tomato gravy.",
    price: 390,
    image: butterchicken,
    isVeg: false,
    popular: true,
  },
  {
    id: 25,
    name: "Chole Bhature",
    category: "Main Course",
    description:
      "Tender cooked in a maida, creamy, and mildly spiced tomato gravy.",
    price: 280,
    image: cholebhature,
    isVeg: true,
    popular: true,
  },
  {
    id: 7,
    name: "Dal Makhani",
    category: "Main Course",
    description:
      "Slow-cooked black lentils and kidney beans simmered with butter and cream.",
    price: 260,
    image: Dalmakni,
    isVeg: true,
    popular: true,
  },
  {
    id: 8,
    name: "Kadhai Paneer",
    category: "Main Course",
    description:
      "Cottage cheese cooked with bell peppers, onions, and freshly ground spices.",
    price: 290,
    image: kadaipaneer,
    isVeg: true,
  },
  {
    id: 9,
    name: "Mutton Rogan Josh",
    category: "Main Course",
    description:
      "A classic Kashmiri delicacy of slow-cooked mutton in a rich aromatic gravy.",
    price: 450,
    image: mutonrogan,
    isVeg: false,
    popular: true,
  },
  {
    id: 10,
    name: "Mix Veg Curry",
    category: "Main Course",
    description:
      "Seasonal vegetables cooked in a homestyle mildly spiced onion-tomato gravy.",
    price: 240,
    image: mixveg,
    isVeg: true,
  },

  // Biryani
  {
    id: 11,
    name: "Hyderabadi Chicken Biryani",
    category: "Biryani",
    description:
      "Aromatic basmati rice cooked with marinated chicken and authentic spices.",
    price: 350,
    image: hydrabadibiryani,
    isVeg: false,
    popular: true,
  },
  {
    id: 12,
    name: "Veg Biryani",
    category: "Biryani",
    description:
      "Fragrant basmati rice layered with spiced mixed vegetables.",
    price: 280,
    image: vegbiryani,
    isVeg: true,
  },
  {
    id: 13,
    name: "Jeera Rice",
    category: "Biryani",
    description:
      "Basmati rice tempered with cumin seeds and fresh coriander.",
    price: 150,
    image: jerarice,
    isVeg: true,
  },

  // Breads
  {
    id: 14,
    name: "Garlic Naan",
    category: "Breads",
    description:
      "Soft and fluffy flatbread topped with minced garlic and butter.",
    price: 90,
    image: garlicnan,
    isVeg: true,
    popular: true,
  },
  {
    id: 15,
    name: "Butter Naan",
    category: "Breads",
    description:
      "Traditional refined flour flatbread brushed with butter.",
    price: 70,
    image: butternan,
    isVeg: true,
  },
  {
    id: 16,
    name: "Tandoori Roti",
    category: "Breads",
    description:
      "Whole wheat flatbread baked in a traditional clay oven.",
    price: 40,
    image: tandooriroti,
    isVeg: true,
  },

  // South Indian
  {
    id: 17,
    name: "Masala Dosa",
    category: "South Indian",
    description:
      "Crispy rice crepe filled with spiced potato mash, served with chutney and sambar.",
    price: 180,
    image:masaladosa,
    isVeg: true,
    popular: true,
  },
  {
    id: 18,
    name: "Idli Sambar",
    category: "South Indian",
    description:
      "Soft steamed rice cakes served with lentil stew and coconut chutney.",
    price: 120,
    image: idlisambar,
    isVeg: true,
  },

  // Chinese
  {
    id: 19,
    name: "Chilli Paneer",
    category: "Chinese",
    description:
      "Crispy paneer tossed in spicy, sweet and sour Indo-Chinese sauce.",
    price: 270,
    image: chillipaner,
    isVeg: true,
  },
  {
    id: 20,
    name: "Chicken Hakka Noodles",
    category: "Chinese",
    description:
      "Wok-tossed noodles with chicken, vegetables, and soy sauce.",
    price: 250,
    image: hakkanoodles,
    isVeg: false,
  },

  // Desserts
  {
    id: 21,
    name: "Gulab Jamun",
    category: "Desserts",
    description:
      "Deep-fried milk dumplings soaked in cardamom-flavored sugar syrup.",
    price: 120,
    image: gulabjamun,
    isVeg: true,
    popular: true,
  },
  {
    id: 22,
    name: "Rasmalai",
    category: "Desserts",
    description:
      "Soft cottage cheese discs soaked in sweetened, thickened saffron milk.",
    price: 150,
    image: rasmalai,
    isVeg: true,
  },

  // Beverages
  {
    id: 23,
    name: "Mango Lassi",
    category: "Beverages",
    description:
      "A refreshing blend of yogurt and sweet mangoes.",
    price: 110,
    image: mangolassi,
    isVeg: true,
    popular: true,
  },
  {
    id: 24,
    name: "Masala Chai",
    category: "Beverages",
    description:
      "Traditional Indian tea brewed with aromatic spices and milk.",
    price: 60,
    image: masalachai,
    isVeg: true,
  },
];