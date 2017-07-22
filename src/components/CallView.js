import React, { Component } from "react";
import { Row } from "reactstrap";
import moment from "moment";
import {
  compose,
  pure,
  branch,
  renderComponent,
  withProps,
  withState,
  withHandlers
} from "recompose";
import { connect } from "react-redux";
import * as selectors from "../selectors/data";
import raf from "raf";
import { push } from "react-router-redux";

class Progressbar extends Component {
  constructor(props) {
    super(props);

    this.state = { width: 0 };
  }
  componentDidMount() {
    this.started = Date.now();
    this.handle = raf(this.update.bind(this));
  }

  componentWillUnmount() {
    raf.cancel(this.handle);
  }

  update() {
    const end = 5000;
    const diff = Date.now() - this.started;
    if (diff > end) return this.props.onEnd();

    this.setState({ width: Math.min(diff / end * 100, 100) });

    this.handle = raf(this.update.bind(this));
  }

  render() {
    return (
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${this.state.width}%` }}
        />
      </div>
    );
  }
}

export const CallView = ({
  number,
  latestCall,
  playing,
  togglePlay,
  redirectToNewCall,
  redirectToNewConversation
}) => (
  <div className="call-view">

    <Row className="latest-call-row align-items-center flex-nowrap">
      <img
        src={number.get("avatar")}
        className="avatar rounded-circle"
        alt="avatar"
      />
      <div className="content-container">
        <Row className="title">{number.get("name", number.get("number"))}</Row>
        <Row className="content justify-content-between flex-nowrap">

          <div>
            <i
              className={`fa fa-arrow-${latestCall.get("type") === "incoming" ? "left" : "right"}`}
            />
            {" "}
            {moment(latestCall.get("date")).format("MMM D h:mm a")}
          </div>
        </Row>
      </div>
    </Row>
    <Row className="avatar-row justify-content-center">
      <img
        src={number.get("avatar")}
        alt="avatar"
        className="avatar rounded-circle"
      />
    </Row>
    <Row className="progress-row justify-content-center">
      {playing && <Progressbar onEnd={togglePlay} />}
    </Row>
    <Row className="buttons-simple-row justify-content-center">
      <i
        className={"fa fa fa-" + (playing ? "pause" : "play") + " icon"}
        onClick={togglePlay}
      />
      <i className="fa fa-volume-down icon" />
      <i className="fa fa-trash icon" />
    </Row>
    <Row className="buttons-border-row justify-content-center">
      <i className="fa fa-phone icon" onClick={redirectToNewCall} />
      <i className="fa fa-bars icon" />
      <i className="fa fa-comment icon" onClick={redirectToNewConversation} />
    </Row>
  </div>
);

export const enhance = compose(
  branch(({ from, to }) => from == null || to == null, renderComponent("div")),
  withState("playing", "setPlaying", false),
  connect((state, { from, to }) => ({
    fromNumber: selectors.getById(state, "numbers", from) || Map(),
    toNumber: selectors.getById(state, "numbers", to) || Map(),
    toChat: selectors.getById(state, "chats", to) || Map()
  })),
  withProps(({ toNumber, toChat }) => ({
    latestCall: toChat.get("latestCall"),
    number: toNumber
  })),
  withHandlers({
    togglePlay: ({ playing, setPlaying }) => () => setPlaying(!playing),
    redirectToNewCall: ({ dispatch, from, toNumber }) => () =>
      dispatch(
        push(`/dashboard/${from}/voice/new`, { number: toNumber.get("number") })
      ),
    redirectToNewConversation: ({ dispatch, from, toNumber }) => () =>
      dispatch(
        push(`/dashboard/${from}/conversation/new`, {
          number: toNumber.get("number")
        })
      )
  }),
  pure
);

export default enhance(CallView);
