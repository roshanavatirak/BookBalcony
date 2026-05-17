// frontend/src/components/Profile/Favourites.jsx

import React, { useEffect, useState } from 'react';
import axios from "axios";
import BookCard from '../BookCard/BookCard';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const Favourites = () => {
  const [favouriteBooks, setFavouriteBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-favourite-books`, { headers });
        setFavouriteBooks(response.data.data || []);
      } catch (error) {
        console.error("Error fetching favourites:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, []);

  const handleRemoveBook = (bookId) => {
    const updatedList = favouriteBooks.filter(book => book._id !== bookId);
    setFavouriteBooks(updatedList);
  };

  return (
    <div className="md:bg-zinc-900/50 md:rounded-3xl min-h-screen px-1 sm:px-4 md:px-8 py-4 md:py-10 md:shadow-xl md:border md:border-zinc-700">
      <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-center text-yellow-400 mb-1 md:mb-2">
        Your Favourite Books
      </h1>
      <p className="text-center italic text-zinc-400 md:text-zinc-300 text-xs md:text-base mb-4 md:mb-8">
        Curated just for you — your personal collection ✨
      </p>

      {loading ? (
        <p className="text-center text-zinc-400 py-10">Loading favourites...</p>
      ) : favouriteBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 md:py-20">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl md:text-4xl">💔</span>
          </div>
          <p className="text-zinc-400 text-sm md:text-base font-medium">No books in your favourites yet.</p>
          <p className="text-zinc-500 text-xs mt-1">Start browsing and tap ❤️ to save books</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-6">
          {favouriteBooks.map((item) => (
            <BookCard
              key={item._id}
              data={item}
              favourite={true}
              onRemove={() => handleRemoveBook(item._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
