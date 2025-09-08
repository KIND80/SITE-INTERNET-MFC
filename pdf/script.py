#!/usr/bin/env python3
"""
Script pour extraire les tableaux d'un PDF et les convertir en JSON
Utilise tabula-py pour l'extraction des tableaux et pandas pour le traitement
"""

import json
import pandas as pd
import tabula
import argparse
import os
from typing import List, Dict, Any
from pathlib import Path

def extract_tables_from_pdf(pdf_path: str, pages: str = "all") -> List[pd.DataFrame]:
    """
    Extrait les tableaux d'un fichier PDF
    
    Args:
        pdf_path (str): Chemin vers le fichier PDF
        pages (str): Pages à analyser ("all", "1,2,3" ou "1-5")
        
    Returns:
        List[pd.DataFrame]: Liste des tableaux extraits
    """
    try:
        # Extraction des tableaux avec tabula
        tables = tabula.read_pdf(
            pdf_path,
            pages=pages,
            multiple_tables=True,
            pandas_options={'header': [0]}  # Première ligne comme en-tête
        )
        
        print(f"✓ {len(tables)} tableau(x) trouvé(s) dans le PDF")
        return tables
        
    except Exception as e:
        print(f"✗ Erreur lors de l'extraction : {e}")
        return []

def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Nettoie un DataFrame en supprimant les lignes/colonnes vides
    
    Args:
        df (pd.DataFrame): DataFrame à nettoyer
        
    Returns:
        pd.DataFrame: DataFrame nettoyé
    """
    # Supprimer les lignes complètement vides
    df = df.dropna(how='all')
    
    # Supprimer les colonnes complètement vides
    df = df.dropna(axis=1, how='all')
    
    # Remplacer les NaN par des chaînes vides pour JSON
    df = df.fillna('')
    
    # Nettoyer les noms de colonnes
    df.columns = [str(col).strip() if pd.notna(col) else f'Colonne_{i+1}' 
                  for i, col in enumerate(df.columns)]
    
    return df

def dataframes_to_json(tables: List[pd.DataFrame], output_format: str = "records") -> List[Dict[str, Any]]:
    """
    Convertit une liste de DataFrames en format JSON
    
    Args:
        tables (List[pd.DataFrame]): Liste des tableaux
        output_format (str): Format de sortie ("records", "dict", "list")
        
    Returns:
        List[Dict]: Données en format JSON
    """
    json_tables = []
    
    for i, table in enumerate(tables):
        # Nettoyer le tableau
        cleaned_table = clean_dataframe(table)
        
        if cleaned_table.empty:
            continue
            
        # Convertir en JSON selon le format demandé
        if output_format == "records":
            table_json = {
                "table_id": i + 1,
                "columns": list(cleaned_table.columns),
                "rows": len(cleaned_table),
                "data": cleaned_table.to_dict('records')
            }
        elif output_format == "dict":
            table_json = {
                "table_id": i + 1,
                "data": cleaned_table.to_dict('dict')
            }
        else:  # list format
            table_json = {
                "table_id": i + 1,
                "columns": list(cleaned_table.columns),
                "data": cleaned_table.values.tolist()
            }
            
        json_tables.append(table_json)
        print(f"✓ Tableau {i+1}: {len(cleaned_table)} lignes, {len(cleaned_table.columns)} colonnes")
    
    return json_tables

def save_json(data: List[Dict], output_path: str, indent: int = 2):
    """
    Sauvegarde les données JSON dans un fichier
    
    Args:
        data: Données à sauvegarder
        output_path (str): Chemin de sortie
        indent (int): Indentation pour le formatage
    """
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=indent)
        print(f"✓ Données sauvegardées dans : {output_path}")
    except Exception as e:
        print(f"✗ Erreur lors de la sauvegarde : {e}")

def main():
    parser = argparse.ArgumentParser(description="Extrait les tableaux d'un PDF vers JSON")
    parser.add_argument("pdf_path", help="Chemin vers le fichier PDF")
    parser.add_argument("-o", "--output", help="Fichier de sortie JSON (optionnel)")
    parser.add_argument("-p", "--pages", default="all", 
                       help="Pages à analyser (ex: 'all', '1,2,3', '1-5')")
    parser.add_argument("-f", "--format", choices=["records", "dict", "list"], 
                       default="records", help="Format de sortie JSON")
    parser.add_argument("--indent", type=int, default=2, 
                       help="Indentation JSON (défaut: 2)")
    
    args = parser.parse_args()
    
    # Vérifier que le fichier PDF existe
    if not os.path.exists(args.pdf_path):
        print(f"✗ Fichier PDF non trouvé : {args.pdf_path}")
        return
    
    print(f"📄 Analyse du PDF : {args.pdf_path}")
    print(f"📊 Pages : {args.pages}")
    print(f"🔧 Format : {args.format}")
    
    # Extraire les tableaux
    tables = extract_tables_from_pdf(args.pdf_path, args.pages)
    
    if not tables:
        print("✗ Aucun tableau trouvé dans le PDF")
        return
    
    # Convertir en JSON
    json_data = dataframes_to_json(tables, args.format)
    
    if not json_data:
        print("✗ Aucune donnée valide à exporter")
        return
    
    # Déterminer le fichier de sortie
    if args.output:
        output_path = args.output
    else:
        pdf_name = Path(args.pdf_path).stem
        output_path = f"{pdf_name}_tables.json"
    
    # Sauvegarder
    save_json(json_data, output_path, args.indent)
    
    print(f"\n📈 Résumé :")
    print(f"   • {len(json_data)} tableau(x) extrait(s)")
    print(f"   • Fichier de sortie : {output_path}")

if __name__ == "__main__":
    # Exemple d'utilisation directe
    if len(os.sys.argv) == 1:
        print("Exemple d'utilisation :")
        print("python extract_pdf_tables.py document.pdf")
        print("python extract_pdf_tables.py document.pdf -o output.json -p '1-3' -f records")
    else:
        main()
