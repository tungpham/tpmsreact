import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
// import { makeSelectUserProfile } from '../selectors/user';
import { makeSelectConversationMessages } from '../selectors/app';
// import { getConversations, getCallLogs } from '../actions/app';
import ScrollToBottom from './ScrollToBottom';
import SendMessage from './SendMessage';

const nl2br = text =>
  text.split("\n").map((item, key) => <span key={key}>{item}<br /></span>);

class MessagesView extends React.PureComponent {
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
                      {moment(message.date_sent).format("h:mm a")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollToBottom>
        <SendMessage onMessage={() => {}} />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  messages: makeSelectConversationMessages(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MessagesView));
