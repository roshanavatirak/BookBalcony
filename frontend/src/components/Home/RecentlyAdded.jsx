import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from '../BookCard/BookCard';
import Loader from '../Loader/Loader';

function RecentlyAdded() {
  const [Data, setData] = useState();

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get("http://localhost:3000/api/v1/get-recent-books");
      setData(response.data.data);
    };
    fetch();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 py-10 px-4 sm:px-10 rounded-3xl mt-10 shadow-inner">
      
      {/* Section Title */}
      <div className="text-center mb-10">
        <h4 className="text-3xl sm:text-4xl font-bold text-yellow-100 mb-2">
          📚 Latest Arrivals
        </h4>
        <p className="text-sm text-yellow-300 italic mb-2">
          Discover fresh picks just added to our collection
        </p>
        <div className="w-20 h-1 mx-auto bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
      </div>

      {/* Loader */}
      {!Data && (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      )}

      {/* Grid or Horizontal Scroll */}
      {Data && (
        <>
          {Data.length <= 4 ? (
            // Static Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Data.map((item, i) => (
                <div key={i} className="relative group">
                  <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce-slow z-20">
                    New
                  </span>
                  <BookCard data={item} />
                </div>
              ))}
            </div>
          ) : (
            // Horizontal Scroll
            <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-yellow-400">
              {Data.map((item, i) => (
                <div key={i} className="min-w-[250px] sm:min-w-[280px] md:min-w-[300px] relative group">
                  <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce-slow z-20">
                    New
                  </span>
                  <BookCard data={item} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RecentlyAdded;
