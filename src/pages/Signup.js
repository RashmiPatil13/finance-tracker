import React from "react";
import Header from "../components/Header";
import SignupSigninComponent from "../components/SignupSignin";

function Signup() {
  return (
    <div>
      <Header />
      <SignupSigninComponent />
      <div className="wrapper"></div>
    </div>
  );
}

export default Signup;
