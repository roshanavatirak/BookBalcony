import React from 'react';
import { Link } from 'react-router-dom';

function BookCard({ data }) {
  return (
    <Link to={`/view-book-details/${data._id}`} className="group">
      <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-4 shadow-lg hover:shadow-yellow-400 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
        
        <div className="bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center h-[25vh] relative">
          <img
            src={data.url}
            alt={data.title}
            className="h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <h2 className="mt-4 text-lg sm:text-xl text-white font-bold truncate">
          {data.title}
        </h2>
        <p className="mt-1 text-sm text-zinc-400 font-medium truncate">
          by {data.author}
        </p>
        <p className="mt-2 text-yellow-300 text-lg font-semibold">
          ₹ {data.price}
        </p>
      </div>
    </Link>
  );
}

export default BookCard;
