import rawData from "@/data/benefits.raw.json";
import { normalizeRecord } from "@/utils/normalize";

// ----------------- pondérations par besoin (à ajuster)
const W = {
  meds_hors_base: 1.0,
  med_alt: 0.8,
  optique: 0.6,
  fitness: 0.4,
  prevention: 0.7,
  maternite: 1.0,
  dentaire: 0.9,
  psychotherapie: 0.9,
  moyens_auxiliaires: 0.8,
  voyage: 0.9,
  hosp_commune: 0.5,
  hosp_semi: 1.1,
  hosp_privee: 1.2,
  hospitalisation_ambulatoire: 0.8,
  aide_domicile: 0.7,
  cures: 0.5,
};

// ----------------- utilités élémentaires
function capPenalty(cap, period) {
  if (!cap || cap === 0) return 0; // illimité
  const target = period === "year" ? 5000 : period === "3years" ? 15000 : 5000;
  const ratio = Math.min(1, cap / target);
  return Math.max(0, 1 - ratio); // 0=aucune pénalité, 1=forte pénalité
}

function coverageUtility(pct) {
  if (!pct) return 0;
  if (pct >= 95) return 1.0;
  if (pct >= 90) return 0.9 + (pct - 90) * 0.02;
  if (pct >= 75) return 0.6 + (pct - 75) * 0.02;
  return (pct / 100) * 0.6;
}

function travelUtility(geo, days) {
  let base = geo === "world" ? 1 : geo === "eu" ? 0.8 : 0.5;
  if (days != null) base *= Math.min(1, (days || 0) / 180 + 0.4);
  return base;
}

// ----------------- score d'une ligne (un avantage)
function scoreRecord(rec) {
  const need = rec.critere;
  const w = W[need] ?? 0.6;

  let u = 0;
  if (need === "voyage") {
    u = travelUtility(rec.geo, rec.days_abroad);
  } else {
    const fallbackPct = rec.score ? Math.min(100, rec.score * 33) : null;
    u = coverageUtility(rec.coverage_pct ?? fallbackPct);
    u *= 1 - 0.6 * capPenalty(rec.cap_chf, rec.period);
    if (rec.waiting_days && rec.waiting_days > 60) u *= 0.9;
    if (rec.requires_prescription) u *= 0.97;
  }

  return { base: u, weighted: u * w };
}

// ----------------- agrégation par produit
function keyProduct(r) {
  return `${r.caisse}__${r.produit}`;
}

function aggregateProducts(lines, selectedNeeds) {
  const needs = new Set(selectedNeeds);
  const byProduct = new Map();

  for (const r of lines) {
    if (!needs.has(r.critere)) continue;
    const k = keyProduct(r);
    const s = scoreRecord(r);
    if (!byProduct.has(k)) {
      byProduct.set(k, {
        caisse: r.caisse,
        produit: r.produit,
        prestations: [],
        perNeedBest: new Map(),
      });
    }
    const prod = byProduct.get(k);
    // On garde la meilleure ligne par critère
    const cur = prod.perNeedBest.get(r.critere);
    if (!cur || s.weighted > cur.weighted) {
      prod.perNeedBest.set(r.critere, { rec: r, scoreParts: s });
    }
  }

  // Finalise l’agrégation
  const out = [];
  for (const prod of byProduct.values()) {
    const perNeed = Array.from(prod.perNeedBest.values());
    const total = perNeed.reduce((acc, x) => acc + x.scoreParts.weighted, 0);
    const coverageBonus = (perNeed.length / Math.max(1, needs.size)) * 0.05;

    // prestations (pour l’UI)
    const prestations = perNeed.map(({ rec, scoreParts }) => ({
      critere: rec.critere,
      description: rec.description,
      score: rec.score ?? null, // ton ancien 1–3 si dispo
      coverage_pct: rec.coverage_pct,
      cap_chf: rec.cap_chf,
      period: rec.period,
      util: Math.round(scoreParts.base * 100) / 100,
    }));

    out.push({
      caisse: prod.caisse,
      produit: prod.produit,
      totalScore: Math.round((total + coverageBonus) * 100) / 100,
      prestations,
    });
  }
  return out;
}

// ----------------- API publique utilisée par ton comparateur
export function calculateTop3(choices) {
  // 1) normaliser le dataset à l’import
  const normalized = rawData.map(normalizeRecord);

  // 2) besoins cochés
  const selectedNeeds = Object.keys(choices || {}).filter((k) => choices[k]);

  if (selectedNeeds.length === 0) {
    // si rien coché, on renvoie vide
    return [];
  }

  // 3) agrège & trie
  const products = aggregateProducts(normalized, selectedNeeds).sort(
    (a, b) => b.totalScore - a.totalScore
  );

  // 4) renvoie top 3 (structure compatible avec ton UI)
  return products.slice(0, 3);
}
