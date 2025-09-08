import React from 'react';
import { motion } from 'framer-motion';
import siteConfig from '@/config/siteConfig';

const CompanyPartners = () => {
    const { companyPartnersSection } = siteConfig.homePage;

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-gray-900">{companyPartnersSection.title}</h2>
                    <p className="text-lg text-gray-600 mt-4">{companyPartnersSection.subtitle}</p>
                </motion.div>
                <motion.div
                    className="flex justify-center items-center gap-12 md:gap-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    {companyPartnersSection.logos.map((logo, index) => (
                        <a href="#" key={index} className="hover:opacity-80 transition-opacity">
                            <img  src={logo.src} alt={logo.alt} className="h-12 md:h-16" src="https://images.unsplash.com/photo-1485531865381-286666aa80a9" />
                        </a>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default CompanyPartners;