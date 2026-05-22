import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader/Loader';
import BookCard from '../components/BookCard/BookCard';
import useFavouriteBookIds from '../hooks/useFavouriteBookIds';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const AllBooks = () => {
  const [Data, setData] = useState();
  const favouriteIds = useFavouriteBookIds(); // Custom hook to get favourite IDs

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-all-books`);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white px-2 sm:px-8 py-4 sm:py-10 flex justify-center">
      <div className="w-full max-w-7xl bg-zinc-900/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl px-3 sm:px-12 py-6 sm:py-10 shadow-2xl border border-zinc-800 sm:border-zinc-700">
        
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
            Explore All Books
          </h1>
          <p className="text-zinc-400 mt-2 sm:mt-4 text-[11px] sm:text-base italic max-w-xl mx-auto px-2">
            Browse our full collection of handpicked titles curated for every kind of reader.
          </p>
          <div className="mt-4 sm:mt-6 flex justify-center">
            <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
          </div>
        </div>

        {/* Loader */}
        {!Data ? (
          <div className="flex items-center justify-center my-12">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 mt-4 sm:mt-8">
            {Data.map((item, i) => (
              <BookCard
                key={i}
                data={item}
                favourite={favouriteIds.includes(item._id)} // ✅ Pass favourite prop
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBooks;
