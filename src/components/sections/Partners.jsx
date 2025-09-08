import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import siteConfig from '@/config/siteConfig';

const Partners = () => {
  const { partnersSection } = siteConfig.homePage;
  const duplicatedLogos = [...partnersSection.logos, ...partnersSection.logos];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-700 mb-4">
              {partnersSection.title}
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
              {partnersSection.description}
            </p>
        </div>
        <div className="relative w-full overflow-hidden group">
          <motion.div
            className="flex"
            animate={{
              x: ['0%', '-100%'],
            }}
            transition={{
              ease: 'linear',
              duration: 40,
              repeat: Infinity,
            }}
          >
            {duplicatedLogos.map((partner, index) => (
              <div key={index} className="flex-shrink-0 mx-8 flex items-center justify-center" style={{ width: '160px' }}>
                <img  
                  src={partner.src}
                  className="h-12 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  alt={`Logo ${partner.name}`} />
              </div>
            ))}
          </motion.div>
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent"></div>
        </div>
        <div className="text-center mt-12">
          <Link to="/partenaires" className="text-orange-600 font-semibold hover:text-orange-800 transition-colors">
            {partnersSection.linkText} &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Partners;