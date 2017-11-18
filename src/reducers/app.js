import { fromJS } from 'immutable';
import * as types from '../constants';

const initialState = fromJS({
  appFetched: false,
  numbers: [

  ],
  conversations: {
    loading: false,
    records: [],
  },
  callLogs: {
    loading: false,
    records: [],
  },
  callRecords: fromJS({
    loading: false,
    records: [],
  }),
  contacts: {
    loading: false,
    items: [],
  },
  callCenter: {
    calling: false,
    from: '',
    to: ''
  },
  editContactData: {},
});

const getCurrentContact = (contacts, contactId) => {
  return contacts.find(contact => contact.id === contactId);
};

const conversationRecordIndexByPhoneNumber = (records, phoneNumber) => {
  return records.indexOf(records.find(record => record.phone_number === phoneNumber));
};

const getNumberIndexByPhoneNumber = (numbers, phoneNumber) => {
  return numbers.indexOf(numbers.find(number => number.phoneNumber === phoneNumber));
};

function AppReducer(state = initialState, action) {
  switch (action.type) {

    case types.APP_FETCHED:
      return state
        .set('appFetched', true);

    case types.GET_ALL_PHONE_NUMBER_SUCCESSFULLY:
      return state
        .set('numbers', fromJS(action.payload));

    case types.GET_CONVERSATIONS:
      return state.setIn(['conversations', 'loading'], true);

    case types.GET_CONVERSATIONS_SUCCESSFULLY:
      return state
        .set('conversations', fromJS(action.payload)).setIn(['conversations', 'loading'], false);

    case types.GET_CALL_LOGS:
      return state.setIn(['callLogs', 'loading'], true);

    case types.GET_CALL_LOGS_SUCCESSFULLY:
      return state
        .set('callLogs', fromJS(action.payload)).setIn(['callLogs', 'loading'], false);

    case types.GET_RECORDS:
      return state.setIn(['callRecords', 'loading'], true);

    case types.GET_RECORDS_SUCCESSFULLY:
      return state
        .set('callRecords', fromJS(action.payload)).setIn(['callRecords', 'loading'], false);

    case types.GET_CONTACTS:
      return state.setIn(['contacts', 'loading'], true);

    case types.GET_CONTACTS_SUCCESSFULLY:
      return state
        .setIn(['contacts', 'items'], fromJS(action.payload)).setIn(['contacts', 'loading'], false);

    case types.CREATE_CONTACT_SUCCESSFULLY:
      return state.updateIn(['contacts', 'items'], contacts => contacts.push(action.payload));

    case types.MAKE_CALL:
      return state
        .setIn(['callCenter', 'calling'], true)
        .setIn(['callCenter', 'from'], action.payload.from)
        .setIn(['callCenter', 'to'], action.payload.to);

    case types.CLOSE_CALL:
      return state
        .setIn(['callCenter', 'calling'], false)
        .setIn(['callCenter', 'from'], '')
        .setIn(['callCenter', 'to'], '');

    case types.SEND_MESSAGE_SUCCESSFULLY:
      const conversationRecords = state.getIn(['conversations', 'records']).toJS();
      const index = conversationRecords.indexOf(conversationRecords.find(record => record.phone_number === action.payload.to));
      if (index > -1) {
        return state.updateIn(['conversations', 'records', index, 'message_items'], messages => messages.push({...action.payload, date_sent: new Date()}));
      }
      return state.updateIn(['conversations', 'records'],
        records => records.push({ phone_number: action.payload.to, message_items: [...[], {...action.payload, date_sent: new Date()}] }));

    case types.UPDATE_CONTACT_SUCCESSFULLY:
      const contacts = state.getIn(['contacts', 'items']).toJS();
      const currentContact = contacts.find(contact => contact.id === action.payload.id);
      return state.setIn(['contacts', 'items', contacts.indexOf(currentContact)], action.payload);

    case types.DELETE_CONTACT_SUCCESSFULLY:
      return state.updateIn(['contacts', 'items'],
        contacts => contacts.splice(contacts.indexOf(getCurrentContact(state.getIn(['contacts', 'items']).toJS(), action.payload)) , 1)
      );

    case types.CLEAR_UNREAD_MESSAGE_COUNT:
      const phoneNumberIndex = getNumberIndexByPhoneNumber(state.get('numbers').toJS(), action.payload);
      if (phoneNumberIndex > -1) {
        return state.setIn(['numbers', phoneNumberIndex, 'totalUnreadMessage'], 0);
      }
      return state;

    case types.RECEIVED_NEW_MESSAGE:
      const numbers = state.get('numbers').toJS();
      const toNumber = numbers.find(number => number.phoneNumber === action.payload.from);
      const conversationIndex = conversationRecordIndexByPhoneNumber(state.getIn(['conversations', 'records']).toJS(), action.payload.from);
      if (toNumber && conversationIndex > -1) {
        return state.updateIn(['numbers', numbers.indexOf(toNumber), 'totalUnreadMessage'], total => total + 1)
          .updateIn(['conversations', 'records', conversationIndex, 'message_items'],
            messages => (messages && !messages.toJS().find(item => item.sid === action.payload.sid)) ? messages.push({...action.payload, date_sent: new Date()}) : messages);
      } else if (conversationIndex === -1) {
        return state.updateIn(['numbers', numbers.indexOf(toNumber), 'totalUnreadMessage'], total => total + 1);
      }
      return state;

    default:
      return state;
  }
}

export default AppReducer;
