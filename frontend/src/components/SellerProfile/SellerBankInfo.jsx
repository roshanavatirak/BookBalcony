import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff, Copy, CheckCircle, AlertTriangle, User, CreditCard, Building } from "lucide-react";

const SellerBankInfo = ({ user, onEdit, initialSeller = null, headers = {} }) => {
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [seller, setSeller] = useState(initialSeller);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch seller data from API
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
    
    // Only fetch if we don't have initial seller data and user exists
    if (!initialSeller && user) {
      fetchSeller();
    } else if (initialSeller) {
      setSeller(initialSeller);
    }
  }, [initialSeller, user, headers]);

  // Handle copying to clipboard
  const handleCopy = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Retry fetching seller data
  const retryFetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get('http://localhost:3000/api/v1/seller/get-seller-info', { headers });
      console.log('Seller data refetched:', res.data);
      
      const sellerData = res.data?.data || res.data;
      setSeller(sellerData);
      
    } catch (err) {
      console.error('Error refetching seller data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch seller data');
    } finally {
      setLoading(false);
    }
  };

  // Mask account number for security
  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return 'Not provided';
    const str = accountNumber.toString();
    if (str.length <= 4) return str;
    return str.slice(0, 2) + '*'.repeat(str.length - 4) + str.slice(-2);
  };

  // Validate bank details
  const validateBankDetails = (seller) => {
    const issues = [];
    if (!seller?.bankHolderName) issues.push('Account holder name is missing');
    if (!seller?.bankAccountNumber) issues.push('Bank account number is missing');
    if (!seller?.bankIFSC) issues.push('IFSC code is missing');
    
    // Validate IFSC format (should be 11 characters: 4 letters + 7 digits/letters)
    if (seller?.bankIFSC && !/^[A-Z]{4}[0][A-Z0-9]{6}$/.test(seller.bankIFSC)) {
      issues.push('IFSC code format is invalid');
    }
    
    return issues;
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-zinc-900 shadow-xl rounded-2xl p-6 text-white">
        <div className="animate-pulse">
          <div className="flex justify-between items-center border-b border-zinc-700 pb-4 mb-6">
            <div className="h-6 bg-zinc-700 rounded w-32"></div>
            <div className="h-8 bg-zinc-700 rounded w-16"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-4 bg-zinc-700 rounded w-24 mb-2"></div>
                <div className="h-6 bg-zinc-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 shadow-xl rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 text-red-300">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Error Loading Bank Information</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="mt-4 text-sm px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition"
          >
            Try Again
          </button>
        )}
        <button
          onClick={retryFetch}
          className="mt-4 ml-2 text-sm px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // No seller data
  if (!seller) {
    return (
      <div className="text-center text-yellow-300 font-semibold bg-zinc-800 rounded-xl p-6">
        <div className="flex flex-col items-center gap-3">
          <AlertTriangle className="w-8 h-8" />
          <p>Fetching seller data...</p>
        </div>
      </div>
    );
  }

  // Check seller approval status
  const isApprovedSeller = user?.isSeller && seller?.status === "Approved";
  
  if (!user?.isSeller) {
    return (
      <div className="bg-blue-900/20 border border-blue-500/50 shadow-xl rounded-2xl p-6 text-white">
        <div className="text-center">
          <User className="w-12 h-12 mx-auto text-blue-400 mb-3" />
          <h3 className="text-lg font-semibold text-blue-300 mb-2">Not a Seller Account</h3>
          <p className="text-blue-200">You need to register as a seller to view bank information.</p>
        </div>
      </div>
    );
  }

  if (!isApprovedSeller) {
    const statusColors = {
      Pending: 'yellow',
      Rejected: 'red',
      Under_Review: 'blue'
    };
    
    const color = statusColors[seller?.status] || 'red';
    
    return (
      <div className={`bg-${color}-900/20 border border-${color}-500/50 shadow-xl rounded-2xl p-6 text-white`}>
        <div className="text-center">
          <AlertTriangle className={`w-12 h-12 mx-auto text-${color}-400 mb-3`} />
          <h3 className={`text-lg font-semibold text-${color}-300 mb-2`}>
            Seller Status: {seller?.status || 'Unknown'}
          </h3>
          <p className={`text-${color}-200`}>
            {seller?.status === 'Pending' && 'Your seller application is under review.'}
            {seller?.status === 'Rejected' && 'Your seller application was rejected. Please contact support.'}
            {seller?.status === 'Under_Review' && 'Your application is being reviewed by our team.'}
            {!seller?.status && 'You are not an approved seller yet.'}
          </p>
        </div>
      </div>
    );
  }

  // Validate bank details
  const validationIssues = validateBankDetails(seller);
  const hasIssues = validationIssues.length > 0;

  return (
    <div className="bg-zinc-900 shadow-xl rounded-2xl p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-700 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <Building className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-bold">Bank Information</h2>
          {!hasIssues && (
            <CheckCircle className="w-5 h-5 text-green-400" />
          )}
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors duration-200 flex items-center gap-2"
          >
            <span>Edit</span>
          </button>
        )}
        <button
          onClick={retryFetch}
          className="text-sm px-3 py-2 bg-zinc-700 text-white font-semibold rounded-lg hover:bg-zinc-600 transition-colors duration-200"
          title="Refresh data"
        >
          🔄
        </button>
      </div>

      {/* Validation Issues */}
      {hasIssues && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-300 font-semibold mb-2">Bank Information Issues</h4>
              <ul className="text-red-200 text-sm space-y-1">
                {validationIssues.map((issue, index) => (
                  <li key={index}>• {issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Bank Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Holder Name */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-zinc-400" />
            <h4 className="text-sm text-zinc-400 font-medium">Account Holder Name</h4>
          </div>
          <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-3">
            <p className="text-lg font-medium">
              {seller.bankHolderName || (
                <span className="text-red-400 italic">Not provided</span>
              )}
            </p>
            {seller.bankHolderName && (
              <button
                onClick={() => handleCopy(seller.bankHolderName, 'holderName')}
                className="text-zinc-400 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {copiedField === 'holderName' ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Bank Account Number */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-zinc-400" />
            <h4 className="text-sm text-zinc-400 font-medium">Bank Account Number</h4>
          </div>
          <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-3">
            <p className="text-lg font-medium font-mono">
              {seller.bankAccountNumber ? (
                showAccountNumber ? seller.bankAccountNumber : maskAccountNumber(seller.bankAccountNumber)
              ) : (
                <span className="text-red-400 italic">Not provided</span>
              )}
            </p>
            <div className="flex items-center gap-2">
              {seller.bankAccountNumber && (
                <>
                  <button
                    onClick={() => setShowAccountNumber(!showAccountNumber)}
                    className="text-zinc-400 hover:text-white transition-colors"
                    title={showAccountNumber ? "Hide account number" : "Show account number"}
                  >
                    {showAccountNumber ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleCopy(seller.bankAccountNumber, 'accountNumber')}
                    className="text-zinc-400 hover:text-white transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedField === 'accountNumber' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* IFSC Code */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-zinc-400" />
            <h4 className="text-sm text-zinc-400 font-medium">IFSC Code</h4>
          </div>
          <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-3">
            <p className="text-lg font-medium font-mono">
              {seller.bankIFSC || (
                <span className="text-red-400 italic">Not provided</span>
              )}
            </p>
            {seller.bankIFSC && (
              <button
                onClick={() => handleCopy(seller.bankIFSC, 'ifsc')}
                className="text-zinc-400 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {copiedField === 'ifsc' ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Bank Name (if available) */}
        {seller.bankName && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-zinc-400" />
              <h4 className="text-sm text-zinc-400 font-medium">Bank Name</h4>
            </div>
            <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-3">
              <p className="text-lg font-medium">{seller.bankName}</p>
              <button
                onClick={() => handleCopy(seller.bankName, 'bankName')}
                className="text-zinc-400 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {copiedField === 'bankName' ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Additional Information */}
      {seller.lastUpdated && (
        <div className="mt-6 pt-4 border-t border-zinc-700">
          <p className="text-sm text-zinc-400">
            Last updated: {new Date(seller.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default SellerBankInfo;