import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle, Users, Target } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import siteConfig from '@/config/siteConfig';
const AboutPage = () => {
  const {
    aboutPage
  } = siteConfig;
  return <PageTransition>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative hero-gradient pt-24 pb-16 text-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }}>
                    {aboutPage.hero.title}
                </motion.h1>
                <motion.p className="mt-6 text-xl text-gray-700 leading-relaxed" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2,
            duration: 0.6
          }} dangerouslySetInnerHTML={{
            __html: aboutPage.hero.subtitle
          }}>
                </motion.p>
            </div>
        </div>

        {/* Notre mission */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-orange-600 font-semibold">{aboutPage.mission.tagline}</span>
                <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">{aboutPage.mission.title}</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  {aboutPage.mission.description}
                </p>
                <div className="flex items-start space-x-4">
                  <Target className="h-10 w-10 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{aboutPage.mission.highlight.title}</h3>
                    <p className="text-gray-600">{aboutPage.mission.highlight.description}</p>
                  </div>
                </div>
              </div>
              <motion.div initial={{
              opacity: 0,
              scale: 0.9
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} viewport={{
              once: true
            }}>
                <img class="rounded-2xl shadow-xl w-full h-auto" alt={aboutPage.mission.image.alt} src="https://horizons-cdn.hostinger.com/ef8bc239-7c6e-4d4c-8761-3b9aebb7bc3e/1743171398875-g7Is1.jpeg" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Nos valeurs */}
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-bold text-gray-900">{aboutPage.values.title}</h2>
                <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">{aboutPage.values.subtitle}</p>
                <div className="mt-16 grid md:grid-cols-3 gap-12">
                    {aboutPage.values.points.map((point, index) => {
              const icons = {
                Proximity: Users,
                Expertise: Award,
                Independence: CheckCircle
              };
              const Icon = icons[point.icon];
              const colors = {
                Proximity: 'bg-blue-100 text-blue-600',
                Expertise: 'bg-green-100 text-green-600',
                Independence: 'bg-orange-100 text-orange-600'
              };
              const colorClass = colors[point.icon];
              return <div key={index} className="flex flex-col items-center">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${colorClass}`}>
                                <Icon className="h-10 w-10" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">{point.title}</h3>
                            <p className="text-gray-600">{point.description}</p>
                        </div>;
            })}
                </div>
            </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-24 bg-secondary text-white text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold mb-4">{aboutPage.cta.title}</h2>
                <p className="text-xl text-blue-100 mb-8">{aboutPage.cta.description}</p>
                <Button asChild size="lg" className="btn-primary px-10 py-7 rounded-full font-bold shadow-lg text-lg">
                    <Link to="/">{aboutPage.cta.buttonText}</Link>
                </Button>
            </div>
        </section>

      </div>
    </PageTransition>;
};
export default AboutPage;