// public/components/restaurant/restaurantlist.tsx

"use client";

import React from "react";
import "./restaurantlist.css";
import Link from "next/link";
import Image from "next/image";

interface Restaurant {
  _id: string;
  img: string;
  name: string;
  rating: number;
  type: string;
  location: string;
  time: string;
  id: number;
}

interface RestaurantListProps {
  restaurants: Restaurant[];
  showContent: boolean; // <-- NEW: Prop renamed for clarity
}

const RestaurantList = ({ restaurants, showContent }: RestaurantListProps) => {
  return (
    // Apply conditional classes based on showContent
    <div
      className={`restaurant-list ${showContent ? "fading-in" : "fading-out"}`}
    >
      {restaurants.length > 0 ? (
        restaurants.map((restaurant, index) => (
          <Link
            href={`/restaurant/${restaurant.id}`}
            className="restaurant-link"
            key={restaurant._id || index}
          >
            <RestaurantCard {...restaurant} />
          </Link>
        ))
      ) : (
        <p className="no-restaurants-message">
          No restaurants found for the selected criteria.
        </p>
      )}
    </div>
  );
};

// ... (Rest of your RestaurantCard and getRatingColor remains the same) ...

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

const RestaurantCard = (props: Restaurant) => {
  const ratingBackgroundColor = getRatingColor(props.rating);
  const textColor = "#fff";

  return (
    <div className="restaurant-card">
      <Image
        src={props.img}
        alt={props.name}
        width={400}
        height={300}
        className="restaurant-img"
        priority={true}
      />
      <div className="restaurant-details">
        <div className="name-rating">
          <p className="restaurant-name">{props.name}</p>
        </div>
        <p
          className="restaurant-rating"
          style={{ backgroundColor: ratingBackgroundColor, color: textColor }}
        >
          {props.rating.toFixed(1)}
        </p>
        <div className="remaining-details">
          <div className="type-location">
            <p className="restaurant-type">{props.type}</p>
            <p className="restaurant-location">{props.location}</p>
          </div>
          <div className="time">
            <p className="restaurant-time">{props.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;
