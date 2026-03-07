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

export default function AdminFiscalDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dossiers, setDossiers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");

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
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = fullText.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "Tous" || dossier.statut_dossier === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [dossiers, search, statusFilter]);

  const stats = useMemo(() => {
    const total = dossiers.length;
    const aRelire = dossiers.filter((d) => d.statut_dossier === "a_relire").length;
    const valides = dossiers.filter((d) => d.statut_dossier === "valide").length;
    const brouillons = dossiers.filter((d) => d.statut_dossier === "brouillon").length;

    return { total, aRelire, valides, brouillons };
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
              Gérez les déclarations, les documents et les dossiers clients.
            </p>
          </div>

          <button
            onClick={fetchDossiers}
            className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
          >
            Actualiser
          </button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <StatCard title="Total dossiers" value={stats.total} />
          <StatCard title="À relire" value={stats.aRelire} />
          <StatCard title="Validés" value={stats.valides} />
          <StatCard title="Brouillons" value={stats.brouillons} />
        </div>

        <div className="mb-6 grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px] md:p-6">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Rechercher un dossier
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nom, email, téléphone, canton..."
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Statut
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
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden grid-cols-7 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500 md:grid">
            <div>Client</div>
            <div>Canton</div>
            <div>Statut fiscal</div>
            <div>Revenu estimé</div>
            <div>Impôt estimé</div>
            <div>Statut dossier</div>
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
              {filteredDossiers.map((dossier, index) => (
                <motion.div
                  key={dossier.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="grid gap-4 px-6 py-5 md:grid-cols-7 md:items-center"
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {dossier.nom_complet || "Sans nom"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {dossier.email || "Pas d’email"}
                    </p>
                  </div>

                  <div className="text-sm text-slate-700">
                    {dossier.canton || "-"}
                  </div>

                  <div className="text-sm text-slate-700">
                    {dossier.statut || "-"}
                  </div>

                  <div className="text-sm font-semibold text-slate-900">
                    {Number(dossier.revenu_imposable_estime || 0).toLocaleString("fr-CH")} CHF
                  </div>

                  <div className="text-sm font-semibold text-slate-900">
                    {Number(dossier.impot_estime || 0).toLocaleString("fr-CH")} CHF
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        statusColors[dossier.statut_dossier] || "bg-slate-100 text-slate-700"
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
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 md:w-auto"
                    >
                      Voir
                    </button>
                  </div>
                </motion.div>
              ))}
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