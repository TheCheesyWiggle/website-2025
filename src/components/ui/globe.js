"use client";
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

extend({ ThreeGlobe });

const aspect = 1.2;
const cameraZ = 300;

export const Globe = forwardRef(function Globe({ globeConfig, data, pointsData }, ref) {
  const globeRef = useRef(null);
  const groupRef = useRef();
  const [isInitialized, setIsInitialized] = useState(false);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    ...globeConfig,
  };

  useImperativeHandle(ref, () => globeRef.current, [isInitialized]);

  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      const globe = new ThreeGlobe();
      globe.pointsData(pointsData || []);
      globe.pointLat(d => d.lat);
      globe.pointLng(d => d.lng);
      globe.pointColor(d => d.color || "orange");
      globe.pointAltitude(d => d.altitude || 0.02);
      globe.pointRadius(d => d.size || 0.5);

      globeRef.current = globe;
      groupRef.current.add(globeRef.current);
      setIsInitialized(true);
    }
  }, [pointsData]);

  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;
    const globeMaterial = globeRef.current.globeMaterial();
    globeMaterial.color = new Color(defaultProps.globeColor);
    globeMaterial.emissive = new Color(defaultProps.emissive);
    globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity;
    globeMaterial.shininess = defaultProps.shininess;
  }, [isInitialized, defaultProps.globeColor, defaultProps.emissive, defaultProps.emissiveIntensity, defaultProps.shininess]);

  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);

    globeRef.current
      .arcsData(data || [])
      .arcStartLat(d => d.startLat)
      .arcStartLng(d => d.startLng)
      .arcEndLat(d => d.endLat)
      .arcEndLng(d => d.endLng)
      .arcColor(d => d.color)
      .arcAltitude(d => d.arcAlt || 0.2);

  }, [isInitialized, data, defaultProps.showAtmosphere, defaultProps.atmosphereColor, defaultProps.atmosphereAltitude, defaultProps.polygonColor]);

  return <group ref={groupRef} />;
});

export function WebGLRendererConfig() {
  return null; // removed useThree hook entirely
}

function latLngToVector3(lat, lng, radius = 200, altitude = 1.0) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const r = radius * altitude;
  return new Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

export const World = forwardRef(function World(props, ref) {
  const { globeConfig, pointsData, data } = props;
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);

  const cameraRef = useRef();

  useImperativeHandle(ref, () => ({
    flyTo(lat, lng, altitude = 1.5, duration = 2000) {
      if (!cameraRef.current) return;

      const target = latLngToVector3(lat, lng, 200, altitude);
      const camera = cameraRef.current;

      const start = camera.position.clone();
      const startTime = performance.now();

      function animate() {
        const elapsed = performance.now() - startTime;
        const t = Math.min(1, elapsed / duration);

        camera.position.lerpVectors(start, target, t);
        camera.lookAt(new Vector3(0, 0, 0));

        if (t < 1) requestAnimationFrame(animate);
      }
      animate();
    }
  }));
  return (
    <Canvas
      scene={scene}
      camera={new PerspectiveCamera(50, aspect, 180, 1800)}
      onCreated={({ camera }) => (cameraRef.current = camera)}
    >
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight color={globeConfig.directionalLeftLight} position={new Vector3(-400, 100, 400)} />
      <directionalLight color={globeConfig.directionalTopLight} position={new Vector3(-200, 500, 200)} />
      <pointLight color={globeConfig.pointLight} position={new Vector3(-200, 500, 200)} intensity={0.8} />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={1}
        autoRotate
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
});
