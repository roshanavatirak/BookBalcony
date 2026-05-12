import React, { useState, useEffect, useCallback } from 'react';
import { FaInstagram, FaLinkedin, FaGithub, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import Alert from '../Alert/Alert';
import { useAlert } from '../Alert/useAlert';
import axios from 'axios';
import logo from '../../assets/logo.png';
const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { alert, showAlert, hideAlert, success, error, warning, info } = useAlert();

  // ✅ Clear all subscription-related state
  const clearSubscriptionState = useCallback(() => {
    setEmail('');
    setIsSubscribed(false);
    setIsAuthenticated(false);
    // Don't clear localStorage here - let logout handler do it
  }, []);

  // ✅ Memoized function to check subscription status from DB
  const checkSubscriptionStatus = useCallback(async (userEmail, token, id) => {
    try {
      const subsResponse = await axios.get(
        `${API_URL}/services/my-subscriptions?email=${encodeURIComponent(userEmail)}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
            id: id,
          },
        }
      );

      console.log('📋 Footer: Subscription check response:', subsResponse.data);

      if (subsResponse.data.success && subsResponse.data.data && subsResponse.data.data.length > 0) {
        // Check if ANY subscription is active
        const hasActiveSubscription = subsResponse.data.data.some(
          sub => sub.status === 'active'
        );
        
        console.log('✅ Footer: Has active subscription:', hasActiveSubscription);
        setIsSubscribed(hasActiveSubscription);
        
        return hasActiveSubscription;
      } else {
        console.log('❌ Footer: No subscriptions found');
        setIsSubscribed(false);
        return false;
      }
    } catch (subErr) {
      console.error('Footer: Subscription check error:', subErr);
      // If error (401, 404, etc.), user is not subscribed
      setIsSubscribed(false);
      return false;
    }
  }, []);

  // ✅ Check authentication and subscription status - ALWAYS from DB
  const checkAuthAndSubscription = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');

      // ✅ If no token/id, user is logged out - clear everything
      if (!token || !id) {
        console.log('🚫 Footer: No authentication found, clearing state');
        clearSubscriptionState();
        setIsLoading(false);
        return;
      }

      // ✅ Verify token is still valid by fetching user info
      try {
        const userResponse = await axios.get(
          `${API_URL}/get-user-information`,
          {
            headers: {
              authorization: `Bearer ${token}`,
              id: id,
            },
          }
        );

        const userEmail = userResponse.data?.data?.email || userResponse.data?.email;
        
        if (userEmail) {
          console.log('✅ Footer: User authenticated:', userEmail);
          setIsAuthenticated(true);
          setEmail(userEmail);
          
          // ✅ Always fetch fresh subscription status from DB
          await checkSubscriptionStatus(userEmail, token, id);
        } else {
          console.log('❌ Footer: No user email found');
          clearSubscriptionState();
        }
      } catch (authErr) {
        console.error('❌ Footer: Authentication failed:', authErr);
        // Token is invalid or expired - clear everything
        clearSubscriptionState();
        // Optionally clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('id');
      }
    } catch (err) {
      console.error('Footer: Error in checkAuthAndSubscription:', err);
      clearSubscriptionState();
    } finally {
      setIsLoading(false);
    }
  }, [checkSubscriptionStatus, clearSubscriptionState]);

  // ✅ Initial load - check auth and subscription
  useEffect(() => {
    checkAuthAndSubscription();
  }, [checkAuthAndSubscription]);

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();

    // ✅ Check if user is authenticated
    if (!isAuthenticated) {
      warning('Please login to subscribe to our newsletter', 'Login Required');
      return;
    }

    // ✅ Validation
    if (!email.trim()) {
      warning('Please enter your email address', 'Email Required');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      warning('Please enter a valid email address', 'Invalid Email');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');

      if (!token || !id) {
        warning('Please login to subscribe', 'Authentication Required');
        setIsSubmitting(false);
        return;
      }

      let response;

      // ✅ Try to resubscribe first (for users who unsubscribed)
      try {
        console.log('🔄 Footer: Attempting to resubscribe:', email.trim());
        
        response = await axios.post(
          `${API_URL}/services/resubscribe`,
          { email: email.trim() },
          {
            headers: {
              authorization: `Bearer ${token}`,
              id: id,
            },
          }
        );

        console.log('✅ Footer: Resubscribe successful:', response.data);
        success('Welcome back! You have been resubscribed. 🎉', 'Resubscribed');
        
        // ✅ Refresh subscription status from DB
        await checkSubscriptionStatus(email.trim(), token, id);

        // ✅ Notify other components
        const event = new CustomEvent('subscriptionUpdated', { 
          detail: { status: 'active', email: email.trim() } 
        });
        window.dispatchEvent(event);

        setIsSubmitting(false);
        return;

      } catch (resubErr) {
        // If resubscribe fails (404 - not found), try to create new subscription
        console.log('⚠️ Footer: Resubscribe failed, trying new subscription');
        
        response = await axios.post(
          `${API_URL}/services/notify-me`,
          {
            email: email.trim(),
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
              id: id,
            },
          }
        );
      }

      console.log('✅ Footer: Newsletter subscription response:', response.data);

      // ✅ Handle different response scenarios
      if (response.data.data?.alreadySubscribed) {
        info('You are already subscribed to our newsletter!', 'Already Subscribed');
      } else if (response.data.data?.resubscribed) {
        success('Welcome back! You have been resubscribed. 🎉', 'Resubscribed');
      } else {
        success('Successfully subscribed! We\'ll keep you updated. 🎉', 'Subscription Complete');
      }

      // ✅ Refresh subscription status from DB
      await checkSubscriptionStatus(email.trim(), token, id);

      // ✅ Notify other components
      const event = new CustomEvent('subscriptionUpdated', { 
        detail: { status: 'active', email: email.trim() } 
      });
      window.dispatchEvent(event);
      console.log('📢 Footer: Dispatched subscriptionUpdated event');

    } catch (err) {
      console.error('❌ Footer: Newsletter subscription failed:', err);

      // ✅ Handle different error types
      if (err.response) {
        const status = err.response.status;
        const errorMessage = err.response.data?.message || 'Failed to subscribe';

        if (status === 400) {
          warning(errorMessage, 'Validation Error');
        } else if (status === 401) {
          warning('Please login again to subscribe', 'Authentication Required');
          clearSubscriptionState();
        } else if (status === 404) {
          error('Service temporarily unavailable. Please try again later.', 'Service Error');
        } else if (status === 500) {
          error('Server error. Please try again later.', 'Server Error');
        } else {
          error(errorMessage, 'Subscription Failed');
        }
      } else if (err.request) {
        error('Unable to connect. Please check your connection.', 'Connection Error');
      } else {
        error('An unexpected error occurred. Please try again.', 'Error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Listen for subscription updates from other components
  useEffect(() => {
    const handleSubscriptionUpdate = async (event) => {
      console.log('🔄 Footer: Subscription update event received');
      
      // ✅ Re-check authentication and subscription from DB
      await checkAuthAndSubscription();
    };

    window.addEventListener('subscriptionUpdated', handleSubscriptionUpdate);

    return () => {
      window.removeEventListener('subscriptionUpdated', handleSubscriptionUpdate);
    };
  }, [checkAuthAndSubscription]);

  // ✅ Listen for logout events
  useEffect(() => {
    const handleLogout = () => {
      console.log('🚪 Footer: Logout event detected, clearing state');
      clearSubscriptionState();
    };

    window.addEventListener('userLoggedOut', handleLogout);

    return () => {
      window.removeEventListener('userLoggedOut', handleLogout);
    };
  }, [clearSubscriptionState]);

  // ✅ Listen for login events
  useEffect(() => {
    const handleLogin = async () => {
      console.log('🔑 Footer: Login event detected, refreshing subscription status');
      await checkAuthAndSubscription();
    };

    window.addEventListener('userLoggedIn', handleLogin);

    return () => {
      window.removeEventListener('userLoggedIn', handleLogin);
    };
  }, [checkAuthAndSubscription]);

  return (
    <>
      {/* ✅ Alert Component */}
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

      <footer className="bg-zinc-900 text-white py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Branding */}
          
<div>
  <div className="flex items-center gap-3 mb-3">
    <img
      src={logo}
      alt="BookBalcony Logo"
      className="h-10 w-10 rounded-xl shadow-lg"
    />
    <h1 className="text-2xl font-bold text-white">BookBalcony</h1>
  </div>
  <p className="text-zinc-400 text-sm">
    Where Stories Find a Second Home. Resell, Reuse, Reignite the joy of reading.
  </p>
</div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>
                <a href="/privacy-policy" className="hover:text-yellow-400 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="hover:text-yellow-400 transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/refund-policy" className="hover:text-yellow-400 transition">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="/support" className="hover:text-yellow-400 transition">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Connect With Us</h2>
            <div className="flex space-x-5 text-2xl text-zinc-400">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition transform hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/in/roshan-avatirak/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://github.com/roshanavatirak"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition transform hover:scale-110"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
            </div>
            <p className="text-xs text-zinc-500 mt-4">
              Follow us for updates, deals, and book recommendations!
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FaEnvelope className="text-yellow-400" />
              Subscribe
            </h2>
            <p className="text-sm text-zinc-400 mb-4">
              Get updates on deals and new arrivals.
            </p>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : !isAuthenticated ? (
              // ✅ Show login prompt for non-authenticated users
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                <p className="text-zinc-300 text-sm mb-3">
                  Please login to subscribe to our newsletter and get exclusive updates!
                </p>
                <a
                  href="/login"
                  className="block w-full px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition-all transform hover:scale-105 text-center"
                >
                  Login to Subscribe
                </a>
                <p className="text-xs text-zinc-500 mt-3">
                  🔒 Your email will be used only for newsletter updates
                </p>
              </div>
            ) : isSubscribed ? (
              // ✅ Show subscribed state for authenticated + subscribed users
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FaCheckCircle className="text-green-400 text-2xl flex-shrink-0" />
                  <div>
                    <p className="text-green-400 font-bold text-sm">You're Subscribed! 🎉</p>
                    <p className="text-green-300 text-xs mt-1 break-all">
                      {email}
                    </p>
                  </div>
                </div>
                <p className="text-zinc-400 text-xs mt-2">
                  We'll keep you updated with the latest news and offers.
                </p>
                <a
                  href="/profile/my-subscriptions"
                  className="block mt-3 text-xs text-yellow-400 hover:text-yellow-300 transition-colors underline"
                >
                  Manage your subscriptions →
                </a>
              </div>
            ) : (
              // ✅ Show subscribe form for authenticated but not subscribed users
              <form onSubmit={handleNewsletterSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your email (auto-filled)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    readOnly
                    className="w-full px-4 py-2 rounded-md bg-transparent border border-yellow-400/50 cursor-not-allowed text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all disabled:opacity-50"
                  />
                  <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none" />
                </div>
                <p className="text-xs text-yellow-400/80">
                  ✓ Email auto-filled from your account
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <FaEnvelope />
                      <span>Subscribe</span>
                    </>
                  )}
                </button>
                <p className="text-xs text-zinc-500">
                  🔒 We respect your privacy. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Line */}
        <div className="text-center text-zinc-500 text-sm mt-10 border-t border-zinc-700 pt-6">
          &copy; {new Date().getFullYear()}{' '}
          <span className="text-white font-semibold">BookBalcony</span> — A Legacy
          Curated by{' '}
          <span className="text-yellow-400 font-medium">RAO DevStudio</span>. All
          rights reserved.
        </div>
      </footer>
    </>
  );
}

export default Footer;