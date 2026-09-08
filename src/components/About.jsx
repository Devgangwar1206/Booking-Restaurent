
import { motion } from 'motion/react';
import { about } from '../assets/assets';

const stats = [
  { value: '15+', label: 'Years of Experience' },
  { value: '50+', label: 'Signature Dishes' },
  { value: '10K+', label: 'Happy Guests' },
  { value: '4.9', label: 'Customer Rating' },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-brand-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative h-150 rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src= {about}
              alt="Chef preparing food"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            <div className="absolute inset-0 border-8 border-brand-cream/20 rounded-3xl z-10 m-4 pointer-events-none"></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true, margin: "-100px" }} 
            transition={{ duration: 0.8, delay: 0.2 }} 
          > 
            <h2 className="text-brand-gold font-semibold tracking-[0.2em] uppercase text-sm mb-4"> 
              Our Story 
            </h2> 

            <h3 className="text-4xl md:text-5xl font-serif text-brand-charcoal mb-6 leading-tight"> 
              A Legacy of Authentic <br/> Indian Culinary Art 
            </h3> 

            <div className="space-y-4 text-gray-600 mb-10 text-lg leading-relaxed font-light"> 
              <p> 
                Founded on the principles of traditional Indian cooking, Royal Spice brings the  
                vibrant flavors of the subcontinent to your plate. We believe that great food  
                starts with the finest, freshest ingredients and authentic recipes passed down  
                through generations. 
              </p> 

              <p> 
                Every dish is a masterpiece, crafted with passion by our master chefs who blend  
                aromatic spices to create an unforgettable dining experience in a modern,  
                luxurious setting. 
              </p> 
            </div> 

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-gray-200"> 
              {stats.map((stat, index) => ( 
                <div key={index} className="text-center sm:text-left"> 
                  <div className="text-3xl font-serif text-brand-burgundy font-bold mb-1">
                    {stat.value}
                  </div> 

                  <div className="text-sm text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </div> 
                </div> 
              ))} 
            </div> 
          </motion.div> 

        </div> 
      </div> 
    </section> 
  );
}
