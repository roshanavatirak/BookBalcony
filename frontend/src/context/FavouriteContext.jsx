// src/context/FavouriteContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const FavouriteContext = createContext();

export const useFavourites = () => useContext(FavouriteContext);

export const FavouriteProvider = ({ children }) => {
  const [favouriteIds, setFavouriteIds] = useState([]);

  const getHeaders = (bookId = null) => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    if (!token || !id) return null;
    
    const headers = {
      id,
      authorization: `Bearer ${token}`,
    };
    if (bookId) headers.bookid = bookId;
    return headers;
  };

  const fetchFavourites = async () => {
    const headers = getHeaders();
    if (!headers) return; // Stop if not logged in
    
    try {
      const response = await axios.get(`${API_URL}/get-favourite-books`, {
        headers,
      });
      const ids = response.data.data.map(book => book._id);
      setFavouriteIds(ids);
    } catch (err) {
      console.error("Failed to fetch favourites", err);
    }
  };

  const addToFavourites = async (bookId) => {
    const headers = getHeaders(bookId);
    if (!headers) return alert("Please log in first");
    
    try {
      await axios.put(
        `${API_URL}/add-book-to-favourite`,
        {},
        { headers }
      );
      setFavouriteIds(prev => [...prev, bookId]);
    } catch (err) {
      alert("Error adding to favourites");
      console.error(err);
    }
  };

  const removeFromFavourites = async (bookId) => {
    const headers = getHeaders(bookId);
    if (!headers) return alert("Please log in first");
    
    try {
      await axios.put(
        `${API_URL}/remove-book-from-favourite`,
        {},
        { headers }
      );
      setFavouriteIds(prev => prev.filter(id => id !== bookId));
    } catch (err) {
      alert("Error removing from favourites");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  return (
    <FavouriteContext.Provider value={{ favouriteIds, addToFavourites, removeFromFavourites }}>
      {children}
    </FavouriteContext.Provider>
  );
};
