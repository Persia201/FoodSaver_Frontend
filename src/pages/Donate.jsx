import React, { useState } from 'react';

const Donate = () => {
  const [formData, setFormData] = useState({ name: '', quantity: '', expirationDate: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/food/donate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Donation successful!');
        setFormData({ name: '', quantity: '', expirationDate: '' });
      } else {
        setError(data.message || 'Donation failed');
      }
    } catch (err) {
      setError('Error connecting to server.');
    }
  };

  return (
    <div className="donate-container">
      <h2>Donate Food</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Food Name" onChange={handleChange} value={formData.name} required />
        <input type="number" name="quantity" placeholder="Quantity" onChange={handleChange} value={formData.quantity} required />
        <input type="date" name="expirationDate" onChange={handleChange} value={formData.expirationDate} required />
        <button type="submit">Donate</button>
      </form>
    </div>
  );
};

export default Donate;
