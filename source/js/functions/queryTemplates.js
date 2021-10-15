import App from '../classes/App';
import ConditionBuilder from '../classes/ConditionBuilder';

export function dataFromUserIds(propertyId, categoryIds = '') {
  return `${
    App.locate
  }?attribute=${
    propertyId
  }&categoryIds=${
    categoryIds
  }&togokey=${
    ConditionBuilder.currentTogoKey
  }&queries=${
    ConditionBuilder.userIds ?? ''
  }`
}
