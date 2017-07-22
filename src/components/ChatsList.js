import React from "react";
import {
  Row,
  ListGroup,
  ListGroupItem,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import * as selectors from "../selectors/data";
import actions from "../actions";
import TextTruncate from "react-text-truncate";
import fetch from "../lib/fetch";
import { compose, pure, branch, renderComponent } from "recompose";
import { connect } from "react-redux";
import moment from "moment";

export const ChatItem = ({ avatar, title, children, id, active, onClick }) => (
  <ListGroupItem
    action
    className="justify-content-between"
    active={active}
    onClick={onClick}
  >
    <Row className="align-items-center flex-nowrap">
      <img src={avatar} className="avatar rounded-circle" alt="avatar" />
      <div className="content-container">
        <Row className="title">{title}</Row>
        <Row className="content justify-content-between flex-nowrap">
          {children}
        </Row>
      </div>
    </Row>
  </ListGroupItem>
);

export const TabLink = ({ type, active, onClick, text }) => (
  <NavLink
    className={active === type ? "active" : ""}
    tag="a"
    href="#"
    onClick={() => onClick(type)}
  >
    {text}
  </NavLink>
);

export const VoiceItem = ({ data, ...props }) => (
  <ChatItem
    {...props}
    children={
      <div>
        <i
          className={`fa fa-arrow-${data.getIn([
            "latestCall",
            "type"
          ]) === "incoming" ? "left" : "right"}`}
        />
        {" "}
        {moment(data.getIn(["latestCall", "date"])).format("MMM D h:mm a")}
      </div>
    }
  />
);

export const ConversationItem = ({ data, ...props }) => (
  <ChatItem
    data={data}
    {...props}
    children={
      data.has("latestMessage") && [
        <div className="text" key="0">
          <TextTruncate
            line={1}
            truncateText="..."
            text={data.getIn(["latestMessage", "message"])}
          />
        </div>,
        <div key="1" className="date">
          {moment(data.getIn(["latestMessage", "date"])).format("h:mm a")}
        </div>
      ]
    }
  />
);

export const Container = ({ onClick, text, children, active }) => (
  <ListGroup>
    <ListGroupItem
      action
      className="justify-content-between new-chat"
      active={active === "new"}
      onClick={() => onClick("new")}
    >
      <Row className="align-items-center flex-nowrap title">
        <i className="fa fa-plus-circle icon" />
        New {text}
      </Row>
    </ListGroupItem>
    {children}
    <div ref={el => el && el.scrollIntoView({ behavior: "smooth" })} />
  </ListGroup>
);

export const ChatsList = ({
  active,
  chats,
  activePanel,
  onClick,
  onPanelClick,
  numbers
}) => (
  <div>
    <Nav className="justify-content-center">
      <NavItem>
        <TabLink
          type="conversation"
          active={activePanel}
          onClick={onPanelClick}
          text="Conversation"
        />
      </NavItem>
      <NavItem>
        <TabLink
          type="voice"
          active={activePanel}
          onClick={onPanelClick}
          text="Voice"
        />
      </NavItem>
    </Nav>
    <Container
      onClick={onClick}
      text={activePanel === "voice" ? "Voice" : "Conversation"}
      active={active}
    >
      {chats.filter(x => x.get("type") === activePanel).map(x => {
        const Component = activePanel === "voice"
          ? VoiceItem
          : ConversationItem;

        const number = numbers.get(x.get("to"));

        return (
          <Component
            key={number.get("id")}
            avatar={number.get("avatar")}
            title={number.get("name")}
            id={number.get("id")}
            active={active === number.get("id")}
            onClick={() => onClick(x.get("to"))}
            children={null}
            data={x}
          />
        );
      })}
    </Container>
  </div>
);

export const enhance = compose(
  branch(({ activeNumber }) => activeNumber == null, renderComponent("div")),
  connect((state, { activeNumber }) => {
    const selector = `number.${activeNumber}.chats`;

    return {
      state: selectors.getDataState(state, selector),
      chats: selectors.getEntitiesByData(state, selector, "chats"),
      numbers: selectors.getEntitiesObj(state, "numbers")
    };
  }),
  fetch(
    ({ dispatch, activeNumber }) =>
      dispatch(actions.chats.load.request(activeNumber)),
    ({ state }) => state.loaded,
    (p, np) => p.activeNumber !== np.activeNumber
  ),
  pure
);

export default enhance(ChatsList);
