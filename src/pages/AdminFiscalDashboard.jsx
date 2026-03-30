import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

const statusColors = {
  brouillon: "bg-slate-100 text-slate-700",
  a_relire: "bg-orange-100 text-orange-700",
  valide: "bg-green-100 text-green-700",
  archive: "bg-purple-100 text-purple-700",
};

const optimisationColors = {
  Faible: "bg-slate-100 text-slate-700",
  Moyen: "bg-orange-100 text-orange-700",
  Élevé: "bg-green-100 text-green-700",
};

const formatCurrency = (value) => {
  return `${Number(value || 0).toLocaleString("fr-CH")} CHF`;
};

export default function AdminFiscalDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dossiers, setDossiers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [cantonFilter, setCantonFilter] = useState("Tous");
  const [parcoursFilter, setParcoursFilter] = useState("Tous");
  const [optimisationFilter, setOptimisationFilter] = useState("Tous");

  const fetchDossiers = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("tax_declarations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setDossiers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDossiers();
  }, []);

  const filteredDossiers = useMemo(() => {
    return dossiers.filter((dossier) => {
      const fullText = [
        dossier.nom_complet,
        dossier.email,
        dossier.telephone,
        dossier.canton,
        dossier.statut,
        dossier.situation_familiale,
        dossier.mode_imposition,
        dossier.parcours_fiscal,
        dossier.commune,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = fullText.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "Tous" || dossier.statut_dossier === statusFilter;

      const matchesCanton =
        cantonFilter === "Tous" || dossier.canton === cantonFilter;

      const matchesParcours =
        parcoursFilter === "Tous" ||
        (dossier.parcours_fiscal || "Estimation simple") === parcoursFilter;

      const matchesOptimisation =
        optimisationFilter === "Tous" ||
        (dossier.niveau_optimisation || "Faible") === optimisationFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCanton &&
        matchesParcours &&
        matchesOptimisation
      );
    });
  }, [
    dossiers,
    search,
    statusFilter,
    cantonFilter,
    parcoursFilter,
    optimisationFilter,
  ]);

  const stats = useMemo(() => {
    const total = dossiers.length;
    const aRelire = dossiers.filter(
      (d) => d.statut_dossier === "a_relire"
    ).length;
    const valides = dossiers.filter(
      (d) => d.statut_dossier === "valide"
    ).length;
    const brouillons = dossiers.filter(
      (d) => d.statut_dossier === "brouillon"
    ).length;
    const geneve = dossiers.filter((d) => d.canton === "Genève").length;
    const vaud = dossiers.filter((d) => d.canton === "Vaud").length;
    const dris = dossiers.filter((d) => d.parcours_fiscal === "DRIS").length;
    const tou = dossiers.filter((d) => d.parcours_fiscal === "TOU").length;
    const optimisationElevee = dossiers.filter(
      (d) => d.niveau_optimisation === "Élevé"
    ).length;

    const potentielTotal = dossiers.reduce(
      (sum, d) => sum + Number(d.optimisation_potentielle || 0),
      0
    );

    return {
      total,
      aRelire,
      valides,
      brouillons,
      geneve,
      vaud,
      dris,
      tou,
      optimisationElevee,
      potentielTotal,
    };
  }, [dossiers]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-600">
              Admin fiscal
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">
              Dossiers fiscaux
            </h1>
            <p className="mt-2 text-slate-600">
              Gérez les simulations, les parcours TOU / DRIS, les documents et
              les opportunités d’optimisation.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate("/admin/comparateur")}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Leads comparateur
            </button>

            <button
              onClick={fetchDossiers}
              className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
            >
              Actualiser
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard title="Total dossiers" value={stats.total} />
          <StatCard title="À relire" value={stats.aRelire} />
          <StatCard title="Validés" value={stats.valides} />
          <StatCard title="DRIS" value={stats.dris} />
          <StatCard title="TOU" value={stats.tou} />
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Genève" value={stats.geneve} />
          <StatCard title="Vaud" value={stats.vaud} />
          <StatCard
            title="Optimisation élevée"
            value={stats.optimisationElevee}
          />
          <StatCard
            title="Potentiel cumulé"
            value={formatCurrency(stats.potentielTotal)}
          />
        </div>

        <div className="mb-6 grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-5 md:p-6">
          <div className="xl:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Rechercher un dossier
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nom, email, téléphone, canton, TOU, DRIS..."
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Statut dossier
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              <option>Tous</option>
              <option value="brouillon">brouillon</option>
              <option value="a_relire">a_relire</option>
              <option value="valide">valide</option>
              <option value="archive">archive</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Canton
            </label>
            <select
              value={cantonFilter}
              onChange={(e) => setCantonFilter(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              <option>Tous</option>
              <option value="Genève">Genève</option>
              <option value="Vaud">Vaud</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Parcours fiscal
            </label>
            <select
              value={parcoursFilter}
              onChange={(e) => setParcoursFilter(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              <option>Tous</option>
              <option value="DRIS">DRIS</option>
              <option value="TOU">TOU</option>
              <option value="Estimation simple">Estimation simple</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Niveau optimisation
            </label>
            <select
              value={optimisationFilter}
              onChange={(e) => setOptimisationFilter(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              <option>Tous</option>
              <option value="Faible">Faible</option>
              <option value="Moyen">Moyen</option>
              <option value="Élevé">Élevé</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden grid-cols-9 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500 xl:grid">
            <div>Client</div>
            <div>Canton</div>
            <div>Mode</div>
            <div>Parcours</div>
            <div>Revenu imposable</div>
            <div>Impôt estimé</div>
            <div>Optimisation</div>
            <div>Statut</div>
            <div>Action</div>
          </div>

          {loading ? (
            <div className="p-8 text-sm text-slate-500">Chargement...</div>
          ) : filteredDossiers.length === 0 ? (
            <div className="p-8 text-sm text-slate-500">
              Aucun dossier trouvé.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredDossiers.map((dossier, index) => {
                const optimisationLabel =
                  dossier.niveau_optimisation || "Faible";
                const parcoursLabel =
                  dossier.parcours_fiscal || "Estimation simple";
                const modeLabel =
                  dossier.mode_imposition || dossier.statut || "-";

                return (
                  <motion.div
                    key={dossier.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="grid gap-4 px-6 py-5 xl:grid-cols-9 xl:items-center"
                  >
                    <div>
                      <p className="font-bold text-slate-900">
                        {dossier.nom_complet || "Sans nom"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {dossier.email || "Pas d’email"}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {dossier.telephone || "Pas de téléphone"}
                      </p>
                    </div>

                    <div className="text-sm text-slate-700">
                      {dossier.canton || "-"}
                    </div>

                    <div className="text-sm text-slate-700">{modeLabel}</div>

                    <div>
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        {parcoursLabel}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-slate-900">
                      {formatCurrency(dossier.revenu_imposable_estime || 0)}
                    </div>

                    <div className="text-sm font-semibold text-slate-900">
                      {formatCurrency(dossier.impot_estime || 0)}
                    </div>

                    <div className="space-y-1">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          optimisationColors[optimisationLabel] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {optimisationLabel}
                      </span>
                      <p className="text-xs text-slate-500">
                        {formatCurrency(dossier.optimisation_potentielle || 0)}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          statusColors[dossier.statut_dossier] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {dossier.statut_dossier || "brouillon"}
                      </span>
                    </div>

                    <div>
                      <button
                        onClick={() =>
                          navigate(`/admin/dossiers-fiscaux/${dossier.id}`)
                        }
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 xl:w-auto"
                      >
                        Voir
                      </button>
                    </div>

                    <div className="xl:col-span-9 xl:hidden">
                      <div className="mt-2 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Parcours
                          </p>
                          <p className="mt-1 font-medium text-slate-800">
                            {parcoursLabel}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Mode
                          </p>
                          <p className="mt-1 font-medium text-slate-800">
                            {modeLabel}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Revenu imposable
                          </p>
                          <p className="mt-1 font-medium text-slate-800">
                            {formatCurrency(
                              dossier.revenu_imposable_estime || 0
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Impôt estimé
                          </p>
                          <p className="mt-1 font-medium text-slate-800">
                            {formatCurrency(dossier.impot_estime || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Optimisation
                          </p>
                          <p className="mt-1 font-medium text-slate-800">
                            {formatCurrency(
                              dossier.optimisation_potentielle || 0
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Commune
                          </p>
                          <p className="mt-1 font-medium text-slate-800">
                            {dossier.commune || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <div className="mt-3 text-3xl font-black text-slate-900">{value}</div>
    </div>
  );
}
