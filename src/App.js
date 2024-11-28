import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { AQIProvider } from "./context/AQIContext";
import AQIReport from "./components/AQIReport";
import AQIMap from "./components/MapPage";
import HealthSuggestions from "./components/HealthSuggestions";
import AQIIndicator from "./components/AQIIndicator";
import Info from "./components/Info";

function App() {
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For the hamburger menu toggle

  useEffect(() => {
    // Simulate loading state for demo purposes
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <AQIProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
          {/* Navbar */}
          <nav className="bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400 text-white p-4 sm:p-6 font-bold">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center">
              <div className="text-3xl font-extrabold font-poppins text-white">
                AH Monitoring
              </div>

              {/* Hamburger Menu Icon */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden text-white focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Desktop Links */}
              <ul className="hidden sm:flex space-x-6">
                <li>
                  <NavLink
                    to="/"
                    className="hover:text-yellow-300 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-yellow-500/20 focus:ring-2 focus:ring-yellow-500"
                    activeClassName="text-yellow-300"
                  >
                    AQI Report
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/map"
                    className="hover:text-yellow-300 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-yellow-500/20 focus:ring-2 focus:ring-yellow-500"
                    activeClassName="text-yellow-300"
                  >
                    AQI Map
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/health"
                    className="hover:text-yellow-300 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-yellow-500/20 focus:ring-2 focus:ring-yellow-500"
                    activeClassName="text-yellow-300"
                  >
                    Health Suggestions
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/meter"
                    className="hover:text-yellow-300 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-yellow-500/20 focus:ring-2 focus:ring-yellow-500"
                    activeClassName="text-yellow-300"
                  >
                    AQI Indicator
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/info"
                    className="hover:text-yellow-300 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-yellow-500/20 focus:ring-2 focus:ring-yellow-500"
                    activeClassName="text-yellow-300"
                  >
                    AHM info
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>

          {/* Mobile Dropdown Menu */}
          <div
            className={`sm:hidden ${
              isMenuOpen ? "block" : "hidden"
            } bg-blue-600 text-white py-4`}
          >
            <ul className="space-y-4 text-center">
              <li>
                <NavLink
                  to="/"
                  className="block text-lg px-4 py-2 hover:text-yellow-300"
                  activeClassName="text-yellow-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  AQI Report
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/map"
                  className="block text-lg px-4 py-2 hover:text-yellow-300"
                  activeClassName="text-yellow-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  AQI Map
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/health"
                  className="block text-lg px-4 py-2 hover:text-yellow-300"
                  activeClassName="text-yellow-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Health Suggestions
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/meter"
                  className="block text-lg px-4 py-2 hover:text-yellow-300"
                  activeClassName="text-yellow-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  AQI Indicator
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/info"
                  className="block text-lg px-4 py-2 hover:text-yellow-300"
                  activeClassName="text-yellow-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  AHM Info
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<AQIReport />} />
              <Route path="/map" element={<AQIMap />} />
              <Route path="/health" element={<HealthSuggestions />} />
              <Route path="/meter" element={<AQIIndicator />} />
              <Route path="/info" element={<Info />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-gray-800 text-white py-4 mt-8">
            <div className="max-w-screen-lg mx-auto text-center">
              <p>
                &copy; {new Date().getFullYear()} AHM Website. All rights
                reserved.
              </p>
              <div className="mt-2">
                <NavLink
                  to="/privacy"
                  className="text-yellow-300 hover:underline"
                >
                  Privacy Policy
                </NavLink>{" "}
                |{" "}
                <NavLink
                  to="/terms"
                  className="text-yellow-300 hover:underline"
                >
                  Terms of Service
                </NavLink>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AQIProvider>
  );
}

export default App;
