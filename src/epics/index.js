import appEpics from "./app";
import userEpics from "./user";
import numberEpics from "./numbers";
import chatEpics from "./chats";
import notificationEpics from "./notifications";
import statisticEpics from "./statistics";
import searchEpics from "./search";

export default [
  ...appEpics,
  ...userEpics,
  ...numberEpics,
  ...chatEpics,
  ...notificationEpics,
  ...statisticEpics,
  ...searchEpics
];
