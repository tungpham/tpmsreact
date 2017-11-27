import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

export class CallTimer extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      minutes: 0,
      second: 0,
    };
    this.interval = null;
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.second === 59) {
        this.setState({ minutes: this.state.minutes + 1 });
        this.setState({ second: 0 });
      }
      this.setState({ second: this.state.second + 1 });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <p>{(this.state.minutes < 10) ? `0${this.state.minutes}` : this.state.minutes}:{(this.state.second < 10) ? `0${this.state.second}` : this.state.second}</p>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CallTimer);
