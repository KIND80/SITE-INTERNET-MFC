import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import siteConfig from "@/config/siteConfig";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Testimonials from "@/components/sections/Testimonials";
import CtaSection from "@/components/sections/CtaSection";
import Contact from "@/components/sections/Contact";
import Partners from "@/components/sections/Partners";
import PageTransition from "@/components/layout/PageTransition";

const NewHero = () => {
  const navigate = useNavigate();
  const { newHero } = siteConfig.homePage;

  const handleCTAClick = (path) => {
    if (!path) return;

    // 0) Tenter d'abord un scroll vers un ID (ex: "contact" ou "#contact")
    const id = path.replace(/^#/, "");
    const maybeEl = document.getElementById(id);
    if (maybeEl) {
      const yOffset = -80;
      const y =
        maybeEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      return;
    }

    // 1) Liens externes
    if (/^https?:\/\//i.test(path)) {
      window.open(path, "_blank", "noopener,noreferrer");
      return;
    }

    // 2) Routes internes (avec ou sans /)
    if (path.startsWith("/")) {
      navigate(path);
      return;
    }
    if (!path.startsWith("#") && !path.includes(" ")) {
      // ex: "contact" → "/contact"
      navigate(`/${path}`);
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center bg-gray-50 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-red-600"></div>
        <div className="absolute inset-y-0 right-0 w-1/2">
          <img
            alt={newHero.image.alt}
            className="w-full h-full object-cover"
            src="https://horizons-cdn.hostinger.com/ef8bc239-7c6e-4d4c-8761-3b9aebb7bc3e/csm_xavier-von-erlach-yesqzahdkqs-unsplash_4403f9baec-5OFmy.jpg"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-600/80 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              {newHero.title}
            </h1>
            <p className="text-xl text-red-100">{newHero.subtitle}</p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* CTA principal */}
              <Button
                onClick={() => handleCTAClick(newHero.primaryCta.path)}
                size="lg"
                className="bg-white text-red-600 hover:bg-gray-200 font-bold px-8 py-6 text-lg"
              >
                {newHero.primaryCta.text}
              </Button>

              {/* CTA secondaire - animé, blanc translucide avec halo pulse */}
              <motion.div
                className="relative overflow-visible"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                {/* Halo 1 */}
                <motion.span
                  className="absolute inset-0 rounded-lg bg-white/30"
                  style={{ filter: "blur(2px)" }}
                  animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                {/* Halo 2 (décalé) */}
                <motion.span
                  className="absolute inset-0 rounded-lg bg-white/20"
                  style={{ filter: "blur(3px)" }}
                  animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.6,
                  }}
                />

                <Button
                  onClick={() => handleCTAClick(newHero.secondaryCta.path)}
                  size="lg"
                  variant="outline"
                  className="relative z-10 bg-white/20 text-white border border-white/60 backdrop-blur-sm hover:bg-white/30 hover:border-white font-bold px-8 py-6 text-lg transition-shadow shadow-lg"
                >
                  {newHero.secondaryCta.text}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Home = ({ showToast }) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <PageTransition>
      <NewHero />
      <div id="main-content" className="bg-white">
        <div className="section-padding bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {siteConfig.homePage.intro.title}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {siteConfig.homePage.intro.description}
                </p>
                <Button asChild size="lg" className="mt-8 btn-primary">
                  <Link to="/a-propos">En savoir plus sur nous</Link>
                </Button>
              </div>
              <div>
                <img
                  alt={siteConfig.homePage.intro.image.alt}
                  className="rounded-lg shadow-xl"
                  src="https://horizons-cdn.hostinger.com/ef8bc239-7c6e-4d4c-8761-3b9aebb7bc3e/4b89dd3f-128d-4d68-844d-7be9da01720d-scaled-5mT5E.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        <Services showToast={showToast} />
        <Partners />
        <Testimonials />
        <CtaSection scrollToSection={scrollToSection} />
        <div id="contact">
          <Contact showToast={showToast} />
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;
