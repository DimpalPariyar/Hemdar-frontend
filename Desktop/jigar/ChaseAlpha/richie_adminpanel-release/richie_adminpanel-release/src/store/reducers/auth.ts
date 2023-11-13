// action - state management
import { REGISTER, LOGIN, LOGOUT } from './actions';

// types
import { AuthProps, AuthActionProps } from 'types/auth';

// initial state
export const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
  // token:null,
  refreshToken:null
};

// ==============================|| AUTH REDUCER ||============================== //

const auth = (state = initialState, action: AuthActionProps) => {
  switch (action.type) {
    case REGISTER: {
      const { user } = action.payload!;
      return {
        ...state,
        user
      };
    }
    case LOGIN: {
      const { user,refreshToken } = action.payload!;
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: true,
        user,
        // token,
        refreshToken
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isInitialized: true,
        isLoggedIn: false,
        user: null,
        // token:null,
        refreshToken:null
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default auth;
