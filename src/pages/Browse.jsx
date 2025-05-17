import React, { useEffect, useState } from "react";
import "./Browse.css";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons in Vite/React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url),
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url),
});

function Browse() {
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimQuantity, setClaimQuantity] = useState({});

  const BASE_URL = import.meta.env.VITE_APP_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/api/food`)
      .then(res => res.json())
      .then(data => {
        const validItems = data.filter(item => new Date(item.expiryTime) > new Date());
        setFoodItems(validItems);
        setFilteredItems(validItems);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch food items');
        setLoading(false);
      });
  }, [BASE_URL]);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    const results = foodItems.filter(item =>
      item.title.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    );
    setFilteredItems(results);
  };

  const calculateTimeLeft = (expiryTime) => {
    const expiry = new Date(expiryTime);
    const now = new Date();
    const diff = expiry - now;
    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return `${hours}h ${minutes}m left`;
  };

  const handleClaim = async (itemId, availableUnits) => {
    const qty = parseInt(claimQuantity[itemId], 10);
    if (!qty || qty <= 0) return alert("Please enter a valid quantity.");
    if (qty > availableUnits) return alert("Cannot claim more than available quantity.");

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BASE_URL}/api/food/${itemId}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: qty }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error claiming item");

      alert("Claim successful!");
      // Update local state
      setFilteredItems(prev =>
        prev.map(item =>
          item._id === itemId
            ? { ...item, quantity: `${parseInt(item.quantity) - qty}` }
            : item
        ).filter(item => parseInt(item.quantity) > 0)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="browse-container">
      <motion.h2 className="browse-heading" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        Find Available Food Near You
      </motion.h2>

      <input
        className="search-input"
        type="text"
        placeholder="Search food by name or description..."
        value={search}
        onChange={handleSearch}
      />

      {filteredItems.length === 0 && <p>No food items found.</p>}

      {filteredItems.map(item => (
        <motion.div
          key={item._id}
          className="food-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="food-title">{item.title}</h3>
          <p className="food-description">{item.description}</p>
          <p className="food-donor">Donor: {item.donor?.name || 'Anonymous'}</p>
          <p className="food-units">Units: {item.quantity}</p>
          {item.expiryTime && (
            <p className="food-expiry">⏰ {calculateTimeLeft(item.expiryTime)}</p>
          )}

          {item.pickupLocation?.coordinates && (
            <div className="mini-map">
              <MapContainer
                center={[
                  item.pickupLocation.coordinates[1],
                  item.pickupLocation.coordinates[0]
                ]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "200px", width: "100%", borderRadius: "10px" }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[
                    item.pickupLocation.coordinates[1],
                    item.pickupLocation.coordinates[0]
                  ]}
                >
                  <Popup>Pickup Location</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          <div className="claim-controls">
            <input
              type="number"
              min="1"
              placeholder="Qty"
              value={claimQuantity[item._id] || ""}
              onChange={e => setClaimQuantity({ ...claimQuantity, [item._id]: e.target.value })}
              className="claim-input"
            />
            <button
              className="claim-button"
              onClick={() => handleClaim(item._id, parseInt(item.quantity))}
            >
              Claim
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default Browse;
