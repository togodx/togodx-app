import App from '../classes/App';
import ConditionBuilder from '../classes/ConditionBuilder';

export function dataFromUserIds(attributeId, categoryIds = '') {
  return `${
    App.locate
  }?attribute=${
    attributeId
  }&categoryIds=${
    categoryIds
  }&togokey=${
    ConditionBuilder.currentTogoKey
  }&queries=${
    ConditionBuilder.userIds ?? ''
  }`
}
