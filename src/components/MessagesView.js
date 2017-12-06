import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { makeSelectConversationMessages } from '../selectors/app';
import ScrollToBottom from './ScrollToBottom';
import SendMessage from './SendMessage';
import { sendMessage } from '../actions/app';
import { makeSelectUserProfile } from '../selectors/user';

const nl2br = text =>
  text.split("\n").map((item, key) => <span key={key}>{item}<br /></span>);

class MessagesView extends React.PureComponent {

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
        from: this.props.from,
        to: this.props.to,
        body: this.state.message,
        history: this.props.history,
      }));
      this.setState({ message: '' });
    }
  }

  render() {
    return (
      <div className="messages-view-container">
        <ScrollToBottom className="messages-view">
          <div className="messages-list">
            {this.props.messages.map((message, i) => {
              const local = message.from === this.props.from;
              return (
                <div
                  className={
                    "message-box d-flex" +
                    (local ? " local flex-row-reverse" : " remote flex-row")
                  }
                  key={i}
                >
                  <div className="message-avatar">
                    <img
                      src={'https://pbs.twimg.com/profile_images/453956388851445761/8BKnRUXg.png'}
                      alt="avatar"
                      className="avatar rounded-circle"
                    />
                  </div>
                  <div className="message-container">
                    <div className="message-text">
                      {nl2br(message.body)}
                    </div>
                    <div className="message-date">
                      {moment((message.date_sent) ? message.date_sent : new Date()).format("h:mm a")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollToBottom>
        <SendMessage
          onMessage={this.props.onMessage}
          value={this.state.message}
          onSubmit={this.sendMessage}
          onClick={this.sendMessage}
          onKeyPress={this.onKeyPress}
          onChange={this.setMessage}
        />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  messages: makeSelectConversationMessages(),
  auth: makeSelectUserProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MessagesView));
