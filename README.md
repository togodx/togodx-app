# URL parameter
URL に適切な引数を渡すことで、検索条件が指定された状態にすることができる。
引数をデコードすると、下記例のようなパラメータとなる。

## dataset
```
dataset = ensembl_gene
```

## annotation
``` json
[
  {
    "attributeId": "protein_ligands_uniprot",
    "parentNode": "411-1",
    "ancestors": [
      "479"
    ]
  },
  {
    "attributeId": "structure_helical_regions_uniprot"
  }
]
```

## filter
``` json
[
  {
    "attributeId": "gene_evolutionary_conservation_homologene",
    "nodes": [
      {
        "node": "branch_05"
      }
    ]
  },
  {
    "attributeId": "protein_biological_process_uniprot",
    "nodes": [
      {
        "node": "GO_0044260-1",
        "ancestors": [
          "GO_0009987",
          "GO_0044237-1"
        ]
      }
    ]
  }
]
```
