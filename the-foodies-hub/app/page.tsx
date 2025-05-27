import React from "react";
import HomepageContent from "../public/components/home/homepage"; // <-- Update import name
import Footer from "../public/components/fixed/footer";

const home = () => {
  return (
    <div>
      <HomepageContent /> {/* <-- Use the new component name */}
      <Footer />
    </div>
  );
};

export default home;
