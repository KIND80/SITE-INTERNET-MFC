import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { generateFiscalPdf } from "@/lib/pdfFiscal";

const statusColors = {
  brouillon: "bg-slate-100 text-slate-700",
  a_relire: "bg-orange-100 text-orange-700",
  valide: "bg-green-100 text-green-700",
  archive: "bg-purple-100 text-purple-700",
};

const adminStatusColors = {
  nouveau: "bg-slate-100 text-slate-700",
  en_cours: "bg-blue-100 text-blue-700",
  relance: "bg-orange-100 text-orange-700",
  termine: "bg-green-100 text-green-700",
  sans_suite: "bg-red-100 text-red-700",
};

const optimisationColors = {
  Faible: "bg-slate-100 text-slate-700",
  Moyen: "bg-orange-100 text-orange-700",
  Élevé: "bg-green-100 text-green-700",
};

const formatCurrency = (value) =>
  `${Number(value || 0).toLocaleString("fr-CH")} CHF`;

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString("fr-FR") : "-";

export default function AdminFiscalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [savingFollowUp, setSavingFollowUp] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [dossier, setDossier] = useState(null);
  const [documents, setDocuments] = useState([]);

  const fetchDetail = async () => {
    try {
      setLoading(true);

      const { data: dossierData, error: dossierError } = await supabase
        .from("tax_declarations")
        .select("*")
        .eq("id", id)
        .single();

      if (dossierError) {
        console.error(dossierError);
        return;
      }

      const { data: docsData, error: docsError } = await supabase
        .from("tax_documents")
        .select("*")
        .eq("declaration_id", id)
        .order("created_at", { ascending: false });

      if (docsError) {
        console.error(docsError);
      }

      setDossier(dossierData);
      setDocuments(docsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      setSavingStatus(true);

      const { error } = await supabase
        .from("tax_declarations")
        .update({
          statut_dossier: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        console.error(error);
        alert("Impossible de mettre à jour le statut.");
        return;
      }

      await fetchDetail();
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSaveFollowUp = async () => {
    if (!dossier) return;

    setSavingFollowUp(true);

    const { error } = await supabase
      .from("tax_declarations")
      .update({
        admin_comment: dossier.admin_comment || "",
        admin_status: dossier.admin_status || "nouveau",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    setSavingFollowUp(false);

    if (error) {
      console.error(error);
      alert("Impossible d’enregistrer le suivi.");
      return;
    }

    alert("Suivi enregistré avec succès.");
    fetchDetail();
  };

  const handleDeleteLead = async () => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce dossier ? Cette action est irréversible."
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("tax_declarations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Impossible de supprimer ce dossier.");
      return;
    }

    navigate("/admin/dossiers-fiscaux");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/cabinet-login");
  };

  const openDocument = async (filePath) => {
    const { data, error } = await supabase.storage
      .from("tax-documents")
      .createSignedUrl(filePath, 60);

    if (error) {
      console.error(error);
      alert("Impossible d’ouvrir le document.");
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const quickInsight = useMemo(() => {
    if (!dossier) return "";

    if (dossier.niveau_optimisation === "Élevé") {
      return "Ce dossier présente un fort potentiel d’optimisation et mérite une analyse prioritaire.";
    }

    if (dossier.parcours_fiscal === "TOU") {
      return "Une comparaison entre l’imposition réelle et la taxation à la source semble pertinente.";
    }

    if (dossier.parcours_fiscal === "DRIS") {
      return "Une vérification des déductions oubliées et des possibilités de rectification est recommandée.";
    }

    return "Le dossier semble standard, mais une relecture peut révéler des ajustements utiles.";
  }, [dossier]);

  if (loading) {
    return <div className="p-8 text-sm text-slate-500">Chargement...</div>;
  }

  if (!dossier) {
    return (
      <div className="p-8 text-sm text-slate-500">Dossier introuvable.</div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-600">
                Dossier fiscal
              </p>
              <h1 className="mt-2 text-3xl font-black text-slate-900">
                {dossier.nom_complet || "Sans nom"}
              </h1>
              <p className="mt-2 text-slate-600">
                {dossier.email || "-"} • {dossier.telephone || "-"}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Créé le {formatDateTime(dossier.created_at)}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Mis à jour le {formatDateTime(dossier.updated_at)}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge
                  text={dossier.statut_dossier || "brouillon"}
                  className={
                    statusColors[dossier.statut_dossier] ||
                    "bg-slate-100 text-slate-700"
                  }
                />
                <Badge
                  text={dossier.admin_status || "nouveau"}
                  className={
                    adminStatusColors[dossier.admin_status] ||
                    "bg-slate-100 text-slate-700"
                  }
                />
                <Badge
                  text={dossier.parcours_fiscal || "Estimation simple"}
                  className="bg-slate-100 text-slate-700"
                />
                <Badge
                  text={dossier.mode_imposition || dossier.statut || "-"}
                  className="bg-blue-100 text-blue-700"
                />
                <Badge
                  text={dossier.niveau_optimisation || "Faible"}
                  className={
                    optimisationColors[dossier.niveau_optimisation] ||
                    "bg-slate-100 text-slate-700"
                  }
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin/dossiers-fiscaux"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                ← Retour liste
              </Link>

              <Link
                to="/"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Retour site
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <StatCard
            title="Impôt estimé"
            value={formatCurrency(dossier.impot_estime || 0)}
          />
          <StatCard
            title="Potentiel optimisation"
            value={formatCurrency(dossier.optimisation_potentielle || 0)}
          />
          <StatCard
            title="Écart possible"
            value={formatCurrency(dossier.difference_possible || 0)}
          />
          <StatCard
            title="Niveau"
            value={dossier.niveau_optimisation || "Faible"}
          />
        </div>

        <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Lecture rapide</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {quickInsight}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Actions dossier
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Gérez rapidement l’avancement du dossier.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => updateStatus("a_relire")}
                disabled={savingStatus}
                className="rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60"
              >
                À relire
              </button>

              <button
                onClick={() => updateStatus("valide")}
                disabled={savingStatus}
                className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60"
              >
                Valider
              </button>

              <button
                onClick={() => updateStatus("archive")}
                disabled={savingStatus}
                className="rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                Archiver
              </button>

              <button
                onClick={() => generateFiscalPdf(dossier, documents)}
                className="rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700"
              >
                Générer le PDF
              </button>

              <button
                onClick={handleDeleteLead}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Suivi commercial / administratif
          </h2>

          <div className="mt-5 grid gap-4 lg:grid-cols-[240px_1fr_auto]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Statut de suivi
              </label>
              <select
                value={dossier.admin_status || "nouveau"}
                onChange={(e) =>
                  setDossier((prev) => ({
                    ...prev,
                    admin_status: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="nouveau">Nouveau</option>
                <option value="en_cours">En cours</option>
                <option value="relance">Relance</option>
                <option value="termine">Terminé</option>
                <option value="sans_suite">Sans suite</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Commentaire / suivi
              </label>
              <textarea
                rows={4}
                value={dossier.admin_comment || ""}
                onChange={(e) =>
                  setDossier((prev) => ({
                    ...prev,
                    admin_comment: e.target.value,
                  }))
                }
                placeholder="Ex : client rappelé, documents manquants, devis envoyé, relance prévue jeudi..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSaveFollowUp}
                disabled={savingFollowUp}
                className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60 lg:w-auto"
              >
                {savingFollowUp ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card title="Informations client">
            <InfoRow label="Nom complet" value={dossier.nom_complet} />
            <InfoRow label="Email" value={dossier.email} />
            <InfoRow label="Téléphone" value={dossier.telephone} />
            <InfoRow label="Canton" value={dossier.canton} />
            <InfoRow label="Commune" value={dossier.commune} />
            <InfoRow label="Statut" value={dossier.statut} />
            <InfoRow
              label="Situation familiale"
              value={dossier.situation_familiale}
            />
            <InfoRow label="Enfants" value={dossier.enfants} />
            <InfoRow label="Quasi-résident" value={dossier.quasi_resident} />
            <InfoRow label="Statut dossier" value={dossier.statut_dossier} />
            <InfoRow label="Statut suivi admin" value={dossier.admin_status} />
          </Card>

          <Card title="Synthèse fiscale">
            <InfoRow
              label="Mode d’imposition"
              value={dossier.mode_imposition}
            />
            <InfoRow label="Parcours fiscal" value={dossier.parcours_fiscal} />
            <InfoRow
              label="Total revenus"
              value={formatCurrency(dossier.total_revenus || 0)}
            />
            <InfoRow
              label="Total déductions"
              value={formatCurrency(dossier.total_deductions || 0)}
            />
            <InfoRow
              label="Revenu imposable estimé"
              value={formatCurrency(dossier.revenu_imposable_estime || 0)}
            />
            <InfoRow
              label="Impôt revenu estimé"
              value={formatCurrency(dossier.impot_revenu_estime || 0)}
            />
            <InfoRow
              label="Impôt fortune estimé"
              value={formatCurrency(dossier.impot_fortune_estime || 0)}
            />
            <InfoRow
              label="Impôt estimé total"
              value={formatCurrency(dossier.impot_estime || 0)}
            />
            <InfoRow
              label="Optimisation potentielle"
              value={formatCurrency(dossier.optimisation_potentielle || 0)}
            />
            <InfoRow
              label="Niveau optimisation"
              value={dossier.niveau_optimisation}
            />
            <InfoRow
              label="Différence possible"
              value={formatCurrency(dossier.difference_possible || 0)}
            />
          </Card>

          <Card title="Revenus & déductions">
            <InfoRow
              label="Salaire annuel"
              value={formatCurrency(dossier.salaire_annuel || 0)}
            />
            <InfoRow
              label="Autres revenus"
              value={formatCurrency(dossier.autres_revenus || 0)}
            />
            <InfoRow
              label="Revenu conjoint"
              value={formatCurrency(dossier.revenu_conjoint || 0)}
            />
            <InfoRow label="13e salaire" value={dossier.treizieme_salaire} />
            <InfoRow
              label="3e pilier"
              value={formatCurrency(dossier.troisieme_pilier || 0)}
            />
            <InfoRow
              label="Assurance maladie"
              value={formatCurrency(dossier.assurance_maladie || 0)}
            />
            <InfoRow
              label="Frais transport"
              value={formatCurrency(dossier.frais_transport || 0)}
            />
            <InfoRow
              label="Frais garde"
              value={formatCurrency(dossier.frais_garde || 0)}
            />
            <InfoRow
              label="Pensions alimentaires"
              value={formatCurrency(dossier.pensions_alimentaires || 0)}
            />
            <InfoRow
              label="Frais formation"
              value={formatCurrency(dossier.frais_formation || 0)}
            />
            <InfoRow
              label="Intérêts de dette"
              value={formatCurrency(dossier.interets_dette || 0)}
            />
          </Card>

          <Card title="Fortune">
            <InfoRow
              label="Avoirs bancaires"
              value={formatCurrency(dossier.avoirs_bancaires || 0)}
            />
            <InfoRow
              label="Titres"
              value={formatCurrency(dossier.titres || 0)}
            />
            <InfoRow
              label="Immobilier"
              value={formatCurrency(dossier.immobilier || 0)}
            />
            <InfoRow
              label="Dettes"
              value={formatCurrency(dossier.dettes || 0)}
            />
          </Card>
        </div>

        <Card title="Documents justificatifs">
          {documents.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun document.</p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {doc.file_name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {doc.category || "document"}
                    </p>
                    <p className="text-xs text-slate-400">
                      Ajouté le {formatDateTime(doc.created_at)}
                    </p>
                  </div>

                  <button
                    onClick={() => openDocument(doc.file_path)}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
                  >
                    Ouvrir
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <div className="mt-5 space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <span className="text-sm font-semibold text-slate-500">{label}</span>
      <span className="text-right text-sm font-bold text-slate-900">
        {value || "-"}
      </span>
    </div>
  );
}

function Badge({ text, className }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${className}`}
    >
      {text}
    </span>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <div className="mt-2 text-2xl font-black text-slate-900">{value}</div>
    </div>
  );
}
