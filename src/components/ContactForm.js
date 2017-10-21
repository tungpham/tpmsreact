import React from 'react';
import { connect } from 'react-redux';
import { Row, Form, FormGroup, Input } from 'reactstrap';
import { reduxForm, Field } from 'redux-form/immutable';
import { createStructuredSelector } from 'reselect';
import { makeSelectContact } from '../selectors/app';

export const renderField = ({ label, type, className, input, meta: { touched, error, warning }}) => (
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

const validate = values => {
  const errors = {};
  if (!values.get('displayName')) {
    errors.displayName = 'Please enter display name';
  }
  if (!values.get('phoneNumber')) {
    errors.phoneNumber = 'Please enter the phone number';
  }
  return errors;
};

export class ContactForm extends React.PureComponent {
  render() {
    return (
      <Form className="profile-block" onSubmit={this.props.handleSubmit}>
        <Field
          name="displayName"
          type="text"
          component={renderField}
          label="Display Name"
        />
        <Field
          name="phoneNumber"
          type="text"
          component={renderField}
          label="Phone Number"
        />
        <Field
          name="email"
          type="email"
          component={renderField}
          label="Email (Optional)"
        />
        <Field
          name="note"
          type="text"
          component={renderField}
          label="Note (Optional)"
        />
        <Field
          name="address"
          type="text"
          component={renderField}
          label="Address (Optional)"
        />
        <Field
          name="photoUri"
          type="text"
          component={renderField}
          label="Photo uri (Optional)"
        />
        <Row className="justify-content-center">
          <div className="col-md-12">
            <button
              type="submit"
              className="btn btn-primary save-button btn-block"
              disabled={this.props.submitting || this.props.editingContact}
            >
              {(this.props.editingContact) ? 'Saving' : 'Save'}
            </button>
          </div>
        </Row>
        {(this.props.onCancelEdit) ?
          <Row className="justify-content-center">
            <div className="col-md-12">
              <button
                type="button"
                onClick={this.props.onCancelEdit}
                className="btn btn-default save-button btn-block"
              >
                Cancel
              </button>
            </div>
          </Row> : ''
        }
      </Form>
    )
  }
}

ContactForm = reduxForm({
  form: 'ContactForm',
  validate,
})(ContactForm);

const mapStateToProps = createStructuredSelector({
  initialValues: makeSelectContact() || {},
});

ContactForm = connect(mapStateToProps)(ContactForm);

export default ContactForm;
