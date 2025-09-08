import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import de notre moteur de calcul local
import { calculateTop3 } from '@/lib/scoringEngine';

// Vos composants UI existants
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import PageTransition from '@/components/layout/PageTransition';

// Définition des icônes pour une utilisation simple
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.623L17.25 21.75l-.352-1.127a3.375 3.375 0 00-2.456-2.456L13.5 18l1.127-.352a3.375 3.375 0 002.456-2.456L17.25 14.25l.352 1.127a3.375 3.375 0 002.456 2.456L21 18.375l-1.127.352a3.375 3.375 0 00-2.456 2.456z" /></svg>;

// Configuration du questionnaire
const questions = [
  { id: 'optique', label: 'Portez-vous des lunettes ou lentilles ?' },
  { id: 'med_alt', label: 'Utilisez-vous des médecines alternatives ?' },
  { id: 'fitness', label: 'Allez-vous régulièrement au fitness ?' },
  { id: 'voyage', label: 'Voyagez-vous souvent à l’étranger ?' },
  { id: 'hosp_semi', label: 'Souhaitez-vous une hospitalisation en semi-privé ?' },
  { id: 'hosp_privee', label: 'Souhaitez-vous une hospitalisation en privé ?' },
  { id: 'meds_hors_base', label: 'Les médicaments hors base sont-ils importants ?' },
  { id: 'maternite', label: 'Une bonne couverture maternité est-elle une priorité ?' },
  { id: 'prevention', label: 'La prévention (vaccins, check-up) est-elle importante ?' },
];

const ComparatorPage = () => {
  const [choices, setChoices] = useState({});
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initialChoices = questions.reduce((acc, q) => ({ ...acc, [q.id]: false }), {});
    setChoices(initialChoices);
  }, []);

  const handleChoiceChange = (id) => {
    setChoices(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setResults([]);
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const topResults = calculateTop3(choices);
      setResults(topResults);
      
      if (topResults.length > 0) {
        toast({
          title: "Comparaison réussie !",
          description: "Voici les 3 offres les plus adaptées à vos besoins.",
        });
      } else {
        toast({
            variant: "default",
            title: "Aucun résultat spécifique trouvé",
            description: "Essayez de sélectionner d'autres critères pour affiner votre recherche.",
        });
      }

    } catch (error) {
      console.error("Erreur lors du calcul :", error);
      toast({
        variant: "destructive",
        title: "Oh non ! Une erreur est survenue.",
        description: "Impossible d'effectuer le calcul. Veuillez réessayer.",
      });
    } finally {
      setTimeout(() => setIsLoading(false), 400);
    }
  };
  
  const handleReset = () => {
    const initialChoices = questions.reduce((acc, q) => ({ ...acc, [q.id]: false }), {});
    setChoices(initialChoices);
    setResults([]);
  };

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-80px)] bg-background text-foreground">
        <div className="container py-12 md:py-20">
          
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-primary uppercase">Votre Assurance Sur-Mesure</h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Répondez à quelques questions simples et laissez notre algorithme trouver les 3 assurances complémentaires qui vous correspondent vraiment.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 }}}}
            initial="hidden"
            animate="show"
          >
            {questions.map((q) => (
              <motion.div key={q.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                <label
                  className={`flex items-center justify-between w-full p-5 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    choices[q.id] ? 'bg-primary/10 border-primary shadow-lg' : 'bg-card border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-semibold">{q.label}</span>
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
                    choices[q.id] ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {choices[q.id] && <CheckIcon />}
                  </div>
                  <input
                    type="checkbox"
                    checked={!!choices[q.id]}
                    onChange={() => handleChoiceChange(q.id)}
                    className="sr-only"
                  />
                </label>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleSubmit} disabled={isLoading} className="font-bold px-10 py-7 text-lg">
              {isLoading ? 'Analyse en cours...' : (<div className='flex items-center'><SparklesIcon /> Trouver mon Top 3</div>)}
            </Button>
            {results.length > 0 && !isLoading && (
                <Button size="lg" variant="outline" onClick={handleReset} className="font-bold px-10 py-7 text-lg">
                    Recommencer
                </Button>
            )}
          </div>
          
          <div className="mt-12">
            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div
                  key="loader"
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-muted-foreground font-semibold">Nous analysons des centaines d'options pour vous...</p>
                </motion.div>
              )}

              {!isLoading && results.length > 0 && (
                <motion.div
                  key="results"
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: {
                      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
                    },
                  }}
                >
                  {results.map((res, index) => (
                    <motion.div
                      key={`${res.caisse}-${res.produit}`}
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
                      }}
                      className="bg-card border border-border rounded-xl shadow-lg p-6 flex flex-col relative overflow-hidden"
                    >
                      <div className={`absolute top-0 right-0 px-4 py-1 text-sm font-bold text-white rounded-bl-lg ${
                        index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-slate-500' : 'bg-amber-700'
                      }`}>
                        TOP {index + 1}
                      </div>
                      <h3 className="text-2xl font-bold text-primary">{res.caisse}</h3>
                      <p className="text-lg font-semibold text-muted-foreground mb-4">{res.produit}</p>
                      
                      <div className="text-center my-4">
                        <p className="text-sm text-muted-foreground">Score de pertinence</p>
                        <p className="text-5xl font-black text-foreground">{res.totalScore}</p>
                      </div>

                      <div className="mt-auto">
                          <Button className="w-full font-bold">
                              Voir les détails de l'offre
                          </Button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default ComparatorPage;