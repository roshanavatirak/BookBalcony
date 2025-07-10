// frontend/src/components/BookCard/BookCard.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useFavourites } from '../../context/FavouriteContext';

function BookCard({ data, onRemove }) {
  const location = useLocation();
  const { favouriteIds, addToFavourites, removeFromFavourites } = useFavourites();

  const isFavouriteBook = favouriteIds.includes(data._id);

  const handleAddToFavourites = async (e) => {
    e.preventDefault();
    await addToFavourites(data._id);
  };

  const handleRemoveFromFavourites = async (e) => {
    e.preventDefault();
    await removeFromFavourites(data._id);
    if (onRemove) onRemove(); // for Favourites page to dynamically remove
  };

  return (
    <Link to={`/view-book-details/${data._id}`} className="group relative">
      <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-4 shadow-lg hover:shadow-yellow-400 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
        
        {/* Book Image */}
        <div className="bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center h-[25vh] relative">
          <img
            src={data.url}
            alt={data.title}
            className="h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />

          {/* Heart Icon */}
          <button
            onClick={isFavouriteBook ? handleRemoveFromFavourites : handleAddToFavourites}
            className="absolute top-2 right-2 text-yellow-400 bg-black bg-opacity-50 hover:bg-opacity-80 p-2 rounded-full text-lg z-10"
          >
            {isFavouriteBook ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        {/* Title & Author */}
        <h2 className="mt-4 text-lg sm:text-xl text-white font-bold truncate">{data.title}</h2>
        <p className="mt-1 text-sm text-zinc-400 font-medium truncate">by {data.author}</p>
        <p className="mt-2 text-yellow-300 text-lg font-semibold">₹ {data.price}</p>

        {/* Remove button on Favourites page */}
        {location.pathname.toLowerCase().includes("/profile/favourites") && (
          <button
            onClick={handleRemoveFromFavourites}
            className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-xl transition duration-300"
          >
            Remove from Favourites
          </button>
        )}
      </div>
    </Link>
  );
}

export default BookCard;
