"use client";

import React, { useState } from "react";
import Header from "../../public/components/fixed/header";
import Footer from "../../public/components/fixed/footer";
import logo from "../../public/components/fixed/images/logo.png";
import Image from "next/image";
import "./user.css";

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
  interface LoginFormData {
    email: string;
    password: string;
  }

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Log In Successful", data); // Log the full data object
        // --- FIX IS HERE ---
        localStorage.setItem("user", JSON.stringify(data)); // Store the entire user object as a JSON string
        // --- END FIX ---
        window.location.href = data.redirectUrl;
      } else {
        console.log(`Error in response ${data.message}`);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.log(`Error ${error}`);
      alert(`Error ${error}`);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} method="POST" className="login-form">
        <div className="logo-container">
          <Image src={logo} alt="Company Logo" className="logo" />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="text"
            value={formData.email}
            onChange={handleChange}
            id="email"
            name="email"
            placeholder="Enter your email"
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
            value={formData.password}
            onChange={handleChange}
            id="password"
            name="password"
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
