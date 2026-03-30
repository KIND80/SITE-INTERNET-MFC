import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from "react-helmet";
import siteConfig from "@/config/siteConfig";
import { supabase } from "@/lib/supabase";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import LeadCapturePopup from "@/components/layout/LeadCapturePopup";

import Home from "@/pages/Home";
import AboutPage from "@/pages/AboutPage";
import PartnersPage from "@/pages/PartnersPage";
import ComparatorPage from "@/pages/ComparatorPage";
import InsurancePage from "@/pages/InsurancePage";
import EngagementPage from "@/pages/EngagementPage";
import CollectiveDiscountPage from "@/pages/CollectiveDiscountPage";
import DeclarationImpots from "@/pages/DeclarationImpots";
import AdminFiscalDashboard from "@/pages/AdminFiscalDashboard";
import AdminFiscalDetail from "@/pages/AdminFiscalDetail";
import AdminComparatorDashboard from "@/pages/AdminComparatorDashboard";
import CabinetLogin from "@/pages/CabinetLogin";

const ThemeInjector = () => {
  const { themeColors } = siteConfig.theme;
  const cssVariables = Object.entries(themeColors)
    .map(([key, value]) => `--${key}: ${value};`)
    .join("\n");

  return (
    <Helmet>
      <style>{`:root { ${cssVariables} }`}</style>
    </Helmet>
  );
};

const ProtectedAdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsAuthenticated(!!session?.user);
      setLoading(false);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
        Chargement...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/cabinet-login" replace />;
  }

  return children;
};

const PageLayout = () => {
  const location = useLocation();
  const { toast } = useToast();

  const showToast = (options = {}) => {
    toast({
      title:
        options?.title ||
        "🚧 Cette fonctionnalité n'est pas encore implémentée",
      description:
        options?.description ||
        "Mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀",
      variant: options?.variant || "default",
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
        <meta
          property="og:description"
          content={siteConfig.meta.ogDescription}
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_CH" />
      </Helmet>

      <div className="flex min-h-screen flex-col bg-white text-gray-800">
        <Header showToast={showToast} />

        <LeadCapturePopup
          delayMs={10000}
          storageKey="mfc_lead_popup_dismissed_v2"
        />

        <main className="flex-grow pt-20">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home showToast={showToast} />} />
              <Route path="/a-propos" element={<AboutPage />} />
              <Route path="/engagement" element={<EngagementPage />} />
              <Route path="/partenaires" element={<PartnersPage />} />
              <Route
                path="/rabais-collectif"
                element={<CollectiveDiscountPage />}
              />
              <Route
                path="/declaration-impots"
                element={<DeclarationImpots />}
              />
              <Route path="/cabinet-login" element={<CabinetLogin />} />

              <Route
                path="/admin/dossiers-fiscaux"
                element={
                  <ProtectedAdminRoute>
                    <AdminFiscalDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/dossiers-fiscaux/:id"
                element={
                  <ProtectedAdminRoute>
                    <AdminFiscalDetail />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/comparateur"
                element={
                  <ProtectedAdminRoute>
                    <AdminComparatorDashboard />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="/comparateur/:type"
                element={<ComparatorPage showToast={showToast} />}
              />
              <Route
                path="/assurances/:category/:slug"
                element={<InsurancePage showToast={showToast} />}
              />
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
