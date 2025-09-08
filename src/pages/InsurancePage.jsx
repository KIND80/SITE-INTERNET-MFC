import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import siteConfig from '@/config/siteConfig';
import { openMailto, CONTACT_EMAIL } from '@/lib/mailto';

const generateFallbackData = (title) => ({
  title: title,
  hero: {
    subtitle: `La protection optimale pour votre ${title.toLowerCase()}, négociée au meilleur prix.`,
    description: `Nos experts analysent pour vous des dizaines d'offres afin de construire le contrat d'${title.toLowerCase()} parfaitement adapté à vos besoins spécifiques et à votre budget.`,
    ctaText: 'Demander une offre sur-mesure',
    image: { alt: `Illustration experte pour ${title}` }
  },
  comparator: {
    title: `Comparez en 2 minutes les offres pour ${title}`,
    description:
      "Notre outil exclusif vous donne une vision claire du marché. Identifiez les meilleures primes et garanties instantanément. C'est 100% gratuit, neutre et sans engagement.",
    points: ['Comparatif 100% indépendant', "Jusqu'à 40% d'économies", 'Conseils de nos experts inclus'],
    ctaText: 'Lancer le comparatif',
    image: { alt: "Analyse comparative d'offres d'assurance sur un écran" }
  },
  complements: {
    title: 'Garanties & Options Clés',
    description: `Affinez votre protection avec les couvertures essentielles pour l'${title.toLowerCase()}.`,
    items: [
      { label: 'Protection Juridique', icon: 'Shield' },
      { label: 'Assistance Monde', icon: 'Globe' },
      { label: 'Couverture Premium', icon: 'Star' },
      { label: 'Franchise Zéro', icon: 'ThumbsUp' }
    ]
  }
});

const InsurancePage = () => {
  const { category, slug } = useParams();
  const { insurancePages } = siteConfig;
  const pageInfo = insurancePages.pages[category]?.[slug];
  const title = pageInfo?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  const data = pageInfo || generateFallbackData(title);

  if (!data) {
    return (
      <div className="text-center py-40">
        <h1 className="text-3xl font-bold">Page non trouvée</h1>
        <p className="mt-4">Cette page d'assurance n'existe pas.</p>
        <Button asChild className="mt-8">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="bg-white">
        {/* Hero */}
        <section className="py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
                <img
                  className="rounded-2xl shadow-xl w-full h-auto object-cover"
                  alt={data.hero.image.alt}
                  src="https://horizons-cdn.hostinger.com/ef8bc239-7c6e-4d4c-8761-3b9aebb7bc3e/assurance-genevoise-geneve-assurance-TU5b7.webp"
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900">{data.title}</h1>
                <p className="mt-4 text-lg font-semibold text-orange-600">{data.hero.subtitle}</p>
                <p className="mt-4 text-lg text-gray-600 leading-relaxed">{data.hero.description}</p>

                {/* Demander une offre sur-mesure → email */}
                <Button
                  size="lg"
                  onClick={() => openMailto(CONTACT_EMAIL, `Demande d'offre sur-mesure pour : ${data.title}`)}
                  className="mt-8 btn-primary rounded-full font-semibold px-8 py-6 text-base w-full sm:w-auto"
                >
                  {data.hero.ctaText} <ArrowRight className="ml-2 h-5 w-5 inline" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Comparator */}
        <section id="contact-form" className="py-20 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{data.comparator.title}</h2>
                  <p className="text-gray-600 mb-6">{data.comparator.description}</p>
                  <ul className="space-y-3 mb-8">
                    {data.comparator.points.map((point, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action actuelle : scroll (garde ton parcours). 
                      Si tu veux aussi envoyer un email, remplace l'onClick par openMailto(CONTACT_EMAIL, ...) */}
                  <Button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    size="lg"
                    className="w-full btn-primary rounded-full font-semibold py-6 text-base"
                  >
                    {data.comparator.ctaText} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <img
                  className="rounded-2xl shadow-xl w-full h-auto object-cover"
                  alt={data.comparator.image.alt}
                  src="https://horizons-cdn.hostinger.com/ef8bc239-7c6e-4d4c-8761-3b9aebb7bc3e/34c65f3c-3676-4f02-9d17-30f48c9f9648-u42gt.jpeg"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Complements */}
        <section className="py-20 lg:py-24 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white">{data.complements.title}</h2>
            <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">{data.complements.description}</p>
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {data.complements.items.map((item, i) => {
                const Icon = Icons[item.icon] || Icons.Shield;
                return (
                  <motion.div
                    key={i}
                    className="flex flex-col items-center space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-8 w-8 text-orange-400" />
                    </div>
                    <span className="text-white font-medium text-sm">{item.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default InsurancePage;