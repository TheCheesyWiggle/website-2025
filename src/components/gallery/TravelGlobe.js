"use client";
import React, { useRef, useEffect } from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";

const World = dynamic(() => import("../ui/globe").then((m) => m.World), {
  ssr: false,
});

export default function TravelGlobe() {
  const worldRef = useRef();

  const myPlaces = [
    {
      name: "Ladakh, India",
      lat: 34.378333,
      lng: 77.604167,
      image: "/travel/kardungla.jpg",
      description: "2nd highest motorable pass in the world!",
      color: "red",
      size: 0.25,
    },
    {
      name: "Eyri National Park, Wales",
      lat: 53.043195,
      lng: -4.031265,
      image: "/travel/cribgoch.png",
      description: "Crib Goch in the wind,rain and mist",
      color: "red",
      size: 0.25,
    },
    {
      name: "Bristol, England",
      lat: 51.272764,
      lng: -2.374044,
      image: "/travel/ballonfiesta.jpg",
      description: "Bristol ballon fiesta",
      color: "red",
      size: 0.25,
    },
  ];

  const globeConfig = {
    pointSize: 6,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  const handleFly = (place) => {
    if (worldRef.current?.flyTo) {
      worldRef.current.flyTo(place.lat, place.lng, 1.5, 2000);
    } else {
      console.log("worldRef:", worldRef.current);
    }
  };

  useEffect(() => {
    if (worldRef.current?.flyTo && myPlaces.length > 0) {
      worldRef.current.flyTo(myPlaces[0].lat, myPlaces[0].lng, 1.5, 2000);
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full h-screen dark:bg-black bg-white relative">
      {/* Globe */}
      <div className="md:w-2/3 relative h-[500px] md:h-full">
        <World ref={worldRef} data={[]} pointsData={myPlaces} globeConfig={globeConfig} />
      </div>

      {/* Gallery */}
      <div className="md:w-1/3 p-4 overflow-y-auto h-[500px] md:h-full">
        {myPlaces.map((place) => (
          <div
            key={place.name}
            className="mb-6 cursor-pointer group"
            onClick={() => handleFly(place)}
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