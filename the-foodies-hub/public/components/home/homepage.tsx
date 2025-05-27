"use client"; // This directive is important for client-side functionality

import React, { useState, useEffect } from "react"; // Ensure both useState and useEffect are imported
import "./homepage.css";
import Circles from "../circles/circles";
import Image from "next/image";
import Bannerimg from "./images/ramen.jpg";
import profile from "../fixed/images/user.png"; // Assuming these paths are correct relative to homepage.tsx
import cart from "../fixed/images/bag.png"; // Assuming these paths are correct relative to homepage.tsx

// --- ALL SUB-COMPONENTS DEFINED ONCE ---

const Banner = () => {
  return <Index />;
};

const Index = () => {
  return (
    <>
      <div className="banner .albert-sans-regular">
        <BannerImage />
        <User />
        <Title />
      </div>
    </>
  );
};

const BannerImage = () => {
  return <Image src={Bannerimg} alt="banner" className="bannerImg" />;
};

const User = () => {
  return (
    <div className="user">
      <HeadBar />
    </div>
  );
};

const HeadBar = () => {
  const handleClick = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // This runs only on the client side
    const userData = localStorage.getItem("user");
    setUser(userData);
  }, []); // Empty dependency array means it runs once after initial render

  if (user === undefined || user === null) {
    return (
      <>
        <a href="/login">Log in</a>
        <a href="/signup">Sign up</a>
      </>
    );
  } else {
    return (
      <>
        <a href="/profile">
          {/* <Image src={profile} alt="profile" /> */}
          User
        </a>
        <a href="/cart">
          {/* <Image src={cart} alt="cart" /> */}
          Cart
        </a>
        <a href="#" onClick={handleClick}>
          Logout
        </a>
      </>
    );
  }
};

const Title = () => {
  return (
    <div className="title">
      <p className="title-name">The Foodies Hub</p>
    </div>
  );
};

const Button = () => {
  return (
    <div className="button">
      <a href="/restaurant">
        <button className="albert-sans-regular">Start Ordering</button>
      </a>
    </div>
  );
};

// --- THE ONE AND ONLY MAIN HOMEPAGE COMPONENT ---

// Renamed from 'body' to 'HomepageContent' or similar for clarity
// to avoid confusion with the <body> HTML tag or the 'body' class
const HomepageContent = () => {
  // State to manage the currently selected cuisine for visual feedback in Circles
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

  // Handler function to update the selected cuisine state
  const handleSelectCuisine = (cuisine: string | null) => {
    setSelectedCuisine(cuisine);
    // The actual redirection logic is now handled inside the Circles component itself
  };

  return (
    <div className="body">
      {" "}
      {/* This 'body' refers to your CSS class */}
      <Banner />
      {/* Pass the selectedCuisine state and the handler to Circles */}
      <Circles
        onSelectCuisine={handleSelectCuisine}
        selectedCuisine={selectedCuisine}
      />
      <Button />
    </div>
  );
};

export default HomepageContent; // Export the unified component
