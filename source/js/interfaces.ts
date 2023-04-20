// config
export interface Config {
  TEMPLATES: string;
  BACKEND: string;
  ATTRIBUTES: string;
  PRESET: string;
}

// API
export interface Backend {
  aggregate: {
    url: string,
  };
  dataframe: {
    url: string,
  };
  locate: {
    url: string,
  };
}
export type API = 'aggregate' | 'dataframe' | 'locate';

// Preset
export interface PresetMetaDatum {
  label: string;
  description: string;
  url: string;
}
export interface Preset {
  condition?: Condition;
  attributeSet: string[];
}
// export interface Preset {
//   attribute_sets: AttributeSet[];
// }
// export interface AttributeSet {
//   label: string;
//   set: string[];
// }

// App
export interface ViewModes {
  [key: string]: boolean;
}

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
export interface Condition {
  dataset: string;
  filters: ConditionFilterWithAncestor[];
  annotations: ConditionAnnotationWithAncestor[];
  queries: string[];
}
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