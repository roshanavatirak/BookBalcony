import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Alert from '../Alert/Alert';
import { useAlert } from '../Alert/useAlert';
import Loader from '../Loader/Loader';
import {
  FaEnvelope,
  FaBell,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaInfoCircle,
  FaCalendarAlt,
  FaUserCircle,
  FaShieldAlt,
  FaSync,
} from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const { alert, showAlert, hideAlert, success, error, warning, info } = useAlert();

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');

      if (!token || !id) {
        error('Please log in to view your subscriptions', 'Authentication Required');
        setLoading(false);
        return;
      }

      // Get user info to find email
      const userResponse = await axios.get(
        `${API_URL}/get-user-information`,
        {
          headers: {
            authorization: `Bearer ${token}`,
            id: id,
          },
        }
      );

      const email = userResponse.data?.data?.email || userResponse.data?.email;
      const username = userResponse.data?.data?.username || userResponse.data?.username || 'User';
      
      setUserEmail(email);
      setUserName(username);

      if (!email) {
        warning('Unable to find your email address', 'Email Not Found');
        setLoading(false);
        return;
      }

      console.log('🔍 MySubscriptions: Fetching subscriptions for email:', email);

      // Fetch all subscriptions for this email
      const response = await axios.get(
        `${API_URL}/services/my-subscriptions?email=${encodeURIComponent(email)}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
            id: id,
          },
        }
      );

      console.log('📋 MySubscriptions: Subscriptions response:', response.data);

      if (response.data.success) {
        const subs = response.data.data || [];
        console.log(`✅ MySubscriptions: Found ${subs.length} subscription(s)`);
        setSubscriptions(subs);
        
        // ✅ Update localStorage with subscription status
        const hasActiveSubscription = subs.some(sub => sub.status === 'active');
        localStorage.setItem('subscriptionStatus', hasActiveSubscription ? 'active' : 'inactive');
      }
    } catch (err) {
      console.error('MySubscriptions: Failed to fetch subscriptions:', err);
      if (err.response?.status === 404) {
        console.log('❌ MySubscriptions: 404 - No subscriptions found');
        setSubscriptions([]);
        localStorage.setItem('subscriptionStatus', 'inactive');
      } else if (err.response?.status === 403) {
        console.log('❌ MySubscriptions: 403 - Access forbidden');
        setSubscriptions([]);
        error('Access denied. Please log in again.', 'Forbidden');
      } else {
        error('Failed to load subscriptions. Please try again.', 'Error');
      }
    } finally {
      setLoading(false);
    }
  }, [error, warning]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // ✅ Helper function to trigger Footer update
  const triggerFooterUpdate = useCallback((status) => {
    // Dispatch custom event to notify Footer component
    const event = new CustomEvent('subscriptionUpdated', { 
      detail: { status, timestamp: Date.now() } 
    });
    window.dispatchEvent(event);
    console.log('📢 MySubscriptions: Triggered footer update event with status:', status);
  }, []);

  const handleUnsubscribe = async (subscriptionId, subscriptionEmail) => {
    if (!window.confirm('Are you sure you want to unsubscribe from this email list?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');

      const response = await axios.post(
        `${API_URL}/services/unsubscribe`,
        { email: subscriptionEmail },
        {
          headers: {
            authorization: `Bearer ${token}`,
            id: id,
          },
        }
      );

      if (response.data.success) {
        success('Successfully unsubscribed from this list', 'Unsubscribed');
        
        // ✅ Update localStorage
        localStorage.setItem('subscriptionStatus', 'inactive');
        
        // ✅ Trigger Footer refresh
        triggerFooterUpdate('inactive');
        
        // ✅ Refresh subscriptions from backend
        setTimeout(() => {
          fetchSubscriptions();
        }, 500);
      }
    } catch (err) {
      console.error('MySubscriptions: Unsubscribe failed:', err);
      error('Failed to unsubscribe. Please try again.', 'Error');
    }
  };

  const handleResubscribe = async (subscriptionId, subscriptionEmail) => {
    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');

      const response = await axios.post(
        `${API_URL}/services/resubscribe`,
        { email: subscriptionEmail },
        {
          headers: {
            authorization: `Bearer ${token}`,
            id: id,
          },
        }
      );

      if (response.data.success) {
        success('Successfully resubscribed to this list', 'Resubscribed');
        
        // ✅ Update localStorage
        localStorage.setItem('subscriptionStatus', 'active');
        
        // ✅ Trigger Footer refresh
        triggerFooterUpdate('active');
        
        // ✅ Refresh subscriptions from backend
        setTimeout(() => {
          fetchSubscriptions();
        }, 500);
      }
    } catch (err) {
      console.error('MySubscriptions: Resubscribe failed:', err);
      error('Failed to resubscribe. Please try again.', 'Error');
    }
  };

  // ✅ Listen for subscription updates from Footer
  useEffect(() => {
    const handleSubscriptionUpdate = (event) => {
      console.log('🔄 MySubscriptions: Subscription update event received', event.detail);
      // Refresh subscriptions when Footer makes changes
      setTimeout(() => {
        fetchSubscriptions();
      }, 500);
    };

    window.addEventListener('subscriptionUpdated', handleSubscriptionUpdate);

    return () => {
      window.removeEventListener('subscriptionUpdated', handleSubscriptionUpdate);
    };
  }, [fetchSubscriptions]);

  // ✅ Listen for localStorage changes (for cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'subscriptionStatus') {
        console.log('💾 MySubscriptions: localStorage change detected:', e.newValue);
        // Refresh subscriptions when status changes in another tab
        fetchSubscriptions();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchSubscriptions]);

  const getSubscriptionTypeLabel = (name) => {
    if (name === 'Newsletter Subscriber') return 'Newsletter';
    return 'Service Launch';
  };

  const getSubscriptionTypeColor = (name) => {
    if (name === 'Newsletter Subscriber') return 'from-blue-400 to-cyan-400';
    return 'from-yellow-400 to-yellow-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-900 to-gray-900 flex items-center justify-center p-4">
        {alert && (
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={hideAlert}
            autoClose={alert.autoClose}
            duration={alert.duration}
            position={alert.position}
          />
        )}
        <div className="text-center">
          <Loader size="md" />
          <p className="text-white text-lg mt-4">Loading your subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:bg-zinc-900/50 md:rounded-3xl p-1 sm:p-4 md:p-8 text-white md:shadow-xl md:border md:border-zinc-700">
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={hideAlert}
          autoClose={alert.autoClose}
          duration={alert.duration}
          position={alert.position}
        />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-9 h-9 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                <FaBell className="text-lg md:text-2xl text-black" />
              </div>
              <div>
                <h1 className="text-xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  My Subscriptions
                </h1>
                <p className="text-zinc-400 text-xs md:text-sm mt-0.5 md:mt-1">
                  Manage your email subscriptions
                </p>
              </div>
            </div>
            
            <button
              onClick={fetchSubscriptions}
              className="px-3 md:px-4 py-1.5 md:py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all flex items-center gap-1.5 md:gap-2 border border-zinc-700"
            >
              <FaSync className="text-xs" />
              <span className="text-xs md:text-sm font-medium">Refresh</span>
            </button>
          </div>

          {/* User Email Display */}
          {userEmail && (
            <div className="bg-zinc-800/60 backdrop-blur-xl p-4 rounded-xl border border-zinc-700/50 flex items-center gap-3">
              <FaUserCircle className="text-yellow-400 text-2xl" />
              <div>
                <p className="text-xs text-zinc-400">Subscribed as</p>
                <p className="text-white font-semibold">{userName}</p>
                <p className="text-zinc-300 text-sm break-all">{userEmail}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6 flex items-start gap-3"
        >
          <FaInfoCircle className="text-blue-400 text-xl flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-300 font-semibold mb-1">About Subscriptions</p>
            <p className="text-blue-200/80">
              You can manage all your email subscriptions here. Unsubscribe anytime and
              resubscribe whenever you want. We respect your privacy.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        {subscriptions.length > 0 && (
          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
            <div className="bg-zinc-800/60 backdrop-blur-xl p-3 md:p-4 rounded-xl border border-zinc-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-[10px] md:text-xs mb-0.5 md:mb-1">Total</p>
                  <p className="text-lg md:text-2xl font-black text-white">{subscriptions.length}</p>
                </div>
                <FaEnvelope className="text-xl md:text-3xl text-yellow-400 opacity-50" />
              </div>
            </div>

            <div className="bg-zinc-800/60 backdrop-blur-xl p-3 md:p-4 rounded-xl border border-zinc-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-[10px] md:text-xs mb-0.5 md:mb-1">Active</p>
                  <p className="text-lg md:text-2xl font-black text-green-400">
                    {subscriptions.filter((s) => s.status === 'active').length}
                  </p>
                </div>
                <FaCheckCircle className="text-xl md:text-3xl text-green-400 opacity-50" />
              </div>
            </div>

            <div className="bg-zinc-800/60 backdrop-blur-xl p-3 md:p-4 rounded-xl border border-zinc-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-[10px] md:text-xs mb-0.5 md:mb-1">Inactive</p>
                  <p className="text-lg md:text-2xl font-black text-red-400">
                    {subscriptions.filter((s) => s.status === 'unsubscribed').length}
                  </p>
                </div>
                <FaTimesCircle className="text-xl md:text-3xl text-red-400 opacity-50" />
              </div>
            </div>
          </div>
        )}

        {/* Subscriptions List */}
        {subscriptions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-800/60 backdrop-blur-xl rounded-2xl p-12 border border-zinc-700/50 text-center"
          >
            <FaEnvelope className="text-6xl text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Subscriptions Found</h3>
            <p className="text-zinc-400 mb-6">
              You haven't subscribed to any email lists yet.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/#newsletter"
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Subscribe to Newsletter
              </a>
              <a
                href="/services"
                className="px-6 py-3 bg-zinc-700 text-white font-semibold rounded-lg hover:bg-zinc-600 transition-all"
              >
                View Services
              </a>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {subscriptions.map((subscription, index) => {
                const isActive = subscription.status === 'active';
                const typeColor = getSubscriptionTypeColor(subscription.name);
                const typeLabel = getSubscriptionTypeLabel(subscription.name);

                return (
                  <motion.div
                    key={subscription._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-zinc-800/60 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border transition-all ${
                      isActive
                        ? 'border-green-500/30 shadow-lg shadow-green-500/10'
                        : 'border-zinc-700/30 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Subscription Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          {/* Type Badge */}
                          <div
                            className={`px-3 py-1 bg-gradient-to-r ${typeColor} rounded-full flex items-center gap-2`}
                          >
                            <FaBell className="text-xs text-black" />
                            <span className="text-xs font-bold text-black">{typeLabel}</span>
                          </div>

                          {/* Status Badge */}
                          {isActive ? (
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full flex items-center gap-1">
                              <FaCheckCircle className="text-xs" />
                              Active
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full flex items-center gap-1">
                              <FaTimesCircle className="text-xs" />
                              Unsubscribed
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-zinc-300">
                            <FaEnvelope className="text-zinc-500 text-xs" />
                            <span className="font-semibold break-all">{subscription.email}</span>
                          </div>

                          <div className="flex items-center gap-2 text-zinc-400">
                            <FaCalendarAlt className="text-zinc-500 text-xs" />
                            <span>
                              Subscribed on{' '}
                              {new Date(subscription.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>

                          {!isActive && subscription.unsubscribedAt && (
                            <div className="flex items-center gap-2 text-red-400 text-xs">
                              <FaTimesCircle className="text-xs" />
                              <span>
                                Unsubscribed on{' '}
                                {new Date(subscription.unsubscribedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex sm:flex-col gap-2">
                        {isActive ? (
                          <button
                            onClick={() => handleUnsubscribe(subscription._id, subscription.email)}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all flex items-center gap-2 font-semibold text-sm border border-red-500/30"
                          >
                            <FaTrash className="text-xs" />
                            Unsubscribe
                          </button>
                        ) : (
                          <button
                            onClick={() => handleResubscribe(subscription._id, subscription.email)}
                            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 rounded-lg transition-all flex items-center gap-2 font-semibold text-sm border border-green-500/30"
                          >
                            <FaCheckCircle className="text-xs" />
                            Resubscribe
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-zinc-800/40 backdrop-blur-xl rounded-xl p-6 border border-zinc-700/30"
        >
          <div className="flex items-start gap-3">
            <FaShieldAlt className="text-yellow-400 text-xl flex-shrink-0" />
            <div className="text-sm">
              <p className="text-white font-semibold mb-2">Privacy & Data Protection</p>
              <p className="text-zinc-400 mb-2">
                We respect your privacy and will never share your email with third parties. You
                can manage your subscriptions anytime, and we'll honor your preferences
                immediately.
              </p>
              <p className="text-zinc-500 text-xs">
                Your data is securely stored and protected. Read our{' '}
                <a href="/privacy-policy" className="text-yellow-400 hover:underline">
                  Privacy Policy
                </a>{' '}
                for more information.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MySubscriptions;