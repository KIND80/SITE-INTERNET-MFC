// src/lib/scoringEngine.js (VERSION DE DÉBOGAGE)

import prestationsData from '../data/prestations.json';
import { WEIGHTS } from '../config/scoringConfig';

export function calculateTop3(userNeeds) {
  // --- ESPION 1 ---
  console.log("Besoin de l'utilisateur reçu :", userNeeds);

  const products = prestationsData.reduce((acc, prestation) => {
    const productNames = prestation.produit.split(' / ');
    productNames.forEach(name => {
      const productName = name.trim();
      const uniqueProductKey = `${prestation.caisse} - ${productName}`;
      if (!acc[uniqueProductKey]) {
        acc[uniqueProductKey] = { caisse: prestation.caisse, produit: productName, prestations: [] };
      }
      if (!acc[uniqueProductKey].prestations.some(p => p.critere === prestation.critere)) {
        acc[uniqueProductKey].prestations.push(prestation);
      }
    });
    return acc;
  }, {});

  const scoredProducts = Object.values(products).map(product => {
    let totalScore = 0;
    for (const need in userNeeds) {
      if (userNeeds[need]) {
        const relevantPrestation = product.prestations.find(p => p.critere === need);
        if (relevantPrestation && relevantPrestation.score !== null) {
          const weight = WEIGHTS[need] || 1;
          totalScore += relevantPrestation.score * weight;
        }
      }
    }
    return { ...product, totalScore };
  });

  // --- ESPION 2 ---
  console.log("Scores calculés avant le tri (les 20 premiers) :", scoredProducts.slice(0, 20));

  const sortedProducts = scoredProducts
    .filter(p => p.totalScore > 0)
    .sort((a, b) => b.totalScore - a.totalScore);

  // --- ESPION 3 ---
  console.log("Top 3 final :", sortedProducts.slice(0, 3));

  return sortedProducts.slice(0, 3);
}