import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchMenu } from '../api/menuApi';
import { Search, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const categories = [
  "All",
  "Starters",
  "Main Course",
  "Biryani",
  "Breads",
  "South Indian",
  "Chinese",
  "Desserts",
  "Beverages"
];

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const data = await fetchMenu();
        setMenuItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error("Failed to load menu", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenu();
  }, []);

  useEffect(() => {
    let result = menuItems;

    if (activeCategory !== "All") {
      result = result.filter(
        item => item.category === activeCategory
      );
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    setFilteredItems(result);
  }, [activeCategory, searchQuery, menuItems]);

  return (
    <section id="menu" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">

          <h2 className="text-brand-gold font-semibold tracking-[0.2em] uppercase text-sm mb-4">
            Discover
          </h2>

          <h3 className="text-4xl md:text-5xl font-serif text-brand-charcoal mb-8">
            Our Exquisite Menu
          </h3>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative mb-10">

            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>

            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3">

            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-brand-charcoal text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}

          </div>
        </div>

        {/* Menu Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
          </div>
        ) : (
          <>
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-2xl mb-2">🍽️</p>
                <p className="font-medium text-lg">
                  No dishes found
                </p>
                <p className="text-sm">
                  Try searching for something else or clear filters.
                </p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence>

                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300"
                    >

                      <div className="relative h-48 w-full overflow-hidden bg-gray-100">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />

                        <div className="absolute top-4 left-4 flex gap-2">
                          <span
                            className={`w-4 h-4 rounded-sm border flex items-center justify-center bg-white ${
                              item.isVeg
                                ? 'border-green-600'
                                : 'border-red-600'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.isVeg
                                  ? 'bg-green-600'
                                  : 'bg-red-600'
                              }`}
                            ></span>
                          </span>
                        </div>

                        {item.popular && (
                          <div className="absolute top-4 right-4 bg-brand-gold text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Popular
                          </div>
                        )}

                      </div>

                      <div className="p-6">

                        <div className="flex justify-between items-start mb-2">

                          <h4 className="font-serif text-xl text-brand-charcoal font-bold">
                            {item.name}
                          </h4>

                          <span className="text-lg font-bold text-brand-burgundy whitespace-nowrap ml-4">
                            ₹{item.price}
                          </span>

                        </div>

                        <p className="text-gray-500 text-sm mb-6 line-clamp-2 h-10">
                          {item.description}
                        </p>

                        <button
                          onClick={() => {
                            addToCart(item);

                            const btn = document.getElementById(
                              `btn-${item.id}`
                            );

                            if (btn) {
                              btn.innerText = 'Added ✓';

                              btn.classList.add(
                                'bg-brand-charcoal',
                                'text-white'
                              );

                              setTimeout(() => {
                                btn.innerText = 'Add to Order';

                                btn.classList.remove(
                                  'bg-brand-charcoal',
                                  'text-white'
                                );
                              }, 2000);
                            }
                          }}
                          id={`btn-${item.id}`}
                          className="w-full py-3 rounded-xl border border-gray-200 text-brand-charcoal font-medium hover:bg-brand-charcoal hover:text-white transition-colors duration-300"
                        >
                          Add to Order
                        </button>

                      </div>

                    </motion.div>
                  ))}

                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}

      </div>
    </section>
  );
}