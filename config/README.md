# Togoサイトのフロントが期待するAPIの整理

## 各SPARQList（AttributeのAPI）の仕様

* トップページのバーを表示するために必要なもの
  * カテゴリIDの指定がないとき → トップレベルのオブジェクトリストを返す（→ APIサーバがカウントして返す）
    * 正確にはproperty pathsで下位階層の全オブジェクトがここで返ってきている！！
  * カテゴリIDの指定があるとき → 下位階層のオブジェクトリストを返す（→同上）
    * ※カテゴリIDは１つしか受け取らない
* Add filter
  * （APIサーバが処理してくれるはず）
* Map attributes
  * （APIサーバが処理してくれるはず）

⇒ categoryIds → category, queryIds → 廃止, mode → 廃止

## キャッシュサーバの仕様

### 内訳を取得 (category ID を 0 か 1 つ受け取る)

https://togodx.dbcls.jp/api/get_counts?attribute=gene_biotype_ensembl(&category=ID)
→ attributes.jsonを見てhttps://integbio.jp/togosite/sparqlist/api/gene_biotype_ensemblなどを呼び出す

* キャッシュがあるか確認する
* 各APIを呼び出してオブジェクトリストを受け取ってキャッシュする（下位階層の全オブジェクトが返ってきている）
* オブジェクトリストのカウントを集計してフロントに返す

```
  {
    "id": "ENSG00000181092",
    "attribute": {
      "categoryId": "UBERON_0001013",
      "uri": "http://purl.obolibrary.org/obo/UBERON_0001013",
      "label": "Adipose tissue"
    }
  },
```

⇒ この時点で
* トップ階層で全データの入った attribute, id, category, uri, label の表を作れる（カテゴリのuri, labelは別表にするかどうか）
* サブカテゴリについても同じ構造で、categoryカラムのIDで絞り込みができる

### Map your IDs (queryIdsを1つ以上受け取る)

現状フロントからは `data_from_user_ids` のSPARQLetを呼んでいる

1. 全てのバー（トップ階層）にマップする

各attributeに対して下記の呼び出しを行う（property pathsで下位階層へのマップ数も全て拾っている）

https://togodx.dbcls.jp/api/get_counts?attribute=gene_biotype_ensembl&queries=ID1,ID2
→ 特に外部APIは呼び出さずキャッシュサーバ内で解決できる

⇒ 上記のトップ階層の表からquery IDでgrepするだけでOKそう（トップ階層のcategory IDがどれかというのは知っておく必要がある）

2. マップされたIDがサブ階層のどこに該当しているかを調べる

クリックされたカテゴリIDと、マップするIDを渡す

https://togodx.dbcls.jp/api/get_counts?attribute=gene_biotype_ensembl&queries=ID1,ID2&cateogory=ID
→ 該当カテゴリIDのキャッシュがあれば利用、無ければ呼び出し

⇒ サブ階層の表からquery IDでgrepするだけ

3. マップ数やp-valueを計算して返す

* 変換済みのIDを受け取って map_ids_to_attribute SPARQLetがやっていることを再現（query IDの入っているオブジェクトを検索して、そのオブジェクトのカテゴリも取得し、カテゴリのカウントおよび総数を取得、p-valueを計算）
  * カテゴリID
  * ラベル
  * カウント数(カテゴリ内の総数)
  * ヒット数
  *  p-value (トータル数を使ってp-valueを計算する)
    * 各APIが総数を返さないケースへの対応 (w/o アノテーションのID数が不明)

⇒ 課題として、p-valueの計算速度を向上したい & トータル数を返すAPIもしくはJSONをどこに置くか

### View results でテーブルを生成

* 各 attribute 毎に下記を取得、集計して表を作る
  * キャッシュからqueryIdに対応するオブジェクトのリストを返す

1. Add filter

* カテゴリの場合（booleanも含む）
  * attributeと選択されたcategory IDsが渡される
* 連続値の場合
  * attributeと値の範囲が渡される
* primary key (Select target) も知っておく必要がある

⇒ 表から
* keyが一致する場合、表から該当するIDのセットをattributeごとに取得できる
* keyが一致しない場合、primary keyからIDを変換して、表から該当するIDのセットを取得する

2. Map attributes

* カテゴリの場合
  * 選ばれた階層でカテゴリを表にする、棒グラフはカテゴリごとに内訳を集計する
* 連続値の場合
  * 実際の値を表にする、棒グラフはビンに整理する？

⇒ Add filterで絞り込まれたkeyが各カテゴリのトータル中に何個該当するかを計算する必要がある


### キャッシュをクリア

* attributeを指定してクリアするオプション

## TODO

* キャッシュサーバの要求仕様はだいぶ見えてきた
* これをうけてattributes.jsonとAPIのパラメータ＆返すJSONの仕様を最終確認する
* まあでもキャッシュサーバのプロトタイピングをしながらリファインしていくのがいいかな

## その他

* Select target で選んだ key から conversion で変換できない attribute はグレーアウトしたい


---

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
        "propertyId": "uniprot_mass",
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
