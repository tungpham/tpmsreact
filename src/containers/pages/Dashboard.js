import React from "react";
import { Container, Row, Col } from "reactstrap";
import NumbersList from "../../components/NumbersList";
import ChatsList from "../../components/ChatsList";
import MessagesView from "../../components/MessagesView";
import DialPad from "../../components/DialPad";
import CallView from "../../components/CallView";
import { withHandlers, withProps, compose } from "recompose";
import actions from "../../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router";

const cx = (base, type, active) =>
  base + (type === active ? "" : " hidden-md-down");

export const Dashboard = ({
  match: { params },
  redirectNumber,
  redirectPanel,
  redirectConversation,
  type,
  onMessage,
  onCall,
  location: { state }
}) => (
  <div className="dashboard basic-root">
    <Container fluid className="dashboard-container basic-container">
      <Row className="dashboard-row basic-row">
        <Col lg="3" className={cx("numbers list", "numbers", type)}>
          <NumbersList active={params.number} onClick={redirectNumber} />
        </Col>
        <Col lg="3" className={cx("conversations list", "chats", type)}>
          {params.number &&
            <ChatsList
              key={`${params.number}-${params.conversation}`}
              activeNumber={params.number}
              activePanel={params.type || "conversation"}
              active={params.conversation}
              onClick={redirectConversation}
              onPanelClick={redirectPanel}
            />}
        </Col>
        {console.log("WHUT", params)}
        <Col lg="6" className={cx("content", "chat", type)}>
          {params.conversation === "new"
            ? <DialPad
                type={params.type}
                onMessage={onMessage}
                onCall={onCall}
                number={(state || {}).number}
              />
            : params.type === "conversation"
                ? <MessagesView
                    from={params.number}
                    to={params.conversation}
                    key={params.conversation}
                  />
                : <CallView
                    from={params.number}
                    to={params.conversation}
                    key={params.conversation}
                  />}
        </Col>
      </Row>
    </Container>
  </div>
);

export const enhance = compose(
  withRouter,
  connect(),
  withProps(({ match: { params } }) => ({
    type: params.number == null
      ? "numbers"
      : params.conversation == null ? "chats" : "chat"
  })),
  withHandlers({
    redirectNumber: ({ history }) => number =>
      history.push(`/dashboard/${number.get("id")}/conversation`),
    redirectPanel: ({ history, match: { params } }) => panel =>
      history.push(`/dashboard/${params.number}/${panel}`),
    redirectConversation: ({ history, match: { params } }) => chat =>
      history.push(`/dashboard/${params.number}/${params.type}/${chat}`),
    onCall: () => number => alert(number),
    onMessage: ({ match: { params }, dispatch }) => (number, message) =>
      dispatch(
        actions.chats.conversation.send.request(params.number, number, message)
      )
  })
);

export default enhance(Dashboard);
