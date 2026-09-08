import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, LogIn, ChefHat } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to admin dashboard
    const isLoggedIn = localStorage.getItem('rs_admin_auth');

    if (isLoggedIn === 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Hardcoded credentials for prototype
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('rs_admin_auth', 'true');
      navigate('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, #D4AF37 0%, transparent 50%)'
        }}
      ></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-gold/30">
            <Lock className="w-8 h-8 text-brand-gold" />
          </div>

          <h1 className="text-3xl font-serif text-brand-cream">
            Admin Portal
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Sign in to manage restaurant operations
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Username
            </label>

            <input
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Password
            </label>

            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-brand-gold text-brand-charcoal font-bold rounded-xl hover:bg-yellow-500 transition-colors flex justify-center items-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <ChefHat size={16} />
            Royal Spice Management
          </p>
        </div>
      </motion.div>
    </div>
  );
}