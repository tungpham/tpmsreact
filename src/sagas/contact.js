import { put, call, takeLatest } from 'redux-saga/effects';
import { reset } from 'redux-form';
import {
  GET_CONTACTS,
  CREATE_CONTACT,
  DELETE_CONTACT,
} from '../constants';
import {
  createContactSuccessfully,
  getContactsSuccessfully,
  updateContactSuccessfully,
  deleteContactSuccessfully,
} from '../actions/app';
import Fetcher from '../core/fetcher';
import NotificationCenter from '../core/notification';

/**
 * Get all contact
 * @param action
 * @return {*}
 */
function fetchContacts(action) {
  return Fetcher.get(`/api/v1/contact?phone_number_id=${action.payload.phoneNumberId}`);
}

function* getContactsHandle(action) {
  try {
    const response = yield call(fetchContacts, action);
    if (response.status === 200) {
      yield put(getContactsSuccessfully(response.response));
    }
  } catch (errors) {
    console.error(errors);
  }
}

export function* getContacts() {
  yield takeLatest(GET_CONTACTS, getContactsHandle);
}


/**
 * Create, update contact
 * @param action
 * @return {*}
 */
function fetchCreateContact(action) {
  return Fetcher.post('/api/v1/contact', action.payload, true);
}

function fetchUpdateContact(action) {
  return Fetcher.put('/api/v1/contact', action.payload, true);
}

function* getCreateContactHandle(action) {
  try {
    if (action.payload.id) {
      const response = yield call(fetchUpdateContact, action);
      if (response.status === 200 || response.status === 201) {
        yield put(updateContactSuccessfully(response.response));
        yield put(reset('ContactForm'));
        NotificationCenter.success('Update contact successfully!')
      }
    } else {
      const response = yield call(fetchCreateContact, action);
      if (response.status === 200 || response.status === 201) {
        yield put(createContactSuccessfully(response.response));
        yield put(reset('ContactForm'));
        NotificationCenter.success('Create contact successfully!')
      }
    }
  } catch (errors) {
    NotificationCenter.somethingLookLikeWentWrong();
  }
}

export function* createContact() {
  yield takeLatest(CREATE_CONTACT, getCreateContactHandle);
}



/**
 * Delete contact
 * @param action
 * @return {*}
 */
function fetchDeleteContact(action) {
  return Fetcher.Delete(`/api/v1/contact/${action.payload.contactId}`);
}

function* deleteContactHandle(action) {
  try {
    const response = yield call(fetchDeleteContact, action);
    yield put(deleteContactSuccessfully(response.response));
    action.payload.history.push(`/dashboard/${action.payload.from}/contacts`);
    NotificationCenter.success('Delete contact successfully!')
  } catch (errors) {
    NotificationCenter.somethingLookLikeWentWrong();
  }
}

export function* deleteContact() {
  yield takeLatest(DELETE_CONTACT, deleteContactHandle);
}

export default [
  getContacts,
  createContact,
  deleteContact,
];
