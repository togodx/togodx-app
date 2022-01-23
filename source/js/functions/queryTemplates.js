import App from '../classes/App';
import ConditionBuilder from '../classes/ConditionBuilder';

const noprocessing = parameter => parameter;
const stringify = parameter => JSON.stringify(parameter);

const QUERY_TEMPRATES = {
  locate: {
    attribute: noprocessing,
    ndoe: noprocessing,
    dataset: noprocessing,
    queries: stringify
  },
  aggregate: {
    dataset: noprocessing,
    filters: stringify,
    queries: stringify
  },
  dataframe: {
    dataset: noprocessing,
    filters: stringify,
    annotations: stringify,
    queries: stringify
  }
}

function makeParameter(api, parameters) {
  console.log(parameters)
  return `?${
    Object.keys(QUERY_TEMPRATES[api])
      .forEach(key => {
        console.log(key)
        return parameters[key]
          ? QUERY_TEMPRATES[api][key](parameters[key])
          : '';
      })
      .join('')
  }`;
}

// export function getLocateQuery(parameters)

export function dataFromUserIds(attributeId, node = '') {
  return `${
    App.locate
  }?attribute=${
    attributeId
  }&node=${
    node
  }&togokey=${
    ConditionBuilder.currentTogoKey
  }&queries=${
    ConditionBuilder.userIds ?? ''
  }`
}
