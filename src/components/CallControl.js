/* eslint no-undef: 0 */
import React from 'react';
import Modal from 'antd/lib/modal';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { makeSelectUserProfile } from '../selectors/user';
import { makeSelectCallCenter } from '../selectors/app';
import Fetcher from '../core/fetcher';
import { closeCall } from '../actions/app';
import { Numbers } from '../components/DialPad';


const MuteButton = ({ smallText, muted, handleOnClick }) => (
  <button className="btn btn-circle btn-default" onClick={handleOnClick}>
    <i className={'fa fa-fw fa-microphone ' + (muted ? 'fa-microphone-slash': 'fa-microphone')} />
  </button>
);

export class CallControl extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      muted: false,
      log: 'Connecting...',
      onPhone: false,
    };
    this.sendDigit = this.sendDigit.bind(this);
    this.closeCall = this.closeCall.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if(newProps.auth.user && !this.props.auth.user) {
      Fetcher.getCallToken(
        newProps.auth.userMetadata.sid,
        newProps.auth.userMetadata.auth_token
      ).then(response => {
        Twilio.Device.setup(response.token);
      }).catch(e => {
        console.log(e);
        self.setState({log: 'Something look like went wrong!'});
      });

      // Configure event handlers for Twilio Device
      Twilio.Device.disconnect(function() {
        self.setState({
          onPhone: false,
          log: 'Call ended.'
        });
      });
      Twilio.Device.ready(function() {
        self.log = 'Connected';
      });
    }

    const self = this;

    if (newProps.callCenter.calling && !this.props.callCenter.calling && this.props.auth) {
      Twilio.Device.connect({ number: newProps.callCenter.to });
      self.setState({ log: 'Calling ' + newProps.callCenter.to, onPhone: true })
    }
  }

  handleToggleMute() {
    const muted = !this.state.muted;

    this.setState({muted: muted});
    Twilio.Device.activeConnection().mute(muted);
  }

  handleToggleCall() {
    Twilio.Device.disconnectAll();
  }

  sendDigit(digit) {
    Twilio.Device.activeConnection().sendDigits(digit);
  }

  closeCall() {
    Twilio.Device.disconnectAll();
    this.props.dispatch(closeCall());
  }

  render() {
    return (
      <div>
        <Modal footer={''} title={this.state.log} visible={this.props.callCenter.calling} closable={true} onCancel={this.closeCall}>
          <div className="row">
            <div className="controls col-md-12 text-center dialpad">
              { this.state.onPhone ? <Numbers onClick={this.sendDigit.bind(this)} /> : null }
            </div>
          </div>
          <div className="row">
            <div className="controls col-md-12 text-center">
              { this.state.onPhone ? <MuteButton handleOnClick={this.handleToggleMute.bind(this)} muted={this.state.muted} /> : null }
              <button
                className="btn btn-block btn-danger call_center__container__btn--end-call"
                onClick={this.handleToggleCall.bind(this)}
              >
                <i className="fa fa-phone fa-2x" />
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectUserProfile(),
  callCenter: makeSelectCallCenter(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CallControl);
