"use client";

import React, { useState } from "react";
import Header from "../../public/components/fixed/header";
import Footer from "../../public/components/fixed/footer";
import logo from "../../public/components/fixed/images/logo.png";
import Image from "next/image";
import "./user.css";

interface LoginFormData {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  return (
    <div className="page-container">
      <Header />
      <UserLogin />
      <Footer />
    </div>
  );
};

const UserLogin: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login submitted:", formData);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="logo-container">
          <Image src={logo} alt="Company Logo" className="logo" />
        </div>

        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="login-button">
          Log In
        </button>

        <div className="additional-options">
          <a href="/forgot-password" className="forgot-password">
            Forgot password?
          </a>
          <p className="signup-text">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
