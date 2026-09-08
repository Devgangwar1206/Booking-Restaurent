import { motion } from 'motion/react';
import { Clock, MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://picsum.photos/seed/indianrestaurant/1920/1080")' }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-brand-charcoal/80 via-brand-charcoal/60 to-brand-charcoal/90"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-brand-gold font-medium tracking-[0.2em] uppercase text-sm md:text-base mb-6 block">
            Welcome to Royal Spice
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-tight">
            Authentic Indian Flavours,<br />Crafted With Passion
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
            Experience the culinary heritage of India in a modern, luxurious setting.
            A symphony of spices awaits you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#book"
              className="px-8 py-4 bg-brand-gold hover:bg-yellow-500 text-brand-charcoal rounded-full font-bold transition-all transform hover:-translate-y-1 w-full sm:w-auto text-center"
            >
              Book a Table
            </a>

            <a
              href="#menu"
              className="px-8 py-4 bg-transparent border border-white hover:border-brand-gold text-white hover:text-brand-gold rounded-full font-bold transition-all transform hover:-translate-y-1 w-full sm:w-auto text-center backdrop-blur-sm"
            >
              Explore Menu
            </a>
          </div>
        </motion.div>
      </div>

      
    </section>
  );
}