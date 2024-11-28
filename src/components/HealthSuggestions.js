import React, { useState, useContext } from "react";
import { AQIContext } from "../context/AQIContext";

function HealthSuggestions() {
  const { aqiData } = useContext(AQIContext);
  const [healthCondition, setHealthCondition] = useState("");
  const [age, setAge] = useState("");
  const [outdoorActivity, setOutdoorActivity] = useState("");
  const [submitted, setSubmitted] = useState(false); // Track form submission
  const aqi = aqiData?.aqi;

  const getRecommendation = () => {
    if (!aqi) return "Enter a location and fetch AQI first!";

    if (aqi <= 50) return "Air quality is good. No precautions needed.";
    if (aqi <= 100) {
      if (healthCondition !== "none")
        return "Moderate air quality. Consider limiting outdoor exposure as you have respiratory issues.";
      else
        return "Moderate air quality. As you don't have any respiratory issues, it is safe for you.";
    }
    if (aqi <= 150) {
      if ((age === "Child" || age === "Elderly") && healthCondition !== "none")
        return "Considering your age and health condition, limit outdoor activities. Take precautions if you face any issues.";
      if ((age === "Child" || age === "Elderly") && healthCondition === "none")
        return "Although you don't have any health conditions, it is recommended to limit outdoor activities considering your age. Consult a doctor if discomfort arises.";
      return "Unhealthy, but considering your age group, it will only create problems with prolonged outdoor exposure.";
    }
    if (aqi <= 200) {
      if ((age === "Child" || age === "Elderly") && healthCondition !== "none")
        return "Considering your age and health condition, limit outdoor activities. Take precautions and avoid prolonged outdoor exposure.";
      if ((age === "Child" || age === "Elderly") && healthCondition === "none")
        return "Although you're not suffering from any disease, it is advised to limit outdoor activities due to your age.";
      return "It might not affect you much but still avoid prolonged outdoor exposure to stay safe.";
    }

    if (aqi <= 300) {
      if ((age === "Child" || age === "Elderly") && healthCondition !== "none")
        return "Extremely dangerous to go outside. The pollution level is severe and can badly affect your health.";
      if ((age === "Child" || age === "Elderly") && healthCondition === "none")
        return "As you're not suffering from any disease, it is advised to limit outdoor activities due to your age.";
      return "Avoid prolonged outdoor exposure to stay safe.";
    }
    return "Very unhealthy. Everyone should minimize outdoor activities, irrespective of age and active disease.";
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true); // Set submitted to true when the user submits the form
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
        AQI Health Recommender
      </h1>

      {/* User Details Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Details</h2>

          {/* Health Condition */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Health Condition
            </label>
            <select
              value={healthCondition}
              onChange={(e) => setHealthCondition(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select</option>
              <option value="none">None</option>
              <option value="Asthma">Asthma</option>
              <option value="Heart Disease">Heart Disease</option>
              <option value="Lung Disease">Lung Disease</option>
            </select>
          </div>

          {/* Age Group */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age Group
            </label>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select</option>
              <option value="Child">Child (Under 12)</option>
              <option value="Adult">Adult (13-64)</option>
              <option value="Elderly">Elderly (65+)</option>
            </select>
          </div>

          {/* Outdoor Activity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Outdoor Activity
            </label>
            <select
              value={outdoorActivity}
              onChange={(e) => setOutdoorActivity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select</option>
              <option value="Low">Low (e.g., walking)</option>
              <option value="Moderate">Moderate (e.g., commuting)</option>
              <option value="High">High (e.g., exercising)</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Recommendation */}
      {submitted && (
        <div className="mt-6 p-4 bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold">Recommendation</h2>
          <p className="mt-2 text-sm font-bold">Current AQI : {aqi}</p>
          <p className="mt-2 text-sm">{getRecommendation()}</p>
        </div>
      )}
    </div>
  );
}

export default HealthSuggestions;
