import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';
import siteConfig from '@/config/siteConfig';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';
import WhatsAppButton from '@/components/layout/WhatsAppButton';

import Home from '@/pages/Home';
import AboutPage from '@/pages/AboutPage';
import PartnersPage from '@/pages/PartnersPage';
import ComparatorPage from '@/pages/ComparatorPage';
import InsurancePage from '@/pages/InsurancePage';
import EngagementPage from '@/pages/EngagementPage';
import CollectiveDiscountPage from '@/pages/CollectiveDiscountPage';

const ThemeInjector = () => {
  const { themeColors } = siteConfig.theme;
  const cssVariables = Object.entries(themeColors)
    .map(([key, value]) => `--${key}: ${value};`)
    .join('\n');

  return (
    <Helmet>
      <style>{`:root { ${cssVariables} }`}</style>
    </Helmet>
  );
};

const PageLayout = () => {
  const location = useLocation();
  const { toast } = useToast();

  const showToast = (options) => {
    toast({
      title: options?.title || "🚧 Cette fonctionnalité n'est pas encore implémentée",
      description: options?.description || "Mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀",
      variant: options?.variant || 'default',
      duration: 4000,
    });
  };
  
  return (
    <>
      <Helmet>
        <title>{siteConfig.meta.title}</title>
        <meta name="description" content={siteConfig.meta.description} />
        <meta name="keywords" content={siteConfig.meta.keywords} />
        <meta property="og:title" content={siteConfig.meta.ogTitle} />
        <meta property="og:description" content={siteConfig.meta.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_CH" />
      </Helmet>
      
      <div className="min-h-screen bg-white text-gray-800 flex flex-col">
        <Header showToast={showToast} />
        <main className="flex-grow pt-20">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home showToast={showToast} />} />
              <Route path="/a-propos" element={<AboutPage />} />
              <Route path="/engagement" element={<EngagementPage />} />
              <Route path="/partenaires" element={<PartnersPage />} />
              <Route path="/rabais-collectif" element={<CollectiveDiscountPage />} />
              <Route path="/comparateur/:type" element={<ComparatorPage showToast={showToast} />} />
              <Route path="/assurances/:category/:slug" element={<InsurancePage showToast={showToast} />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer showToast={showToast} />
        {siteConfig.whatsapp.enabled && <WhatsAppButton />}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <ThemeInjector />
      <ScrollToTop />
      <PageLayout />
      <Toaster />
    </Router>
  );
}

export default App;