const initialState = {
  profiles: [],
  loggedProfile: null,
  profiles_cursor: {
    prev: '',
    next: '',
  },
};

export const types = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_PROFILES: 'SET_PROFILES',
};

export function init(initialValues) {
  return {
    ...initialState,
    ...initialValues,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case types.LOGIN:
      return {
        ...state,
        loggedProfile: action.payload,
      };
    case types.LOGOUT:
      return {
        ...state,
        loggedProfile: null,
      };
    case types.SET_PROFILES:
      return {
        ...state,
        profiles: action.payload,
      };
    default:
      throw new Error('Looks like the action is not found!');
  }
}
