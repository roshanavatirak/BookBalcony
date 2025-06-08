import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from '../BookCard/BookCard';
import Loader from '../Loader/Loader';

function TrendingBooks() {
  const [Data, setData] = useState();

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get("http://localhost:3000/api/v1/get-trending-books");
      setData(response.data.data);
    };
    fetch();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 py-10 px-4 sm:px-10 rounded-t-3xl rounded-b-3xl mt-14 shadow-inner">

      
      {/* Section Title */}
<div className="text-center mb-10">
  <h4 className="text-3xl sm:text-4xl font-bold text-yellow-100 mb-2">
    🔥Trending Books
  </h4>
  <p className="text-sm text-yellow-300 italic mb-2">Top Picks for Your Semester Success</p>
  <div className="w-24 h-1 mx-auto bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
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
                <div key={i} className="relative group transition-transform duration-500 hover:scale-102">
                  <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md z-20">
                    #Trending {i + 1}
                  </span>
                  <BookCard data={item} />
                </div>
              ))}
            </div>
          ) : (
            // Horizontal Scroll
            <div className="relative">
              {/* Scroll Hint (fade effect at right edge) */}
              <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-gray-900 via-transparent to-transparent pointer-events-none z-10 rounded-br-3xl" />

              <div className="flex gap-6 overflow-x-auto pb-4 pr-6 scroll-smooth scrollbar-thin scrollbar-thumb-yellow-400">
                {Data.map((item, i) => (
                  <div
                    key={i}
                    className="min-w-[250px] sm:min-w-[280px] md:min-w-[300px] relative group transition-transform duration-500 hover:scale-105"
                  >
                    <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md z-20">
                      #Trending {i + 1}
                    </span>
                    <BookCard data={item} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TrendingBooks;
