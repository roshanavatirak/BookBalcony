// frontend/src/components/Profile/Favourites.jsx

import React, { useEffect, useState } from 'react';
import axios from "axios";
import BookCard from '../BookCard/BookCard';

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
        const response = await axios.get("http://localhost:3000/api/v1/get-favourite-books", { headers });
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
    <div className="bg-zinc-900/50 rounded-3xl min-h-screen px-8 py-10 shadow-xl border border-zinc-700">
    <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-yellow-400 mb-2">
  Your Favourite Books
</h1>
<p className="text-center italic text-zinc-300 text-sm sm:text-base mb-8">
  Curated just for you — your personal collection of literary treasures ✨
</p>

      {loading ? (
        <p className="text-center text-zinc-400">Loading favourites...</p>
      ) : favouriteBooks.length === 0 ? (
        <p className="text-center text-zinc-500">No books in your favourites yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
