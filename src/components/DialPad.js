import React from "react";
import { Row, Col, Input } from "reactstrap";
import { compose, withState, withHandlers } from "recompose";
import SendMessage from "./SendMessage";
import Notifications from "./Notifications";

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

export const DialPad = ({
  value,
  onClick,
  onChange,
  type,
  onMessage,
  message,
  setMessage,
  onCall
}) => (
  <div className={"dialpad d-flex flex-column " + type}>
    <div className="value-container">
      <Input className="value" value={value} type="text" onChange={onChange} />
    </div>
    <Numbers onClick={onClick} />
    <Notifications type="send-conversation" className="notifications">
      {notification => <div>{notification.get("message")}</div>}
    </Notifications>
    {type === "conversation"
      ? <SendMessage
          onMessage={onMessage}
          value={message}
          onChange={setMessage}
        />
      : <Row className="icon-container justify-content-center">
          <i className="fa fa-phone call-icon" onClick={onCall} />
        </Row>}
  </div>
);

export const enhance = compose(
  withState(
    "value",
    "setValue",
    ({ number }) => (number ? String(number) : "")
  ),
  withState("message", "setMessage", ""),
  withHandlers({
    onClick: ({ value, setValue }) => num => setValue(value + num),
    onChange: ({ setValue }) => ({ target: { value } }) => setValue(value),
    onMessage: ({ onMessage, value, setValue, setMessage }) => message => {
      setValue("");
      setMessage("");
      if (value.trim().length > 0) onMessage(value, message);
    },
    onCall: ({ onCall, value, setValue }) => () => {
      setValue("");
      if (value.trim().length > 0) onCall(value);
    }
  })
);

export default enhance(DialPad);
