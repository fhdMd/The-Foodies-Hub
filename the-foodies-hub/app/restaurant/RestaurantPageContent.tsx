// File: app/restaurant/RestaurantPageContent.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Footer from "../../public/components/fixed/footer";
import Header from "../../public/components/fixed/headbar";
import RestaurantList from "../../public/components/restaurant/restaurantlist";
import Circles from "../../public/components/circles/circles";

const RestaurantPageContent = () => { // <-- Name has been changed here
  const searchParams = useSearchParams();
  const cuisineTypeFromUrl = searchParams.get("cuisineType");

  const [restaurants, setRestaurants] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [showRestaurants, setShowRestaurants] = useState(false);

  // All of your useEffects and other logic stays exactly the same
  useEffect(() => {
    if (cuisineTypeFromUrl !== null && selectedCuisine !== cuisineTypeFromUrl) {
      setSelectedCuisine(cuisineTypeFromUrl);
    } else if (cuisineTypeFromUrl === null && selectedCuisine !== null) {
      setSelectedCuisine(null);
    }
  }, [cuisineTypeFromUrl, selectedCuisine]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const fetchRestaurants = async () => {
      setShowRestaurants(false);
      await new Promise((resolve) => (timeoutId = setTimeout(resolve, 300)));
      if (!isMounted) return;

      let url = `${process.env.NEXT_PUBLIC_API_URL}/restaurant`;
      if (selectedCuisine) {
        url += `?cuisineType=${selectedCuisine}`;
      }
      console.log("Fetching restaurants from:", url);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (isMounted) {
          setRestaurants(data);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        if (isMounted) {
          setRestaurants([]);
        }
      } finally {
        if (isMounted) {
          setShowRestaurants(true);
        }
      }
    };

    fetchRestaurants();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [selectedCuisine]);

  return (
    <div>
      <Header />
      <Circles
        onSelectCuisine={setSelectedCuisine}
        selectedCuisine={selectedCuisine}
      />
      <RestaurantList restaurants={restaurants} showContent={showRestaurants} />
      <Footer />
    </div>
  );
};

export default RestaurantPageContent; // <-- And here