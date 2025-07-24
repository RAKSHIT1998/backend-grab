// src/services/martService.js
import axios from 'axios';
const BASE_URL = 'https://your-backend-url.com/api/mart';

export const fetchMartProducts = async () => {
  const { data } = await axios.get(`${BASE_URL}/products`);
  return data;
};

export const addToMartCart = async (productId, qty, token) => {
  const { data } = await axios.post(
    `${BASE_URL}/cart`,
    { productId, qty },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

export const placeMartOrder = async (cartItems, address, token) => {
  const { data } = await axios.post(
    `${BASE_URL}/order`,
    { cartItems, address },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

export const rateMartProduct = async (productId, stars, comment, token) => {
  const { data } = await axios.post(
    `${BASE_URL}/rate`,
    { productId, stars, comment },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};
