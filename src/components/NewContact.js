import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { makeSelectUserProfile } from '../selectors/user';
import { makeSelectNumbers } from '../selectors/app';
import { createContact } from '../actions/app';
import ContactForm from './ContactForm';


export class NewContact extends React.PureComponent {

  constructor(props) {
    super(props);
    this.submitContact = this.submitContact.bind(this);
  }

  submitContact(values) {
    const data = {};
    values.map((value, key) => data[key] = value);
    data.userId = this.props.auth.user.id;
    data.createdAt = 0;
    data.updatedAt = 0;
    data.birthday = data.birthday || '';
    data.address = data.address || '';
    data.photoUri = data.photoUri || '';
    const phoneNumber = this.props.numbers.find(number => number.phoneNumber === this.props.number);
    if (phoneNumber && typeof phoneNumber !== 'undefined') {
      data.phoneNumberId = phoneNumber.id;
    }
    this.props.dispatch(createContact(data));
  }


  render() {
    return (
      <div className={"flex-column cc__container"}>
        <h1 className="cc__container__title">
          Create new contact
        </h1>
        <hr />
        <div className="cc__container__form">
          <ContactForm onSubmit={this.submitContact} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectUserProfile(),
  numbers: makeSelectNumbers(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewContact);
