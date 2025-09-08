import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import siteConfig from '@/config/siteConfig';

const CollectiveDiscountPage = () => {
  const { collectiveDiscountPage, contactInfo } = siteConfig;

  return (
    <PageTransition>
      <div className="bg-white">
        <section className="py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900">{collectiveDiscountPage.title}</h1>
                <p className="mt-4 text-lg font-semibold text-orange-600">{collectiveDiscountPage.subtitle}</p>
                <div className="mt-6 text-lg text-gray-600 leading-relaxed space-y-4">
                  {collectiveDiscountPage.description.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <Button asChild size="lg" className="mt-8 btn-primary">
                  <a href={`mailto:${contactInfo.email}?subject=Demande d'audit gratuit - Rabais Collectif`}>{collectiveDiscountPage.ctaText}</a>
                </Button>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <img  
                    alt={collectiveDiscountPage.image.alt} 
                    className="rounded-2xl shadow-xl w-full h-auto object-cover" src="https://images.unsplash.com/photo-1641803216631-47d43eb4f35e" />
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default CollectiveDiscountPage;