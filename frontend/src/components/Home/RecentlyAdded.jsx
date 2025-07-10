import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import BookCard from '../BookCard/BookCard';
import Loader from '../Loader/Loader';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function RecentlyAdded() {
  const [Data, setData] = useState();
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get("http://localhost:3000/api/v1/get-recent-books");
      setData(response.data.data.slice(0, 20));
    };
    fetch();
  }, []);

  useEffect(() => {
    const updateScrollVisibility = () => {
      const scroll = scrollRef.current;
      if (!scroll) return;
      setShowLeft(scroll.scrollLeft > 10);
      setShowRight(scroll.scrollLeft + scroll.clientWidth < scroll.scrollWidth - 10);
    };

    const scroll = scrollRef.current;
    if (scroll) {
      scroll.addEventListener("scroll", updateScrollVisibility);
      updateScrollVisibility();
    }

    return () => scroll?.removeEventListener("scroll", updateScrollVisibility);
  }, [Data]);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 py-10 px-4 sm:px-10 rounded-3xl mt-10 shadow-inner relative">
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

      {/* Book List */}
      {Data && (
        <div className="relative">
          {/* Left Arrow */}
          {showLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-yellow-400 text-black p-2 rounded-full shadow hover:bg-yellow-300 transition"
            >
              <FaChevronLeft />
            </button>
          )}

          {/* Scrollable Books */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 pl-6 pr-6  pt-6 scroll-smooth scrollbar-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {Data.map((item, i) => (
              <div key={i} className="min-w-[250px] sm:min-w-[280px] md:min-w-[300px] relative group">
                <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce-slow z-20">
                  New
                </span>
                <BookCard data={item} />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          {showRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-yellow-400 text-black p-2 rounded-full shadow hover:bg-yellow-300 transition"
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default RecentlyAdded;
