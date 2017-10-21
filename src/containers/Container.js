import React from 'react';
import { Row } from 'reactstrap';
import Spinner from 'halogen/BounceLoader'
import Navigation from '../components/Navigation';
import CallControl from '../components/CallControl';

export default class Container extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      appLoaded: false,
    };
    document.addEventListener('appLoaded', e => {
      this.setState({ ...this.state, appLoaded: true })
    });
  }

  render() {
    return (
      <div>
        {(this.state.appLoaded) ?
          <div>
            <Navigation />
            {this.props.children}
          </div> :
          <div className="container text-center">
            <Row className="justify-content-center load-container loading-screen">
              <Spinner color="#ccc" />
            </Row>
          </div>
        }
        <CallControl />
      </div>
    );
  }
}

