import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';

const SellerAccountInfo = () => {
  const [seller, setSeller] = useState(null);

  const headers = {
    id: localStorage.getItem('id'),
    authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/get-seller-info', { headers });
        setSeller(res.data);
      } catch (err) {
        console.error('Error fetching seller data:', err);
      }
    };
    fetchSeller();
  }, []);

  if (!seller) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto bg-zinc-900 shadow-xl rounded-2xl p-6">
        <div className="flex justify-between items-center border-b border-zinc-700 pb-4 mb-6">
          <h2 className="text-2xl font-bold">Account Info</h2>
          <button
            className="text-sm px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
            onClick={() => alert("Redirect to edit form or open modal")}
          >
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm text-zinc-400">Full Name</h4>
            <p className="text-lg font-medium">{seller.fullName}</p>
          </div>

          <div>
            <h4 className="text-sm text-zinc-400">Email</h4>
            <p className="text-lg font-medium">{seller.email}</p>
          </div>

          <div>
  <h4 className="text-sm text-zinc-400">Store Name</h4>
  <p className="text-lg font-medium">
    {seller.businessName && seller.gstNumber
      ? seller.businessName
      : "Individual"}
  </p>
</div>


          <div>
            <h4 className="text-sm text-zinc-400">Phone Number</h4>
            <p className="text-lg font-medium">{seller.phone}</p>
          </div>

       <div>
  <h4 className="text-sm text-zinc-400">Pickup Address</h4>
  <p className="text-lg font-medium whitespace-pre-line">
    {`${seller.pickupAddress.street}, ${seller.pickupAddress.village || ""}\n${seller.pickupAddress.city}, ${seller.pickupAddress.state} - ${seller.pickupAddress.pincode}\n${seller.pickupAddress.country}`}
  </p>
</div>


          <div>
            <h4 className="text-sm text-zinc-400">Status</h4>
            <p className={`text-lg font-medium ${seller.status === "Approved" ? "text-green-400" : "text-yellow-300"}`}>
              {seller.status}
            </p>
          </div>

          <div>
            <h4 className="text-sm text-zinc-400">Bank Account Number</h4>
            <p className="text-lg font-medium">{seller.bankAccountNumber}</p>
          </div>

          <div>
            <h4 className="text-sm text-zinc-400">IFSC Code</h4>
            <p className="text-lg font-medium">{seller.bankIFSC}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerAccountInfo;
