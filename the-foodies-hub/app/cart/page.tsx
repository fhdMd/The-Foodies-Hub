import React from "react";
import Header from "../../public/components/fixed/headbar";
import Footer from "../../public/components/fixed/footer";
import CartItems from "../../public/components/cart/cartitems";

const cart = () => {
  return (
    <div>
      <Header />
      <CartItems />
      <Footer />
    </div>
  );
};

export default cart;
