import {
  LOGIN_WITH_POPUP_STARTED,
  LOGIN_WITH_POPUP_COMPLETE,
} from '../src/reducer';
import getLoginWithPopup from '../src/login-with-popup';

describe('loginWithPopup', () => {

  it('should login with popup', async () => {
    const dispatch = jest.fn();
    const loginWithPopup = jest.fn().mockResolvedValue(null);
    const isAuthenticated = jest.fn().mockResolvedValue(true);
    const getUser = jest.fn().mockResolvedValue('Bob');
    const auth0Client = {
      loginWithPopup,
      isAuthenticated,
      getUser,
    };

    await getLoginWithPopup({ current: auth0Client }, dispatch)('foo');

    expect(loginWithPopup).toHaveBeenCalledWith('foo');
    expect(isAuthenticated).toHaveBeenCalled();
    expect(getUser).toHaveBeenCalled();
    expect(dispatch.mock.calls[0][0])
      .toEqual({ type: LOGIN_WITH_POPUP_STARTED });
    expect(dispatch.mock.calls[1][0])
      .toEqual({
        type: LOGIN_WITH_POPUP_COMPLETE,
        isAuthenticated: true,
        user: 'Bob'
      });
  });

  it('should not throw when client fails', async () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation();

    const dispatch = jest.fn();
    const loginWithPopup =
      jest.fn().mockImplementation(() => Promise.reject('bar'));
    const auth0Client = {
      loginWithPopup,
      isAuthenticated: jest.fn(),
      getUser: jest.fn(),
    };

    await getLoginWithPopup({ current: auth0Client }, dispatch)('foo');

    expect(loginWithPopup).toHaveBeenCalledWith('foo');
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(errSpy).toHaveBeenCalledWith('bar');
    errSpy.mockRestore();
  });

});