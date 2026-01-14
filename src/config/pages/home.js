import lacLeman from "../../assets/images/lac-leman.jpg";

const homePage = {
  newHero: {
    title: "Votre Assurance, Simplifiée & Optimisée.",
    subtitle:
      "Conseils experts à Genève et Vaud pour des économies maximales. Votre tranquillité d'esprit est notre priorité.",
    primaryCta: {
      text: "Obtenir une Offre Gratuite",
      path: "#contact",
    },
    secondaryCta: {
      text: "Comparer ma complémentaire",
      path: "comparateur/assurance-maladie",
    },
    image: {
      src: lacLeman, // ✅ import propre depuis src/assets
      alt: "Vue sur le lac Léman et Genève",
      text: "Vue panoramique sur Genève, le Jet d'Eau et le lac Léman",
    },
  },

  intro: {
    title: "L'expertise d'un courtier local, la force d'un réseau national.",
    description:
      "Basés à Genève, nous sommes vos alliés pour naviguer dans le monde complexe des assurances. Indépendants, nous travaillons pour vous, pas pour les compagnies. Notre mission : vous garantir les meilleures couvertures aux meilleurs prix.",
    image: {
      src: "conseiller-geneve.jpg",
      alt: "Conseiller souriant dans un bureau moderne à Genève",
      text: "Un conseiller en assurance dans un bureau lumineux avec la ville de Genève en arrière-plan",
    },
  },

  servicesSection: {
    tagline: "Nos Domaines d'Expertise",
    title: "Une solution sur-mesure pour chaque besoin",
    description:
      "Que vous soyez un particulier, une famille ou une entreprise, nous maîtrisons tous les aspects de votre protection.",
    services: [
      {
        icon: "HeartHandshake",
        title: "Assurance Maladie (LAMal)",
        description:
          "Économisez sur vos primes sans sacrifier votre couverture. Nous comparons toutes les caisses pour vous.",
        linkText: "Assurance maladie",
        path: "assurances/particulier/assurance-maladie",
      },
      {
        icon: "Users",
        title: "Prévoyance & 3ème Pilier",
        description:
          "Construisez votre avenir en toute sérénité. Nos stratégies de prévoyance sont fiscalement avantageuses.",
        linkText: "Préparer ma retraite",
        path: "assurances/particulier/3eme-pilier",
      },
      {
        icon: "Building",
        title: "Assurances Entreprise",
        description:
          "De la RC Pro à la LPP, protégez votre activité et vos collaborateurs avec des solutions adaptées.",
        linkText: "Protéger mon business",
        path: "assurances/entreprise/rc-professionnelle",
      },
      {
        icon: "Home",
        title: "Hypothèque & Habitat",
        description:
          "Accédez à la propriété ou assurez votre bien. Nous négocions les meilleures conditions pour vous.",
        linkText: "Mon projet immobilier",
        path: "assurances/habitat/assurance-batiment",
      },
      {
        icon: "ShieldCheck",
        title: "Protection & Patrimoine",
        description:
          "Assurance vie, protection juridique... Sécurisez ce qui compte le plus pour vous et vos proches.",
        linkText: "Sécuriser ma famille",
        path: "assurances/particulier/assurance-automobile",
      },
      {
        icon: "Car",
        title: "Véhicules & Mobilité",
        description:
          "Auto, moto, bateau... Obtenez les meilleures garanties pour tous vos véhicules au tarif le plus juste.",
        linkText: "Assurer mon véhicule",
        path: "assurances/particulier/assurance-automobile",
      },
    ],
  },

  partnersSection: {
    title: "Notre indépendance, votre avantage",
    description:
      "Nous collaborons avec toutes les compagnies d'assurance majeures en Suisse pour vous garantir une objectivité totale et les offres les plus compétitives.",
    linkText: "Découvrir tous nos partenaires",
    logos: [
      { name: "Assura", src: "/partners/assura.png" },
      { name: "AXA", src: "/partners/axa.png" },
      { name: "Generali", src: "/partners/generali.png" },
      { name: "Groupe Mutuel", src: "/partners/groupe-mutuel.jpg" },
      { name: "Helsana", src: "/partners/helsana.png" },
      { name: "Sanitas", src: "/partners/Sanitas.png" },
      { name: "Swica", src: "/partners/swica.png" },
      { name: "Visana", src: "/partners/visana.png" },
      { name: "Zugerberg", src: "/partners/Zugerberg.png" },
    ],
  },

  testimonialsSection: {
    tagline: "La parole à nos clients",
    title: "Ceux qui parlent le mieux de nous, ce sont eux.",
    description:
      "La confiance et la satisfaction de nos clients à Genève, Lausanne et dans tout le canton de Vaud sont notre plus grande fierté.",
    testimonials: [
      {
        name: "Céline B.",
        role: "Architecte, Genève",
        content:
          "Une efficacité redoutable ! Mon Fidele Conseiller a restructuré toutes mes assurances et m'a fait économiser plus de 1200 CHF par an. Un service client irréprochable.",
        rating: 5,
      },
      {
        name: "Julien M.",
        role: "Fondateur de startup, Lausanne",
        content:
          "En tant qu'entrepreneur, mon temps est précieux. Ils ont tout géré pour mes assurances professionnelles et privées. Simple, rapide, et des économies à la clé. Je recommande à 100%.",
        rating: 5,
      },
      {
        name: "Famille Rossi",
        role: "Nyon, Vaud",
        content:
          "Nous pensions être bien assurés... jusqu'à leur analyse gratuite. Ils ont trouvé de meilleures garanties pour un prix inférieur. Indispensable pour toute famille en Suisse romande !",
        rating: 5,
      },
    ],
  },

  ctaSection: {
    title: "Prêt à payer le juste prix pour vos assurances ?",
    description:
      "Ne laissez plus l'argent sur la table. Demandez votre analyse de portefeuille gratuite. Notre expertise à votre service, sans engagement.",
    buttonText: "Je demande mon analyse gratuite",
  },

  contactSection: {
    tagline: "Contactez un expert",
    title: "Parlons de vos besoins. C'est simple et gratuit.",
    description:
      "Que ce soit pour une simple question ou une analyse complète, notre équipe d'experts basés à Genève est à votre écoute. Réponse rapide garantie.",
    form: {
      firstName: { label: "Prénom", placeholder: "Votre prénom" },
      lastName: { label: "Nom", placeholder: "Votre nom" },
      email: { label: "Email", placeholder: "votre.email@exemple.ch" },
      insuranceType: {
        label: "Sujet de votre demande",
        options: [
          "Analyse Gratuite de Portefeuille",
          "Assurance Maladie (LAMal)",
          "Prévoyance & 3ème Pilier",
          "Hypothèque",
          "Assurances Entreprise",
          "Autre demande",
        ],
      },
      message: {
        label: "Votre message + Numéro de Téléphone",
        placeholder: "Décrivez brièvement votre situation ou votre question...",
      },
      submitButtonText: "Envoyer et recevoir mon analyse",
    },
  },
};

export default homePage;
