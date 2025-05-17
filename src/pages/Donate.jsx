// src/pages/Donate.jsx
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function Donate() {
  const [food, setFood] = useState({
    title: "",
    description: "",
    quantity: "",
    pickupLocation: "",
    expiryTime: "",
  });

  const [marker, setMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default: Delhi

  const handleChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to donate.");
        return;
      }

      const body = {
        title: food.title,
        description: food.description,
        quantity: food.quantity,
        pickupLocation: {
          type: "Point",
          coordinates: marker ? [marker[1], marker[0]] : [77.2090, 28.6139], // [lng, lat]
        },
        expiryTime: food.expiryTime,
      };

      const res = await fetch("http://localhost:5001/api/food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Submission failed");
      }

      const data = await res.json();
      alert("Donation submitted successfully!");
      console.log("Submitted donation:", data);

      // Reset form
      setFood({
        title: "",
        description: "",
        quantity: "",
        pickupLocation: "",
        expiryTime: "",
      });
      setMarker(null);
      setMapCenter([28.6139, 77.2090]); // Reset map center

    } catch (error) {
      alert(`❌ Submission failed: ${error.message}`);
      console.error(error);
    }
  };

  const handleSearchLocation = async () => {
    const query = food.pickupLocation;
    if (!query) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data && data[0]) {
      const { lat, lon } = data[0];
      const coords = [parseFloat(lat), parseFloat(lon)];
      setMapCenter(coords);
      setMarker(coords);
    }
  };

  const reverseGeocode = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data?.display_name) {
      setFood((prev) => ({ ...prev, pickupLocation: data.display_name }));
    }
  };

  // New: Use current location feature
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];
        setMarker(coords);
        setMapCenter(coords);

        // Reverse geocode to get address
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
          const res = await fetch(url);
          const data = await res.json();
          if (data?.display_name) {
            setFood((prev) => ({ ...prev, pickupLocation: data.display_name }));
          }
        } catch (err) {
          console.error("Failed to reverse geocode location", err);
        }
      },
      (error) => {
        alert("Unable to retrieve your location: " + error.message);
      }
    );
  };

  function LocationUpdater() {
    const map = useMap();
    map.setView(mapCenter, 13);
    return null;
  }

  function ClickToMark() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarker([lat, lng]);
        reverseGeocode(lat, lng);
      },
    });
    return null;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <img
        src="/backgrounds/donatepage.jpg"
        alt="Background"
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Dark overlay */}
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"></div>

      {/* Donation Form */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
        <motion.div
          className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl w-full max-w-3xl p-8"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
            Donate Surplus Food
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              type="text"
              name="title"
              placeholder="Food Title"
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              value={food.title}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              rows={3}
              value={food.description}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="quantity"
              placeholder="Quantity (e.g. 5 meals)"
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              value={food.quantity}
              onChange={handleChange}
              required
            />
            <div className="flex gap-2">
              <input
                type="text"
                name="pickupLocation"
                placeholder="Enter City/Area"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                value={food.pickupLocation}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={handleSearchLocation}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Search
              </button>
              <button
                type="button"
                onClick={useCurrentLocation}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
              >
                Use My Location
              </button>
            </div>

            <div className="h-64 rounded-md overflow-hidden border border-gray-300">
              <MapContainer center={mapCenter} zoom={13} scrollWheelZoom className="h-full w-full">
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationUpdater />
                <ClickToMark />
                {marker && <Marker position={marker} />}
              </MapContainer>
            </div>

            <input
              type="datetime-local"
              name="expiryTime"
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              value={food.expiryTime}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Submit Donation
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Donate;
