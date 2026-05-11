// src/context/FavouriteContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const FavouriteContext = createContext();

export const useFavourites = () => useContext(FavouriteContext);

export const FavouriteProvider = ({ children }) => {
  const [favouriteIds, setFavouriteIds] = useState([]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchFavourites = async () => {
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
    try {
      await axios.put(
        `${API_URL}/add-book-to-favourite`,
        {},
        {
          headers: { ...headers, bookid: bookId },
        }
      );
      setFavouriteIds(prev => [...prev, bookId]);
    } catch (err) {
      alert("Error adding to favourites");
      console.error(err);
    }
  };

  const removeFromFavourites = async (bookId) => {
    try {
      await axios.put(
        `${API_URL}/remove-book-from-favourite`,
        {},
        {
          headers: { ...headers, bookid: bookId },
        }
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
