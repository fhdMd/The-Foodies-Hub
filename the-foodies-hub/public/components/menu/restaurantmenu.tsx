"use client";

import React, { useState, useEffect, useCallback } from "react";
import "./restaurantmenu.css";
import Image from "next/image";
import filter from "./images/filter.png";
import veg from "./images/veg (2).png";
import nonveg from "./images/non-veg (2).png";
import Line from "../fixed/line";
import cart from "./images/bag-white.png";
import Link from "next/link";

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

interface MenuProp {
  items: MenuItem[];
  restaurant: RestaurantDetails;
}

const getRatingColor = (rating: number) => {
  const maxRating = 5;
  const minRating = 0;
  const clampedRating = Math.max(minRating, Math.min(maxRating, rating));
  const hue = (clampedRating / maxRating) * 120;
  let lightness: number;
  if (clampedRating <= 2.5) {
    lightness = 30 + (clampedRating / 2.5) * 10;
  } else {
    lightness = 40 - ((clampedRating - 2.5) / 2.5) * 15;
  }
  lightness = Math.max(20, Math.min(45, lightness));
  const saturation = 95;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const RestaurantMenu = ({ items, restaurant }: MenuProp) => {
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});
  const [totalItems, setTotalItems] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [buttonAnimations, setButtonAnimations] = useState<{
    [key: string]: string;
  }>({});
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [sortOrder, setSortOrder] = useState<{
    type: "price" | "rating" | null;
    direction: "asc" | "desc" | null;
  }>({ type: null, direction: null });
  const [animationKey, setAnimationKey] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setShowNotification(totalItems > 0);
  }, [totalItems]);

  // Load cart items and check login status on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    setIsLoggedIn(userData !== null && userData !== undefined);

    if (typeof window !== "undefined") {
      const savedCart = sessionStorage.getItem("cartItems");
      if (savedCart) {
        try {
          const parsedCart: { [key: string]: number } = JSON.parse(savedCart);
          setCartItems(parsedCart);
          const calculatedTotal = Object.values(parsedCart).reduce(
            (sum, count) => sum + (count as number),
            0
          );
          setTotalItems(calculatedTotal);
        } catch (e) {
          console.error("Failed to parse cart items from sessionStorage:", e);
          sessionStorage.removeItem("cartItems");
        }
      }
    }
  }, []);

  // Save cart items to sessionStorage whenever cartItems state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // NEW: Save restaurant details and full menu items to sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("currentRestaurant", JSON.stringify(restaurant));
      sessionStorage.setItem(
        "currentRestaurantMenuItems",
        JSON.stringify(items)
      );
    }
  }, [restaurant, items]); // Depend on restaurant and items props

  const triggerButtonAnimation = useCallback(
    (itemName: string, type: "increment" | "decrement" | "add") => {
      setButtonAnimations((prev) => ({
        ...prev,
        [itemName]: type,
      }));

      setTimeout(() => {
        setButtonAnimations((prev) => {
          const newState = { ...prev };
          delete newState[itemName];
          return newState;
        });
      }, 300);
    },
    []
  );

  const updateCart = useCallback(
    (itemName: string, change: 1 | -1) => {
      setCartItems((prev) => {
        const currentCount = prev[itemName] || 0;
        const newCount = currentCount + change;

        if (newCount <= 0) {
          const newState = { ...prev };
          delete newState[itemName];
          return newState;
        }
        return { ...prev, [itemName]: newCount };
      });
      setTotalItems((prev) => prev + change);
      triggerButtonAnimation(
        itemName,
        change === 1 ? "increment" : "decrement"
      );
    },
    [triggerButtonAnimation]
  );

  const handleAddItem = useCallback(
    (itemName: string) => {
      setCartItems((prev) => ({
        ...prev,
        [itemName]: (prev[itemName] || 0) + 1,
      }));
      setTotalItems((prev) => prev + 1);
      triggerButtonAnimation(itemName, "add");
    },
    [triggerButtonAnimation]
  );

  const handleFilterClick = useCallback(
    (filterType: string) => {
      if (filterType === "filter") {
        if (
          showFilterOptions &&
          (sortOrder.type !== null || activeFilter !== null)
        ) {
          setSortOrder({ type: null, direction: null });
          setActiveFilter(null);
          setShowFilterOptions(false);
          setAnimationKey((prev) => prev + 1);
        } else {
          setShowFilterOptions((prev) => !prev);
        }
      } else {
        const newActiveFilter = activeFilter === filterType ? null : filterType;
        if (newActiveFilter !== activeFilter || sortOrder.type !== null) {
          setAnimationKey((prev) => prev + 1);
        }
        setActiveFilter(newActiveFilter);
        setShowFilterOptions(false);
        setSortOrder({ type: null, direction: null });
      }
    },
    [showFilterOptions, sortOrder.type, activeFilter]
  );

  const handleSortChange = useCallback(
    (type: "price" | "rating", direction: "asc" | "desc") => {
      if (sortOrder.type !== type || sortOrder.direction !== direction) {
        setAnimationKey((prev) => prev + 1);
      }
      setSortOrder({ type, direction });
      setActiveFilter("filter");
      setShowFilterOptions(false);
    },
    [sortOrder]
  );

  const sortedAndFilteredItems = [...items]
    .filter((item) => {
      if (activeFilter === "veg") {
        return item.veg;
      }
      if (activeFilter === "non-veg") {
        return !item.veg;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder.type === "price") {
        return sortOrder.direction === "asc"
          ? a.price - b.price
          : b.price - a.price;
      }
      if (sortOrder.type === "rating") {
        return sortOrder.direction === "asc"
          ? a.rating - b.rating
          : b.rating - a.rating;
      }
      return 0;
    });

  const isFilterButtonActive =
    showFilterOptions ||
    sortOrder.type !== null ||
    activeFilter === "veg" ||
    activeFilter === "non-veg";

  return (
    <div className="restaurant-container">
      <div className="restaurant-header">
        <div className="first-header">
          <div className="restaurant-name-and-rating">
            <p className="restaurant-name">{restaurant.name}</p>
            <p
              className="menu-page-restaurant-rating"
              style={{
                backgroundColor: getRatingColor(restaurant.rating),
                color: "#fff",
              }}
            >
              {restaurant.rating.toFixed(1)}
            </p>
          </div>
          <div className="second-header">
            <div className="restaurant-details">
              <p className="cuisine-type">{restaurant.type}</p>
              <p className="restaurant-location">{restaurant.location}</p>
            </div>
            <div className="delivery-time">
              <p className="delivery-time-text">{restaurant.time}</p>
            </div>
          </div>
        </div>
        <div className="buttons">
          <button
            className={`filters ${
              isFilterButtonActive ? "active-purple-outline" : ""
            }`}
            onClick={() => handleFilterClick("filter")}
          >
            <div className="inside">
              <Image src={filter} alt="filters" />
              Filters
            </div>
          </button>
          {showFilterOptions && (
            <ul className="filter-options-dropdown">
              <li
                className={`filter-option ${
                  sortOrder.type === "price" && sortOrder.direction === "asc"
                    ? "selected-option"
                    : ""
                }`}
                onClick={() => handleSortChange("price", "asc")}
              >
                Price: Low to High
              </li>
              <li
                className={`filter-option ${
                  sortOrder.type === "price" && sortOrder.direction === "desc"
                    ? "selected-option"
                    : ""
                }`}
                onClick={() => handleSortChange("price", "desc")}
              >
                Price: High to Low
              </li>
              <li
                className={`filter-option ${
                  sortOrder.type === "rating" && sortOrder.direction === "desc"
                    ? "selected-option"
                    : ""
                }`}
                onClick={() => handleSortChange("rating", "desc")}
              >
                Rating: High to Low
              </li>
              <li
                className={`filter-option ${
                  sortOrder.type === "rating" && sortOrder.direction === "asc"
                    ? "selected-option"
                    : ""
                }`}
                onClick={() => handleSortChange("rating", "asc")}
              >
                Rating: Low to High
              </li>
            </ul>
          )}
          <button
            className={`veg-filter ${
              activeFilter === "veg" ? "active-veg-outline" : ""
            }`}
            onClick={() => handleFilterClick("veg")}
          >
            <div className="inside">
              <Image src={veg} alt="veg" />
              Veg
            </div>
          </button>
          <button
            className={`non-veg-filter ${
              activeFilter === "non-veg" ? "active-nonveg-outline" : ""
            }`}
            onClick={() => handleFilterClick("non-veg")}
          >
            <div className="inside">
              <Image src={nonveg} alt="non-veg" />
              Non veg
            </div>
          </button>
        </div>
      </div>
      <div className="menu-list" key={animationKey}>
        {sortedAndFilteredItems.map((item) => (
          <React.Fragment key={item._id}>
            <Line />
            <div className="menu-item fade-in">
              <div className="menu-entry">
                <p className="item-name">{item.name}</p>
                <p className="item-price">₹{item.price}</p>
                <p
                  className="item-rating"
                  style={{
                    backgroundColor: getRatingColor(item.rating),
                    color: "#fff",
                  }}
                >
                  {item.rating.toFixed(1)}
                </p>
                <p className="item-desc">{item.desc}</p>
              </div>
              <div className="image-and-button">
                <Image
                  src={item.img}
                  alt={item.name}
                  width={300}
                  height={200}
                />
                {cartItems[item.name] > 0 ? (
                  <div className="edit-button">
                    <div
                      className={`quantity-control ${
                        buttonAnimations[item.name] === "decrement"
                          ? "decrement-animate"
                          : ""
                      } ${
                        buttonAnimations[item.name] === "increment"
                          ? "increment-animate"
                          : ""
                      }`}
                    >
                      <button
                        className="decrement-btn"
                        onClick={() => updateCart(item.name, -1)}
                      >
                        -
                      </button>
                      <span className="quantity">{cartItems[item.name]}</span>
                      <button
                        className="increment-btn"
                        onClick={() => updateCart(item.name, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className={`add-button ${
                      buttonAnimations[item.name] === "add" ? "add-animate" : ""
                    }`}
                    onClick={() => handleAddItem(item.name)}
                  >
                    ADD
                  </button>
                )}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className={`notification-bar ${showNotification ? "show" : "hide"}`}>
        {totalItems > 0 && isLoggedIn ? (
          <>
            <p className="notification-text">{totalItems} item(s) added</p>
            <Link
              href={{
                pathname: "/cart",
                // No longer need to pass restaurantName/Location via query if using sessionStorage
                // query: {
                //   restaurantName: restaurant.name,
                //   restaurantLocation: restaurant.location,
                // },
              }}
              className="view-cart-link"
            >
              VIEW CART <Image src={cart} alt="cart" width={20} height={20} />
            </Link>
          </>
        ) : totalItems > 0 && !isLoggedIn ? (
          <div className="logged-out-notification">
            <p className="logged-out-message">
              You're not logged in. Want to view your cart?
            </p>
            <div className="logged-out-actions">
              <Link href="/login" className="logged-out-link login-link">
                Login
              </Link>
              <Link href="/signup" className="logged-out-link signup-link">
                Sign Up
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RestaurantMenu;
