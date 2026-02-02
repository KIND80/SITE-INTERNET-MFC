import React, { useEffect, useMemo, useState } from "react";

const WHATSAPP_PHONE = "41797896193"; // sans +
const CONTACT_EMAIL = "contact@monfideleconseiller.ch";

const SUBJECTS = ["LAMAL", "LCA", "Prévoyance / 3ème pilier", "Impôts"];

function buildMailto({ subject, message }) {
  const s = encodeURIComponent(`[MFC] Demande - ${subject}`);
  const body = encodeURIComponent(message || "");
  return `mailto:${CONTACT_EMAIL}?subject=${s}&body=${body}`;
}

function buildWhatsapp({ subject, message }) {
  const text = encodeURIComponent(
    `Bonjour,\n\nJe souhaite être contacté pour : ${subject}\n\nMessage :\n${
      message || ""
    }\n\nMerci.`
  );
  return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
}

export default function LeadCapturePopup({
  delayMs = 10000,
  storageKey = "mfc_lead_popup_dismissed_v1",
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // pour animation entrée/sortie
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");

  const alreadyDismissed = useMemo(() => {
    try {
      return localStorage.getItem(storageKey) === "1";
    } catch {
      return false;
    }
  }, [storageKey]);

  useEffect(() => {
    if (alreadyDismissed) return;
    const t = window.setTimeout(() => {
      setOpen(true);
      // petite frame pour que la transition parte bien
      requestAnimationFrame(() => setMounted(true));
    }, delayMs);
    return () => window.clearTimeout(t);
  }, [alreadyDismissed, delayMs]);

  // ESC pour fermer
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function persistDismiss() {
    try {
      localStorage.setItem(storageKey, "1");
    } catch {}
  }

  function close() {
    // animation de sortie
    setMounted(false);
    persistDismiss();
    // attendre la fin de transition
    window.setTimeout(() => setOpen(false), 220);
  }

  function openMail() {
    window.location.href = buildMailto({ subject, message });
    close();
  }

  function openWa() {
    window.open(
      buildWhatsapp({ subject, message }),
      "_blank",
      "noopener,noreferrer"
    );
    close();
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Contact conseiller"
      className={[
        "fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4",
        "transition-opacity duration-200",
        mounted ? "opacity-100" : "opacity-0",
        "bg-black/40 backdrop-blur-[2px]",
      ].join(" ")}
      onMouseDown={close}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className={[
          "w-full max-w-[560px] rounded-2xl bg-white shadow-2xl",
          "p-4 sm:p-6",
          "transition-all duration-200 ease-out",
          mounted
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-[0.98]",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
              Être contacté par un conseiller
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Choisis un sujet et laisse un message rapide. Réponse au plus
              vite.
            </p>
          </div>

          <button
            onClick={close}
            aria-label="Fermer"
            className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-xl leading-none transition"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-gray-800">Objet</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3">
          <label className="text-sm font-semibold text-gray-800">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ex : Je veux optimiser ma LAMAL / devis LCA / conseil 3ème pilier / optimisation fiscale…"
            rows={4}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10 resize-y"
          />
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <button
            onClick={openWa}
            className="w-full sm:flex-1 rounded-xl bg-green-600 text-white font-extrabold py-3 px-4 hover:bg-green-700 transition active:scale-[0.99]"
          >
            WhatsApp
          </button>

          <button
            onClick={openMail}
            className="w-full sm:flex-1 rounded-xl border border-gray-200 bg-white text-gray-900 font-extrabold py-3 px-4 hover:bg-gray-50 transition active:scale-[0.99]"
          >
            Envoyer par email
          </button>

          <button
            onClick={close}
            className="w-full sm:w-auto rounded-xl bg-gray-100 text-gray-900 font-semibold py-3 px-4 hover:bg-gray-200 transition"
          >
            Plus tard
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          WhatsApp : +41 79 789 61 93 · Email : contact@monfideleconseiller.ch
        </div>
      </div>
    </div>
  );
}
