import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import siteConfig from "@/config/siteConfig";

const WhatsAppButton = () => {
  const { whatsapp } = siteConfig;

  const [showHello, setShowHello] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [wiggle, setWiggle] = useState(false);

  const phoneNumber = whatsapp.phone;
  const baseMessage = whatsapp.message || "Bonjour, j’ai une question 🙂";
  const whatsappUrl = useMemo(() => {
    const message = encodeURIComponent(baseMessage);
    return `https://wa.me/${phoneNumber}?text=${message}`;
  }, [phoneNumber, baseMessage]);

  // ✅ Afficher les bulles 1x / jour max
  useEffect(() => {
    try {
      const key = "wa_nudge_last_seen";
      const last = localStorage.getItem(key);
      const now = Date.now();

      // 24h
      if (last && now - Number(last) < 24 * 60 * 60 * 1000) {
        return;
      }
      localStorage.setItem(key, String(now));

      const helloTimer = setTimeout(() => setShowHello(true), 2500);
      const helpTimer = setTimeout(() => setShowHelp(true), 5200);

      return () => {
        clearTimeout(helloTimer);
        clearTimeout(helpTimer);
      };
    } catch {
      // si localStorage bloqué -> on laisse l’expérience normale
      const helloTimer = setTimeout(() => setShowHello(true), 2500);
      const helpTimer = setTimeout(() => setShowHelp(true), 5200);
      return () => {
        clearTimeout(helloTimer);
        clearTimeout(helpTimer);
      };
    }
  }, []);

  // ✅ Petit “wiggle” discret périodique
  useEffect(() => {
    const t = setInterval(() => {
      setWiggle(true);
      setTimeout(() => setWiggle(false), 900);
    }, 12000);
    return () => clearInterval(t);
  }, []);

  if (!whatsapp.enabled) return null;

  const hideBubbles = () => {
    setDismissed(true);
    setShowHello(false);
    setShowHelp(false);
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
    >
      {/* Bulles (avec réassurance + CTA) */}
      <AnimatePresence>
        {!dismissed && showHello && (
          <motion.div
            key="hello"
            initial={{ opacity: 0, y: 18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className="absolute bottom-28 right-0 bg-white text-gray-900 px-4 py-3 rounded-2xl shadow-xl border border-gray-200 w-[260px]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">👋 Bonjour !</div>
                <div className="text-xs text-gray-600 mt-1">
                  ✅ On répond généralement{" "}
                  <span className="font-semibold">en 5 min</span>.
                </div>
              </div>
              <button
                onClick={hideBubbles}
                className="text-gray-400 hover:text-gray-600 text-sm leading-none"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                En ligne
              </span>
              <span className="text-xs text-gray-500">
                Gratuit • Sans engagement
              </span>
            </div>
          </motion.div>
        )}

        {!dismissed && showHelp && (
          <motion.div
            key="help"
            initial={{ opacity: 0, y: 18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-44 right-0 bg-white text-gray-900 px-4 py-3 rounded-2xl shadow-xl border border-gray-200 w-[280px]"
          >
            <div className="text-sm font-semibold">💬 Une question ?</div>
            <div className="text-xs text-gray-600 mt-1">
              Dites-moi ce que vous cherchez et je vous réponds tout de suite.
            </div>

            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center justify-center w-full bg-[#25D366] text-white text-sm font-semibold py-2 rounded-xl shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Démarrer sur WhatsApp →
            </motion.a>

            <div className="mt-2 text-[11px] text-gray-500">
              Exemples : “Devis”, “Tarifs”, “Rendez-vous”, “Question rapide”
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Texte au survol (desktop) */}
      <motion.span
        className="bg-[#25D366] text-white px-3 py-1 rounded-lg shadow-md text-sm font-medium whitespace-nowrap hidden md:block"
        initial={{ opacity: 0, x: 50 }}
        whileHover={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
        Réponse rapide sur WhatsApp
      </motion.span>

      {/* Bouton WhatsApp */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={whatsapp.ariaLabel}
        className="relative bg-[#25D366] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        animate={
          wiggle ? { rotate: [0, -8, 8, -6, 6, -3, 3, 0] } : { rotate: 0 }
        }
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {/* Badge notif */}
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow">
          1
        </span>

        {/* Pulsation */}
        <motion.span
          className="absolute w-full h-full rounded-full bg-[#25D366] opacity-75"
          animate={{ scale: [1, 1.45, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        />

        <FaWhatsapp className="w-8 h-8 relative z-10" />
      </motion.a>
    </motion.div>
  );
};

export default WhatsAppButton;
