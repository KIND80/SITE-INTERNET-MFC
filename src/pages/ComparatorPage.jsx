import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import de notre moteur de calcul local
import { calculateTop3 } from '@/lib/scoringEngine';

// Vos composants UI
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import PageTransition from '@/components/layout/PageTransition';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog.jsx';

// Définition des icônes pour une utilisation simple
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.623L17.25 21.75l-.352-1.127a3.375 3.375 0 00-2.456-2.456L13.5 18l1.127-.352a3.375 3.375 0 002.456-2.456L17.25 14.25l.352 1.127a3.375 3.375 0 002.456 2.456L21 18.375l-1.127.352a3.375 3.375 0 00-2.456 2.456z" /></svg>;

// Configuration du questionnaire pour un affichage propre
const questions = [
  { id: 'optique', label: 'Lunettes ou lentilles' },
  { id: 'med_alt', label: 'Médecines alternatives' },
  { id: 'fitness', label: 'Fitness / Sport' },
  { id: 'voyage', label: 'Voyages à l’étranger' },
  { id: 'hosp_semi', label: 'Hospitalisation semi-privé' },
  { id: 'hosp_privee', label: 'Hospitalisation privé' },
  { id: 'meds_hors_base', label: 'Médicaments hors base' },
  { id: 'maternite', label: 'Couverture maternité' },
  { id: 'prevention', label: 'Prévention (vaccins, check-up)' },
];

const ComparatorPage = () => {
  const [choices, setChoices] = useState({});
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
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
        toast({ title: "Comparaison réussie !", description: "Voici les 3 offres les plus adaptées." });
      } else {
        toast({ variant: "default", title: "Aucun résultat spécifique", description: "Essayez de sélectionner d'autres critères." });
      }
    } catch (error) {
      console.error("Erreur lors du calcul :", error);
      toast({ variant: "destructive", title: "Erreur", description: "Impossible d'effectuer la comparaison." });
    } finally {
      setTimeout(() => setIsLoading(false), 400);
    }
  };
  
  const handleReset = () => {
    const initialChoices = questions.reduce((acc, q) => ({ ...acc, [q.id]: false }), {});
    setChoices(initialChoices);
    setResults([]);
  };

  const getDialogDetails = () => {
    if (!selectedInsurance) return { matched: [], others: [] };
    const matched = selectedInsurance.prestations.filter(p => choices[p.critere]);
    const others = selectedInsurance.prestations.filter(p => !choices[p.critere] && p.score >= 2);
    return { matched, others };
  };

  const dialogDetails = getDialogDetails();

  // Réorganise les résultats pour que le TOP 1 soit toujours au milieu sur grand écran
  const orderedResults = results.length === 3 ? [results[1], results[0], results[2]] : results;

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-80px)] bg-background text-foreground">
        <div className="container py-12 md:py-20">
          
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-black text-primary uppercase">Votre Assurance Sur-Mesure</h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Cochez vos besoins et laissez notre algorithme trouver les 3 assurances complémentaires qui vous correspondent vraiment.
            </p>
          </motion.div>
          
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 }}}} initial="hidden" animate="show">
            {questions.map((q) => (
              <motion.div key={q.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                <label className={`flex items-center justify-between w-full p-5 rounded-lg border-2 cursor-pointer transition-all duration-300 ${choices[q.id] ? 'bg-primary/10 border-primary shadow-lg' : 'bg-card border-border hover:border-primary/50'}`}>
                  <span className="font-semibold">{q.label}</span>
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${choices[q.id] ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{choices[q.id] && <CheckIcon />}</div>
                  <input type="checkbox" checked={!!choices[q.id]} onChange={() => handleChoiceChange(q.id)} className="sr-only"/>
                </label>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleSubmit} disabled={isLoading} className="font-bold px-10 py-7 text-lg">
              {isLoading ? 'Analyse en cours...' : (<div className='flex items-center'><SparklesIcon /> Trouver mon Top 3</div>)}
            </Button>
            {results.length > 0 && !isLoading && (
                <Button size="lg" variant="outline" onClick={handleReset} className="font-bold px-10 py-7 text-lg">Recommencer</Button>
            )}
          </div>
          
          <div className="mt-20">
            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div key="loader" className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-muted-foreground font-semibold">Nous analysons des centaines d'options pour vous...</p>
                </motion.div>
              )}

              {!isLoading && results.length > 0 && (
                <motion.div
                  key="results"
                  className="flex flex-col lg:flex-row items-center justify-center gap-8"
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 }}}}
                >
                  {orderedResults.map((res, index) => {
                    const isTop1 = (results.length === 3 && index === 1) || (results.length < 3 && index === 0);
                    const rank = isTop1 ? 1 : (index === 0 ? 2 : 3);
                    
                    const cardColors = {
                      1: { bg: 'bg-card-top3-silver', text: 'text-card-top3-silver', border: 'border-t-card-top3-silver', bottom: 'border-b-card-top3-silver' },
                      2: { bg: 'bg-card-top3-gold', text: 'text-card-top3-gold', border: 'border-t-card-top3-gold', bottom: 'border-b-card-top3-gold' },
                      3: { bg: 'bg-card-top3-bronze', text: 'text-card-top3-bronze', border: 'border-t-card-top3-bronze', bottom: 'border-b-card-top3-bronze' }
                    };
                    const colors = cardColors[rank] || cardColors[3];

                    return (
                      <motion.div
                        key={`${res.caisse}-${res.produit}`}
                        variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 }}}}
                        className={`bg-card rounded-2xl shadow-lg w-full max-w-sm h-[450px] relative overflow-hidden flex flex-col p-8 transition-all duration-300 ${isTop1 ? 'lg:-translate-y-5 lg:scale-110 lg:shadow-2xl z-10 lg:h-[490px]' : 'lg:h-[450px]'}`}
                      >
                        <div className={`corner-triangle absolute top-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-t-[60px] ${colors.border}`}></div>
                        <div className={`corner-bottom absolute bottom-0 left-0 w-0 h-0 border-r-[60px] border-r-transparent border-b-[60px] ${colors.bottom}`}></div>
                        
                        <h2 className={`text-3xl font-bold text-center mb-6 ${colors.text}`}>{`TOP ${rank}`}</h2>
                        
                        <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center mx-auto mb-6 text-white ${colors.bg}`}>
                          <span className="text-4xl font-black">{res.totalScore}</span>
                          <span className="text-xs font-bold uppercase">Points</span>
                        </div>

                        <div className="flex-grow text-center mb-6">
                            <h3 className="text-xl font-bold text-foreground">{res.caisse}</h3>
                            <p className="text-md text-muted-foreground">{res.produit}</p>
                        </div>
                        
                        <Button className={`w-full font-bold uppercase tracking-wider ${colors.bg} hover:${colors.bg}/90`} onClick={() => setSelectedInsurance(res)}>
                            Voir les détails
                        </Button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Dialog open={!!selectedInsurance} onOpenChange={() => setSelectedInsurance(null)}>
            <DialogContent className="sm:max-w-md bg-card">
              {selectedInsurance && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-primary text-2xl">{selectedInsurance.caisse} - {selectedInsurance.produit}</DialogTitle>
                    <DialogDescription>
                      Aperçu des prestations de ce produit.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-3">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-3">Correspond à vos besoins</h4>
                      <div className="space-y-4">
                        {dialogDetails.matched.map(p => (
                          <div key={p.critere}>
                            <div className="flex justify-between items-center">
                              <p className="font-semibold text-foreground">
                                {questions.find(q => q.id === p.critere)?.label || p.critere}
                              </p>
                              <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.score >= 3 ? 'bg-green-500/20 text-green-500' : p.score >= 2 ? 'bg-blue-500/20 text-blue-500' : 'bg-amber-500/20 text-amber-500'}`}>
                                Score {p.score}/3
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {dialogDetails.others.length > 0 && (
                      <div className="pt-6 border-t border-border">
                        <h4 className="text-lg font-semibold text-foreground mb-3">Autres avantages inclus</h4>
                        <div className="space-y-4">
                          {dialogDetails.others.map(p => (
                            <div key={p.critere}>
                              <div className="flex justify-between items-center">
                                <p className="font-semibold text-foreground">
                                  {questions.find(q => q.id === p.critere)?.label || p.critere}
                                </p>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.score >= 3 ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                  Score {p.score}/3
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </PageTransition>
  );
};

export default ComparatorPage;