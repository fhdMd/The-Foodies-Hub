"use client";
import { useState } from "react";
import React from "react";
import UserHeader from "../fixed/userheader";
import Header from "../fixed/header";
import { useEffect } from "react";

const headbar = () => {
  return (
    <div>
      <HeadBar />
    </div>
  );
};

const HeadBar = () => {
  const [user, setUser] = useState<string | null>(null);
  useEffect(() => {
    const userData = localStorage.getItem("user");
    setUser(userData);
  }, []);
  if (user !== undefined && user !== null) {
    return (
      <>
        <UserHeader />
      </>
    );
  } else {
    return (
      <>
        <Header />
      </>
    );
  }
};

export default headbar;
