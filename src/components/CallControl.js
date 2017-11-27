/* eslint no-undef: 0 */
import React from 'react';
import Modal from 'antd/lib/modal';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { makeSelectUserProfile } from '../selectors/user';
import { makeSelectCallCenter, makeSelectCallTokens } from '../selectors/app';
// import Fetcher from '../core/fetcher';
import { closeCall, getCallLogs } from '../actions/app';
import { Numbers } from '../components/DialPad';
import CallTimer from '../components/CallTimer';


const MuteButton = ({ smallText, muted, handleOnClick }) => (
  <button className="btn btn-circle btn-default p-20" onClick={handleOnClick}>
    <i className={'fa fa-2x fa-microphone ' + (muted ? 'fa-microphone-slash': 'fa-microphone')} />
  </button>
);

export class CallControl extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      muted: false,
      log: 'Connecting...',
      answered: false,
      onPhone: false,
    };
    this.sendDigit = this.sendDigit.bind(this);
    this.closeCall = this.closeCall.bind(this);
  }

  componentDidMount() {
    const self = this;
    Twilio.Device.error(function(error) {
      console.log(error.message);
    });

    // Configure event handlers for Twilio Device
    Twilio.Device.disconnect(function() {
      self.setState({
        onPhone: false,
        log: 'Call ended.'
      });
      self.props.dispatch(getCallLogs({ phoneNumber: self.props.callCenter.from, auth: self.props.auth }));
      self.setState({ answered: false });
      self.props.dispatch(closeCall());
      Twilio.Device.destroy();
    });
  }

  componentWillReceiveProps(newProps) {
    const self = this;
    if (newProps.callCenter.calling && !this.props.callCenter.calling && this.props.auth) {
      self.setState({ log: 'Connecting...'});
      Twilio.Device.setup(this.props.callTokens[newProps.callCenter.from], { enableRingingState: true });
      Twilio.Device.ready(function() {
        Twilio.Device.connect({ To: newProps.callCenter.to, From: newProps.callCenter.from });
        self.setState({ log: 'Calling ' + newProps.callCenter.to, onPhone: true });
        const callStatusListen = setInterval(() => {
          if (typeof Twilio.Device.activeConnection() == 'undefined') {
            clearInterval(callStatusListen);
          }
          if (Twilio.Device.activeConnection().status() === 'open') {
            if (!self.state.answered) self.setState({ answered: true });
          }
        }, 1000);
      });
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
  }

  render() {
    return (
      <div>
        <Modal footer={''} title={this.state.log} wrapClassName="call-control" visible={this.props.callCenter.calling} closable={false}>
          <div className="row">
            <div className="controls col-md-12 text-center dialpad">
              {this.state.answered && <b className="text-muted p-20"><CallTimer /></b>}
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
  callTokens: makeSelectCallTokens(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CallControl);
