import React from 'react';
import { Row } from 'reactstrap';
import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { makeSelectRecord } from '../selectors/app';

class CallView extends React.PureComponent {

  render () {
    return (
      <div className="call-view">
        {(this.props.record) ?
          <div>
            <Row className="latest-call-row align-items-center flex-nowrap">
              <img
                src={'https://pbs.twimg.com/profile_images/453956388851445761/8BKnRUXg.png'}
                className="avatar rounded-circle"
                alt="avatar"
              />
              <div className="content-container">
                <Row className="title">{this.props.record.phone_number}</Row>
                <Row className="description">{moment(this.props.record.date_updated || this.props.record.date_created).fromNow()}</Row>
              </div>
            </Row>
            <Row className="avatar-row justify-content-center">
              <img
                src={'https://pbs.twimg.com/profile_images/453956388851445761/8BKnRUXg.png'}
                alt="avatar"
                className="avatar rounded-circle"
              />
            </Row>
            <Row>
              <div className="col-md-12 text-center">
                <audio controls>
                  <source src={`https://api.twilio.com/${this.props.record.uri.replace('.json', '.mp3')}`} type="audio/mpeg" />
                </audio>
              </div>
            </Row>
            <Row className="buttons-border-row justify-content-center">
              <i className="fa fa-phone icon" onClick={this.props.redirectToNewCall} />
              <i className="fa fa-bars icon" />
              <i className="fa fa-comment icon" onClick={this.props.redirectToNewConversation} />
              <i className="fa fa-trash icon" onClick={this.props.redirectToNewConversation} />
            </Row>
          </div> : ''
        }
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  record: makeSelectRecord(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CallView);
