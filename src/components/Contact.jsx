import { useState } from 'react';
import { Send, MapPin, Phone, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    
    // Mock API Call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-brand-gold font-semibold tracking-[0.2em] uppercase text-sm mb-4">
            Get In Touch
          </h2>

          <h3 className="text-4xl md:text-5xl font-serif text-brand-charcoal">
            Contact Us
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info & Map Placeholder */}
          <div>
            <div className="bg-brand-cream p-8 rounded-3xl mb-8 space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin className="text-brand-gold" />
                </div>

                <div>
                  <h4 className="font-bold text-brand-charcoal mb-1">
                    Address
                  </h4>

                  <p className="text-gray-600">
                    123 MG Road, Connaught Place,<br />
                    New Delhi, India 110001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="text-brand-gold" />
                </div>

                <div>
                  <h4 className="font-bold text-brand-charcoal mb-1">
                    Phone
                  </h4>

                  <p className="text-gray-600">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                  <Mail className="text-brand-gold" />
                </div>

                <div>
                  <h4 className="font-bold text-brand-charcoal mb-1">
                    Email
                  </h4>

                  <p className="text-gray-600">
                    hello@royalspice.com
                  </p>
                </div>
              </div>

            </div>

            {/* Interactive Map */}
            <div className="h-64 bg-gray-200 rounded-3xl overflow-hidden relative shadow-sm border border-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14008.114827184242!2d77.2066141!3d28.6327421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b741d057%3A0xcdee88e47393c3f1!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi%20110001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            
            <h4 className="font-serif text-2xl text-brand-charcoal mb-6">
              Send us a Message
            </h4>

            <AnimatePresence mode="wait">
              
              {status === 'success' ? (
                
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>

                  <h3 className="text-2xl font-serif text-brand-charcoal mb-2">
                    Message Sent!
                  </h3>

                  <p className="text-gray-500 mb-8">
                    We will get back to you as soon as possible.
                  </p>

                  <button
                    onClick={() => setStatus('idle')}
                    className="py-3 px-8 border border-brand-charcoal text-brand-charcoal font-medium rounded-xl hover:bg-brand-charcoal hover:text-white transition-colors"
                  >
                    Send Another
                  </button>

                </motion.div>

              ) : (

                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Name
                      </label>

                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            name: e.target.value
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Phone
                      </label>

                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            phone: e.target.value
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Email
                    </label>

                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          email: e.target.value
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Message
                    </label>

                    <textarea
                      required
                      value={formData.message}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          message: e.target.value
                        })
                      }
                      rows={4}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-4 bg-brand-charcoal text-white font-bold rounded-xl hover:bg-black transition-colors flex justify-center items-center gap-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>

                </motion.form>
              )}

            </AnimatePresence>

          </div>
        </div>
      </div>
    </section>
  );
}