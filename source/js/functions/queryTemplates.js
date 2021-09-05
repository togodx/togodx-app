import App from '../classes/App';
import ConditionBuilder from '../classes/ConditionBuilder';

export function dataFromUserIds(sparqlet, primaryKey, categoryIds = '') {
  return `${
    App.aggregateMapping
  }?sparqlet=${
    encodeURIComponent(sparqlet)
  }&primaryKey=${
    encodeURIComponent(primaryKey)
  }&categoryIds=${
    categoryIds
  }&userKey=${
    ConditionBuilder.currentTogoKey
  }&userIds=${
    ConditionBuilder.userIds ?? ''
  }`
}
