import React from "react";
import Header from "../../public/components/fixed/header";
import Footer from "../../public/components/fixed/footer";
import RestaurantMenu from "../../public/components/menu/restaurantmenu";
const menu = () => {
  return (
    <div>
      <Header />
      <RestaurantMenu />
      <Footer />
    </div>
  );
};

export default menu;
