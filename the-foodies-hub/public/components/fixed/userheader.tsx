"use client"; // Add this directive if it's an App Router component

import React from "react";
import "./header.css";
import user from "../fixed/images/user.png";
import cart from "../fixed/images/bag.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation

const UserHeader = () => {
  // Renamed to UserHeader (PascalCase)
  const router = useRouter(); // Initialize the useRouter hook

  const handleClick = () => {
    // No need for async unless you have other async operations
    localStorage.removeItem("user"); // Remove the user data from localStorage
    // Use router.push to navigate to a new page (e.g., home page).
    // This will cause the new page and its layout (including the header) to re-render.
    router.push("/restaurant");
  };

  return (
    <div className="header">
      <Link href="/" className="home-link">
        The Foodies Hub
      </Link>
      <div className="user">
        <Link href="/profile" className="profile">
          <Image src={user} alt="user" />
          User
        </Link>
        <Link href="/cart" className="cart">
          <Image src={cart} alt="cart" />
          Cart
        </Link>
        {/* Changed href to / as it will be handled by router.push */}
        <Link href="/" onClick={handleClick} className="profile">
          Log Out
        </Link>
      </div>
    </div>
  );
};

export default UserHeader;
