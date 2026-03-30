import jsPDF from "jspdf";

export function generateFiscalPdf(dossier, documents = []) {
  const doc = new jsPDF();

  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Mon Fidèle Conseiller", 20, y);

  y += 10;
  doc.setFontSize(14);
  doc.text("Dossier fiscal", 20, y);

  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Nom : ${dossier.nom_complet || "-"}`, 20, y);
  y += 7;
  doc.text(`Email : ${dossier.email || "-"}`, 20, y);
  y += 7;
  doc.text(`Téléphone : ${dossier.telephone || "-"}`, 20, y);
  y += 7;
  doc.text(`Canton : ${dossier.canton || "-"}`, 20, y);
  y += 7;
  doc.text(`Statut : ${dossier.statut || "-"}`, 20, y);
  y += 12;

  doc.setFont("helvetica", "bold");
  doc.text("Synthèse fiscale", 20, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.text(
    `Total revenus : ${Number(dossier.total_revenus || 0).toLocaleString(
      "fr-CH"
    )} CHF`,
    20,
    y
  );
  y += 7;
  doc.text(
    `Total déductions : ${Number(dossier.total_deductions || 0).toLocaleString(
      "fr-CH"
    )} CHF`,
    20,
    y
  );
  y += 7;
  doc.text(
    `Revenu imposable estimé : ${Number(
      dossier.revenu_imposable_estime || 0
    ).toLocaleString("fr-CH")} CHF`,
    20,
    y
  );
  y += 7;
  doc.text(
    `Impôt estimé : ${Number(dossier.impot_estime || 0).toLocaleString(
      "fr-CH"
    )} CHF`,
    20,
    y
  );
  y += 12;

  doc.setFont("helvetica", "bold");
  doc.text("Revenus & déductions", 20, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.text(
    `Salaire annuel : ${Number(dossier.salaire_annuel || 0).toLocaleString(
      "fr-CH"
    )} CHF`,
    20,
    y
  );
  y += 7;
  doc.text(
    `Autres revenus : ${Number(dossier.autres_revenus || 0).toLocaleString(
      "fr-CH"
    )} CHF`,
    20,
    y
  );
  y += 7;
  doc.text(
    `3e pilier : ${Number(dossier.troisieme_pilier || 0).toLocaleString(
      "fr-CH"
    )} CHF`,
    20,
    y
  );
  y += 7;
  doc.text(
    `Assurance maladie : ${Number(
      dossier.assurance_maladie || 0
    ).toLocaleString("fr-CH")} CHF`,
    20,
    y
  );
  y += 7;
  doc.text(
    `Frais transport : ${Number(dossier.frais_transport || 0).toLocaleString(
      "fr-CH"
    )} CHF`,
    20,
    y
  );
  y += 7;
  doc.text(
    `Frais garde : ${Number(dossier.frais_garde || 0).toLocaleString(
      "fr-CH"
    )} CHF`,
    20,
    y
  );
  y += 12;

  doc.setFont("helvetica", "bold");
  doc.text("Fortune", 20, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.text(
    `Avoirs bancaires : ${Number(dossier.avoirs_bancaires || 0).toLocaleString(
      "fr-CH"
    )} CHF`,
    20,
    y
  );
  y += 7;
  doc.text(
    `Titres : ${Number(dossier.titres || 0).toLocaleString("fr-CH")} CHF`,
    20,
    y
  );
  y += 7;
  doc.text(
    `Immobilier : ${Number(dossier.immobilier || 0).toLocaleString(
      "fr-CH"
    )} CHF`,
    20,
    y
  );
  y += 7;
  doc.text(
    `Dettes : ${Number(dossier.dettes || 0).toLocaleString("fr-CH")} CHF`,
    20,
    y
  );
  y += 12;

  doc.setFont("helvetica", "bold");
  doc.text("Documents transmis", 20, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  if (!documents.length) {
    doc.text("Aucun document joint.", 20, y);
  } else {
    documents.forEach((file) => {
      doc.text(`- ${file.file_name}`, 20, y);
      y += 7;
    });
  }

  doc.save(`dossier-fiscal-${dossier.nom_complet || "client"}.pdf`);
}
