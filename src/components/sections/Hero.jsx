import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import siteConfig from '@/config/siteConfig';
import { openMailto, CONTACT_EMAIL } from '@/lib/mailto';

const Hero = () => {
  const { heroSection } = siteConfig.homePage;

  return (
    <section id="accueil" className="relative pt-32 pb-20 lg:pt-48 lg:pb-28 hero-gradient overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8 text-center lg:text-left"
          >
            <motion.h1
              className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              dangerouslySetInnerHTML={{ __html: heroSection.title }}
            />
            <motion.p
              className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {heroSection.subtitle}
            </motion.p>

            {/* CTA → email */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Button
                size="lg"
                onClick={() => openMailto(CONTACT_EMAIL, 'Obtenir une offre gratuite')}
                className="btn-primary rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 px-8 py-6 text-base w-full sm:w-auto"
              >
                {heroSection.ctaButtonText} <ArrowRight className="ml-2 h-5 w-5 inline" />
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {heroSection.features.map((feature, index) => (
                <span key={index} className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  {feature}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative z-10 p-2 bg-white/50 backdrop-blur-sm rounded-2xl shadow-2xl">
              <img
                className="rounded-xl w-full h-auto object-cover"
                alt={heroSection.image.alt}
                src="https://images.unsplash.com/photo-1649215636705-1084bd6df97a"
              />
            </div>
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-orange-300/50 rounded-full filter blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-blue-300/50 rounded-full filter blur-3xl -z-10 animate-pulse animation-delay-2000"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;