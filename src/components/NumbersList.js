import React from "react";
import { Button, ListGroup, ListGroupItem } from "reactstrap";
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
        className={`flag-icon flag-icon-${'us'} rounded-circle avatar-flag`}
      />
      <strong>{number}</strong>
    </span>
    {conversations && conversations !== 0
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
        key={number.id}
        flag={number.country}
        id={number.id}
        number={number.friendlyName}
        active={active === number.phoneNumber}
        conversations={0}
        onClick={onClick}
        data={number}
      />
    ))}
    <Button tag={Link} to="/search" className="buy-number" color="other">
      Buy number
    </Button>
  </ListGroup>
);

export default NumbersList;
