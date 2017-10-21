import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { makeSelectUserProfile } from '../selectors/user';
import { makeSelectNumbers, makeSelectContact } from '../selectors/app';
import { createContact, deleteContact, makeCall } from '../actions/app';
import ContactForm from '../components/ContactForm';


export class ContactView extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      editContact: false,
      editingContact: false,
    };
    this.submitContact = this.submitContact.bind(this);
    this.editContact = this.editContact.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
    this.makeCall = this.makeCall.bind(this);
  }

  submitContact(values) {
    const data = {};
    values.map((value, key) => data[key] = value);
    data.userId = this.props.auth.user.id;
    const phoneNumber = this.props.numbers.find(number => number.phoneNumber === this.props.number);
    if (phoneNumber && typeof phoneNumber !== 'undefined') {
      data.phoneNumberId = phoneNumber.id;
    }
    this.props.dispatch(createContact(data));
    this.setState({ ...this.state, editingContact: true });
    setTimeout(() => {
      this.setState({ ...this.state, editContact: false, editingContact: false });
    }, 2000);
  }

  editContact() {
    this.setState({ ...this.state, editContact: true });
  }

  cancelEdit() {
    this.setState({ ...this.state, editContact: false });
  }

  deleteContact() {
    if (confirm('Are you sure to delete this contact!')) {
      this.props.dispatch(deleteContact(this.props.contact.id));
    }
  }

  makeCall() {
    this.props.dispatch(makeCall({
      from: this.props.number,
      to: this.props.contact.phoneNumber,
    }));
  }

  render() {
    return (
      <div className={"flex-column cc__container"}>
        {(this.props.contact) ?
          <div>
            <h1 className="cc__container__title">
              {this.props.contact.displayName}
            </h1>
            <hr />
            {(this.state.editContact) ?
              <div className="cc__container__form">
                <ContactForm
                  onSubmit={this.submitContact}
                  contactId={this.props.contact.id}
                  editingContact={this.state.editingContact}
                  onCancelEdit={this.cancelEdit}
                />
              </div> :
              <div className="cc__container__body">
                <ul className="list-group">
                  <a className="list-group-item list-group-item-action flex-column align-items-start">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">Phone number:</h6>
                    </div>
                    <p className="mb-1">{this.props.contact.phoneNumber}</p>
                  </a>
                  <a className="list-group-item list-group-item-action flex-column align-items-start">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">Email:</h6>
                    </div>
                    <p className="mb-1">{this.props.contact.email}</p>
                  </a>
                  <a className="list-group-item list-group-item-action flex-column align-items-start">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">Address:</h6>
                    </div>
                    <p className="mb-1">{this.props.contact.address}</p>
                  </a>
                  <a className="list-group-item list-group-item-action flex-column align-items-start">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">Birthday:</h6>
                    </div>
                    <p className="mb-1">{this.props.contact.birthday}</p>
                  </a>
                  <a className="list-group-item list-group-item-action flex-column align-items-start">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">Note:</h6>
                    </div>
                    <p className="mb-1">{this.props.contact.note}</p>
                  </a>
                </ul>
                <div className="col-md-12 call-view text-center">
                  <div className="buttons-border-row justify-content-center">
                    <i className="fa fa-phone icon" onClick={this.makeCall} />
                    <i className="fa fa-comment icon" />
                    <i className="fa fa-pencil icon" onClick={this.editContact} />
                    <i className="fa fa-trash icon" onClick={this.deleteContact} />
                  </div>
                </div>
              </div>
            }
          </div> : ''
        }
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectUserProfile(),
  contact: makeSelectContact(),
  numbers: makeSelectNumbers(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactView);
