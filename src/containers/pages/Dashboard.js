import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import NumbersList from '../../components/NumbersList';
import ChatsList from '../../components/ChatsList';
import MessagesView from '../../components/MessagesView';
import ContactView from '../../components/ContactView';
import DialPad from '../../components/DialPad';
import NewContact from '../../components/NewContact';
import CallView from '../../components/CallView';
import { getAllPhoneNumber } from '../../actions/app';
import { makeSelectUserProfile } from '../../selectors/user';
import { makeSelectNumbers } from '../../selectors/app';
import { connect } from 'react-redux';

const cx = (base, type, active) =>
  base + (type === active ? "hidden-md-down" : " hidden-md-down");

class Dashboard extends React.PureComponent {

  constructor(props) {
    super(props);
    this.redirectNumber = this.redirectNumber.bind(this);
    this.redirectConversationDetail = this.redirectConversationDetail.bind(this);
    this.redirectConversationMode = this.redirectConversationMode.bind(this);
    this.redirectRecordDetail = this.redirectRecordDetail.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getAllPhoneNumber(this.props.auth.user));
  }

  redirectNumber(number) {
    this.props.history.push(`/dashboard/${number.phoneNumber}/conversation`);
  }

  redirectConversationDetail(number = 'new') {
    this.props.history.push(`/dashboard/${this.props.match.params.number}/${this.props.match.params.type}/${number}`);
  }

  redirectConversationMode(type) {
    this.props.history.push(`/dashboard/${this.props.match.params.number}/${type}`);
  }

  redirectRecordDetail(sId) {
    this.props.history.push(`/dashboard/${this.props.match.params.number}/${this.props.match.params.type}/${sId}`);
  }

  render() {
    return (
      <div className="dashboard basic-root">
        <Container fluid className="dashboard-container basic-container">
          <Row className="dashboard-row basic-row">
            <Col lg="2" className={cx('numbers list', 'numbers', this.props.match.params.type)}>
              <NumbersList active={this.props.match.params.number} numbers={this.props.numbers} onClick={this.redirectNumber} />
            </Col>
            <Col lg="4" className={cx('conversations list', 'chats', this.props.match.params.type)}>
              {this.props.match.params.number && this.props.numbers.length > 0 &&
              <ChatsList
                key={`${this.props.match.params.number}-${this.props.match.params.conversation}`}
                activeNumber={this.props.match.params.number}
                activePanel={this.props.match.params.type || 'conversation'}
                conversation={this.props.match.params.conversation}
                onRecordClick={this.redirectRecordDetail}
                onConversationClick={this.redirectConversationDetail}
                onPanelClick={this.redirectConversationMode}
              />}
            </Col>
            <Col lg="6" className={cx('content', 'chat', this.props.match.params.type)}>
              {this.props.match.params.conversation === 'new'
                ?
                <div>
                  {(this.props.match.params.type === 'conversation' || this.props.match.params.type === 'call-logs') ?
                    <DialPad
                      type={this.props.match.params.type}
                      number={this.props.match.params.number}
                    /> : <NewContact number={this.props.match.params.number}  />
                  }
                </div> : ''
              }
              {(this.props.match.params.conversation && this.props.match.params.conversation !== 'new') ?
                <div>
                  {(this.props.match.params.type === 'conversation') ?
                    <MessagesView
                      from={this.props.match.params.number}
                      to={this.props.match.params.conversation}
                      key={this.props.match.params.conversation}
                    /> : ''
                  }
                  {(this.props.match.params.type === 'voice') ?
                    <CallView
                      from={this.props.match.params.number}
                      to={this.props.match.params.conversation}
                      key={this.props.match.params.conversation}
                    /> : ''
                  }
                  {(this.props.match.params.type === 'contacts') ?
                    <ContactView
                      from={this.props.match.params.number}
                      contactId={this.props.match.params.conversation}
                    /> : ''
                  }
                </div> : ''
              }
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectUserProfile(),
  numbers: makeSelectNumbers(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
