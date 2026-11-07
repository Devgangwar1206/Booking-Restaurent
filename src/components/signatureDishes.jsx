'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  Clock,
  Flame,
  Users,
  Plus,
  Minus,
  ShoppingBag,
  X,
  Check,
  Sparkles,
  Info,
  ChevronRight,
  Heart,
  UtensilsCrossed,
} from 'lucide-react';
import { butterchicken, Dalmakni, hydrabadibiryani } from '../assets/assets';
import { useCart } from '../context/CartContext';

// Rich signature dishes linked with menuData IDs
const signatureDishes = [
  {
    id: 6,
    name: 'Butter Chicken',
    subtitle: 'Mughlai Royalty',
    category: 'Main Course',
    price: 390,
    image: butterchicken,
    isVeg: false,
    rating: 4.9,
    reviewCount: 430,
    prepTime: '20-25 mins',
    spiceLevel: 'Mild & Creamy',
    flameCount: 1,
    serves: 'Serves 2',
    calories: '480 kcal',
    badge: "Chef's Signature #1",
    description: 'Tender chicken cooked in a rich, creamy, and mildly spiced tomato and cashew gravy.',
    longStory:
      'Our Butter Chicken follows a heritage 1950s recipe. Farm-fresh chicken thighs are marinated for 12 hours in Kashmiri deggi mirch, hung yogurt, and roasted cumin before being fired on skewers in our charcoal clay oven. The smoky tandoori chicken is then immersed in a velvet-smooth makhani gravy enriched with fresh churned white butter, cashew cream, and fragrant hand-rubbed kasoori methi.',
    ingredients: [
      'Charcoal Grilled Chicken',
      'Cashew Cream',
      'Cultured White Butter',
      'Kashmiri Deggi Mirch',
      'Fresh Tomato Reduction',
      'Sun-dried Kasoori Methi',
    ],
  },
  {
    id: 7,
    name: 'Dal Makhani',
    subtitle: 'Slow-Cooked Overnight',
    category: 'Main Course',
    price: 260,
    image: Dalmakni,
    isVeg: true,
    rating: 4.9,
    reviewCount: 510,
    prepTime: '16-Hour Simmer',
    spiceLevel: 'Gentle & Smooth',
    flameCount: 1,
    serves: 'Serves 2',
    calories: '380 kcal',
    badge: 'Heritage Classic',
    description: 'Slow-cooked black lentils and kidney beans simmered for 16 hours over charcoal with butter and cream.',
    longStory:
      'Whole black urad lentils and red kidney beans are soaked overnight and then simmered over the gentle, dying embers of a charcoal clay tandoor for 16 continuous hours. The slow cooking unlocks a natural, buttery creaminess without heavy starch, finished with cultured churned butter, hand-crushed ginger, and farm-fresh cream.',
    ingredients: [
      'Whole Black Urad Lentils',
      'Red Kidney Beans',
      '16-Hour Charcoal Simmer',
      'Farmhouse Cultured Butter',
      'Double Cream',
      'Smoked Deggi Mirch',
    ],
  },
  {
    id: 11,
    name: 'Hyderabadi Chicken Biryani',
    subtitle: 'Royal Nizami Feast',
    category: 'Biryani',
    price: 350,
    image: hydrabadibiryani,
    isVeg: false,
    rating: 4.9,
    reviewCount: 680,
    prepTime: '25-30 mins',
    spiceLevel: 'Medium Aromatic',
    flameCount: 2,
    serves: 'Serves 1-2',
    calories: '550 kcal',
    badge: 'Dum Pukht Special',
    description: 'Aromatic basmati rice slow-cooked on dum with marinated chicken, pure saffron, and shahi spices.',
    longStory:
      "Cooked in the authentic 'Kacchi Dum' Nizami tradition where raw marinated chicken is layered between partially boiled aged royal basmati rice, topped with Kashmiri saffron-infused warm milk, pure desi ghee, golden crispy onions (birista), and hand-picked mint leaves. The handi is dough-sealed and slow-cooked over a low flame, capturing all fragrances until the meat is falling off the bone.",
    ingredients: [
      'Aged Royal Basmati Rice',
      'Kashmiri Pure Saffron',
      'Marinated Free-Range Chicken',
      'Golden Crisp Birista',
      'Pure Desi Ghee',
      'Shahi Whole Spices',
    ],
  },
];

export default function SignatureDishes() {
  const { cartItems, addToCart, updateQuantity, setIsCartOpen } = useCart();
  const [selectedDish, setSelectedDish] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [justAddedId, setJustAddedId] = useState(null);

  // Check how many of a dish is currently in the cart
  const getCartQuantity = (dishId) => {
    const found = (cartItems || []).find((entry) => entry.menuItem.id === dishId);
    return found ? found.quantity : 0;
  };

  const handleOpenModal = (dish) => {
    setSelectedDish(dish);
    const existingQty = getCartQuantity(dish.id);
    setModalQuantity(existingQty > 0 ? existingQty : 1);
  };

  const handleCloseModal = () => {
    setSelectedDish(null);
    setModalQuantity(1);
  };

  const handleQuickAdd = (e, dish) => {
    e.stopPropagation();
    addToCart(dish, 1);
    setJustAddedId(dish.id);
    setTimeout(() => setJustAddedId(null), 1800);
  };

  const handleModalAddToCart = () => {
    if (!selectedDish) return;
    const currentInCart = getCartQuantity(selectedDish.id);
    if (currentInCart > 0) {
      updateQuantity(selectedDish.id, modalQuantity);
    } else {
      addToCart(selectedDish, modalQuantity);
    }
    setJustAddedId(selectedDish.id);
    setTimeout(() => {
      setJustAddedId(null);
      handleCloseModal();
      setIsCartOpen(true);
    }, 600);
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#FDFBF7] via-white to-[#FDFBF7] relative overflow-hidden">
      {/* Subtle luxury ambient glow behind heading */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Chef&apos;s Royal Selection</span>
          </div>

          <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-stone-900 tracking-tight">
            Our Signature Dishes
          </h3>
          <p className="mt-3 text-xs sm:text-sm text-stone-500 max-w-lg mx-auto font-medium">
            Masterpieces crafted with timeless spices, traditional dum cooking, and heirloom recipes. Tap any dish for the recipe story &amp; details.
          </p>
        </div>

        {/* Dishes Grid - Fully Responsive on Mobile & Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {signatureDishes.map((dish, index) => {
            const inCartQty = getCartQuantity(dish.id);
            const isJustAdded = justAddedId === dish.id;

            return (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                onClick={() => handleOpenModal(dish)}
                className="group bg-white rounded-3xl border border-stone-200/90 shadow-md hover:shadow-2xl hover:border-amber-300 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
              >
                {/* 1. Food Image Container */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-stone-100">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-300" />

                  {/* Top Badges Row */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                    {/* Veg / Non-Veg Sticker Indicator */}
                    <div
                      title={dish.isVeg ? 'Pure Veg' : 'Non-Veg'}
                      className={`w-6 h-6 rounded-md backdrop-blur-md border-2 flex items-center justify-center shadow-sm bg-white/95 ${
                        dish.isVeg ? 'border-emerald-600' : 'border-rose-600'
                      }`}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          dish.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}
                      />
                    </div>

                    {/* Star Rating Sticker */}
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-black bg-amber-500 text-white backdrop-blur-md shadow-sm border border-amber-400">
                      <Star className="w-3 h-3 fill-white" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>

                  {/* Bottom Badges on Image */}
                  <div className="absolute bottom-3 inset-x-3 flex items-end justify-between pointer-events-none">
                    {/* Price Tag */}
                    <div className="bg-white/95 backdrop-blur-md text-stone-900 px-3 py-1 rounded-xl shadow-md border border-white/60">
                      <span className="text-[10px] uppercase font-bold text-stone-500 block leading-none">
                        Price
                      </span>
                      <span className="text-base sm:text-lg font-black text-rose-600 font-mono">
                        ₹{dish.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Card Content Body - Always Visible & Crisp on Mobile */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Subtitle & Category */}
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-amber-700 font-bold uppercase tracking-wider text-[11px]">
                        {dish.subtitle}
                      </span>
                      <span className="text-stone-400 text-[11px] font-medium">
                        {dish.category}
                      </span>
                    </div>

                    {/* Dish Title */}
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-rose-600 transition-colors">
                      {dish.name}
                    </h4>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  {/* Quick Specs Pill Row */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
                    <span className="flex items-center gap-1 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200/60">
                      <Flame className="w-3 h-3 text-amber-500" />
                      <span>{dish.spiceLevel}</span>
                    </span>
                    <span className="flex items-center gap-1 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200/60">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>{dish.prepTime}</span>
                    </span>
                    <span className="flex items-center gap-1 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200/60">
                      <Users className="w-3 h-3 text-stone-400" />
                      <span>{dish.serves}</span>
                    </span>
                  </div>

                  {/* 3. Action Buttons Footer */}
                  <div className="pt-2 flex items-center gap-2">
                    {/* View Details Trigger */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(dish);
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Explore Recipe</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>

                    {/* Add to Cart Trigger */}
                    {inCartQty > 0 ? (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center bg-rose-50 border border-rose-300 rounded-xl px-2 py-1 shadow-xs"
                      >
                        <button
                          type="button"
                          onClick={() => updateQuantity(dish.id, inCartQty - 1)}
                          className="w-7 h-7 rounded-lg bg-white text-rose-700 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-colors shadow-2xs font-bold"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 font-mono font-bold text-rose-700 text-xs">
                          {inCartQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(dish.id, inCartQty + 1)}
                          className="w-7 h-7 rounded-lg bg-rose-600 text-white hover:bg-rose-700 flex items-center justify-center transition-colors shadow-2xs font-bold"
                          title="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, dish)}
                        className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-900 hover:bg-rose-600 text-white'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE DISH DESCRIPTION & RECIPE STORY MODAL / DRAWER */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedDish && (
          <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-sm">
            {/* Backdrop click to dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 max-h-[92vh] sm:max-h-[85vh] flex flex-col"
            >
              {/* Header Hero Image */}
              <div className="relative h-60 sm:h-72 w-full shrink-0 overflow-hidden bg-stone-100">
                <img
                  src={selectedDish.image}
                  alt={selectedDish.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-white/20 shadow-lg z-10"
                  title="Close details"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Badges on Hero */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${
                      selectedDish.isVeg
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        selectedDish.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                      }`}
                    />
                    <span>{selectedDish.isVeg ? 'Pure Vegetarian' : 'Authentic Non-Veg'}</span>
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-white backdrop-blur-md">
                    {selectedDish.badge}
                  </span>
                </div>

                {/* Bottom Overlay Title & Price */}
                <div className="absolute bottom-4 inset-x-5 flex items-end justify-between text-white">
                  <div>
                    <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                      {selectedDish.subtitle} · {selectedDish.category}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-black text-white leading-tight">
                      {selectedDish.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-300 block">Dish Price</span>
                    <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
                      ₹{selectedDish.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scrollable Description Body */}
              <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 no-scrollbar text-stone-800">
                {/* Rating & Review summary */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-700 font-semibold">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold">{selectedDish.rating}</span>
                    <span className="text-stone-400">({selectedDish.reviewCount} customer reviews)</span>
                  </div>
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md font-bold text-[11px] border border-emerald-200">
                    Freshly Prepared
                  </span>
                </div>

                {/* Culinary Story / Description */}
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider text-stone-400 mb-1.5 flex items-center gap-1">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-rose-600" />
                    <span>The Heritage Recipe &amp; Story</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                    {selectedDish.longStory}
                  </p>
                </div>

                {/* 4-Box Highlights Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 text-center">
                    <Flame className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Spice Level</span>
                    <span className="text-xs font-bold text-stone-800">{selectedDish.spiceLevel}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 text-center">
                    <Clock className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Prep Time</span>
                    <span className="text-xs font-bold text-stone-800">{selectedDish.prepTime}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 text-center">
                    <Users className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Portion</span>
                    <span className="text-xs font-bold text-stone-800">{selectedDish.serves}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 text-center">
                    <Heart className="w-4 h-4 text-rose-600 mx-auto mb-1" />
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Calories</span>
                    <span className="text-xs font-bold text-stone-800">{selectedDish.calories}</span>
                  </div>
                </div>

                {/* Fresh Ingredients */}
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider text-stone-400 mb-2">
                    Key Ingredients &amp; Spices
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDish.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200/60"
                      >
                        ✓ {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Bottom CTA Bar: Quantity Selector + Add to Cart */}
              <div className="p-4 sm:p-5 bg-white border-t border-stone-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 shadow-lg">
                {/* Quantity Controls */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Quantity:
                  </span>
                  <div className="inline-flex items-center bg-stone-100 border border-stone-300 rounded-2xl p-1">
                    <button
                      type="button"
                      onClick={() => setModalQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold transition-colors cursor-pointer shadow-xs"
                      title="Decrease"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-mono font-black text-sm text-stone-900">
                      {modalQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setModalQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold transition-colors cursor-pointer shadow-xs"
                      title="Increase"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Big Action Button */}
                <button
                  type="button"
                  onClick={handleModalAddToCart}
                  className={`w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${
                    justAddedId === selectedDish.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-rose-900/15'
                  }`}
                >
                  {justAddedId === selectedDish.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Order ✓</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        Add to Order • ₹{(selectedDish.price * modalQuantity).toLocaleString('en-IN')}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
