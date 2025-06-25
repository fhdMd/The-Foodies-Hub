import React from "react";
import Header from "../../../public/components/fixed/headbar";
import Footer from "../../../public/components/fixed/footer";
import RestaurantMenu from "../../../public/components/menu/restaurantmenu";

interface Props {
  params: {
    rId: string;
  };
}

const menu = async ({ params }: Props) => {
  const { rId } = params;
  console.log(rId);
  const items = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${rId}`);
  const restaurant = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurant/${rId}`);
  const data = await items.json();
  const rData = await restaurant.json();
  return (
    <div>
      <Header />
      <RestaurantMenu items={data} restaurant={rData} />
      <Footer />
    </div>
  );
};

export default menu;
