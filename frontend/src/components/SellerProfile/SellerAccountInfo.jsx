import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Loader = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
  </div>
);

const SellerAccountInfo = () => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const headers = {
    id: localStorage.getItem('id'),
    authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await axios.get('http://localhost:3000/api/v1/seller/get-seller-info', { headers });
        console.log('Seller data fetched:', res.data);
        
        // Handle the nested data structure - your backend returns { success, data, message }
        const sellerData = res.data?.data || res.data;
        setSeller(sellerData);
        
      } catch (err) {
        console.error('Error fetching seller data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch seller data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSeller();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900">
        <div className="text-center">
          <Loader />
          <p className="text-white mt-4">Loading seller information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900">
        <div className="text-center p-8 bg-red-900/20 border border-red-500/30 rounded-xl max-w-md">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-300 mb-2">Error Loading Seller Data</h2>
          <p className="text-red-200 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No seller data
  if (!seller) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900">
        <div className="text-center p-8 bg-yellow-900/20 border border-yellow-500/30 rounded-xl max-w-md">
          <div className="text-yellow-400 text-5xl mb-4">📋</div>
          <h2 className="text-xl font-bold text-yellow-300 mb-2">No Seller Data Found</h2>
          <p className="text-yellow-200 mb-4">You might not be registered as a seller yet.</p>
          <button 
            onClick={() => window.location.href = '/profile/become-seller'} 
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
          >
            Apply to Become a Seller
          </button>
        </div>
      </div>
    );
  }

  // Helper function to safely get nested values
  const safeGet = (obj, path, defaultValue = 'Not provided') => {
    if (!obj) return defaultValue;
    
    try {
      return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined && current[key] !== null 
          ? current[key] 
          : null;
      }, obj) || defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // Format address safely
  const formatAddress = (address) => {
    if (!address || typeof address !== 'object') {
      return 'Address not provided';
    }

    // Handle different possible address formats
    const addressParts = [];
    
    // Primary address line
    if (address.street || address.addressLine1) {
      addressParts.push(address.street || address.addressLine1);
    }
    
    // Secondary address line
    if (address.village || address.addressLine2) {
      addressParts.push(address.village || address.addressLine2);
    }
    
    // City
    if (address.city) {
      addressParts.push(address.city);
    }
    
    // State and postal code
    const statePostal = [];
    if (address.state) statePostal.push(address.state);
    if (address.pincode || address.postalCode) {
      statePostal.push(address.pincode || address.postalCode);
    }
    if (statePostal.length > 0) {
      addressParts.push(statePostal.join(' - '));
    }
    
    // Country
    if (address.country) {
      addressParts.push(address.country);
    }

    return addressParts.length > 0 ? addressParts.join(', ') : 'Address not complete';
  };

  // Format bank account number (mask it for security)
  const formatBankAccount = (accountNumber) => {
    if (!accountNumber) return 'Not provided';
    if (accountNumber.length <= 4) return accountNumber;
    return `****-****-****-${accountNumber.slice(-4)}`;
  };

  return (
    
      <div className="max-w-4xl mx-auto bg-zinc-900 shadow-xl rounded-2xl p-6">
        <div className="flex justify-between items-center border-b border-zinc-700 pb-4 mb-6">
          <h2 className="text-2xl font-bold">Seller Account Information</h2>
          <button
            className="text-sm px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition-colors"
            onClick={() => alert("Edit functionality would be implemented here")}
          >
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-1">
            <h4 className="text-sm text-zinc-400 uppercase tracking-wide">Full Name</h4>
            <p className="text-lg font-medium">{safeGet(seller, 'fullName')}</p>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm text-zinc-400 uppercase tracking-wide">Email</h4>
            <p className="text-lg font-medium">{safeGet(seller, 'email')}</p>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm text-zinc-400 uppercase tracking-wide">Phone Number</h4>
            <p className="text-lg font-medium">{safeGet(seller, 'phone')}</p>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm text-zinc-400 uppercase tracking-wide">Seller Type</h4>
            <p className="text-lg font-medium capitalize">{safeGet(seller, 'sellerType')}</p>
          </div>

          {/* Business Information - Only show if exists */}
          {seller.businessName && (
            <div className="space-y-1">
              <h4 className="text-sm text-zinc-400 uppercase tracking-wide">Business Name</h4>
              <p className="text-lg font-medium">{seller.businessName}</p>
            </div>
          )}

          {seller.gstNumber && (
            <div className="space-y-1">
              <h4 className="text-sm text-zinc-400 uppercase tracking-wide">GST Number</h4>
              <p className="text-lg font-medium font-mono">{seller.gstNumber}</p>
            </div>
          )}

          {/* Status */}
          <div className="space-y-1">
            <h4 className="text-sm text-zinc-400 uppercase tracking-wide">Account Status</h4>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              seller.status === "Approved" ? "bg-green-100 text-green-800" : 
              seller.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
              "bg-red-100 text-red-800"
            }`}>
              {safeGet(seller, 'status')}
            </span>
          </div>

          {/* Application Date */}
          <div className="space-y-1">
            <h4 className="text-sm text-zinc-400 uppercase tracking-wide">Application Date</h4>
            <p className="text-lg font-medium">
              {seller.applicationSubmittedAt ? 
                new Date(seller.applicationSubmittedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 
                safeGet(seller, 'createdAt') ?
                new Date(seller.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) :
                'Not available'}
            </p>
          </div>

          {/* Address - Full Width */}
          <div className="md:col-span-2 space-y-2">
            <h4 className="text-sm text-zinc-400 uppercase tracking-wide">Pickup Address</h4>
            <div className="bg-zinc-800 p-4 rounded-lg">
              <p className="text-lg font-medium whitespace-pre-line">
                {formatAddress(seller.pickupAddress)}
              </p>
            </div>
          </div>

          {/* Bank Information */}
          <div className="space-y-1">
            <h4 className="text-sm text-zinc-400 uppercase tracking-wide">Account Holder Name</h4>
            <p className="text-lg font-medium">{safeGet(seller, 'bankHolderName')}</p>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm text-zinc-400 uppercase tracking-wide">Bank Account Number</h4>
            <p className="text-lg font-medium font-mono">
              {formatBankAccount(seller.bankAccountNumber)}
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm text-zinc-400 uppercase tracking-wide">IFSC Code</h4>
            <p className="text-lg font-medium font-mono">{safeGet(seller, 'bankIFSC')}</p>
          </div>

          {/* Registration Date */}
          {seller.createdAt && (
            <div className="space-y-1">
              <h4 className="text-sm text-zinc-400 uppercase tracking-wide">Registered On</h4>
              <p className="text-lg font-medium">
                {new Date(seller.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>

        {/* Debug Information - Only in development */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 p-4 bg-zinc-800 rounded-lg">
            <summary className="text-sm text-zinc-400 cursor-pointer hover:text-white transition-colors">
              🔍 Debug: Raw Seller Data (Development Only)
            </summary>
            <pre className="text-xs text-zinc-300 mt-2 overflow-auto max-h-60 bg-zinc-900 p-3 rounded border">
              {JSON.stringify(seller, null, 2)}
            </pre>
          </details>
        )}
      </div>
    
  );
};

export default SellerAccountInfo;