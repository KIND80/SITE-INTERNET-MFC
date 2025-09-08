import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import siteConfig from '@/config/siteConfig';

const CtaSection = ({ scrollToSection }) => {
  const { ctaSection } = siteConfig.homePage;

  return (
    <section className="py-24 bg-secondary text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-4xl font-bold mb-4">
              {ctaSection.title}
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {ctaSection.description}
            </p>
          </div>

          <Button 
            onClick={() => scrollToSection('contact')}
            size="lg"
            className="btn-primary px-10 py-7 rounded-full font-bold shadow-lg text-lg"
          >
            {ctaSection.buttonText} <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;