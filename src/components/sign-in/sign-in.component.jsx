import React from "react";

import CustomButton from "../custom-button/custom-button.component";
import {
  auth,
  signInWithGoogle,
  createUserProfileDocument
} from "../../firebase/firebase";

import "./sign-in.style.scss";

class SignIn extends React.Component {
  constructor() {
    super();
    this.state = {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
  }

  handleSubmit = async event => {
    event.preventDefault();

    const { displayName, email, password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      alert("password don't match");
      return;
    }

    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      await createUserProfileDocument(user, { displayName });

      this.setState({
        displayName: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error(error);
    }
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    // const { displayName, email, password, confirmPassword } = this.state;
    return (
      <div className="sign-up">
        <form className="sign-up-form" onSubmit={this.handleSubmit}>
          <h4 className="title">Sign In</h4>
          {/* <span>Sign up with your email and password</span>
          <div className="input-inline">
            <FormInput
              type="text"
              name="displayName"
              value={displayName}
              onChange={this.handleChange}
              label="Display Name"
              required
            />
            <FormInput
              type="text"
              name="email"
              value={email}
              onChange={this.handleChange}
              label="Email"
              required
            />
            <FormInput
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
              label="Password"
              required
            />
            <FormInput
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={this.handleChange}
              label="Confrim Password"
              required
            />
          </div>
          <div className="buttons">
            <CustomButton type="submit">SIGN UP</CustomButton>
          </div> */}
          <div className="google-btn">
            <CustomButton onClick={signInWithGoogle} isGoogleSignIn>
              Google
            </CustomButton>
          </div>
          <code>
            Xtemporize app equips musicians with one source of truth, to receive
            request from their audience.
          </code>
        </form>
      </div>
    );
  }
}

export default SignIn;
