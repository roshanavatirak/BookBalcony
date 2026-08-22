import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Step1_Address from "./Step1_Address";
import Step2_Summary from "./Step2_Summary";
import Step3_Payment from "./Step3_Payment";
import COD_Page from "./COD_Page";
import axios from "axios";
import { extractIdFromSlug } from "../../utils/bookSlug";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

export default function CheckoutLayout() {
  const { id } = useParams(); 
  const location = useLocation(); 
  const navigate = useNavigate();
  const cartItems = location.state?.cartItems || null;

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [book, setBook] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔒 Authentication Guard: Redirect to login if user is not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");
    if (!token || !userId) {
      navigate("/account/login", { state: { from: location.pathname }, replace: true });
    }
  }, [navigate, location]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch single book or cart details directly from backend
  useEffect(() => {
    async function fetchCheckoutData() {
      setLoading(true);
      const isCartCheckout = id === "cart" || (id && id.includes("cart"));

      if (isCartCheckout) {
        if (cartItems && cartItems.length > 0) {
          setBook(cartItems);
          setLoading(false);
        } else {
          // Fetch active cart from backend for shareable URL / fresh load
          try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("id");

            if (token && userId) {
              const res = await axios.get(`${API_URL}/get-user-cart`, {
                headers: { id: userId, authorization: `Bearer ${token}` }
              });

              if (res.data && res.data.data) {
                setBook(res.data.data);
              }
            }
          } catch (err) {
            console.error("Failed to fetch user cart for checkout:", err);
          } finally {
            setLoading(false);
          }
        }
      } else if (id) {
        try {
          const bookId = extractIdFromSlug(id);
          const res = await axios.get(`${API_URL}/get-book-by-id/${bookId}`);
          setBook(res.data.data);
        } catch (err) {
          console.error("Failed to fetch book for checkout:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    fetchCheckoutData();
  }, [id, cartItems]);

  useEffect(() => {
    const savedAddress = JSON.parse(localStorage.getItem("userAddress"));
    if (savedAddress) {
      setAddress(savedAddress);
      setStep(2);
    }
  }, []);

  const goToStep = (num) => setStep(num);

  const renderStepComponent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
          <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-xs">Loading checkout details...</p>
        </div>
      );
    }

    if (!book || (Array.isArray(book) && book.length === 0)) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center text-zinc-400">
          <p className="text-sm font-semibold text-zinc-300 mb-2">Your cart is empty or checkout item not found.</p>
          <button
            onClick={() => navigate("/allbooks")}
            className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-lg text-xs hover:bg-yellow-500 transition-colors"
          >
            Explore All Books
          </button>
        </div>
      );
    }


    switch (step) {
      case 1:
        return (
          <Step1_Address
            onNext={(addr) => {
              setAddress(addr);
              setStep(2);
            }}
          />
        );
      case 2:
        return (
          <Step2_Summary
            address={address}
            book={book}
            isMultiple={Array.isArray(book)}
            onBack={() => goToStep(1)}
            onNext={(details) => {
              setOrderDetails(details);
              setStep(3);
            }}
          />
        );
      case 3:
        return (
          <Step3_Payment
            address={address}
            order={orderDetails}
            book={book}
            isMultiple={Array.isArray(book)}
            onBack={() => goToStep(2)}
            onCODSelected={() => {
              setPaymentMethod("cod");
              setStep(4);
            }}
          />
        );
      case 4:
        if (paymentMethod === "cod") {
          return (
            <COD_Page
              orderDetails={orderDetails}
            />
          );
        }
        return null;
      default:
        return null;
    }
  };

  const steps = ["Address", "Order Summary", "Payment", paymentMethod === "cod" ? "COD" : ""];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 text-white px-6 sm:px-10 py-6 sm:py-15 flex items-start justify-center">
      <div className="w-full max-w-xl bg-gradient-to-br from-gray-900/95 via-zinc-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl px-3 sm:px-6 py-4 sm:py-6 shadow-2xl border border-zinc-700">


        
        {/* Step Progress Bar - Compact */}
        <div className="flex justify-between items-center mb-3 sm:mb-4 px-2">
          {steps.filter(Boolean).map((label, index) => {
            const current = index + 1;
            const isCurrent = current === step;
            const isCompleted = current < step;

            return (
              <div key={label} className="flex-1 relative">
                <div className="flex items-center justify-center">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isCurrent
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-[0_0_12px_rgba(234,179,8,0.5)] scale-105"
                        : isCompleted
                        ? "bg-zinc-800 text-yellow-400 border border-yellow-400/40"
                        : "bg-zinc-800/80 text-zinc-500 border border-zinc-700/50"
                    }`}
                  >
                    {isCompleted ? "✓" : current}
                  </div>
                </div>
                <p className={`text-center text-[10px] sm:text-xs mt-1 font-semibold transition-colors ${
                  isCurrent ? "text-yellow-400" : isCompleted ? "text-zinc-300" : "text-zinc-500"
                }`}>
                  {label}
                </p>
                {current !== steps.filter(Boolean).length && (
                  <div
                    className={`h-0.5 absolute top-3.5 sm:top-4 left-[60%] right-[-40%] z-0 transition-colors ${
                      isCompleted ? "bg-yellow-400/70" : "bg-zinc-800"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Component */}
        <div className="mt-2">{renderStepComponent()}</div>
      </div>
    </div>
  );
}
