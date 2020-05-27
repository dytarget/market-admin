import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import ReactNotifications from "react-browser-notifications";
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
  showNotifications = () => {
    // If the Notifications API is supported by the browser
    // then show the notification
    if (this.n.supported()) this.n.show();
  };

  handleClick = event => {
    // Do something here such as
    // console.log("Notification Clicked") OR
    // window.focus() OR
    // window.open("http://www.google.com")

    // Lastly, Close the notification
    this.n.close(event.target.tag);
  };

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<LoadingView />} persistor={persistor}>
          <ReactNotifications
            onRef={ref => (this.n = ref)} // Required
            title="Hey There!" // Required
            body="This is the body"
            icon="icon.png"
            tag="abcdef"
            timeout="2000"
            onClick={event => this.handleClick(event)}
          />
          {/* <button onClick={this.showNotifications}>Notify Me!</button> */}
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
