import { LOGIN_WITH_POPUP_STARTED, LOGIN_WITH_POPUP_COMPLETE } from './reducer';

export default ({ current: auth0Client }, dispatch) => async (params = {}) => {
  dispatch({ type: LOGIN_WITH_POPUP_STARTED });
  try {
    await auth0Client.loginWithPopup(params);
  } catch (error) {
    console.error(error);
  }
  const isAuthenticated = await auth0Client.isAuthenticated();
  const user = isAuthenticated && (await auth0Client.getUser());
  dispatch({ type: LOGIN_WITH_POPUP_COMPLETE, isAuthenticated, user });
};
