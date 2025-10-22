import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

// Import de notre moteur de calcul local
import { calculateTop3 } from "@/lib/scoringEngine";

// Vos composants UI
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import PageTransition from "@/components/layout/PageTransition";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog.jsx";

// (OPTIONNEL) remplace par ton numéro si pas de siteConfig global
let WHATSAPP_PHONE = "41797896193";

/* ----------------------- TopSheet (Portal, fixé en haut) ------------------ */
const TopSheet = ({ open, onClose, children, maxWidth = "md" }) => {
  if (typeof document === "undefined") return null;

  // lock scroll du body quand ouvert
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // fermer sur ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const maxWClass =
    maxWidth === "lg"
      ? "sm:max-w-lg md:max-w-xl"
      : maxWidth === "xl"
      ? "sm:max-w-xl md:max-w-2xl"
      : "sm:max-w-md md:max-w-lg";

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[999] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Feuille en haut */}
          <motion.div
            className={`fixed z-[1000] left-1/2 top-0 -translate-x-1/2 w-[92vw] ${maxWClass}`}
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 12, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
          >
            <div
              className="
                relative rounded-2xl border border-border
                bg-white/85 dark:bg-neutral-900/75 backdrop-blur-xl shadow-2xl
                max-h-[calc(100dvh-24px)] overflow-y-auto
              "
            >
              {/* halo */}
              <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-emerald-400/20 blur-2xl" />
              <div className="relative p-5 sm:p-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
/* ------------------------------------------------------------------------- */

// Icônes
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.623L17.25 21.75l-.352-1.127a3.375 3.375 0 00-2.456-2.456L13.5 18l1.127-.352a3.375 3.375 0 002.456-2.456L17.25 14.25l.352 1.127a3.375 3.375 0 002.456 2.456L21 18.375l-1.127.352a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);
const WhatsIcon = () => (
  <svg viewBox="0 0 32 32" className="w-5 h-5 mr-2" aria-hidden>
    <path
      fill="currentColor"
      d="M19.11 17.38a4.55 4.55 0 0 1-2.17-.59c-.33-.18-.72-.43-1.16-.76a9.27 9.27 0 0 1-1.47-1.41 6.16 6.16 0 0 1-1.05-1.69c-.2-.48-.3-.88-.3-1.2 0-.36.1-.66.33-.91.22-.24.5-.36.85-.36.11 0 .2 0 .27.02.09.03.19.14.31.33l.4.7c.13.22.22.4.3.55.09.16.13.3.13.43 0 .2-.06.4-.2.62l-.26.38c-.06.1-.1.18-.1.25 0 .1.06.23.2.39.4.52.8.95 1.21 1.29.4.34.83.63 1.28.88.14.08.26.12.36.12.07 0 .16-.02.25-.07l.55-.37c.18-.12.34-.18.49-.18.15 0 .3.04.47.12l.98.5c.18.1.32.2.42.3.09.1.14.22.14.36 0 .22-.13.49-.38.82-.25.33-.54.61-.87.84-.33.23-.66.35-.99.35zM16 29C8.82 29 3 23.18 3 16S8.82 3 16 3s13 5.82 13 13-5.82 13-13 13zm0-23C9.91 6 5 10.91 5 17c0 2.26.7 4.36 1.9 6.08L6 28l5.08-.86A10.93 10.93 0 0 0 27 17c0-6.09-4.91-11-11-11z"
    />
  </svg>
);

// Questionnaire
const questions = [
  { id: "optique", label: "Lunettes ou lentilles" },
  { id: "med_alt", label: "Médecines alternatives" },
  { id: "fitness", label: "Fitness / Sport" },
  { id: "voyage", label: "Voyages à l’étranger" },
  { id: "hosp_semi", label: "Hospitalisation semi-privé" },
  { id: "hosp_privee", label: "Hospitalisation privé" },
  { id: "meds_hors_base", label: "Médicaments hors base" },
  { id: "maternite", label: "Couverture maternité" },
  { id: "prevention", label: "Prévention (vaccins, check-up)" },
];

// Helpers
const encodeText = (s) => encodeURIComponent(s);

function buildWhatsAppLink({ phone, motif, datetimeISO, top3, selectedNeeds }) {
  const dateText = datetimeISO ? new Date(datetimeISO).toLocaleString() : "à définir";
  const needsText = selectedNeeds.length
    ? selectedNeeds.map((id) => questions.find((q) => q.id === id)?.label || id).join(", ")
    : "non précisé";

  const top3Text = (top3 || [])
    .map((r, i) => `#${i + 1} ${r.caisse} – ${r.produit} (${r.totalScore} pts)`)
    .join("\n");

  const msg = `Bonjour 👋, je viens de terminer ma comparaison et je souhaite prendre RDV.

• Raison: ${motif}
• Créneau souhaité: ${dateText}
• Besoins principaux: ${needsText}

Mes résultats TOP 3:
${top3Text || "—"}

Pouvez-vous me confirmer la disponibilité ? Merci !`;

  return `https://wa.me/${phone}?text=${encodeText(msg)}`;
}

const ComparatorPage = () => {
  const [choices, setChoices] = useState({});
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  // Popup “Prendre RDV”
  const [showBooking, setShowBooking] = useState(false);
  const [bookingReason, setBookingReason] = useState("Obtenir un devis personnalisé");
  const [bookingWhen, setBookingWhen] = useState("");
  const [popupCountdown, setPopupCountdown] = useState(0); // affichage UX

  // Timers
  const popupTimerRef = useRef(null);
  const popupIntervalRef = useRef(null);

  const { toast } = useToast();

  useEffect(() => {
    const initialChoices = questions.reduce((acc, q) => ({ ...acc, [q.id]: false }), {});
    setChoices(initialChoices);

    // Essaie de lire window.siteConfig.whatsapp.phone si dispo
    try {
      const siteConfig = window && window.siteConfig;
      if (siteConfig?.whatsapp?.phone) {
        WHATSAPP_PHONE = siteConfig.whatsapp.phone;
      }
    } catch {}
  }, []);

  // Nettoyage des timers
  const clearPopupTimer = () => {
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
      popupTimerRef.current = null;
    }
    if (popupIntervalRef.current) {
      clearInterval(popupIntervalRef.current);
      popupIntervalRef.current = null;
    }
    setPopupCountdown(0);
  };

  const handleChoiceChange = (id) => {
    setChoices((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedNeeds = useMemo(() => Object.keys(choices).filter((k) => choices[k]), [choices]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setResults([]);
    clearPopupTimer();
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const topResults = calculateTop3(choices);
      setResults(topResults);

      if (topResults.length > 0) {
        toast({ title: "Comparaison réussie ✨", description: "Voici vos 3 meilleures correspondances." });
      } else {
        toast({ variant: "default", title: "Aucun résultat spécifique", description: "Essayez d’ajuster vos critères." });
      }
    } catch (error) {
      console.error("Erreur lors du calcul :", error);
      toast({ variant: "destructive", title: "Erreur", description: "Impossible d'effectuer la comparaison." });
    } finally {
      setTimeout(() => setIsLoading(false), 400);
    }
  };

  // Lance le pop 10s après l'affichage des résultats
  useEffect(() => {
    if (!results || results.length === 0 || showBooking) {
      clearPopupTimer();
      return;
    }

    setPopupCountdown(10);
    let secs = 10;

    popupIntervalRef.current = setInterval(() => {
      secs -= 1;
      setPopupCountdown(secs);
      if (secs <= 0 && popupIntervalRef.current) {
        clearInterval(popupIntervalRef.current);
        popupIntervalRef.current = null;
      }
    }, 1000);

    popupTimerRef.current = setTimeout(() => {
      setShowBooking(true);
      setPopupCountdown(0);
    }, 10000);

    return () => clearPopupTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, showBooking]);

  const handleReset = () => {
    const initialChoices = questions.reduce((acc, q) => ({ ...acc, [q.id]: false }), {});
    setChoices(initialChoices);
    setResults([]);
    setShowBooking(false);
    clearPopupTimer();
  };

  const getDialogDetails = () => {
    if (!selectedInsurance) return { matched: [], others: [] };
    const matched = (selectedInsurance.prestations || []).filter((p) => choices[p.critere]);
    const others = (selectedInsurance.prestations || []).filter((p) => !choices[p.critere] && p.score >= 2);
    return { matched, others };
  };

  const orderedResults = results.length === 3 ? [results[1], results[0], results[2]] : results;

  // Progress ring
  const Ring = ({ value, max = 10, size = 36, stroke = 4 }) => {
    const radius = (size - stroke) / 2;
    const c = 2 * Math.PI * radius;
    const offset = c - (value / max) * c;
    return (
      <svg width={size} height={size} className="shrink-0">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeOpacity="0.15" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={stroke} fill="none" strokeDasharray={c} strokeDashoffset={offset} className="transition-[stroke-dashoffset] duration-300 ease-linear" />
      </svg>
    );
  };

  return (
    <PageTransition>
      {/* fond “premium” */}
      <div className="relative min-h-[calc(100vh-80px)] bg-background text-foreground overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
        </div>

        <div className="container py-12 md:py-20 relative">
          {/* Titre */}
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 uppercase">
              Votre Assurance Sur-Mesure
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Cochez vos besoins et laissez notre algorithme trouver les 3 complémentaires qui matchent vraiment.
            </p>

            {/* mini info “le popup arrive dans …” */}
            <AnimatePresence>
              {popupCountdown > 0 && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-3 py-1 text-xs"
                >
                  <span className="opacity-70">Conseil gratuit dans</span>
                  <div className="flex items-center gap-2 font-semibold">
                    <Ring value={10 - popupCountdown} />
                    <span>{popupCountdown}s</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Checklist */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
            initial="hidden"
            animate="show"
          >
            {questions.map((q) => {
              const active = !!choices[q.id];
              return (
                <motion.div key={q.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                  <label
                    className={`group relative flex items-center justify-between w-full p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      active ? "bg-primary/10 border-primary shadow-xl shadow-primary/10" : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="font-semibold">{q.label}</span>
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${active ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      {active && <CheckIcon />}
                    </div>
                    <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10" />
                    <input type="checkbox" checked={active} onChange={() => handleChoiceChange(q.id)} className="sr-only" />
                  </label>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleSubmit} disabled={isLoading} className="font-bold px-10 py-7 text-lg hover:scale-[1.01] transition">
              {isLoading ? (
                "Analyse en cours..."
              ) : (
                <div className="flex items-center">
                  <SparklesIcon /> Trouver mon Top 3
                </div>
              )}
            </Button>
            {results.length > 0 && !isLoading && (
              <Button size="lg" variant="outline" onClick={handleReset} className="font-bold px-10 py-7 text-lg hover:scale-[1.01] transition">
                Recommencer
              </Button>
            )}
          </div>

          {/* Résultats */}
          <div className="mt-20">
            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div key="loader" className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-muted-foreground font-semibold">Nous analysons des centaines d'options pour vous...</p>
                </motion.div>
              )}

              {!isLoading && results.length > 0 && (
                <motion.div
                  key="results"
                  className="grid grid-cols-1 lg:grid-cols-3 items-stretch justify-center gap-8"
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
                >
                  {orderedResults.map((res, index) => {
                    const isTop1 = (results.length === 3 && index === 1) || (results.length < 3 && index === 0);
                    const rank = isTop1 ? 1 : index === 0 ? 2 : 3;

                    const cardColors = {
                      1: { bg: "bg-card-top3-gold", text: "text-card-top3-gold", border: "border-t-card-top3-gold", bottom: "border-b-card-top3-gold" },
                      2: { bg: "bg-card-top3-silver", text: "text-card-top3-silver", border: "border-t-card-top3-silver", bottom: "border-b-card-top3-silver" },
                      3: { bg: "bg-card-top3-bronze", text: "text-card-top3-bronze", border: "border-t-card-top3-bronze", bottom: "border-b-card-top3-bronze" },
                    };
                    const colors = cardColors[rank] || cardColors[3];

                    const matchCount = Array.isArray(res?.prestations) ? res.prestations.filter((p) => choices[p.critere]).length : 0;

                    return (
                      <motion.div
                        key={`${res.caisse}-${res.produit}`}
                        variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className={`relative bg-card rounded-2xl border border-border shadow-lg w-full max-w-xl overflow-hidden flex flex-col p-8 transition-all duration-300 ${
                          isTop1 ? "lg:-translate-y-4 lg:scale-105 lg:shadow-2xl z-10 ring-1 ring-primary/20" : "hover:shadow-xl"
                        }`}
                      >
                        {isTop1 && (
                          <div className="absolute -left-10 top-6 rotate-[-35deg] bg-gradient-to-r from-primary to-purple-500 text-white px-10 py-1 text-[10px] font-black tracking-widest shadow">
                            MEILLEUR MATCH
                          </div>
                        )}

                        <div className={`corner-triangle absolute top-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-t-[60px] ${colors.border}`} />
                        <div className={`corner-bottom absolute bottom-0 left-0 w-0 h-0 border-r-[60px] border-r-transparent border-b-[60px] ${colors.bottom}`} />

                        <div className="flex items-center justify-between mb-4">
                          <h2 className={`text-2xl font-extrabold ${colors.text}`}>{`TOP ${rank}`}</h2>
                          <div className="text-xs font-bold px-3 py-1 rounded-full bg-muted">
                            {matchCount} / {selectedNeeds.length || 0} besoins couverts
                          </div>
                        </div>

                        <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center mb-6 text-white ${colors.bg} shadow-inner`}>
                          <span className="text-4xl font-black">{res.totalScore}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider">Points</span>
                        </div>

                        <div className="flex-grow mb-6">
                          <h3 className="text-xl font-bold text-foreground">{res.caisse}</h3>
                          <p className="text-sm text-muted-foreground">{res.produit}</p>

                          {Array.isArray(res?.prestations) && res.prestations.length > 0 && (
                            <ul className="mt-4 space-y-2">
                              {res.prestations
                                .filter((p) => choices[p.critere])
                                .slice(0, 3)
                                .map((p) => (
                                  <li key={p.critere} className="text-sm flex items-start gap-2">
                                    <span className="mt-[6px] inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                                    <span className="text-muted-foreground">
                                      <span className="font-medium text-foreground">
                                        {questions.find((q) => q.id === p.critere)?.label || p.critere}
                                      </span>
                                      {p.description ? ` — ${p.description}` : ""}
                                    </span>
                                  </li>
                                ))}
                            </ul>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Button variant="outline" className="w-full font-bold hover:scale-[1.01]" onClick={() => setSelectedInsurance(res)}>
                            Voir les détails
                          </Button>
                          <Button className={`w-full font-bold uppercase tracking-wider ${colors.bg} hover:opacity-90 hover:scale-[1.01]`} onClick={() => setShowBooking(true)}>
                            Prendre RDV
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Détails produit — tu peux garder le Dialog shadcn */}
          <Dialog open={!!selectedInsurance} onOpenChange={() => setSelectedInsurance(null)}>
            <DialogContent className="sm:max-w-md bg-card">
              {selectedInsurance && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                      {selectedInsurance.caisse} — {selectedInsurance.produit}
                    </DialogTitle>
                    <DialogDescription>Aperçu des prestations de ce produit.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-3">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-3">Correspond à vos besoins</h4>
                      <div className="space-y-4">
                        {getDialogDetails().matched.map((p) => (
                          <div key={p.critere}>
                            <div className="flex justify-between items-center">
                              <p className="font-semibold text-foreground">{questions.find((q) => q.id === p.critere)?.label || p.critere}</p>
                              <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.score >= 3 ? "bg-green-500/20 text-green-500" : p.score >= 2 ? "bg-blue-500/20 text-blue-500" : "bg-amber-500/20 text-amber-500"}`}>
                                Score {p.score}/3
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {getDialogDetails().others.length > 0 && (
                      <div className="pt-6 border-t border-border">
                        <h4 className="text-lg font-semibold text-foreground mb-3">Autres avantages inclus</h4>
                        <div className="space-y-4">
                          {getDialogDetails().others.map((p) => (
                            <div key={p.critere}>
                              <div className="flex justify-between items-center">
                                <p className="font-semibold text-foreground">{questions.find((q) => q.id === p.critere)?.label || p.critere}</p>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.score >= 3 ? "bg-green-500/20 text-green-500" : "bg-blue-500/20 text-blue-500"}`}>
                                  Score {p.score}/3
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Popup RDV — TopSheet sexy, toujours visible en haut */}
      <TopSheet
        open={showBooking}
        onClose={() => setShowBooking(false)}
        maxWidth="lg"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Finalisez en 1 minute avec un conseiller
            </h3>
            <p className="text-sm text-muted-foreground">
              Choisissez une raison et un créneau — envoi direct par WhatsApp ou email.
            </p>
          </div>

          {/* Chips raisons rapides */}
          <div>
            <p className="text-sm font-medium mb-2">Raison du RDV</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Obtenir un devis personnalisé",
                "Optimiser mes primes",
                "Vérifier mes couvertures",
                "Résiliation / changement de caisse",
                "Autre question",
              ].map((label) => {
                const active = bookingReason === label;
                return (
                  <button
                    key={label}
                    onClick={() => setBookingReason(label)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition ${
                      active
                        ? "border-transparent bg-gradient-to-r from-primary to-purple-500 text-white"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Créneau rapide + personnalisé */}
          <div>
            <p className="text-sm font-medium mb-2">Créneau souhaité (optionnel)</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[{ t: "Aujourd’hui AM", addH: 3 }, { t: "Aujourd’hui PM", addH: 6 }, { t: "Demain 10h", addH: 24 + (10 - new Date().getHours()) }].map((opt) => (
                <button
                  key={opt.t}
                  onClick={() => {
                    const dt = new Date();
                    dt.setHours(dt.getHours() + opt.addH, 0, 0, 0);
                    setBookingWhen(dt.toISOString().slice(0, 16));
                  }}
                  className="text-xs border border-border rounded-md px-2 py-2 hover:border-primary/50 hover:bg-primary/5"
                >
                  {opt.t}
                </button>
              ))}
            </div>
            <input
              type="datetime-local"
              value={bookingWhen}
              onChange={(e) => setBookingWhen(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Besoins cochés */}
          <div className="text-sm">
            <p className="font-medium mb-2">Vos besoins cochés</p>
            {selectedNeeds.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedNeeds.map((id) => (
                  <span key={id} className="text-[11px] px-2 py-1 rounded-full bg-muted">
                    {questions.find((q) => q.id === id)?.label || id}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucun besoin spécifié</p>
            )}
          </div>

          {/* CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="relative overflow-hidden"
              onClick={() => {
                const subject = encodeText("Demande de RDV – Comparateur complémentaires");
                const body = encodeText(
                  `Bonjour,\n\nJe souhaite un RDV.\nRaison: ${bookingReason}\nCréneau: ${
                    bookingWhen || "à définir"
                  }\nBesoins: ${
                    selectedNeeds.map((id) => questions.find((q) => q.id === id)?.label || id).join(", ") || "non précisé"
                  }\n\nMerci !`
                );
                window.location.href = `mailto:contact@monfideleconseiller.ch?subject=${subject}&body=${body}`;
              }}
            >
              Être rappelé par email
            </Button>

            <Button
              className="font-bold bg-gradient-to-r from-emerald-500 to-primary text-white hover:opacity-95"
              onClick={() => {
                const link = buildWhatsAppLink({
                  phone: WHATSAPP_PHONE,
                  motif: bookingReason,
                  datetimeISO: bookingWhen || undefined,
                  top3: results || [],
                  selectedNeeds,
                });
                window.open(link, "_blank");
              }}
            >
              <WhatsIcon /> Envoyer via WhatsApp
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Astuce : vous pouvez modifier le texte dans WhatsApp avant l’envoi.
          </p>

          {/* Close */}
          <div className="pt-2 text-right">
            <button onClick={() => setShowBooking(false)} className="text-xs underline opacity-70 hover:opacity-100">
              Fermer
            </button>
          </div>
        </div>
      </TopSheet>
    </PageTransition>
  );
};

export default ComparatorPage;
