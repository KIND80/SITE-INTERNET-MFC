import React, { useEffect, useMemo, useRef, useState } from "react";
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

/* ----------------------- TopSheet (Portal, responsive) ------------------ */
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

  // Largeurs pour ≥ sm (desktop/tablette)
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

          {/* Conteneur : plein écran sur mobile, feuille centrée sur ≥ sm */}
          <motion.div
            className={[
              "fixed z-[1000]",
              // MOBILE: plein écran
              "inset-x-0 top-0 w-screen sm:w-auto",
              "sm:left-1/2 sm:-translate-x-1/2",
              // petit offset de 12px en desktop pour l'effet "top sheet"
              "sm:top-0",
              maxWClass,
            ].join(" ")}
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 12, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
          >
            <div
              className={[
                // MOBILE: plein écran + pas d'arrondis
                "relative bg-white/85 dark:bg-neutral-900/75 backdrop-blur-xl shadow-2xl",
                "border border-border",
                "sm:rounded-2xl sm:mx-0",
                "rounded-none",
                // Hauteurs et scroll internes
                "max-h-[100dvh] sm:max-h-[calc(100dvh-24px)]",
                "h-[100dvh] sm:h-auto",
                "overflow-y-auto",
                // Safe areas iOS
                "pt-[max(env(safe-area-inset-top),16px)] pb-[max(env(safe-area-inset-bottom),16px)]",
                "px-4 sm:px-0",
              ].join(" ")}
            >
              {/* halo */}
              <div className="pointer-events-none absolute -inset-1 sm:rounded-2xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-emerald-400/20 blur-2xl" />
              <div className="relative p-5 sm:p-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
/* ----------------------------------------------------------------------- */

// Icônes
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);
const SparklesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.623L17.25 21.75l-.352-1.127a3.375 3.375 0 00-2.456-2.456L13.5 18l1.127-.352a3.375 3.375 0 002.456-2.456L17.25 14.25l.352 1.127a3.375 3.375 0 00 2.456 2.456L21 18.375l-1.127.352a3.375 3.375 0 00-2.456 2.456z"
    />
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

/* ----------------------------- Questions ------------------------------ */
/**
 * ✅ Upgrade: groups + search + future scalability.
 * Tu peux enrichir la liste sans casser l’UI.
 */
const questions = [
  { id: "optique", label: "Lunettes ou lentilles", group: "Soins" },
  { id: "med_alt", label: "Médecines alternatives", group: "Soins" },
  { id: "meds_hors_base", label: "Médicaments hors base", group: "Soins" },
  { id: "prevention", label: "Prévention (vaccins, check-up)", group: "Prévention" },
  { id: "fitness", label: "Fitness / Sport", group: "Bien-être" },
  { id: "voyage", label: "Voyages à l’étranger", group: "Voyage" },
  { id: "hosp_semi", label: "Hospitalisation semi-privé", group: "Hospitalisation" },
  { id: "hosp_privee", label: "Hospitalisation privé", group: "Hospitalisation" },
  { id: "maternite", label: "Couverture maternité", group: "Famille" },
];

/* ------------------------------- Helpers ------------------------------ */
const encodeText = (s) => encodeURIComponent(s);

function toLocalDatetimeInputValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function getCoverageCount(result, choices) {
  if (!Array.isArray(result?.prestations)) return 0;
  return result.prestations.filter((p) => choices[p.critere]).length;
}

function getCoveragePct(result, selectedNeedsCount, choices) {
  if (!selectedNeedsCount) return 0;
  const covered = getCoverageCount(result, choices);
  return Math.round((covered / selectedNeedsCount) * 100);
}

function getTopStrengths(result, choices, limit = 3) {
  if (!Array.isArray(result?.prestations)) return [];
  const matches = result.prestations
    .filter((p) => choices[p.critere])
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, limit);
  return matches.map((p) => p.critere);
}

function getWeakSpot(result, choices) {
  if (!Array.isArray(result?.prestations)) return null;
  const missed = result.prestations
    .filter((p) => !choices[p.critere])
    .sort((a, b) => (b.score || 0) - (a.score || 0));
  return missed[0]?.critere || null;
}

function buildWhatsAppLink({
  phone,
  motif,
  datetimeISO,
  top3,
  selectedNeeds,
  priority,
  messageMode = "full", // "full" | "quick"
}) {
  const dateText = datetimeISO ? new Date(datetimeISO).toLocaleString() : "à définir";

  const needsText = selectedNeeds.length
    ? selectedNeeds
        .map((id) => questions.find((q) => q.id === id)?.label || id)
        .join(", ")
    : "non précisé";

  const top3Text = (top3 || [])
    .map((r, i) => `#${i + 1} ${r.caisse} – ${r.produit} (${r.totalScore} pts)`)
    .join("\n");

  const priorityText =
    priority === "budget"
      ? "Budget"
      : priority === "premium"
      ? "Premium"
      : "Équilibré";

  const msgQuick = `Bonjour 👋\n\nJe viens du comparateur et j’aimerais un avis rapide.\nPriorité: ${priorityText}\nBesoins: ${needsText}\n\nPouvez-vous me conseiller ? Merci !`;

  const msgFull = `Bonjour 👋, je viens de terminer ma comparaison et je souhaite prendre RDV.

• Raison: ${motif}
• Créneau souhaité: ${dateText}
• Priorité: ${priorityText}
• Besoins principaux: ${needsText}

Mes résultats TOP 3:
${top3Text || "—"}

Pouvez-vous me confirmer la disponibilité ? Merci !`;

  return `https://wa.me/${phone}?text=${encodeText(messageMode === "quick" ? msgQuick : msgFull)}`;
}

/* --------------------------------------------------------------------- */

const ComparatorPage = () => {
  const [choices, setChoices] = useState({});
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  // ✅ NEW: UX options
  const [qSearch, setQSearch] = useState("");
  const [openGroups, setOpenGroups] = useState({});
  const [priority, setPriority] = useState("balanced"); // "budget" | "balanced" | "premium"
  const [showAll, setShowAll] = useState(false);
  const [sortMode, setSortMode] = useState("score"); // "score" | "coverage"
  const [compareOpen, setCompareOpen] = useState(false);

  // Popup “Prendre RDV”
  const [showBooking, setShowBooking] = useState(false);
  const [bookingReason, setBookingReason] = useState("Obtenir un devis personnalisé");
  const [bookingWhen, setBookingWhen] = useState("");
  const [popupCountdown, setPopupCountdown] = useState(0); // affichage UX

  // Timers
  const popupTimerRef = useRef(null);
  const popupIntervalRef = useRef(null);

  // Scroll results
  const resultsRef = useRef(null);

  const { toast } = useToast();

  // init choices + phone + restore
  useEffect(() => {
    const initialChoices = questions.reduce((acc, q) => ({ ...acc, [q.id]: false }), {});
    const storageKey = "mfc_comparator_state_v1";

    // Essaie restore
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setChoices({ ...initialChoices, ...(parsed.choices || {}) });
        setPriority(parsed.priority || "balanced");
        setShowAll(!!parsed.showAll);
        setSortMode(parsed.sortMode || "score");
      } else {
        setChoices(initialChoices);
      }
    } catch {
      setChoices(initialChoices);
    }

    // Essaie de lire window.siteConfig.whatsapp.phone si dispo
    try {
      const siteConfig = window && window.siteConfig;
      if (siteConfig?.whatsapp?.phone) {
        WHATSAPP_PHONE = siteConfig.whatsapp.phone;
      }
    } catch {}
  }, []);

  // persist light (choices + options)
  useEffect(() => {
    const storageKey = "mfc_comparator_state_v1";
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ choices, priority, showAll, sortMode })
      );
    } catch {}
  }, [choices, priority, showAll, sortMode]);

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

  const setAll = (value) => {
    setChoices((prev) => {
      const next = { ...prev };
      for (const q of questions) next[q.id] = value;
      return next;
    });
  };

  const selectedNeeds = useMemo(() => Object.keys(choices).filter((k) => choices[k]), [choices]);

  // Filter + group
  const filteredQuestions = useMemo(() => {
    const s = qSearch.trim().toLowerCase();
    if (!s) return questions;
    return questions.filter((q) => q.label.toLowerCase().includes(s));
  }, [qSearch]);

  const groupedQuestions = useMemo(() => {
    const map = new Map();
    for (const q of filteredQuestions) {
      const g = q.group || "Autres";
      if (!map.has(g)) map.set(g, []);
      map.get(g).push(q);
    }
    return Array.from(map.entries());
  }, [filteredQuestions]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setResults([]);
    clearPopupTimer();

    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      // ✅ compatible: si ton calculateTop3 accepte un 2e param, il l’utilise, sinon il ignore.
      const topResults = calculateTop3(choices, { priority });
      setResults(topResults);

      if (topResults.length > 0) {
        toast({
          title: "Comparaison réussie ✨",
          description: "Voici vos meilleures correspondances.",
        });

        // scroll vers résultats
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
      } else {
        toast({
          variant: "default",
          title: "Aucun résultat spécifique",
          description: "Essayez d’ajuster vos critères.",
        });
      }
    } catch (error) {
      console.error("Erreur lors du calcul :", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'effectuer la comparaison.",
      });
    } finally {
      setTimeout(() => setIsLoading(false), 350);
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
    setSelectedInsurance(null);
    setCompareOpen(false);
    setQSearch("");
    setShowAll(false);
    setSortMode("score");
    setPriority("balanced");
    clearPopupTimer();
  };

  const getDialogDetails = () => {
    if (!selectedInsurance) return { matched: [], others: [] };
    const matched = (selectedInsurance.prestations || []).filter((p) => choices[p.critere]);
    const others = (selectedInsurance.prestations || []).filter(
      (p) => !choices[p.critere] && p.score >= 2
    );
    return { matched, others };
  };

  // Results display with sort + showAll
  const displayedResults = useMemo(() => {
    const list = [...(results || [])];

    const coverageOf = (r) => getCoverageCount(r, choices);

    list.sort((a, b) => {
      if (sortMode === "coverage") return coverageOf(b) - coverageOf(a);
      return (b.totalScore || 0) - (a.totalScore || 0);
    });

    return showAll ? list : list.slice(0, 3);
  }, [results, showAll, sortMode, choices]);

  // Keep "top style" for top3 mode
  const top3StyledOrder = useMemo(() => {
    if (showAll) return displayedResults;
    if (displayedResults.length === 3) return [displayedResults[1], displayedResults[0], displayedResults[2]];
    return displayedResults;
  }, [displayedResults, showAll]);

  // Progress ring (countdown)
  const Ring = ({ value, max = 10, size = 36, stroke = 4 }) => {
    const radius = (size - stroke) / 2;
    const c = 2 * Math.PI * radius;
    const offset = c - (value / max) * c;
    return (
      <svg width={size} height={size} className="shrink-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-300 ease-linear"
        />
      </svg>
    );
  };

  // Compare data
  const compareA = results?.[0] || null;
  const compareB = results?.[1] || null;

  const buildCompareRows = (a, b) => {
    const rows = [];

    // d’abord besoins sélectionnés (meilleure UX)
    for (const id of selectedNeeds) {
      const label = questions.find((q) => q.id === id)?.label || id;

      const pa = Array.isArray(a?.prestations) ? a.prestations.find((p) => p.critere === id) : null;
      const pb = Array.isArray(b?.prestations) ? b.prestations.find((p) => p.critere === id) : null;

      rows.push({
        id,
        label,
        aScore: pa?.score ?? 0,
        bScore: pb?.score ?? 0,
        aDesc: pa?.description || "",
        bDesc: pb?.description || "",
        selected: true,
      });
    }

    // puis autres avantages (score >=2)
    const union = new Set();
    const addAdv = (r) => {
      if (!Array.isArray(r?.prestations)) return;
      r.prestations.forEach((p) => {
        if ((p.score || 0) >= 2 && !choices[p.critere]) union.add(p.critere);
      });
    };
    addAdv(a);
    addAdv(b);

    for (const id of Array.from(union)) {
      const label = questions.find((q) => q.id === id)?.label || id;
      const pa = Array.isArray(a?.prestations) ? a.prestations.find((p) => p.critere === id) : null;
      const pb = Array.isArray(b?.prestations) ? b.prestations.find((p) => p.critere === id) : null;

      rows.push({
        id,
        label,
        aScore: pa?.score ?? 0,
        bScore: pb?.score ?? 0,
        aDesc: pa?.description || "",
        bDesc: pb?.description || "",
        selected: false,
      });
    }

    return rows;
  };

  const compareRows = useMemo(() => buildCompareRows(compareA, compareB), [compareA, compareB, selectedNeeds, choices]);

  return (
    <PageTransition>
      {/* fond “premium” */}
      <div className="relative min-h-[calc(100vh-80px)] bg-background text-foreground overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
        </div>

        <div className="container py-10 md:py-16 relative">
          {/* Titre */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 uppercase">
              Votre Assurance Sur-Mesure
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Cochez vos besoins, choisissez votre priorité, et obtenez des recommandations claires + comparables.
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

          {/* ✅ NEW: Priorité (impact énorme sur l’UX et la conversion) */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="rounded-2xl border border-border bg-card/70 backdrop-blur p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-bold">Votre priorité</p>
                  <p className="text-xs text-muted-foreground">Ça guide le classement (budget vs premium).</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPriority("budget")}
                    className={`px-3 py-2 rounded-xl text-sm border transition ${
                      priority === "budget"
                        ? "border-transparent bg-gradient-to-r from-primary to-purple-500 text-white"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    💸 Budget
                  </button>
                  <button
                    onClick={() => setPriority("balanced")}
                    className={`px-3 py-2 rounded-xl text-sm border transition ${
                      priority === "balanced"
                        ? "border-transparent bg-gradient-to-r from-primary to-purple-500 text-white"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    ⚖️ Équilibre
                  </button>
                  <button
                    onClick={() => setPriority("premium")}
                    className={`px-3 py-2 rounded-xl text-sm border transition ${
                      priority === "premium"
                        ? "border-transparent bg-gradient-to-r from-primary to-purple-500 text-white"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    👑 Premium
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ NEW: Search + quick actions */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <input
                value={qSearch}
                onChange={(e) => setQSearch(e.target.value)}
                placeholder="Rechercher un besoin… (optique, voyage, hospitalisation...)"
                className="w-full rounded-xl border border-border bg-card/70 backdrop-blur px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setAll(true)}>
                  Tout cocher
                </Button>
                <Button variant="outline" onClick={() => setAll(false)}>
                  Tout décocher
                </Button>
              </div>
            </div>

            {/* Sticky mini summary mobile */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-3 py-1">
                <span className="opacity-70">Besoins sélectionnés</span>
                <span className="font-bold">{selectedNeeds.length}</span>
              </div>
              <button
                onClick={() => setQSearch("")}
                className="underline opacity-70 hover:opacity-100"
              >
                Réinitialiser la recherche
              </button>
            </div>
          </div>

          {/* ✅ NEW: Grouped checklist (scalable & premium) */}
          <motion.div className="space-y-6 mb-10 max-w-6xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {groupedQuestions.map(([group, items]) => {
              const isOpen = openGroups[group] ?? true;
              return (
                <div
                  key={group}
                  className="rounded-2xl border border-border bg-card/60 backdrop-blur overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between px-5 py-4"
                    onClick={() => setOpenGroups((p) => ({ ...p, [group]: !isOpen }))}
                  >
                    <div className="text-left">
                      <p className="font-bold">{group}</p>
                      <p className="text-xs text-muted-foreground">{items.length} options</p>
                    </div>
                    <span className="text-xs opacity-70">{isOpen ? "Masquer" : "Afficher"}</span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {items.map((q) => {
                            const active = !!choices[q.id];
                            return (
                              <label
                                key={q.id}
                                className={`group relative flex items-center justify-between w-full p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                  active
                                    ? "bg-primary/10 border-primary shadow-xl shadow-primary/10"
                                    : "bg-background border-border hover:border-primary/50"
                                }`}
                              >
                                <span className="font-semibold text-sm">{q.label}</span>
                                <div
                                  className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${
                                    active ? "bg-primary text-primary-foreground" : "bg-muted"
                                  }`}
                                >
                                  {active && <CheckIcon />}
                                </div>
                                <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10" />
                                <input
                                  type="checkbox"
                                  checked={active}
                                  onChange={() => handleChoiceChange(q.id)}
                                  className="sr-only"
                                />
                              </label>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={isLoading}
              className="font-bold px-10 py-7 text-lg hover:scale-[1.01] transition"
            >
              {isLoading ? (
                "Analyse en cours..."
              ) : (
                <div className="flex items-center">
                  <SparklesIcon /> Trouver mes résultats
                </div>
              )}
            </Button>

            {results.length > 0 && !isLoading && (
              <Button
                size="lg"
                variant="outline"
                onClick={handleReset}
                className="font-bold px-10 py-7 text-lg hover:scale-[1.01] transition"
              >
                Recommencer
              </Button>
            )}
          </div>

          {/* Résultats */}
          <div className="mt-14" ref={resultsRef}>
            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div
                  key="loader"
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-muted-foreground font-semibold">
                    Nous analysons des centaines d'options pour vous...
                  </p>
                </motion.div>
              )}

              {!isLoading && results.length > 0 && (
                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
                  {/* ✅ NEW: controls results */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Button variant={showAll ? "outline" : "default"} onClick={() => setShowAll(false)}>
                        Top 3
                      </Button>
                      <Button variant={showAll ? "default" : "outline"} onClick={() => setShowAll(true)}>
                        Tout afficher
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Trier par</span>
                      <Button variant={sortMode === "score" ? "default" : "outline"} onClick={() => setSortMode("score")}>
                        Score
                      </Button>
                      <Button
                        variant={sortMode === "coverage" ? "default" : "outline"}
                        onClick={() => setSortMode("coverage")}
                      >
                        Couverture
                      </Button>
                    </div>
                  </div>

                  {/* ✅ NEW: compare CTA */}
                  {results.length >= 2 && !showAll && (
                    <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => setCompareOpen(true)}
                      >
                        Comparer TOP 1 vs TOP 2
                      </Button>
                      <Button
                        className="w-full sm:w-auto font-bold bg-gradient-to-r from-emerald-500 to-primary text-white hover:opacity-95"
                        onClick={() => setShowBooking(true)}
                      >
                        Finaliser avec un conseiller
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => {
                          const link = buildWhatsAppLink({
                            phone: WHATSAPP_PHONE,
                            motif: "Avis rapide",
                            datetimeISO: undefined,
                            top3: results || [],
                            selectedNeeds,
                            priority,
                            messageMode: "quick",
                          });
                          window.open(link, "_blank");
                        }}
                      >
                        <WhatsIcon /> Avis rapide (WhatsApp)
                      </Button>
                    </div>
                  )}

                  <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 items-stretch justify-center gap-8"
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: {},
                      show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
                    }}
                  >
                    {top3StyledOrder.map((res, index) => {
                      // Styling "Top 3" seulement si showAll = false
                      const isTop1 = !showAll && ((results.length >= 3 && index === 1) || (results.length < 3 && index === 0));
                      const rank = showAll ? index + 1 : isTop1 ? 1 : index === 0 ? 2 : 3;

                      const cardColors = {
                        1: { bg: "bg-card-top3-gold", text: "text-card-top3-gold", border: "border-t-card-top3-gold", bottom: "border-b-card-top3-gold" },
                        2: { bg: "bg-card-top3-silver", text: "text-card-top3-silver", border: "border-t-card-top3-silver", bottom: "border-b-card-top3-silver" },
                        3: { bg: "bg-card-top3-bronze", text: "text-card-top3-bronze", border: "border-t-card-top3-bronze", bottom: "border-b-card-top3-bronze" },
                      };
                      const colors = cardColors[rank] || cardColors[3];

                      const covered = getCoverageCount(res, choices);
                      const pct = getCoveragePct(res, selectedNeeds.length, choices);

                      const strengths = getTopStrengths(res, choices, 3).map(
                        (id) => questions.find((q) => q.id === id)?.label || id
                      );
                      const weak = getWeakSpot(res, choices);
                      const weakLabel = weak ? questions.find((q) => q.id === weak)?.label || weak : null;

                      return (
                        <motion.div
                          key={`${res.caisse}-${res.produit}-${index}`}
                          variants={{
                            hidden: { opacity: 0, y: 28 },
                            show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 110 } },
                          }}
                          whileHover={{ y: -6, scale: 1.02 }}
                          className={`relative bg-card rounded-2xl border border-border shadow-lg w-full max-w-xl overflow-hidden flex flex-col p-8 transition-all duration-300 ${
                            isTop1
                              ? "lg:-translate-y-4 lg:scale-105 lg:shadow-2xl z-10 ring-1 ring-primary/20"
                              : "hover:shadow-xl"
                          }`}
                        >
                          {!showAll && isTop1 && (
                            <div className="absolute -left-10 top-6 rotate-[-35deg] bg-gradient-to-r from-primary to-purple-500 text-white px-10 py-1 text-[10px] font-black tracking-widest shadow">
                              MEILLEUR MATCH
                            </div>
                          )}

                          {!showAll && (
                            <>
                              <div
                                className={`corner-triangle absolute top-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-t-[60px] ${colors.border}`}
                              />
                              <div
                                className={`corner-bottom absolute bottom-0 left-0 w-0 h-0 border-r-[60px] border-r-transparent border-b-[60px] ${colors.bottom}`}
                              />
                            </>
                          )}

                          <div className="flex items-center justify-between mb-4">
                            <h2 className={`text-2xl font-extrabold ${!showAll ? colors.text : "text-foreground"}`}>
                              {showAll ? `#${rank}` : `TOP ${rank}`}
                            </h2>
                            <div className="text-xs font-bold px-3 py-1 rounded-full bg-muted">
                              {covered} / {selectedNeeds.length || 0} besoins • {pct}%
                            </div>
                          </div>

                          <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center mb-6 text-white ${!showAll ? colors.bg : "bg-gradient-to-r from-primary to-purple-500"} shadow-inner`}>
                            <span className="text-4xl font-black">{res.totalScore}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              Score
                            </span>
                          </div>

                          <div className="flex-grow mb-5">
                            <h3 className="text-xl font-bold text-foreground">{res.caisse}</h3>
                            <p className="text-sm text-muted-foreground">{res.produit}</p>

                            {/* ✅ NEW: Why this match */}
                            <div className="mt-4 rounded-xl border border-border bg-background/50 p-4">
                              <p className="text-sm font-semibold">Pourquoi ce résultat ?</p>
                              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                {strengths.length ? (
                                  strengths.map((t) => (
                                    <li key={t} className="flex items-start gap-2">
                                      <span className="mt-[6px] inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                                      <span>{t}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-xs">Aucun besoin sélectionné (choisissez 1-2 options pour affiner).</li>
                                )}
                              </ul>
                              {weakLabel && (
                                <p className="mt-3 text-xs text-muted-foreground">
                                  ⚠️ Potentiel point faible : <span className="font-medium text-foreground">{weakLabel}</span>
                                </p>
                              )}
                            </div>

                            {/* Liste courte des matches */}
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
                            <Button
                              variant="outline"
                              className="w-full font-bold hover:scale-[1.01]"
                              onClick={() => setSelectedInsurance(res)}
                            >
                              Voir les détails
                            </Button>
                            <Button
                              className={`w-full font-bold uppercase tracking-wider ${
                                !showAll ? colors.bg : "bg-gradient-to-r from-emerald-500 to-primary"
                              } text-white hover:opacity-90 hover:scale-[1.01]`}
                              onClick={() => setShowBooking(true)}
                            >
                              Prendre RDV
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Détails produit — Dialog shadcn */}
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
                      <h4 className="text-lg font-semibold text-foreground mb-3">
                        Correspond à vos besoins
                      </h4>
                      <div className="space-y-4">
                        {getDialogDetails().matched.map((p) => (
                          <div key={p.critere}>
                            <div className="flex justify-between items-center">
                              <p className="font-semibold text-foreground">
                                {questions.find((q) => q.id === p.critere)?.label || p.critere}
                              </p>
                              <span
                                className={`text-xs font-bold px-2 py-1 rounded-full ${
                                  p.score >= 3
                                    ? "bg-green-500/20 text-green-500"
                                    : p.score >= 2
                                    ? "bg-blue-500/20 text-blue-500"
                                    : "bg-amber-500/20 text-amber-500"
                                }`}
                              >
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
                        <h4 className="text-lg font-semibold text-foreground mb-3">
                          Autres avantages inclus
                        </h4>
                        <div className="space-y-4">
                          {getDialogDetails().others.map((p) => (
                            <div key={p.critere}>
                              <div className="flex justify-between items-center">
                                <p className="font-semibold text-foreground">
                                  {questions.find((q) => q.id === p.critere)?.label || p.critere}
                                </p>
                                <span
                                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                                    p.score >= 3
                                      ? "bg-green-500/20 text-green-500"
                                      : "bg-blue-500/20 text-blue-500"
                                  }`}
                                >
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

          {/* ✅ NEW: Compare Top 1 vs Top 2 (Dialog) */}
          <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
            <DialogContent className="sm:max-w-5xl bg-card">
              <DialogHeader>
                <DialogTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                  Comparaison TOP 1 vs TOP 2
                </DialogTitle>
                <DialogDescription>
                  Vos besoins sélectionnés d’abord, puis les autres avantages importants.
                </DialogDescription>
              </DialogHeader>

              {!compareA || !compareB ? (
                <div className="py-6 text-sm text-muted-foreground">
                  Pas assez de résultats pour comparer.
                </div>
              ) : (
                <div className="py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="rounded-xl border border-border bg-background/60 p-4">
                      <p className="text-sm font-bold">{compareA.caisse}</p>
                      <p className="text-xs text-muted-foreground">{compareA.produit}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/60 p-4">
                      <p className="text-sm font-bold">{compareB.caisse}</p>
                      <p className="text-xs text-muted-foreground">{compareB.produit}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="min-w-[900px] w-full text-sm">
                      <thead className="bg-muted/40">
                        <tr>
                          <th className="text-left p-3 font-semibold w-[280px]">Critère</th>
                          <th className="text-left p-3 font-semibold">{compareA.caisse}</th>
                          <th className="text-left p-3 font-semibold">{compareB.caisse}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {compareRows.map((row) => {
                          const aGood = row.aScore >= 2;
                          const bGood = row.bScore >= 2;

                          return (
                            <tr key={row.id} className={row.selected ? "bg-background" : "bg-background/60"}>
                              <td className="p-3 border-t border-border">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{row.label}</span>
                                  {row.selected && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                      sélectionné
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 border-t border-border align-top">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                    aGood ? "bg-green-500/15 text-green-600" : "bg-amber-500/15 text-amber-600"
                                  }`}>
                                    {row.aScore}/3
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {aGood ? "✅ Bon" : "⚠️ Moyen"}
                                  </span>
                                </div>
                                {row.aDesc && (
                                  <p className="mt-2 text-xs text-muted-foreground">{row.aDesc}</p>
                                )}
                              </td>
                              <td className="p-3 border-t border-border align-top">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                    bGood ? "bg-green-500/15 text-green-600" : "bg-amber-500/15 text-amber-600"
                                  }`}>
                                    {row.bScore}/3
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {bGood ? "✅ Bon" : "⚠️ Moyen"}
                                  </span>
                                </div>
                                {row.bDesc && (
                                  <p className="mt-2 text-xs text-muted-foreground">{row.bDesc}</p>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <Button
                      className="font-bold bg-gradient-to-r from-emerald-500 to-primary text-white hover:opacity-95"
                      onClick={() => {
                        const link = buildWhatsAppLink({
                          phone: WHATSAPP_PHONE,
                          motif: "Comparaison TOP 1 vs TOP 2",
                          datetimeISO: undefined,
                          top3: results || [],
                          selectedNeeds,
                          priority,
                          messageMode: "quick",
                        });
                        window.open(link, "_blank");
                      }}
                    >
                      <WhatsIcon /> Envoyer la comparaison (WhatsApp)
                    </Button>
                    <Button variant="outline" onClick={() => setCompareOpen(false)}>
                      Fermer
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Popup RDV — TopSheet sexy, toujours visible en haut */}
      <TopSheet open={showBooking} onClose={() => setShowBooking(false)} maxWidth="lg">
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
              {[
                { t: "Aujourd’hui AM", addH: 3 },
                { t: "Aujourd’hui PM", addH: 6 },
                {
                  t: "Demain 10h",
                  addH: 24 + Math.max(0, 10 - new Date().getHours()),
                },
              ].map((opt) => (
                <button
                  key={opt.t}
                  onClick={() => {
                    const dt = new Date();
                    dt.setHours(dt.getHours() + opt.addH, 0, 0, 0);
                    setBookingWhen(toLocalDatetimeInputValue(dt));
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="relative overflow-hidden"
              onClick={() => {
                const subject = encodeText("Demande de RDV – Comparateur complémentaires");
                const body = encodeText(
                  `Bonjour,\n\nJe souhaite un RDV.\nRaison: ${bookingReason}\nCréneau: ${
                    bookingWhen || "à définir"
                  }\nPriorité: ${priority}\nBesoins: ${
                    selectedNeeds
                      .map((id) => questions.find((q) => q.id === id)?.label || id)
                      .join(", ") || "non précisé"
                  }\n\nMerci !`
                );
                window.location.href = `mailto:contact@monfideleconseiller.ch?subject=${subject}&body=${body}`;
              }}
            >
              Être rappelé (email)
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                const link = buildWhatsAppLink({
                  phone: WHATSAPP_PHONE,
                  motif: "Avis rapide",
                  datetimeISO: undefined,
                  top3: results || [],
                  selectedNeeds,
                  priority,
                  messageMode: "quick",
                });
                window.open(link, "_blank");
              }}
            >
              <WhatsIcon /> Avis rapide
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
                  priority,
                  messageMode: "full",
                });
                window.open(link, "_blank");
              }}
            >
              <WhatsIcon /> Envoyer (WhatsApp)
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Astuce : vous pouvez modifier le texte dans WhatsApp avant l’envoi.
          </p>

          {/* Close */}
          <div className="pt-2 text-right">
            <button
              onClick={() => setShowBooking(false)}
              className="text-xs underline opacity-70 hover:opacity-100"
            >
              Fermer
            </button>
          </div>
        </div>
      </TopSheet>
    </PageTransition>
  );
};

export default ComparatorPage;
