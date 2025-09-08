const footer = {
  logo: {
    alt: "Mon Fidele Logo",
    text: "Logo de l'entreprise Mon Fidele en pied de page"
  },
  contact: {
    title: "Contact",
    address: "Chemin de Blandonnet 8",
    city: "1214 Vernier, Suisse",
    email: "contact@monfideleconseiller.ch",
    phone: "+41 79 789 61 93"
  },
  insuranceLinks: {
    title: "Nos assurances",
    links: [
      { label: 'Assurance maladie', path: '/assurances/particulier/assurance-maladie' },
      { label: 'Assurance automobile', path: '/assurances/particulier/assurance-automobile' },
      { label: 'Responsabilité civile', path: '/assurances/particulier/rc-privee' },
      { label: 'Protection juridique', path: '/assurances/particulier/protection-juridique' },
      { label: 'Assurance ménage', path: '/assurances/particulier/assurance-menage' },
      { label: 'Troisième pilier', path: '/assurances/particulier/3eme-pilier' }
    ]
  },
  usefulLinks: {
    title: "Liens utiles",
    links: [
      { label: 'Comparatif LAMal', path: 'https://www.priminfo.admin.ch/fr/praemien', isExternal: true },
      { label: 'Comparateur voiture', path: '/comparateur/assurance-automobile' },
      { label: 'Rabais collectif', path: '/rabais-collectif' },
      { label: 'Contacter un conseiller', path: '+41797896193', isPhone: true }
    ]
  },
  copyright: "© {year} Mon Fidele Conseiller. Tous droits réservés. | Agrément en tant qu'intermédiaire d'assurance non liés. FINMA : F01487128 | Cicero : 32283",
  creatorCredit: "Site créé par Mon Fidele Conseiller"
};

export default footer;