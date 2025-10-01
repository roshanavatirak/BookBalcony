import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyProducts = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchSellerBooks = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/seller/myproducts", { headers });
        setBooks(res.data?.books || []);
      } catch (err) {
        console.error("❌ Failed to fetch seller books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerBooks();
  }, []);

  if (loading) {
    return <div className="text-center text-white mt-10">Loading books...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">📚 My Books</h1>

      {books.length === 0 ? (
        <p className="text-zinc-400">You haven’t added any books yet.</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <Link
              key={book._id}
              to={`/seller/viewproduct/${book._id}`}
              className="group relative bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl p-4 shadow-xl hover:shadow-yellow-500 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
            >
              {/* Image */}
              <div className="relative h-52 w-full overflow-hidden rounded-xl flex justify-center items-center bg-zinc-900">
                <img
                  src={book.url || "https://via.placeholder.com/150"}
                  alt={book.title}
                  className="h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Title & Info */}
              <h2 className="mt-4 text-lg font-bold text-yellow-300 truncate">{book.title}</h2>
              <p className="text-sm text-zinc-400 truncate">by {book.author}</p>
              <p className="text-yellow-400 mt-1 text-md font-semibold">₹{book.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
