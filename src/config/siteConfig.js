import theme from './theme';
import meta from './meta';
import contact from './contact';
import nav from './nav';
import footer from './footer';
import homePage from './pages/home';
import aboutPage from './pages/about';
import engagementPage from './pages/engagement';
import partnersPage from './pages/partners';
import comparatorPage from './pages/comparator';
import insurancePages from './pages/insurance';
import collectiveDiscountPage from './pages/collectiveDiscount';

const siteConfig = {
  theme,
  meta,
  contactInfo: contact,

  // 🖼️ Logo mis à jour
  logoUrl: "/logo.png", // <-- le fichier que tu as ajouté dans ton dossier public (public/logo.png)

  // 💬 WhatsApp
  whatsapp: {
    enabled: true,
    phone: "+41797896193",
    message: "Bonjour ! J'aimerais obtenir un conseil en assurance.",
    ariaLabel: "Contacter sur WhatsApp"
  },

  // 🧭 Navigation & pied de page
  nav,
  footer,

  // 📚 Pages
  homePage,
  aboutPage,
  engagementPage,
  partnersPage,
  comparatorPage,
  insurancePages,
  collectiveDiscountPage
};

export default siteConfig;
