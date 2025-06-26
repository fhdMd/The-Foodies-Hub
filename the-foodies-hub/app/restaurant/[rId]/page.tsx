import React from "react";
import Header from "../../../public/components/fixed/headbar";
import Footer from "../../../public/components/fixed/footer";
import RestaurantMenu from "../../../public/components/menu/restaurantmenu";

// Define the type for the resolved params, not the promise
interface PageParams {
  rId: string;
}

// Update the Props interface to show that params is a Promise
interface Props {
  params: Promise<PageParams>;
}

// Rename the component to PascalCase for React best practices
const Menu = async ({ params }: Props) => {
  // Await the params promise to get the actual object
  const { rId } = await params;
  // You can run these fetches in parallel to make it faster
  const [items, restaurant] = await Promise.all([
    fetch(`${process.env.INTERNAL_API_URL}/menu/${rId}`),
    fetch(`${process.env.INTERNAL_API_URL}/restaurant/${rId}`),
  ]);
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

export default Menu;
