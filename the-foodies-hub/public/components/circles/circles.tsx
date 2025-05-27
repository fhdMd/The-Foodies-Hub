"use client";

import React, { useState } from "react";
import "./circles.css";
import Image from "next/image";
import { useRouter } from "next/navigation"; // <-- Import useRouter

import saladImg from "./images/salads.jpg";
import northIndImg from "./images/north-indian.jpg";
import chineseImg from "./images/chinese.jpg";
import southIndImg from "./images/south-indian.jpg";

interface CirclesProps {
  onSelectCuisine: (cuisine: string | null) => void;
  selectedCuisine: string | null;
}

const Circles = ({ onSelectCuisine, selectedCuisine }: CirclesProps) => {
  const router = useRouter(); // Initialize useRouter
  const circles = ["Salads", "North Indian", "Chinese", "South Indian"];
  const paths = [saladImg, northIndImg, chineseImg, southIndImg];

  const handleClick = (cuisine: string) => {
    let newSelectedCuisine: string | null;

    // Determine the new selection state (for visual feedback)
    if (selectedCuisine === cuisine) {
      newSelectedCuisine = null; // Unselect if already selected
    } else {
      newSelectedCuisine = cuisine; // Select new cuisine
    }

    // Update the parent's state (for visual selection)
    onSelectCuisine(newSelectedCuisine);

    // --- Redirection Logic ---
    if (newSelectedCuisine) {
      // If a cuisine is selected, navigate with the filter
      router.push(`/restaurant?cuisineType=${newSelectedCuisine}`);
    } else {
      // If no cuisine is selected (unselected), navigate to /restaurant without filter
      router.push("/restaurant");
    }
  };

  return (
    <div className="category">
      {circles.map((circle, index) => (
        // The onClick is on the div wrapping the Circle component
        <div
          onClick={() => handleClick(circle)}
          key={index}
          style={{ cursor: "pointer" }}
        >
          <Circle
            circle={circle}
            num={index}
            path={paths[index]}
            isSelected={selectedCuisine === circle}
          />
        </div>
      ))}
    </div>
  );
};

interface CircleProps {
  circle: string;
  path: any;
  num: number;
  isSelected: boolean;
}

const Circle = (props: CircleProps) => {
  let size = 250;
  return (
    <div
      className={`circle albert-sans-regular ${
        props.isSelected ? "selected" : ""
      }`}
    >
      <Image
        src={props.path}
        className="circle-img"
        alt={props.circle + props.num}
        width={size}
        height={size}
      />
      <p className="circle-text">{props.circle}</p>
    </div>
  );
};

export default Circles;
