import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { dininghall, family, indiansweet, nightcafe, spice, tandoor } from '../assets/assets';

const galleryItems = [
  {
    src: dininghall,
    description: "Our elegant dining hall ready for the evening service."
  },
  {
    src: spice,
    description: "Authentic spices sourced directly from local Indian markets."
  },
  {
    src: nightcafe,
    description: "widely rated as one of the best spots in Delhi for open-sky views and a scenic rooftop atmosphere.."
  },
  {
    src: tandoor,
    description: "Traditional clay tandoor oven in action."
  },
  {
    src: family,
    description: "A perfect setting for family gatherings and celebrations."
  },
  {
    src: indiansweet,
    description: "Handcrafted Indian desserts to complete your meal."
  }
];

export default function Gallery() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <section id="gallery" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="text-brand-gold font-semibold tracking-[0.2em] uppercase text-sm mb-4">
            Gallery
          </h2>

          <h3 className="text-4xl md:text-5xl font-serif text-brand-charcoal">
            The Royal Experience
          </h3>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {galleryItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl group break-inside-avoid cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <img
                src={item.src}
                alt={`Gallery image ${index + 1}`}
                width={800}
                height={800}
                className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white border border-white px-6 py-2 rounded-full font-medium tracking-wider uppercase text-sm transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  View
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full bg-brand-charcoal rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-brand-gold hover:text-black transition-colors"
              >
                <X size={24} />
              </button>

              <div className="relative w-full h-[50vh] md:h-[70vh]">
                <img
                  src={selectedItem.src}
                  alt={selectedItem.description}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 text-center bg-brand-charcoal">
                <p className="text-brand-cream font-serif text-lg md:text-xl">
                  {selectedItem.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}