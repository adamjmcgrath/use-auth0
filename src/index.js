import React, { useRef, useEffect, useContext, useReducer } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import reducer, { INITIALISED } from './reducer';
import loginWithPopup from './login-with-popup';

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

// Identify the `code` parameter in a query string.
const CODE_PARAM_RE = /[\?&#]code=[^&]+/;

export const Auth0Context = React.createContext();

export const useAuth0 = () => useContext(Auth0Context);

export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  queryString = window.location.search,
  ...initOptions
}) => {
  const [authState, dispatch] = useReducer(reducer, {
    loading: true,
    popupOpen: false,
  });
  const auth0ClientRef = useRef(null);

  useEffect(() => {
    (async () => {
      const auth0Client =
        auth0ClientRef.current = await createAuth0Client(initOptions);

      if (CODE_PARAM_RE.test(queryString)) {
        const { appState } = await auth0Client.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0Client.isAuthenticated();
      const user = isAuthenticated && await auth0Client.getUser();

      dispatch({ type: INITIALISED, isAuthenticated, user });
    })();
  }, []);

  const auth0Client = auth0ClientRef.current;
  return (
    <Auth0Context.Provider value={{
      ...authState,
      loginWithPopup: loginWithPopup(auth0ClientRef, dispatch),
      getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
      loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
      getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
      getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
      logout: (...p) => auth0Client.logout(...p),
    }}>
      {children}
    </Auth0Context.Provider>
  );
};