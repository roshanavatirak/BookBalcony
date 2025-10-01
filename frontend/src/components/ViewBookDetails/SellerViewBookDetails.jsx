import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GrLanguage } from "react-icons/gr";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import Loader from '../Loader/Loader';

const SellerViewBookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/get-book-by-id/${id}`, { headers });
        setBook(res.data.data);

        // Optional: Get similar books
        const simRes = await axios.get(`http://localhost:3000/api/v1/get-similar-books/${res.data.data.category}`);
        setSimilarBooks(simRes.data.data.filter(b => b._id !== id));
      } catch (err) {
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/v1/delete-book/${id}`, { headers });
      alert("✅ Book deleted successfully.");
      navigate("/seller/myproducts");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("❌ Failed to delete book.");
    }
  };

  const handleEdit = () => {
    navigate(`/seller/edit-book/${id}`);
  };

  if (loading || !book) {
    return (
      <div className="h-screen bg-zinc-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 min-h-screen py-10 px-6 sm:px-12 md:px-20"
    >
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/seller/myproducts" className="text-sm text-yellow-400 hover:underline">&larr; Back to My Products</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Book Cover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative bg-zinc-800 rounded-3xl shadow-lg p-1 flex items-center justify-center h-[60vh]"
        >
          <img
            src={book.url}
            alt="Book Cover"
            className="max-h-[50vh] w-auto object-contain rounded-2xl"
          />

          {/* Admin Edit/Delete */}
          <div className="absolute top-4 right-4 flex flex-col gap-3">
            <button
              className="bg-zinc-900 text-yellow-400 hover:bg-yellow-400 hover:text-black shadow-md shadow-yellow-300/30 transition-all duration-300 rounded-full text-2xl p-3"
              onClick={handleEdit}
            >
              <FiEdit />
            </button>
            <button
              className="bg-zinc-900 text-yellow-400 hover:bg-yellow-400 hover:text-black shadow-md shadow-yellow-300/30 transition-all duration-300 rounded-full text-2xl p-3"
              onClick={handleDelete}
            >
              <MdDeleteOutline />
            </button>
          </div>
        </motion.div>

        {/* Book Info */}
        <div className="text-zinc-100">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-purple-100">{book.title}</h1>
          <p className="text-zinc-400 text-lg italic mb-4">by {book.author}</p>

          <div className="text-zinc-300 text-sm sm:text-base leading-relaxed bg-zinc-800 p-4 rounded-xl shadow-inner mb-6">
            {book.desc}
          </div>

          <div className="flex items-center text-zinc-300 text-sm mb-4">
            <GrLanguage className="me-2 text-lg" />
            <span>{book.language}</span>
          </div>

          <p className="text-2xl sm:text-3xl font-semibold text-yellow-400 mb-2">
            ₹ {book.price}
          </p>
          <p className="text-sm text-zinc-400 mb-6">Edition: {book.editionOrPublishYear}</p>
        </div>
      </div>

      {/* Similar Books (Optional) */}
      {similarBooks.length > 0 && (
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-purple-100 mb-4">📚 Similar Books</h3>
          <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-500">
            {similarBooks.map((book, index) => (
              <div key={index} className="min-w-[250px]">
                {/* You can use BookCard here if you have one */}
                <div className="bg-zinc-800 rounded-xl p-4 text-white shadow-md">
                  <img src={book.url} className="h-40 w-full object-contain mb-2" alt={book.title} />
                  <p className="text-lg font-semibold">{book.title}</p>
                  <p className="text-sm text-zinc-400">by {book.author}</p>
                  <p className="text-yellow-400 font-bold">₹{book.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SellerViewBookDetails;
