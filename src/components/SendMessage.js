import React from 'react';
import { Button } from 'reactstrap';
import TextArea from 'react-textarea-autosize';

export default ({ value, onChange, onKeyPress, onClick }) => (
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
