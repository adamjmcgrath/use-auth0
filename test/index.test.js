import React from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import {
  cleanup,
  render,
  waitForDomChange,
  fireEvent
} from '@testing-library/react';
import { Auth0Provider, useAuth0 } from '../src/index';

jest.mock('@auth0/auth0-spa-js');

describe('index', () => {
  afterEach(cleanup);

  it('should create client with initial props', async () => {
    createAuth0Client.mockResolvedValue({
      isAuthenticated: jest.fn()
    });
    render(
      <Auth0Provider domain="foo" client_id="bar" redirect_uri="baz">
        <Component />
      </Auth0Provider>
    );
    await waitForDomChange();
    expect(createAuth0Client).toHaveBeenCalledWith({
      domain: 'foo',
      client_id: 'bar',
      redirect_uri: 'baz'
    });
  });

  it('should handle the redirect callback', async () => {
    const cb = jest.fn();
    const handleRedirectCallback = jest
      .fn()
      .mockResolvedValue({ appState: 'foo' });
    createAuth0Client.mockResolvedValue({
      isAuthenticated: jest.fn(),
      handleRedirectCallback
    });
    render(
      <Auth0Provider onRedirectCallback={cb} queryString="?code=my-code">
        <Component />
      </Auth0Provider>
    );
    await waitForDomChange();
    expect(handleRedirectCallback).toHaveBeenCalled();
    expect(cb).toHaveBeenCalledWith('foo');
  });

  it('should only handle the redirect with the correct param', async () => {
    const cb = jest.fn();
    const handleRedirectCallback = jest
      .fn()
      .mockResolvedValue({ appState: 'foo' });
    createAuth0Client.mockResolvedValue({
      isAuthenticated: jest.fn(),
      handleRedirectCallback
    });
    render(
      <Auth0Provider
        onRedirectCallback={cb}
        queryString="?some-other-code=my-code"
      >
        <Component />
      </Auth0Provider>
    );
    await waitForDomChange();
    expect(handleRedirectCallback).not.toHaveBeenCalled();
    expect(cb).not.toHaveBeenCalled();
  });

  it('should provide initial auth state', async () => {
    createAuth0Client.mockResolvedValue({
      isAuthenticated: jest.fn().mockResolvedValue(false)
    });
    const { getByText } = render(
      <Auth0Provider>
        <Component />
      </Auth0Provider>
    );
    expect(getByText('loading: true')).toBeTruthy();
    await waitForDomChange();
    expect(getByText('loading: false')).toBeTruthy();
  });

  it('should authenticate user', async () => {
    createAuth0Client.mockResolvedValue({
      isAuthenticated: jest.fn().mockResolvedValue(true),
      getUser: jest.fn().mockResolvedValue('Bob')
    });
    const { getByText } = render(
      <Auth0Provider>
        <Component />
      </Auth0Provider>
    );
    await waitForDomChange();
    expect(getByText('authenticated: true')).toBeTruthy();
    expect(getByText('user: Bob')).toBeTruthy();
  });

  it('should expose api methods', async () => {
    const getIdTokenClaims = jest.fn();
    const loginWithRedirect = jest.fn();
    const getTokenSilently = jest.fn();
    const getTokenWithPopup = jest.fn();
    const logout = jest.fn();

    createAuth0Client.mockResolvedValue({
      isAuthenticated: jest.fn(),
      getIdTokenClaims,
      loginWithRedirect,
      getTokenSilently,
      getTokenWithPopup,
      logout
    });
    const { getByText } = render(
      <Auth0Provider>
        <Component />
      </Auth0Provider>
    );
    await waitForDomChange();
    fireEvent.click(getByText('getIdTokenClaims'));
    fireEvent.click(getByText('loginWithRedirect'));
    fireEvent.click(getByText('getTokenSilently'));
    fireEvent.click(getByText('getTokenWithPopup'));
    fireEvent.click(getByText('logout'));

    expect(getIdTokenClaims).toHaveBeenCalledWith('bar');
    expect(loginWithRedirect).toHaveBeenCalledWith('baz');
    expect(getTokenSilently).toHaveBeenCalledWith('qux');
    expect(getTokenWithPopup).toHaveBeenCalledWith('quux');
    expect(logout).toHaveBeenCalledWith('quuux');
  });

  it('should login with a popup', async () => {
    const loginWithPopup = jest.fn();
    createAuth0Client.mockResolvedValue({
      isAuthenticated: jest.fn().mockResolvedValue(true),
      getUser: jest.fn().mockResolvedValue('Bob'),
      loginWithPopup
    });
    const { getByText } = render(
      <Auth0Provider>
        <Component />
      </Auth0Provider>
    );
    await waitForDomChange();
    fireEvent.click(getByText('loginWithPopup'));
    expect(loginWithPopup).toHaveBeenCalledWith('foo');
    expect(getByText('popupOpen: true')).toBeTruthy();
    await waitForDomChange();
    expect(getByText('popupOpen: false')).toBeTruthy();
    expect(getByText('authenticated: true')).toBeTruthy();
    expect(getByText('user: Bob')).toBeTruthy();
  });
});

function Component() {
  const {
    loading,
    popupOpen,
    user,
    isAuthenticated,
    loginWithPopup,
    getIdTokenClaims,
    loginWithRedirect,
    getTokenSilently,
    getTokenWithPopup,
    logout
  } = useAuth0();
  return (
    <ul>
      <li>loading: {`${loading}`}</li>
      <li>popupOpen: {`${popupOpen}`}</li>
      <li>authenticated: {`${isAuthenticated}`}</li>
      <li>user: {user}</li>
      <li>
        <button id="login-with-popup" onClick={() => loginWithPopup('foo')}>
          loginWithPopup
        </button>
      </li>
      <li>
        <button
          id="get-id-token-claims"
          onClick={() => getIdTokenClaims('bar')}
        >
          getIdTokenClaims
        </button>
      </li>
      <li>
        <button
          id="login-with-redirect"
          onClick={() => loginWithRedirect('baz')}
        >
          loginWithRedirect
        </button>
      </li>
      <li>
        <button id="get-token-silently" onClick={() => getTokenSilently('qux')}>
          getTokenSilently
        </button>
      </li>
      <li>
        <button
          id="get-token-with-popup"
          onClick={() => getTokenWithPopup('quux')}
        >
          getTokenWithPopup
        </button>
      </li>
      <li>
        <button id="logout" onClick={() => logout('quuux')}>
          logout
        </button>
      </li>
    </ul>
  );
}
