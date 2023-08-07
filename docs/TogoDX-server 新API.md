TogoDX-server 新API

Breakdown改良


主な仕様

hierarchyフラグの有無でレスポンスが変化
Distributionに対してはhierarchyを付けても何も変化しません


Root - 既存API
$ curl "http://ep.dbcls.jp/togodx-server-0/breakdown/protein_cellular_component_uniprot"


[
	{
		"node": "GO_0110165",
		"label": "cellular anatomical entity",
		"count": 39160,
		"tip": false
	},
	{
		"node": "GO_0032991",
		"label": "protein-containing complex",
		"count": 9147,
		"tip": false
	},
	{
		"node": "unclassified",
		"label": "Unclassified",
		"count": 36572,
		"tip": true
	}
]


Root - DAGビュー用
$ curl "http://ep.dbcls.jp/togodx-server-0/breakdown/protein_cellular_component_uniprot?hierarchy"


{
	"self": {
		"node": "GO_0005575",
		"label": "cellular_component",
		"count": 78120,
		"tip": false
	},
	"parents": null,
	"children": [
		{
			"node": "GO_0110165",
			"label": "cellular anatomical entity",
			"count": 39160,
			"tip": false
		},
		{
			"node": "GO_0032991",
			"label": "protein-containing complex",
			"count": 9147,
			"tip": false
		},
		{
			"node": "unclassified",
			"label": "Unclassified",
			"count": 36572,
			"tip": true
		}
	]
}
※rootなのでparentsはnull

 

中間Node - 既存API
$ curl "http://ep.dbcls.jp/togodx-server-0/breakdown/protein_cellular_component_uniprot?node=GO_0000109"


[
	{
		"node": "GO_0071942",
		"label": "XPC complex",
		"count": 3,
		"tip": true
	},
	{
		"node": "GO_0000110",
		"label": "nucleotide-excision repair factor 1 complex",
		"count": 3,
		"tip": true
	},
	{
		"node": "GO_0070522",
		"label": "ERCC4-ERCC1 complex",
		"count": 3,
		"tip": true
	},
	{
		"node": "GO_0000111",
		"label": "nucleotide-excision repair factor 2 complex",
		"count": 1,
		"tip": true
	},
	{
		"node": "GO_0000112",
		"label": "nucleotide-excision repair factor 3 complex",
		"count": 1,
		"tip": true
	}
]


中間Node - DAGビュー用
$ curl "http://ep.dbcls.jp/togodx-server-0/breakdown/protein_cellular_component_uniprot?hierarchy&node=GO_0000109"


{
	"self": {
		"node": "GO_0000109",
		"label": "nucleotide-excision repair complex",
		"count": 11,
		"tip": false
	},
	"parents": [
		{
			"node": "GO_1990391",
			"label": "DNA repair complex",
			"count": 77,
			"tip": false
		},
		{
			"node": "GO_0140513",
			"label": "nuclear protein-containing complex",
			"count": 2264,
			"tip": false
		}
	],
	"children": [
		{
			"node": "GO_0071942",
			"label": "XPC complex",
			"count": 3,
			"tip": true
		},
		{
			"node": "GO_0000110",
			"label": "nucleotide-excision repair factor 1 complex",
			"count": 3,
			"tip": true
		},
		{
			"node": "GO_0070522",
			"label": "ERCC4-ERCC1 complex",
			"count": 3,
			"tip": true
		},
		{
			"node": "GO_0000111",
			"label": "nucleotide-excision repair factor 2 complex",
			"count": 1,
			"tip": true
		},
		{
			"node": "GO_0000112",
			"label": "nucleotide-excision repair factor 3 complex",
			"count": 1,
			"tip": true
		}
	]
}
※例はDAGなのでparentsは複数。多くの場合は1つ。



Suggest API


主な仕様

termは3文字以上でないと400 Bad request
resultsで返す結果は最大で10件
totalはヒット件数
total=11以上の場合に何かメッセージを出す必要があるのかは要検討
Distributionに対してはsuggestを叩いても常に空のオブジェクト{}が返る(必要であれば実装します)


$ curl "http://ep.dbcls.jp/togodx-server-0/suggest/protein_cellular_component_uniprot?term=nucleotide"


{
	"results": [
		{
			"node": "GO_0032045",
			"label": "guanyl-nucleotide exchange factor complex"
		},
		{
			"node": "GO_0017071",
			"label": "intracellular cyclic nucleotide activated cation channel complex"
		},
		{
			"node": "GO_0031588",
			"label": "nucleotide-activated protein kinase complex"
		},
		{
			"node": "GO_0000109",
			"label": "nucleotide-excision repair complex"
		},
		{
			"node": "GO_0000110",
			"label": "nucleotide-excision repair factor 1 complex"
		},
		{
			"node": "GO_0000111",
			"label": "nucleotide-excision repair factor 2 complex"
		},
		{
			"node": "GO_0000112",
			"label": "nucleotide-excision repair factor 3 complex"
		},
		{
			"node": "GO_0034066",
			"label": "Ric1-Rgp1 guanyl-nucleotide exchange factor complex"
		}
	],
	"total": 8
}


