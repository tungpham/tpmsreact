import React from "react";
import { Button, ListGroup, ListGroupItem } from "reactstrap";
import * as selectors from "../selectors/data";
import actions from "../actions";
import fetch from "../lib/fetch";
import { compose, pure } from "recompose";
import { connect } from "react-redux";
import { NavLink as Link } from "react-router-dom";

export const NumberItem = ({
  flag,
  id,
  number,
  conversations,
  active,
  onClick,
  data
}) => (
  <ListGroupItem
    action
    active={active}
    className="justify-content-between"
    onClick={() => onClick(data)}
  >
    <span className="align-middle">
      <span
        className={`flag-icon flag-icon-${flag} rounded-circle avatar-flag`}
      />
      <strong>{number}</strong>
    </span>
    {conversations && conversations != 0
      ? <span className="badge badge-default rounded-circle badge-circle bg-primary">
          {conversations}
        </span>
      : null}
  </ListGroupItem>
);

export const NumbersList = ({ active, numbers, onClick }) => (
  <ListGroup className="numbers-list">
    {numbers.map(number => (
      <NumberItem
        key={number.get("id")}
        flag={number.get("country")}
        id={number.get("id")}
        number={number.get("name", number.get("number"))}
        active={active === number.get("id")}
        conversations={number.get("numberOfUnread")}
        onClick={onClick}
        data={number}
      />
    ))}
    <Button tag={Link} to="/search" className="buy-number" color="other">
      Buy number
    </Button>
  </ListGroup>
);

export const enhance = compose(
  connect(state => ({
    state: selectors.getDataState(state, "numbers"),
    numbers: selectors.getEntitiesByData(state, "numbers", "numbers")
  })),
  fetch(
    ({ dispatch }) => dispatch(actions.numbers.load.request()),
    ({ state }) => state.loaded
  ),
  pure
);

export default enhance(NumbersList);
