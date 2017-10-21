import React from 'react';
import { Row, Form, FormGroup, Input } from 'reactstrap';
import { reduxForm, Field } from 'redux-form/immutable';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectUserProfile } from '../selectors/user';

export const renderField = ({label, type, className, input, meta: { touched, error, warning }}) => (
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

export class ProfileInformationForm extends React.PureComponent {
  render() {
    return (
      <div className="profile-container">
        <Form className="profile-block" onSubmit={this.props.handleSubmit}>
          <div className="profile-heading">
            Account Settings
          </div>
          <Field
            name="name"
            type="text"
            component={renderField}
            label="Name"
          />
          <Field
            name="email"
            type="email"
            component={renderField}
            label="Email"
          />
          <Field
            name="phone"
            type="text"
            component={renderField}
            label="Phone"
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
              disabled={this.props.submitting}
            >
              Save
            </button>
          </Row>
        </Form>
      </div>
    );
  }
}


ProfileInformationForm = reduxForm({
  form: 'ProfileForm',
})(ProfileInformationForm);

const mapStateToProps = createStructuredSelector({
  initialValues: makeSelectUserProfile() || {},
});

ProfileInformationForm = connect(mapStateToProps)(ProfileInformationForm);

export default ProfileInformationForm;

