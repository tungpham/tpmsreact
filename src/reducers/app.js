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
      return state.update('contacts', contacts => contacts.push(action.payload));

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

    case types.UPDATE_CONTACT_SUCCESSFULLY:
      const contacts = state.get('contacts').toJS();
      const currentContact = contacts.find(contact => contact.id === action.payload.id);
      return state.setIn(['contacts', contacts.indexOf(currentContact)], action.payload);

    case types.DELETE_CONTACT_SUCCESSFULLY:
      return state.update('contacts',
        contacts => contacts.splice(contacts.indexOf(getCurrentContact(state.get('contacts').toJS(), action.payload)) , 1)
      );

    default:
      return state;
  }
}

export default AppReducer;
