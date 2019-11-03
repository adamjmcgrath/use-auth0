# @adamjmcgrath/use-auth0

React Hooks library for use with the Auth0 API https://auth0.com

## Installation

```sh
npm install @adamjmcgrath/use-auth0
```

## Getting started

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Auth0Provider } from '@adamjmcgrath/use-auth0';

ReactDOM.render(
  <Auth0Provider
    domain={YOUR_AUTH0_DOMAIN}
    client_id={YOUR_AUTH0_CLIENT_ID}
    redirect_uri={window.location.origin}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);
```

```js
// src/App.js
import React from 'react';
import { useAuth0 } from '@adamjmcgrath/use-auth0';

function App() {
  const {
    loading,
    isAuthenticated,
    user,
    loginWithRedirect,
    logout
  } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (isAuthenticated) {
    return (
      <div>
        Hello {user.name} <button onClick={logout}>Log out</button>
      </div>
    );
  } else {
    return <button onClick={loginWithRedirect}>Log in</button>;
  }
}

export default App;
```

## API

### Auth0Provider

```jsx
<Auth0Provider
  domain={domain} // {string} Your Auth0 domain
  client_id={clientId} // {string} Your Auth0 clientId
  redirect_uri={uri} // {string} Your redirect uri (usually the current url)
  onRedirectCallback={callback} // {function} (optional) Additional behaviour on auth redirection
>
  <App />
</Auth0Provider>
```

### useAuth0

```js
const {
  isAuthenticated, // {boolean} If the user is authenticated or not
  user, // {object} User profile information
  loading, // {boolean} If the auth library is loading or not
  popupOpen, // {boolean} If the auth pop is open or not
  loginWithPopup, // {function} Login via a popup
  loginWithRedirect, // {function} Login via a redirect
  getIdTokenClaims, // {function} Get claims from the id_token if available
  getTokenSilently, // {function} Get token via an iframe
  getTokenWithPopup, // {function} Get token via a popup
  logout // {function} Log the user out
} = useAuth0();
```

### See also:

- https://auth0.com/why-auth0
- https://github.com/auth0/auth0-spa-js
