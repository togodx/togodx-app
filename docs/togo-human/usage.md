#  How to use TogoDX/Human
## Table of Contents
- [Explorer画面 (トップページ)](#explorer%E7%94%BB%E9%9D%A2-%E3%83%88%E3%83%83%E3%83%97%E3%83%9A%E3%83%BC%E3%82%B8)
    - [Attribute keys](#attribute-keys)   
- [Explorer画面における操作方法](#explorer%E7%94%BB%E9%9D%A2%E3%81%AB%E3%81%8A%E3%81%91%E3%82%8B%E6%93%8D%E4%BD%9C%E6%96%B9%E6%B3%95)
    - [Add filterを利用した探索方法(AND検索)](#add-filter%E3%82%92%E5%88%A9%E7%94%A8%E3%81%97%E3%81%9F%E6%8E%A2%E7%B4%A2%E6%96%B9%E6%B3%95and%E6%A4%9C%E7%B4%A2)
    - [Map attributesを利用した探索方法(OR検索)](#map-attributes%E3%82%92%E5%88%A9%E7%94%A8%E3%81%97%E3%81%9F%E6%8E%A2%E7%B4%A2%E6%96%B9%E6%B3%95or%E6%A4%9C%E7%B4%A2)
    - [Add filtersとMap Attributesの両方を利用した探索方法(AND・OR検索)](#add-filters%E3%81%A8map-attributes%E3%81%AE%E4%B8%A1%E6%96%B9%E3%82%92%E5%88%A9%E7%94%A8%E3%81%97%E3%81%9F%E6%8E%A2%E7%B4%A2%E6%96%B9%E6%B3%95andor%E6%A4%9C%E7%B4%A2)
    - [Map your IDsを用いてデータを俯瞰する](#map-your-ids%E3%82%92%E7%94%A8%E3%81%84%E3%81%A6%E3%83%87%E3%83%BC%E3%82%BF%E3%82%92%E4%BF%AF%E7%9E%B0%E3%81%99%E3%82%8B)
- [Results画面](#results%E7%94%BB%E9%9D%A2)

---
## Explorer画面 (トップページ)
![Explore](https://github.com/dbcls/togosite/raw/develop/docs/togo-human/img/20210825_togodx_beta_toppage.png)
### 画面内の用語と機能
- `Attribute keys`
    - 各データベースのRDFデータを用いて作成した様々な切り口の属性情報の名称。
    - すべての`Attribute keys`の詳細データ（下記、[`Attribute keys`](#Attribute-keys)の説明を参照）と含まれる`values`のリストやグラフを展開したり、閉じたりできます。
    - 1つの`Attribute keys`の詳細データと`values`のリストやグラフを展開したり、閉じたりできます。
- `Attribute values`
    - 各データベースのRDFデータを用いて作成した様々な切り口の属性情報の項目名とその値、分類の内訳。
- `Condition builder`
    - データを探索する条件を指定する。 
    - `Add filters`、 `Map attributes`で選択されている条件が一度にクリアーされます。
- `Select target category`
    - データ探索の起点となるデータベースを指定する場所。
- `Map your IDs`
    - ユーザーの手元にあるIDリストを各`Attribute keys`にマッピングしたい場合に、IDを入力するフィールド。
    - `Select target category`でデータベースを選択すると、入力例がグレーで表示されます。
    - 入力できるIDは〇〇、〇〇（ここに列挙）、入力できるID数の上限はXXXです。
   
- `Add filters`
    - 各Attribute valueをフィルターとして利用するための機能。複数のフィルターを追加した場合は、それぞれの条件をいずれも満たすものを絞り込むことができます(AND検索)。 
    - `Add filters`をクリック（初期画面ではクリックされた状態）し、各`Attribute values`の表示をクリックする、あるいは詳細データを展開してチェックボックスをクリックすることで、探索条件に加えることができます。
- `Map attributes`
    - `Select target category`で選択したデータベースに紐づく、各`Attibute key`に含まれる全ての`Values`を表示します。複数指定した場合は、少なくともいずれか一つを満たすものを全て表示します(OR検索)。
    - `Map attributes`をクリックし、各`Attribute keys`に表示されるチェックボックス＜図示？＞にチェックを入れることで、その`Attribute keys`全体の`values`を一括で探索条件に加えることができます。
- `View results`
    - 指定した探索条件を満たす[Results画面](#Results%E7%94%BB%E9%9D%A2)を表示します。
    - `Add filters`, `Map attributes`で選択されている条件で、探索が行われ、該当するIDの一覧が取得できます。探索の途中経過や完了した探索結果は`Saved Conditions`としてリストされます。
- `Saved condition`
    - 一度実行した探索条件のこと。探索結果が取得途中の場合も、ここに状況が表示されます。 
- `Log scale`
    - 各`Attribute keys`の値や分類の内訳を対数表示に切り替え、広い範囲の値を比較しやすくできます。

- `About`
    - TogoDX/Humanについての概要へのリンク
- `Help`
    - How to use。TogoDX/Humanの用語説明や機能説明へのリンク
- `Example`
    - 具体的な事例をもとにTogoDX/Humanの使い方の解説へのリンク
- `Contact`
    - 何書くんだっけ？
        - 個々のAttribute Valueを追加したいとかの要望受付フォーム的な何かを入れるという話だったような気がしないでもない

- その他
    - 起動時あるいは再読み込み時には、画面が全て初期設定に戻ります。
    - 上部にあるロゴをクリックすることでも、初期設定に戻ります。


### Attribute keys
![Explore](https://github.com/dbcls/togosite/raw/develop/docs/togo-human/img/20210825_togodx_devpro_attribute.png)
#### 用語説明
- `Description`
    - `Attribute keys`で表示される属性情報の値や分類の内訳に関する説明
- `API`
    - `Attribute keys`で表示される属性情報を取得するためのSPARQList(SPARQLクエリの結果をクライアントに返す REST API を提供するためのミドルウェア)のURL
- `Original data`
    - `Attribute keys`の表示に用いられるRDFデータの提供元や出典情報
- `Version`
    - `Attribute keys`の表示に用いられるRDFデータのバージョン情報
- `Last updated`
    - `Attribute keys`の表示に用いられるRDFデータの更新年月日
- `Values`
    - `Attribute keys`で表示される属性情報の項目名
- `Total`
    - `Attribute keys`で表示される属性情報の値や分類の内訳数
#### 機能説明
- `Attribute keys` は、遺伝子、タンパク質、化合物、疾患などのカテゴリーに分かれており、それぞれの値や分類（`Values`と呼びます）を`Add filters`として利用することができます。
- `Attribute keys` の左側にある`>`をクリックすると、詳細データが表示されます。`Attribute keys`がどのような意図で表示されているかについての説明や出典となるデータに関する情報を参照できます。また、`Values`がリスト形式あるいはヒストグラムで表示されます。
- `Values`のリストの右端に`▶`が表示されている場合は、その`Values`が階層構造になっていることを示します。
- 左端のチェックボックスをクリックすると、その`Values`が`Add filters`に追加されます。
- 数値の`Values`については2段のヒストグラムで表示されます。上段のヒストグラムで指定した範囲が下段に表示され、その範囲が`Add filters`に追加されます。

---
## Explorer画面における操作方法

### Add filterを利用した探索方法(AND検索)
- `Select target category`から探索の起点とするデータベースを選択します。
- `Add filters`に`Attribute values`を追加します。
    - `Condition builder`の`Add filters`をクリックします（初期状態ではクリックされた状態です）。
    - トップページに表示されている個々の`Attribute values`をクリックすると、`Add filters`に追加されます。また、`Attribute keys`の`>`をクリックすると、その`Attribute keys`の詳細と`Values`の一覧が表示されます。`Values`を追加するには、左横のボックスにチェックを入れます。
    - `Values`は複数追加することができます。AND検索のため、全ての条件を満たす結果が絞り込まれます。
- `Values`の選択が終わったら、`view result`を押します。結果は`Results`のページで表示されます。
    
### Map attributesを利用した探索方法(OR検索)
- `Select target category`から探索の起点とするデータベースを選択します。
- `Attribute keys`を選びます。
    - `Condition builder`の`Map attributes`をクリックすると、`Attribute keys`の欄の右端にチェックボックスが表示されます。
    - `Attribute keys`を選びます。
    - 複数指定した場合は、少なくともいずれか一つを満たすものを全て表示します(OR検索)。

- `Attibute keys`の選択が終わったら、`view result`をクリックします。`Select target category`で選択したデータベースIDに紐づく、各`Attibute keys`に含まれる全ての`Values`を表示します。

### `Add filters`と`Map Attributes`の両方を利用した探索方法（AND・OR検索）
- `Select target category`から探索の起点とするデータベースを選択します。

- `Attribute values`　と `Attribute keys`を選択します。
    - `Condition builder`には、`Add filters`、`Map attributes`の欄の両方に選択結果が表示されます。

- 選択が終わったら、`view result`をクリックします。最初に`Add filters`の`Values`でAND検索が行なわれ、次に絞り込まれた結果に対して、`Map attributes`の条件がOR検索として実行されます。

### `Map your IDs`を用いてデータを俯瞰する
- `Select target category`から検索の起点とするデータベースを選択します。
- `Map your IDｓ`では、表示されるサンプルIDの表記方法に従ってIDを入力します。
    - 複数IDは、カンマ区切りおよび改行区切りで入力します。
    - `Map your IDs`に入力するIDについて、手持ちのIDが利用できない場合には、IDの変換には[TogoID](https://togoid.dbcls.jp/)をご利用下さい。
- `Submit`ボタンを押すと、`In progress`の表記とともに進捗状況を示すバーが表示されます。
![Map your IDs](https://github.com/dbcls/togosite/raw/develop/docs/togo-human/img/20210826_togodx_devpro_mapyourIDs.png)
- 入力したIDに関連する情報が、`Attribute values`の中にあると、ドロップアイコン(実物入れる)が各`Attribute values`の左肩に表示されます。
- ドロップアイコンが表示されている`Attribute values`にマウスオーバーすると、マップされた数とP-valueが確認できます。また、`Attribute keys`の詳細データを展開すると、マップされた`Attribute values`だけがハイライトされ、同じ情報が表示されます。
![Map your IDs](https://github.com/dbcls/togosite/raw/develop/docs/togo-human/img/20210826_togodx_devpro_mapyourIDs_2.png)

- （**後で、入力可能な数についての、何らかの説明を足す**）
　
## Results画面
![result](https://github.com/dbcls/togosite/raw/develop/docs/togo-human/img/20210826_togodx_devpro_result.png)

### 用語説明
- `Return`
    - クリックするとExplorer画面に戻ることができます
        - ブラウザの戻るボタンではExplore画面には戻れないので注意が必要です。
    
### 機能説明
- 探索結果を表示する画面です。
- `Saved Conditions`のプログレスバーでは、データ取得の状況が表示されます。
- データ取得が全て完了すると、`complete` と表示され、ダウンロードボタンがアクティブになり、TSVもしくはJSON形式でダウンロードすることができます。
- 画面上部に、`取得したAttribute valuesの件数とその割合(変更予定)`が表示されます。
- 画面下部に表示されている各種IDをクリックすると、関連情報が表示されます。
![result_stanza](https://github.com/dbcls/togosite/raw/develop/docs/togo-human/img/20210826_togodx_devpro_result_stanza.png)
    - Resultページに表示される各種IDをクリックすると、IDに紐づく関連情報が表示されます。
    - 表示された情報の中で、リンクがある項目については、外部のデータベースと紐づいており、更に詳細な情報を見ることができます。
（これらのデータは、[MetaStanza](リンクを貼る)を利用して表示しています）
- `Return`をクリックすると、Explorer画面に戻りますが、探索条件は`Saved Conditions`に保存されており、再度結果を表示することができます。（※ブラウザを閉じたり、再読み込みをすると、保存された探索条件はすべて消去されます。）




