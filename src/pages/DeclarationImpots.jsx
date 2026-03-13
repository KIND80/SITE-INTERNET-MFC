import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Upload,
  ChevronRight,
  ChevronLeft,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  FileText,
  Lock,
  Bot,
  Wand2,
  Coins,
  MapPin,
  Landmark,
  PiggyBank,
  Home,
  MessageCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const steps = [
  "Profil",
  "Situation fiscale",
  "Revenus",
  "Déductions",
  "Validation",
];

const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

const initialFormData = {
  canton: "Genève",
  statut: "Frontalier",
  situationFamiliale: "Célibataire",
  enfants: 0,

  modeImposition: "Impôt à la source",
  parcoursFiscal: "DRIS",
  commune: "",
  quasiResident: "Non",

  nomComplet: "",
  email: "",
  telephone: "",

  salaireAnnuel: "",
  autresRevenus: "",
  treiziemeSalaire: "Oui",
  revenuConjoint: "",

  troisiemePilier: "",
  assuranceMaladie: "",
  fraisTransport: "",
  fraisGarde: "",
  pensionsAlimentaires: "",
  fraisFormation: "",
  interetsDette: "",

  avoirsBancaires: "",
  titres: "",
  immobilier: "",
  dettes: "",
};

function SummaryCard({ label, value, tone = "default", subtext = "", icon = null }) {
  const toneClass =
    tone === "orange"
      ? "border-orange-200 bg-orange-50"
      : tone === "green"
      ? "border-green-200 bg-green-50"
      : tone === "red"
      ? "border-red-200 bg-red-50"
      : "border-slate-200 bg-slate-50";

  const valueClass =
    tone === "orange"
      ? "text-orange-700"
      : tone === "green"
      ? "text-green-700"
      : tone === "red"
      ? "text-red-700"
      : "text-slate-900";

  const labelClass =
    tone === "orange"
      ? "text-orange-700"
      : tone === "green"
      ? "text-green-700"
      : tone === "red"
      ? "text-red-700"
      : "text-slate-500";

  return (
    <div className={`rounded-3xl border p-5 md:p-6 ${toneClass}`}>
      <div className="flex items-start justify-between gap-3">
        <p className={`text-sm ${labelClass}`}>{label}</p>
        {icon ? <div className="text-slate-400">{icon}</div> : null}
      </div>
      <div className={`mt-2 text-2xl font-black md:text-3xl ${valueClass}`}>
        {value}
      </div>
      {subtext ? <p className="mt-2 text-xs leading-5 text-slate-600">{subtext}</p> : null}
    </div>
  );
}

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div>
      {eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">{eyebrow}</p>
      ) : null}
      <h3 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">{title}</h3>
      {description ? <p className="mt-2 max-w-3xl text-slate-600">{description}</p> : null}
    </div>
  );
}

function SmartHint({ children }) {
  if (!children) return null;

  return (
    <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
      <div className="flex items-start gap-2">
        <Bot className="mt-0.5 h-4 w-4 shrink-0" />
        <p className="leading-6">{children}</p>
      </div>
    </div>
  );
}

function ChoicePill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active
          ? "border-orange-300 bg-orange-50 text-orange-700 ring-4 ring-orange-100"
          : "border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:text-orange-700"
      }`}
    >
      {children}
    </button>
  );
}

function OptionCard({ active, title, description, onClick, icon = null }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-3xl border p-4 text-left transition ${
        active
          ? "border-orange-300 bg-orange-50 ring-4 ring-orange-100"
          : "border-slate-200 bg-white hover:border-orange-200 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start gap-3">
        {icon ? (
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
              active ? "bg-white text-orange-600" : "bg-slate-100 text-slate-500"
            }`}
          >
            {icon}
          </div>
        ) : null}
        <div>
          <div className="text-sm font-bold text-slate-900">{title}</div>
          <div className="mt-1 text-xs leading-5 text-slate-600">{description}</div>
        </div>
      </div>
    </button>
  );
}

function SuggestionChips({ title, suggestions = [], onPick }) {
  if (!suggestions.length) return null;

  return (
    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {suggestions.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onPick?.(item)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-700"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DeclarationImpots() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showResultsAfterSave, setShowResultsAfterSave] = useState(false);
  const [contactPreference, setContactPreference] = useState("Rappel téléphonique");
  const [consentContact, setConsentContact] = useState(true);
  const [showFortuneFields, setShowFortuneFields] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const topRef = useRef(null);
  const [formData, setFormData] = useState(initialFormData);

  const stepProgress = Math.round((currentStep / steps.length) * 100);

  const inputBaseClass =
    "mt-2 w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400";
  const inputNormalClass =
    "border-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100";
  const inputErrorClass =
    "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100";
  const labelClassName = "text-sm font-semibold text-slate-800";
  const helperTextClass = "mt-1 text-xs text-slate-500";
  const errorTextClass = "mt-1 text-xs font-medium text-red-600";

  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const parseNumber = (value) => {
    if (value === "" || value === null || value === undefined) return 0;
    const normalized =
      typeof value === "string"
        ? value.replace(/\s/g, "").replace(",", ".").trim()
        : value;
    const n = Number(normalized);
    return Number.isNaN(n) ? 0 : n;
  };

  const formatCurrency = (value) => `${Math.round(value).toLocaleString("fr-CH")} CHF`;

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || "").trim());

  const isValidPhone = (phone) => {
    const cleaned = (phone || "").replace(/[^\d+]/g, "");
    return cleaned.length >= 8;
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const getFileCategory = (fileName = "") => {
    const name = fileName.toLowerCase();

    if (name.includes("salaire") || name.includes("salary") || name.includes("certificat")) {
      return "certificat_salaire";
    }

    if (name.includes("3e") || name.includes("3a") || name.includes("pilier")) {
      return "troisieme_pilier";
    }

    if (name.includes("assurance") || name.includes("lamal") || name.includes("maladie")) {
      return "assurance_maladie";
    }

    if (name.includes("source") || name.includes("dris") || name.includes("tou")) {
      return "impot_source";
    }

    return "autre_document";
  };

  const communeSuggestions = useMemo(() => {
    const byCanton = {
      Genève: ["Genève", "Meyrin", "Vernier", "Carouge", "Lancy"],
      Vaud: ["Lausanne", "Nyon", "Morges", "Montreux", "Yverdon"],
    };

    return (byCanton[formData.canton] || []).map((city) => ({
      label: city,
      value: city,
    }));
  }, [formData.canton]);

  const salarySuggestions = useMemo(() => {
    const byStatus = formData.statut === "Résident" ? [70000, 90000, 110000, 130000] : [60000, 80000, 100000, 120000];
    return byStatus.map((amount) => ({
      label: amount.toLocaleString("fr-CH"),
      value: String(amount),
    }));
  }, [formData.statut]);

  const deductionSuggestions = [
    { label: "3e pilier 7 056", field: "troisiemePilier", value: "7056" },
    { label: "LAMal 4 200", field: "assuranceMaladie", value: "4200" },
    { label: "Transport 1 200", field: "fraisTransport", value: "1200" },
    { label: "Formation 900", field: "fraisFormation", value: "900" },
  ];

  const completionStats = useMemo(() => {
    const importantFields = [
      "nomComplet",
      "email",
      "telephone",
      "canton",
      "statut",
      "situationFamiliale",
      "modeImposition",
      "parcoursFiscal",
      "salaireAnnuel",
    ];

    const completed = importantFields.filter((field) => {
      const value = formData[field];
      return value !== "" && value !== null && value !== undefined;
    }).length;

    return {
      completed,
      total: importantFields.length,
      percentage: Math.round((completed / importantFields.length) * 100),
    };
  }, [formData]);

  const estimation = useMemo(() => {
    const salaire = parseNumber(formData.salaireAnnuel);
    const autresRevenus = parseNumber(formData.autresRevenus);
    const revenuConjoint = parseNumber(formData.revenuConjoint);

    const troisiemePilier = parseNumber(formData.troisiemePilier);
    const assuranceMaladie = parseNumber(formData.assuranceMaladie);
    const fraisTransport = parseNumber(formData.fraisTransport);
    const fraisGarde = parseNumber(formData.fraisGarde);
    const pensionsAlimentaires = parseNumber(formData.pensionsAlimentaires);
    const fraisFormation = parseNumber(formData.fraisFormation);
    const interetsDette = parseNumber(formData.interetsDette);

    const totalRevenus =
      salaire +
      autresRevenus +
      (formData.situationFamiliale === "Marié" ? revenuConjoint : 0);

    const totalDeductions =
      troisiemePilier +
      assuranceMaladie +
      fraisTransport +
      fraisGarde +
      pensionsAlimentaires +
      fraisFormation +
      interetsDette;

    const revenuImposableEstime = Math.max(totalRevenus - totalDeductions, 0);

    let tauxBase = 0.085;

    if (formData.canton === "Vaud") tauxBase = 0.102;
    if (formData.modeImposition === "Ordinaire") tauxBase += 0.01;
    if (formData.statut === "Résident") tauxBase += 0.008;
    if (formData.situationFamiliale === "Marié") tauxBase -= 0.008;
    if (parseNumber(formData.enfants) >= 1) tauxBase -= 0.006;
    if (parseNumber(formData.enfants) >= 2) tauxBase -= 0.004;
    if (formData.parcoursFiscal === "TOU") tauxBase += 0.004;
    if (formData.parcoursFiscal === "DRIS") tauxBase -= 0.002;
    if (formData.quasiResident === "Oui") tauxBase -= 0.004;

    const impotEstime = Math.max(revenuImposableEstime * tauxBase, 0);

    const fortuneBrute =
      parseNumber(formData.avoirsBancaires) +
      parseNumber(formData.titres) +
      parseNumber(formData.immobilier);

    const fortuneNette = Math.max(fortuneBrute - parseNumber(formData.dettes), 0);

    let impotFortuneEstime = 0;
    if (fortuneNette > 0) {
      impotFortuneEstime = formData.canton === "Genève" ? fortuneNette * 0.0018 : fortuneNette * 0.0012;
    }

    const impotTotalEstime = impotEstime + impotFortuneEstime;

    let optimisationPotentielle = totalDeductions * 0.12;

    if (formData.parcoursFiscal === "DRIS") optimisationPotentielle += 250;
    if (formData.parcoursFiscal === "TOU") optimisationPotentielle += 350;

    if (formData.troisiemePilier === "" || parseNumber(formData.troisiemePilier) === 0) {
      optimisationPotentielle += 400;
    }

    if (formData.assuranceMaladie === "" || parseNumber(formData.assuranceMaladie) === 0) {
      optimisationPotentielle += 250;
    }

    if (formData.fraisTransport === "" || parseNumber(formData.fraisTransport) === 0) {
      optimisationPotentielle += 180;
    }

    if (formData.situationFamiliale === "Marié") optimisationPotentielle += 220;
    if (parseNumber(formData.enfants) > 0) {
      optimisationPotentielle += parseNumber(formData.enfants) * 180;
    }

    optimisationPotentielle = Math.max(
      Math.min(optimisationPotentielle, impotTotalEstime * 0.35 || 2500),
      180
    );

    const impotSourceTheorique = Math.max(impotTotalEstime * 0.96, 0);
    const differencePossible = Math.abs(impotTotalEstime - impotSourceTheorique);

    let niveauOptimisation = "Faible";
    if (optimisationPotentielle >= 700) niveauOptimisation = "Moyen";
    if (optimisationPotentielle >= 1400) niveauOptimisation = "Élevé";

    let recommandation = "Une vérification par un conseiller est recommandée.";
    if (formData.parcoursFiscal === "DRIS") {
      recommandation =
        "Votre situation semble compatible avec une vérification DRIS pour récupérer d’éventuelles déductions oubliées.";
    }
    if (formData.parcoursFiscal === "TOU") {
      recommandation =
        "Une analyse TOU peut être utile pour comparer votre taxation à la source avec votre imposition réelle.";
    }
    if (formData.modeImposition === "Ordinaire") {
      recommandation =
        "Une relecture complète peut permettre d’identifier des déductions supplémentaires et d’éviter des oublis.";
    }

    return {
      totalRevenus,
      totalDeductions,
      revenuImposableEstime,
      impotRevenuEstime: impotEstime,
      impotFortuneEstime,
      impotTotalEstime,
      fortuneBrute,
      fortuneNette,
      optimisationPotentielle,
      impotSourceTheorique,
      differencePossible,
      niveauOptimisation,
      recommandation,
    };
  }, [formData]);

  const smartProfileHint = useMemo(() => {
    if (formData.statut === "Frontalier" && formData.canton === "Genève") {
      return "Vous êtes frontalier sur Genève : le parcours DRIS ou une vérification de l’impôt à la source est souvent pertinent selon vos déductions réelles.";
    }
    if (formData.statut === "Résident") {
      return "En tant que résident, l’estimation gagne en pertinence si vous renseignez aussi vos avoirs, dettes et votre situation familiale exacte.";
    }
    return "Remplissez d’abord vos coordonnées : la suite sera plus rapide et l’enregistrement de dossier plus fluide.";
  }, [formData.statut, formData.canton]);

  const smartTaxHint = useMemo(() => {
    if (formData.parcoursFiscal === "TOU") {
      return "TOU est utile quand on veut comparer l’impôt prélevé avec une taxation ordinaire complète.";
    }
    if (formData.parcoursFiscal === "DRIS") {
      return "DRIS est pertinent pour corriger ou compléter certaines déductions si vous êtes imposé à la source.";
    }
    return "Choisissez simplement le parcours qui vous paraît le plus proche. Le conseiller confirmera ensuite la meilleure voie.";
  }, [formData.parcoursFiscal]);

  const smartIncomeHint = useMemo(() => {
    const salaire = parseNumber(formData.salaireAnnuel);
    if (salaire >= 120000) {
      return "Avec un revenu plus élevé, une vérification précise des déductions et du bon parcours fiscal devient encore plus utile.";
    }
    if (salaire > 0 && formData.treiziemeSalaire === "Oui") {
      return "Pensez à saisir votre revenu annuel global, 13e salaire compris, pour éviter une estimation faussée.";
    }
    return "Vous pouvez cliquer sur un montant prérempli pour aller plus vite, puis ajuster si nécessaire.";
  }, [formData.salaireAnnuel, formData.treiziemeSalaire]);

  const smartDeductionHint = useMemo(() => {
    const totalDed =
      parseNumber(formData.troisiemePilier) +
      parseNumber(formData.assuranceMaladie) +
      parseNumber(formData.fraisTransport);

    if (totalDed === 0) {
      return "Même sans montant exact, une estimation simple améliore beaucoup la pertinence du dossier. Utilisez les suggestions préremplies ci-dessous.";
    }

    return "Très bien. Quelques documents ou montants clés suffisent déjà à rendre le dossier plus qualifié.";
  }, [formData.troisiemePilier, formData.assuranceMaladie, formData.fraisTransport]);

  const getInputClassName = (field) =>
    `${inputBaseClass} ${fieldErrors[field] ? inputErrorClass : inputNormalClass}`;

  const validateStep = (step) => {
    const errors = {};

    const nonNegativeFields = [
      "enfants",
      "salaireAnnuel",
      "autresRevenus",
      "revenuConjoint",
      "troisiemePilier",
      "assuranceMaladie",
      "fraisTransport",
      "fraisGarde",
      "pensionsAlimentaires",
      "fraisFormation",
      "interetsDette",
      "avoirsBancaires",
      "titres",
      "immobilier",
      "dettes",
    ];

    nonNegativeFields.forEach((field) => {
      const value = formData[field];
      if (value !== "" && parseNumber(value) < 0) {
        errors[field] = "Cette valeur ne peut pas être négative.";
      }
    });

    if (step === 1) {
      if (!formData.nomComplet.trim()) {
        errors.nomComplet = "Le nom complet est obligatoire.";
      }
      if (!formData.email.trim()) {
        errors.email = "L’email est obligatoire.";
      } else if (!isValidEmail(formData.email)) {
        errors.email = "Veuillez entrer un email valide.";
      }
      if (!formData.telephone.trim()) {
        errors.telephone = "Le téléphone est obligatoire.";
      } else if (!isValidPhone(formData.telephone)) {
        errors.telephone = "Veuillez entrer un numéro valide.";
      }
      if (parseNumber(formData.enfants) < 0) {
        errors.enfants = "Le nombre d’enfants doit être positif.";
      }
    }

    if (step === 2) {
      if (!formData.modeImposition) {
        errors.modeImposition = "Veuillez sélectionner un mode d’imposition.";
      }
      if (!formData.parcoursFiscal) {
        errors.parcoursFiscal = "Veuillez sélectionner un parcours fiscal.";
      }
      if (!formData.canton) {
        errors.canton = "Veuillez sélectionner un canton.";
      }
    }

    if (step === 3) {
      if (formData.salaireAnnuel === "" || parseNumber(formData.salaireAnnuel) <= 0) {
        errors.salaireAnnuel = "Veuillez renseigner un salaire annuel supérieur à 0.";
      }
      if (
        formData.situationFamiliale === "Marié" &&
        formData.revenuConjoint !== "" &&
        parseNumber(formData.revenuConjoint) < 0
      ) {
        errors.revenuConjoint = "Le revenu du conjoint doit être positif.";
      }
    }

    if (step === 4) {
      const hasAnyValue =
        parseNumber(formData.troisiemePilier) > 0 ||
        parseNumber(formData.assuranceMaladie) > 0 ||
        parseNumber(formData.fraisTransport) > 0 ||
        parseNumber(formData.fraisGarde) > 0 ||
        parseNumber(formData.pensionsAlimentaires) > 0 ||
        parseNumber(formData.fraisFormation) > 0 ||
        parseNumber(formData.interetsDette) > 0;

      if (!hasAnyValue) {
        errors.troisiemePilier = "Ajoutez au moins une déduction connue ou laissez 0 si aucune.";
      }
    }

    if (step === 5) {
      if (!consentContact) {
        errors.consentContact = "Vous devez accepter d’être recontacté pour valider votre dossier.";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const markStepFieldsTouched = (step) => {
    const stepFieldsByNumber = {
      1: [
        "nomComplet",
        "email",
        "telephone",
        "canton",
        "statut",
        "situationFamiliale",
        "enfants",
      ],
      2: ["modeImposition", "parcoursFiscal", "commune", "quasiResident"],
      3: ["salaireAnnuel", "autresRevenus", "revenuConjoint", "treiziemeSalaire"],
      4: [
        "troisiemePilier",
        "assuranceMaladie",
        "fraisTransport",
        "fraisGarde",
        "pensionsAlimentaires",
        "fraisFormation",
        "interetsDette",
      ],
      5: ["consentContact"],
    };

    const nextTouched = { ...touchedFields };
    for (const field of stepFieldsByNumber[step] || []) {
      nextTouched[field] = true;
    }
    setTouchedFields(nextTouched);
  };

  const nextStep = () => {
    markStepFieldsTouched(currentStep);
    if (!validateStep(currentStep)) return;

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
      scrollToTop();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      scrollToTop();
    }
  };

  const removeFile = (idToRemove) => {
    setUploadedFiles((prev) => prev.filter((item) => item.id !== idToRemove));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    const nextErrors = [];

    if (!files.length) return;

    const existingCount = uploadedFiles.length;
    if (existingCount + files.length > MAX_FILES) {
      nextErrors.push(`Vous pouvez ajouter au maximum ${MAX_FILES} fichiers.`);
    }

    const existingKeys = new Set(
      uploadedFiles.map(
        (item) => `${item.file.name}-${item.file.size}-${item.file.lastModified}`
      )
    );

    const validNewFiles = [];

    for (const file of files) {
      const fileKey = `${file.name}-${file.size}-${file.lastModified}`;

      if (existingKeys.has(fileKey)) {
        nextErrors.push(`Le fichier "${file.name}" est déjà ajouté.`);
        continue;
      }

      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        nextErrors.push(
          `"${file.name}" n’est pas accepté. Formats autorisés : PDF, JPG, PNG, WEBP.`
        );
        continue;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        nextErrors.push(
          `"${file.name}" dépasse la limite de ${MAX_FILE_SIZE_MB} Mo.`
        );
        continue;
      }

      if (existingCount + validNewFiles.length >= MAX_FILES) {
        break;
      }

      validNewFiles.push({
        file,
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      });
    }

    if (validNewFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validNewFiles]);
    }

    setFileErrors(nextErrors);
    event.target.value = "";
  };

  const uploadDocuments = async (declarationId) => {
    if (!uploadedFiles.length) return;

    for (const item of uploadedFiles) {
      const file = item.file;
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = `${declarationId}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("tax-documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload impossible pour ${file.name} : ${uploadError.message}`);
      }

      const { error: insertDocError } = await supabase.from("tax_documents").insert([
        {
          declaration_id: declarationId,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type || null,
          category: getFileCategory(file.name),
        },
      ]);

      if (insertDocError) {
        throw new Error(
          `Enregistrement document impossible pour ${file.name} : ${insertDocError.message}`
        );
      }
    }
  };

  const saveDeclaration = async () => {
    setSaveError("");
    setFileErrors([]);

    markStepFieldsTouched(1);
    markStepFieldsTouched(2);
    markStepFieldsTouched(3);
    markStepFieldsTouched(4);
    markStepFieldsTouched(5);

    const step1Valid = validateStep(1);
    const step2Valid = validateStep(2);
    const step3Valid = validateStep(3);
    const step4Valid = validateStep(4);
    const step5Valid = validateStep(5);

    if (!step1Valid || !step2Valid || !step3Valid || !step4Valid || !step5Valid) {
      setSaveError("Veuillez corriger les champs obligatoires avant l’enregistrement.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        nom_complet: formData.nomComplet?.trim() || null,
        email: formData.email?.trim() || null,
        telephone: formData.telephone?.trim() || null,

        canton: formData.canton || null,
        statut: formData.statut || null,
        situation_familiale: formData.situationFamiliale || null,
        enfants: parseNumber(formData.enfants),

        mode_imposition: formData.modeImposition || null,
        parcours_fiscal: formData.parcoursFiscal || null,
        commune: formData.commune?.trim() || null,
        quasi_resident: formData.quasiResident || null,

        salaire_annuel: parseNumber(formData.salaireAnnuel),
        autres_revenus: parseNumber(formData.autresRevenus),
        revenu_conjoint: parseNumber(formData.revenuConjoint),
        treizieme_salaire: formData.treiziemeSalaire || null,

        troisieme_pilier: parseNumber(formData.troisiemePilier),
        assurance_maladie: parseNumber(formData.assuranceMaladie),
        frais_transport: parseNumber(formData.fraisTransport),
        frais_garde: parseNumber(formData.fraisGarde),
        pensions_alimentaires: parseNumber(formData.pensionsAlimentaires),
        frais_formation: parseNumber(formData.fraisFormation),
        interets_dette: parseNumber(formData.interetsDette),

        avoirs_bancaires: parseNumber(formData.avoirsBancaires),
        titres: parseNumber(formData.titres),
        immobilier: parseNumber(formData.immobilier),
        dettes: parseNumber(formData.dettes),

        total_revenus: estimation.totalRevenus,
        total_deductions: estimation.totalDeductions,
        revenu_imposable_estime: estimation.revenuImposableEstime,
        impot_revenu_estime: Math.round(estimation.impotRevenuEstime),
        impot_fortune_estime: Math.round(estimation.impotFortuneEstime),
        impot_estime: Math.round(estimation.impotTotalEstime),
        optimisation_potentielle: Math.round(estimation.optimisationPotentielle),
        niveau_optimisation: estimation.niveauOptimisation,
        difference_possible: Math.round(estimation.differencePossible),

        statut_dossier: "a_relire",
      };

      const { data, error } = await supabase
        .from("tax_declarations")
        .insert([payload])
        .select()
        .single();

      if (error) {
        setSaveError(`Erreur lors de l’enregistrement du dossier : ${error.message}`);
        return;
      }

      if (!data?.id) {
        setSaveError("Dossier créé, mais impossible de récupérer son identifiant.");
        return;
      }

      await uploadDocuments(data.id);

      setUploadedFiles([]);
      setShowResultsAfterSave(true);
      setSaveSuccess(true);
      scrollToTop();
    } catch (err) {
      console.error("Erreur inattendue :", err);
      setSaveError(err?.message || "Une erreur inattendue est survenue.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (saveSuccess) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [saveSuccess]);

  const renderFieldError = (field) => {
    if (!touchedFields[field] || !fieldErrors[field]) return null;
    return <p className={errorTextClass}>{fieldErrors[field]}</p>;
  };

  const openCalendly = () => {
    window.open(
      "https://calendly.com/contact-monfideleconseiller/30min",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const openWhatsApp = () => {
    window.open(
      "https://wa.me/41797896193?text=Bonjour%20M%20Kinda%2C%20j%27ai%20une%20question",
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (saveSuccess && showResultsAfterSave) {
    return (
      <div
        ref={topRef}
        className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white px-4 py-20 sm:px-6"
      >
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="overflow-hidden rounded-[32px] border border-orange-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="border-b border-orange-100 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 text-white md:px-10">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    <CheckCircle2 className="h-4 w-4" />
                    Dossier enregistré
                  </div>
                  <h1 className="mt-4 text-3xl font-black md:text-4xl">
                    Merci, votre estimation détaillée est maintenant disponible
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-orange-50 md:text-base">
                    Votre dossier est bien enregistré. Vous pouvez consulter votre estimation indicative ci-dessous, puis choisir un rendez-vous ou un échange rapide avec un conseiller.
                  </p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-wide text-orange-100">Suivi préféré</p>
                  <p className="mt-1 text-lg font-bold text-white">{contactPreference}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-8 md:px-10 md:py-10">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                  label="Total revenus"
                  value={formatCurrency(estimation.totalRevenus)}
                  icon={<Coins className="h-5 w-5" />}
                />
                <SummaryCard
                  label="Total déductions"
                  value={formatCurrency(estimation.totalDeductions)}
                  icon={<Wand2 className="h-5 w-5" />}
                />
                <SummaryCard
                  label="Revenu imposable estimé"
                  value={formatCurrency(estimation.revenuImposableEstime)}
                  tone="orange"
                  icon={<FileText className="h-5 w-5" />}
                />
                <SummaryCard
                  label="Impôt total estimé"
                  value={formatCurrency(Math.round(estimation.impotTotalEstime))}
                  tone="green"
                  icon={<ShieldCheck className="h-5 w-5" />}
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <SummaryCard
                  label="Potentiel d’optimisation"
                  value={formatCurrency(Math.round(estimation.optimisationPotentielle))}
                  tone="orange"
                  subtext="Montant indicatif pouvant être amélioré selon votre situation complète."
                />
                <SummaryCard
                  label="Niveau d’opportunité"
                  value={estimation.niveauOptimisation}
                  tone={
                    estimation.niveauOptimisation === "Élevé"
                      ? "green"
                      : estimation.niveauOptimisation === "Moyen"
                      ? "orange"
                      : "default"
                  }
                  subtext="Plus ce niveau est élevé, plus un rendez-vous est pertinent."
                />
                <SummaryCard
                  label="Écart possible"
                  value={formatCurrency(Math.round(estimation.differencePossible))}
                  tone="red"
                  subtext="Différence potentielle entre estimation et situation réelle ou source."
                />
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
                <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6">
                  <h2 className="text-xl font-black text-slate-900">Ce que cela signifie pour vous</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{estimation.recommandation}</p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-orange-200 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Ce que le conseiller vérifie</p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        <li>• cohérence DRIS / TOU / ordinaire</li>
                        <li>• déductions réellement admises</li>
                        <li>• pistes d’optimisation concrètes</li>
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-orange-200 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Prochaine étape</p>
                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        Votre dossier peut maintenant être rappelé, relu puis transformé en rendez-vous utile si nécessaire.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h2 className="text-xl font-black text-slate-900">Actions rapides</h2>
                  <div className="mt-5 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={openCalendly}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-700"
                    >
                      <Calendar className="h-4 w-4" />
                      Prendre rendez-vous
                    </button>
                    <button
                      type="button"
                      onClick={openWhatsApp}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Parler à un conseiller
                    </button>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                      Coordonnées enregistrées : <span className="font-semibold text-slate-900">{formData.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-xl font-black text-slate-900">Estimation indicative</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Cette estimation est donnée à titre informatif. Le montant réel dépend de votre situation complète, des règles fiscales applicables, des justificatifs fournis et du traitement final par les autorités.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setSaveSuccess(false);
                    setShowResultsAfterSave(false);
                    setCurrentStep(1);
                    setFormData(initialFormData);
                    setFieldErrors({});
                    setTouchedFields({});
                    setSaveError("");
                    setContactPreference("Rappel téléphonique");
                    setConsentContact(true);
                    setShowFortuneFields(false);
                  }}
                  className="rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Créer un nouveau dossier
                </button>

                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Revenir en haut
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div ref={topRef} className="min-h-screen bg-white">
      <section className="px-4 pb-10 pt-24 sm:px-6 md:pt-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <motion.h1
              className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Simulateur impôts
              <span className="mt-1 block text-orange-600">Genève, Vaud, Taxe ordinaire & Impôt à la source</span>
            </motion.h1>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
              Un parcours plus ludique, plus simple et plus rapide. Cliquez sur des choix préremplis, complétez l’essentiel, puis enregistrez le dossier pour voir votre estimation détaillée.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Simple à remplir</p>
              <p className="mt-2 text-sm text-slate-600">
                Choix cliquables, montants suggérés et étapes courtes.
              </p>
            </div>

            <div className="rounded-3xl border border-orange-200 bg-orange-50 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-orange-800">
                <Sparkles className="h-4 w-4" />
                Plus ludique
              </p>
              <p className="mt-2 text-sm text-orange-700">
                Le formulaire guide naturellement sans complication.
              </p>
            </div>

            <div className="rounded-3xl border border-green-200 bg-green-50 p-5">
              <p className="text-sm font-semibold text-green-800">Evaluation de qualité</p>
              <p className="mt-2 text-sm text-green-700">
              Le dossier est enregistré avant l’affichage du résultat détaillé.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-[28px] border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-5 lg:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
                  Parcours intelligent
                </p>
                <h2 className="mt-2 text-xl font-black text-slate-900 md:text-2xl">
                  Votre dossier se complete rapidement en moins de 2 minutes 
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  Les suggestions, les boutons cliquables et les aides contextuelles rendent le remplissage plus simple.
                </p>
              </div>

              <div className="rounded-3xl border border-orange-200 bg-orange-50 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">Dossier complété</p>
                <div className="mt-1 text-3xl font-black text-orange-600">{completionStats.percentage}%</div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-4 lg:hidden">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Progression</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  Étape {currentStep} sur {steps.length} — {steps[currentStep - 1]}
                </p>
              </div>
              <div className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-700">
                {stepProgress}%
              </div>
            </div>

            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-orange-600 transition-all duration-300"
                style={{ width: `${stepProgress}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-5 gap-2">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isDone = currentStep > stepNumber;

                return (
                  <div
                    key={step}
                    className={`flex h-10 items-center justify-center rounded-2xl text-xs font-bold ${
                      isDone
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-orange-600 text-white"
                        : "border border-slate-200 bg-white text-slate-600"
                    }`}
                    title={step}
                  >
                    {isDone ? "✓" : stepNumber}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-28 sm:px-6 lg:pb-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <div className="mb-6">
                <p className="text-sm font-semibold text-orange-600">Progression</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Votre dossier fiscal</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Le résultat détaillé se débloque après enregistrement du dossier.
                </p>
              </div>

              <div className="space-y-3">
                {steps.map((step, index) => {
                  const stepNumber = index + 1;
                  const isActive = currentStep === stepNumber;
                  const isDone = currentStep > stepNumber;

                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                        isActive ? "border border-orange-200 bg-white shadow-sm" : "bg-transparent"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                          isDone
                            ? "bg-green-500 text-white"
                            : isActive
                            ? "bg-orange-600 text-white"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {isDone ? "✓" : stepNumber}
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-slate-900">{step}</div>
                        <div className="text-xs text-slate-500">Étape {stepNumber}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-2xl border border-orange-200 bg-white p-5">
                <p className="text-sm text-slate-500">Potentiel détecté</p>
                <div className="mt-1 text-3xl font-black text-orange-600">{estimation.niveauOptimisation}</div>
                <p className="mt-2 text-sm text-slate-600">
                  Une relecture par un conseiller peut affiner le résultat.
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">Formats acceptés</p>
                <p className="mt-2 text-sm text-slate-600">
                  PDF, JPG, PNG, WEBP — jusqu’à {MAX_FILES} fichiers, {MAX_FILE_SIZE_MB} Mo max par document.
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-5">
                <p className="text-sm font-semibold text-green-800">Analyse conseiller</p>
                <p className="mt-2 text-sm text-green-700">
                  Idéal pour comparer source, TOU, DRIS et les déductions oubliées.
                </p>
              </div>
            </div>
          </aside>

          <main className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {currentStep === 1 && (
                  <div>
                    <SectionTitle
                      eyebrow="Étape 1"
                      title="Profil"
                      description="On démarre par les informations de base. Tout est pensé pour être rapide à remplir."
                    />

                    <SmartHint>{smartProfileHint}</SmartHint>

                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label htmlFor="nomComplet" className={labelClassName}>
                          Nom complet *
                        </label>
                        <input
                          id="nomComplet"
                          type="text"
                          className={getInputClassName("nomComplet")}
                          value={formData.nomComplet}
                          onChange={(e) => updateField("nomComplet", e.target.value)}
                          onBlur={() => handleBlur("nomComplet")}
                          placeholder="Votre nom et prénom"
                        />
                        {renderFieldError("nomComplet")}
                      </div>

                      <div>
                        <label htmlFor="email" className={labelClassName}>
                          Email *
                        </label>
                        <input
                          id="email"
                          type="email"
                          className={getInputClassName("email")}
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          onBlur={() => handleBlur("email")}
                          placeholder="exemple@email.com"
                        />
                        {renderFieldError("email")}
                      </div>

                      <div>
                        <label htmlFor="telephone" className={labelClassName}>
                          Téléphone *
                        </label>
                        <input
                          id="telephone"
                          type="tel"
                          className={getInputClassName("telephone")}
                          value={formData.telephone}
                          onChange={(e) => updateField("telephone", e.target.value)}
                          onBlur={() => handleBlur("telephone")}
                          placeholder="+41 79 000 00 00"
                        />
                        {renderFieldError("telephone")}
                      </div>
                    </div>

                    <div className="mt-8 space-y-6">
                      <div>
                        <p className={labelClassName}>Canton</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {["Genève", "Vaud"].map((option) => (
                            <ChoicePill
                              key={option}
                              active={formData.canton === option}
                              onClick={() => updateField("canton", option)}
                            >
                              {option}
                            </ChoicePill>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className={labelClassName}>Statut</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {["Frontalier", "Résident"].map((option) => (
                            <ChoicePill
                              key={option}
                              active={formData.statut === option}
                              onClick={() => updateField("statut", option)}
                            >
                              {option}
                            </ChoicePill>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className={labelClassName}>Situation familiale</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {["Célibataire", "Marié", "Divorcé", "Parent seul"].map((option) => (
                            <ChoicePill
                              key={option}
                              active={formData.situationFamiliale === option}
                              onClick={() => updateField("situationFamiliale", option)}
                            >
                              {option}
                            </ChoicePill>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className={labelClassName}>Nombre d’enfants</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {[0, 1, 2, 3].map((option) => (
                            <ChoicePill
                              key={option}
                              active={parseNumber(formData.enfants) === option}
                              onClick={() => updateField("enfants", option)}
                            >
                              {option === 3 ? "3+" : option}
                            </ChoicePill>
                          ))}
                        </div>
                        <p className={helperTextClass}>Vous pouvez cliquer sur une valeur directement.</p>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <SectionTitle
                      eyebrow="Étape 2"
                      title="Situation fiscale"
                      description="Choisissez simplement le cadre qui vous correspond."
                    />

                    <SmartHint>{smartTaxHint}</SmartHint>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                      <OptionCard
                        active={formData.modeImposition === "Impôt à la source"}
                        onClick={() => updateField("modeImposition", "Impôt à la source")}
                        title="Impôt à la source"
                        description="Cas le plus fréquent pour un frontalier ou un salarié imposé directement."
                        icon={<Landmark className="h-5 w-5" />}
                      />
                      <OptionCard
                        active={formData.modeImposition === "Ordinaire"}
                        onClick={() => updateField("modeImposition", "Ordinaire")}
                        title="Ordinaire"
                        description="Adapté si vous êtes taxé de manière ordinaire ou souhaitez comparer votre situation."
                        icon={<FileText className="h-5 w-5" />}
                      />
                    </div>
                    {renderFieldError("modeImposition")}

                    <div className="mt-8">
                      <p className={labelClassName}>Parcours fiscal</p>
                      <div className="mt-3 grid gap-4 md:grid-cols-3">
                        <OptionCard
                          active={formData.parcoursFiscal === "DRIS"}
                          onClick={() => updateField("parcoursFiscal", "DRIS")}
                          title="DRIS"
                          description="Pour corriger ou compléter certaines déductions à la source."
                          icon={<Sparkles className="h-5 w-5" />}
                        />
                        <OptionCard
                          active={formData.parcoursFiscal === "TOU"}
                          onClick={() => updateField("parcoursFiscal", "TOU")}
                          title="TOU"
                          description="Pour comparer l’impôt source et une taxation plus complète."
                          icon={<ShieldCheck className="h-5 w-5" />}
                        />
                        <OptionCard
                          active={formData.parcoursFiscal === "Estimation simple"}
                          onClick={() => updateField("parcoursFiscal", "Estimation simple")}
                          title="Estimation simple"
                          description="Pour obtenir une première lecture rapide de votre situation."
                          icon={<Bot className="h-5 w-5" />}
                        />
                      </div>
                      {renderFieldError("parcoursFiscal")}
                    </div>

                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="commune" className={labelClassName}>
                          Commune
                        </label>
                        <input
                          id="commune"
                          type="text"
                          className={getInputClassName("commune")}
                          value={formData.commune}
                          onChange={(e) => updateField("commune", e.target.value)}
                          onBlur={() => handleBlur("commune")}
                          placeholder="Ex : Genève / Nyon / Lausanne"
                        />
                        <SuggestionChips
                          title="Suggestions rapides"
                          suggestions={communeSuggestions}
                          onPick={(item) => updateField("commune", item.value)}
                        />
                      </div>

                      <div>
                        <p className={labelClassName}>Quasi-résident</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {["Non", "Oui"].map((option) => (
                            <ChoicePill
                              key={option}
                              active={formData.quasiResident === option}
                              onClick={() => updateField("quasiResident", option)}
                            >
                              {option}
                            </ChoicePill>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                      <SummaryCard
                        label="Parcours choisi"
                        value={formData.parcoursFiscal}
                        tone="orange"
                        subtext="Le moteur adapte le scénario sélectionné."
                      />
                      <SummaryCard
                        label="Mode"
                        value={formData.modeImposition}
                        subtext="Permet une estimation plus cohérente avec votre situation."
                      />
                      <SummaryCard
                        label="Opportunité"
                        value={estimation.niveauOptimisation}
                        tone="green"
                        subtext="Le conseiller pourra confirmer le meilleur levier."
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <SectionTitle
                      eyebrow="Étape 3"
                      title="Revenus"
                      description="Utilisez les montants suggérés pour aller vite, puis ajustez si besoin."
                    />

                    <SmartHint>{smartIncomeHint}</SmartHint>

                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="salaireAnnuel" className={labelClassName}>
                          Salaire annuel brut (CHF) *
                        </label>
                        <input
                          id="salaireAnnuel"
                          type="number"
                          min="0"
                          className={getInputClassName("salaireAnnuel")}
                          value={formData.salaireAnnuel}
                          onChange={(e) => updateField("salaireAnnuel", e.target.value)}
                          onBlur={() => handleBlur("salaireAnnuel")}
                          placeholder="Ex : 85000"
                        />
                        {renderFieldError("salaireAnnuel")}
                        <SuggestionChips
                          title="Montants fréquents"
                          suggestions={salarySuggestions}
                          onPick={(item) => updateField("salaireAnnuel", item.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="autresRevenus" className={labelClassName}>
                          Autres revenus (CHF)
                        </label>
                        <input
                          id="autresRevenus"
                          type="number"
                          min="0"
                          className={getInputClassName("autresRevenus")}
                          value={formData.autresRevenus}
                          onChange={(e) => updateField("autresRevenus", e.target.value)}
                          onBlur={() => handleBlur("autresRevenus")}
                          placeholder="Ex : 5000"
                        />
                        {renderFieldError("autresRevenus")}
                        <p className={helperTextClass}>
                          Exemple : revenus accessoires, indemnités, activité secondaire.
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                      <div>
                        <p className={labelClassName}>13e salaire</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {["Oui", "Non"].map((option) => (
                            <ChoicePill
                              key={option}
                              active={formData.treiziemeSalaire === option}
                              onClick={() => updateField("treiziemeSalaire", option)}
                            >
                              {option}
                            </ChoicePill>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="revenuConjoint" className={labelClassName}>
                          Revenu du conjoint (CHF)
                        </label>
                        <input
                          id="revenuConjoint"
                          type="number"
                          min="0"
                          className={getInputClassName("revenuConjoint")}
                          value={formData.revenuConjoint}
                          onChange={(e) => updateField("revenuConjoint", e.target.value)}
                          onBlur={() => handleBlur("revenuConjoint")}
                          placeholder="Ex : 45000"
                        />
                        {renderFieldError("revenuConjoint")}
                      </div>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                      <SummaryCard
                        label="Revenus saisis"
                        value={formatCurrency(estimation.totalRevenus)}
                        tone="orange"
                        subtext="Montant provisoire calculé selon vos réponses."
                        icon={<Coins className="h-5 w-5" />}
                      />
                      <SummaryCard
                        label="Situation"
                        value={formData.situationFamiliale}
                        subtext="Le calcul s’adapte automatiquement à votre statut familial."
                      />
                      <SummaryCard
                        label="Dossier"
                        value="En bonne voie"
                        tone="green"
                        subtext="Encore quelques éléments et votre dossier sera prêt à être enregistré."
                      />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div>
                    <SectionTitle
                      eyebrow="Étape 4"
                      title="Déductions"
                      description="Ajoutez quelques montants clés. Même une estimation simple suffit pour rendre le dossier utile."
                    />

                    <SmartHint>{smartDeductionHint}</SmartHint>

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Aide au remplissage rapide
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {deductionSuggestions.map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => updateField(item.field, item.value)}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-700"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="troisiemePilier" className={labelClassName}>
                          3e pilier (CHF)
                        </label>
                        <input
                          id="troisiemePilier"
                          type="number"
                          min="0"
                          className={getInputClassName("troisiemePilier")}
                          value={formData.troisiemePilier}
                          onChange={(e) => updateField("troisiemePilier", e.target.value)}
                          onBlur={() => handleBlur("troisiemePilier")}
                          placeholder="Ex : 7056"
                        />
                        {renderFieldError("troisiemePilier")}
                      </div>

                      <div>
                        <label htmlFor="assuranceMaladie" className={labelClassName}>
                          Assurance maladie (CHF)
                        </label>
                        <input
                          id="assuranceMaladie"
                          type="number"
                          min="0"
                          className={getInputClassName("assuranceMaladie")}
                          value={formData.assuranceMaladie}
                          onChange={(e) => updateField("assuranceMaladie", e.target.value)}
                          onBlur={() => handleBlur("assuranceMaladie")}
                          placeholder="Ex : 4200"
                        />
                        {renderFieldError("assuranceMaladie")}
                      </div>

                      <div>
                        <label htmlFor="fraisTransport" className={labelClassName}>
                          Frais de transport (CHF)
                        </label>
                        <input
                          id="fraisTransport"
                          type="number"
                          min="0"
                          className={getInputClassName("fraisTransport")}
                          value={formData.fraisTransport}
                          onChange={(e) => updateField("fraisTransport", e.target.value)}
                          onBlur={() => handleBlur("fraisTransport")}
                          placeholder="Ex : 1200"
                        />
                        {renderFieldError("fraisTransport")}
                      </div>

                      <div>
                        <label htmlFor="fraisGarde" className={labelClassName}>
                          Frais de garde (CHF)
                        </label>
                        <input
                          id="fraisGarde"
                          type="number"
                          min="0"
                          className={getInputClassName("fraisGarde")}
                          value={formData.fraisGarde}
                          onChange={(e) => updateField("fraisGarde", e.target.value)}
                          onBlur={() => handleBlur("fraisGarde")}
                          placeholder="Ex : 2500"
                        />
                        {renderFieldError("fraisGarde")}
                      </div>

                      <div>
                        <label htmlFor="pensionsAlimentaires" className={labelClassName}>
                          Pensions alimentaires (CHF)
                        </label>
                        <input
                          id="pensionsAlimentaires"
                          type="number"
                          min="0"
                          className={getInputClassName("pensionsAlimentaires")}
                          value={formData.pensionsAlimentaires}
                          onChange={(e) => updateField("pensionsAlimentaires", e.target.value)}
                          onBlur={() => handleBlur("pensionsAlimentaires")}
                          placeholder="Ex : 3600"
                        />
                        {renderFieldError("pensionsAlimentaires")}
                      </div>

                      <div>
                        <label htmlFor="fraisFormation" className={labelClassName}>
                          Frais de formation (CHF)
                        </label>
                        <input
                          id="fraisFormation"
                          type="number"
                          min="0"
                          className={getInputClassName("fraisFormation")}
                          value={formData.fraisFormation}
                          onChange={(e) => updateField("fraisFormation", e.target.value)}
                          onBlur={() => handleBlur("fraisFormation")}
                          placeholder="Ex : 900"
                        />
                        {renderFieldError("fraisFormation")}
                      </div>

                      <div>
                        <label htmlFor="interetsDette" className={labelClassName}>
                          Intérêts de dette (CHF)
                        </label>
                        <input
                          id="interetsDette"
                          type="number"
                          min="0"
                          className={getInputClassName("interetsDette")}
                          value={formData.interetsDette}
                          onChange={(e) => updateField("interetsDette", e.target.value)}
                          onBlur={() => handleBlur("interetsDette")}
                          placeholder="Ex : 1200"
                        />
                        {renderFieldError("interetsDette")}
                      </div>
                    </div>

                    <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">Fortune estimative</h4>
                          <p className="mt-1 text-sm text-slate-600">
                            Facultatif, uniquement si vous souhaitez affiner l’estimation.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowFortuneFields((prev) => !prev)}
                          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          {showFortuneFields ? "Masquer" : "Ajouter la fortune"}
                        </button>
                      </div>

                      {showFortuneFields ? (
                        <div className="mt-6 grid gap-6 md:grid-cols-2">
                          <div>
                            <label htmlFor="avoirsBancaires" className={labelClassName}>
                              Avoirs bancaires (CHF)
                            </label>
                            <input
                              id="avoirsBancaires"
                              type="number"
                              min="0"
                              className={getInputClassName("avoirsBancaires")}
                              value={formData.avoirsBancaires}
                              onChange={(e) => updateField("avoirsBancaires", e.target.value)}
                              onBlur={() => handleBlur("avoirsBancaires")}
                              placeholder="Ex : 15000"
                            />
                            {renderFieldError("avoirsBancaires")}
                          </div>

                          <div>
                            <label htmlFor="titres" className={labelClassName}>
                              Titres / actions (CHF)
                            </label>
                            <input
                              id="titres"
                              type="number"
                              min="0"
                              className={getInputClassName("titres")}
                              value={formData.titres}
                              onChange={(e) => updateField("titres", e.target.value)}
                              onBlur={() => handleBlur("titres")}
                              placeholder="Ex : 5000"
                            />
                            {renderFieldError("titres")}
                          </div>

                          <div>
                            <label htmlFor="immobilier" className={labelClassName}>
                              Immobilier (CHF)
                            </label>
                            <input
                              id="immobilier"
                              type="number"
                              min="0"
                              className={getInputClassName("immobilier")}
                              value={formData.immobilier}
                              onChange={(e) => updateField("immobilier", e.target.value)}
                              onBlur={() => handleBlur("immobilier")}
                              placeholder="Ex : 300000"
                            />
                            {renderFieldError("immobilier")}
                          </div>

                          <div>
                            <label htmlFor="dettes" className={labelClassName}>
                              Dettes (CHF)
                            </label>
                            <input
                              id="dettes"
                              type="number"
                              min="0"
                              className={getInputClassName("dettes")}
                              value={formData.dettes}
                              onChange={(e) => updateField("dettes", e.target.value)}
                              onBlur={() => handleBlur("dettes")}
                              placeholder="Ex : 180000"
                            />
                            {renderFieldError("dettes")}
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <SummaryCard
                          label="Fortune brute estimée"
                          value={formatCurrency(estimation.fortuneBrute)}
                          icon={<Home className="h-5 w-5" />}
                        />
                        <SummaryCard
                          label="Fortune nette estimée"
                          value={formatCurrency(estimation.fortuneNette)}
                          tone="green"
                          icon={<PiggyBank className="h-5 w-5" />}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div>
                    <SectionTitle
                      eyebrow="Étape 5"
                      title="Validation du dossier"
                      description=""
                    />

                    <div className="mt-6 rounded-3xl border border-orange-200 bg-orange-50 p-5 md:p-6">
                      <div className="flex items-start gap-3">
                        <Sparkles className="mt-0.5 h-5 w-5 text-orange-600" />
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">
                            Résultat détaillé débloqué après l’enregistrement
                          </h4>
                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            Avant la validation, vous voyez simplement que le dossier est prêt. Après l’enregistrement, le montant détaillé s’affiche immédiatement avec les options de prise de rendez-vous.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <SummaryCard
                        label="Dossier"
                        value={completionStats.percentage >= 90 ? "Prêt" : "À finaliser"}
                        tone={completionStats.percentage >= 90 ? "green" : "orange"}
                        subtext="Vos informations sont presque complètes."
                        icon={<CheckCircle2 className="h-5 w-5" />}
                      />
                      <SummaryCard
                        label="Parcours"
                        value={formData.parcoursFiscal}
                        subtext="Le scénario sélectionné est bien pris en compte."
                        icon={<FileText className="h-5 w-5" />}
                      />
                      <SummaryCard
                        label="Potentiel détecté"
                        value={estimation.niveauOptimisation}
                        tone="orange"
                        subtext="Le détail chiffré s’affichera juste après validation."
                        icon={<Sparkles className="h-5 w-5" />}
                      />
                      <SummaryCard
                        label="Lecture professionnelle"
                        value="Disponible"
                        tone="green"
                        subtext="Un conseiller peut ensuite affiner le dossier."
                        icon={<ShieldCheck className="h-5 w-5" />}
                      />
                    </div>

                    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                      <div className="rounded-3xl border border-slate-200 p-5 md:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">Justificatifs</h4>
                            <p className="mt-2 text-slate-600">
                              Ajoutez vos documents fiscaux si vous les avez déjà. Cela améliore la qualité de la relecture.
                            </p>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
                            Max {MAX_FILES} fichiers • {MAX_FILE_SIZE_MB} Mo / fichier
                          </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Upload className="h-4 w-4" />
                            Déposer les justificatifs
                          </div>

                          <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            onChange={handleFileChange}
                            className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-orange-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-orange-700 hover:file:bg-orange-100"
                          />
                          <p className="mt-3 text-xs text-slate-500">
                            Formats acceptés : PDF, JPG, PNG, WEBP.
                          </p>
                        </div>

                        {fileErrors.length > 0 && (
                          <div className="mt-4 space-y-2 rounded-2xl border border-red-200 bg-red-50 p-4">
                            {fileErrors.map((error, index) => (
                              <p key={index} className="text-sm text-red-700">
                                • {error}
                              </p>
                            ))}
                          </div>
                        )}

                        {uploadedFiles.length > 0 && (
                          <div className="mt-5 space-y-3">
                            {uploadedFiles.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-slate-900">
                                    {item.file.name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {(item.file.size / 1024 / 1024).toFixed(2)} Mo
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeFile(item.id)}
                                  className="shrink-0 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                                >
                                  Retirer
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 md:p-6">
                        <h4 className="text-lg font-bold text-slate-900">Préférence de contact</h4>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Choisissez le mode de suivi qui vous convient le mieux.
                        </p>

                        <div className="mt-6 grid gap-3">
                          {[
                            "Rappel téléphonique",
                            "Email",
                            "WhatsApp",
                            "Rendez-vous direct",
                          ].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setContactPreference(option)}
                              className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                                contactPreference === option
                                  ? "border-orange-300 bg-white text-orange-700 ring-4 ring-orange-100"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-orange-200"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>

                        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                          <label className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={consentContact}
                              onChange={(e) => {
                                setConsentContact(e.target.checked);
                                if (fieldErrors.consentContact) {
                                  setFieldErrors((prev) => {
                                    const next = { ...prev };
                                    delete next.consentContact;
                                    return next;
                                  });
                                }
                              }}
                              onBlur={() =>
                                setTouchedFields((prev) => ({
                                  ...prev,
                                  consentContact: true,
                                }))
                              }
                              className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-sm leading-6 text-slate-700">
                              J’accepte d’être recontacté pour le suivi de mon dossier et, si besoin, une proposition d’analyse adaptée à ma situation.
                            </span>
                          </label>
                          {renderFieldError("consentContact")}
                        </div>

                        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4">
                          <p className="text-sm font-semibold text-green-800">Parcours plus logique</p>
                          <p className="mt-2 text-sm leading-6 text-green-700">
                            Une fois le dossier validé, la simulation est visible.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 md:p-6">
                      <h4 className="text-lg font-bold text-slate-900">Estimation indicative</h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        L’estimation détaillée affichée après validation reste informative. Le montant réel dépend de la situation complète, des justificatifs fournis et du traitement final par les autorités.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {saveError && (
              <div
                aria-live="polite"
                className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {saveError}
              </div>
            )}

            <div className="mt-10 hidden items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1 || isSaving}
                className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                  currentStep === 1 || isSaving
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                Retour
              </button>

              <div className="text-sm text-slate-500">
                Étape {currentStep} sur {steps.length}
              </div>

              {currentStep === steps.length ? (
                <button
                  type="button"
                  onClick={saveDeclaration}
                  disabled={isSaving}
                  className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white transition ${
                    isSaving
                      ? "cursor-not-allowed bg-orange-300"
                      : "bg-orange-600 hover:bg-orange-700"
                  }`}
                >
                  {isSaving ? "Enregistrement en cours..." : "Enregistrer et voir mon résultat"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isSaving}
                  className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                    isSaving
                      ? "cursor-not-allowed bg-orange-300 text-white"
                      : "bg-orange-600 text-white hover:bg-orange-700"
                  }`}
                >
                  Continuer
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </main>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-4 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1 || isSaving}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              currentStep === 1 || isSaving
                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Retour
          </button>

          {currentStep === steps.length ? (
            <button
              type="button"
              onClick={saveDeclaration}
              disabled={isSaving}
              className={`flex-[1.5] rounded-2xl px-4 py-3 text-sm font-bold text-white transition ${
                isSaving
                  ? "cursor-not-allowed bg-orange-300"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {isSaving ? "Enregistrement..." : "Voir mon résultat"}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              disabled={isSaving}
              className={`flex-[1.5] rounded-2xl px-4 py-3 text-sm font-bold text-white transition ${
                isSaving
                  ? "cursor-not-allowed bg-orange-300"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              Continuer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}