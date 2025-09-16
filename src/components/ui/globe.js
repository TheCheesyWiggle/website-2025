"use client";
import React, { forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import Globe from "react-globe.gl";

export const World = forwardRef(({ pointsData = [], onPinClick }, ref) => {
  const globeRef = useRef(null);

  useImperativeHandle(ref, () => globeRef.current, [globeRef.current]);


  useEffect(() => {
    if (globeRef.current) {
      console.log("Globe mounted and ready:", globeRef.current);
    }
  }, []);

  return (
    <Globe
      ref={globeRef}
      globeImageUrl="/earth-blue-marble.jpg"
      bumpImageUrl="/earth-topology.png"
      pointsData={pointsData}
      pointAltitude={0.025}
      pointColor={() => "red"}
      pointLabel={(d) => d.name}
      onPointClick={onPinClick}
      animateIn={true}
    />
  );
});
