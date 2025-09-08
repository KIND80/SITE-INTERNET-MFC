const nav = {
  navItems: [
    { label: 'Accueil', path: '/' },
    { 
      label: 'Assurances',
      isMegaMenu: true,
      dropdown: [
        {
          title: 'PARTICULIERS',
          links: [
            { label: 'Assurance maladie', path: '/assurances/particulier/assurance-maladie' }, 
            { label: 'Assurance automobile', path: '/assurances/particulier/assurance-automobile' }, 
            { label: 'RC privée', path: '/assurances/particulier/rc-privee' },
            { label: 'Protection juridique', path: '/assurances/particulier/protection-juridique' }, 
            { label: 'Assurance ménage', path: '/assurances/particulier/assurance-menage' }, 
            { label: '3ème pilier', path: '/assurances/particulier/3eme-pilier' }
          ]
        },
        {
          title: 'ENTREPRISES',
          links: [
            { label: 'RC professionnelle', path: '/assurances/entreprise/rc-professionnelle' }, 
            { label: 'Véhicules professionnel', path: '/assurances/entreprise/vehicules-professionnel' }, 
            { label: 'Protection juridique', path: '/assurances/entreprise/protection-juridique' },
            { label: 'Assurance de choses', path: '/assurances/entreprise/assurance-choses' }, 
            { label: 'Assurance de personnes', path: '/assurances/entreprise/assurance-personnes' }, 
            { label: '2ème pilier', path: '/assurances/entreprise/2eme-pilier' }
          ]
        },
        {
          title: 'HABITAT & PROPRIÉTÉ',
          links: [
            { label: 'Assurance bâtiment', path: '/assurances/habitat/assurance-batiment' }, 
            { label: 'Garantie de loyer', path: '/assurances/habitat/garantie-loyer' }, 
            { label: 'Crédit hypothécaire', path: '/assurances/habitat/credit-hypothecaire' }
          ]
        },
        {
          title: 'LIENS UTILES',
          links: [
            { label: 'Nos Partenaires', path: '/partenaires' }, 
            { label: 'Rabais collectif', path: '/rabais-collectif' }
          ]
        }
      ]
    },
    { 
      label: 'Comparateurs', 
      dropdown: [
        { label: 'Assurance maladie', path: 'https://www.priminfo.admin.ch/fr/praemien', isExternal: true },
        { label: 'Intelligence artificielle', path: 'https://assur-bot-ia-v1.vercel.app/', isExternal: true }
      ]
    },
    { 
      label: 'À propos',
      dropdown: [
        { label: 'Qui sommes-nous ?', path: '/a-propos' },
        { label: 'Engagement local', path: '/engagement' }
      ]
    },
  ],
};

export default nav;