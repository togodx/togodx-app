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
export interface ConditionFilterValue {
  attributeId: string;
  nodes: ConditionFilterValueNode[];
}
export interface ConditionFilterValueNode {
  node: string;
  ancestors?: string[];
}
export interface ConditionFilterQuery {
  attribute: string;
  nodes: string[];
}

// annotation condition
export interface ConditionAnnotationValue {
  attributeId: string;
  parentNode?: string;
  ancestors?: string[];
}
export interface ConditionAnnotationQuery {
  attribute: string;
  node?: string | undefined;
}

// condition
export interface Condition {
  dataset: string;
  filters: ConditionFilterValue[];
  annotations: ConditionAnnotationValue[];
  queries: string[];
}

// table
export type TableHeader = {
  categoryId: string,
  attributeId: string,
};
