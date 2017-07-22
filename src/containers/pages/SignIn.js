//
import React from "react";
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
import { compose, withHandlers } from "recompose";
import actions from "../../actions";
import { email, required } from "../../lib/validators";
import { reduxForm, Field } from "redux-form/immutable";
import { NavLink as Link } from "react-router-dom";

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

export const SignIn = ({ signIn, handleSubmit, submitting }) => (
  <Container fluid className="signin-container">
    <div className="signin-block row-divided">
      <Col xs="12" md="6" className="signin-buttons">
        <SignInButton provider="facebook" text="Facebook" signIn={signIn} />
        <SignInButton provider="twitter" text="Twitter" signIn={signIn} />
        <SignInButton provider="google" text="Google" signIn={signIn} />
      </Col>
      <div className="vertical-divider">OR</div>
      <Col xs="12" md="6" className="signin-form">
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
          <Row className="signin-form-buttons">
            <Col xs="6">
              <Field
                name="rememberMe"
                className="signin-remember"
                component={renderCheckField}
                label="Remember me"
              />
            </Col>
            <Col xs="6">
              <button
                type="submit"
                className="btn btn-block btn-primary"
                disabled={submitting}
              >
                Log in
              </button>
            </Col>
          </Row>
          <Row className="links">
            <Col xs="6" className="highlighted">
              <Link to="/register">
                Register now
              </Link>
            </Col>
            <Col xs="6">
              Forgot password?
            </Col>
          </Row>
        </Form>
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
    }
  }),
  reduxForm({ form: "signIn" })
);

export default enhance(SignIn);
