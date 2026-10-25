import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedButton from '../ui/AnimatedButton';

export default function Navigation({ theme = 'light' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Close menu when route changes is now handled by onClick on links

  // Lock scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [menuOpen]);

  // Handle scroll to transition nav background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: "Features", path: "/" },
    { title: "Submission", path: "/submission" },
    { title: "Intelligence", path: "/intelligence" },
    { title: "Blueprint", path: "/blueprint" },
    { title: "Sign Up", path: "/signup" },
    { title: "Login", path: "/login" }
  ];

  const isDark = theme === 'dark';

  const navBg = menuOpen
    ? 'bg-transparent'
    : scrolled
      ? (isDark ? 'bg-[#0f0f0f]/90 backdrop-blur-md border-b border-white/10 shadow-sm py-4' : 'bg-white/90 backdrop-blur-md border-b border-enerblock-dark/10 shadow-sm py-4')
      : (isDark ? 'bg-enerblock-dark border-b border-white/15 py-5' : 'bg-transparent py-6');

  const textColor = menuOpen || isDark ? 'text-white' : 'text-enerblock-dark';
  const iconColor = menuOpen || isDark ? 'bg-white' : 'bg-enerblock-dark';

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 px-6 lg:px-12 transition-all duration-300 flex justify-between items-center ${navBg}`}>

        {/* Logo */}
        <Link
          to="/"
          className={`font-bold text-2xl tracking-tighter uppercase headline z-[60] transition-colors duration-300 ${textColor}`}
        >
          BLUEOPS.
        </Link>



        {/* Right side controls */}
        <div className="flex items-center space-x-6 z-[60]">
          <Link to="/login" className={`hidden md:block text-xs uppercase tracking-widest font-bold transition-colors duration-300 ${textColor} hover:opacity-70`}>Login</Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex items-center gap-3 text-xs uppercase tracking-widest font-bold group transition-colors duration-300 ${textColor}`}
          >
            <div className="relative overflow-hidden h-4 w-12 hidden md:block">
              <span className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full flex items-center">MENU</span>
              <span className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full group-hover:translate-y-0 flex items-center">MENU</span>
            </div>
            {/* Hamburger Icon */}
            <div className="w-8 h-8 flex flex-col justify-center items-center gap-1.5">
              <span className={`w-6 h-px transition-all duration-300 ${iconColor} ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
              <span className={`w-6 h-px transition-all duration-300 ${iconColor} ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
            </div>
          </button>

          <AnimatedButton
            to="/submission"
            className={`px-6 py-2.5 rounded-none text-xs uppercase tracking-widest font-bold transition-all duration-300 hidden md:block ${menuOpen
                ? 'bg-white text-black hover:bg-enerblock-red hover:text-white'
                : isDark
                  ? 'bg-white text-enerblock-dark hover:bg-enerblock-red hover:text-white'
                  : 'bg-enerblock-dark text-white hover:bg-white hover:text-enerblock-dark border border-enerblock-dark/10'
              }`}
          >
            Download
          </AnimatedButton>
        </div>
      </nav>

      {/* Full Screen Overlay Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-enerblock-dark text-white flex flex-col justify-between pt-32 pb-12 px-6 lg:px-12"
          >
            <div className="flex flex-col gap-4 mt-12">
              {navLinks.map((link, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.6, delay: 0.2 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMenuOpen(false)}
                      className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter uppercase headline hover:text-enerblock-red transition-colors inline-block"
                    >
                      {link.title}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-between items-end border-t border-white/20 pt-8"
            >
              <div className="space-y-2 text-sm text-white/60 font-medium">
                <p>support@blueops.dev</p>
                <p>1-800-DEPLOY</p>
              </div>
              <div className="text-xs uppercase tracking-widest font-bold mono">
                © 2026 BlueOps
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
