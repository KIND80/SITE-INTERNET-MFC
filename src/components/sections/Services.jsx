import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import siteConfig from '@/config/siteConfig';

const Services = ({ showToast }) => {
  const { servicesSection } = siteConfig.homePage;

  return (
    <section id="services" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <span className="text-orange-600 font-semibold">{servicesSection.tagline}</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">{servicesSection.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {servicesSection.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesSection.services.map((service, index) => {
            const Icon = Icons[service.icon] || Icons.ShieldCheck;
            return (
              <motion.div
                key={index}
                className="card-hover bg-white rounded-2xl p-8 shadow-lg border border-gray-100 flex flex-col group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="flex-grow">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                </div>
                <button 
                  onClick={showToast}
                  className="flex items-center text-orange-600 font-semibold group-hover:text-orange-500 transition-colors"
                >
                  {service.linkText} <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;