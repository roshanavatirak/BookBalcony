import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Step1_Address from "./Step1_Address";
import Step2_Summary from "./Step2_Summary";
import Step3_Payment from "./Step3_Payment";
import COD_Page from "./COD_Page"; // <-- Import COD Page
import axios from "axios";

export default function CheckoutLayout() {
  const { id } = useParams(); 
  const location = useLocation(); 
  const cartItems = location.state?.cartItems || null;

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [book, setBook] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null); // <--- NEW

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchBook() {
      if (cartItems && cartItems.length > 0) {
        setBook(cartItems);
      } else if (id) {
        try {
          const res = await axios.get(
            `http://localhost:3000/api/v1/get-book-by-id/${id}`
          );
          setBook(res.data.data);
        } catch (err) {
          console.error("Failed to fetch book:", err);
        }
      }
    }
    fetchBook();
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
    if (!book) return <p className="text-center">Loading checkout items...</p>;

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
    <div className="bg-zinc-900 min-h-screen py-10 px-4 text-white">
      <div className="bg-white text-black rounded-2xl shadow-lg max-w-3xl mx-auto p-6">
        {/* Step Progress Bar */}
        <div className="flex justify-between items-center mb-6">
          {steps.filter(Boolean).map((label, index) => {
            const current = index + 1;
            return (
              <div key={label} className="flex-1">
                <div className="flex items-center justify-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      current === step
                        ? "bg-yellow-400 text-black"
                        : current < step
                        ? "bg-zinc-800 text-white"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {current}
                  </div>
                </div>
                <p className="text-center text-xs mt-1">{label}</p>
                {current !== steps.length && (
                  <div
                    className={`h-1 w-full mx-auto ${
                      current < step ? "bg-yellow-400" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Component */}
        <div className="mt-4">{renderStepComponent()}</div>
      </div>
    </div>
  );
}
