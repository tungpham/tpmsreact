import React from 'react';
import { createStructuredSelector } from 'reselect';
import Auth from '../../auth/Auth';
import {
  Container,
} from 'reactstrap';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { loggedIn } from '../../actions/user';

const authService = new Auth();

export class OAuthCallback extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      authenticationFailed: false,
    };
  }

  componentWillMount() {
    authService.authOLoginCallback(this.props.location.hash, auth => {
      if (auth) {
        this.props.dispatch(loggedIn({ profile: auth } ));
        this.props.dispatch(push('/dashboard'));
      } else {
        this.setState({ authenticationFailed: true });
      }
    });
  }

  render() {
    return (
      <Container fluid className="oauth-callback-container">
        {(this.state.authenticationFailed) ?
          <h1>
            Authentication failed, Try to <a href="#" onClick={() => { authService.openAuthO() }}>Sign In</a> again.
          </h1> :
          <h1>
            Authenticating...
          </h1>
        }
      </Container>
    )
  }
}

const mapStateToProps = createStructuredSelector({

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OAuthCallback);
