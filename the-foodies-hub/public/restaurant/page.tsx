import React from "react";
import Footer from "../../public/components/fixed/footer";
import Header from "../../public/components/fixed/header";
import RestaurantList from "../../public/components/restaurant/restaurantlist";
import Circles from "../../public/components/circles/circles";

interface Restaurant {
  img: any;
  name: string;
  rating: number;
  type: string;
  location: string;
  time: string; // You can use `Date` if you want to store date-time objects
}

const restaurant = async () => {
  const response = await fetch("http://localhost:8080/restaurant");
  console.log(response);
  const data: Restaurant[] = await response.json();
  console.log(data);
  return (
    <div>
      <Header />
      <Circles />
      {/* <RestaurantList restaurants={data} /> */}
      <Footer />
    </div>
  );
};

export default restaurant;
