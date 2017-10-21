const makeSelectAppFetched = () => (state) => state.get('app').toJS().profile;
const makeSelectNumbers = () => (state) => state.get('app').toJS().numbers;
const makeSelectConversations = () => (state) => state.get('app').toJS().conversations;
const makeSelectCallLogs = () => (state) => state.get('app').toJS().callLogs;
const makeSelectContacts = () => (state) => {
  const contact = state.getIn(['app', 'contacts']).toJS();
  contact.items.reverse();
  return contact;
};
const makeSelectEditContactData = () => (state) => state.getIn(['app', 'editContactData']).toJS();
const makeSelectCallCenter = () => (state) => state.getIn(['app', 'callCenter']).toJS();

const makeSelectConversationMessages = () => (state, props) => {
  const records = state.get('app').toJS().conversations.records;
  if (records.length === 0) {
    return [];
  }
  const record = state.get('app').toJS().conversations.records.find(chat => chat.phone_number === props.match.params.conversation);
  return record.message_items || [];
};

const makeSelectRecord = () => (state, props) => {
  const callRecords = state.getIn(['app', 'callRecords']).toJS();
  if (callRecords.records.length === 0 || !callRecords.records) {
    return null;
  }
  const record = callRecords.records.find(chat => chat.sid === props.to);
  return record || null;
};

const makeSelectRecords = () => state => {
  const callRecords = state.getIn(['app', 'callRecords']).toJS();
  if (callRecords.records.length === 0 || !callRecords.records) {
    return { records: [] };
  }
  return callRecords || { records: [] };
};

const makeSelectContact = () => (state, { contactId }) => {
  const contacts = state.getIn(['app', 'contacts', 'items']).toJS();
  if (contacts.length === 0 || !contacts) {
    return null;
  }
  const contact = contacts.find(contact => contact.id === contactId);
  return contact || null;
};

export {
  makeSelectAppFetched,
  makeSelectNumbers,
  makeSelectConversations,
  makeSelectCallLogs,
  makeSelectConversationMessages,
  makeSelectRecord,
  makeSelectContacts,
  makeSelectRecords,
  makeSelectCallCenter,
  makeSelectContact,
  makeSelectEditContactData,
}
