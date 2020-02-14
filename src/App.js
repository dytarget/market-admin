import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { store, persistor } from "./store";
import { Spin } from "antd";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import "antd/dist/antd.css";
import "./App.css";
import LoginPageForm from "./Views/Login/LoginPage";
import Main from "./Views/Main/Main";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      console.log(store.getState());
      const { loggedIn } = store.getState().userReducer;
      return loggedIn ? <Component {...props} /> : <Redirect to="/login" />;
    }}
  />
);

const LoadingView = () => {
  return <Spin size="large" />;
};

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<LoadingView />} persistor={persistor}>
          <Router>
            <Switch>
              <Route path="/login" exact component={LoginPageForm} />
              <PrivateRoute path="/" component={Main} />
            </Switch>
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}
