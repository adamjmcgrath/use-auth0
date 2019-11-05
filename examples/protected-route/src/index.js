import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import App from './App';
import { Auth0Provider } from '@adamjmcgrath/use-auth0';
import history from './history';

// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
  history.replace(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    client_id={process.env.REACT_APP_AUTH0_CLIENT_ID}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);
