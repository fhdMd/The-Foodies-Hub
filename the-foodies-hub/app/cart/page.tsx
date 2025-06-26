import React, { Suspense } from 'react'; // <-- Import Suspense
import Header from "../../public/components/fixed/headbar";
import Footer from "../../public/components/fixed/footer";
import CartItems from "../../public/components/cart/cartitems";

const Cart = () => {
  return (
    <div>
      <Header />
       {/* Wrap the component that uses the client-side hook */}
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading Cart...</div>}>
        <CartItems />
      </Suspense>
      <Footer />
    </div>
  );
};

export default Cart;
