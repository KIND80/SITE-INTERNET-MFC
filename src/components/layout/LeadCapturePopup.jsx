import React, { useEffect, useMemo, useRef, useState } from "react";

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
  storageKey = "mfc_lead_popup_dismissed_v2",
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");

  // ✅ Focus trap / accessibilité
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

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
      previouslyFocusedRef.current = document.activeElement;
      setOpen(true);
      requestAnimationFrame(() => setMounted(true));
    }, delayMs);

    return () => window.clearTimeout(t);
  }, [alreadyDismissed, delayMs]);

  // ESC + focus trap
  useEffect(() => {
    if (!open) return;

    // focus initial
    window.setTimeout(() => closeBtnRef.current?.focus(), 0);

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }

      if (e.key !== "Tab") return;

      const root = panelRef.current;
      if (!root) return;

      const focusables = root.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // lock scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function persistDismiss() {
    try {
      localStorage.setItem(storageKey, "1");
    } catch {}
  }

  function close() {
    setMounted(false);
    persistDismiss();

    window.setTimeout(() => {
      setOpen(false);
      // restore focus
      previouslyFocusedRef.current?.focus?.();
    }, 220);
  }

  function openMail() {
    window.location.href = buildMailto({ subject, message });
    close();
  }

  function openWa() {
    window.open(buildWhatsapp({ subject, message }), "_blank", "noopener,noreferrer");
    close();
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-popup-title"
      className={[
        "fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4",
        "bg-black/45 backdrop-blur-[2px]",
        "transition-opacity duration-200",
        mounted ? "opacity-100" : "opacity-0",
      ].join(" ")}
      onMouseDown={(e) => {
        // ferme uniquement si clic sur l’overlay (pas dans le panel)
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        className={[
          "w-full max-w-[560px] rounded-2xl bg-white shadow-2xl",
          "p-4 sm:p-6",
          "transition-all duration-200 ease-out",
          mounted
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-[0.98]",
          // ✅ safe areas on very small devices
          "max-h-[calc(100dvh-2rem)] overflow-auto",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              id="lead-popup-title"
              className="text-lg sm:text-xl font-extrabold text-gray-900"
            >
              Être contacté par un conseiller
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Choisis un sujet et laisse un message rapide. Réponse au plus vite.
            </p>
          </div>

          {/* ✅ pas un span : vrai button, accessible */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            aria-label="Fermer"
            className={[
              "shrink-0 h-10 w-10 rounded-full",
              "border border-gray-200 bg-white",
              "hover:bg-gray-50 active:scale-[0.98] transition",
              "flex items-center justify-center",
              "text-gray-900 text-lg leading-none",
              "focus:outline-none focus:ring-2 focus:ring-black/10",
            ].join(" ")}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="mt-4">
          <label htmlFor="lead-subject" className="text-sm font-semibold text-gray-800">
            Objet
          </label>
          <select
            id="lead-subject"
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
          <label htmlFor="lead-message" className="text-sm font-semibold text-gray-800">
            Message
          </label>
          <textarea
            id="lead-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ex : Je veux optimiser ma LAMAL / devis LCA / conseil 3ème pilier / optimisation fiscale…"
            rows={4}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10 resize-y"
          />
        </div>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={openWa}
            className="rounded-xl bg-green-600 text-white font-extrabold py-3 px-4 hover:bg-green-700 transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            WhatsApp
          </button>

          <button
            type="button"
            onClick={openMail}
            className="rounded-xl border border-gray-200 bg-white text-gray-900 font-extrabold py-3 px-4 hover:bg-gray-50 transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            Envoyer par email
          </button>

          <button
            type="button"
            onClick={close}
            className="rounded-xl bg-gray-100 text-gray-900 font-semibold py-3 px-4 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            Plus tard
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          WhatsApp : +41 79 789 61 93 · Email : {CONTACT_EMAIL}
        </div>
      </div>
    </div>
  );
}
