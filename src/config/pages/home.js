import lacLeman from "../../assets/images/lac-leman.jpg";

const homePage = {
  newHero: {
    title: "Votre Assurance, Simplifiée & Optimisée.",
    subtitle:
      "Conseils experts à Genève et Vaud pour des économies maximales. Comparez, optimisez et payez enfin le juste prix.",
    secondaryCta: {
      text: "Comparer mon assurance",
      path: "comparateur/assurance-maladie",
    },
    image: {
      src: lacLeman,
      alt: "Vue sur le lac Léman et Genève",
      text: "Vue panoramique sur Genève et le lac Léman",
    },
  },

  intro: {
    title: "L'expertise d'un courtier local, la force d'un réseau national.",
    description:
      "Basés à Genève, nous vous accompagnons pour simplifier et optimiser toutes vos assurances. Indépendants, nous travaillons uniquement dans votre intérêt pour vous garantir les meilleures couvertures au meilleur prix.",
    image: {
      src: "conseiller-geneve.jpg",
      alt: "Conseiller en assurance à Genève",
      text: "Un conseiller en assurance dans un bureau moderne à Genève",
    },
  },

  servicesSection: {
    tagline: "Nos Domaines d'Expertise",
    title: "Une solution sur-mesure pour chaque besoin",
    description:
      "Particuliers, familles ou entreprises : nous couvrons tous vos besoins en assurance et prévoyance.",
    services: [
      {
        icon: "HeartHandshake",
        title: "Assurance Maladie (LAMal)",
        description:
          "Comparez toutes les caisses et réduisez vos primes sans compromis.",
        linkText: "Assurance maladie",
        path: "assurances/particulier/assurance-maladie",
      },
      {
        icon: "Users",
        title: "Prévoyance & 3ème Pilier",
        description:
          "Optimisez votre fiscalité et préparez votre avenir efficacement.",
        linkText: "Préparer ma retraite",
        path: "assurances/particulier/3eme-pilier",
      },
      {
        icon: "Building",
        title: "Assurances Entreprise",
        description:
          "Protégez votre activité et vos collaborateurs avec des solutions adaptées.",
        linkText: "Protéger mon business",
        path: "assurances/entreprise/rc-professionnelle",
      },
      {
        icon: "Home",
        title: "Hypothèque & Habitat",
        description:
          "Accédez à la propriété avec les meilleures conditions du marché.",
        linkText: "Mon projet immobilier",
        path: "assurances/habitat/assurance-batiment",
      },
      {
        icon: "ShieldCheck",
        title: "Protection & Patrimoine",
        description:
          "Sécurisez votre famille et votre patrimoine efficacement.",
        linkText: "Sécuriser ma famille",
        path: "assurances/particulier/assurance-automobile",
      },
      {
        icon: "Car",
        title: "Véhicules & Mobilité",
        description:
          "Assurez vos véhicules au meilleur tarif avec les bonnes garanties.",
        linkText: "Assurer mon véhicule",
        path: "assurances/particulier/assurance-automobile",
      },
    ],
  },

  partnersSection: {
    title: "Notre indépendance, votre avantage",
    description:
      "Nous collaborons avec les principales compagnies d’assurance en Suisse pour vous garantir les meilleures offres.",
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
    title: "Ils nous font confiance",
    description:
      "Nos clients en Suisse romande nous recommandent pour notre efficacité et notre transparence.",
    testimonials: [
      {
        name: "Céline B.",
        role: "Architecte, Genève",
        content: "+1200 CHF économisés par an. Service rapide et efficace.",
        rating: 5,
      },
      {
        name: "Julien M.",
        role: "Entrepreneur, Lausanne",
        content: "Simple, rapide, efficace. Tout a été optimisé sans effort.",
        rating: 5,
      },
      {
        name: "Famille Rossi",
        role: "Nyon",
        content: "De meilleures garanties pour moins cher. Indispensable.",
        rating: 5,
      },
    ],
  },

  ctaSection: {
    title: "Comparez et économisez dès maintenant",
    description:
      "Accédez aux meilleures offres en quelques clics et optimisez vos assurances.",
    buttonText: "Comparer mes assurances",
  },

  contactSection: {
    tagline: "Contactez un expert",
    title: "Une question ? Nous sommes disponibles",
    description: "Notre équipe vous répond rapidement par email ou WhatsApp.",
    form: {
      firstName: { label: "Prénom", placeholder: "Votre prénom" },
      lastName: { label: "Nom", placeholder: "Votre nom" },
      email: { label: "Email", placeholder: "votre.email@exemple.ch" },
      insuranceType: {
        label: "Sujet de votre demande",
        options: [
          "Assurance Maladie (LAMal)",
          "Prévoyance & 3ème Pilier",
          "Hypothèque",
          "Assurances Entreprise",
          "Autre demande",
        ],
      },
      message: {
        label: "Message + Téléphone",
        placeholder:
          "Décrivez votre besoin et laissez votre numéro pour être recontacté rapidement...",
      },
      submitButtonText: "Être contacté rapidement",
    },
  },
};

export default homePage;
