import * as types from '../constants';

export function getAllPhoneNumber(payload) {
  return {
    type: types.GET_ALL_PHONE_NUMBER,
    payload
  };
}

export function getAllPhoneNumberSuccessfully(payload) {
  return {
    type: types.GET_ALL_PHONE_NUMBER_SUCCESSFULLY,
    payload
  };
}

export function getConversations(payload) {
  return {
    type: types.GET_CONVERSATIONS,
    payload
  };
}

export function getConversationsSuccessfully(payload) {
  return {
    type: types.GET_CONVERSATIONS_SUCCESSFULLY,
    payload
  };
}

export function getCallLogs(payload) {
  return {
    type: types.GET_CALL_LOGS,
    payload
  };
}

export function getCallLogsSuccessfully(payload) {
  return {
    type: types.GET_CALL_LOGS_SUCCESSFULLY,
    payload
  };
}

export function getRecords(payload) {
  return {
    type: types.GET_RECORDS,
    payload
  };
}

export function getRecordsSuccessfully(payload) {
  return {
    type: types.GET_RECORDS_SUCCESSFULLY,
    payload
  };
}

export function getContacts(payload) {
  return {
    type: types.GET_CONTACTS,
    payload
  };
}

export function getContactsSuccessfully(payload) {
  return {
    type: types.GET_CONTACTS_SUCCESSFULLY,
    payload
  };
}

export function sendMessage(payload) {
  return {
    type: types.SEND_MESSAGE,
    payload
  };
}

export function sendMessageSuccessfully(payload) {
  return {
    type: types.SEND_MESSAGE_SUCCESSFULLY,
    payload
  };
}

export function createContact(payload) {
  return {
    type: types.CREATE_CONTACT,
    payload
  };
}

export function createContactSuccessfully(payload) {
  return {
    type: types.CREATE_CONTACT_SUCCESSFULLY,
    payload
  };
}

export function deleteContact(payload) {
  return {
    type: types.DELETE_CONTACT,
    payload
  };
}

export function deleteContactSuccessfully(payload) {
  return {
    type: types.DELETE_CONTACT_SUCCESSFULLY,
    payload
  };
}

export function updateContactSuccessfully(payload) {
  return {
    type: types.UPDATE_CONTACT_SUCCESSFULLY,
    payload
  };
}

export function makeCall(payload) {
  return {
    type: types.MAKE_CALL,
    payload
  };
}

export function closeCall(payload) {
  return {
    type: types.CLOSE_CALL,
    payload
  };
}

