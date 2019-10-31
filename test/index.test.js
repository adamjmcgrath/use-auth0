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

function Component() {
  const { loading, popupOpen, user, isAuthenticated } = useAuth0();
  return (<ul>
    <li>loading: {`${loading}`}</li>
    <li>popupOpen: {`${popupOpen}`}</li>
    <li>authenticated: {`${isAuthenticated}`}</li>
    <li>user: {user}</li>
  </ul>)
}

describe('index', () => {

  afterEach(cleanup);

  it('should create client with initial props', async () => {
    createAuth0Client.mockResolvedValue({
      isAuthenticated: jest.fn(),
    });
    render((
      <Auth0Provider
        domain='foo'
        client_id='bar'
        redirect_uri='baz'>
        <Component />
      </Auth0Provider>
    ));
    await waitForDomChange();
    expect(createAuth0Client).toHaveBeenCalledWith({
      domain: 'foo',
      client_id: 'bar',
      redirect_uri: 'baz'
    });
  });

  it('should handle the redirect callback', async () => {
    const cb = jest.fn();
    const handleRedirectCallback =
      jest.fn().mockResolvedValue({ appState: 'foo' });
    createAuth0Client.mockResolvedValue({
      isAuthenticated: jest.fn(),
      handleRedirectCallback
    });
    render((
      <Auth0Provider
        onRedirectCallback={cb}
        queryString='?code=my-code'>
        <Component />
      </Auth0Provider>
    ));
    await waitForDomChange();
    expect(handleRedirectCallback).toHaveBeenCalled();
    expect(cb).toHaveBeenCalledWith('foo');
  });

  it('should only handle the redirect with the correct param', async () => {
    const cb = jest.fn();
    const handleRedirectCallback =
      jest.fn().mockResolvedValue({ appState: 'foo' });
    createAuth0Client.mockResolvedValue({
      isAuthenticated: jest.fn(),
      handleRedirectCallback
    });
    render((
      <Auth0Provider
        onRedirectCallback={cb}
        queryString='?some-other-code=my-code'>
        <Component />
      </Auth0Provider>
    ));
    await waitForDomChange();
    expect(handleRedirectCallback).not.toHaveBeenCalled();
    expect(cb).not.toHaveBeenCalled();
  });

  it('should provide initial auth state', async () => {
    createAuth0Client.mockResolvedValue({
      isAuthenticated: jest.fn().mockResolvedValue(false),
    });
    const { getByText } = render(<Auth0Provider><Component /></Auth0Provider>);
    expect(getByText('loading: true')).toBeTruthy();
    await waitForDomChange();
    expect(getByText('loading: false')).toBeTruthy();
  });

  it('should authenticate user', async () => {
    createAuth0Client.mockResolvedValue({
      isAuthenticated: jest.fn().mockResolvedValue(true),
      getUser: jest.fn().mockResolvedValue('Bob'),
    });
    const { getByText } = render(<Auth0Provider><Component /></Auth0Provider>);
    await waitForDomChange();
    expect(getByText('authenticated: true')).toBeTruthy();
    expect(getByText('user: Bob')).toBeTruthy();
  });

  it('should expose api methods', async () => {
    function OtherComponent() {
      const {
        loading,
        getIdTokenClaims,
        loginWithRedirect,
        getTokenSilently,
        getTokenWithPopup,
        logout,
      } = useAuth0();
      if (!loading) {
        getIdTokenClaims('foo');
        loginWithRedirect('bar');
        getTokenSilently('baz');
        getTokenWithPopup('qux');
        logout('quux');
      }
      return (<div>{loading+''}</div>);
    }

    const getIdTokenClaims = jest.fn();
    const loginWithRedirect = jest.fn();
    const getTokenSilently = jest.fn();
    const getTokenWithPopup = jest.fn();
    const logout = jest.fn();

    createAuth0Client.mockResolvedValue({
      isAuthenticated: jest.fn().mockResolvedValue(false),
      getIdTokenClaims,
      loginWithRedirect,
      getTokenSilently,
      getTokenWithPopup,
      logout,
    });
    render(<Auth0Provider><OtherComponent /></Auth0Provider>);
    await waitForDomChange();
    expect(getIdTokenClaims).toHaveBeenCalledWith('foo');
    expect(loginWithRedirect).toHaveBeenCalledWith('bar');
    expect(getTokenSilently).toHaveBeenCalledWith('baz');
    expect(getTokenWithPopup).toHaveBeenCalledWith('qux');
    expect(logout).toHaveBeenCalledWith('quux');
  });

  it('should login with a popup', async () => {
    function OtherComponent() {
      const {
        loading,
        popupOpen,
        user,
        isAuthenticated,
        loginWithPopup,
      } = useAuth0();
      return (<ul>
        <li>
          <button onClick={() => loginWithPopup('foo') }>
            Log in
          </button>
        </li>
        <li>loading: {`${loading}`}</li>
        <li>popupOpen: {`${popupOpen}`}</li>
        <li>authenticated: {`${isAuthenticated}`}</li>
        <li>user: {user}</li>
      </ul>)
    }
    const loginWithPopup = jest.fn();
    createAuth0Client.mockResolvedValue({
      isAuthenticated: jest.fn().mockResolvedValue(true),
      getUser: jest.fn().mockResolvedValue('Bob'),
      loginWithPopup,
    });
    const { getByText } = render(<Auth0Provider><OtherComponent /></Auth0Provider>);
    await waitForDomChange();
    fireEvent.click(getByText('Log in'));
    expect(loginWithPopup).toHaveBeenCalledWith('foo');
    expect(getByText('popupOpen: true')).toBeTruthy();
    await waitForDomChange();
    expect(getByText('popupOpen: false')).toBeTruthy();
    expect(getByText('authenticated: true')).toBeTruthy();
    expect(getByText('user: Bob')).toBeTruthy();
  });

});
