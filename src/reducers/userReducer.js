const initialState = {
  loggedIn: false,
  token: null,
  user: {}
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER": {
      return {
        ...action.payload
      };
    }
    default: {
      return state;
    }
  }
};
export default userReducer;
