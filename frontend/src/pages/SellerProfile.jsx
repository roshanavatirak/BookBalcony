import React, { useEffect, useState } from 'react';
import SellerSidebar from '../components/SellerProfile/SellerSidebar';
import { Outlet } from 'react-router-dom';
import axios from "axios";
import Loader from '../components/Loader/Loader';

const SellerProfile = () => {
  const [sellerData, setSellerData] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/get-seller-info", // your seller API
          { headers }
        );
        console.log("Seller info:", response.data);
        setSellerData(response.data);
      } catch (err) {
        console.error("Error fetching seller profile:", err);
      }
    };

    fetchSeller();
  }, []);

  return (
    <div className="bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 px-2 md:px-12 flex flex-col md:flex-row py-8 gap-4 text-white">
      {!sellerData ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row min-h-screen w-full gap-4">
          <div className="w-full md:w-1/4 xl:w-1/5">
            <SellerSidebar data={sellerData} />
          </div>
          <div className="w-full md:w-3/4 xl:w-4/5">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProfile;
