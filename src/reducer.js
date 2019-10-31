export const INITIALISED = 'INITIALISED';
export const LOGIN_WITH_POPUP_STARTED = 'LOGIN_WITH_POPUP_STARTED';
export const LOGIN_WITH_POPUP_COMPLETE = 'LOGIN_WITH_POPUP_COMPLETE';

export default (state, { type, isAuthenticated, user }) => {
  switch (type) {
    case INITIALISED:
      return {
        ...state,
        isAuthenticated,
        user,
        loading: false
      };
    case LOGIN_WITH_POPUP_STARTED:
      return {
        ...state,
        popupOpen: true
      };
    case LOGIN_WITH_POPUP_COMPLETE:
      return {
        ...state,
        isAuthenticated,
        user,
        popupOpen: false
      };
    default:
      throw new Error(`Unrecognized action type: '${type}'`);
  }
};
