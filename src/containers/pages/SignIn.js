//
import React from "react";
import Auth from '../../auth/Auth';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap";
import { connect } from "react-redux";
import { compose, withHandlers, withProps } from "recompose";
import actions from "../../actions";
import { email, required } from "../../lib/validators";
import { reduxForm, Field } from "redux-form/immutable";
import { NavLink as Link } from "react-router-dom";

let auth = new Auth();

export const SignInButton = (() => {
  const SignInButton = ({ provider, color, text, icon, signIn }) => (
    <Button block color={color || provider} onClick={signIn}>
      <span className={"fa fa-" + (icon || provider)} /> Login with {text}
    </Button>
  );

  const enhance = withHandlers({
    signIn: ({ signIn, provider }) => () => signIn(provider)
  });

  return enhance(SignInButton);
})();

export const renderField = ({
  label,
  showLabel,
  type,
  className,
  input,
  meta: { touched, error, warning }
}) => (
  <FormGroup className={className}>
    {showLabel && <Label>{label}</Label>}
    <Input type={type} placeholder={label} {...input} />
    {touched &&
      ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </FormGroup>
);

export const renderCheckField = ({
  label,
  className,
  input,
  meta: { touched, error, warning },
  right
}) => (
  <FormGroup check className={className}>
    <Label check>
      {right && label}{" "}
      <Input type="checkbox" {...input} />{" "}
      {!right && label}
    </Label>
    {touched &&
      ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </FormGroup>
);

export const SignIn = ({ signIn, handleSubmit, handleLogin, handleLogout, submitting }) => (

  <Container fluid className="signin-container">
    <div className="signin-block row-divided">
      <Col xs="12" md="12" className="signin-form">
        {
          auth.isAuthenticated()
            ?
            <button
              type="button"
              className="btn btn-block btn-primary"
              disabled={submitting}
              onClick={handleLogin}
            >
              Log in / Sign up
            </button>
            :
            <button
              type="button"
              className="btn btn-block btn-primary"
              disabled={submitting}
              onClick={handleLogout}
            >
              Log out
            </button>
        }
      </Col>
    </div>
  </Container>
);

export const enhance = compose(
  connect(() => ({}), { signIn: actions.user.signIn.request }),
  withHandlers({
    onSubmit: ({ signIn }) => values => {
      console.log(values);
      signIn("password", values.toJS());
    },

    handleLogin: () => () => {
      const auth = new Auth();
      auth.login();
    },

    handleLogout: () => () => {
      const auth = new Auth();
      auth.logout();
    }
  }),
  reduxForm({ form: "signIn" })
);

export default enhance(SignIn);
