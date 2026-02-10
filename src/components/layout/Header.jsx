import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import siteConfig from "@/config/siteConfig";
import { openMailto, CONTACT_EMAIL } from "@/lib/mailto";

/**
 * Header UX 2026 — RESPONSIVE PROPRE (tous écrans)
 * ✅ Mega menu centré + largeur clamp + ne déborde jamais
 * ✅ Mobile drawer full screen + accordéons
 * ✅ ESC ferme tout, scroll lock mobile
 * ✅ Dropdown hover + focus + “safe hover gap”
 */

const Header = ({ showToast }) => {
  const navigate = useNavigate();
  const { nav, contactInfo } = siteConfig;

  const navItems = nav?.navItems || [];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState({});

  const headerRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const closeAll = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
    setMobileOpen({});
  };

  const safeClearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openDropdown = (label) => {
    safeClearCloseTimeout();
    setActiveDropdown(label);
  };

  const scheduleCloseDropdown = () => {
    safeClearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 140);
  };

  const handleLinkClick = (link, e) => {
    e?.preventDefault?.();

    if (link?.isExternal && link?.path) {
      window.open(link.path, "_blank", "noopener,noreferrer");
      closeAll();
      return;
    }

    if (link?.path) {
      navigate(link.path);
      closeAll();
      return;
    }

    showToast && showToast();
    closeAll();
  };

  // scroll glass
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ESC close
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // lock body scroll on mobile menu
  useEffect(() => {
    if (!isMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMenuOpen]);

  // keep header height as CSS var (mega menu uses it)
  useEffect(() => {
    const setVar = () => {
      const h = headerRef.current?.getBoundingClientRect?.().height || 72;
      document.documentElement.style.setProperty("--hdr-h", `${Math.round(h)}px`);
    };
    setVar();
    window.addEventListener("resize", setVar);
    return () => window.removeEventListener("resize", setVar);
  }, []);

  // build a flat list for mobile mega menus
  const mobileLinks = (item) => {
    if (!item?.dropdown) return [];
    if (!item.isMegaMenu) return item.dropdown || [];
    return item.dropdown.flatMap((col) => col.links || []);
  };

  const phoneHref = useMemo(() => {
    const raw = contactInfo?.phone || "";
    return `tel:${raw.replace(/\s/g, "")}`;
  }, [contactInfo?.phone]);

  return (
    <motion.header
      ref={headerRef}
      className={[
        "fixed top-0 left-0 right-0 z-50",
        "transition-all duration-300",
        scrolled
          ? "backdrop-blur-xl bg-white/70 dark:bg-neutral-950/50 border-b border-black/5 dark:border-white/10 shadow-sm"
          : "bg-transparent",
      ].join(" ")}
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeAll}
            className="flex items-center gap-3"
            aria-label="Accueil"
          >
            <motion.img
              src="/logo.png"
              alt="Mon Fidèle Conseiller"
              className="h-10 sm:h-12 w-auto"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const hasDropdown = !!item.dropdown;
              const isOpen = activeDropdown === item.label;

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasDropdown && openDropdown(item.label)}
                  onMouseLeave={() => hasDropdown && scheduleCloseDropdown()}
                >
                  <button
                    type="button"
                    className={[
                      "px-3 py-2 rounded-xl",
                      "text-sm font-semibold",
                      "text-gray-800 dark:text-gray-100",
                      "hover:bg-black/5 dark:hover:bg-white/10",
                      "transition flex items-center gap-1.5",
                      isOpen ? "bg-black/5 dark:bg-white/10" : "",
                    ].join(" ")}
                    onClick={() => {
                      if (item.path) return navigate(item.path);
                      if (!hasDropdown) return showToast && showToast();
                      setActiveDropdown(isOpen ? null : item.label);
                    }}
                    onFocus={() => hasDropdown && openDropdown(item.label)}
                    aria-haspopup={hasDropdown ? "menu" : undefined}
                    aria-expanded={hasDropdown ? isOpen : undefined}
                  >
                    <span>{item.label}</span>
                    {hasDropdown && (
                      <ChevronDown
                        className={[
                          "h-4 w-4 transition",
                          isOpen ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    )}
                  </button>

                  {/* Dropdowns */}
                  <AnimatePresence>
                    {hasDropdown && isOpen && (
                      <>
                        {/* Safe hover gap */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute left-0 right-0 top-full h-3"
                        />

                        {/* ✅ MEGA MENU — fixed, centered, never overflow */}
                        {item.isMegaMenu ? (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.16 }}
                            onMouseEnter={() => openDropdown(item.label)}
                            onMouseLeave={() => scheduleCloseDropdown()}
                            className={[
                              "fixed z-[60]",
                              // position under header, always visible
                              "left-0 right-0",
                              "top-[calc(var(--hdr-h,72px)+8px)]",
                            ].join(" ")}
                          >
                            {/* viewport padding so it never touches edges */}
                            <div className="px-4 sm:px-6 lg:px-8">
                              {/* clamp width → responsive all screens */}
                              <div className="mx-auto w-full max-w-[1120px]">
                                <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/95 dark:bg-neutral-950/90 backdrop-blur-xl shadow-2xl overflow-hidden">
                                  {/* header strip (optional “pro” look) */}
                                  <div className="px-6 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
                                    <div className="text-sm font-extrabold text-gray-900 dark:text-white">
                                      {item.label}
                                    </div>
                                    <button
                                      type="button"
                                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                                      onClick={() => setActiveDropdown(null)}
                                    >
                                      Fermer
                                    </button>
                                  </div>

                                  {/* content */}
                                  <div className="p-4 sm:p-6">
                                    {/* ✅ grid adapts (2 cols tablet, 3 cols desktop) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                      {item.dropdown.map((col) => (
                                        <div key={col.title} className="min-w-0">
                                          <h3 className="font-black text-xs uppercase tracking-wider text-orange-600 mb-3">
                                            {col.title}
                                          </h3>

                                          <ul className="space-y-1">
                                            {(col.links || []).map((link) => (
                                              <li key={link.label} className="min-w-0">
                                                <button
                                                  onClick={(e) => handleLinkClick(link, e)}
                                                  className={[
                                                    "w-full text-left",
                                                    "rounded-xl px-3 py-2",
                                                    "text-gray-900 dark:text-gray-100",
                                                    "hover:bg-orange-50 dark:hover:bg-white/10 hover:text-orange-600",
                                                    "transition",
                                                    "truncate",
                                                  ].join(" ")}
                                                  title={link.label}
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
                                </div>

                                {/* subtle pointer illusion (optional) */}
                                <div className="pointer-events-none mx-auto mt-2 h-1 w-24 rounded-full bg-black/10 dark:bg-white/10" />
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          /* ✅ SIMPLE DROPDOWN — centered & responsive */
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            transition={{ duration: 0.14 }}
                            className={[
                              "absolute z-[60]",
                              "left-1/2 -translate-x-1/2 top-full pt-3",
                              // responsive width clamp
                              "w-[min(320px,calc(100vw-24px))]",
                            ].join(" ")}
                            onMouseEnter={() => openDropdown(item.label)}
                            onMouseLeave={() => scheduleCloseDropdown()}
                          >
                            <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/95 dark:bg-neutral-950/90 backdrop-blur-xl shadow-xl p-2">
                              {(item.dropdown || []).map((subItem) => (
                                <button
                                  key={subItem.label}
                                  onClick={(e) => handleLinkClick(subItem, e)}
                                  className="w-full text-left rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-black/5 dark:hover:bg-white/10 transition"
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
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={phoneHref}
              className="hidden lg:flex items-center gap-2 rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 px-3 py-2 backdrop-blur hover:bg-white/80 dark:hover:bg-white/10 transition"
            >
              <Phone className="h-4 w-4 text-orange-600" />
              <div className="leading-tight">
                <div className="text-[11px] font-semibold text-orange-600">
                  {contactInfo?.headerPrompt || "Appelez-nous"}
                </div>
                <div className="text-sm font-black text-gray-900 dark:text-white">
                  {contactInfo?.phone}
                </div>
              </div>
            </a>

            <Button
              onClick={() => openMailto(CONTACT_EMAIL, "Contact – Mon Fidèle Conseiller")}
              className="rounded-2xl px-5 font-bold"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur px-3 py-2 text-gray-900 dark:text-white"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* overlay */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAll}
            />

            <motion.div
              className="fixed inset-x-0 top-0 z-[70] h-[100dvh] bg-white dark:bg-neutral-950"
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 26 }}
            >
              {/* top bar */}
              <div className="flex items-center justify-between px-4 sm:px-6 h-16 border-b border-black/5 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="Mon Fidèle Conseiller" className="h-9 w-auto" />
                  <div className="font-extrabold text-gray-900 dark:text-white">Menu</div>
                </div>
                <button
                  onClick={closeAll}
                  className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-2"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5 text-gray-900 dark:text-white" />
                </button>
              </div>

              {/* content */}
              <div className="px-4 sm:px-6 py-5 space-y-3 overflow-y-auto h-[calc(100dvh-64px)]">
                {navItems.map((item) => {
                  const hasDropdown = !!item.dropdown;
                  const isOpen = !!mobileOpen[item.label];
                  const links = hasDropdown ? mobileLinks(item) : [];

                  if (!hasDropdown) {
                    return (
                      <button
                        key={item.label}
                        onClick={(e) => handleLinkClick(item, e)}
                        className="w-full text-left rounded-2xl border border-black/5 dark:border-white/10 px-4 py-4 bg-black/[0.02] dark:bg-white/[0.04] hover:bg-black/[0.04] dark:hover:bg-white/[0.07] transition"
                      >
                        <div className="font-bold text-gray-900 dark:text-white">{item.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Accéder</div>
                      </button>
                    );
                  }

                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden"
                    >
                      <button
                        className="w-full flex items-center justify-between px-4 py-4 bg-black/[0.02] dark:bg-white/[0.04]"
                        onClick={() =>
                          setMobileOpen((p) => ({ ...p, [item.label]: !p[item.label] }))
                        }
                        aria-expanded={isOpen}
                      >
                        <div className="text-left">
                          <div className="font-bold text-gray-900 dark:text-white">{item.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {links.length} options
                          </div>
                        </div>
                        <ChevronDown className={["h-5 w-5 transition", isOpen ? "rotate-180" : ""].join(" ")} />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="bg-white dark:bg-neutral-950"
                          >
                            <div className="p-3">
                              {/* ✅ grid adapts, never overflow */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {links.map((subItem) => (
                                  <button
                                    key={subItem.label}
                                    onClick={(e) => handleLinkClick(subItem, e)}
                                    className="text-left rounded-xl px-3 py-3 border border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition"
                                  >
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                      {subItem.label}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ouvrir</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* CTA zone */}
                <div className="pt-2 space-y-3">
                  <a
                    href={phoneHref}
                    className="w-full flex items-center justify-between rounded-2xl border border-black/5 dark:border-white/10 px-4 py-4 bg-black/[0.02] dark:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-semibold text-orange-600">
                          {contactInfo?.headerPrompt || "Appelez-nous"}
                        </div>
                        <div className="font-black text-gray-900 dark:text-white">
                          {contactInfo?.phone}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Appeler</span>
                  </a>

                  <Button
                    className="w-full rounded-2xl py-6 font-black text-base"
                    onClick={() => {
                      openMailto(CONTACT_EMAIL, "Contact – Mon Fidèle Conseiller");
                      closeAll();
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contacter un conseiller
                  </Button>

                  <button
                    onClick={closeAll}
                    className="w-full text-center text-xs text-gray-500 dark:text-gray-400 underline"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
