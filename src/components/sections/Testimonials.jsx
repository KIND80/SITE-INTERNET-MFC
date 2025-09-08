import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import siteConfig from '@/config/siteConfig';

const Testimonials = () => {
  const { testimonialsSection } = siteConfig.homePage;

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <span className="text-orange-600 font-semibold">{testimonialsSection.tagline}</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">{testimonialsSection.title}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {testimonialsSection.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonialsSection.testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-orange-50/50 rounded-2xl p-8 card-hover relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <Quote className="absolute top-6 right-6 h-16 w-16 text-orange-200/50" />
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;