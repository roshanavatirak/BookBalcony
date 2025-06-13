import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from '../BookCard/BookCard';
import Loader from '../Loader/Loader';

function EditorsChoice() {
  const [Data, setData] = useState();

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get("http://localhost:3000/api/v1/get-editors-choice");
      setData(response.data.data);
    };
    fetch();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 py-12 px-4 sm:px-10 rounded-t-3xl rounded-b-3xl mt-16 shadow-inner">

      {/* Section Title */}
      <div className="text-center mb-10">
        <h4 className="text-3xl sm:text-4xl font-bold text-purple-100 mb-2">
          📖 Editor’s Choice
        </h4>
        <p className="text-sm text-purple-300 italic">Curated reads handpicked by our editors</p>
        <div className="w-24 h-1 mx-auto bg-purple-500 rounded-full animate-pulse mt-2"></div>
      </div>

      {/* Loader */}
      {!Data && (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      )}

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Data && Data.map((item, i) => (
          <div
            key={i}
            className="relative group transition-transform duration-500 hover:scale-105 border border-transparent hover:border-purple-500 rounded-2xl shadow-lg overflow-hidden bg-zinc-800 hover:bg-zinc-900"
          >
            {/* Badge */}
            <span className="absolute top-2 left-2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-20">
              Editor's Pick
            </span>

            {/* BookCard */}
            <BookCard data={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default EditorsChoice;
