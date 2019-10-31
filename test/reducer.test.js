import reducer, {
  INITIALISED,
  LOGIN_WITH_POPUP_STARTED,
  LOGIN_WITH_POPUP_COMPLETE
} from '../src/reducer';

describe('reducer', () => {
  it('should initialise', () => {
    const payload = {
      isAuthenticated: true,
      user: 'Bob'
    };
    expect(reducer({}, { type: INITIALISED, ...payload })).toEqual({
      loading: false,
      ...payload
    });
  });

  it('should start the login with popup', () => {
    expect(reducer({}, { type: LOGIN_WITH_POPUP_STARTED })).toEqual({
      popupOpen: true
    });
  });

  it('should complete the login with popup', () => {
    const payload = {
      isAuthenticated: true,
      user: 'Bob'
    };
    expect(
      reducer({}, { type: LOGIN_WITH_POPUP_COMPLETE, ...payload })
    ).toEqual({ popupOpen: false, ...payload });
  });

  it('should throw with incorrect action type', () => {
    expect(() => reducer({}, { type: 'FOO' })).toThrow(
      `Unrecognized action type: 'FOO'`
    );
  });
});
