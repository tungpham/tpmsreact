import React from "react";
import { Button } from "reactstrap";
import TextArea from "react-textarea-autosize";
import { branch, compose, withState, withHandlers } from "recompose";

export const SendMessage = ({ value, onChange, onKeyPress, onClick }) => (
  <div className="message-input-container d-flex align-items-center">
    <TextArea
      className="form-control message-input"
      value={value}
      onChange={onChange}
      placeholder="Type your message..."
      maxRows={3}
      onKeyPress={onKeyPress}
    />
    <Button className="message-button" onClick={onClick}>SEND</Button>
  </div>
);

export const enhance = compose(
  branch(
    ({ value, onChange }) => value == null || onChange == null,
    // control the state manually
    compose(
      withState("value", "onChange"),
      withHandlers({
        onMessage: ({ onMessage, onChange, value }) => e => {
          onChange("");
          onMessage(value);
        }
      })
    )
  ),
  withHandlers({
    onChange: ({ onChange }) => ({ target: { value } }) => onChange(value),
    onKeyPress: ({ onMessage, onChange, value }) => e => {
      const { key, shiftKey } = e;

      if (key === "Enter" && !shiftKey && value.trim().length > 0) {
        onMessage(value);
        e.preventDefault();
      }
    },
    onClick: ({ onMessage, onChange, value }) => () => {
      if (value.trim().length > 0) {
        onMessage(value);
      }
    }
  })
);

export default enhance(SendMessage);
