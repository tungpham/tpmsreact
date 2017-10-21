import React from 'react';
import {
  Row,
  ListGroup,
  ListGroupItem,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import Spinner from 'halogen/BounceLoader';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import TextTruncate from 'react-text-truncate';
import { connect } from 'react-redux';
import moment from 'moment';
import { makeSelectUserProfile } from '../selectors/user';
import {
  makeSelectNumbers,
  makeSelectConversations,
  makeSelectCallLogs,
  makeSelectRecords,
  makeSelectContacts,
} from '../selectors/app';
import {
  getConversations,
  getCallLogs,
  getRecords,
  getContacts,
  makeCall,
} from '../actions/app';

export const ChatItem = ({ data, children, active, onClick }) => (
  <ListGroupItem
    action
    className="justify-content-between"
    active={active}
    onClick={() => onClick(data.phone_number)}
  >
    <Row className="align-items-center flex-nowrap">
      <img src={'https://pbs.twimg.com/profile_images/453956388851445761/8BKnRUXg.png'} className="avatar rounded-circle" alt="avatar" />
      <div className="content-container">
        <Row className="title">{data.phone_number}</Row>
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

export const CallLogItem = ({ data, number, ...props }) => (
  <ChatItem
    data={data}
    {...props}
    children={
      <div>
        <i
          className={`fa fa-arrow-${(data.items[0].to === number) ? 'left' : 'right'}`}
        />
        {" "}
        {moment(data.items[0].end_time).format("MMM D h:mm a")}
      </div>
    }
  />
);

export const VoiceItem = ({ data, number, ...props }) => (
  <ChatItem
    data={data}
    {...props}
    children={
      <div>

        {moment(data.date_updated || data.date_created).format("MMM D h:mm a")}
      </div>
    }
  />
);

export const ContactItem = ({ data, active, number, onClick, ...props }) => (
  <ListGroupItem
    action
    className="justify-content-between"
    active={active}
    onClick={onClick}
  >
    <Row className="align-items-center flex-nowrap">
      <img src={'https://pbs.twimg.com/profile_images/453956388851445761/8BKnRUXg.png'} className="avatar rounded-circle" alt="avatar" />
      <div className="content-container">
        <Row className="title">{data.displayName}</Row>
        <Row className="content justify-content-between flex-nowrap">
          <div>
            {data.phoneNumber}
          </div>
        </Row>
      </div>
    </Row>
  </ListGroupItem>
);

export const ConversationItem = ({ data, ...props }) => (
  <ChatItem
    data={data}
    {...props}
    children={
      data.message_items.length > 0 && [
        <div className="text" key="0">
          <TextTruncate
            line={1}
            truncateText="..."
            text={data.message_items[data.message_items.length - 1].body}
          />
        </div>,
        <div key="1" className="date">
          {moment(data.message_items[data.message_items.length - 1].date_sent).format("h:mm a")}
        </div>
      ]
    }
  />
);

export const Container = ({ onClick, text, children, active, type }) => (
  <ListGroup>
    <ListGroupItem
      action
      className="justify-content-between new-chat"
      active={active === "new"}
      onClick={() => onClick("new")}
    >
      {(type !== 'voice') ?
        <Row className="align-items-center flex-nowrap title">
          <i className="fa fa-plus-circle icon" />
          New {text}
        </Row> : ''
      }
    </ListGroupItem>
    {children}
  </ListGroup>
);

let currentNumber = '';

export class ChatsList extends React.PureComponent {


  constructor(props) {
    super(props);
    this.getPhoneNumberData = this.getPhoneNumberData.bind(this);
    this.makeCall = this.makeCall.bind(this);
  }

  componentDidMount() {
    this.getPhoneNumberData();
  }

  getPhoneNumberData() {
    const phoneNumber = this.props.numbers.find(number => number.phoneNumber === this.props.match.params.number);

    if (currentNumber !== this.props.match.params.number || this.props.conversations.records.length === 0) {
      this.props.dispatch(getConversations({
        phoneNumber: this.props.match.params.number,
        auth: this.props.auth,
        phoneNumberId: phoneNumber.id
      }));
    }

    if (currentNumber !== this.props.match.params.number || this.props.callLogs.records.length === 0) {
      this.props.dispatch(getCallLogs({ phoneNumber: this.props.match.params.number, auth: this.props.auth }));
    }

    if (currentNumber !== this.props.match.params.number || this.props.callRecords.records.length === 0) {
      this.props.dispatch(getRecords({ phoneNumber: this.props.match.params.number, auth: this.props.auth }));
    }

    if (currentNumber !== this.props.match.params.number || this.props.contacts.length === 0) {
      if (phoneNumber && typeof phoneNumber !== 'undefined') {
        this.props.dispatch(getContacts({ phoneNumberId: phoneNumber.id }));
      }
    }
    currentNumber = this.props.match.params.number
  }

  makeCall(to) {
    this.props.dispatch(makeCall({
      from: this.props.match.params.number,
      to
    }));
  }


  render() {
    const switchNewActionText = type => {
      switch (type) {
        case 'voice': return 'Voice';
        case 'contacts': return 'Contact';
        case 'conversation': return 'Conversation';
        case 'call-logs': return 'Call';
        default: return 'Conversation';
      }
    };

    return (
      <div>
        <Nav className="justify-content-center">
          <NavItem>
            <TabLink
              type="conversation"
              active={this.props.activePanel}
              onClick={this.props.onPanelClick}
              text="Conversation"
            />
          </NavItem>
          <NavItem>
            <TabLink
              type="voice"
              active={this.props.activePanel}
              onClick={this.props.onPanelClick}
              text="Voice"
            />
          </NavItem>
          <NavItem>
            <TabLink
              type="call-logs"
              active={this.props.activePanel}
              onClick={this.props.onPanelClick}
              text="Call Logs"
            />
          </NavItem>
          <NavItem>
            <TabLink
              type="contacts"
              active={this.props.activePanel}
              onClick={this.props.onPanelClick}
              text="Contacts"
            />
          </NavItem>
        </Nav>
        <Container
          onClick={this.props.onConversationClick}
          type={this.props.activePanel}
          text={switchNewActionText(this.props.activePanel)}
          active={this.props.active}
        >
          {(this.props.activePanel === 'voice') ?
            <div>
              {(this.props.callRecords.loading) ?
                <Row className="justify-content-center load-container">
                  <Spinner color="#ccc" />
                </Row> : <div>
                  {this.props.callRecords.records.map((record, index) => {
                    return (
                      <div key={index}>
                        <VoiceItem
                          key={record.sid}
                          avatar={null}
                          title={null}
                          number={this.props.number}
                          id={record.sid}
                          active={record.sid === this.props.conversation}
                          onClick={() => this.props.onRecordClick(record.sid)}
                          children={null}
                          data={record}
                        />
                      </div>
                    );
                  })}
                </div>
              }
            </div> : ''
          }
          {(this.props.activePanel === 'conversation') ?
            <div>
              {(this.props.conversations.loading) ?
                <Row className="justify-content-center load-container">
                  <Spinner color="#ccc"/>
                </Row>
                :
                <div>
                  {this.props.conversations.records.map((record, index) => {
                    return (
                      <div key={index}>
                        <ConversationItem
                          key={record.phone_number}
                          avatar={null}
                          title={null}
                          id={record.phone_number}
                          active={record.phone_number === this.props.conversation}
                          onClick={this.props.onConversationClick}
                          children={null}
                          data={record}
                        />
                      </div>
                    );
                  })}
                </div>
              }
            </div> : ''
          }
          {(this.props.activePanel === 'call-logs') ?
            <div>
              {(this.props.callLogs.loading) ?
                <Row className="justify-content-center load-container">
                  <Spinner color="#ccc" />
                </Row> : <div>
                  {this.props.callLogs.records.map((record, index) => {
                    return (
                      <div key={index}>
                        <CallLogItem
                          key={record.phone_number}
                          avatar={null}
                          title={null}
                          id={record.phone_number}
                          active={record.phone_number === this.props.conversation}
                          onClick={this.makeCall}
                          children={null}
                          data={record}
                        />
                      </div>
                    );
                  })}
                </div>
              }
            </div> : ''
          }
          {(this.props.activePanel === 'contacts') ?
            <div>
              {(this.props.contacts.loading) ?
                <Row className="justify-content-center load-container">
                  <Spinner color="#ccc" />
                </Row> : <div>
                  {this.props.contacts.items.map((contact, index) => {
                    return (
                      <div key={index}>
                        <ContactItem
                          key={contact.id}
                          avatar={null}
                          title={null}
                          id={contact.id}
                          active={contact.id === this.props.conversation}
                          onClick={() => this.props.onConversationClick(contact.id)}
                          children={null}
                          data={contact}
                        />
                      </div>
                    );
                  })}
                </div>
              }
            </div> : ''
          }
        </Container>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectUserProfile(),
  numbers: makeSelectNumbers(),
  conversations: makeSelectConversations(),
  callLogs: makeSelectCallLogs(),
  contacts: makeSelectContacts(),
  callRecords: makeSelectRecords()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatsList));
