import React from "react";
import { Row, Form, FormGroup, Input } from "reactstrap";
import { reduxForm, Field } from "redux-form/immutable";
import { compose, withHandlers } from "recompose";
import { connect } from "react-redux";
import { email, required } from "../../lib/validators";
import actions from "../../actions";

export const renderField = ({
  label,
  type,
  className,
  input,
  meta: { touched, error, warning }
}) => (
  <FormGroup className={className}>
    <div className="profile-input">
      <div className="profile-label">
        {label}
      </div>
      <Input type={type} {...input} />
    </div>
    {touched &&
      ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </FormGroup>
);

export const Profile = ({ submitting, handleSubmit }) => (
  <div className="profile-container">
    <Form className="profile-block" onSubmit={handleSubmit}>
      <div className="profile-heading">
        Account Settings
      </div>
      <Field
        name="name"
        type="text"
        component={renderField}
        label="Name"
        validate={required}
      />
      <Field
        name="email"
        type="email"
        component={renderField}
        label="Email"
        validate={[required, email]}
      />
      <Field
        name="phone"
        type="text"
        component={renderField}
        label="Phone"
        validate={required}
        className="input-space"
      />
      <Field
        name="oldPassword"
        type="password"
        component={renderField}
        label="Old password"
      />
      <Field
        name="newPassword"
        type="password"
        component={renderField}
        label="New password"
      />
      <Field
        name="confirmPassword"
        type="password"
        component={renderField}
        label="Confirm password"
      />
      <Row className="justify-content-center">
        <button
          type="submit"
          className="btn btn-primary save-button"
          disabled={submitting}
        >
          Save
        </button>
      </Row>
    </Form>
  </div>
);

export const enhance = compose(
  connect(state => ({ initialValues: state.user.data })),
  withHandlers({
    onSubmit: ({ dispatch }) => values => {
      dispatch(actions.user.edit.request(values.toJS()));
    }
  }),
  reduxForm({ form: "profile" })
);

export default enhance(Profile);
