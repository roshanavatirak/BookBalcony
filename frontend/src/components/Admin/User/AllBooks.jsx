import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader/Loader';
import BookCard from '../components/BookCard/BookCard';
import useFavouriteBookIds from '../hooks/useFavouriteBookIds';

const AllBooks = () => {
  const [Data, setData] = useState();
  const favouriteIds = useFavouriteBookIds(); // Custom hook to get favourite IDs

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/get-all-books");
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 sm:px-8 py-10 flex justify-center">
      <div className="w-full max-w-7xl bg-zinc-900/50 rounded-3xl px-6 sm:px-12 py-10 shadow-xl border border-zinc-700">
        
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-md">
            Explore All Books
          </h1>
          <p className="text-zinc-400 mt-2 text-sm sm:text-base italic">
            Browse our full collection of handpicked titles curated for every kind of reader.
          </p>
          <hr className="mt-6 border-zinc-700 w-3/4 mx-auto rounded-full" />
        </div>

        {/* Loader */}
        {!Data ? (
          <div className="flex items-center justify-center my-8">
            <Loader />
          </div>
        ) : (
          <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
