"use client";
import React, { useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import the World component (client-only)
const World = dynamic(() => import("../ui/globe").then((m) => m.World), {
  ssr: false,
});

export default function TravelGlobe() {
  const worldRef = useRef(null);

  // Locations to display on the globe and in the gallery
  const myPlaces = [
    {
      name: "Ladakh, India",
      lat: 34.378333,
      lng: 77.604167,
      description: "2nd highest motorable pass in the world!",
      image: "/travel/kardungla.jpg",
    },
    {
      name: "Eyri National Park, Wales",
      lat: 53.043195,
      lng: -4.031265,
      description: "Crib Goch in the wind, rain and mist",
      image: "/travel/cribgoch.png",
    },
    {
      name: "Bristol, England",
      lat: 51.272764,
      lng: -2.374044,
      description: "Bristol balloon fiesta",
      image: "/travel/ballonfiesta.jpg",
    },
  ];

  // Fly the globe to a specific location
  const flyToPlace = (place) => {
    if (worldRef.current?.pointOfView) {
      worldRef.current.pointOfView(
        { lat: place.lat, lng: place.lng, altitude: 2 },
        2000
      );
    }
  };

  // Initial globe position after mount
  const handleGlobeReady = () => {
    if (worldRef.current?.pointOfView) {
      worldRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2 }, 2000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      {/* Globe Section */}
      <div className="flex-1 h-[400px] md:h-full">
        <World
          ref={worldRef}
          pointsData={myPlaces}
          onPinClick={flyToPlace}
          onReady={handleGlobeReady}
        />
      </div>

      {/* Gallery Section */}
      <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-black">
        {myPlaces.map((place) => (
          <div
            key={place.name}
            className="mb-6 cursor-pointer group"
            onClick={() => flyToPlace(place)}
          >
            <h3 className="font-bold text-lg text-black dark:text-white group-hover:text-sky-400 transition">
              {place.name}
            </h3>
            <img
              src={place.image}
              alt={place.name}
              className="rounded-lg my-2 shadow-md group-hover:shadow-xl transition"
            />
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              {place.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
