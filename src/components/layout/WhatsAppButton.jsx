import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import siteConfig from "@/config/siteConfig";

const WhatsAppButton = () => {
  const { whatsapp } = siteConfig;

  const [showHello, setShowHello] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [wiggle, setWiggle] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const wiggleTimeoutRef = useRef(null);

  const phoneNumber = whatsapp?.phone || "";
  const baseMessage = whatsapp?.message || "Bonjour, j’ai une question 🙂";

  const whatsappUrl = useMemo(() => {
    const cleanedPhone = String(phoneNumber).replace(/[^\d]/g, "");
    const message = encodeURIComponent(baseMessage);
    return `https://wa.me/${cleanedPhone}?text=${message}`;
  }, [phoneNumber, baseMessage]);

  useEffect(() => {
    if (!whatsapp?.enabled) return;

    let helloTimer;
    let helpTimer;

    try {
      const key = "wa_nudge_last_seen";
      const last = localStorage.getItem(key);
      const now = Date.now();

      if (last && now - Number(last) < 24 * 60 * 60 * 1000) {
        return;
      }

      localStorage.setItem(key, String(now));

      helloTimer = setTimeout(() => setShowHello(true), 2200);
      helpTimer = setTimeout(() => setShowHelp(true), 4800);
    } catch {
      helloTimer = setTimeout(() => setShowHello(true), 2200);
      helpTimer = setTimeout(() => setShowHelp(true), 4800);
    }

    return () => {
      if (helloTimer) clearTimeout(helloTimer);
      if (helpTimer) clearTimeout(helpTimer);
    };
  }, [whatsapp?.enabled]);

  useEffect(() => {
    if (!whatsapp?.enabled || shouldReduceMotion) return;

    const interval = setInterval(() => {
      setWiggle(true);

      if (wiggleTimeoutRef.current) {
        clearTimeout(wiggleTimeoutRef.current);
      }

      wiggleTimeoutRef.current = setTimeout(() => {
        setWiggle(false);
      }, 900);
    }, 12000);

    return () => {
      clearInterval(interval);
      if (wiggleTimeoutRef.current) {
        clearTimeout(wiggleTimeoutRef.current);
      }
    };
  }, [whatsapp?.enabled, shouldReduceMotion]);

  if (!whatsapp?.enabled || !phoneNumber) return null;

  const hideBubbles = () => {
    setDismissed(true);
    setShowHello(false);
    setShowHelp(false);
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative flex items-end justify-end">
        <AnimatePresence>
          {!dismissed && showHelp && (
            <motion.div
              key="help"
              initial={
                shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.96 }
              }
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
              exit={
                shouldReduceMotion ? {} : { opacity: 0, y: 10, scale: 0.96 }
              }
              transition={{ duration: 0.35 }}
              className="absolute bottom-24 right-0 w-[min(86vw,300px)] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">💬 Une question ?</div>
                  <div className="mt-1 text-xs leading-5 text-gray-600">
                    Dites-moi ce que vous cherchez et je vous réponds
                    rapidement.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={hideBubbles}
                  className="text-sm leading-none text-gray-400 transition hover:text-gray-600"
                  aria-label="Fermer les messages WhatsApp"
                >
                  ✕
                </button>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
              >
                Démarrer sur WhatsApp →
              </a>

              <div className="mt-2 text-[11px] leading-4 text-gray-500">
                Exemples : “Devis”, “Tarifs”, “Rendez-vous”, “Question rapide”
              </div>
            </motion.div>
          )}

          {!dismissed && showHello && !showHelp && (
            <motion.div
              key="hello"
              initial={
                shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.96 }
              }
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
              exit={
                shouldReduceMotion ? {} : { opacity: 0, y: 10, scale: 0.96 }
              }
              transition={{ duration: 0.3 }}
              className="absolute bottom-24 right-0 w-[min(82vw,280px)] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">👋 Bonjour !</div>
                  <div className="mt-1 text-xs leading-5 text-gray-600">
                    Nous répondons généralement en{" "}
                    <span className="font-semibold">quelques minutes</span>.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={hideBubbles}
                  className="text-sm leading-none text-gray-400 transition hover:text-gray-600"
                  aria-label="Fermer le message de bienvenue"
                >
                  ✕
                </button>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  En ligne
                </span>

                <span className="text-xs text-gray-500">
                  Gratuit • Sans engagement
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="group relative">
          <div className="pointer-events-none absolute right-[72px] top-1/2 hidden -translate-y-1/2 md:block">
            <div className="translate-x-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              <span className="whitespace-nowrap rounded-lg bg-[#25D366] px-3 py-1.5 text-sm font-medium text-white shadow-md">
                Réponse rapide sur WhatsApp
              </span>
            </div>
          </div>

          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={whatsapp.ariaLabel || "Contacter sur WhatsApp"}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl sm:h-16 sm:w-16"
            whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.94 }}
            animate={
              shouldReduceMotion
                ? {}
                : wiggle
                ? { rotate: [0, -8, 8, -6, 6, -3, 3, 0] }
                : { rotate: 0 }
            }
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <motion.span
              className="absolute inset-0 rounded-full bg-[#25D366]"
              animate={
                shouldReduceMotion
                  ? {}
                  : { scale: [1, 1.42, 1], opacity: [0.45, 0, 0.45] }
              }
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />

            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow">
              1
            </span>

            <FaWhatsapp className="relative z-10 h-7 w-7 sm:h-8 sm:w-8" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default WhatsAppButton;
