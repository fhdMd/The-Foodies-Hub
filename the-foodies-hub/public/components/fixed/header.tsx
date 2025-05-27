import React from "react";
import "./header.css";
const header = () => {
  return (
    <div className="header">
      <a href="/" className="home-link">
        The Foodies Hub
      </a>
      <div className="user">
        <a href="/login" className="login">
          Log in
        </a>
        <a href="/signup" className="signup">
          Sign up
        </a>
      </div>
    </div>
  );
};

export default header;
