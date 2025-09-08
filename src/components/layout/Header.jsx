import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import siteConfig from '@/config/siteConfig';
import { openMailto, CONTACT_EMAIL } from '@/lib/mailto';

const Header = ({ showToast }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { nav, contactInfo, logoUrl } = siteConfig;

  let menuLeaveTimeout;

  const handleMenuEnter = (label) => {
    clearTimeout(menuLeaveTimeout);
    setActiveDropdown(label);
  };

  const handleMenuLeave = () => {
    menuLeaveTimeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(menuLeaveTimeout);
    };
  }, []);

  const closeAll = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleLinkClick = (link, e) => {
    e.preventDefault();
    if (link.isExternal) {
      window.open(link.path, '_blank', 'noopener,noreferrer');
    } else if (link.path) {
      navigate(link.path);
    } else {
      showToast && showToast();
    }
    closeAll();
  };

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-effect shadow-lg' : 'bg-transparent'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center" onClick={closeAll}>
            <motion.div className="flex items-center cursor-pointer" whileHover={{ scale: 1.05 }}>
              <img src={logoUrl} alt="Mon Fidèle Conseiller" className="h-12 w-auto" />
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {nav.navItems.map((item) => (
              <div
                key={item.label}
                className={item.isMegaMenu ? 'static' : 'relative'}
                onMouseEnter={() => item.dropdown && handleMenuEnter(item.label)}
                onMouseLeave={handleMenuLeave}
              >
                <div
                  onClick={() =>
                    item.path ? navigate(item.path) : (item.dropdown && setActiveDropdown(activeDropdown === item.label ? null : item.label))
                  }
                  className="flex items-center text-gray-700 hover:gradient-text transition-colors font-medium cursor-pointer"
                >
                  {item.path ? <Link to={item.path}>{item.label}</Link> : item.label}
                  {item.dropdown && <ChevronDown className="ml-1 h-4 w-4" />}
                </div>

                <AnimatePresence>
                  {activeDropdown === item.label && (
                    <>
                      {item.isMegaMenu ? (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 w-full pt-3"
                        >
                          <div className="max-w-7xl mx-auto">
                            <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl p-8 grid grid-cols-4 gap-x-8 gap-y-4 border border-gray-100">
                              {item.dropdown.map((col) => (
                                <div key={col.title}>
                                  <h3 className="font-bold text-sm uppercase tracking-wider text-orange-600 mb-4">{col.title}</h3>
                                  <ul className="space-y-3">
                                    {col.links.map((link) => (
                                      <li key={link.label}>
                                        <button
                                          onClick={(e) => handleLinkClick(link, e)}
                                          className="text-gray-700 hover:text-orange-500 transition-colors text-left w-full"
                                        >
                                          {link.label}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-56"
                        >
                          <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-xl py-2 border border-gray-100">
                            {item.dropdown.map((subItem) => (
                              <button
                                key={subItem.label}
                                onClick={(e) => handleLinkClick(subItem, e)}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                              >
                                {subItem.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-right">
              <span className="text-xs text-orange-600 font-semibold">{contactInfo.headerPrompt}</span>
              <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="block font-bold text-gray-800 hover:gradient-text">
                {contactInfo.phone}
              </a>
            </div>

            {/* Contact → email */}
            <Button
              onClick={() => openMailto(CONTACT_EMAIL, 'Contact – Mon Fidèle Conseiller')}
              className="btn-primary rounded-full font-semibold px-6"
            >
              Contact
            </Button>
          </div>

          {/* Mobile burger */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-800">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-effect border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-4">
              {nav.navItems.map((item) => (
                <div key={item.label}>
                  {item.path ? (
                    <button
                      onClick={(e) => handleLinkClick(item, e)}
                      className="block w-full text-left text-gray-700 hover:text-orange-600 font-medium"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <div className="text-gray-700 font-medium">
                      <span className="block w-full text-left">{item.label}</span>
                      {item.isMegaMenu ? (
                        <div className="pl-4 mt-2 space-y-2">
                          {item.dropdown.flatMap((col) => col.links).map((subItem) => (
                            <button
                              key={subItem.label}
                              onClick={(e) => handleLinkClick(subItem, e)}
                              className="block w-full text-left text-gray-600 hover:text-orange-600"
                            >
                              {subItem.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        item.dropdown && (
                          <div className="pl-4 mt-2 space-y-2">
                            {item.dropdown.map((subItem) => (
                              <button
                                key={subItem.label}
                                onClick={(e) => handleLinkClick(subItem, e)}
                                className="block w-full text-left text-gray-600 hover:text-orange-600"
                              >
                                {subItem.label}
                              </button>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Contact mobile → email */}
              <Button
                className="w-full btn-primary rounded-full"
                onClick={() => {
                  openMailto(CONTACT_EMAIL, 'Contact – Mon Fidèle Conseiller');
                  closeAll();
                }}
              >
                Contact
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;