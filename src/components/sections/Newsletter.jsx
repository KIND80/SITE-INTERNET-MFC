import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Newsletter = ({ showToast }) => {
  return (
    <section className="section-padding bg-blue-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Optimisez vos assurances, pas vos efforts.
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Recevez nos conseils d'experts et les dernières opportunités d'économies directement dans votre boîte mail.
            </p>
          </div>

          <form className="max-w-lg mx-auto" onSubmit={(e) => { e.preventDefault(); showToast(); }}>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-6 py-4 rounded-full border-0 focus:ring-4 focus:ring-blue-300 focus:outline-none text-gray-800"
                required
              />
              <Button 
                type="submit"
                className="btn-accent px-8 py-4 rounded-full font-semibold shadow-lg text-base"
              >
                S'abonner
              </Button>
            </div>
            <p className="text-sm text-blue-300 mt-4">
              Pas de spam, désinscription possible à tout moment.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;