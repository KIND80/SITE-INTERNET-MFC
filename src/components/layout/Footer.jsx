import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Mail, Phone, ExternalLink, ArrowRight } from "lucide-react";
import siteConfig from "@/config/siteConfig";
import { openMailto, CONTACT_EMAIL } from "@/lib/mailto";

const FALLBACK_LOGO = "/logo.png";

// ✅ Priminfo (comparateur LAMal officiel)
const PRIMINFO_URL = "https://www.priminfo.admin.ch/fr/praemien";

export default function Footer({ showToast }) {
  const navigate = useNavigate();
  const { footer: footerData, logoUrl } = siteConfig;

  const year = useMemo(() => new Date().getFullYear(), []);

  const safePhoneHref = useMemo(() => {
    const raw = footerData?.contact?.phone || "";
    return `tel:${raw.replace(/\s/g, "")}`;
  }, [footerData?.contact?.phone]);

  const handleLinkClick = (link) => {
    if (!link) return;

    // ✅ Forcer le bouton "Comparer ma LAMal" vers Priminfo
    if (link.action === "priminfo") {
      window.open(PRIMINFO_URL, "_blank", "noopener,noreferrer");
      return;
    }

    if (link.action === "mailto") {
      openMailto(CONTACT_EMAIL, link.subject || "Contact");
      return;
    }
    if (link.isExternal && link.path) {
      window.open(link.path, "_blank", "noopener,noreferrer");
      return;
    }
    if (link.isPhone && link.path) {
      window.location.href = `tel:${String(link.path).replace(/\s/g, "")}`;
      return;
    }
    if (link.path) {
      navigate(link.path);
      return;
    }
    showToast?.();
  };

  // ✅ Utilise ça si tu veux afficher un bouton LAMal "priminfo" même si
  // le config ne le fournit pas (fallback). Sinon tu peux l’enlever.
  const lamalCta =
    (footerData?.usefulLinks?.links || []).find(
      (l) =>
        (l.label || "").toLowerCase().includes("lamal") &&
        (l.label || "").toLowerCase().includes("comparer")
    ) || null;

  return (
    <footer className="relative bg-gray-950 text-white">
      {/* subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.15),transparent_55%)] pointer-events-none" />

      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Brand / Contact */}
            <div className="lg:col-span-5 space-y-5">
              <Link to="/" className="inline-flex items-center gap-3">
                <img
                  alt={footerData?.logo?.alt || "Mon Fidèle Conseiller"}
                  className="h-12 w-auto"
                  src={logoUrl || FALLBACK_LOGO}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_LOGO;
                  }}
                />
              </Link>

              <p className="text-sm text-gray-300 leading-relaxed max-w-md">
                {footerData?.brandText ||
                  "Conseils en assurance & prévoyance en Suisse (Genève / Vaud). Réponse rapide et accompagnement personnalisé."}
              </p>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-base font-semibold text-gray-100">
                  {footerData?.contact?.title || "Contact"}
                </div>

                <ul className="mt-3 space-y-2 text-gray-300 text-sm">
                  {(footerData?.contact?.address || footerData?.contact?.city) && (
                    <li className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-orange-400" />
                      <span>
                        {footerData?.contact?.address}
                        {footerData?.contact?.address && footerData?.contact?.city
                          ? " · "
                          : ""}
                        {footerData?.contact?.city}
                      </span>
                    </li>
                  )}

                  {footerData?.contact?.email && (
                    <li className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-orange-400" />
                      <button
                        type="button"
                        onClick={() =>
                          openMailto(
                            footerData.contact.email,
                            "Contact – Mon Fidèle Conseiller"
                          )
                        }
                        className="text-left hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/15 rounded"
                      >
                        {footerData.contact.email}
                      </button>
                    </li>
                  )}

                  {footerData?.contact?.phone && (
                    <li className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-orange-400" />
                      <a
                        href={safePhoneHref}
                        className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/15 rounded"
                      >
                        {footerData.contact.phone}
                      </a>
                    </li>
                  )}
                </ul>

                {/* CTA row */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openMailto(CONTACT_EMAIL, "Demande – Mon Fidèle Conseiller")
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-extrabold text-white hover:bg-orange-400 transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-white/15"
                  >
                    Nous contacter
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <a
                    href={safePhoneHref}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-gray-100 hover:bg-white/[0.06] transition focus:outline-none focus:ring-2 focus:ring-white/15"
                  >
                    Appeler
                    <ExternalLink className="h-4 w-4 opacity-80" />
                  </a>
                </div>

                {/* ✅ Bouton Priminfo (responsive, propre, optionnel)
                    - si ton config contient déjà un lien "Comparer ma LAMal", on l’affiche ici aussi
                    - sinon tu peux laisser uniquement ce bouton hardcodé */}
                <div className="mt-3">
                  <a
                    href={PRIMINFO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-orange-400/20 bg-orange-500/10 px-4 py-3 text-sm font-extrabold text-orange-200 hover:bg-orange-500/15 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/15"
                  >
                    Comparer ma LAMal (Priminfo)
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Insurance links */}
            <div className="lg:col-span-3">
              <div className="text-base font-semibold text-gray-100">
                {footerData?.insuranceLinks?.title || "Assurances"}
              </div>

              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                {(footerData?.insuranceLinks?.links || []).map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="inline-flex items-center gap-2 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/15 rounded"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-400/80" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Useful links */}
            <div className="lg:col-span-4">
              <div className="text-base font-semibold text-gray-100">
                {footerData?.usefulLinks?.title || "Liens utiles"}
              </div>

              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300">
                {(footerData?.usefulLinks?.links || []).map((link) => {
                  // ✅ Si le label correspond au bouton LAMal → Priminfo
                  const isComparerLamal =
                    (link.label || "").toLowerCase().includes("comparer") &&
                    (link.label || "").toLowerCase().includes("lamal");

                  if (isComparerLamal) {
                    return (
                      <li key={link.label}>
                        <a
                          href={PRIMINFO_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-xl border border-orange-400/20 bg-orange-500/10 px-3 py-3 hover:bg-orange-500/15 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/15"
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={link.label}>
                      {link.path ? (
                        <Link
                          to={link.path}
                          className="block rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3 hover:bg-white/[0.06] hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/15"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleLinkClick(link)}
                          className="w-full text-left rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3 hover:bg-white/[0.06] hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/15"
                        >
                          {link.label}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 border-t border-white/10 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
            <p>
              {(footerData?.copyright || "© {year} Mon Fidèle Conseiller").replace(
                "{year}",
                String(year)
              )}
            </p>

            {footerData?.creatorCredit ? (
              <p className="text-gray-500">{footerData.creatorCredit}</p>
            ) : (
              <p className="text-gray-500">
                {footerData?.legalHint || "Conseil indépendant · Réponse rapide"}
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
