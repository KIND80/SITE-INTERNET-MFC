import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { generateFiscalPdf } from "@/lib/pdfFiscal";

export default function AdminFiscalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [savingFollowUp, setSavingFollowUp] = useState(false);
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

    fetchDetail();
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
                Créé le{" "}
                {dossier.created_at
                  ? new Date(dossier.created_at).toLocaleString("fr-FR")
                  : "-"}
              </p>
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
                onClick={() => updateStatus("valide")}
                className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700"
              >
                Valider
              </button>

              <button
                onClick={() => updateStatus("archive")}
                className="rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
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
            <InfoRow label="Canton" value={dossier.canton} />
            <InfoRow label="Statut" value={dossier.statut} />
            <InfoRow
              label="Situation familiale"
              value={dossier.situation_familiale}
            />
            <InfoRow label="Enfants" value={dossier.enfants} />
            <InfoRow label="Statut dossier" value={dossier.statut_dossier} />
            <InfoRow label="Statut suivi admin" value={dossier.admin_status} />
          </Card>

          <Card title="Synthèse fiscale">
            <InfoRow
              label="Total revenus"
              value={`${Number(dossier.total_revenus || 0).toLocaleString(
                "fr-CH"
              )} CHF`}
            />
            <InfoRow
              label="Total déductions"
              value={`${Number(dossier.total_deductions || 0).toLocaleString(
                "fr-CH"
              )} CHF`}
            />
            <InfoRow
              label="Revenu imposable estimé"
              value={`${Number(
                dossier.revenu_imposable_estime || 0
              ).toLocaleString("fr-CH")} CHF`}
            />
            <InfoRow
              label="Impôt estimé"
              value={`${Number(dossier.impot_estime || 0).toLocaleString(
                "fr-CH"
              )} CHF`}
            />
          </Card>

          <Card title="Revenus & déductions">
            <InfoRow
              label="Salaire annuel"
              value={`${Number(dossier.salaire_annuel || 0).toLocaleString(
                "fr-CH"
              )} CHF`}
            />
            <InfoRow
              label="Autres revenus"
              value={`${Number(dossier.autres_revenus || 0).toLocaleString(
                "fr-CH"
              )} CHF`}
            />
            <InfoRow
              label="3e pilier"
              value={`${Number(dossier.troisieme_pilier || 0).toLocaleString(
                "fr-CH"
              )} CHF`}
            />
            <InfoRow
              label="Assurance maladie"
              value={`${Number(dossier.assurance_maladie || 0).toLocaleString(
                "fr-CH"
              )} CHF`}
            />
            <InfoRow
              label="Frais transport"
              value={`${Number(dossier.frais_transport || 0).toLocaleString(
                "fr-CH"
              )} CHF`}
            />
            <InfoRow
              label="Frais garde"
              value={`${Number(dossier.frais_garde || 0).toLocaleString(
                "fr-CH"
              )} CHF`}
            />
          </Card>

          <Card title="Fortune">
            <InfoRow
              label="Avoirs bancaires"
              value={`${Number(dossier.avoirs_bancaires || 0).toLocaleString(
                "fr-CH"
              )} CHF`}
            />
            <InfoRow
              label="Titres"
              value={`${Number(dossier.titres || 0).toLocaleString(
                "fr-CH"
              )} CHF`}
            />
            <InfoRow
              label="Immobilier"
              value={`${Number(dossier.immobilier || 0).toLocaleString(
                "fr-CH"
              )} CHF`}
            />
            <InfoRow
              label="Dettes"
              value={`${Number(dossier.dettes || 0).toLocaleString(
                "fr-CH"
              )} CHF`}
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
                    <p className="text-sm text-slate-500">{doc.category}</p>
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
      <span className="text-sm font-bold text-slate-900">{value || "-"}</span>
    </div>
  );
}