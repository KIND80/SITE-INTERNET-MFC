import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle } from 'lucide-react';
import siteConfig from '@/config/siteConfig';

const About = () => {
  const { aboutSection } = siteConfig.homePage;

  return (
    <section id="a-propos" className="section-padding bg-orange-50/50 bg-dots">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <img  
              class="rounded-2xl shadow-2xl w-full h-auto"
              alt={aboutSection.image.alt} src="https://images.unsplash.com/photo-1667172253883-2f9fcfafab5f" />
            <motion.div 
              className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4">
                <Award className="h-12 w-12 text-orange-500" />
                <div>
                  <div className="font-bold text-gray-900 text-lg">{aboutSection.certification.title}</div>
                  <div className="text-sm text-gray-600">{aboutSection.certification.subtitle}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div>
              <span className="text-orange-600 font-semibold">{aboutSection.tagline}</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">{aboutSection.title}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {aboutSection.description}
              </p>
            </div>

            <div className="space-y-5">
              {aboutSection.points.map((point, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{point.title}</h3>
                    <p className="text-gray-600">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;