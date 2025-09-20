import React, { useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";

const WorldDynamic = dynamic(() => import("../ui/globe").then(m => m.World), { ssr: false });

export default function TravelGlobe() {
  const worldRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [globeReady, setGlobeReady] = useState(false);

  const myPlaces = [
    { 
      name: "Ladakh, India", 
      lat: 34.378333, 
      lng: 77.604167, 
      description: "2nd highest motorable pass!", 
      image: "/travel/kardungla.jpg" 
    },
    { 
      name: "Eyri National Park, Wales", 
      lat: 53.043195, 
      lng: -4.031265, 
      description: "Crib Goch in wind, rain, mist", 
      image: "/travel/cribgoch.png" 
    },
    { 
      name: "Bristol, England", 
      lat: 51.272764, 
      lng: -2.374044, 
      description: "Bristol balloon fiesta", 
      image: "/travel/ballonfiesta.jpg" 
    }
  ];

  const flyToPlace = useCallback((place) => {
    console.log("[TravelGlobe] flyToPlace called:", place.name);
    
    // Enhanced checks for globe readiness
    if (!globeReady || !worldRef.current) {
      console.warn("[TravelGlobe] Globe not ready, cannot fly. Ready:", globeReady, "Ref:", !!worldRef.current);
      return;
    }

    // Additional check to see if the flyTo method exists
    if (typeof worldRef.current.flyTo !== 'function') {
      console.error("[TravelGlobe] flyTo method not available on worldRef.current");
      console.log("Available methods:", Object.keys(worldRef.current));
      return;
    }

    try {
      console.debug("[TravelGlobe] Flying to:", place.name, "at", place.lat, place.lng);
      worldRef.current.flyTo(place.lat, place.lng, 2, 1200);
      setSelectedPlace(place);
    } catch (error) {
      console.error("[TravelGlobe] Error during flyTo:", error);
    }
  }, [globeReady]);

  const handleGlobeReady = useCallback(() => {
    console.log("[TravelGlobe] Globe ready callback triggered");
    
    // Double-check that the ref is actually available
    if (!worldRef.current) {
      console.warn("[TravelGlobe] worldRef.current is null in handleGlobeReady");
      return;
    }

    console.log("WorldRef current:", worldRef.current);
    console.log("WorldRef methods:", Object.keys(worldRef.current));
    
    setGlobeReady(true);
    
    // Set initial view with error handling
    try {
      if (typeof worldRef.current.flyTo === 'function') {
        // Start with a nice overview of Earth
        setTimeout(() => {
          worldRef.current.flyTo(20, 0, 2, 1400);
        }, 200); // Small delay to ensure everything is settled
      } else {
        console.warn("[TravelGlobe] flyTo method not available during initialization");
      }
    } catch (error) {
      console.error("[TravelGlobe] Error setting initial view:", error);
    }
  }, []);

  return (
    <div className="w-full h-screen max-h-screen overflow-hidden flex flex-col md:flex-row">
      <div className="flex-1 flex justify-center items-center relative">
        {/* Enhanced debug info */}
        <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs p-2 rounded">
          <div>Globe Ready: {globeReady ? "✅" : "⌛"}</div>
          <div>WorldRef: {worldRef.current ? "✅" : "⌛"}</div>
          <div>FlyTo Available: {worldRef.current?.flyTo ? "✅" : "❌"}</div>
          <div>Selected: {selectedPlace?.name || "None"}</div>
        </div>
        
        <WorldDynamic
          ref={worldRef}
          pointsData={myPlaces}
          onPinClick={flyToPlace}
          onReady={handleGlobeReady}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>

      <div className="w-full md:w-1/3 h-1/3 md:h-full overflow-y-auto p-4 bg-white dark:bg-black">
        <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Travel Gallery</h2>
        {myPlaces.map((place, idx) => (
          <div
            key={idx}
            className={`mb-6 cursor-pointer group transition-all duration-200 p-2 rounded ${
              selectedPlace?.name === place.name 
                ? "border-l-4 border-sky-400 bg-sky-50 dark:bg-sky-900/20" 
                : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-4 border-transparent"
            }`}
            onClick={() => flyToPlace(place)}
          >
            <h3 className="font-bold text-lg text-black dark:text-white group-hover:text-sky-400 transition">
              {place.name}
            </h3>
            <img 
              src={place.image} 
              alt={place.name} 
              className="w-full max-w-sm rounded-lg my-2 shadow-md group-hover:shadow-xl transition-shadow"
              onError={(e) => {
                console.warn(`[TravelGlobe] Failed to load image: ${place.image}`);
                e.target.style.display = 'none';
              }}
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