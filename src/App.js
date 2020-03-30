import React from "react";
import { Switch, Route } from "react-router-dom";
// import { connect } from "react-redux";

import HomePage from "./pages/homepage/homepage.component";
import MenuPage from "./pages/menu/menu.component";
import SessionPage from "./pages/session/session.component";
import SignInAndSignUpPage from "./pages/sign-in-and-sign-up/sign-in-and-sign-up.component";
import "./App.scss";
import { auth } from "./firebase/firebase";
class App extends React.Component {
  constructor() {
    super();

    this.state = {
      currentUser: null
    };
  }

  unsubscribeFromAuth = null;

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(user => {
      this.setState({ currentUser: user });
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    const currentUser = this.state.currentUser;
    return (
      <Switch>
        <Route
          exact
          path="/"
          render={props => <HomePage {...props} currentUser={currentUser} />}
        />
        {currentUser ? (
          <Switch>
            <Route
              exact
              path="/menu"
              render={props => (
                <MenuPage {...props} currentUser={currentUser} />
              )}
            />
            <Route
              exact
              to={`/session/${currentUser.uid}`}
              render={props => (
                <SessionPage {...props} currentUser={currentUser} />
              )}
            />
          </Switch>
        ) : (
          <SignInAndSignUpPage />
        )}
        {/* <Route
          exact
          path="/session"
          render={props => <SessionPage {...props} currentUser={currentUser} />}
        /> */}
      </Switch>
    );
  }
}

export default App;
