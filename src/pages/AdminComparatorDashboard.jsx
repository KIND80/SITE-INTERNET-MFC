import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

const statusColors = {
  nouveau: "bg-blue-100 text-blue-700",
  contacte: "bg-orange-100 text-orange-700",
  converti: "bg-green-100 text-green-700",
  archive: "bg-purple-100 text-purple-700",
};

const priorityColors = {
  budget: "bg-slate-100 text-slate-700",
  balanced: "bg-orange-100 text-orange-700",
  premium: "bg-green-100 text-green-700",
};

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("fr-CH");
  } catch {
    return value;
  }
}

function formatPriority(value) {
  if (value === "budget") return "Budget";
  if (value === "premium") return "Couverture maximale";
  return "Équilibré";
}

function normalizeNeeds(needs) {
  if (!needs) return [];
  if (Array.isArray(needs)) return needs;
  try {
    const parsed = JSON.parse(needs);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function AdminComparatorDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [priorityFilter, setPriorityFilter] = useState("Tous");
  const [selectedLead, setSelectedLead] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("comparator_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setLeads(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const fullText = [
        lead.first_name,
        lead.last_name,
        lead.email,
        lead.priority,
        ...(normalizeNeeds(lead.selected_needs) || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = fullText.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "Tous" || (lead.status || "nouveau") === statusFilter;

      const matchesPriority =
        priorityFilter === "Tous" ||
        (lead.priority || "balanced") === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [leads, search, statusFilter, priorityFilter]);

  const stats = useMemo(() => {
    const total = leads.length;
    const nouveaux = leads.filter((l) => (l.status || "nouveau") === "nouveau").length;
    const contactes = leads.filter((l) => l.status === "contacte").length;
    const convertis = leads.filter((l) => l.status === "converti").length;
    const archives = leads.filter((l) => l.status === "archive").length;
    const budget = leads.filter((l) => l.priority === "budget").length;
    const balanced = leads.filter((l) => (l.priority || "balanced") === "balanced").length;
    const premium = leads.filter((l) => l.priority === "premium").length;

    return {
      total,
      nouveaux,
      contactes,
      convertis,
      archives,
      budget,
      balanced,
      premium,
    };
  }, [leads]);

  const handleUpdateStatus = async (leadId, nextStatus) => {
    try {
      setUpdatingStatus(true);

      const { error } = await supabase
        .from("comparator_leads")
        .update({ status: nextStatus })
        .eq("id", leadId);

      if (error) {
        console.error(error);
        return;
      }

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: nextStatus } : lead
        )
      );

      setSelectedLead((prev) =>
        prev && prev.id === leadId ? { ...prev, status: nextStatus } : prev
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-600">
              Admin comparateur
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">
              Leads comparateur
            </h1>
            <p className="mt-2 text-slate-600">
              Consultez les leads issus du comparateur d’assurances
              complémentaires, leurs priorités et leurs besoins sélectionnés.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate("/admin/dossiers-fiscaux")}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Espace fiscal
            </button>

            <button
              onClick={fetchLeads}
              className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
            >
              Actualiser
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total leads" value={stats.total} />
          <StatCard title="Nouveaux" value={stats.nouveaux} />
          <StatCard title="Contactés" value={stats.contactes} />
          <StatCard title="Convertis" value={stats.convertis} />
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Archivés" value={stats.archives} />
          <StatCard title="Budget" value={stats.budget} />
          <StatCard title="Équilibré" value={stats.balanced} />
          <StatCard title="Premium" value={stats.premium} />
        </div>

        <div className="mb-6 grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-4 md:p-6">
          <div className="xl:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Rechercher un lead
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nom, email, priorité, besoin..."
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
              <option value="nouveau">nouveau</option>
              <option value="contacte">contacte</option>
              <option value="converti">converti</option>
              <option value="archive">archive</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Priorité
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              <option>Tous</option>
              <option value="budget">budget</option>
              <option value="balanced">balanced</option>
              <option value="premium">premium</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden grid-cols-8 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500 xl:grid">
            <div>Lead</div>
            <div>Email</div>
            <div>Date</div>
            <div>Priorité</div>
            <div>Besoins</div>
            <div>Statut</div>
            <div>Résultats</div>
            <div>Action</div>
          </div>

          {loading ? (
            <div className="p-8 text-sm text-slate-500">Chargement...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-8 text-sm text-slate-500">
              Aucun lead trouvé.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredLeads.map((lead, index) => {
                const needs = normalizeNeeds(lead.selected_needs);
                const leadName =
                  [lead.first_name, lead.last_name].filter(Boolean).join(" ") ||
                  "Sans nom";
                const statusLabel = lead.status || "nouveau";
                const priorityLabel = lead.priority || "balanced";
                const resultsCount = Array.isArray(lead.results_json)
                  ? lead.results_json.length
                  : 0;

                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="grid gap-4 px-6 py-5 xl:grid-cols-8 xl:items-center"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{leadName}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {lead.id}
                      </p>
                    </div>

                    <div className="text-sm text-slate-700">
                      {lead.email || "-"}
                    </div>

                    <div className="text-sm text-slate-700">
                      {formatDate(lead.created_at)}
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          priorityColors[priorityLabel] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {formatPriority(priorityLabel)}
                      </span>
                    </div>

                    <div className="text-sm text-slate-700">
                      {needs.length > 0 ? `${needs.length} besoin(x)` : "—"}
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          statusColors[statusLabel] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-slate-900">
                      {resultsCount} résultat(s)
                    </div>

                    <div>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 xl:w-auto"
                      >
                        Voir
                      </button>
                    </div>

                    <div className="xl:col-span-8 xl:hidden">
                      <div className="mt-2 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Priorité
                          </p>
                          <p className="mt-1 font-medium text-slate-800">
                            {formatPriority(priorityLabel)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Date
                          </p>
                          <p className="mt-1 font-medium text-slate-800">
                            {formatDate(lead.created_at)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Email
                          </p>
                          <p className="mt-1 font-medium text-slate-800 break-all">
                            {lead.email || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Besoins
                          </p>
                          <p className="mt-1 font-medium text-slate-800">
                            {needs.length > 0 ? `${needs.length} besoin(x)` : "—"}
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

        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-orange-600">
                    Détail lead comparateur
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">
                    {[selectedLead.first_name, selectedLead.last_name]
                      .filter(Boolean)
                      .join(" ") || "Sans nom"}
                  </h2>
                  <p className="mt-1 text-slate-500">
                    {selectedLead.email || "Pas d’email"}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedLead(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Fermer
                </button>
              </div>

              <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoCard title="Date" value={formatDate(selectedLead.created_at)} />
                <InfoCard
                  title="Priorité"
                  value={formatPriority(selectedLead.priority || "balanced")}
                />
                <InfoCard
                  title="Statut"
                  value={selectedLead.status || "nouveau"}
                />
                <InfoCard
                  title="Résultats"
                  value={`${
                    Array.isArray(selectedLead.results_json)
                      ? selectedLead.results_json.length
                      : 0
                  } résultat(s)`}
                />
              </div>

              <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-700">
                  Besoins sélectionnés
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {normalizeNeeds(selectedLead.selected_needs).length > 0 ? (
                    normalizeNeeds(selectedLead.selected_needs).map((need) => (
                      <span
                        key={need}
                        className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200"
                      >
                        {need}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">Aucun besoin</span>
                  )}
                </div>
              </div>

              <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-slate-700">
                    Mettre à jour le statut
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {["nouveau", "contacte", "converti", "archive"].map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() =>
                            handleUpdateStatus(selectedLead.id, status)
                          }
                          disabled={updatingStatus}
                          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                            (selectedLead.status || "nouveau") === status
                              ? "bg-orange-600 text-white"
                              : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {status}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="mb-4 text-sm font-semibold text-slate-700">
                  Résultats enregistrés
                </p>

                {!Array.isArray(selectedLead.results_json) ||
                selectedLead.results_json.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Aucun résultat enregistré.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {selectedLead.results_json.map((result, index) => (
                      <div
                        key={`${result.caisse}-${result.produit}-${index}`}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-bold text-slate-900">
                              {result.caisse || "—"}
                            </p>
                            <p className="text-sm text-slate-500">
                              {result.produit || "—"}
                            </p>
                          </div>

                          <div className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200">
                            Score : {result.totalScore || 0}
                          </div>
                        </div>

                        {Array.isArray(result.prestations) &&
                          result.prestations.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {result.prestations.slice(0, 5).map((prest, i) => (
                                <div
                                  key={`${prest.critere}-${i}`}
                                  className="rounded-xl bg-white px-3 py-2 text-sm text-slate-700 border border-slate-200"
                                >
                                  <span className="font-semibold">
                                    {prest.critere}
                                  </span>
                                  {prest.description ? ` — ${prest.description}` : ""}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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

function InfoCard({ title, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <div className="mt-2 text-base font-bold text-slate-900 break-words">
        {value}
      </div>
    </div>
  );
}