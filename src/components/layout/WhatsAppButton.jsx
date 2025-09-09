import React from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import siteConfig from "@/config/siteConfig";

const WhatsAppButton = () => {
  const { whatsapp } = siteConfig;
  const phoneNumber = whatsapp.phone;
  const message = encodeURIComponent(whatsapp.message);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  if (!whatsapp.enabled) {
    return null;
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
    >
      {/* Texte qui apparaît au survol */}
      <motion.span
        className="bg-[#25D366] text-white px-3 py-1 rounded-lg shadow-md text-sm font-medium whitespace-nowrap hidden md:block"
        initial={{ opacity: 0, x: 50 }}
        whileHover={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        Écrivez-nous !
      </motion.span>

      {/* Bouton WhatsApp */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={whatsapp.ariaLabel}
        className="relative bg-[#25D366] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Effet pulsation */}
        <motion.span
          className="absolute w-full h-full rounded-full bg-[#25D366] opacity-75"
          animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        <FaWhatsapp className="w-8 h-8 relative z-10" />
      </motion.a>
    </motion.div>
  );
};

export default WhatsAppButton;
