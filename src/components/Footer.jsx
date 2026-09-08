import {
  UtensilsCrossed,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-brand-gold">
              <UtensilsCrossed className="w-8 h-8" />
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                Royal Spice
              </span>
            </div>

            <p className="text-gray-400 font-light text-sm leading-relaxed">
              Experience the pinnacle of Indian fine dining. Authentic recipes,
              premium ingredients, and a touch of modern elegance.
            </p>

            
          </div>

          <div>
            <h4 className="font-serif text-xl mb-6">Quick Links</h4>

            <ul className="space-y-3">
              <li>
                <a
                  href="#home"
                  className="text-gray-400 hover:text-brand-gold transition-colors text-sm"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-brand-gold transition-colors text-sm"
                >
                  Our Story
                </a>
              </li>

              <li>
                <a
                  href="#menu"
                  className="text-gray-400 hover:text-brand-gold transition-colors text-sm"
                >
                  Menu
                </a>
              </li>

              <li>
                <a
                  href="#gallery"
                  className="text-gray-400 hover:text-brand-gold transition-colors text-sm"
                >
                  Gallery
                </a>
              </li>

              <li>
                <a
                  href="#contact"
                  className="text-gray-400 hover:text-brand-gold transition-colors text-sm"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-6">Opening Hours</h4>

            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>Mon - Thu</span>
                <span>11:00 AM - 10:00 PM</span>
              </li>

              <li className="flex justify-between">
                <span>Fri - Sat</span>
                <span>11:00 AM - 11:30 PM</span>
              </li>

              <li className="flex justify-between">
                <span>Sunday</span>
                <span>12:00 PM - 10:30 PM</span>
              </li>
            </ul>
          </div>

          <div id="contact">
            <h4 className="font-serif text-xl mb-6">Contact Info</h4>

            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />

                <span>
                  123 MG Road, Connaught Place,
                  <br />
                  New Delhi, India 110001
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-gold shrink-0" />
                <span>+91 98765 43210</span>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-gold shrink-0" />
                <span>hello@royalspice.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>
            © {new Date().getFullYear()} Royal Spice. All Rights Reserved.
          </p>

          <div className="flex gap-4 mt-4 md:mt-0">
            <a
              href="#"
              className="hover:text-brand-gold transition-colors"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="hover:text-brand-gold transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}