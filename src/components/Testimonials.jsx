import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: "Aarti Sharma",
    review: "Absolutely loved the Butter Chicken and Garlic Naan. The flavours were authentic and the ambience was beautiful. Truly a royal experience.",
    rating: 5
  },
  {
    name: "Vikram Mehta",
    review: "Perfect place for a family dinner. The staff was polite, the food was excellent, and the attention to detail is remarkable.",
    rating: 5
  },
  {
    name: "Sarah Jenkins",
    review: "One of the best Indian dining experiences I've had outside of India. The spices were perfectly balanced.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-brand-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-burgundy/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-brand-gold font-semibold tracking-[0.2em] uppercase text-sm mb-4">
            Testimonials
          </h2>

          <h3 className="text-4xl md:text-5xl font-serif text-brand-charcoal">
            What Our Guests Say
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-brand-cream/50 relative"
            >
              <div className="flex gap-1 mb-6 text-brand-gold">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill="currentColor"
                  />
                ))}
              </div>

              <p className="text-gray-600 italic mb-8 leading-relaxed">
                "{review.review}"
              </p>

              <div className="font-bold text-brand-charcoal tracking-wide">
                — {review.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}