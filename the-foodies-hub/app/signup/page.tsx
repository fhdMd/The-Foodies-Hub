"use client";

import React, { useState } from "react";
import Header from "../../public/components/fixed/header";
import Footer from "../../public/components/fixed/footer";
import logo from "../../public/components/fixed/images/logo.png";
import "./user.css";
import Image from "next/image";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    if (formData.confirmPassword === formData.password) {
      try {
        const response = await fetch("http://localhost:8080/user/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
          console.log("SignUp succesful", data); // Log the full data object
          // --- FIX IS HERE ---
          localStorage.setItem("user", JSON.stringify(data)); // Store the entire user object as a JSON string
          // --- END FIX ---
          window.location.href = data.redirectUrl;
        } else {
          console.log(`Error in response ${data.message}`);
          alert(`Error:${data.message}`);
        }
      } catch (error) {
        console.log(`SignUp Error ${error}`);
        alert(`Error ${error}`);
      }
    } else {
      alert("Passwords do not match");
    }
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
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleChange}
              id="name"
              name="name"
              placeholder="Enter your full name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange}
              id="email"
              name="email"
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
              value={formData.password}
              onChange={handleChange}
              id="password"
              name="password"
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
              value={formData.confirmPassword}
              onChange={handleChange}
              id="confirmPassword"
              name="confirmPassword"
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
