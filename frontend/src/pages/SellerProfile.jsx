import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import SellerSidebar from '../components/SellerProfile/SellerSidebar';
import { useSelector } from 'react-redux';
import axios from 'axios';

const SellerProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  
  // Headers for API requests
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        if (isLoggedIn) {
          // Try to fetch seller-specific profile data first
          try {
            const sellerResponse = await axios.get(
              "http://localhost:3000/api/v1/seller/get-seller-info", // Fixed URL
              { headers }
            );
            console.log("Seller data fetched:", sellerResponse.data);
            setProfileData(sellerResponse.data);
          } catch (sellerError) {
            console.log("Seller API failed, trying user API:", sellerError.message);
            
            // If seller profile fails, try to get user profile
            try {
              const userResponse = await axios.get(
                "http://localhost:3000/api/v1/get-user-information",
                { headers }
              );
              console.log("User data fetched:", userResponse.data);
              setProfileData(userResponse.data);
            } catch (userError) {
              console.error("Both APIs failed:", userError);
              setError("Unable to fetch profile data. Please try again.");
            }
          }
        }
      } catch (error) {
        console.error("Error in fetchSellerProfile:", error);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchSellerProfile();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-zinc-900 px-2 md:px-12 py-8 min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading seller profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-zinc-900 px-2 md:px-12 py-8 min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Profile</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No profile data but no error (user might not be a seller)
  if (!profileData) {
    return (
      <div className="bg-zinc-900 px-2 md:px-12 py-8 min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">No Seller Profile</h2>
            <p className="text-yellow-300 mb-4">You don't have a seller profile yet.</p>
            <a 
              href="/profile/become-seller" 
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg transition-colors inline-block"
            >
              Become a Seller
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 px-2 md:px-12 flex flex-col lg:flex-row py-8 gap-4 text-white min-h-screen">
      {/* Seller Sidebar */}
      <div className="w-full lg:w-1/4 xl:w-1/5">
        <SellerSidebar data={profileData} />
      </div>
      
      {/* Main Content Area */}
      <div className="w-full lg:w-3/4 xl:w-4/5">
        <div className="bg-zinc-800 rounded-3xl p-6 min-h-full">
          <Outlet context={{ profileData, setProfileData }} />
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;