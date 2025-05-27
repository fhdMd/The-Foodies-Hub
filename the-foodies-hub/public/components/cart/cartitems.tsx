"use client";

import React, { useState, useEffect, useCallback } from "react";
import "./cartitems.css"; // Your CSS for the cart components
import pin from "./images/pin.png"; // Your image for pin
import money from "./images/wallet.png"; // Your image for money
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// --- Interfaces ---
interface CartItemData {
  id: string; // This is the _id from MenuItem
  img: string;
  name: string;
  price: string; // Formatted price like "₹123.45"
  quantity: number;
}

interface CartItemProps extends CartItemData {
  onQuantityChange: (newQuantity: number) => void;
}

interface Address {
  id: string; // Changed to string for UUID or simpler unique IDs
  name: string;
  address: string;
  deliveryTime: string; // Keep as string for display
}

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  rating: number;
  desc: string;
  rId: number;
  veg: boolean;
  id: number;
  img: string;
}

interface RestaurantDetails {
  _id: string;
  img: string;
  name: string;
  rating: number;
  type: string;
  location: string;
  time: string;
  id: number;
}

// --- Main CartItems Component ---
const CartItems = () => {
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [restaurantLocation, setRestaurantLocation] = useState<string>("");

  // State for addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState<boolean>(false);

  // State for payment method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

  // --- Define calculateTotal at the parent level ---
  const calculateTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      // Ensure price is a number before calculation
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, "") || "0");
      return total + price * item.quantity;
    }, 0);
  }, [cartItems]); // Recalculate if cartItems change

  // --- Initialize Cart & Restaurant Details on Mount ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = sessionStorage.getItem("cartItems");
      const savedRestaurantData = sessionStorage.getItem("currentRestaurant");
      const savedMenuItems = sessionStorage.getItem(
        "currentRestaurantMenuItems"
      );

      // Load Addresses from localStorage
      const savedAddresses = localStorage.getItem("userAddresses");
      if (savedAddresses) {
        try {
          const parsedAddresses: Address[] = JSON.parse(savedAddresses);
          setAddresses(parsedAddresses);
          // Set first address as selected if none previously selected or if default is missing
          if (parsedAddresses.length > 0 && !selectedAddress) {
            setSelectedAddress(parsedAddresses[0]);
          }
        } catch (e) {
          console.error("Failed to parse addresses from localStorage:", e);
          localStorage.removeItem("userAddresses");
        }
      } else {
        // If no saved addresses, set a default one
        const defaultAddress: Address = {
          id: "default-1", // Use a simple unique ID
          name: "My Home",
          address: "123 Default Street, City, State 12345",
          deliveryTime: "30-40",
        };
        setAddresses([defaultAddress]);
        setSelectedAddress(defaultAddress);
        localStorage.setItem("userAddresses", JSON.stringify([defaultAddress]));
      }

      // --- Restaurant Details Handling ---
      let currentRestaurant: RestaurantDetails | null = null;
      if (savedRestaurantData) {
        try {
          const parsedRestaurant = JSON.parse(savedRestaurantData);
          if (
            parsedRestaurant &&
            typeof parsedRestaurant === "object" &&
            "name" in parsedRestaurant &&
            "location" in parsedRestaurant
          ) {
            currentRestaurant = parsedRestaurant as RestaurantDetails;
            setRestaurantName(currentRestaurant.name);
            setRestaurantLocation(currentRestaurant.location); // Corrected to use location
          } else {
            console.warn(
              "Parsed restaurant data from sessionStorage is not valid or complete:",
              parsedRestaurant
            );
            sessionStorage.removeItem("currentRestaurant");
            setRestaurantName(searchParams.get("restaurantName") || "");
            setRestaurantLocation(searchParams.get("restaurantLocation") || "");
          }
        } catch (e) {
          console.error(
            "Failed to parse restaurant data from sessionStorage:",
            e
          );
          sessionStorage.removeItem("currentRestaurant");
          setRestaurantName(searchParams.get("restaurantName") || "");
          setRestaurantLocation(searchParams.get("restaurantLocation") || "");
        }
      } else {
        setRestaurantName(searchParams.get("restaurantName") || "");
        setRestaurantLocation(searchParams.get("restaurantLocation") || "");
      }

      // --- Cart Items Handling ---
      let currentRestaurantItems: MenuItem[] = [];
      if (savedMenuItems) {
        try {
          currentRestaurantItems = JSON.parse(savedMenuItems);
        } catch (e) {
          console.error("Failed to parse menu items from sessionStorage:", e);
          sessionStorage.removeItem("currentRestaurantMenuItems");
        }
      }

      if (savedCart) {
        try {
          const parsedCart: { [key: string]: number } = JSON.parse(savedCart);
          const itemsForCart: CartItemData[] = Object.entries(parsedCart)
            .map(([itemName, quantity]) => {
              const itemDetail = currentRestaurantItems.find(
                (item) => item.name === itemName
              );
              if (itemDetail) {
                return {
                  id: itemDetail._id, // Use _id for unique identification
                  img: itemDetail.img,
                  name: itemDetail.name,
                  price: `₹${itemDetail.price.toFixed(2)}`, // Format price
                  quantity: quantity,
                };
              }
              return null;
            })
            .filter(Boolean) as CartItemData[];
          setCartItems(itemsForCart);
        } catch (e) {
          console.error("Failed to parse cart items from sessionStorage:", e);
          sessionStorage.removeItem("cartItems");
        }
      } else {
        setCartItems([]);
      }
    }
  }, [searchParams, selectedAddress]); // Re-run if searchParams or selectedAddress changes (e.g., initial load with URL params)

  // --- Quantity Change Handler ---
  const handleQuantityChange = useCallback(
    (id: string, newQuantity: number) => {
      setCartItems((prevItems) => {
        let updatedItems;
        const existingItemIndex = prevItems.findIndex((item) => item.id === id);

        if (newQuantity <= 0) {
          updatedItems = prevItems.filter((item) => item.id !== id);
        } else if (existingItemIndex > -1) {
          updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: newQuantity,
          };
        } else {
          console.warn(
            "Attempted to change quantity of an item not in cart:",
            id
          );
          return prevItems;
        }

        if (typeof window !== "undefined") {
          const cartObjectToSave: { [key: string]: number } = {};
          updatedItems.forEach((item) => {
            cartObjectToSave[item.name] = item.quantity;
          });
          sessionStorage.setItem("cartItems", JSON.stringify(cartObjectToSave));
        }
        return updatedItems;
      });
    },
    []
  );

  // --- Address Management Handlers ---
  const handleAddressSelect = useCallback((address: Address) => {
    setSelectedAddress(address);
    setIsAddingNewAddress(false); // Hide form if selecting existing
  }, []);

  const handleAddNewAddressToggle = useCallback(() => {
    setIsAddingNewAddress((prev) => !prev);
  }, []);

  const handleSaveNewAddress = useCallback(
    (newAddress: Omit<Address, "id">) => {
      setAddresses((prevAddresses) => {
        const addressToAdd: Address = {
          ...newAddress,
          id: String(Date.now()), // Simple unique ID
        };
        const updatedAddresses = [...prevAddresses, addressToAdd];
        localStorage.setItem("userAddresses", JSON.stringify(updatedAddresses));
        setSelectedAddress(addressToAdd); // Select the newly added address
        setIsAddingNewAddress(false); // Hide the form
        return updatedAddresses;
      });
    },
    []
  );

  // --- "Click to Pay" / Place Order Logic ---
  const handlePlaceOrder = useCallback(async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items before placing an order.");
      return;
    }
    if (!selectedAddress) {
      alert("Please select or add a delivery address.");
      return;
    }
    if (!restaurantName || !restaurantLocation) {
      alert("Restaurant details are missing. Cannot place order.");
      return;
    }
    if (!selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    const userDataString = localStorage.getItem("user");
    let userId: string | null = null;
    if (userDataString) {
      try {
        console.log("User data from localStorage:", userDataString);
        const userData = JSON.parse(userDataString);
        userId = userData._id || userData.id;
        console.log("Extracted userId:", userId);
      } catch (e) {
        console.error("Failed to parse user data from localStorage:", e);
        alert("Failed to parse user data. Please try logging in again.");
        return;
      }
    }

    if (!userId) {
      alert("User not logged in or user ID not found. Please log in.");
      return;
    }

    const orderPayload = {
      userId: userId,
      restaurantName: restaurantName,
      restaurantLocation: restaurantLocation,
      deliveryAddress: selectedAddress,
      paymentMethod: selectedPaymentMethod,
      items: cartItems.map((item) => ({
        menuItemId: item.id,
        name: item.name,
        price: parseFloat(item.price.replace(/[^0-9.-]+/g, "")),
        quantity: item.quantity,
      })),
      totalAmount: calculateTotal(),
      orderDate: new Date().toISOString(),
      status: "Pending",
    };

    console.log("Placing order with payload:", orderPayload);

    try {
      const response = await fetch("http://localhost:8080/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authorization token if required by your backend
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderPayload),
      });

      // --- CRITICAL FIX: Read the response body ONCE ---
      const responseData = await response.json();

      if (!response.ok) {
        // If the response was not OK, use the message from the parsed responseData
        throw new Error(
          responseData.message || `HTTP error! status: ${response.status}`
        );
      }

      // If response was OK, use responseData to get the order ID
      alert("Order placed successfully! Order ID: " + responseData.order._id);

      // Clear cart after successful order
      setCartItems([]);
      sessionStorage.removeItem("cartItems");
      sessionStorage.removeItem("currentRestaurant");
      sessionStorage.removeItem("currentRestaurantMenuItems");

      // Optional: Redirect to an order confirmation page
      // import { useRouter } from 'next/navigation';
      // const router = useRouter();
      // router.push(`/order-confirmation?orderId=${responseData.cart._id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order: " + (error as Error).message);
    }
  }, [
    cartItems,
    selectedAddress,
    restaurantName,
    restaurantLocation,
    selectedPaymentMethod,
    calculateTotal,
  ]); // Dependencies for useCallback

  // --- Render ---
  return (
    <div className="cart-body">
      <Left
        addresses={addresses}
        selectedAddress={selectedAddress}
        onAddressSelect={handleAddressSelect}
        isAddingNewAddress={isAddingNewAddress}
        onAddNewAddressToggle={handleAddNewAddressToggle}
        onSaveNewAddress={handleSaveNewAddress}
        selectedPaymentMethod={selectedPaymentMethod} // Pass payment state
        onSelectPaymentMethod={setSelectedPaymentMethod} // Pass payment setter
      />
      <Right
        cartItems={cartItems}
        onQuantityChange={handleQuantityChange}
        restaurantName={restaurantName}
        restaurantLocation={restaurantLocation}
        onPlaceOrder={handlePlaceOrder} // Pass the new handler
        calculateTotal={calculateTotal} // Pass calculateTotal to Right
      />
    </div>
  );
};

// --- Left Component ---
interface LeftProps {
  addresses: Address[];
  selectedAddress: Address | null;
  onAddressSelect: (address: Address) => void;
  isAddingNewAddress: boolean;
  onAddNewAddressToggle: () => void;
  onSaveNewAddress: (newAddress: Omit<Address, "id">) => void;
  selectedPaymentMethod: string | null; // New prop
  onSelectPaymentMethod: (method: string) => void; // New prop
}

const Left: React.FC<LeftProps> = ({
  addresses,
  selectedAddress,
  onAddressSelect,
  isAddingNewAddress,
  onAddNewAddressToggle,
  onSaveNewAddress,
  selectedPaymentMethod,
  onSelectPaymentMethod,
}) => {
  return (
    <div className="cart-left">
      <DeliveryAddress
        selectedAddress={selectedAddress}
        addresses={addresses}
        onAddressChange={onAddressSelect} // Use onAddressSelect for selecting existing
        isAddingNewAddress={isAddingNewAddress}
        onAddNewAddressToggle={onAddNewAddressToggle}
        onSaveNewAddress={onSaveNewAddress}
      />
      <PaymentMethod
        selectedPaymentMethod={selectedPaymentMethod}
        onSelectPaymentMethod={onSelectPaymentMethod}
      />
    </div>
  );
};

// --- DeliveryAddress Component (Modified for Add New Address with styles) ---
interface DeliveryAddressProps {
  selectedAddress: Address | null;
  addresses: Address[];
  onAddressChange: (address: Address) => void; // For selecting existing address
  isAddingNewAddress: boolean;
  onAddNewAddressToggle: () => void;
  onSaveNewAddress: (newAddress: Omit<Address, "id">) => void;
}

const DeliveryAddress: React.FC<DeliveryAddressProps> = ({
  selectedAddress,
  addresses,
  onAddressChange,
  isAddingNewAddress,
  onAddNewAddressToggle,
  onSaveNewAddress,
}) => {
  const [newAddressName, setNewAddressName] = useState("");
  const [newAddressText, setNewAddressText] = useState("");
  const [newAddressDeliveryTime, setNewAddressDeliveryTime] = useState("");

  const handleFormSubmit = () => {
    if (newAddressName && newAddressText && newAddressDeliveryTime) {
      onSaveNewAddress({
        name: newAddressName,
        address: newAddressText,
        deliveryTime: newAddressDeliveryTime,
      });
      // Clear form fields
      setNewAddressName("");
      setNewAddressText("");
      setNewAddressDeliveryTime("");
    } else {
      alert("Please fill in all address fields.");
    }
  };

  return (
    <div className="delivery-card">
      <div className="del-pin-logo">
        <Image src={pin} alt="Delivery location pin" width={24} height={24} />
      </div>
      <div className="del-txt-container">
        <div className="del-txt-left">
          <p className="del-txt-title">Delivery Address</p>

          {isAddingNewAddress ? (
            <div className="address-form-container">
              {" "}
              {/* New container for form */}
              <h3>Add New Address</h3>
              <input
                type="text"
                placeholder="Name (e.g., Home, Work)"
                value={newAddressName}
                onChange={(e) => setNewAddressName(e.target.value)}
                className="address-form-input" // Apply new class
              />
              <textarea
                placeholder="Full Address"
                value={newAddressText}
                onChange={(e) => setNewAddressText(e.target.value)}
                className="address-form-textarea" // Apply new class
              />
              <input
                type="text"
                placeholder="Delivery Time (e.g., 30-40 mins)"
                value={newAddressDeliveryTime}
                onChange={(e) => setNewAddressDeliveryTime(e.target.value)}
                className="address-form-input" // Apply new class
              />
              <div className="form-buttons">
                <button
                  className="address-form-btn primary"
                  onClick={handleFormSubmit}
                >
                  SAVE
                </button>
                <button
                  className="address-form-btn secondary"
                  onClick={onAddNewAddressToggle}
                >
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <>
              {selectedAddress ? (
                <>
                  <p className="del-txt-name">{selectedAddress.name}</p>
                  <div className="del-txt-address">
                    {selectedAddress.address}
                    <p className="del-txt-time">
                      {selectedAddress.deliveryTime} mins
                    </p>
                  </div>
                </>
              ) : (
                <p className="no-address-selected">
                  No address selected. Please add one.
                </p>
              )}

              <div className="address-dropdown-container">
                {addresses.length > 0 && (
                  <select
                    className="address-select"
                    value={selectedAddress?.id || ""}
                    onChange={(e) => {
                      const selected = addresses.find(
                        (addr) => addr.id === e.target.value
                      );
                      if (selected) onAddressChange(selected);
                    }}
                  >
                    {addresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.name} - {address.address.substring(0, 30)}...
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </>
          )}
        </div>
        <div className="del-change">
          {!isAddingNewAddress && (
            <button className="del-change-btn" onClick={onAddNewAddressToggle}>
              ADD NEW ADDRESS
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- PaymentMethod ---
interface PaymentMethodProps {
  selectedPaymentMethod: string | null;
  onSelectPaymentMethod: (method: string) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  selectedPaymentMethod,
  onSelectPaymentMethod,
}) => {
  return (
    <div className="pay-meth-card">
      <div className="wallet-logo">
        <Image src={money} alt="Payment wallet icon" width={24} height={24} />
      </div>
      <PayMethContainer
        selectedPaymentMethod={selectedPaymentMethod}
        onSelectPaymentMethod={onSelectPaymentMethod}
      />
    </div>
  );
};

// --- PayMethContainer ---
interface PayMethContainerProps {
  selectedPaymentMethod: string | null;
  onSelectPaymentMethod: (method: string) => void;
}

const PayMethContainer: React.FC<PayMethContainerProps> = ({
  selectedPaymentMethod,
  onSelectPaymentMethod,
}) => {
  return (
    <div className="pay-text-container">
      <div className="pay-txt-header">
        <p className="pay-txt-title">Choose Payment Method</p>
      </div>
      <div className="pay-options">
        <PaymentOption
          name="Gpay" // This is the value that will be passed to onSelect
          imgSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQyVO9LUWF81Ov6LZR50eDNu5rNFCpkn0LwYQ&s"
          isSelected={selectedPaymentMethod === "Gpay"} // Compare with "Gpay"
          onSelect={onSelectPaymentMethod}
        />
        <PaymentOption
          name="Phonepe" // This is the value that will be passed to onSelect
          imgSrc="https://w7.pngwing.com/pngs/332/615/png-transparent-phonepe-india-unified-payments-interface-india-purple-violet-text.png"
          isSelected={selectedPaymentMethod === "Phonepe"} // Compare with "Phonepe"
          onSelect={onSelectPaymentMethod}
        />
        {/* Add more payment options here */}
      </div>
      <div className="click-to-pay">
        {/* Button is now in Right component */}
      </div>
    </div>
  );
};

// --- New: PaymentOption Component for reusability and styling ---
interface PaymentOptionProps {
  name: string;
  imgSrc: string;
  isSelected: boolean;
  onSelect: (method: string) => void;
}

const PaymentOption: React.FC<PaymentOptionProps> = ({
  name,
  imgSrc,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`payment-option ${
        isSelected ? "selected-payment-option" : ""
      }`}
      onClick={() => onSelect(name)}
    >
      <Image
        src={imgSrc}
        alt={name}
        width={50}
        height={30}
        className="payment-option-img"
      />
      <p className="payment-option-name">{name}</p>
    </div>
  );
};

// --- Right Component ---
interface RightProps {
  cartItems: CartItemData[];
  onQuantityChange: (id: string, newQuantity: number) => void;
  restaurantName: string;
  restaurantLocation: string;
  onPlaceOrder: () => void;
  calculateTotal: () => number;
}

const Right: React.FC<RightProps> = ({
  cartItems,
  onQuantityChange,
  restaurantName,
  restaurantLocation,
  onPlaceOrder,
  calculateTotal,
}) => {
  return (
    <div className="cart-right">
      <div className="cart-right-up">
        {cartItems.length > 0 && (restaurantName || restaurantLocation) ? (
          <div className="name-and-loc">
            <p className="cart-right-rest-title">{restaurantName}</p>
            <p className="cart-right-rest-loc">{restaurantLocation}</p>
          </div>
        ) : (
          <div className="cart-right-empty-title">
            <p className="cart-right-rest-title">Your Order</p>
          </div>
        )}
      </div>

      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              id={item.id}
              img={item.img}
              name={item.name}
              price={item.price}
              quantity={item.quantity}
              onQuantityChange={(newQuantity) =>
                onQuantityChange(item.id, newQuantity)
              }
            />
          ))}
          <div className="cart-right-pay-total">
            <p className="cart-right-pay-title">TO PAY</p>
            <p className="cart-right-pay-amt">₹{calculateTotal().toFixed(2)}</p>
          </div>
          <div className="click-to-pay">
            <button className="pay-btn" onClick={onPlaceOrder}>
              Click to Pay
            </button>
          </div>
        </>
      ) : (
        <div className="empty-cart-container">
          <p className="cart-empty-message">Your cart is empty.</p>
          <div className="click-to-pay">
            <Link href="/restaurant" className="pay-btn">
              Explore Restaurants
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// --- CartItem Component ---
const CartItem: React.FC<CartItemProps> = ({
  id,
  img,
  name,
  price,
  quantity,
  onQuantityChange,
}) => {
  const handleIncrement = () => {
    onQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    onQuantityChange(quantity - 1);
  };

  return (
    <div className="cart-right-down">
      <div className="cart-item-details">
        {img && (
          <Image
            src={img}
            alt={name}
            width={80}
            height={80}
            className="cart-item-image"
          />
        )}
        <p className="cart-item-name">{name}</p>
        <p className="cart-item-price">{price}</p>
      </div>
      <div className="edit-button">
        <div className="main-btn">
          <button className="operations" onClick={handleDecrement}>
            -
          </button>
          <p>{quantity}</p>
          <button className="operations" onClick={handleIncrement}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
