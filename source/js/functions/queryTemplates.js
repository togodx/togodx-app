import App from '../classes/App';
import ConditionBuilder from '../classes/ConditionBuilder';

const noprocessing = parameter => parameter;
const stringify = parameter => JSON.stringify(parameter);

const QUERY_TEMPRATES = {
  locate: {
    attribute: noprocessing,
    node: noprocessing,
    dataset: noprocessing,
    queries: stringify,
  },
  aggregate: {
    dataset: noprocessing,
    filters: stringify,
    queries: stringify,
  },
  dataframe: {
    dataset: noprocessing,
    filters: stringify,
    annotations: stringify,
    queries: stringify,
  },
};

export function getApiParameter(api, parameters) {
  const template = QUERY_TEMPRATES[api];
  const map = Object.keys(template).map(key => [
    key,
    template[key](parameters[key]),
  ]);
  return Object.fromEntries(map);
}
