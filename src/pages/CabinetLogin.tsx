import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function CabinetLogin() {
  const navigate = useNavigate();

  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          navigate("/admin/dossiers-fiscaux", { replace: true });
          return;
        }
      } catch (error) {
        console.error("Erreur vérification session :", error);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setErrorMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage("Email ou mot de passe incorrect.");
        setLoading(false);
        return;
      }

      navigate("/admin/dossiers-fiscaux", { replace: true });
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Une erreur est survenue lors de la connexion. Veuillez réessayer."
      );
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-center backdrop-blur-xl">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="mt-4 text-sm text-slate-300">
            Vérification de la session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Espace fiscal conseiller | Mon Fidèle Conseiller</title>
        <meta
          name="description"
          content="Connexion à l'espace fiscal conseiller Mon Fidèle Conseiller."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <section className="relative overflow-hidden bg-slate-950 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-100px] top-[-120px] h-[320px] w-[320px] rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute right-[-120px] top-[8%] h-[360px] w-[360px] rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute bottom-[-120px] left-[8%] h-[260px] w-[260px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%),linear-gradient(to_bottom,rgba(15,23,42,0.92),rgba(2,6,23,1))]" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:34px_34px]" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl">
          <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center xl:gap-12">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="hidden lg:block"
            >
              <div className="max-w-xl">
                <motion.div
                  variants={itemVariants}
                  className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-md"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Portail fiscal privé Mon Fidèle Conseiller
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="text-4xl font-black leading-tight text-white xl:text-5xl"
                >
                  Accédez à votre
                  <span className="block bg-gradient-to-r from-orange-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                    espace fiscal conseiller
                  </span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="mt-5 max-w-lg text-base leading-7 text-slate-300 xl:text-lg"
                >
                  Retrouvez vos dossiers fiscaux, simulations Genève / Vaud,
                  parcours TOU / DRIS, documents clients et opportunités
                  d’optimisation dans une interface claire, rapide et
                  professionnelle.
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="mt-8 grid gap-4 sm:grid-cols-2"
                >
                  <FeatureCard
                    title="Accès sécurisé"
                    text="Connexion privée reliée à Supabase pour protéger l’administration du cabinet."
                  />
                  <FeatureCard
                    title="Pilotage fiscal"
                    text="Suivez les dossiers, montants estimés, potentiels d’optimisation et statuts en un seul endroit."
                  />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="mt-6 grid gap-4 sm:grid-cols-3"
                >
                  <MiniInfoCard label="Cantons" value="GE / VD" />
                  <MiniInfoCard label="Parcours" value="TOU / DRIS" />
                  <MiniInfoCard label="Vue" value="Admin fiscal" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full"
            >
              <div className="relative mx-auto w-full max-w-lg">
                <div className="absolute -inset-1 rounded-[34px] bg-gradient-to-br from-orange-400/30 via-white/10 to-transparent blur-2xl" />

                <div className="relative rounded-[28px] border border-white/10 bg-white/90 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-7 lg:p-8">
                  <motion.div
                    variants={itemVariants}
                    className="mb-7 text-center sm:mb-8"
                  >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-lg font-black text-white shadow-lg shadow-slate-900/20">
                      MF
                    </div>

                    <div className="mb-3 flex justify-center lg:hidden">
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Accès sécurisé
                      </span>
                    </div>

                    <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                      Espace fiscal conseiller
                    </h2>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600 sm:text-[15px]">
                      Connectez-vous pour accéder à l’administration des
                      dossiers fiscaux, simulations et analyses clients.
                    </p>
                  </motion.div>

                  <form
                    onSubmit={handleLogin}
                    className="space-y-4 sm:space-y-5"
                  >
                    <motion.div variants={itemVariants}>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Adresse email
                      </label>

                      <div className="group relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition group-focus-within:text-orange-500">
                          <MailIcon />
                        </span>

                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="vous@monfideleconseiller.ch"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                          required
                          className="h-14 w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <label
                          htmlFor="password"
                          className="block text-sm font-semibold text-slate-700"
                        >
                          Mot de passe
                        </label>
                      </div>

                      <div className="group relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition group-focus-within:text-orange-500">
                          <LockIcon />
                        </span>

                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="current-password"
                          required
                          className="h-14 w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-14 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                          aria-label={
                            showPassword
                              ? "Masquer le mot de passe"
                              : "Afficher le mot de passe"
                          }
                        >
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </motion.div>

                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm"
                      >
                        {errorMessage}
                      </motion.div>
                    )}

                    <motion.div
                      variants={itemVariants}
                      className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                        Accès réservé
                      </p>
                      <p className="mt-1 text-sm leading-6 text-orange-800">
                        Cet espace est réservé à l’équipe cabinet pour la
                        gestion des simulations, dossiers clients et suivis
                        fiscaux.
                      </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="pt-1">
                      <button
                        type="submit"
                        disabled={loading}
                        className="group relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-900 px-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
                        <span className="relative flex items-center gap-2">
                          {loading && (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          )}
                          {loading ? "Connexion en cours..." : "Se connecter"}
                        </span>
                      </button>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="flex flex-col gap-3 border-t border-slate-200/80 pt-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left"
                    >
                      <Link
                        to="/"
                        className="inline-flex items-center justify-center text-sm font-medium text-slate-500 transition hover:text-slate-800"
                      >
                        ← Retour au site
                      </Link>

                      <p className="text-xs font-medium text-slate-500">
                        Accès réservé au cabinet
                      </p>
                    </motion.div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition duration-300 hover:border-white/20 hover:bg-white/[0.07]">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}

function MiniInfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 7.5v9A2.25 2.25 0 0119.5 18.75h-15A2.25 2.25 0 012.25 16.5v-9m19.5 0A2.25 2.25 0 0019.5 5.25h-15A2.25 2.25 0 002.25 7.5m19.5 0l-8.713 5.445a2 2 0 01-2.074 0L2.25 7.5"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V7.875a4.125 4.125 0 10-8.25 0V10.5m-.75 0h9.75A2.25 2.25 0 0119.5 12.75v6A2.25 2.25 0 0117.25 21h-10.5A2.25 2.25 0 014.5 18.75v-6A2.25 2.25 0 016.75 10.5z"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15.75A3.75 3.75 0 1012 8.25a3.75 3.75 0 000 7.5z"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.586 10.586A2 2 0 0012 14a2 2 0 001.414-.586M9.88 5.09A10.714 10.714 0 0112 4.875C18 4.875 21.75 12 21.75 12a20.646 20.646 0 01-4.088 5.056M6.228 6.228C3.865 8.004 2.25 12 2.25 12a20.62 20.62 0 004.932 5.766A10.67 10.67 0 0012 19.125c1.554 0 2.998-.3 4.308-.846"
      />
    </svg>
  );
}
