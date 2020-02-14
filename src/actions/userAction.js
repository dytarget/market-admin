export const userSetAction = (loggedIn, token, user) => ({
  type: "USER",
  payload: {
    token,
    loggedIn,
    user
  }
});
