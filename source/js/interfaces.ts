import ConditionFilterUtility from './classes/ConditionFilterUtility';
import ConditionAnnotationUtility from './classes/ConditionAnnotationUtility';
import Color from 'colorjs.io';

// config
export interface Config {
  TEMPLATES: string;
  BACKEND: string;
  ATTRIBUTES: string;
  PRESET: string;
}
// Template
export interface Templates {
  stanzas: string[];
  templates: TemplatesTemplate[];
}
export interface TemplatesTemplate {
  [key: string]: string;
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
// Attribute
export interface Attributes {
  attributes: AttributesObject[];
  categories: AttributesCategory[];
  datasets: AttributesDatasetObject;
}
export interface AttributesObject {
  [key: string]: AttributesAttribute[];
}
export interface AttributesAttribute {
  api: string;
  datamodel: string;
  dataset: string;
  description: string;
  label: string;
  order: string;
  source: AttributesSource[];
}
export interface AttributesSource {
  label: string;
  updated: string;
  url: string;
  version: string;
}
export interface AttributesCategory {
  attributes: string[];
  id: string;
  label: string;
  hue: number;
  color: Color;
  colorCSSStrongValue: string;
  colorCSSValue: string;
}
export interface AttributesDatasetObject {
  [key: string]: AttributesDataset;
}
export interface AttributesDataset {
  conversion: AttributesDatasetConversion;
  examples: string[];
  label: string;
  target: boolean;
  template: string;
}
export interface AttributesDatasetConversion {
  [key: string]: string;
}

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
export interface DataFrame {
  index: {
    dataset: string,
    entry: string,
    label: string,
  };
  attributes: DataFrameAttribute[];
}
export interface DataFrameAttribute {
  id: string;
  items: DataFrameAttributeItem[];
}
export interface DataFrameAttributeItem {
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
  // filters: ConditionFilterWithAncestor[];
  // annotations: ConditionAnnotationWithAncestor[];
  filters: ConditionFilter[];
  annotations: ConditionAnnotation[];
  queries: string[];
}
export interface SelectedNodes {
  filters: string[];
  annotations: string[];
}

// table
export type TableHeader = {
  categoryId: string,
  attributeId: string,
};
