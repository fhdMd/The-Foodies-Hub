"use client";

import React, { useState } from "react";
import Header from "../../public/components/fixed/header";
import Footer from "../../public/components/fixed/footer";
import logo from "../../public/components/fixed/images/logo.png";
import "./user.css";
import Image from "next/image";

interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signup submitted:", formData);
  };

  return (
    <div className="page-container">
      <Header />
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="logo-container">
            <Image src={logo} alt="Logo" className="logo" />
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
              placeholder="Choose a username"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="form-input"
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
              placeholder="Create a password"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className="form-input"
            />
          </div>

          <button type="submit" className="login-button">
            Sign Up
          </button>

          <div className="additional-options">
            <p className="signup-text">
              Already have an account? <a href="/login">Log in</a>
            </p>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
