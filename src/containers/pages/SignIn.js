import React from 'react';
import { createStructuredSelector } from 'reselect';
import Auth from '../../auth/Auth';
import {
  Container,
  Col,
} from 'reactstrap';
import { connect } from 'react-redux';
import { makeSelectAuthenticated } from '../../selectors/user'

const auth = new Auth();

export class SignIn extends React.PureComponent {

  render() {
    return (
      <Container fluid className="signin-container">
        <div className="signin-block row-divided">
          <Col xs="12" md="12" className="signin-form">
            {
              !this.props.authenticated
                ?
                <button
                  type="button"
                  className="btn btn-block btn-primary"
                  onClick={() => auth.openAuthO()}
                >
                  Log in / Sign up
                </button>
                :
                <button
                  type="button"
                  className="btn btn-block btn-primary"
                  onClick={() => auth.logout()}
                >
                  Log out
                </button>
            }
          </Col>
        </div>
      </Container>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  authenticated: makeSelectAuthenticated(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
