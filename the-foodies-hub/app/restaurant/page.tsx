"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Footer from "../../public/components/fixed/footer";
import Header from "../../public/components/fixed/headbar";
import RestaurantList from "../../public/components/restaurant/restaurantlist";
import Circles from "../../public/components/circles/circles";

const RestaurantPage = () => {
  const searchParams = useSearchParams();
  const cuisineTypeFromUrl = searchParams.get("cuisineType");

  const [restaurants, setRestaurants] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  // Renamed from 'isLoading' for clearer semantic meaning regarding animation
  const [showRestaurants, setShowRestaurants] = useState(false); // Initial state is false for fade-in on first load

  // --- Effect 1: Initialize local 'selectedCuisine' state from URL on load/URL change ---
  useEffect(() => {
    if (cuisineTypeFromUrl !== null && selectedCuisine !== cuisineTypeFromUrl) {
      setSelectedCuisine(cuisineTypeFromUrl);
    } else if (cuisineTypeFromUrl === null && selectedCuisine !== null) {
      setSelectedCuisine(null);
    }
  }, [cuisineTypeFromUrl, selectedCuisine]);

  // --- Effect 2: Fetch restaurants whenever 'selectedCuisine' state changes ---
  useEffect(() => {
    let isMounted = true; // Flag to track if component is mounted
    let timeoutId: NodeJS.Timeout; // To store timeout ID for cleanup

    const fetchRestaurants = async () => {
      // Step 1: Hide content (fade out)
      // This should trigger the 'fading-out' class and transition opacity to 0
      setShowRestaurants(false);

      // Step 2: Add a delay to ensure the fade-out animation completes
      // This delay should be at least as long as your CSS 'fading-out' transition duration.
      // (Your CSS has 0.5s for opacity transition)
      await new Promise((resolve) => (timeoutId = setTimeout(resolve, 300))); // 300ms is a safe delay for a 0.5s transition

      // Check if the component is still mounted after the delay (prevents errors on rapid unmount/re-render)
      if (!isMounted) return;

      let url = "http://localhost:8080/restaurant";
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
        // Only update state if this effect run is still active (component mounted)
        if (isMounted) {
          setRestaurants(data);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        if (isMounted) {
          setRestaurants([]);
        }
      } finally {
        // Step 3: Show content (fade in) after data is set
        // This will trigger the 'fading-in' class and transition opacity to 1
        if (isMounted) {
          setShowRestaurants(true);
        }
      }
    };

    fetchRestaurants();

    // Cleanup function: runs when component unmounts or before effect re-runs (e.g., selectedCuisine changes again)
    return () => {
      isMounted = false; // Mark this instance of the effect as inactive
      clearTimeout(timeoutId); // Clear any pending timeout from this effect instance
    };
  }, [selectedCuisine]); // Effect runs when selectedCuisine changes

  return (
    <div>
      <Header />
      <Circles
        onSelectCuisine={setSelectedCuisine}
        selectedCuisine={selectedCuisine}
      />
      {/* Pass the new 'showRestaurants' prop to RestaurantList */}
      <RestaurantList restaurants={restaurants} showContent={showRestaurants} />
      <Footer />
    </div>
  );
};

export default RestaurantPage;
