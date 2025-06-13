import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { useParams, Link } from 'react-router-dom';
import { GrLanguage } from "react-icons/gr";
import { motion } from 'framer-motion';
import BookCard from '../BookCard/BookCard';

const ViewBookDetails = () => {
  const { id } = useParams();
  const [Data, setData] = useState();
  const [SimilarBooks, setSimilarBooks] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`http://localhost:3000/api/v1/get-book-by-id/${id}`);
      setData(res.data.data);

      // Fetch similar books (optional: based on category/author)
      const simRes = await axios.get(`http://localhost:3000/api/v1/get-similar-books/${res.data.data.category}`);
      setSimilarBooks(simRes.data.data.filter(book => book._id !== id)); // exclude current
    };
    fetch();
  }, [id]);

  return (
    <>
      {!Data ? (
        <div className="h-screen bg-zinc-900 flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 min-h-screen py-10 px-4 sm:px-8 md:px-14 lg:px-20 xl:px-28"
        >
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/" className="text-sm text-yellow-400 hover:underline">&larr; Back to Home</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Book Cover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-zinc-800 rounded-3xl shadow-lg p-1 flex items-center justify-center h-[60vh]"
            >
              <img
                src={Data?.url}
                alt="Book Cover"
                className="max-h-[50vh] w-auto object-contain rounded-2xl"
              />
            </motion.div>

            {/* Book Info */}
            <div className="text-zinc-100">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-purple-100">{Data?.title}</h1>
              <p className="text-zinc-400 text-lg italic mb-4">by {Data?.author}</p>

              <div className="text-zinc-300 text-sm sm:text-base leading-relaxed bg-zinc-800 p-4 rounded-xl shadow-inner mb-6">
                {Data?.desc}
              </div>

              <div className="flex items-center text-zinc-300 text-sm mb-4">
                <GrLanguage className="me-2 text-lg" />
                <span>{Data?.language}</span>
              </div>

              <p className="text-2xl sm:text-3xl font-semibold text-yellow-400 mb-6">
                ₹ {Data?.price}
              </p>

              <button className="px-6 py-3 bg-yellow-400 text-black rounded-full font-semibold hover:bg-yellow-300 transition duration-300">
                Buy Now
              </button>
            </div>
          </div>

          {/* Similar Books */}
          {SimilarBooks.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-semibold text-purple-100 mb-4">📚 Similar Books You Might Like</h3>
              <div className="flex gap-6 overflow-x-auto pb-2 scroll-smooth scrollbar-thin scrollbar-thumb-purple-500">
                {SimilarBooks.map((book, i) => (
                  <motion.div
                    key={i}
                    className="min-w-[250px] sm:min-w-[280px] md:min-w-[300px] relative"
                    whileHover={{ scale: 1.05 }}
                  >
                    <BookCard data={book} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </>
  );
};

export default ViewBookDetails;
