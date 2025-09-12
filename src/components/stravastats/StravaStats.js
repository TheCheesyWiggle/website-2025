"use client";

import { useEffect, useState } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

export default function StravaStats() {
  const [radarData, setRadarData] = useState([]);
  const [pbs, setPbs] = useState(null);
  const [lastActivity, setLastActivity] = useState(null);

  useEffect(() => {
    // Dummy activities
    const dummyActivities = [
        {
        id: 1,
        name: "Morning Run",
        type: "Run",
        distance: 5000,
        moving_time: 1500,
        average_speed: 3,
        total_elevation_gain: 50,
        map: { summary_polyline: "_p~iF~ps|U_ulLnnqC_mqNvxq`@" },
        },
        {
        id: 2,
        name: "Evening Ride",
        type: "Ride",
        distance: 20000,
        moving_time: 3600,
        average_speed: 5.5,
        total_elevation_gain: 120,
        map: { summary_polyline: "a~l~Fjk~uOwHJy@P" },
        },
        {
        id: 3,
        name: "Long Run",
        type: "Run",
        distance: 10000,
        moving_time: 3200,
        average_speed: 3.1,
        total_elevation_gain: 100,
        map: { summary_polyline: "_p~iF~ps|U_ulLnnqC_mqNvxq`@" },
        },
    ];

    // Pick the most recent activity that has a map
    const last = [...dummyActivities].reverse().find(a => a.map?.summary_polyline);

    const runningActivities = dummyActivities.filter(a => a.type === "Run");
    const cyclingActivities = dummyActivities.filter(a => a.type === "Ride");

    // Dummy PBs: fastest/longest runs and rides
    const dummyPbs = {
        running: {
        fiveK: runningActivities.find(a => a.distance >= 5000) || null,
        tenK: runningActivities.find(a => a.distance >= 10000) || null,
        },
        cycling: {
        longestRide: cyclingActivities.reduce((max, a) => (!max || a.distance > max.distance ? a : max), null),
        fastestRide: cyclingActivities.reduce((max, a) => (!max || a.average_speed > max.average_speed ? a : max), null),
        },
    };

    // Radar data from the last activity (example)
    const radar = last
        ? [
            { subject: "Speed", value: last.average_speed },
            { subject: "Distance", value: last.distance },
            { subject: "Elevation", value: last.total_elevation_gain },
        ]
        : [];

    setRadarData(radar);
    setPbs(dummyPbs);
    setLastActivity(last);
    }, []);


  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const formatKm = (m) => `${(m / 1000).toFixed(2)} km`;
  const formatKmh = (s) => `${(s * 3.6).toFixed(1)} km/h`;

  // Dummy static map coordinates
  const coords = lastActivity ? [
    [38.5, -120.2],
    [40.7, -120.95],
    [43.252, -126.453],
  ] : [];

  const staticMapUrl = coords.length > 0
    ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/path-5+ff0000(${coords.map(c => c[1]+','+c[0]).join(';')})/auto/500x300?access_token=YOUR_MAPBOX_ACCESS_TOKEN`
    : null;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Athlete Component</h2>
      <div className="grid grid-cols-2 grid-rows-2 gap-4 border border-gray-300">
        {/* Cycling PBs */}
        <div className="flex flex-col items-center justify-center border border-gray-300 p-4">
          <span className="text-lg font-medium mb-2">Cycling PBs</span>
          {pbs?.cycling ? (
            <ul className="text-sm">
              {pbs.cycling.longestRide && (
                <li>
                  Longest Ride: {formatKm(pbs.cycling.longestRide.distance)} in{" "}
                  {formatTime(pbs.cycling.longestRide.moving_time)}
                </li>
              )}
              {pbs.cycling.fastestRide && (
                <li>
                  Fastest Ride: {formatKmh(pbs.cycling.fastestRide.average_speed)} (
                  {formatKm(pbs.cycling.fastestRide.distance)})
                </li>
              )}
            </ul>
          ) : <span>No cycling PBs found</span>}
        </div>

        {/* Spotlight on last activity */}
        <div className="flex flex-col items-center justify-center border border-gray-300 p-4">
          <span className="text-lg font-medium mb-2">Spotlight on last activity</span>
          {lastActivity ? (
            <div className="w-full">
              <p className="font-semibold">{lastActivity.name}</p>
              <p>
                {formatKm(lastActivity.distance)} | {formatTime(lastActivity.moving_time)} | {formatKmh(lastActivity.average_speed)}
              </p>
              {staticMapUrl && (
                <div className="h-48 w-full mt-2">
                  <img src={staticMapUrl} alt="Last activity route" className="h-full w-full rounded object-cover" />
                </div>
              )}
            </div>
          ) : <span>No recent activity</span>}
        </div>

        {/* Running PBs */}
        <div className="flex flex-col items-center justify-center border border-gray-300 p-4">
          <span className="text-lg font-medium mb-2">Running PBs</span>
          {pbs?.running ? (
            <ul className="text-sm">
              {pbs.running.fiveK && (
                <li>
                  Fastest 5k: {formatTime(pbs.running.fiveK.moving_time)} ({formatKm(pbs.running.fiveK.distance)})
                </li>
              )}
              {pbs.running.tenK && (
                <li>
                  Fastest 10k: {formatTime(pbs.running.tenK.moving_time)} ({formatKm(pbs.running.tenK.distance)})
                </li>
              )}
            </ul>
          ) : <span>No running PBs found</span>}
        </div>

        {/* Radar graph running */}
        <div className="flex flex-col items-center justify-center border border-gray-300 p-4">
          <div className="w-full h-64">
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="Running" dataKey="value" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <span className="text-lg font-medium mt-2">Radar graph running</span>
        </div>
      </div>
    </div>
  );
}
