const API_BASE_URL = 'http://localhost:5001/api'; // match your backend port

export async function getFoodItems() {
  try {
    const response = await fetch(`${API_BASE_URL}/food`);
    if (!response.ok) {
      throw new Error('Failed to fetch food items');
    }
    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    return [];
  }
}