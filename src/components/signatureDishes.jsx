import { motion } from 'motion/react';
import { butterchicken, Dalmakni, hydrabadibiryani } from '../assets/assets';

const signatureDishes = [
  {
    name: 'Butter Chicken',
    description: 'Tender chicken cooked in a rich, creamy, and mildly spiced tomato gravy.',
    price: '390',
    image: butterchicken
  },
  {
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils and kidney beans simmered with butter and cream.',
    price: '260',
    image: Dalmakni
  },
  {
    name: 'Hyderabadi Biryani',
    description: 'Aromatic basmati rice cooked with marinated chicken and authentic spices.',
    price: '350',
    image: hydrabadibiryani
  }
];

export default function SignatureDishes() {
  return (
    <section className="py-24 bg-[#FDFBF7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="text-brand-gold font-semibold tracking-[0.2em] uppercase text-sm mb-4">
            Chef's Selection
          </h2>

          <h3 className="text-4xl md:text-5xl font-serif text-brand-charcoal">
            Our Signature Dishes
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {signatureDishes.map((dish, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-72 w-full overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-8 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex justify-between items-end mb-2">
                  <h4 className="font-serif text-2xl font-bold">
                    {dish.name}
                  </h4>

                  <span className="text-brand-gold font-bold text-xl">
                    ₹{dish.price}
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {dish.description}
                </p>

                <div className="h-0.5 w-0 bg-brand-gold group-hover:w-full transition-all duration-700 ease-out"></div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
