import React from "react";
import { connect } from "react-redux";
import { Map } from "immutable";

export const Notifications = ({
  children,
  notifications,
  dispatch,
  ...props
}) => (
  <div {...props}>
    {notifications.map(children)}
  </div>
);

export const enhance = connect((state, { type, latest }) => {
  const data = state.notifications.get(type, Map()).valueSeq();
  return {
    notifications: latest ? data.takeLast(1) : data
  };
});

export default enhance(Notifications);
