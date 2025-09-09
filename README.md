---

# Moteur de Comparaison d'Assurances Complémentaires

Ce document détaille le fonctionnement et la logique du moteur de comparaison intégré, conçu pour recommander les trois assurances complémentaires les plus pertinentes en fonction des besoins spécifiques d'un utilisateur.

## 1. Principe Général

Le comparateur utilise un système de **scoring pondéré** pour évaluer et classer chaque produit d'assurance. Le processus se déroule en trois étapes :

1.  **Récolte des Besoins :** L'utilisateur répond à un questionnaire simple. Chaque réponse "oui" active un critère de recherche.
2.  **Calcul du Score :** L'algorithme attribue un score à chaque produit d'assurance en fonction de sa performance sur les critères activés par l'utilisateur.
3.  **Classement :** Les produits sont triés par score décroissant, et le Top 3 est affiché.

## 2. La Base de Données des Prestations

Le cœur du système est le fichier `src/data/prestations.json`. C'est une base de données qui contient une liste de toutes les prestations offertes par les différentes assurances. Chaque entrée de ce fichier respecte la structure suivante :

-   **`caisse`**: Le nom de la compagnie d'assurance (ex: "Sanitas").
-   **`produit`**: Le nom du produit d'assurance (ex: "Vital Premium").
-   **`critere`**: Le besoin technique auquel la prestation répond (ex: `optique`, `voyage`, `med_alt`).
-   **`description`**: Un résumé de la couverture offerte.
-   **`score`**: Une note de **0 à 3** évaluant la qualité de cette prestation spécifique.

## 3. Le Principe des Scores (Notation de 0 à 3)

Chaque prestation dans le fichier `prestations.json` se voit attribuer un **score brut** qui reflète sa générosité. Cette notation permet une comparaison objective entre les offres.

-   **`Score 0` : Aucune couverture.** Le produit ne couvre pas ce besoin.
-   **`Score 1` : Couverture faible ou très limitée.** Par exemple, un remboursement très bas ou avec de fortes restrictions.
-   **`Score 2` : Couverture correcte / moyenne.** C'est la norme du marché, une prestation standard qui répond au besoin de manière satisfaisante.
-   **`Score 3` : Couverture forte ou excellente.** Une prestation généreuse, avec des plafonds élevés, peu de restrictions, ou une couverture complète.

> **Note :** Cette notation est volontairement basée sur la *valeur réelle* de la prestation plutôt que sur le nom marketing du produit. Ainsi, un produit "Premium" d'une assurance peut avoir un score de 2 sur un critère s'il est moins performant qu'un produit "Balance" d'un concurrent.

## 4. La Pondération des Critères (Importance des Besoins)

Tous les besoins n'ont pas la même importance pour l'utilisateur. La pondération permet de donner plus de poids à certains critères. Ces poids sont définis dans le fichier `src/config/scoringConfig.js`.

**Exemple de pondération :**
-   Une couverture **voyage** (`voyage`, poids `3`) est considérée comme plus décisive qu'une contribution au **fitness** (`fitness`, poids `1`).
-   Une couverture pour l'hospitalisation en **privé** (`hosp_privee`, poids `3`) a plus d'impact qu'une couverture en **commune** (`hosp_commune`, poids `1`).

## 5. Le Calcul du Score Final

Le score final d'un produit d'assurance est calculé avec la formule suivante :

`Score Final = Somme de ( score[prestation] × poids[critere] )`

Ce calcul est effectué **uniquement pour les critères que l'utilisateur a sélectionnés**.

**Exemple concret :**
-   L'utilisateur coche "Lunettes" (`optique`, poids `2`) et "Voyage" (`voyage`, poids `3`).
-   L'assurance "Alpha Premium" a un score de `3` en optique et `2` en voyage.
-   Le score final pour "Alpha Premium" sera : `(3 × 2) + (2 × 3) = 6 + 6 = 12`.

Ce processus est répété pour chaque produit d'assurance disponible. Les trois produits avec le score final le plus élevé sont ensuite présentés à l'utilisateur.