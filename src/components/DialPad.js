import React from 'react';
import { Row, Col, Input } from 'reactstrap';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SendMessage from './SendMessage';
import { sendMessage, makeCall } from '../actions/app';
import { makeSelectUserProfile } from '../selectors/user';

export const Number = ({ value, text, onClick, disabled }) => (
  <Col
    xs="3"
    className={"number" + (disabled ? " disabled" : "")}
    onClick={() => !disabled && onClick(value)}
  >
    <div className="title">{value}</div>
    <div className="description">{text}</div>
  </Col>
);

export const Numbers = ({ onClick }) => (
  <div className="numbers">
    <Row className="justify-content-center">
      <Number value="1" text="" onClick={onClick} />
      <Number value="2" text="ABC" onClick={onClick} />
      <Number value="3" text="DEF" onClick={onClick} />
    </Row>
    <Row className="justify-content-center">
      <Number value="4" text="GHI" onClick={onClick} />
      <Number value="5" text="JKL" onClick={onClick} />
      <Number value="6" text="MNO" onClick={onClick} />
    </Row>
    <Row className="justify-content-center">
      <Number value="7" text="PQRS" onClick={onClick} />
      <Number value="8" text="TUV" onClick={onClick} />
      <Number value="9" text="WXYZ" onClick={onClick} />
    </Row>
    <Row className="justify-content-center">
      <Number value="*" text="ABC" onClick={onClick} disabled />
      <Number value="0" text="" onClick={onClick} />
      <Number value="#" text="ABC" onClick={onClick} disabled />
    </Row>
  </div>
);

export class DialPad extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      message: '',
      number: ''
    };
    this.setNumber = this.setNumber.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.makeCall = this.makeCall.bind(this);
  }

  setNumber(value, input = false) {
    if (input) {
      return this.setState({ ...this.state, number: value });
    }
    let number = this.state.number;
    number += value;
    this.setState({ ...this.state, number });
  }

  setMessage(e) {
    this.setState({ ...this.state, message: e.target.value });
  }

  onKeyPress(e) {
    const { key, shiftKey } = e;
    if (key === "Enter" && !shiftKey) {
      this.sendMessage();
      e.preventDefault();
    }
  }

  sendMessage() {
    if (this.state.message.trim().length > 0) {
      this.props.dispatch(sendMessage({
        auth: this.props.auth,
        from: this.props.number,
        to: this.state.number,
        body: this.state.message,
        history: this.props.history,
      }));
      this.setState({ message: '' });
    }
  }

  makeCall() {
    this.props.dispatch(makeCall({
      from: this.props.number,
      to: this.state.number,
    }));
  }

  render() {
    return (
      <div className={"dialpad d-flex flex-column " + this.props.type}>
        <div className="value-container">
          <Input className="value" value={this.state.number} type="text" onChange={(e) => this.setNumber(e.target.value, true)} />
        </div>
        <Numbers onClick={this.setNumber} />
        {this.props.type === "conversation"
          ? <SendMessage
            onMessage={this.props.onMessage}
            value={this.state.message}
            onSubmit={this.sendMessage}
            onKeyPress={this.onKeyPress}
            onChange={this.setMessage}
          />
          : <Row className="icon-container justify-content-center">
            <i className="fa fa-phone call-icon" onClick={this.makeCall} />
          </Row>}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectUserProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DialPad));
