import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import siteConfig from "@/config/siteConfig";
import Services from "@/components/sections/Services";
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

    const id = path.replace(/^#/, "");
    const maybeEl = document.getElementById(id);

    if (maybeEl) {
      const yOffset = -80;
      const y =
        maybeEl.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
      return;
    }

    if (/^https?:\/\//i.test(path)) {
      window.open(path, "_blank", "noopener,noreferrer");
      return;
    }

    if (path.startsWith("/")) {
      navigate(path);
      return;
    }

    if (!path.startsWith("#") && !path.includes(" ")) {
      navigate(`/${path}`);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-80px)] items-center overflow-hidden bg-gray-50">
      {/* Background */}
      <div className="absolute inset-0 h-full w-full">
        <div className="absolute inset-y-0 left-0 w-full bg-red-600 md:w-1/2" />

        <div className="absolute inset-y-0 right-0 hidden w-1/2 md:block">
          <img
            alt={newHero.image.alt}
            className="h-full w-full object-cover"
            src={newHero.image.src}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-600/85 to-red-600/20 md:to-transparent" />
      </div>

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full md:max-w-3xl lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-white"
          >
            <h1 className="text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
              {newHero.title}
            </h1>

            <p className="max-w-2xl text-lg text-red-100 sm:text-xl">
              {newHero.subtitle}
            </p>

            {/* CTA */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <motion.div
                className="relative w-full sm:w-auto"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => handleCTAClick(newHero.secondaryCta.path)}
                  size="lg"
                  className="min-h-[60px] w-full rounded-2xl bg-white px-8 py-6 text-base font-bold text-red-600 shadow-xl transition hover:bg-gray-100 sm:w-auto sm:text-lg"
                >
                  {newHero.secondaryCta.text}
                </Button>
              </motion.div>
            </div>

            {/* 🔥 Preuve sociale */}
            <div className="flex flex-col gap-2 text-sm text-white/90 sm:flex-row sm:items-center sm:gap-4">
              <div className="font-semibold">
                +1200 CHF économisés en moyenne
              </div>

              <div className="flex items-center gap-1">
                ⭐⭐⭐⭐⭐
                <span className="ml-2 text-white/80 text-xs">
                  +100 clients satisfaits
                </span>
              </div>
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
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                  {siteConfig.homePage.intro.title}
                </h2>

                <p className="text-lg text-gray-600">
                  {siteConfig.homePage.intro.description}
                </p>

                <Button asChild size="lg" className="btn-primary mt-8">
                  <Link to="/a-propos">En savoir plus sur nous</Link>
                </Button>
              </div>

              <div>
                <img
                  alt={siteConfig.homePage.intro.image.alt}
                  className="rounded-lg shadow-xl"
                  src={siteConfig.homePage.intro.image.src}
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
