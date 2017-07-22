import { Record } from "immutable";
import { combineReducers } from "redux-immutable";
import appReducer from "./app";
import routerReducer from "./router";
import userReducer from "./user";
import fieldsReducer from "./fields";
import dataReducer from "./data";
import messagesReducer from "./messages";
import notificationsReducer from "./notifications";
import { reducer as formReducer } from "redux-form/immutable";

const StateRecord = Record({
  router: undefined,
  app: undefined,
  user: undefined,
  fields: undefined,
  data: undefined,
  messages: undefined,
  notifications: undefined,
  form: undefined
});

export default combineReducers(
  {
    router: routerReducer,
    app: appReducer,
    user: userReducer,
    fields: fieldsReducer,
    data: dataReducer,
    messages: messagesReducer,
    notifications: notificationsReducer,
    form: formReducer
  },
  StateRecord
);
