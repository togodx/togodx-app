# TogoSite configuration JSON

## Data Structure

JSON must be an array of objects. An object must have parameters for a track to be shown on top page.

An element of the parent array must have four fields, `trackId`, `subject`, `label`, `data`, and `primaryKey`.

```
{
  "propertyId": "refex_specific_expression",
  "subject": "Gene",
  "label": "RefEx specific expression",
  "data": "http://ep6.dbcls.jp/togoid/sparqlist/refex_specific_expression",
  "primaryKey": "ncbigene",
}
```

An optional field `figure` can be added to provide an API data to retrieve figures.

```
{
  "propertyId": "refex_specific_expression",
  "subject": "Gene",
  "label": "RefEx specific expression",
  "data": "http://ep6.dbcls.jp/togoid/sparqlist/refex_specific_expression",
  "primaryKey": "ncbigene",
  "figure": "http://data/",
}
```
