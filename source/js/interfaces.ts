// dataframe responce
export interface Property {
  index: {
    dataset: string,
    entry: string,
    label: string,
  };
  attributes: Attribute[];
}
export interface Attribute {
  id: string;
  items: AttributeItem[];
}
export interface AttributeItem {
  dataset: string;
  entry: string;
  node: string;
  label: string;
}

// breakdown
export interface Breakdown {
  node: string;
  label: string;
  count: number;
  tip: boolean;
}

// filter condition
export interface ConditionFilter {
  attribute: string;
  nodes: string[];
}
export interface ConditionFilterWithAncestor {
  attributeId: string;
  nodes: ConditionFilterWithAncestorNode[];
}
export interface ConditionFilterWithAncestorNode {
  node: string;
  ancestors?: string[];
}

// annotation condition
export interface ConditionAnnotation {
  attribute: string;
  node?: string | undefined;
}
export interface ConditionAnnotationWithAncestor {
  attributeId: string;
  parentNode?: string;
  ancestors?: string[];
}
// TODO: ConditionFilter と ConditionFilterWithAncestor、ConditionAnnotation と ConditionAnnotationWithAncestor は統合する
// 特に `parentNode` は早急に `node` に変更する
// ancestors は API で取得できるようにしてほしい

// condition
export interface SynthesizedCondition {
  dataset: string;
  filters: ConditionFilterWithAncestor[];
  annotations: ConditionAnnotationWithAncestor[];
  queries: string[];
  attributeSet: string[];
}

// table
export type TableHeader = {
  categoryId: string,
  attributeId: string,
};
