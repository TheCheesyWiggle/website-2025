"use client";
import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import Globe from "react-globe.gl";

export const World = forwardRef(
  ({ pointsData = [], onPinClick, onReady }, ref) => {
    const globeRef = useRef(null);
    const containerRef = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useImperativeHandle(
      ref,
      () => ({
        pointOfView: (coords, duration) => {
          if (
            globeRef.current &&
            typeof globeRef.current.pointOfView === "function"
          ) {
            globeRef.current.pointOfView(coords, duration);
          }
        },
        getGlobe: () => globeRef.current,
      }),
      [],
    );

    // Globe ready callback
    useEffect(() => {
      if (globeRef.current && onReady) {
        const timer = setTimeout(() => onReady(), 500);
        return () => clearTimeout(timer);
      }
    }, [onReady]);

    // Resize observer to fill parent container
    useEffect(() => {
      const updateSize = () => {
        if (containerRef.current) {
          const { clientWidth, clientHeight } = containerRef.current;
          setSize({ width: clientWidth, height: clientHeight });
        }
      };
      updateSize();
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }, []);

    return (
      <div ref={containerRef} className="w-full h-full">
        {size.width > 0 && size.height > 0 && (
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
            width={size.width}
            height={size.height}
          />
        )}
      </div>
    );
  },
);

World.displayName = "World";
