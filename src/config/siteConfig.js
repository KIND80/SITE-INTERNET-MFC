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
  logoUrl: "https://horizons-cdn.hostinger.com/ef8bc239-7c6e-4d4c-8761-3b9aebb7bc3e/440242d1aed8f24e34fdc6e0e7ef03aa.png",
  whatsapp: {
    enabled: true,
    phone: "41797896193",
    message: "Bonjour ! J'aimerais obtenir un conseil en assurance.",
    ariaLabel: "Contacter sur WhatsApp"
  },
  nav,
  footer,
  homePage,
  aboutPage,
  engagementPage,
  partnersPage,
  comparatorPage,
  insurancePages,
  collectiveDiscountPage
};

export default siteConfig;