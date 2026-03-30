// Parse et structure les descriptions pour le scoring

const parseCHF = (s) => {
  if (!s) return null;
  const clean = String(s).replace(/’/g, "'");
  const m1 = clean.match(/CHF\s*([\d'_.\s]+)/i);
  if (m1) return Number(m1[1].replace(/['_.\s]/g, "")) || null;
  const m2 = clean.match(/max\.?\s*([\d'_.\s]+)\s*(?:CHF|fr)/i);
  if (m2) return Number(m2[1].replace(/['_.\s]/g, "")) || null;
  return null;
};

export function normalizeRecord(rec) {
  const text = (rec.description || "").toLowerCase();

  const pctMatch = text.match(/(\d{1,3})\s*%/);
  const coverage_pct = pctMatch ? Math.min(100, Number(pctMatch[1])) : null;

  const cap_chf =
    parseCHF(rec.description) ??
    (() => {
      const m = text.match(/plafond.*?(\d{2,})/);
      return m ? Number(m[1]) : null;
    })();

  const period = /3 ans|trois ans/.test(text)
    ? "3years"
    : /par\s+cas/.test(text)
    ? "per_case"
    : /par\s+jour/.test(text)
    ? "per_day"
    : /par\s+an|annuel|\/an|an/.test(text)
    ? "year"
    : null;

  const requires_prescription = /(ordonnance|prescrit|prescription)/.test(text);
  const waiting_days = (() => {
    const m = text.match(/(\d{1,3})\s*(?:jours|day)/);
    return m ? Number(m[1]) : null;
  })();

  const geo = /monde|world/.test(text)
    ? "world"
    : /étranger|etranger|europe/.test(text)
    ? "eu"
    : "ch";

  // normalisation des clés
  const critereMap = {
    hosp_commune: "hosp_commune",
    hosp_semi: "hosp_semi",
    hosp_privee: "hosp_privee",
    hospitalisation_commune: "hosp_commune",
    hospitalisation_demi_privee: "hosp_semi",
    hospitalisation_privee: "hosp_privee",
    hospitalisation_ambulatoire: "hospitalisation_ambulatoire",
  };
  const critereNorm = critereMap[rec.critere] || rec.critere;

  return {
    ...rec,
    critere: critereNorm,
    coverage_pct,
    cap_chf,
    period,
    requires_prescription,
    waiting_days,
    geo,
  };
}
