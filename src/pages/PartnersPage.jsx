import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import siteConfig from '@/config/siteConfig';

const PartnersPage = () => {
  const { partnersPage } = siteConfig;

  return (
    <PageTransition>
      <div className="bg-white">
        <div className="relative hero-gradient pt-24 pb-16 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h1 
              className="text-5xl lg:text-6xl font-extrabold text-gray-900"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            >
              {partnersPage.hero.title}
            </motion.h1>
            <motion.p 
              className="mt-6 text-xl text-gray-700 leading-relaxed"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            >
              {partnersPage.hero.subtitle}
            </motion.p>
          </div>
        </div>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800">{partnersPage.main.title}</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                {partnersPage.main.description}
              </p>
            </div>
            
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-16 items-center"
              variants={{
                show: { transition: { staggerChildren: 0.05 } }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {partnersPage.allPartnerLogos.map((partner) => (
                <motion.div
                  key={partner.name}
                  className="flex items-center justify-center h-20"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <img  
                    src={partner.src}
                    className="max-h-12 w-auto max-w-full object-contain grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:scale-110"
                    alt={`Logo de ${partner.name}`} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default PartnersPage;