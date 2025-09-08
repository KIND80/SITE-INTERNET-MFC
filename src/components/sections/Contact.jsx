import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import siteConfig from '@/config/siteConfig';
import { supabase } from '@/lib/customSupabaseClient';

const Contact = ({ showToast }) => {
  const { contactSection } = siteConfig.homePage;
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('send-contact-email', {
        body: JSON.stringify(data),
      });

      if (edgeError) {
        throw edgeError;
      }
      
      showToast({
        title: "Message envoyé !",
        description: "Merci, nous avons bien reçu votre message et vous répondrons rapidement.",
        variant: "default",
      });
      reset();

    } catch (error) {
      console.error("Error sending email:", error);
      showToast({
        title: "Erreur d'envoi",
        description: "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer ou nous contacter directement.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-white bg-dots">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <span className="text-orange-600 font-semibold">{contactSection.tagline}</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">{contactSection.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {contactSection.description}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 lg:p-12 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">{contactSection.form.firstName.label}</Label>
                <Input 
                  id="firstName"
                  type="text" 
                  className="w-full"
                  placeholder={contactSection.form.firstName.placeholder}
                  {...register("firstName", { required: "Le prénom est requis" })}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">{contactSection.form.lastName.label}</Label>
                <Input
                  id="lastName"
                  type="text" 
                  className="w-full"
                  placeholder={contactSection.form.lastName.placeholder}
                  {...register("lastName", { required: "Le nom est requis" })}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">{contactSection.form.email.label}</Label>
              <Input
                id="email"
                type="email" 
                className="w-full"
                placeholder={contactSection.form.email.placeholder}
                {...register("email", { required: "L'email est requis", pattern: { value: /^\S+@\S+$/i, message: "Adresse email invalide" } })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="insuranceType" className="block text-sm font-medium text-gray-700 mb-2">{contactSection.form.insuranceType.label}</Label>
              <select 
                id="insuranceType"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                {...register("insuranceType")}
                >
                {contactSection.form.insuranceType.options.map(option => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">{contactSection.form.message.label}</Label>
              <textarea 
                id="message"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder={contactSection.form.message.placeholder}
                {...register("message")}
              ></textarea>
            </div>
            <Button 
              type="submit"
              className="w-full btn-primary py-4 rounded-lg font-semibold shadow-lg text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                contactSection.form.submitButtonText
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;