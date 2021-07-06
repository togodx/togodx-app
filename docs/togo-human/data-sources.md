# TogoSite Data sources

## Subject: Gene

### Gene biotype

Biotypes of genes annotated in Ensembl

- Identifier: ensembl_gene
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/Ensembl_gene_type
- Data sources
    - Ensembl human release 102: [http://nov2020.archive.ensembl.org/Homo_sapiens/Info/Index](http://nov2020.archive.ensembl.org/Homo_sapiens/Info/Index)
- Input/Output
    -  Input
        - Ensembl Gene ID
    - Output
        - Gene type
 - Supplementary information
 	- A gene or transcript classification such as "protein coding" and "lincRNA". Definition of gene biotypes is described [here](http://useast.ensembl.org/info/genome/genebuild/biotypes.html).
	- protein coding, lncRNA といった遺伝子/転写産物の分類です。遺伝子の分類の定義については [こちらをご覧ください](http://useast.ensembl.org/info/genome/genebuild/biotypes.html)。

### Chromosome

The chromosome where a gene is located

- Identifier: ensembl_gene
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/gene_chromosome_ensembl
- Data sources
    - Ensembl Human
- Query
    -  Input
        - Ensembl gene ID
    - Output
        - Chromosome number
- Supplementary information
    - The chromosome on which each human gene is located.
    - ヒトの各遺伝子が位置している染色体の番号を示します。

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
- Supplementary information
	- The number of exons for each transcript of each gene.
	- 各遺伝子の転写産物ごとにエクソン数をカウントした結果です。
        
        
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

### Evolutionary divergence

The most distant organisms from human that have orthologous genes in HomoloGene

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
        - UBERON ID or EFO ID or "low_specificity"

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
- Data sources
    - [UniProt](https://www.uniprot.org/)
    - For details about UniProt Keywords, see [UniProt documentation](https://www.uniprot.org/help/keywords).

- Query
    - Input
        - UniProt ID
    - Output
        - UniProt Keyword in the Domain category

### Cellular component

Gene ontology cellular component annotation from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_go_cellular_component
- Data sources
    - [UniProt](https://www.uniprot.org/)
    
- Query
    - Input
        - UniProt ID
    - Output
        - Gene Ontology terms of cellular component domain
        
### Biological process

Gene ontology biological process annotation from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_go_biological_process
- Data sources
    - [UniProt](https://www.uniprot.org/)
    
- Query
    - Input
        - UniProt ID
    - Output
        - Gene Ontology terms of biological process domain

### Molecular function

Gene ontology molecular function annotation from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_go_molecular_function
- Data sources
    - [UniProt](https://www.uniprot.org/)
    
- Query
    - Input
        - UniProt ID
    - Output
        - Gene Ontology terms of molecular function domain

### Ligands

Ligand bindings from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_keywords_ligand
- Data sources
    - [UniProt](https://www.uniprot.org/)
    - For details about UniProt Keywords, see [UniProt documentation](https://www.uniprot.org/help/keywords).

- Query
    - Input
        - UniProt ID
    - Output
        - UniProt Keyword in the Ligand category

### Molecular mass

Molecular mass from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_mass
- Data sources
    - [UniProt](https://www.uniprot.org/)

- Query
    - Input
        - UniProt ID
    - Output
        - Molecular mass (kDa) range

### PTMs

Post-translational modifications from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_keywords_PTM
- Data sources
    - [UniProt](https://www.uniprot.org/)
    - For details about UniProt Keywords, see [UniProt documentation](https://www.uniprot.org/help/keywords).

- Query
    - Input
        - UniProt ID
    - Output
        - UniProt Keyword in the Post-translational modification category

### # of transmembrane domains

The number of transmembrane segments from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_transmembranenumber
- Data sources
    - [UniProt](https://www.uniprot.org/)

- Query
    - Input
        - UniProt ID
    - Output
        - The number of transmembrane site

### # of phosphorylation sites

The number of phosphorylation sites from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_phospho_site
- Data sources
    - [UniProt](https://www.uniprot.org/)

- Query
    - Input
        - UniProt ID
    - Output
        - The number of phosphorylation site

### # of glycosylation sites

The number of glycosylation sites from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_glyco_site
- Data sources
    - [UniProt](https://www.uniprot.org/)

- Query
    - Input
        - UniProt ID
    - Output
        - The number of glycosylation site

### Disease-related proteins

Disease-related proteins from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_keywords_disease
- Data sources
    - [UniProt](https://www.uniprot.org/)
    - For details about UniProt Keywords, see [UniProt documentation](https://www.uniprot.org/help/keywords).

- Query
    - Input
        - UniProt ID
    - Output
        - UniProt Keyword in the Disease category

### Isolation source

Tissues from which the protein was isolated, from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_isolated_tissue
- Data sources
    - [UniProt](https://www.uniprot.org/)

- Query
    - Obtain tissues to which input UniProt entries link with <https://www.uniprot.org/core/isolatedFrom>.
    - Input UniProt entries contain a reference describing the protein sequence obtained from a clone isolated from output tissues.
    - Input
        - UniProt ID
    - Output
        - Tissue
            - [UniProt Controlled vocabulary of tissues](https://www.uniprot.org/docs/tisslist)

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
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/structure_number_of_alpha_helices_pdb
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
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/structure_number_of_beta_sheets_pdb
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
- Data sources
    - Reactome-classified pathways for each protein
    - This item based on the data of Reactome Version 71 (02, December 2019).
       - The latest data can be obtained from the URL below. https://reactome.org/download-data
- Query
    - Input
        - Reactome ID, Uniprot ID
    - Output
        - The number of Uniprot entries included in each pathway in Reactome
        - If a Uniprot id is entered, it returns the pathway to which the protein belongs

### Compounds in pathway

The number of chemical compounds in each pathway from Reactome

- Identifier: chebi
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/chebi_reactome
- Data sources
    - Reactome-classified pathways for each chemical compound
    - This item based on the data of  Reactome Version 71 (02, December 2019).
        - The latest data can be obtained from the URL below. https://reactome.org/download-data
- Query
    - Input
        - Reactome ID , ChEBI ID
    - Output
        - The number of ChEBI entries included in each pathways in Reactome
        - If a ChEBI id is entered, it returns the pathway to which the chemical compound belongs



### # of interacting proteins

The number of interacting proteins from UniProt

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_interact
- Data sources
    - The number of interacting proteins from UniProt
    - This item based on the data of March, 2021 of UniProt (human only).
- Query
    - Input
        - UniProt ID, Number of interacting human proteins
    - Output
        - The number of interacting human proteins from UniProt
        - If a UniProt ID is entered, it returns the number of interacting proteins

### ChEMBL assay existence

Proteins with or without ChEMBL assay from Uniprot

- Identifier: uniprot
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/uniprot_chembl_assay_existence
 
- Data sources
    - Proteins with or without ChEMBL assay from UniProt
    - ChEMBL-RDF 28.0: http://ftp.ebi.ac.uk/pub/databases/chembl/ChEMBL-RDF/
- Query
    - Input
        - Existence (1: exists, 0: not exists), UniProt ID
    - Output
        - The number of UniProt entries link to ChEMBL entries.
        - If a UniProt ID is entered, it returns whether ChEMBL entry exists or not.



## Subject: Chemical compound

### Substance type

Substance types in ChEMBL

- Identifier: chembl_compound
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/chembl_substancetype
- Data sources
    - (More data sources description goes here..)
    - ChEMBL-RDF 28.0: http://ftp.ebi.ac.uk/pub/databases/chembl/ChEMBL-RDF/
- Query
    - (More query details go here..)
    -  Input
        - ChEMBL ID
    - Output
        - Substance type

### Chemical role

Chemical roles in ChEBI

- Identifier: chebi_compound
- SPARQList endpoint: http://integbio.jp/togosite/sparqlist/api/compound_chemical_role_chebi
- Data sources
    -  [Chemical Entities of Biological Interest (ChEBI) ](https://www.ebi.ac.uk/chebi/) 
- Query
    - Input
        - ChEBI id (number)
    - Output
        -  [Chemical Role (CHEBI:51086)](https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:51086) and its subcategories of Mondo

### Application type

Application types in ChEBI

- Identifier: chebi_compound
- SPARQList endpoint: http://integbio.jp/togosite/sparqlist/api/compound_application_type_chebi
- Data sources
    -  [Chemical Entities of Biological Interest (ChEBI) ](https://www.ebi.ac.uk/chebi/) 
- Query
    - Input
        - ChEBI id (number)
    - Output
        -  [Application (CHEBI:33232)](https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:33232) and its subcategories of Mondo

### Action type

Mechanism action types in ChEMBL

- Identifier: chembl_compound
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/chembl_mechanism_action_type
- Data sources
    - (More data sources description goes here..)
    - ChEMBL-RDF 28.0: http://ftp.ebi.ac.uk/pub/databases/chembl/ChEMBL-RDF/
- Query
    - (More query details go here..)
    -  Input
        - ChEMBL ID
    - Output
        - Mechanism action type

### Biological role

Biological roles in ChEBI

- Identifier: chebi_compound
- SPARQList endpoint: http://integbio.jp/togosite/sparqlist/api/compound_biological_role_chebi
- Data sources
    -  [Chemical Entities of Biological Interest (ChEBI) ](https://www.ebi.ac.uk/chebi/) 
- Query
    - Input
        - ChEBI id (number)
    - Output
        -  [Biological Role (CHEBI:24432)](https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:24432) and its subcategories of Mondo

### Drug indication

Number of drugs with indications (disease or symptom) categorized in MeSH hierarchy

- Identifier: chembl_compound
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/chembl_mesh
- Data sources
    - (More data sources description goes here..)
    - ChEMBL-RDF 28.0: http://ftp.ebi.ac.uk/pub/databases/chembl/ChEMBL-RDF/
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
    - ChEMBL-RDF 28.0: http://ftp.ebi.ac.uk/pub/databases/chembl/ChEMBL-RDF/
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
- Data sources
	- PubChem-RDF: ftp://ftp.ncbi.nlm.nih.gov/pubchem/RDF/ （Version 2021-03-01 ） 
        - Data for nodes linked to ChEMBL or ChEBI retrieved from https://integbio.jp/rdf/dataset/pubchem

- Query
	- Input
  		- PubChem Compound ID 
	- Output
    	- WHO ATC code (https://www.whocc.no/atc_ddd_index/)

### ChEMBL ATC classification

Anatomical Therapeutic Chemical (ATC) Classification in ChEMBL

- Identifier: chembl_compound
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/atcClassificationChEMBL
- Data sources
    - (More data sources description goes here..)
    - ATC: https://bioportal.bioontology.org/ontologies/ATC
    - ChEMBL-RDF 28.0: http://ftp.ebi.ac.uk/pub/databases/chembl/ChEMBL-RDF/
- Query
    - (More query details go here..)
    -  Input
        - ChEMBL ID
    - Output
        - ATC category ID
        - ATC category label

## Subject: Disease

### Diseases in Mondo

Disease or disorder categories in the Mondo Disease Ontology (Mondo)

- Identifier: mondo
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/disease_mondo_filter
- Data sources
    -  [Mondo Disease Ontology (Mondo) ](https://mondo.monarchinitiative.org/) 
- Query
    - Input
        - Mondo id
    - Output
        -  [Disease and disorder (MONDO_0000001)](https://monarchinitiative.org/disease/MONDO:0000001) and its subcategories of Mondo

### Diseases in MeSH

Disease categories in Medical Subject Headings (MeSH)

- Identifier: mesh
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/disease_mesh_filter
- Data sources
    -  [Medical Subject Headings (MeSH)](https://www.nlm.nih.gov/mesh/meshhome.html) 
- Query
    - Input
        - MeSH Descriptor
    - Output
        -  [Diseases ([C])](https://meshb.nlm.nih.gov/treeView) and its subcategories of MeSH

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
- Data sources
    - (More data sources description goes here..)
    - Mondo disease ontlogy: https://mondo.monarchinitiative.org/
- Query
    - 各MondoIDに紐づいている、関連のデータベースについて、その種類と関連するIDの数を集計
    -  Input
        - MONDO id
    - Output
        - Related Databases category
  
### Phenotypic abnormality

Phenotypic abnormality categories of the Human Phenotype Ontology (HPO)

- Identifier: hp
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/disease_hpo_filter
- Data sources
    -  [Human Phenotype Ontology (HPO)](https://hpo.jax.org/app/) 
- Query
    - Input
        - HPO id
    - Output
        -  [Phenotypic abnormality (HP:0000118)](https://hpo.jax.org/app/browse/term/HP:0000118)  and its subcategories of HPO

## Subject: Variant

### Consequence

Variant consequence from TogoVar

- Identifier: togovar
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/variant_consequence
- Data sources
    -  [TogoVar](https://togovar.biosciencedbc.jp/?) (limited to variants with frequency data in Japanese populations)
- Query
    -  Input
        - TogoVar id
    - Output
        -  [Variant consequence calculated with Variant Effect Predictor (VEP)](https://asia.ensembl.org/info/genome/variation/prediction/predicted_data.html#consequences) in terms of [Sequence ontology](http://www.sequenceontology.org/)

### Clinical significance

Variant clinical significance from TogoVar

- Identifier: togovar
- SPARQList endpoint: https://integbio.jp/togosite/sparqlist/api/variant_clinical_significance
- Data sources
    -  [TogoVar](https://togovar.biosciencedbc.jp/?) (limited to variants with frequency data in Japanese populations)
- Query
    - Input
        - TogoVar id
    - Output
        -   [Clinical significance of ClinVar](https://www.ncbi.nlm.nih.gov/clinvar/docs/clinsig/)

