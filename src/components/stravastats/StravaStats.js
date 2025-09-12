"use client";

import { useEffect, useState } from "react";
import polyline from "@mapbox/polyline";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip as RadarTooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import Confetti from "react-confetti";
import dynamic from "next/dynamic";

// --- Helpers ---
const formatTime = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2,"0")}`;
const formatKm = m => `${(m / 1000).toFixed(1)} km`;
const formatKmh = s => `${(s * 3.6).toFixed(1)} km/h`;
const getMapUrl = activity => {
  if(!activity?.map?.summary_polyline) return null;
  const coords = polyline.decode(activity.map.summary_polyline);
  return `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/path-4+ff6600(${coords.map(c => c[1]+','+c[0]).join(';')})/auto/300x180?access_token=YOUR_MAPBOX_ACCESS_TOKEN`;
};

// --- Activity Card ---
function ActivityCard({ act, i, showConfetti }) {
  const mapUrl = getMapUrl(act);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: i % 2 === 0 ? -2 : 2 }}
      whileInView={{ opacity:1, y:0, rotate:0 }}
      viewport={{ once:true }}
      transition={{ type:"spring", stiffness:100, damping:20, delay:i*0.2 }}
      className="bg-gray-800 rounded-3xl p-6 shadow-2xl relative flex flex-col md:flex-row gap-6 min-h-[220px]"
    >
      {showConfetti && <Confetti numberOfPieces={50} recycle={false} gravity={0.3} />}
      
      {/* Map */}
      {mapUrl && (
        <img src={mapUrl} className="rounded-xl md:w-1/3 h-48 object-cover shadow-inner" />
      )}

      {/* Stats + Mini Chart */}
      <div className="flex-1 flex flex-col justify-between">
        <h3 className={`font-bold text-xl ${act.type==="Run"?"text-red-400":"text-blue-400"}`}>{act.name}</h3>
        <div className="text-gray-300 space-y-1 mt-2">
          <p>Distance: {formatKm(act.distance)}</p>
          <p>Time: {formatTime(act.moving_time)}</p>
          <p>Speed: {formatKmh(act.average_speed)}</p>
          <p>Elevation: {act.total_elevation_gain} m</p>
        </div>

        {/* Mini Pace Chart */}
        <div className="w-full h-20 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={act.splits.map((s,j)=>({km:j+1, pace:s}))}>
              <XAxis dataKey="km" hide />
              <YAxis hide domain={['auto','auto']} />
              <Line type="monotone" dataKey="pace" stroke={act.type==="Run"?"#f87171":"#60a5fa"} strokeWidth={2} dot={false} isAnimationActive />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

// --- Main Dashboard ---
export default function StravaWrappedDashboard() {
  const [activities, setActivities] = useState([]);
  const [pbs, setPbs] = useState(null);

  useEffect(() => {
    // Dummy activities
    const dummyActivities = [
      { id:1,name:"Morning Run",type:"Run",distance:5000,moving_time:1500,average_speed:3,total_elevation_gain:50,map:{summary_polyline:"_p~iF~ps|U_ulLnnqC_mqNvxq`@"},splits:[300,290,310,305,295],date:"2025-09-10" },
      { id:2,name:"Evening Ride",type:"Ride",distance:20000,moving_time:3600,average_speed:5.5,total_elevation_gain:120,map:{summary_polyline:"a~l~Fjk~uOwHJy@P"},splits:[350,340,330,360,355],date:"2025-09-09" },
      { id:3,name:"Long Run",type:"Run",distance:10000,moving_time:3200,average_speed:3.1,total_elevation_gain:100,map:{summary_polyline:"_p~iF~ps|U_ulLnnqC_mqNvxq`@"},splits:[310,320,305,300,315,325,310,300,305,315],date:"2025-09-07" },
      { id:4,name:"Afternoon Ride",type:"Ride",distance:25000,moving_time:4200,average_speed:6,total_elevation_gain:150,map:{summary_polyline:"gfo}EtohhUxD@bAxJmGF"},splits:[360,355,345,350,365,370,360],date:"2025-09-05" },
      { id:5,name:"Evening Run",type:"Run",distance:7000,moving_time:2200,average_speed:3.2,total_elevation_gain:80,map:{summary_polyline:"_p~iF~ps|U_ulLnnqC_mqNvxq`@"},splits:[305,310,300,315,320,310,305],date:"2025-09-03" },
    ];
    setActivities(dummyActivities);

    // Dynamic PBs
    const running = dummyActivities.filter(a=>a.type==="Run");
    const cycling = dummyActivities.filter(a=>a.type==="Ride");
    setPbs({
      running: {
        fiveK: running.filter(a=>a.distance>=5000).reduce((best,a)=>!best||a.moving_time<best.moving_time?a:best,null),
        tenK: running.filter(a=>a.distance>=10000).reduce((best,a)=>!best||a.moving_time<best.moving_time?a:best,null)
      },
      cycling: {
        longestRide: cycling.reduce((max,a)=>!max||a.distance>max.distance?a:max,null),
        fastestRide: cycling.reduce((max,a)=>!max||a.average_speed>max.average_speed?a:max,null)
      }
    });
  }, []);

  const radarData = activities.map(act=>({
    name: act.name,
    Speed: act.average_speed,
    Distance: act.distance/1000,
    Elevation: act.total_elevation_gain
  }));

  const Particles = dynamic(
    () => import("react-tsparticles").then((mod) => mod.Particles),
    { ssr: false }
  );

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };
  const particlesOptions = {
    particles: {
      number: { value: 50 },
      size: { value: 3 },
      move: { speed: 0.5 },
      opacity: { value: 0.5 },
      color: { value: "#f87171" }
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen overflow-hidden p-6">
      <Particles
        className="absolute inset-0 -z-10"
        init={particlesInit}
        options={{
          particles: {
            number: { value: 50 },
            size: { value: 3 },
            move: { speed: 0.5 },
            opacity: { value: 0.5 },
            color: { value: "#f87171" },
          },
        }}
      />
      <motion.h1 initial={{opacity:0, y:-50}} animate={{opacity:1, y:0}} className="text-4xl font-bold text-orange-400 text-center mb-8">
        Strava Wrapped 2025
      </motion.h1>

      {/* PB Badges */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {pbs && Object.entries(pbs).map(([type, metrics]) =>
          Object.entries(metrics).map(([key, value]) => value && (
            <motion.div key={`${type}-${key}`} whileHover={{scale:1.1}} className="bg-gray-700 rounded-2xl px-6 py-4 flex flex-col items-center relative shadow-lg">
              <span className="text-sm text-gray-300">{key.replace(/([A-Z])/g,' $1')}</span>
              <span className="text-lg font-bold">{value.moving_time?formatTime(value.moving_time):formatKm(value.distance)}</span>
              {value.distance && <span className="text-xs text-gray-400">{formatKm(value.distance)}</span>}
              <Confetti numberOfPieces={20} recycle={false} gravity={0.3} />
            </motion.div>
          ))
        )}
      </div>

      {/* Vertical Activity Feed */}
      <div className="flex flex-col gap-8">
        {activities.map((act,i)=>(
          <ActivityCard key={act.id} act={act} i={i} showConfetti={true} />
        ))}
      </div>

      {/* Radar Chart Overlay */}
      <motion.div className="absolute bottom-8 right-8 w-64 h-64 bg-gray-800 bg-opacity-50 rounded-xl p-2 shadow-xl">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#4b5563"/>
            <PolarAngleAxis dataKey="name" stroke="#9ca3af"/>
            <PolarRadiusAxis stroke="#9ca3af"/>
            <Radar name="Speed" dataKey="Speed" stroke="#f87171" fill="#f87171" fillOpacity={0.5} isAnimationActive/>
            <Radar name="Distance" dataKey="Distance" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.5} isAnimationActive/>
            <Radar name="Elevation" dataKey="Elevation" stroke="#34d399" fill="#34d399" fillOpacity={0.5} isAnimationActive/>
            <Legend />
            <RadarTooltip/>
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
