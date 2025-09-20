"use client";
import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback
} from "react";
import dynamic from "next/dynamic";

// Dynamically import Globe
const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full text-gray-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
      Loading globe...
    </div>
  ),
});

export const World = forwardRef(({ pointsData = [], onPinClick, onReady }, ref) => {
  const globeRef = useRef(null);
  const containerRef = useRef(null);
  const actionQueue = useRef([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [globeInternalReady, setGlobeInternalReady] = useState(false); // Fixed: was missing
  const [refReady, setRefReady] = useState(false);

  // ResizeObserver → responsive globe
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver(() => {
      setSize({ width: el.clientWidth, height: el.clientHeight });
    });
    ro.observe(el);
    setSize({ width: el.clientWidth, height: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // Flush queued actions
  const flushQueue = useCallback(() => {
    console.debug("[World] Flushing queued actions:", actionQueue.current.length);
    actionQueue.current.forEach(fn => fn());
    actionQueue.current = [];
  }, []);

  // Handle globe readiness from the underlying library
  const handleGlobeReady = useCallback(() => {
    console.debug("[World] Internal globe ready");
    setGlobeInternalReady(true);
    flushQueue();
  }, [flushQueue]);

  // Check if both globe and ref are ready
  const isFullyReady = globeInternalReady && refReady;

  // Combine internal readiness with external ref
  useEffect(() => {
    // Only call onReady when both the internal globe is ready AND the ref is populated
    if (isFullyReady && onReady) {
      console.debug("[World] Fully ready, calling onReady()");
      onReady();
    }
  }, [isFullyReady, onReady]);

  // Expose API to parent via ref
  useImperativeHandle(ref, () => {
    // Mark ref as ready when this executes
    setRefReady(true);

    const flyTo = (lat, lng, altitude = 1.5, duration = 2000) => {
      const fn = () => {
        if (globeRef.current?.pointOfView) {
          console.debug("[World] flyTo executed", { lat, lng, altitude, duration });
          globeRef.current.pointOfView({ lat, lng, altitude }, duration);
        } else {
          console.warn("[World] flyTo failed - no pointOfView method");
        }
      };
      if (!globeInternalReady) {
        console.debug("[World] flyTo queued", { lat, lng, altitude, duration });
        actionQueue.current.push(fn);
      } else {
        fn();
      }
    };

    const pointOfView = (coords, duration = 1000) => {
      const fn = () => {
        if (globeRef.current?.pointOfView) {
          console.debug("[World] pointOfView executed", coords);
          globeRef.current.pointOfView(coords, duration);
        } else {
          console.warn("[World] pointOfView failed - no pointOfView method");
        }
      };
      if (!globeInternalReady) {
        console.debug("[World] pointOfView queued", coords);
        actionQueue.current.push(fn);
      } else {
        fn();
      }
    };

    return {
      flyTo,
      pointOfView,
      getGlobe: () => globeRef.current,
      controls: () => globeRef.current?.controls?.(),
      isReady: () => isFullyReady
    };
  }, [globeInternalReady, isFullyReady]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {size.width && size.height ? (
        <Globe
          ref={globeRef}
          globeImageUrl="/earth-blue-marble.jpg"
          bumpImageUrl="/earth-topology.png"
          pointsData={pointsData}
          pointAltitude={0.025}
          pointColor={() => "red"}
          pointLabel={d => d.name}
          onPointClick={onPinClick}
          width={size.width}
          height={size.height}
          onGlobeReady={handleGlobeReady}
          animateIn={true}
          showAtmosphere={true}
          atmosphereColor="lightskyblue"
          atmosphereAltitude={0.25}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          Loading globe...
        </div>
      )}
    </div>
  );
});

World.displayName = "World";