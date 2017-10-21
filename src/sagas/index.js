import UserSagas from './user';
import AppSagas from './app';
import ContactSagas from './contact';

export default store => {
  AppSagas.map(saga =>  store.runSaga(saga));
  UserSagas.map(saga =>  store.runSaga(saga));
  ContactSagas.map(saga =>  store.runSaga(saga));
}