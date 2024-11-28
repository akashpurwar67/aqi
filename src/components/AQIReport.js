import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AQIContext } from "../context/AQIContext";

function AQIReport() {
  const { setAqiData, setWeatherData } = useContext(AQIContext);
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [citiesAqiList, setCitiesAqiList] = useState([]); // List of cities with the highest AQI
  const [isNewSearch, setIsNewSearch] = useState(false); // Track if it's a new search

  // Function to fetch data based on latitude and longitude
  const fetchData = async (lat, lon) => {
    const apiKey = "cdc6e581738b1d48511649c1f93e1068";
    if (isNewSearch) {
      // Reset data if it's a new search
      setWeather(null);
      setAqiData(null);
      setError("");
      setIsNewSearch(false); // Reset new search flag after the data is reset
    }

    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      setWeather(weatherResponse.data);
      setWeatherData(weatherResponse.data); // Optional: Can be removed if context isn't necessary here

      // Fetch AQI data using the provided AQI API URL
      const aqiResponse = await axios.get(
        `https://api.waqi.info/feed/geo:${lat};${lon}/?token=d9d950a9dd1ec176e37493cfdb402d0162005cff`
      );
      setAqiData(aqiResponse.data.data);
    } catch {
      setError("Failed to fetch data. Please try again.");
    }
  };

  // Function to get the user's live location (only on button click)
  const getLiveLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchData(latitude, longitude);
        },
        (error) => {
          setError("Unable to retrieve your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  // Get city suggestions
  const fetchSuggestions = async (query) => {
    const geoApiKey = "cdc6e581738b1d48511649c1f93e1068";
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${geoApiKey}`
      );
      setSuggestions(response.data);
    } catch {
      setSuggestions([]);
    }
  };

  // Handle user input and fetch location suggestions
  const handleInputChange = (e) => {
    const query = e.target.value;
    setLocation(query);
    fetchSuggestions(query);
  };

  // Handle city selection
  const handleSuggestionClick = (suggestion) => {
    setLocation(`${suggestion.name}, ${suggestion.country}`);
    setSuggestions([]);
    setIsNewSearch(true); // Mark this as a new search
    fetchData(suggestion.lat, suggestion.lon);
  };

  // Fetch a list of cities with the highest AQI
  const fetchCitiesAqi = async () => {
    const cities = ["New Delhi", "Kanpur", "Lahore", "Lucknow", "Mumbai"]; // Example cities
    const aqiData = [];
    for (let city of cities) {
      try {
        const geoResponse = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=cdc6e581738b1d48511649c1f93e1068`
        );
        const { lat, lon } = geoResponse.data[0];
        const aqiResponse = await axios.get(
          `https://api.waqi.info/feed/geo:${lat};${lon}/?token=d9d950a9dd1ec176e37493cfdb402d0162005cff`
        );
        aqiData.push({
          city,
          aqi: aqiResponse.data.data.aqi,
        });
      } catch (error) {
        console.error(`Failed to fetch AQI for ${city}:`, error);
      }
    }
    setCitiesAqiList(aqiData);
  };

  // Fetch cities with high AQI when the component mounts
  useEffect(() => {
    fetchCitiesAqi(); // Fetch cities with high AQI
  }, []);

  return (
    <div className={`max-w-lg mx-auto p-6 rounded-lg shadow-xl mt-10`}>
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Weather & AQI Report
      </h1>

      {/* Location Search */}
      <div className="relative">
        <input
          type="text"
          className="w-full p-4 border-2 border-gray-300 rounded-2xl shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter City or Country"
          value={location}
          onChange={handleInputChange}
        />
        {suggestions.length > 0 && (
          <ul className="absolute bg-white border border-gray-200 rounded-lg shadow-lg mt-2 w-full z-10 max-h-48 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-3 cursor-pointer hover:bg-blue-100"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.name}, {suggestion.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600 font-semibold mt-4">{error}</p>}

      {/* Fetch Data Button */}
      <button
        className="rounded-2xl w-full bg-blue-600 text-white py-3 rounded-lg shadow-md mt-6 hover:bg-blue-700 transition duration-200 bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400"
        onClick={() => getLiveLocation()}
      >
        Fetch Data for Your Location
      </button>

      {/* Weather Details */}
      {weather && (
        <div className="mt-4 relative w-full max-w p-6 bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400 text-white rounded-2xl shadow-1g">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">{weather.name}</h2>
              <p className="text-sm opacity-90">
                {weather.weather[0].main} &bull;{" "}
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
                className="w-14 h-14"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between items-end bg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="font-medium opacity-80">Wind</p>
                <p className="flex items-center font-semibold">
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.5 8.5a3.5 3.5 0 0 1 0 7h-13a1 1 0 1 1 0-2h13a1.5 1.5 0 1 0 0-3h-12a1 1 0 1 1 0-2h12Z" />
                  </svg>
                  {weather.wind.speed} m/s
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium opacity-80">Visibility</p>
                <p className="flex items-center font-semibold">
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM5 12a7 7 0 1 0 14 0 7 7 0 0 0-14 0ZM1 12a11 11 0 1 1 22 0 11 11 0 0 1-22 0Z" />
                  </svg>
                  {weather.visibility / 1000} km
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="font-medium opacity-80">Temp</p>
                <p className="flex items-center font-semibold">
                  {weather.main.temp}°C
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium opacity-80">Humidity</p>
                <p className="flex items-center font-semibold">
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2a7 7 0 0 1 7 7c0 3.867-2.815 7-7 7-3.147 0-5.803-2.159-6.74-5.018A2.004 2.004 0 0 1 12 2Z" />
                  </svg>
                  {weather.main.humidity}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cities with High AQI */}
      <div className="mt-4 p-6 bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400 text-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Cities with High AQI</h2>
        <ul>
          {citiesAqiList.map((cityData, index) => (
            <li
              key={index}
              className="flex justify-between p-3 border-b last:border-b-0"
            >
              <span className="font-medium">{cityData.city}</span>
              <span className="font-semibold text-black-600">{cityData.aqi}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AQIReport;
