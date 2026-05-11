import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Profile/Sidebar';
import { Outlet } from 'react-router-dom';
import axios from "axios";
import Loader from '../components/Loader/Loader';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [sellerData, setSellerData] = useState(null);
  
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/get-user-information`,
          { headers }
        );
        console.log("User info:", response.data);
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    const fetchSeller = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/seller/get-seller-info`, // ✅ Fixed endpoint
          { headers }
        );
        console.log("Seller info:", response.data);
        setSellerData(response.data);
      } catch (err) {
        // This is expected if user is not a seller - don't log as error
        if (err.response?.status === 404) {
          console.log("User is not a seller (404 - normal behavior)");
          setSellerData(null);
        } else {
          console.error("Error fetching seller info:", err);
        }
      }
    };

    fetchUser();
    fetchSeller();
  }, []);

  return (
    <div className="bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 px-2 md:px-12 flex flex-col md:flex-row py-8 gap-4 text-white">
      {!userData ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row min-h-screen w-full gap-4">
          <div className="w-full md:w-1/4 xl:w-1/5">
            <Sidebar data={userData} seller={sellerData} />
          </div>
          <div className="w-full md:w-3/4 xl:w-4/5">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;