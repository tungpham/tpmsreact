import { createActions } from "redux-actions";
import * as appActions from "./app";
import * as chatsActions from "./chats";
import * as dataActions from "./data";
import * as fieldsActions from "./fields";
import * as numbersActions from "./numbers";
import * as userActions from "./user";
import * as notificationActions from "./notifications";
import * as statisticActions from "./statistics";
import * as searchActions from "./search";

const create = obj => {
  const result = {};
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      result[key] = {
        ...obj[key]
      };

      delete result[key].__esModule;
    }
  }

  return createActions(result);
};

export default create({
  app: appActions,
  chats: chatsActions,
  data: dataActions,
  fields: fieldsActions,
  numbers: numbersActions,
  user: userActions,
  notifications: notificationActions,
  statistics: statisticActions,
  search: searchActions
});
