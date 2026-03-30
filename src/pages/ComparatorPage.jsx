import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { calculateTop3 } from "@/lib/scoringEngine";
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

let WHATSAPP_PHONE = "41797896193";

const TopSheet = ({ open, onClose, children, maxWidth = "md" }) => {
  if (typeof document === "undefined") return null;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
          <motion.div
            className="fixed inset-0 z-[999] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={[
              "fixed z-[1000]",
              "inset-x-0 top-0 w-screen sm:w-auto",
              "sm:left-1/2 sm:-translate-x-1/2",
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
                "relative bg-white/95 dark:bg-neutral-900/90 backdrop-blur-xl shadow-2xl",
                "border border-border",
                "sm:rounded-2xl sm:mx-0",
                "rounded-none",
                "max-h-[100dvh] sm:max-h-[calc(100dvh-24px)]",
                "h-[100dvh] sm:h-auto",
                "overflow-y-auto",
                "pt-[max(env(safe-area-inset-top),16px)] pb-[max(env(safe-area-inset-bottom),16px)]",
                "px-4 sm:px-0",
              ].join(" ")}
            >
              <div className="pointer-events-none absolute -inset-1 sm:rounded-2xl bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 blur-2xl" />
              <div className="relative p-5 sm:p-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

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
    className="w-5 h-5 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
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

const questions = [
  {
    id: "optique",
    label: "Lunettes ou lentilles",
    group: "Soins",
    desc: "Optique et correction visuelle",
  },
  {
    id: "med_alt",
    label: "Médecines alternatives",
    group: "Soins",
    desc: "Ostéopathie, acupuncture, etc.",
  },
  {
    id: "meds_hors_base",
    label: "Médicaments hors base",
    group: "Soins",
    desc: "Prise en charge élargie",
  },
  {
    id: "prevention",
    label: "Prévention",
    group: "Prévention",
    desc: "Vaccins, check-up, dépistage",
  },
  {
    id: "fitness",
    label: "Fitness / sport",
    group: "Bien-être",
    desc: "Abonnements et activités sportives",
  },
  {
    id: "voyage",
    label: "Voyages à l’étranger",
    group: "Voyage",
    desc: "Urgences et soins hors Suisse",
  },
  {
    id: "hosp_semi",
    label: "Hospitalisation semi-privée",
    group: "Hospitalisation",
    desc: "Chambre à deux lits",
  },
  {
    id: "hosp_privee",
    label: "Hospitalisation privée",
    group: "Hospitalisation",
    desc: "Chambre individuelle",
  },
  {
    id: "maternite",
    label: "Couverture maternité",
    group: "Famille",
    desc: "Prestations renforcées",
  },
];

const encodeText = (s) => encodeURIComponent(s);

function toLocalDatetimeInputValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
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
  return result.prestations
    .filter((p) => choices[p.critere])
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, limit)
    .map((p) => p.critere);
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
  messageMode = "full",
}) {
  const dateText = datetimeISO
    ? new Date(datetimeISO).toLocaleString()
    : "à définir";

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
      ? "Couverture maximale"
      : "Équilibré";

  const msgQuick = `Bonjour,

Je viens du comparateur de complémentaires et j’aimerais un avis rapide.

Priorité : ${priorityText}
Besoins : ${needsText}

Pouvez-vous me conseiller ? Merci.`;

  const msgFull = `Bonjour,

Je viens de terminer ma comparaison et je souhaite être accompagné.

Motif : ${motif}
Créneau souhaité : ${dateText}
Priorité : ${priorityText}
Besoins principaux : ${needsText}

Mes résultats TOP 3 :
${top3Text || "—"}

Pouvez-vous me confirmer la suite ? Merci.`;

  return `https://wa.me/${phone}?text=${encodeText(
    messageMode === "quick" ? msgQuick : msgFull
  )}`;
}

const WizardStep = ({ number, title, active, done }) => (
  <div className="flex items-center gap-3">
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition ${
        done
          ? "bg-primary text-white"
          : active
          ? "bg-primary/10 text-primary border border-primary/30"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {done ? <CheckIcon /> : number}
    </div>
    <div>
      <p
        className={`text-sm font-semibold ${
          active || done ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {title}
      </p>
    </div>
  </div>
);

export default function ComparatorPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const [choices, setChoices] = useState({});
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  const [qSearch, setQSearch] = useState("");
  const [priority, setPriority] = useState("balanced");
  const [showAll, setShowAll] = useState(false);
  const [sortMode, setSortMode] = useState("score");
  const [compareOpen, setCompareOpen] = useState(false);

  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadForm, setLeadForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [showBooking, setShowBooking] = useState(false);
  const [bookingReason, setBookingReason] = useState(
    "Obtenir un devis personnalisé"
  );
  const [bookingWhen, setBookingWhen] = useState("");
  const [popupCountdown, setPopupCountdown] = useState(0);

  const popupTimerRef = useRef(null);
  const popupIntervalRef = useRef(null);
  const resultsRef = useRef(null);

  const { toast } = useToast();

  useEffect(() => {
    const initialChoices = questions.reduce(
      (acc, q) => ({ ...acc, [q.id]: false }),
      {}
    );
    setChoices(initialChoices);

    try {
      const siteConfig = window && window.siteConfig;
      if (siteConfig?.whatsapp?.phone) {
        WHATSAPP_PHONE = siteConfig.whatsapp.phone;
      }
    } catch {}
  }, []);

  const clearPopupTimer = () => {
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    if (popupIntervalRef.current) clearInterval(popupIntervalRef.current);
    popupTimerRef.current = null;
    popupIntervalRef.current = null;
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

  const selectedNeeds = useMemo(
    () => Object.keys(choices).filter((k) => choices[k]),
    [choices]
  );

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

  const runComparison = async () => {
    setIsLoading(true);
    setResults([]);
    clearPopupTimer();

    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const topResults = calculateTop3(choices, { priority });
      setResults(topResults);
      setCurrentStep(3);

      toast({
        title: "Comparaison effectuée",
        description:
          "Voici les solutions les plus pertinentes selon vos critères.",
      });

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'effectuer la comparaison.",
      });
    } finally {
      setTimeout(() => setIsLoading(false), 350);
    }
  };

  const handleOpenLeadCapture = () => {
    if (!leadForm.email) {
      setShowLeadCapture(true);
      return;
    }
    runComparison();
  };

  const handleLeadSubmit = async () => {
    if (!leadForm.firstName || !leadForm.lastName || !leadForm.email) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Merci de renseigner le prénom, le nom et l’email.",
      });
      return;
    }

    setLeadLoading(true);

    try {
      const previewResults = calculateTop3(choices, { priority });

      const { error } = await supabase.from("comparator_leads").insert({
        first_name: leadForm.firstName,
        last_name: leadForm.lastName,
        email: leadForm.email,
        priority,
        selected_needs: selectedNeeds,
        results_json: previewResults,
        status: "nouveau",
      });

      if (error) throw error;

      setShowLeadCapture(false);
      await runComparison();

      toast({
        title: "Informations enregistrées",
        description: "Vos résultats ont bien été préparés.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d’enregistrer vos informations.",
      });
    } finally {
      setLeadLoading(false);
    }
  };
  useEffect(() => {
    if (!results || results.length === 0 || showBooking || currentStep !== 3) {
      clearPopupTimer();
      return;
    }

    setPopupCountdown(20);
    let secs = 20;

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
    }, 20000);

    return () => clearPopupTimer();
  }, [results, showBooking, currentStep]);

  const handleReset = () => {
    const initialChoices = questions.reduce(
      (acc, q) => ({ ...acc, [q.id]: false }),
      {}
    );
    setChoices(initialChoices);
    setResults([]);
    setSelectedInsurance(null);
    setCompareOpen(false);
    setQSearch("");
    setShowAll(false);
    setSortMode("score");
    setPriority("balanced");
    setCurrentStep(1);
    setShowLeadCapture(false);
    setLeadForm({ firstName: "", lastName: "", email: "" });
    clearPopupTimer();
  };

  const getDialogDetails = () => {
    if (!selectedInsurance) return { matched: [], others: [] };
    const matched = (selectedInsurance.prestations || []).filter(
      (p) => choices[p.critere]
    );
    const others = (selectedInsurance.prestations || []).filter(
      (p) => !choices[p.critere] && p.score >= 2
    );
    return { matched, others };
  };

  const displayedResults = useMemo(() => {
    const list = [...(results || [])];
    const coverageOf = (r) => getCoverageCount(r, choices);

    list.sort((a, b) => {
      if (sortMode === "coverage") return coverageOf(b) - coverageOf(a);
      return (b.totalScore || 0) - (a.totalScore || 0);
    });

    return showAll ? list : list.slice(0, 3);
  }, [results, showAll, sortMode, choices]);

  const top3StyledOrder = useMemo(() => {
    if (showAll) return displayedResults;
    if (displayedResults.length === 3) {
      return [displayedResults[1], displayedResults[0], displayedResults[2]];
    }
    return displayedResults;
  }, [displayedResults, showAll]);

  const compareA = results?.[0] || null;
  const compareB = results?.[1] || null;

  const compareRows = useMemo(() => {
    const rows = [];
    for (const id of selectedNeeds) {
      const label = questions.find((q) => q.id === id)?.label || id;
      const pa = Array.isArray(compareA?.prestations)
        ? compareA.prestations.find((p) => p.critere === id)
        : null;
      const pb = Array.isArray(compareB?.prestations)
        ? compareB.prestations.find((p) => p.critere === id)
        : null;

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
    return rows;
  }, [compareA, compareB, selectedNeeds]);

  return (
    <PageTransition>
      <div className="relative min-h-[calc(100vh-80px)] bg-background text-foreground overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container py-10 md:py-16 relative">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 uppercase">
              Votre complémentaire sur mesure
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Un parcours simple, moderne et agréable pour comparer les
              meilleures complémentaires.
            </p>
          </motion.div>

          <div className="mx-auto mb-10 flex max-w-4xl flex-col gap-4 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur md:flex-row md:items-center md:justify-between">
            <WizardStep
              number={1}
              title="Priorité"
              active={currentStep === 1}
              done={currentStep > 1}
            />
            <WizardStep
              number={2}
              title="Besoins"
              active={currentStep === 2}
              done={currentStep > 2}
            />
            <WizardStep
              number={3}
              title="Résultats"
              active={currentStep === 3}
              done={false}
            />
          </div>

          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mx-auto max-w-4xl"
              >
                <div className="rounded-3xl border border-border bg-card/70 p-6 backdrop-blur sm:p-8">
                  <div className="mb-8 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      Étape 1
                    </p>
                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                      Quelle est votre priorité ?
                    </h2>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      {
                        key: "budget",
                        title: "Budget",
                        description:
                          "Une bonne couverture avec un niveau de coût maîtrisé.",
                      },
                      {
                        key: "balanced",
                        title: "Équilibré",
                        description:
                          "Le meilleur compromis entre garanties et budget.",
                      },
                      {
                        key: "premium",
                        title: "Couverture maximale",
                        description: "Le niveau de prestations le plus élevé.",
                      },
                    ].map((item) => {
                      const active = priority === item.key;
                      return (
                        <button
                          key={item.key}
                          onClick={() => setPriority(item.key)}
                          className={`rounded-2xl border p-5 text-left transition ${
                            active
                              ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                              : "border-border bg-background hover:border-primary/40"
                          }`}
                        >
                          <p className="text-lg font-bold">{item.title}</p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button
                      size="lg"
                      className="px-8"
                      onClick={() => setCurrentStep(2)}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mx-auto max-w-6xl"
              >
                <div className="rounded-3xl border border-border bg-card/70 p-6 backdrop-blur sm:p-8">
                  <div className="mb-8 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      Étape 2
                    </p>
                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                      Choisissez vos besoins
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                      Sélectionnez ce qui compte le plus pour vous.
                    </p>
                  </div>

                  <div className="mb-8 flex flex-col sm:flex-row gap-3 items-stretch">
                    <input
                      value={qSearch}
                      onChange={(e) => setQSearch(e.target.value)}
                      placeholder="Rechercher un besoin..."
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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

                  <div className="space-y-8">
                    {groupedQuestions.map(([group, items]) => (
                      <div key={group}>
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold">{group}</h3>
                            <p className="text-sm text-muted-foreground">
                              {items.length} options disponibles
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          {items.map((q) => {
                            const active = !!choices[q.id];
                            return (
                              <button
                                key={q.id}
                                type="button"
                                onClick={() => handleChoiceChange(q.id)}
                                className={`relative overflow-hidden rounded-2xl border p-5 text-left transition-all ${
                                  active
                                    ? "border-primary bg-primary/10 shadow-xl shadow-primary/10"
                                    : "border-border bg-background hover:border-primary/40 hover:shadow-lg"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="text-base font-bold">
                                      {q.label}
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                      {q.desc}
                                    </p>
                                  </div>

                                  <div
                                    className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                      active
                                        ? "bg-primary text-white"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {active ? <CheckIcon /> : null}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setCurrentStep(1)}
                    >
                      Retour
                    </Button>

                    <Button
                      size="lg"
                      onClick={handleOpenLeadCapture}
                      className="font-bold"
                    >
                      <div className="flex items-center">
                        <SparklesIcon /> Obtenir mes résultats
                      </div>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                ref={resultsRef}
              >
                <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-border bg-card/70 p-6 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      Étape 3
                    </p>
                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                      Vos résultats personnalisés
                    </h2>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Modifier mes besoins
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      Recommencer
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  {popupCountdown > 0 && results.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="mb-6 mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-3 py-1 text-xs"
                    >
                      <span className="opacity-70">
                        Conseiller disponible dans
                      </span>
                      <span className="font-semibold">{popupCountdown}s</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {results.length >= 2 && !showAll && (
                  <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => setCompareOpen(true)}
                    >
                      Comparer TOP 1 et TOP 2
                    </Button>
                    <Button
                      className="w-full sm:w-auto font-bold bg-gradient-to-r from-primary to-primary/80 text-white hover:opacity-95"
                      onClick={() => setShowBooking(true)}
                    >
                      Finaliser avec un conseiller
                    </Button>
                  </div>
                )}

                <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={showAll ? "outline" : "default"}
                      onClick={() => setShowAll(false)}
                    >
                      Top 3
                    </Button>
                    <Button
                      variant={showAll ? "default" : "outline"}
                      onClick={() => setShowAll(true)}
                    >
                      Tout afficher
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Trier par</span>
                    <Button
                      variant={sortMode === "score" ? "default" : "outline"}
                      onClick={() => setSortMode("score")}
                    >
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

                {isLoading ? (
                  <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-muted-foreground font-semibold">
                      Analyse des meilleures solutions du marché en cours...
                    </p>
                  </div>
                ) : (
                  <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: {},
                      show: {
                        transition: {
                          staggerChildren: 0.08,
                          delayChildren: 0.15,
                        },
                      },
                    }}
                  >
                    {top3StyledOrder.map((res, index) => {
                      const isTop1 =
                        !showAll &&
                        ((results.length >= 3 && index === 1) ||
                          (results.length < 3 && index === 0));

                      const rank = showAll
                        ? index + 1
                        : isTop1
                        ? 1
                        : index === 0
                        ? 2
                        : 3;

                      const covered = getCoverageCount(res, choices);
                      const pct = getCoveragePct(
                        res,
                        selectedNeeds.length,
                        choices
                      );

                      const strengths = getTopStrengths(res, choices, 3).map(
                        (id) => questions.find((q) => q.id === id)?.label || id
                      );

                      const weak = getWeakSpot(res, choices);
                      const weakLabel = weak
                        ? questions.find((q) => q.id === weak)?.label || weak
                        : null;

                      return (
                        <motion.div
                          key={`${res.caisse}-${res.produit}-${index}`}
                          variants={{
                            hidden: { opacity: 0, y: 28 },
                            show: {
                              opacity: 1,
                              y: 0,
                              transition: { type: "spring", stiffness: 110 },
                            },
                          }}
                          whileHover={{ y: -6, scale: 1.02 }}
                          className={`relative rounded-2xl border border-border bg-card p-8 shadow-lg transition-all ${
                            isTop1
                              ? "lg:-translate-y-4 lg:scale-105 lg:shadow-2xl z-10 ring-1 ring-primary/20"
                              : "hover:shadow-xl"
                          }`}
                        >
                          {isTop1 && !showAll && (
                            <div className="absolute -left-10 top-6 rotate-[-35deg] bg-gradient-to-r from-primary to-primary/80 px-10 py-1 text-[10px] font-black tracking-widest text-white shadow">
                              MEILLEUR MATCH
                            </div>
                          )}

                          <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-2xl font-extrabold text-foreground">
                              {showAll ? `#${rank}` : `TOP ${rank}`}
                            </h2>
                            <div className="rounded-full bg-muted px-3 py-1 text-xs font-bold">
                              {covered} / {selectedNeeds.length || 0} • {pct}%
                            </div>
                          </div>

                          <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 text-white shadow-inner">
                            <div className="text-center">
                              <div className="text-4xl font-black">
                                {res.totalScore}
                              </div>
                              <div className="text-[10px] font-bold uppercase tracking-wider">
                                Score
                              </div>
                            </div>
                          </div>

                          <div className="mb-5 flex-grow">
                            <h3 className="text-xl font-bold text-foreground">
                              {res.caisse}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {res.produit}
                            </p>

                            <div className="mt-4 rounded-xl border border-border bg-background/50 p-4">
                              <p className="text-sm font-semibold">
                                Pourquoi ce résultat ?
                              </p>
                              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                {strengths.length ? (
                                  strengths.map((t) => (
                                    <li
                                      key={t}
                                      className="flex items-start gap-2"
                                    >
                                      <span className="mt-[6px] inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                                      <span>{t}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-xs">
                                    Aucun besoin sélectionné.
                                  </li>
                                )}
                              </ul>
                              {weakLabel && (
                                <p className="mt-3 text-xs text-muted-foreground">
                                  Point de vigilance potentiel :{" "}
                                  <span className="font-medium text-foreground">
                                    {weakLabel}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Button
                              variant="outline"
                              className="w-full font-bold"
                              onClick={() => setSelectedInsurance(res)}
                            >
                              Voir les détails
                            </Button>
                            <Button
                              className="w-full font-bold bg-gradient-to-r from-primary to-primary/80 text-white"
                              onClick={() => setShowBooking(true)}
                            >
                              Être accompagné
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <Dialog open={showLeadCapture} onOpenChange={setShowLeadCapture}>
            <DialogContent className="sm:max-w-md bg-card">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Recevoir vos résultats par email
                </DialogTitle>
                <DialogDescription>
                  Renseignez vos informations pour accéder à votre comparaison
                  et recevoir une copie par email.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={leadForm.firstName}
                    onChange={(e) =>
                      setLeadForm((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="Votre prénom"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={leadForm.lastName}
                    onChange={(e) =>
                      setLeadForm((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={(e) =>
                      setLeadForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="votre.email@exemple.ch"
                  />
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowLeadCapture(false)}
                  >
                    Fermer
                  </Button>
                  <Button onClick={handleLeadSubmit} disabled={leadLoading}>
                    {leadLoading ? "Enregistrement..." : "Voir mes résultats"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={!!selectedInsurance}
            onOpenChange={() => setSelectedInsurance(null)}
          >
            <DialogContent className="sm:max-w-md bg-card">
              {selectedInsurance && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl">
                      {selectedInsurance.caisse} — {selectedInsurance.produit}
                    </DialogTitle>
                    <DialogDescription>
                      Aperçu détaillé des prestations.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="max-h-[60vh] space-y-6 overflow-y-auto py-4 pr-3">
                    <div>
                      <h4 className="mb-3 text-lg font-semibold text-foreground">
                        Correspond à vos besoins
                      </h4>
                      <div className="space-y-4">
                        {getDialogDetails().matched.map((p) => (
                          <div key={p.critere}>
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-foreground">
                                {questions.find((q) => q.id === p.critere)
                                  ?.label || p.critere}
                              </p>
                              <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs font-bold text-blue-600">
                                Score {p.score}/3
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {p.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
            <DialogContent className="sm:max-w-5xl bg-card">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Comparaison TOP 1 vs TOP 2
                </DialogTitle>
                <DialogDescription>
                  Lecture directe des points forts sur vos critères.
                </DialogDescription>
              </DialogHeader>

              {!compareA || !compareB ? (
                <div className="py-6 text-sm text-muted-foreground">
                  Pas assez de résultats pour comparer.
                </div>
              ) : (
                <div className="py-4">
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="min-w-[900px] w-full text-sm">
                      <thead className="bg-muted/40">
                        <tr>
                          <th className="w-[280px] p-3 text-left font-semibold">
                            Critère
                          </th>
                          <th className="p-3 text-left font-semibold">
                            {compareA.caisse}
                          </th>
                          <th className="p-3 text-left font-semibold">
                            {compareB.caisse}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {compareRows.map((row) => (
                          <tr key={row.id}>
                            <td className="border-t border-border p-3 font-medium">
                              {row.label}
                            </td>
                            <td className="border-t border-border p-3">
                              {row.aScore}/3
                            </td>
                            <td className="border-t border-border p-3">
                              {row.bScore}/3
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TopSheet
        open={showBooking}
        onClose={() => setShowBooking(false)}
        maxWidth="lg"
      >
        <div className="space-y-6">
          <div>
            <h3 className="bg-clip-text text-2xl font-extrabold text-transparent bg-gradient-to-r from-primary to-primary/80">
              Analyse personnalisée avec un conseiller
            </h3>
            <p className="text-sm text-muted-foreground">
              Un expert vous accompagne pour valider et optimiser votre choix.
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Motif de la demande</p>
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
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      active
                        ? "border-transparent bg-gradient-to-r from-primary to-primary/80 text-white"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">
              Créneau souhaité (optionnel)
            </p>
            <div className="mb-3 grid grid-cols-3 gap-2">
              {[
                { t: "Aujourd’hui matin", addH: 3 },
                { t: "Aujourd’hui après-midi", addH: 6 },
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
                  className="rounded-md border border-border px-2 py-2 text-xs hover:border-primary/50 hover:bg-primary/5"
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Button
              variant="outline"
              onClick={() => {
                const subject = encodeText(
                  "Demande d'accompagnement – Comparateur complémentaires"
                );
                const body = encodeText(
                  `Bonjour,

Je souhaite être recontacté.

Motif : ${bookingReason}
Créneau : ${bookingWhen || "à définir"}
Priorité : ${priority}
Besoins : ${
                    selectedNeeds
                      .map(
                        (id) => questions.find((q) => q.id === id)?.label || id
                      )
                      .join(", ") || "non précisé"
                  }

Merci.`
                );
                window.location.href = `mailto:contact@monfideleconseiller.ch?subject=${subject}&body=${body}`;
              }}
            >
              Être contacté par email
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
              <WhatsIcon /> Demande rapide
            </Button>

            <Button
              className="bg-gradient-to-r from-primary to-primary/80 font-bold text-white hover:opacity-95"
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
              <WhatsIcon /> Contacter sur WhatsApp
            </Button>
          </div>

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
}
