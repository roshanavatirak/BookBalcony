import React from 'react';
import {
  FaBook,
  FaGraduationCap,
  FaUniversity,
  FaLaptopCode,
} from 'react-icons/fa';

function Hero() {
  return (
    <div className="min-h-[85vh] w-full bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 sm:px-8 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-10 py-10 rounded-4xl relative">

      {/* Text Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center text-center lg:text-left space-y-6 z-20">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-yellow-100 leading-tight">
          Empower Your Semester with the Right Books
        </h1>
        <p className="text-md md:text-lg lg:text-xl text-zinc-300">
          Explore a wide selection of engineering textbooks, academic references, and timeless reads — all in one place.
        </p>
        <button className="mt-4 text-yellow-100 text-lg font-semibold border border-yellow-100 px-6 py-3 rounded-full hover:bg-yellow-100 hover:text-black transition duration-500">
          Explore Collection
        </button>
      </div>

      {/* Image + Icons Section */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center z-10">
        <img
          src="./Hero.png"
          alt="hero"
          className="w-[90%] sm:w-[100%] md:w-[110%] max-w-[500px] object-contain drop-shadow-xl"
        />

        {/* Floating Icons with adjusted positions and slow bounce */}
        <div className="absolute top-1 left-1 text-yellow-400 text-2xl bg-white/10 p-3 rounded-full shadow-lg backdrop-blur-sm animate-slow-bounce transition-transform duration-500 hover:scale-110">
          <FaBook />
        </div>
        <div className="absolute bottom-12 right-8 text-blue-400 text-3xl bg-white/10 p-3 rounded-full shadow-lg backdrop-blur-sm animate-slow-bounce transition-transform duration-500 hover:scale-110">
          <FaGraduationCap />
        </div>
        <div className="absolute top-3/6 -translate-x-1/2 left-10 text-green-400 text-3xl bg-white/10 p-3 rounded-full shadow-lg backdrop-blur-sm animate-slow-bounce transition-transform duration-500 hover:scale-110">
          <FaUniversity />
        </div>
        <div className="absolute top-6 left-8/9 text-purple-400 text-3xl bg-white/10 p-3 rounded-full shadow-lg backdrop-blur-sm animate-slow-bounce transition-transform duration-500 hover:scale-110">
          <FaLaptopCode />
        </div>
      </div>

      {/* Add slow bounce animation in your global CSS or Tailwind config */}
      <style jsx>{`
        @keyframes slowBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-slow-bounce {
          animation: slowBounce 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Hero;
