import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff, Copy, CheckCircle, AlertTriangle, User, CreditCard, Building, RefreshCw } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const SellerBankInfo = ({ user, onEdit, initialSeller = null, headers: propHeaders = {} }) => {
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [seller, setSeller] = useState(initialSeller);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get headers from props or localStorage
  const headers = Object.keys(propHeaders).length > 0 ? propHeaders : {
    id: localStorage.getItem('id'),
    authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  console.group('🏦 Bank Info Component Debug');
  console.log('Component mounted with:');
  console.log('- user prop:', user);
  console.log('- initialSeller prop:', initialSeller);
  console.log('- headers:', headers);
  console.groupEnd();

  // ✅ Enhanced data extraction with debugging
  const extractSellerData = (apiResponse) => {
    console.group('🔍 Bank Data Extraction Debug');
    console.log('Full API Response:', apiResponse);
    console.log('Response structure:', JSON.stringify(apiResponse, null, 2));

    try {
      let sellerData = null;

      // Pattern 1: data.data (most common)
      if (apiResponse?.data?.data) {
        console.log('✅ Found data at: apiResponse.data.data');
        sellerData = apiResponse.data.data;
      }
      // Pattern 2: Direct data property
      else if (apiResponse?.data && (apiResponse.data.bankAccountNumber || apiResponse.data.email)) {
        console.log('✅ Found data at: apiResponse.data');
        sellerData = apiResponse.data;
      }
      // Pattern 3: Root level
      else if (apiResponse?.bankAccountNumber || apiResponse?.email) {
        console.log('✅ Found data at: apiResponse (root)');
        sellerData = apiResponse;
      }

      console.log('Extracted sellerData:', sellerData);
      
      if (!sellerData) {
        console.error('❌ No seller data found in any expected location');
        console.groupEnd();
        return null;
      }

      console.log('✅ Successfully extracted bank data:', {
        hasBankAccount: !!sellerData.bankAccountNumber,
        hasIFSC: !!sellerData.bankIFSC,
        hasHolderName: !!sellerData.bankHolderName,
        status: sellerData.status
      });
      console.groupEnd();

      return sellerData;
    } catch (err) {
      console.error('❌ Error extracting bank data:', err);
      console.groupEnd();
      return null;
    }
  };

  // Fetch seller data from API
  useEffect(() => {
    const fetchSeller = async () => {
      console.log('🚀 Starting fetchSeller for bank info...');
      console.log('Should fetch:', !initialSeller);
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('📡 Fetching seller bank information...');
        console.log('Request URL: ' + `${API_URL}/seller/get-seller-info`);
        console.log('Request headers:', headers);
        
        const res = await axios.get(`${API_URL}/seller/get-seller-info`, { headers });
        
        console.log('📥 Bank API Response received:', res.status);
        console.log('Raw response data:', res.data);
        
        // Extract seller data with proper error handling
        const sellerData = extractSellerData(res.data);
        
        if (!sellerData) {
          throw new Error('Failed to extract bank data from API response');
        }

        setSeller(sellerData);
        console.log('✅ Bank data set successfully');
        
      } catch (err) {
        console.error('❌ Error in fetchSeller:', err);
        
        if (err.response) {
          const status = err.response.status;
          console.error('HTTP Error Status:', status);
          console.error('Error Response:', err.response.data);

          if (status === 401 || status === 403) {
            setError('Session expired. Please log in again.');
          } else if (status === 404) {
            setError('Bank information not found. You may need to update your seller profile.');
          } else if (status === 500) {
            setError('Server error. Please try again later.');
          } else {
            setError(err.response.data?.message || 'Failed to fetch bank data');
          }
        } else if (err.request) {
          console.error('❌ No response from server');
          setError('Cannot connect to server. Please check your connection.');
        } else {
          console.error('❌ Error:', err.message);
          setError(err.message || 'Failed to fetch bank data');
        }
      } finally {
        setLoading(false);
        console.log('✅ fetchSeller completed');
      }
    };
    
    // Only fetch if we don't have initial seller data
    if (!initialSeller) {
      fetchSeller();
    } else {
      console.log('ℹ️ Using initialSeller prop, skipping fetch');
      setSeller(initialSeller);
    }
  }, [initialSeller]);

  // Handle copying to clipboard
  const handleCopy = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      console.log(`✅ Copied ${fieldName} to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('❌ Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  // Retry fetching seller data
  const retryFetch = async () => {
    console.log('🔄 Retrying fetch...');
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get(`${API_URL}/seller/get-seller-info`, { headers });
      console.log('📥 Seller data refetched:', res.status);
      
      const sellerData = extractSellerData(res.data);
      
      if (!sellerData) {
        throw new Error('Failed to extract bank data from API response');
      }

      setSeller(sellerData);
      console.log('✅ Bank data refetched successfully');
      
    } catch (err) {
      console.error('❌ Error refetching:', err);
      
      if (err.response) {
        setError(err.response.data?.message || 'Failed to fetch bank data');
      } else if (err.request) {
        setError('Cannot connect to server. Please check your connection.');
      } else {
        setError(err.message || 'Failed to fetch bank data');
      }
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
    console.group('✅ Validating Bank Details');
    const issues = [];
    
    if (!seller?.bankHolderName) {
      console.warn('⚠️ Missing: Account holder name');
      issues.push('Account holder name is missing');
    }
    if (!seller?.bankAccountNumber) {
      console.warn('⚠️ Missing: Bank account number');
      issues.push('Bank account number is missing');
    }
    if (!seller?.bankIFSC) {
      console.warn('⚠️ Missing: IFSC code');
      issues.push('IFSC code is missing');
    }
    
    // Validate IFSC format (should be 11 characters: 4 letters + 0 + 6 alphanumeric)
    if (seller?.bankIFSC && !/^[A-Z]{4}[0][A-Z0-9]{6}$/.test(seller.bankIFSC)) {
      console.warn('⚠️ Invalid: IFSC code format');
      issues.push('IFSC code format is invalid');
    }
    
    console.log('Validation issues:', issues);
    console.groupEnd();
    return issues;
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-zinc-900 shadow-xl rounded-2xl p-6 text-white">
        <div className="flex flex-col items-center justify-center py-12">
          <RefreshCw className="w-12 h-12 text-yellow-400 animate-spin mb-4" />
          <p className="text-zinc-300">Loading bank information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 shadow-xl rounded-2xl p-6 text-white">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertTriangle className="w-16 h-16 text-red-400" />
          <div>
            <h3 className="text-xl font-semibold text-red-300 mb-2">Error Loading Bank Information</h3>
            <p className="text-red-200 mb-4">{error}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={retryFetch}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-6 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-500 transition"
              >
                Update Info
              </button>
            )}
          </div>
        </div>
        
        {/* Debug info in error state */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 p-4 bg-red-900/30 rounded-lg border border-red-500/30">
            <summary className="text-sm text-red-300 cursor-pointer">🔍 Debug Info</summary>
            <pre className="text-xs text-red-200 mt-2 overflow-auto">
              {JSON.stringify({ error, headers, hasUser: !!user }, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  }

  // No seller data
  if (!seller) {
    return (
      <div className="bg-yellow-900/20 border border-yellow-500/50 shadow-xl rounded-2xl p-6 text-white">
        <div className="flex flex-col items-center gap-4 text-center py-8">
          <AlertTriangle className="w-16 h-16 text-yellow-400" />
          <div>
            <h3 className="text-xl font-semibold text-yellow-300 mb-2">No Bank Information Found</h3>
            <p className="text-yellow-200 mb-4">
              Bank details are not available. Please update your seller profile.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={retryFetch}
              className="px-6 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-500 transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-6 py-2 bg-zinc-700 text-white font-semibold rounded-lg hover:bg-zinc-600 transition"
              >
                Add Bank Details
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ✅ Enhanced seller approval check with fallback
  // If user prop is undefined but seller data shows approved, trust the seller data
  const isApprovedSeller = seller?.status === "Approved" && (user?.isSeller !== false);
  
  console.group('🔐 Seller Approval Check');
  console.log('user prop:', user);
  console.log('user?.isSeller:', user?.isSeller);
  console.log('seller?.status:', seller?.status);
  console.log('isApprovedSeller:', isApprovedSeller);
  console.groupEnd();
  
  // Only block if user explicitly has isSeller = false
  if (user?.isSeller === false) {
    return (
      <div className="bg-blue-900/20 border border-blue-500/50 shadow-xl rounded-2xl p-6 text-white">
        <div className="flex flex-col items-center gap-4 text-center py-8">
          <User className="w-16 h-16 text-blue-400" />
          <div>
            <h3 className="text-xl font-semibold text-blue-300 mb-2">Not a Seller Account</h3>
            <p className="text-blue-200">You need to register as a seller to view bank information.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isApprovedSeller) {
    const statusColors = {
      Pending: { bg: 'yellow-900/20', border: 'yellow-500/50', text: 'yellow', icon: 'yellow-400' },
      Rejected: { bg: 'red-900/20', border: 'red-500/50', text: 'red', icon: 'red-400' },
      Under_Review: { bg: 'blue-900/20', border: 'blue-500/50', text: 'blue', icon: 'blue-400' }
    };
    
    const colors = statusColors[seller?.status] || statusColors.Rejected;
    
    return (
      <div className={`bg-${colors.bg} border border-${colors.border} shadow-xl rounded-2xl p-6 text-white`}>
        <div className="flex flex-col items-center gap-4 text-center py-8">
          <AlertTriangle className={`w-16 h-16 text-${colors.icon}`} />
          <div>
            <h3 className={`text-xl font-semibold text-${colors.text}-300 mb-2`}>
              Seller Status: {seller?.status || 'Unknown'}
            </h3>
            <p className={`text-${colors.text}-200`}>
              {seller?.status === 'Pending' && 'Your seller application is under review. Bank information will be available once approved.'}
              {seller?.status === 'Rejected' && 'Your seller application was rejected. Please contact support or re-apply.'}
              {seller?.status === 'Under_Review' && 'Your application is being reviewed by our team. Please wait for approval.'}
              {!seller?.status && 'You are not an approved seller yet. Bank information is only available for approved sellers.'}
            </p>
          </div>
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
        <div className="flex items-center gap-2">
          <button
            onClick={retryFetch}
            className="text-sm px-3 py-2 bg-zinc-700 text-white font-semibold rounded-lg hover:bg-zinc-600 transition-colors duration-200 flex items-center gap-2"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-sm px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors duration-200 flex items-center gap-2"
            >
              <span>Edit</span>
            </button>
          )}
        </div>
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
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="mt-3 text-sm px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
                >
                  Update Bank Details
                </button>
              )}
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

        {/* Branch Name (if available) */}
        {seller.branchName && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-zinc-400" />
              <h4 className="text-sm text-zinc-400 font-medium">Branch Name</h4>
            </div>
            <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-3">
              <p className="text-lg font-medium">{seller.branchName}</p>
            </div>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="mt-6 pt-4 border-t border-zinc-700">
        {seller.lastUpdated && (
          <p className="text-sm text-zinc-400">
            Last updated: {new Date(seller.lastUpdated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        )}
        
        {/* Security Note */}
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300 text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Security Note:</strong> Your bank details are encrypted and secure. 
              Never share your account credentials with anyone.
            </span>
          </p>
        </div>
      </div>

      {/* Debug Information - Only in development */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-6 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
          <summary className="text-sm text-zinc-400 cursor-pointer hover:text-white transition-colors">
            🔍 Debug: Raw Bank Data (Development Only)
          </summary>
          <pre className="text-xs text-zinc-300 mt-2 overflow-auto max-h-60 bg-zinc-900 p-3 rounded">
            {JSON.stringify({
              seller,
              user: { isSeller: user?.isSeller },
              validationIssues,
              hasIssues
            }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default SellerBankInfo;