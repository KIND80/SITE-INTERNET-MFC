import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Trophy, Users } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import siteConfig from '@/config/siteConfig';
const EngagementPage = () => {
  const {
    engagementPage
  } = siteConfig;
  return <PageTransition>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative pt-24 pb-16 text-center overflow-hidden">
          <div className="absolute inset-0 hero-gradient opacity-70"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }}>
              {engagementPage.hero.title}
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
          }}>
              {engagementPage.hero.subtitle}
            </motion.p>
          </div>
        </div>

        {/* Main Content */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{
              opacity: 0,
              scale: 0.9
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} viewport={{
              once: true
            }} className="order-last lg:order-first">
                <img class="rounded-2xl shadow-xl w-full h-auto" alt={engagementPage.main.image.alt} src="https://horizons-cdn.hostinger.com/ef8bc239-7c6e-4d4c-8761-3b9aebb7bc3e/img_9383-2-dwxvxwoaomsk6gbz-zyp3A.jpg" />
              </motion.div>
              <div>
                <span className="text-orange-600 font-semibold">{engagementPage.main.tagline}</span>
                <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">{engagementPage.main.title}</h2>
                {engagementPage.main.description.map((p, i) => <p key={i} className="text-lg text-gray-600 leading-relaxed mt-4">
                    {p}
                  </p>)}
              </div>
            </div>
          </div>
        </section>

        {/* Pillars of Engagement */}
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-bold text-gray-900">{engagementPage.pillars.title}</h2>
                <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">{engagementPage.pillars.subtitle}</p>
                <div className="mt-16 grid md:grid-cols-3 gap-12">
                    {engagementPage.pillars.points.map((point, index) => {
              const icons = {
                Sport: Trophy,
                Social: Heart,
                Culture: Users
              };
              const Icon = icons[point.icon];
              const colors = {
                Sport: 'bg-blue-100 text-blue-600',
                Social: 'bg-orange-100 text-orange-600',
                Culture: 'bg-green-100 text-green-600'
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
                <h2 className="text-4xl font-bold mb-4">{engagementPage.cta.title}</h2>
                <p className="text-xl text-blue-100 mb-8">{engagementPage.cta.description}</p>
                <Button asChild size="lg" className="btn-primary px-10 py-7 rounded-full font-bold shadow-lg text-lg">
                    <Link to="/">{engagementPage.cta.buttonText}</Link>
                </Button>
            </div>
        </section>
      </div>
    </PageTransition>;
};
export default EngagementPage;