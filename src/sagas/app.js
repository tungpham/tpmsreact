import { put, call, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router';
import {
  GET_ALL_PHONE_NUMBER,
  GET_CALL_LOGS,
  GET_CONVERSATIONS,
  SEND_MESSAGE,
  GET_RECORDS,
} from '../constants';
import {
  getAllPhoneNumberSuccessfully,
  getConversationsSuccessfully,
  getCallLogsSuccessfully,
  sendMessageSuccessfully,
  getRecordsSuccessfully,
} from '../actions/app';
import Fetcher from '../core/fetcher';


/**
 * Get all phone number
 * @param action
 * @return {*}
 */
function fetchAllPhoneNumber(action) {
  return Fetcher.get(`/api/v1/phone-number?userId=${action.payload.id}`);
}

function* getAllPhoneNumberHandle(action) {
  try {
    const response = yield call(fetchAllPhoneNumber, action);
    if (response.status === 200) {
      const numbers = response.response;
      numbers.map(number => number.totalUnreadMessage = 0);
      yield put(getAllPhoneNumberSuccessfully(numbers));
    }
  } catch (errors) {
    console.error(errors);
  }
}

export function* getAllPhoneNumber() {
  yield takeLatest(GET_ALL_PHONE_NUMBER, getAllPhoneNumberHandle);
}

/**
 * Get conversations
 * @param action
 * @return {*}
 */
function fetchConversations(action) {
  let params = '';
  params += `?account_sid=${action.payload.auth.userMetadata.sid}`;
  params += `&auth_token=${action.payload.auth.userMetadata.auth_token}`;
  params += `&phone_number=${encodeURIComponent(action.payload.phoneNumber)}`;
  params += `&phone_number_id=${encodeURIComponent(action.payload.phoneNumberId)}`;
  params += '&page_incoming=first';
  params += '&page_outgoing=first';
  return Fetcher.get(`/api/v1/message/retrieve${params}`);
}

function* getConversationsHandle(action) {
  try {
    const response = yield call(fetchConversations, action);
    if (response.status === 200) {
      yield put(getConversationsSuccessfully(response.response));
    }
  } catch (errors) {
    console.error(errors);
  }
}

export function* getConversations() {
  yield takeLatest(GET_CONVERSATIONS, getConversationsHandle);
}

/**
 * Get call logs
 * @param action
 * @return {*}
 */
function fetchCallLogs(action) {
  let params = '';
  params += `?account_sid=${action.payload.auth.userMetadata.sid}`;
  params += `&auth_token=${action.payload.auth.userMetadata.auth_token}`;
  params += `&phone_number=${encodeURIComponent(action.payload.phoneNumber)}`;
  params += '&page_incoming=first';
  params += '&page_outgoing=first';
  return Fetcher.get(`/api/v1/call/logs${params}`);
}

function* getCallLogsHandle(action) {
  try {
    const response = yield call(fetchCallLogs, action);
    if (response.status === 200) {
      const records = {};
      response.response.records.map(r => {
        const phoneNumber = (r.to !== action.payload.phoneNumber) ? r.to : r.from;
        if (typeof records[phoneNumber] === 'undefined') {
          records[phoneNumber] = {
            phone_number: phoneNumber,
            items: [r]
          }
        } else {
          records[phoneNumber].items.push(r);
        }
      });

      response.response.records = [];

      for(let i in records) {
        response.response.records.push(records[i]);
      }

      yield put(getCallLogsSuccessfully(response.response));
    }
  } catch (errors) {
    console.error(errors);
  }
}

export function* getCallLogs() {
  yield takeLatest(GET_CALL_LOGS, getCallLogsHandle);
}

/**
 * Get call records
 * @param action
 * @return {*}
 */
function fetchRecords(action) {
  let params = '';
  params += `?account_sid=${action.payload.auth.userMetadata.sid}`;
  params += `&auth_token=${action.payload.auth.userMetadata.auth_token}`;
  params += `&phone_number=${encodeURIComponent(action.payload.phoneNumber)}`;
  params += '&page=first';
  return Fetcher.get(`/api/v1/call/records${params}`);
}

function* getRecordsHandle(action) {
  try {
    const res = yield call(fetchRecords, action);
    if (res.status === 200) {
      yield put(getRecordsSuccessfully(res.response));
    }
  } catch (errors) {
    console.error(errors);
  }
}

export function* getRecords() {
  yield takeLatest(GET_RECORDS, getRecordsHandle);
}

/**
 * Send message
 * @param action
 * @return {*}
 */
function fetchSendMessage(action) {
  const body = {
    account_sid: action.payload.auth.userMetadata.sid,
    auth_token: action.payload.auth.userMetadata.auth_token,
    userId: action.payload.auth.user.id,
    from: action.payload.from,
    to: action.payload.to,
    body: action.payload.body,
    date_sent: `${new Date().getTime()}`,
    group_id: '',
  };
  return Fetcher.post(`/api/v1/message/send-message`, body, false);
}

function* sendMessageHandle(action) {
  try {
    const response = yield call(fetchSendMessage, action);
    if (response.status >= 200 && response.status <= 300) {
      yield put(sendMessageSuccessfully(response.response[0]));
      action.payload.history.push(`/dashboard/${action.payload.from}/conversation/${action.payload.to}`);
    }
  } catch (errors) {
    console.error(errors);
  }
}

export function* sendMessage() {
  yield takeLatest(SEND_MESSAGE, sendMessageHandle);
}


export default [
  getAllPhoneNumber,
  getConversations,
  getCallLogs,
  sendMessage,
  getRecords,
];
