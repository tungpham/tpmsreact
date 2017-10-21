const makeSelectUserProfile = () => (state) => state.get('user').toJS().profile;
const makeSelectAuthenticated = () => (state) => state.get('user').toJS().authenticated;

export {
  makeSelectUserProfile,
  makeSelectAuthenticated,
}