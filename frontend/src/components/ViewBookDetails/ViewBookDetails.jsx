import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { useParams, Link } from 'react-router-dom';
import { GrLanguage } from "react-icons/gr";
import { motion } from 'framer-motion';
import BookCard from '../BookCard/BookCard';
import { FaRegHeart } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";
import {useSelector} from "react-redux";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { FaShoppingBag } from "react-icons/fa";
import { useFavourites } from '../../context/FavouriteContext';
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaCrown } from "react-icons/fa";

const ViewBookDetails = () => {
  const { id } = useParams();
  const [Data, setData] = useState();
  const [SimilarBooks, setSimilarBooks] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [sellerName, setSellerName] = useState("");

  const isLoggedIn = useSelector((state)=>state.auth.isLoggedIn);
  const role = useSelector((state)=>state.auth.role);
  const isPremium = useSelector((state)=>state.auth.isPremium); // Add this to your Redux store

  const { favouriteIds, addToFavourites, removeFromFavourites } = useFavourites();
  const isFavourite = favouriteIds.includes(id);
  const navigate = useNavigate();

  const canViewSeller = role === "admin" || isPremium === true;

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`http://localhost:3000/api/v1/get-book-by-id/${id}`);
      setData(res.data.data);

      // Fetch seller name
      if (res.data.data.seller) {
        try {
          const sellerRes = await axios.get(`http://localhost:3000/api/v1/get-user-info/${res.data.data.seller}`);
          setSellerName(sellerRes.data.username || sellerRes.data.email);
        } catch (err) {
          console.error("Error fetching seller info:", err);
          setSellerName("Unknown Seller");
        }
      }

      // Fetch similar books
      const simRes = await axios.get(`http://localhost:3000/api/v1/get-similar-books/${res.data.data.category}`);
      setSimilarBooks(simRes.data.data.filter(book => book._id !== id));
    };
    fetch();
  }, [id]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid:id,
  };

  const handleFavourite = async () => {
    if (isFavourite) {
      await removeFromFavourites(id);
    } else {
      await addToFavourites(id);
    }
  };

  const handleBuyNow = () => {
    navigate(`/checkout/${id}`, {
      state: {
        book: {
          id: Data._id,
          title: Data.title,
          price: Data.price,
          discount: Data.discount,
          image: Data.image,
        },
      },
    });
  };

  const handleBuyNowq = async () => {
    try {
      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Please refresh the page.");
        return;
      }

      const { data } = await axios.post(
        "http://localhost:3000/api/v1/payment/order",
        { amount: Data?.price }
      );

      const options = {
        key: "rzp_test_NBQpcL6r3o5ntb",
        amount: data.order.amount,
        currency: "INR",
        name: "BookBalcony",
        description: `Payment for ${Data?.title}`,
        order_id: data.order.id,

        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              "http://localhost:3000/api/v1/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: Data?.price,
                receipt: data.order.receipt,
              },
              {
                headers: {
                  id: localStorage.getItem("id"),
                  authorization: `Bearer ${localStorage.getItem("token")}`,
                  bookid: id,
                },
              }
            );

            await axios.post(
              "http://localhost:3000/api/v1/place-order",
              {
                order: [
                  {
                    book: id,
                    paymentStatus: "Success",
                    orderStatus: "Order Placed",
                  },
                ],
              },
              {
                headers: {
                  id: localStorage.getItem("id"),
                  authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            setPaymentDetails({
              title: Data?.title,
              price: Data?.price,
            });

            setShowSuccessPopup(true);

            setTimeout(() => {
              window.location.href = "/profile/orderHistory";
            }, 5000);
          } catch (err) {
            console.error("❌ Payment verified, but order placing failed:", err);
            alert("Payment succeeded, but order placement failed.");
          }
        },

        theme: {
          color: "#FFC107",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Payment initiation failed:", err);
      alert("❌ Payment failed to start.");
    }
  };

  const handleCart = async () => {
    const response = await axios.put(
      "http://localhost:3000/api/v1/add-to-cart",
      {},
      {headers}
    );
    alert(response.data.message);
  };

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
          <div className="mb-6">
            <Link to="/" className="text-sm text-yellow-400 hover:underline">&larr; Back to Home</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative bg-zinc-800 rounded-3xl shadow-lg p-1 flex items-center justify-center h-[60vh]"
            >
              <img
                src={Data?.url}
                alt="Book Cover"
                className="max-h-[50vh] w-auto object-contain rounded-2xl"
              />

              {isLoggedIn === true && role === "user" && (
                <div className="absolute top-4 right-4 flex flex-col gap-3">
                  <button
                    className="bg-zinc-900 text-yellow-400 hover:bg-yellow-400 hover:text-black shadow-md shadow-yellow-300/30 transition-all duration-300 rounded-full text-2xl p-3"
                    onClick={handleFavourite}
                  >
                    {isFavourite ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
              )}

              {isLoggedIn === true && role === "admin" && (
                <div className="absolute top-4 right-4 flex flex-col gap-3">
                  <button className="bg-zinc-900 text-yellow-400 hover:bg-yellow-400 hover:text-black shadow-md shadow-yellow-300/30 transition-all duration-300 rounded-full text-2xl p-3">
                    <FiEdit />
                  </button>
                  <button className="bg-zinc-900 text-yellow-400 hover:bg-yellow-400 hover:text-black shadow-md shadow-yellow-300/30 transition-all duration-300 rounded-full text-2xl p-3">
                    <MdDeleteOutline />
                  </button>
                </div>
              )}
            </motion.div>

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

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleBuyNow} className="px-6 py-3 bg-yellow-400 text-black rounded-full font-semibold hover:bg-yellow-300 transition duration-300 flex items-center gap-2 justify-center">
                  <FaShoppingBag className="text-lg" />
                  Buy Now
                </button>
                <button className="px-6 py-3 bg-zinc-800 text-yellow-400 border border-yellow-400 rounded-full font-semibold hover:bg-yellow-400 hover:text-black transition duration-300 flex items-center gap-2 justify-center" onClick={handleCart}>
                  <FaCartPlus className="text-lg" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Seller Information Section */}
          <div className="mt-12 bg-zinc-800 rounded-xl p-6 border border-zinc-700">
            <h3 className="text-xl font-semibold text-purple-100 mb-4">📦 Seller Information</h3>
            
            {canViewSeller ? (
              <div className="flex items-center gap-3">
                <div className="bg-yellow-400 text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                  {sellerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-zinc-100 font-semibold text-lg">{sellerName}</p>
                  <p className="text-zinc-400 text-sm">Verified Seller</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="filter blur-sm pointer-events-none select-none">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-400 text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                      S
                    </div>
                    <div>
                      <p className="text-zinc-100 font-semibold text-lg">Seller Name Hidden</p>
                      <p className="text-zinc-400 text-sm">Verified Seller</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 rounded-lg">
                  <FaCrown className="text-yellow-400 text-4xl mb-2" />
                  <p className="text-yellow-400 font-bold text-lg mb-2">Premium Feature</p>
                  <p className="text-zinc-300 text-sm mb-4">Upgrade to see seller details</p>
                  <button 
                    onClick={() => navigate('/premium')}
                    className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-600 transition duration-300 flex items-center gap-2"
                  >
                    <FaCrown />
                    Join Premium
                  </button>
                </div>
              </div>
            )}
          </div>

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

      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 max-w-md text-center shadow-lg">
            <h2 className="text-2xl font-bold text-green-600 mb-4">✅ Payment Successful!</h2>
            <p className="text-gray-700 mb-2">You've purchased <span className="font-semibold">{paymentDetails?.title}</span></p>
            <p className="text-lg text-yellow-600 font-bold mb-6">₹ {paymentDetails?.price} paid</p>
            <button
              className="bg-yellow-500 text-black font-bold px-6 py-2 rounded hover:bg-yellow-400 transition"
              onClick={() => (window.location.href = "/order-history")}
            >
              Go to Order History Now
            </button>
            <p className="text-sm text-gray-500 mt-4">Redirecting in 5 seconds...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewBookDetails;