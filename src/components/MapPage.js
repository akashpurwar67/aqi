import React, { useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { AQIContext } from '../context/AQIContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Function to determine the color based on AQI value
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

// Function to create a custom icon with the specified color
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color:${color};width:20px;height:20px;border-radius:50%;"></div>`,
  });
};

function AQIMap() {
  const { weatherData, aqiData } = useContext(AQIContext);

  if (!weatherData || !aqiData) {
    return <p className="text-center">Please fetch data from the home page first.</p>;
  }

  const position = [weatherData.coord.lat, weatherData.coord.lon];

  // Get the AQI value
  const aqiValue = aqiData?.aqi;

  // Get the color based on the AQI value
  const aqiColor = getAqiColor(aqiValue);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">AQI Map</h1>
      <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} icon={createCustomIcon(aqiColor)}>
          <Popup>
            <p><strong>Location:</strong> {weatherData.name}</p>
            <p><strong>AQI Level:</strong> {aqiValue}</p>
            
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default AQIMap;
