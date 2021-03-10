# TogoSite configuration JSON

## Data Structure

JSON must be an array of objects. Each object corresponds to a `subject` such as `Gene`, and has a list of `properties`. A property object must have attributes to build a visual track to be shown on the top page.

A property object must have four fields, `propertyId`, `label`, `data`, and `primaryKey`.

```
[
  {
    "subject": "Gene",
    "properties": [
      {
        "propertyId": "refex_specific_expression",
        "label": "RefEx specific expression",
        "data": "http://ep6.dbcls.jp/togoid/sparqlist/refex_specific_expression",
        "primaryKey": "ncbigene"
      }    
    ]
  }
]
```

An optional field `viewMethod` specifies the method of visualization (`column` or `histogram`, default: `column`)

```
[
  {
    "subject": "Protein",
    "properties": [
      {
        "property": "uniprot_mass",
        "label": "Molecular mass",
        "data": "http://ep6.dbcls.jp/togoid/sparqlist/api/uniprot_mass",
        "primaryKey": "uniprot",
        "viewMethod": "histogram"
      }
    ]
  }
]
```

Another optional field `figure` can be added to provide an API data to retrieve figures.

```
[
  {
    "subject": "Gene",
    "properties": [
      {
        "propertyId": "refex_specific_expression",
        "label": "RefEx specific expression",
        "data": "http://ep6.dbcls.jp/togoid/sparqlist/refex_specific_expression",
        "primaryKey": "ncbigene",
        "figure": "http://data/"
      }
    ]
  }
]
```
