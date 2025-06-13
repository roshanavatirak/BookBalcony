import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Profile/Sidebar';
import { Outlet } from 'react-router-dom';
import axios from "axios";
import Loader from '../components/Loader/Loader';

const Profile = () => {
  const [userData, setUserData] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/get-user-information",
          { headers: {
            id: localStorage.getItem("id"),
            authorization: `Bearer ${localStorage.getItem("token")}`,
          }, 
        
        }
        );
        console.log("User info:", response.data); // Add this
        setUserData(response.data); // Save response data into state
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="bg-zinc-900 px-2 md:px-12 flex flex-col md:flex-row h-screen py-8 gap-4 text-white">
      {!userData ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row min-h-screen w-full">
  <div className="w-full md:w-1/4 xl:w-1/5">
    <Sidebar data={userData} />
  </div>
  <div className="w-full md:w-3/4 xl:w-4/5">
    <Outlet />
  </div>
</div>

        </>
      )}
    </div>
  );
};

export default Profile;
