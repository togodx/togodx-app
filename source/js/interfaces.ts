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
