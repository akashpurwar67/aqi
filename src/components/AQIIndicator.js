import React, { useState, useEffect, useContext } from "react";
import { AQIContext } from "../context/AQIContext";
import { MapPinIcon } from '@heroicons/react/20/solid'; // Correct import for v2


const AQIIndicator = () => {
  const { aqiData } = useContext(AQIContext);

  const [aqi, setAqi] = useState(0); // For AQI value
  const [deg, setDeg] = useState(5); // For rotation degree
  let aqiFromAPI = aqiData?.aqi;
  const city = aqiData?.city?.name;
  const aqiP = aqiData?.iaqi;

  if (aqiFromAPI > 500) {
    aqiFromAPI = 500; // AQI can't be greater than 500
  }
  const getAqiColor = (aqi) => {
    if (aqi >= 0 && aqi <= 50) {
      return 'green'; // Good
    } else if (aqi > 50 && aqi <= 100) {
      return 'yellow'; // Moderate
    } else if (aqi > 100 && aqi <= 150) {
      return 'orange'; // Unhealthy for Sensitive Groups
    } else if (aqi > 150 && aqi <= 200) {
      return 'red'; // Unhealthy
    } else if (aqi > 200 && aqi <= 300) {
      return 'purple'; // Very Unhealthy
    } else if (aqi > 300 && aqi <= 500) {
      return 'maroon'; // Hazardous
    } else {
      return 'gray'; // Unknown
    }
  };
  // Function to calculate the rotation degree based on AQI
  const calculateValue = (aqi) => (aqi / 500) * 350 + 5;

  // Effect to simulate AQI increment
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAqi((prevAqi) => {
        if (prevAqi === aqiFromAPI) {
          clearInterval(intervalId);
          return prevAqi; // Stop increment when AQI reaches the target
        }
        const newAqi = prevAqi + 1;
        setDeg(calculateValue(newAqi)); // Update degree based on new AQI
        return newAqi;
      });
    }, 10);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="flex items-center justify-center mt-20 mb-12 space-x-10">
      {/* AQI Indicator Circle */}
      <div
        id="meter"
        className="relative w-80 h-80 rounded-full grid place-items-center"
        style={{
          backgroundImage:
            "conic-gradient(from 0deg, rgba(0, 222, 114, 1), rgba(255, 226, 28, 1), rgba(255, 141, 6, 1), rgba(251, 42, 63, 1), rgba(178, 1, 238, 1), rgba(109, 9, 25, 1))",
          position: "relative",
          borderRadius: "100%",
        }}
      >
        <div
          className="absolute bg-gradient-to-r from-blue-600 to-blue-400"
          style={{
            width: "90%",
            height: "90%",
            borderRadius: "100%",
            padding: "15%",
            borderWidth: "1px",
          }}
        ></div>
        <div
          id="indicator"
          className="absolute flex justify-center"
          style={{
            height: "100%",
            width: "100%",
            transform: `rotate(${deg}deg)`,
            transition: "0.2s",
          }}
        >
          <div
            className="w-[20px] h-[20px] bg-gray-600 border-gray-900 border rounded-full"
            style={{ top: "0px" }}
          ></div>
        </div>
        <h1
          id="current-aqi"
          className="absolute text-7xl text-white tracking-widest text-center mb-4 ml-3"
          style={{
            fontSize: "100px",
            color: "whitesmoke",
            textAlign: "center",
            lineHeight: "20px",
          }}
        >
          {aqi}
        </h1>
        <p
          className="absolute text-2xl text-gray-300 top-[70%] text-center"
          style={{
            fontSize: "30px",
            color: "white",
            position: "absolute",
            top: "80%",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          AQI
        </p>
      </div>

      {/* Pollutants Info Card */}
      <div className="w-1/3">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
  <MapPinIcon className="h-6 w-6 text-blue-700" /> {/* Location icon */}
  {city || "Unknown City"}
</h3>

        <div className="bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg rounded-lg p-6 text-white">
          <h3 className="text-2xl font-semibold mb-6">Major Air Pollutants</h3>
          <ul className="space-y-4">
            {[
              { label: "O3", value: aqiP?.o3?.v, icon: "🌫️" },
              { label: "PM10", value: aqiP?.pm10?.v, icon: "🌬️" },
              { label: "PM2.5", value: aqiP?.pm25?.v, icon: "🌁" },
              { label: "CO", value: aqiP?.co?.v, icon: "🛢️" },
              { label: "SO2", value: aqiP?.so2?.v, icon: "🌋" },
            ].map((pollutant, index) => (
              <li
                key={index}
                className="flex items-center justify-between border-b border-white/30 pb-2 last:border-none"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{pollutant.icon}</span>
                  <span className="font-medium">{pollutant.label}</span>
                </span>
                <span
                  className={`text-lg font-semibold ${
                    pollutant.value ? "text-white" : "text-gray-300 italic"
                  }`}
                >
                  {pollutant.value || "N/A"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AQIIndicator;
