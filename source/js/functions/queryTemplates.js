import App from '../classes/App';
import ConditionBuilder from '../classes/ConditionBuilder';

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
