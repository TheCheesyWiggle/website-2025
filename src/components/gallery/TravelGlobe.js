"use client";
import React, { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

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
    if (
      worldRef.current &&
      typeof worldRef.current.pointOfView === "function"
    ) {
      worldRef.current.pointOfView(
        { lat: place.lat, lng: place.lng, altitude: 2 },
        2000,
      );
    }
  };

  // Initial globe position after mount
  const handleGlobeReady = () => {
    if (
      worldRef.current &&
      typeof worldRef.current.pointOfView === "function"
    ) {
      worldRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2 }, 2000);
    }
  };

  return (
    <div className="w-full h-screen max-h-screen overflow-hidden">
      <div className="flex flex-col md:flex-row w-full h-full">
        {/* Globe Section */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-full h-full">
            <World
              ref={worldRef}
              pointsData={myPlaces}
              onPinClick={flyToPlace}
              onReady={handleGlobeReady}
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        </div>

        {/* Gallery Section */}
        <div className="w-full md:w-1/3 h-1/3 md:h-full overflow-y-auto p-4 bg-white dark:bg-black">
          <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
            Travel Gallery
          </h2>
          {myPlaces.map((place, index) => (
            <div
              key={index}
              className="mb-6 cursor-pointer group"
              onClick={() => flyToPlace(place)}
            >
              <h3 className="font-bold text-lg text-black dark:text-white group-hover:text-sky-400 transition">
                {place.name}
              </h3>
              <Image
                src={place.image}
                alt={place.name}
                className="w-full max-w-sm rounded-lg my-2 shadow-md group-hover:shadow-xl transition"
              />
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {place.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
