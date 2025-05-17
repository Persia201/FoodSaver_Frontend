import React, { useEffect, useState } from 'react';

const Browse = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/food/items`);
        const data = await response.json();

        if (response.ok) {
          setItems(data);
        } else {
          setError(data.message || 'Failed to fetch items');
        }
      } catch (err) {
        setError('Error connecting to server.');
      }
    };

    fetchItems();
  }, [apiUrl]);

  return (
    <div className="browse-container">
      <h2>Browse Items</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Browse;
