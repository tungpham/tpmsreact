//
import React from "react";
import { Container, Row, Col, Button, Form, FormGroup } from "reactstrap";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import actions from "../../actions";
import { NavLink as Link } from "react-router-dom";
import { email, required } from "../../lib/validators";
import { reduxForm, Field } from "redux-form/immutable";
import { renderField } from "./SignIn";

export const RegisterButton = (() => {
  const RegisterButton = ({ provider, color, text, icon, signUp }) => (
    <Button block color={color || provider} onClick={signUp}>
      <span className={"fa fa-" + (icon || provider)} /> Register with {text}
    </Button>
  );

  const enhance = withHandlers({
    signUp: ({ signUp, provider }) => () => signUp(provider)
  });

  return enhance(RegisterButton);
})();

export const SignUp = ({ signUp, handleSubmit }) => (
  <Container fluid className="signin-container">
    <div className="signin-block row-divided">
      <Col md="6" className="signin-buttons">
        <RegisterButton provider="facebook" text="Facebook" signUp={signUp} />
        <RegisterButton provider="twitter" text="Twitter" signUp={signUp} />
        <RegisterButton provider="google" text="Google" signUp={signUp} />
      </Col>
      <div className="vertical-divider">OR</div>
      <Col md="6" className="signin-form">
        <Form onSubmit={handleSubmit}>
          <Field
            name="email"
            type="email"
            component={renderField}
            label="Email"
            validate={[required, email]}
          />
          <Field
            name="password"
            type="password"
            component={renderField}
            label="Password"
            validate={required}
          />
          <FormGroup className="signin-form-buttons">
            <button type="submit" className="btn btn-block btn-primary">
              Register
            </button>
          </FormGroup>
          <Row className="links">
            <Col xs="12">
              Have an account?{" "}
              <Link to="/login">
                Login now
              </Link>
            </Col>
          </Row>
        </Form>
      </Col>
    </div>
  </Container>
);

export const enhance = compose(
  connect(() => ({}), { signUp: actions.user.signUp.request }),
  withHandlers({
    onSubmit: ({ signUp }) => values => {
      signUp("password", values.toJS());
    }
  }),
  reduxForm({ form: "signUp" })
);

export default enhance(SignUp);
