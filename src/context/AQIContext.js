import React, { createContext, useState } from 'react';

export const AQIContext = createContext();

export const AQIProvider = ({ children }) => {
  const [aqiData, setAqiData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  return (
    <AQIContext.Provider value={{ aqiData, setAqiData, weatherData, setWeatherData }}>
      {children}
    </AQIContext.Provider>
  );
};
