# TogoSite Data sources

## Subject: Gene

### Gene biotype

Biotypes of genes annotated in Ensembl

- Identifier: ensembl_gene
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/Ensembl_gene_type
- Data sources
    - Ensembl human release 102: [http://nov2020.archive.ensembl.org/Homo_sapiens/Info/Index](http://nov2020.archive.ensembl.org/Homo_sapiens/Info/Index)
    - Definition of gene biotypes is described [here](http://useast.ensembl.org/info/genome/genebuild/biotypes.html).
- Query
    - (More query details go here..)
    -  Input
        - Ensembl Gene ID
    - Output
        - Gene type

### # of exons

The number of exons

- Identifier: ensembl_transcript
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/Ensembl-exon-count
- Data sources
    - Ensembl human release 102: http://nov2020.archive.ensembl.org/Homo_sapiens/Info/Index
- Query
    -  Input
        - Ensembl Transcription ID -> queryIds
        - "(Number of exons)" or range ("(Min number of exons)-(Max number of exons)") -> categoryIds
    - Output
        - Output1("mode": none): List of number of exons for each category
        - Output2("mode": idList): List of Ensembl Transcription ID
        - Output3("mode": objectList): List of Ensembl Transcription ID and attribute of category
        
### # of paralogs

The number of paralogs calculated based on HomoloGene

- Identifier: ncbigene
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/homologene_human_paralog_count
* Data sources
  * HomoloGene Release 68
    * https://www.ncbi.nlm.nih.gov/homologene/statistics/

* Query
  * Input
    * NCBI Gene ID
  * Output
    * Number of paralogs

### Evolutionary conservation

Evolutionary conservation of genes

- Identifier: ncbigene
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/homologene_category
* Data sources
  * HomoloGene Release 68: https://www.ncbi.nlm.nih.gov/homologene/statistics/

* Query
  * Input
    * NCBI Gene ID
  * Output
    * Organisms

### High-level expression

Highly expressed genes in organs from RefEx

- Identifier: ncbigene
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/refex_specific_high_expression
- Data sources
    - [Calculations for tissue specificity of genechip human GSE7307](https://doi.org/10.6084/m9.figshare.4028700.v3) from [RefEx \(Reference Expression dataset\)](https://refex.dbcls.jp/)
      - Tissue specificity matrix were constructed consisting of 1 for over-expressed outliers, -1 for under-expressed outliers, and 0 for non-outliers that corresponds to the original gene expression matrix by applying the ROKU method [(Kadota et al., BMC Bioinformatics, 2006, 7:294)](https://doi.org/10.1186/1471-2105-7-294).
        - See details: [http://bioconductor.org/packages/release/bioc/manuals/TCC/man/TCC.pdf](http://bioconductor.org/packages/release/bioc/manuals/TCC/man/TCC.pdf) (page 22-24)    
    - Tissue-specific highly expressed genes were those flagged as "1" as over-expressed outliers only in a single organ.
- Query
    - Input
        - NCBI Gene ID
    - Output
        - [RefEx tissue name classification table of 40 organs](https://doi.org/10.6084/m9.figshare.4028718.v5)

### Low-level expression

Low expressed genes in organs from RefEx

- Identifier: ncbigene
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/refex_specific_low_expression
- Data sources
    - [Calculations for tissue specificity of genechip human GSE7307](https://doi.org/10.6084/m9.figshare.4028700.v3) from [RefEx \(Reference Expression dataset\)](https://refex.dbcls.jp/)
      - Tissue specificity matrix were constructed consisting of 1 for over-expressed outliers, -1 for under-expressed outliers, and 0 for non-outliers that corresponds to the original gene expression matrix by applying the ROKU method [(Kadota et al., BMC Bioinformatics, 2006, 7:294)](https://doi.org/10.1186/1471-2105-7-294).
        - See details: [http://bioconductor.org/packages/release/bioc/manuals/TCC/man/TCC.pdf](http://bioconductor.org/packages/release/bioc/manuals/TCC/man/TCC.pdf) (page 22-24)    
    - Tissue-specific low-expression genes were those flagged as "-1" as under-expressed outliers only in a single organ.
- Query
    - Input
        - NCBI Gene ID
    - Output
        - [RefEx tissue name classification table of 40 organs](https://doi.org/10.6084/m9.figshare.4028718.v5)
### Expressed in tissues

Genes expressed in tissues from GTEx

- Identifier: ensembl_gene
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/gtex6_tissues
- Data sources
    - Supplementary Table 1 of [A systematic survey of human tissue-specific gene expression and splicing reveals new opportunities for therapeutic target identification and evaluation; R. Y. Yang et al.; bioRxiv 311563](https://doi.org/10.1101/311563)
    - Mapping from the tissue names to the corresponding UBERON or EFO term is based on [GTEx documentation](https://gtexportal.org/home/samplingSitePage).
- Query
    - Input
        - Ensembl gene ID
    - Output
        - UBERON ID or EFO ID

### Transcription factors

Genes with hypothetical upstream TFs in ChIP-Atlas

- Identifier: ensembl_gene
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/chip_atlas
- Data sources
    - ChIP-Atlas: [http://dbarchive.biosciencedbc.jp/kyushu-u/hg38/target/](http://dbarchive.biosciencedbc.jp/kyushu-u/hg38/target/)
    - The genes in `<Transcription Factor>.10.tsv` were defined to be "Genes with hypothetical upstream TF".

- Query
    - The output ID 1 and 2 are assigned to "Genes with hypothetical upstream TF" and Genes without hypothetical upstream TF" respectively.
    - Input
        - Ensembl gene ID
    - Output
        - with or without hypothetical upstream TF

## Subject: Protein

### Protein domains

Protein domains from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_keywords_domain
- No description

### Cellular component

Gene ontology cellular component annotation from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_keywords_cellular_component
- No description

### Biological process

Gene ontology biological process annotation from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_keywords_biological_process
- No description

### Molecular function

Gene ontology molecular function annotation from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_keywords_molecular_function
- No description

### Ligands

Ligand bindings from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_keywords_ligand
- No description

### Molecular mass

Molecular mass from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_mass
- No description

### PTMs

Post-translational modifications from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_keywords_PTM
- No description

### # of transmembrane domains

The number of transmembrane segments from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_transmembranenumber
- No description

### # of phosphorylation sites

The number of phosphorylation sites from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_phospho_site
- No description

### # of glycosylation sites

The number of glycosylation sites from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_glyco_site
- No description

### Disease-related proteins

Disease-related proteins from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_keywords_disease
- No description

### Isolation source

Tissues from which the protein was isolated, from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_isolated_tissue
- No description

### Evidence of existence

Protein existence obtained from neXtProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/nextprot_protein_existence
- No description

## Subject: Protein structure

### Structure data existence

Uniprot entries with links to PDB data entries

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_pdb_existence
 
- Data sources
    - Uniprot entries with links to PDB data entries
    - This item based on the data of March, 2021 of uniprot (human only).
- Query
    - Input
        - Existence (1: exists, 0 :not exists), uniprot id
    - Output
        - Uniprot entries are sorted by the presence or absence of a link to pdb.
        - If a uniprot id is entered, it returns whether pdb entry exists or not.



### # of alpha-helices

The number of alpha-helices in a PDB entry

- Identifier: pdb
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/pdb_alphahelix_bin
- Data sources
    - The number of alpha-helices recorded in the PDB entry.
    - This item based on the data of January 20, 2021 of PDBj. 
        - The latest data can be obtained from the URL below. https://data.pdbj.org/pdbjplus/data/pdb/rdf/
- Query
    - Input
        - Number of alpha-helices, PDB id
    - Output
        - The number of PDB entries included in each alpha-helix number
        - If a PDB id is entered, it returns the alpha-helix value contained in each entry.

### # of beta-sheets

The number of beta-sheets in a PDB entry

- Identifier: pdb
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/pdb_betasheet_bin
- Data sources
    - The number of beta-sheets recorded in the PDB entry.
    - This item based on the data of January 20, 2021 of PDBj. 
        - The latest data can be obtained from the URL below. https://data.pdbj.org/pdbjplus/data/pdb/rdf/
- Query
    - Input
        - Number of beta-sheets, PDB id
    - Output
        - The number of PDB entries included in each beta-sheets number
        - If a PDB id is entered, it returns the beta-sheets value contained in each entry.

### # of peptides in a PDB entry

The number of peptides in a PDB entry

- Identifier: pdb
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/pdb_polypeptide_mode
 
- Data sources
    - Number of peptides contained in one PDB entry
    - This item based on the data of January 20, 2021 of PDBj. 
        - The latest data can be obtained from the URL below. https://data.pdbj.org/pdbjplus/data/pdb/rdf/
- Query
    - Input
        - Number of peptides, PDB id
    - Output
        - The number of PDB entries included in each peptide number
        - If a PDB id is entered, it returns the number of peptides in each PDB entry.

### Other related molecules

Nonpeptide molecules related protein structures in PDB

- Identifier: pdb
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/pdb_nonpeptide
 
- Data sources
    - Non-peptide molecules contained in the 3D structure in the PDB entry
    - This item based on the data of January 20, 2021 of PDBj. 
        - The latest data can be obtained from the URL below. https://data.pdbj.org/pdbjplus/data/pdb/rdf/
- Query
    - Input
        - Non-peptide molecules, PDB id
    - Output
        - The number of PDB entries included in each non-peptide molecule
        - If a PDB id is entered, it returns the non-peptide molecule in each PDB entry.

### Analysis methods

Structure determination methods in PDB

- Identifier: pdb
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/pdb_experimental_methods_mode
 
- Data sources
    - Experimental methods used for 3D structure acquisition in the PDB entry.
    - This item based on the data of January 20, 2021 of PDBj. 
        - The latest data can be obtained from the URL below. https://data.pdbj.org/pdbjplus/data/pdb/rdf/
- Query
    - Input
        - Experimental methods, PDB id
    - Output
        - The number of PDB entries included in each experimental method
        - If a PDB id is entered, it returns the experimental method in each entry.

### Crystallization temperature

Temperature of the crystallization solution in PDB

- Identifier: pdb
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/pdb-temperature
 
- Data sources
    - The temperature of crystal formation in the PDB entry
    - This item based on the data of January 20, 2021 of PDBj. 
        - The latest data can be obtained from the URL below. https://data.pdbj.org/pdbjplus/data/pdb/rdf/
- Query
    - Input
        - temperature (K), PDB id
    - Output
        - The number of PDB entries included in the temperature range
        - If a PDB id is entered, it returns the temperature of crystal formation in each PDB entry.


### Crystallization pH

pH value of the crystallization solution in PDB

- Identifier: pdb
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/pdb_pH
 
- Data sources
    - The pH of crystal formation in the PDB entry
    - This item based on the data of January 20, 2021 of PDBj. 
        - The latest data can be obtained from the URL below. https://data.pdbj.org/pdbjplus/data/pdb/rdf/
- Query
    - Input
        - pH, PDB id
    - Output
        - The number of PDB entries included in the pH range
        - If a PDB id is entered, it returns the pH of crystal formation in each PDB entry.

## Subject: Interaction

### Proteins in pathway

The number of proteins in each pathway from Reactome

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_reactome
- No description

### Compounds in pathway

The number of chemical compounds in each pathway from Reactome

- Identifier: chebi
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/chebi_reactome
- No description

### # of interacting proteins

The number of interacting proteins from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_interact
- No description

### ChEMBL assay existence

Proteins with or without ChEMBL assay from Uniprot

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_chembl_assay_existence
- No description

## Subject: Chemical compound

### Action type

Mechanism action types in ChEMBL

- Identifier: chembl_compound
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/chembl_mechanism_action_type
- Data sources
    - (More data sources description goes here..)
    - ChEMBL-RDF: http://ftp.ebi.ac.uk/pub/databases/chembl/ChEMBL-RDF/28.0/
- Query
    - (More query details go here..)
    -  Input
        - ChEMBL ID
    - Output
        - Mechanism action type

### Substance type

Substance types in ChEMBL

- Identifier: chembl_compound
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/chembl_substancetype
- Data sources
    - (More data sources description goes here..)
    - ChEMBL-RDF: http://ftp.ebi.ac.uk/pub/databases/chembl/ChEMBL-RDF/28.0/
- Query
    - (More query details go here..)
    -  Input
        - ChEMBL ID
    - Output
        - Substance type

### Drug indication (MeSH)

Drug indications in MeSH categories

- Identifier: chembl_compound
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/chembl_mesh
- Data sources
    - (More data sources description goes here..)
    - ChEMBL-RDF: http://ftp.ebi.ac.uk/pub/databases/chembl/ChEMBL-RDF/28.0/
    - Mesh 2021: ftp://ftp.nlm.nih.gov/online/mesh/rdf/
- Query
    - (More query details go here..)
    -  Input
        - ChEMBL ID
        - Mesh Tree Number
    - Output
        - Mesh term for ChEMBL drug indication

### Drug development phase

Drug development phase in ChEMBL

- Identifier: chembl_compound
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/chembl_development_phase
- Data sources
    - (More data sources description goes here..)
    - ChEMBL-RDF: http://ftp.ebi.ac.uk/pub/databases/chembl/ChEMBL-RDF/28.0/
- Query
    - (More query details go here..)
    -  Input
        - ChEMBL ID
    - Output
        - Highest development phase

### PubChem ATC classification

Anatomical Therapeutic Chemical (ATC) Classification in PubChem

- Identifier: pubchem_compound
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/atc_classification_haschild
Description 
* Data sources
	* PubChem-RDF: ftp://ftp.ncbi.nlm.nih.gov/pubchem/RDF/ （Version 2021-03-01 ） 
      * Data for nodes linked to ChEMBL or ChEBI retrieved from https://integbio.jp/rdf/dataset/pubchem

* Query
	* Input
  		* PubChem Compound ID 
	* Output
    	* WHO ATC code

### ChEMBL ATC classification

Anatomical Therapeutic Chemical (ATC) Classification in ChEMBL

- Identifier: chembl_compound
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/atcClassificationChEMBL
- Data sources
    - (More data sources description goes here..)
    - ATC: https://bioportal.bioontology.org/ontologies/ATC
    - ChEMBL-RDF: http://ftp.ebi.ac.uk/pub/databases/chembl/ChEMBL-RDF/28.0/
- Query
    - (More query details go here..)
    -  Input
        - ATC category ID
    - Output
        - ChEMBL ID
        - ATC category label

## Subject: Disease

### Diseases in Mondo

Disease or disorder categories in the Mondo Disease Ontology (Mondo)

- Identifier: mondo
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/disease_mondo_filter
- No description

### Diseases in MeSH

Disease categories in Medical Subject Headings (MeSH)

- Identifier: mesh
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/disease_mesh_filter
- No description

### Diseases in NANDO

Japanese intractable disease categories in the Nanbyo Disease Ontology (NANDO)

- Identifier: nando
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/nando
- Data sources
    - NANDOは日本国内の認定された希少性難病疾患をまとめた語彙集で、厚労省認定の難病疾患と、小児慢性疾患の二つに大きくカテゴライズされている。
    - Nanbyo Disease Ontology ver0.4.3: http://nanbyodata.jp/ontology/nando
- Query
    -  NANDOの階層を辿るクエリー。
    -  Input
        - NANDO id
    - Output
        - NANDO category

### Related DBs in Mondo

The number of entries in disease related database in Mondo

- Identifier: mondo
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/Disease-relatedDB
- No description

### Phenotypic abnormality

Phenotypic abnormality categories of the Human Phenotype Ontology (HPO)

- Identifier: hp
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/disease_hpo_filter
- No description

## Subject: Variant

### Consequence

Variant consequence from TogoVar

- Identifier: togovar
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/variant_consequence
- Data sources
    -  [TogoVar](https://togovar.biosciencedbc.jp/?) (limited to variants with frequency data in Japanese populations)
- Query
    -  Input
        - SO (sequence ontology) ID that indicates [a variant consequence calculated with Variant Effect Predictor (VEP)](https://asia.ensembl.org/info/genome/variation/prediction/predicted_data.html#consequences)
        - TogoVar id
    - Output
        - The number of variants categorized by the variant consequence.

- author:
  - 三橋(守屋さんのSPARQListを改造)


### Clinical significance

Variant clinical significance from TogoVar

- Identifier: togovar
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/variant_clinical_significance
- Data sources
    -  [TogoVar](https://togovar.biosciencedbc.jp/?) (limited to variants with frequency data in Japanese populations)
- Query
    - Input
        -  [Clinical significance of ClinVar](https://www.ncbi.nlm.nih.gov/clinvar/docs/clinsig/)
        - TogoVar id
    - Output
        -  The number of variants categorized by clinical significance of ClinVar
