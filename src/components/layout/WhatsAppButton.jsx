import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import siteConfig from '@/config/siteConfig';

const WhatsAppButton = () => {
  const { whatsapp } = siteConfig;
  const phoneNumber = whatsapp.phone;
  const message = encodeURIComponent(whatsapp.message);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  if (!whatsapp.enabled) {
    return null;
  }

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={whatsapp.ariaLabel}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-[#128C7E] transition-colors duration-300"
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <FaWhatsapp className="w-8 h-8" />
    </motion.a>
  );
};

export default WhatsAppButton;