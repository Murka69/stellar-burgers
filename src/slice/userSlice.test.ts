import {
  TStateUser,
  toRegisterUser,
  logInUser,
  logOutUser,
  updateUser,
  userStateSlice,
  authChecked
} from './userSlice';

const initialState: TStateUser = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: null,
  loginUserError: null,
  loginUserRequest: false
};

const testUser = {
  success: true,
  user: {
    email: 'test44@email.ru',
    name: 'test'
  },
  accessToken: 'test',
  refreshToken: 'test'
};

const testLogIn = {
  email: 'test44@email.ru',
  password: 'password'
};

const testRegisterUser = {
  email: 'test44@email.ru',
  name: 'test',
  password: 'password'
};

const updatedUser = {
  success: true,
  user: {
    email: 'test44@email.ru',
    name: 'test44'
  }
};

describe('User state slice reducers tests', () => {
  it('should handle authChecked', () => {
    const previousState = {
      ...initialState,
      isAuthChecked: false
    };

    const actualState = userStateSlice.reducer(previousState, authChecked());

    const expectedState = {
      ...previousState,
      isAuthChecked: true
    };

    expect(actualState).toEqual(expectedState);
  });
});

describe('User state slice extrareducers tests', () => {
  it('should handle toRegisterUser into pending status', () => {
    const actualState = userStateSlice.reducer(
      initialState,
      toRegisterUser.pending('', testRegisterUser)
    );

    expect(actualState).toEqual({
      ...initialState,
      isAuthenticated: false,
      user: null,
      loginUserRequest: true
    });
  });

  it('should handle toRegisterUser into fulfilled status', () => {
    const actualState = userStateSlice.reducer(
      initialState,
      toRegisterUser.fulfilled(testUser.user, '', testRegisterUser)
    );

    expect(actualState).toEqual({
      ...initialState,
      isAuthenticated: true,
      user: testUser.user,
      loginUserRequest: false
    });
  });

  it('should handle toRegisterUser into rejected status', () => {
    const error = new Error('User register error');
    const actualState = userStateSlice.reducer(
      initialState,
      toRegisterUser.rejected(error, '', testRegisterUser)
    );

    expect(actualState).toEqual({
      ...initialState,
      isAuthenticated: false,
      loginUserError: 'User register error',
      loginUserRequest: false
    });
  });

  it('should handle logInUser into pending status', () => {
    const actualState = userStateSlice.reducer(
      initialState,
      logInUser.pending('', testLogIn)
    );

    expect(actualState).toEqual({
      ...initialState,
      loginUserError: null,
      loginUserRequest: true
    });
  });

  it('should handle logInUser into fulfilled status', () => {
    const actualState = userStateSlice.reducer(
      initialState,
      logInUser.fulfilled(testUser.user, '', testRegisterUser)
    );

    expect(actualState).toEqual({
      ...initialState,
      user: testUser.user,
      isAuthenticated: true,
      isAuthChecked: true,
      loginUserRequest: false
    });
  });

  it('should handle logInUser into rejected status', () => {
    const error = new Error('User Log in Error');
    const actualState = userStateSlice.reducer(
      initialState,
      logInUser.rejected(error, '', testLogIn)
    );

    expect(actualState).toEqual({
      ...initialState,
      isAuthChecked: true,
      loginUserRequest: false,
      isAuthenticated: false,
      loginUserError: 'User Log in Error'
    });
  });

  it('should handle logOutUser into pending status', () => {
    const previousState = {
      ...initialState,
      isAuthenticated: true,
      user: testUser.user
    };

    const actualState = userStateSlice.reducer(
      previousState,
      logOutUser.pending('')
    );

    expect(actualState).toEqual({
      ...previousState,
      loginUserRequest: true
    });
  });

  it('should handle logOutUser into fulfilled status', () => {
    const actualState = userStateSlice.reducer(
      initialState,
      logOutUser.fulfilled(undefined, '')
    );

    expect(actualState).toEqual({
      isAuthenticated: false,
      user: null,
      loginUserRequest: false,
      isAuthChecked: false,
      loginUserError: null
    });
  });

  it('should handle logOutUser into rejected status', () => {
    const error = new Error('Failed to log out');
    const previousState = {
      ...initialState,
      isAuthenticated: true,
      user: testUser.user
    };

    const actualState = userStateSlice.reducer(
      previousState,
      logOutUser.rejected(error, '')
    );

    expect(actualState).toEqual({
      ...previousState,
      isAuthenticated: false,
      loginUserError: 'Failed to log out',
      loginUserRequest: false
    });
  });

  it('should handle updateUser into pending status', () => {
    const actualState = userStateSlice.reducer(
      initialState,
      updateUser.pending('', updatedUser.user)
    );

    expect(actualState).toEqual({
      ...initialState,
      isAuthenticated: true,
      loginUserRequest: true
    });
  });

  it('should handle updateUser into fulfilled status', () => {
    const actualState = userStateSlice.reducer(
      initialState,
      updateUser.fulfilled(updatedUser, '', testUser.user)
    );
    expect(actualState).toEqual({
      isAuthenticated: true,
      user: updatedUser.user,
      loginUserRequest: false,
      isAuthChecked: false,
      loginUserError: null
    });
  });

  it('should handle updateUser into rejected status', () => {
    const error = new Error('Failed to fetch update user');
    const actualState = userStateSlice.reducer(
      initialState,
      updateUser.rejected(error, '', testUser.user)
    );

    expect(actualState).toEqual({
      ...initialState,
      loginUserError: error.message,
      loginUserRequest: false
    });
  });
});
