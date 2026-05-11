import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  FaRocket,
  FaGraduationCap,
  FaCode,
  FaLaptopCode,
  FaProjectDiagram,
  FaChartLine,
  FaBriefcase,
  FaPencilRuler,
  FaLightbulb,
  FaClock,
  FaBell,
  FaStar,
  FaCheckCircle,
  FaArrowRight,
  FaUsers,
  FaAward,
  FaInfinity,
  FaHeart,
  FaFireAlt,
  FaCalendarAlt,
  FaShieldAlt,
  FaMoneyBillWave,
  FaHeadset,
  FaTrophy,
  FaCertificate,
  FaHandshake,
  FaFileAlt,
  FaUserTie,
  FaMedal,
  FaPlusCircle,
  FaStore,
  FaEnvelope,
  FaGlobe,
  FaMobileAlt,
  FaPalette,
  FaRobot,
  FaChartBar,
  FaLock,
} from 'react-icons/fa';

// ✅ Configure how many services should be visible (not blurred)
const ACTIVE_SERVICES_COUNT = 1;

const ServicesComingSoon = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [userProfile, setUserProfile] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  const [countdown, setCountdown] = useState({ days: 45, hours: 23, minutes: 59, seconds: 59 });
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyName, setNotifyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeService, setActiveService] = useState(null);

  const launchDate = new Date('2026-03-31T00:00:00');

  // ✅ Check subscription status from database
  const checkSubscriptionStatus = useCallback(async (email, token, id) => {
    if (!email || !token || !id) {
      console.log('❌ ServicesComingSoon: Missing credentials for subscription check');
      return false;
    }

    try {
      console.log('🔍 ServicesComingSoon: Checking subscription status for:', email);
      
      const response = await axios.get(
        `http://localhost:3000/api/v1/services/my-subscriptions?email=${encodeURIComponent(email)}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
            id: id,
          },
        }
      );

      console.log('📋 ServicesComingSoon: Subscription response:', response.data);

      if (response.data.success && response.data.data && response.data.data.length > 0) {
        // Check if ANY subscription is active
        const hasActiveSubscription = response.data.data.some(
          sub => sub.status === 'active'
        );
        
        console.log('✅ ServicesComingSoon: Active subscription found:', hasActiveSubscription);
        setIsSubscribed(hasActiveSubscription);
        return hasActiveSubscription;
      } else {
        console.log('❌ ServicesComingSoon: No active subscriptions found');
        setIsSubscribed(false);
        return false;
      }
    } catch (err) {
      console.error('ServicesComingSoon: Subscription check error:', err);
      if (err.response?.status === 404) {
        console.log('❌ ServicesComingSoon: 404 - User has no subscriptions');
      }
      setIsSubscribed(false);
      return false;
    }
  }, []);

  // ✅ Fetch user data and subscription status
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setCheckingSubscription(true);

      if (!isLoggedIn) {
        console.log('❌ ServicesComingSoon: User not logged in');
        setLoading(false);
        setCheckingSubscription(false);
        return;
      }

      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');

      if (!token || !id) {
        console.log('❌ ServicesComingSoon: Missing auth credentials');
        setLoading(false);
        setCheckingSubscription(false);
        return;
      }

      try {
        console.log('📡 ServicesComingSoon: Fetching user data...');
        
        const res = await axios.get(`http://localhost:3000/api/v1/get-user-information`, {
          headers: { authorization: `Bearer ${token}`, id: id },
        });

        const userData = res.data?.data || res.data;
        setUserProfile(userData);
        
        const sellerStatus = userData.sellerApplicationStatus === 'Accepted' && 
                            (userData.isSeller === true || userData.isSeller === 'true');
        setIsSeller(sellerStatus);

        // ✅ Auto-fill email and name for logged-in users
        if (userData.email) {
          setNotifyEmail(userData.email);
          console.log('✅ ServicesComingSoon: Email auto-filled:', userData.email);
        }
        if (userData.username) {
          setNotifyName(userData.username);
        }

        // ✅ Check subscription status from database
        await checkSubscriptionStatus(userData.email, token, id);
        
      } catch (err) {
        console.error('ServicesComingSoon: Failed to fetch user data:', err);
      } finally {
        setLoading(false);
        setCheckingSubscription(false);
      }
    };

    fetchUserData();
  }, [isLoggedIn, checkSubscriptionStatus]);

  // ✅ Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = launchDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ✅ Listen for subscription updates from Footer or MySubscriptions
  useEffect(() => {
    const handleSubscriptionUpdate = async (event) => {
      console.log('🔄 ServicesComingSoon: Subscription update event received:', event.detail);
      
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');
      
      if (token && id && notifyEmail) {
        console.log('🔄 ServicesComingSoon: Refreshing subscription status...');
        await checkSubscriptionStatus(notifyEmail, token, id);
      }
    };

    window.addEventListener('subscriptionUpdated', handleSubscriptionUpdate);

    return () => {
      window.removeEventListener('subscriptionUpdated', handleSubscriptionUpdate);
    };
  }, [notifyEmail, checkSubscriptionStatus]);

  const handleNotifyMe = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!notifyEmail.trim()) {
      alert('Please enter your email address');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(notifyEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');

      let response;

      console.log('📧 ServicesComingSoon: Attempting to subscribe:', notifyEmail.trim());

      // ✅ ALWAYS try resubscribe first (for users who previously unsubscribed)
      try {
        console.log('🔄 ServicesComingSoon: Trying resubscribe endpoint...');
        
        response = await axios.post(
          'http://localhost:3000/api/v1/services/resubscribe',
          { email: notifyEmail.trim() },
          {
            headers: isLoggedIn && token && id ? {
              authorization: `Bearer ${token}`,
              id: id,
            } : {},
          }
        );

        console.log('✅ ServicesComingSoon: Resubscribe successful:', response.data);
        setIsSubscribed(true);

        // ✅ Dispatch event to notify Footer and MySubscriptions
        const event = new CustomEvent('subscriptionUpdated', { 
          detail: { status: 'active', email: notifyEmail.trim() } 
        });
        window.dispatchEvent(event);
        console.log('📢 ServicesComingSoon: Dispatched subscriptionUpdated event');

        // ✅ Refresh subscription status
        if (isLoggedIn && token && id) {
          setTimeout(async () => {
            await checkSubscriptionStatus(notifyEmail.trim(), token, id);
          }, 500);
        }

        return; // Exit early on successful resubscribe

      } catch (resubErr) {
        console.log('⚠️ ServicesComingSoon: Resubscribe failed, trying new subscription...');
        
        // If resubscribe fails (404), try to create new subscription
        if (isLoggedIn && token && id) {
          // ✅ Use authenticated endpoint for logged-in users
          response = await axios.post(
            'http://localhost:3000/api/v1/services/notify-me',
            {
              email: notifyEmail.trim(),
              userType: isSeller ? 'Seller' : 'Customer',
            },
            {
              headers: {
                authorization: `Bearer ${token}`,
                id: id,
              },
            }
          );
        } else {
          // ✅ Use public endpoint for non-logged-in users
          response = await axios.post('http://localhost:3000/api/v1/services/newsletter-subscribe', {
            email: notifyEmail.trim(),
            name: notifyName || 'Anonymous',
          });
        }
      }

      console.log('✅ ServicesComingSoon: Subscription successful:', response.data);

      // ✅ Update subscription state
      setIsSubscribed(true);

      // ✅ Dispatch event to notify Footer and MySubscriptions
      const event = new CustomEvent('subscriptionUpdated', { 
        detail: { status: 'active', email: notifyEmail.trim() } 
      });
      window.dispatchEvent(event);
      console.log('📢 ServicesComingSoon: Dispatched subscriptionUpdated event');

      // ✅ Refresh subscription status from database
      if (isLoggedIn && token && id) {
        setTimeout(async () => {
          await checkSubscriptionStatus(notifyEmail.trim(), token, id);
        }, 500);
      }

    } catch (err) {
      console.error('❌ ServicesComingSoon: Subscription failed:', err);
      
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else if (err.response?.status === 400) {
        alert('Invalid email or you are already subscribed');
      } else if (err.response?.status === 500) {
        alert('Server error. Please try again later.');
      } else {
        alert('Failed to subscribe. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const upcomingServices = [
    {
      icon: <FaGraduationCap className="text-3xl" />,
      title: 'Final Year Projects',
      description: 'Get professionally developed final year projects with complete source code, documentation, and presentation materials.',
      features: ['Custom Development', 'Full Documentation', 'Live Demo', 'Code Walkthrough'],
      pricing: '₹2,999',
      deliveryTime: '7-14 days',
      color: 'from-yellow-400 to-yellow-200',
      badge: 'Most Popular',
      badgeColor: 'bg-yellow-500',
      rating: 4.9,
    },
    {
      icon: <FaCode className="text-3xl" />,
      title: 'Web Development',
      description: 'Professional web development services for responsive, SEO-optimized websites and web applications.',
      features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Modern Tech'],
      pricing: '₹4,999',
      deliveryTime: '10-20 days',
      color: 'from-yellow-400 to-yellow-200',
      badge: 'High Demand',
      badgeColor: 'bg-yellow-500',
      rating: 4.8,
    },
    {
      icon: <FaMobileAlt className="text-3xl" />,
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile app development for iOS and Android with stunning UI/UX.',
      features: ['iOS & Android', 'Cross-Platform', 'UI/UX Design', 'App Store Deploy'],
      pricing: '₹8,999',
      deliveryTime: '15-30 days',
      color: 'from-yellow-400 to-yellow-200',
      badge: 'Trending',
      badgeColor: 'bg-yellow-500',
      rating: 4.9,
    },
    {
      icon: <FaRobot className="text-3xl" />,
      title: 'Data Science & AI',
      description: 'ML models, data analysis, and AI solutions from expert data scientists for research and business.',
      features: ['ML/AI Models', 'Data Analysis', 'Predictive Analytics', 'Research Support'],
      pricing: '₹6,499',
      deliveryTime: '10-25 days',
      color: 'from-yellow-400 to-yellow-200',
      badge: 'New',
      badgeColor: 'bg-yellow-500',
      rating: 4.7,
    },
    {
      icon: <FaPalette className="text-3xl" />,
      title: 'UI/UX Design',
      description: 'Professional design services with pixel-perfect interfaces and interactive prototypes.',
      features: ['Figma Designs', 'Prototypes', 'User Research', 'Design Systems'],
      pricing: '₹3,999',
      deliveryTime: '5-12 days',
      color: 'from-yellow-400 to-yellow-200',
      badge: 'Creative',
      badgeColor: 'bg-yellow-500',
      rating: 4.8,
    },
    {
      icon: <FaChartBar className="text-3xl" />,
      title: 'Business Analytics',
      description: 'Data-driven insights with custom dashboards, KPI tracking, and automated reports.',
      features: ['Custom Dashboards', 'KPI Tracking', 'Reports', 'Visualization'],
      pricing: '₹5,499',
      deliveryTime: '8-18 days',
      color: 'from-yellow-400 to-yellow-200',
      badge: 'Enterprise',
      badgeColor: 'bg-yellow-500',
      rating: 4.7,
    },
  ];

  const stats = [
    { icon: <FaUsers />, value: '500+', label: 'Verified Sellers', color: 'text-yellow-400' },
    { icon: <FaProjectDiagram />, value: '3,000+', label: 'Projects Done', color: 'text-yellow-400' },
    { icon: <FaStar />, value: '4.8/5', label: 'Rating', color: 'text-yellow-400' },
    { icon: <FaAward />, value: '98%', label: 'Success Rate', color: 'text-yellow-400' },
  ];

  const benefits = [
    { icon: <FaShieldAlt />, text: 'Verified Sellers', color: 'text-yellow-400' },
    { icon: <FaMoneyBillWave />, text: 'Transparent Pricing', color: 'text-yellow-400' },
    { icon: <FaClock />, text: 'On-Time Delivery', color: 'text-yellow-400' },
    { icon: <FaTrophy />, text: 'Quality Assured', color: 'text-yellow-400' },
    { icon: <FaHeadset />, text: '24/7 Support', color: 'text-yellow-400' },
    { icon: <FaHandshake />, text: 'Money-Back', color: 'text-yellow-400' },
  ];

  const trustIndicators = [
    { icon: <FaCertificate />, text: 'ISO Certified', color: 'text-yellow-400' },
    { icon: <FaShieldAlt />, text: 'Secure Payments', color: 'text-yellow-400' },
    { icon: <FaUserTie />, text: 'Professional Sellers', color: 'text-yellow-400' },
    { icon: <FaFileAlt />, text: 'Legal Contracts', color: 'text-yellow-400' },
  ];

  // ✅ Helper function to check if service is active (visible)
  const isServiceActive = (index) => {
    return index < ACTIVE_SERVICES_COUNT;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 sm:px-8 py-10 flex justify-center">
      <div className="w-full max-w-7xl bg-zinc-900/50 rounded-3xl px-6 sm:px-12 py-10 shadow-xl border border-zinc-700">
        
        {/* Heading Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-md leading-tight pb-2">
            BookBalcony Services
          </h1>
          <p className="text-zinc-400 mt-3 text-sm sm:text-base italic">
            Premium Academic & Professional Services Platform
          </p>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            Connect with 500+ verified sellers for final year projects, web development, mobile apps, and more.
          </p>
          <hr className="mt-6 border-zinc-700 w-3/4 mx-auto rounded-full" />
        </div>

        {/* Launch Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400/10 rounded-full border border-yellow-400/30 backdrop-blur-sm shadow-lg">
            <FaRocket className="text-yellow-400 animate-pulse" />
            <span className="text-sm font-bold text-yellow-400 uppercase tracking-wider">Launching March 31, 2026</span>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {trustIndicators.map((item, index) => (
            <div key={index} className="flex items-center gap-2 px-4 py-2 bg-zinc-800/60 backdrop-blur-sm rounded-full border border-zinc-700/50 hover:border-zinc-600/80 hover:scale-105 transition-all duration-300">
              <div className={`${item.color} text-sm`}>{item.icon}</div>
              <span className="text-xs text-zinc-300 font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Countdown */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaCalendarAlt className="text-yellow-400" />
            <h3 className="text-lg font-bold text-white">Launch Countdown</h3>
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            {Object.entries(countdown).map(([unit, value]) => (
              <div
                key={unit}
                className="flex flex-col items-center p-4 bg-zinc-800/80 backdrop-blur-xl rounded-2xl border border-zinc-700/50 shadow-xl min-w-[80px] transform hover:scale-110 hover:border-yellow-400/50 transition-all duration-300"
              >
                <div className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent mb-1">
                  {String(value).padStart(2, '0')}
                </div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                  {unit}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notify Form */}
        <div className="max-w-xl mx-auto bg-zinc-800/60 backdrop-blur-xl p-6 rounded-2xl border border-zinc-700/50 shadow-xl mb-10">
          {checkingSubscription ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-zinc-400">Checking subscription status...</span>
            </div>
          ) : isSubscribed ? (
            // ✅ Already Subscribed State
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <FaCheckCircle className="text-green-400 text-3xl flex-shrink-0" />
                <div>
                  <p className="text-green-400 font-bold text-lg">You're Already Subscribed! 🎉</p>
                  <p className="text-green-300 text-sm mt-1 break-all">
                    {notifyEmail || 'We\'ll notify you at launch!'}
                  </p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm mt-3">
                We'll notify you on <span className="text-yellow-400 font-semibold">February 15, 2026</span> when services launch with an exclusive <span className="text-green-400 font-semibold">30% discount</span>!
              </p>
              {isLoggedIn && (
                <Link
                  to="/profile/my-subscriptions"
                  className="block mt-4 text-sm text-yellow-400 hover:text-yellow-300 transition-colors underline text-center"
                >
                  Manage your subscriptions →
                </Link>
              )}
            </div>
          ) : (
            // ✅ Not Subscribed - Show Subscribe Form
            <>
              <div className="flex items-center justify-center gap-2 mb-3">
                <FaBell className="text-yellow-400 text-xl animate-pulse" />
                <h3 className="text-lg font-bold text-white">Get Notified at Launch</h3>
              </div>
              <p className="text-zinc-400 text-sm mb-4 text-center">
                Be first to access - Get <span className="text-green-400 font-semibold">30% off</span> launch discount!
              </p>
              
              <form onSubmit={handleNotifyMe} className="space-y-3">
                <input
                  type="text"
                  value={notifyName}
                  onChange={(e) => setNotifyName(e.target.value)}
                  placeholder="Your Name (Optional)"
                  disabled={isLoggedIn}
                  readOnly={isLoggedIn}
                  className={`w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-700/50 rounded-lg text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all ${
                    isLoggedIn ? 'cursor-not-allowed opacity-75' : ''
                  }`}
                />
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      disabled={isLoggedIn}
                      readOnly={isLoggedIn}
                      className={`w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-700/50 rounded-lg text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all ${
                        isLoggedIn ? 'cursor-not-allowed opacity-75 border-yellow-400/50' : ''
                      }`}
                    />
                    <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-200 text-black text-sm font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                      </>
                    ) : (
                      <>
                        <span>Notify Me</span>
                        <FaArrowRight />
                      </>
                    )}
                  </button>
                </div>
                {isLoggedIn && (
                  <p className="text-xs text-yellow-400/80 text-center">
                    ✓ Email auto-filled from your account
                  </p>
                )}
                <p className="text-xs text-zinc-500 text-center">Secure & no spam. Unsubscribe anytime.</p>
              </form>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-zinc-800/60 backdrop-blur-xl p-6 rounded-2xl border border-zinc-700/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 text-center group"
            >
              <div className={`text-3xl ${stat.color} mb-2 group-hover:scale-110 transition-transform flex justify-center`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-xs text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="mb-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <FaFireAlt className="text-yellow-400 animate-pulse text-2xl" />
              <h2 className="text-3xl font-black text-white">Upcoming Services</h2>
              <FaFireAlt className="text-yellow-400 animate-pulse text-2xl" />
            </div>
            <p className="text-zinc-400 text-sm italic">Professional services for all your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingServices.map((service, index) => {
              const isActive = isServiceActive(index);
              
              return (
                <div
                  key={index}
                  className={`relative group bg-zinc-800/60 backdrop-blur-xl p-6 rounded-2xl border border-zinc-700/50 transition-all duration-300 overflow-hidden ${
                    isActive
                      ? 'hover:border-yellow-400/50 hover:scale-105' 
                      : 'blur-sm opacity-60 pointer-events-none select-none'
                  }`}
                  onMouseEnter={() => isActive && setActiveService(index)}
                  onMouseLeave={() => setActiveService(null)}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} ${isActive ? 'opacity-0 group-hover:opacity-10' : 'opacity-5'} transition-opacity duration-300`}></div>

                  {/* Lock badge for blurred services */}
                  {!isActive && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="bg-zinc-900/90 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-yellow-400/50 shadow-2xl">
                        <FaLock className="text-yellow-400 text-4xl mx-auto mb-2" />
                        <p className="text-yellow-400 font-bold text-sm whitespace-nowrap">Coming Soon</p>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 right-3">
                    <span className={`${service.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1`}>
                      <FaMedal className="text-xs" />
                      {service.badge}
                    </span>
                  </div>

                  <div className="flex items-start justify-between mb-4">
                    <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl ${isActive ? 'group-hover:scale-110' : ''} transition-transform duration-300 shadow-lg`}>
                      <div className="text-white">{service.icon}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400 text-xs" />
                        <span className="text-white font-bold text-sm">{service.rating}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className={`text-xl font-black text-white mb-2 ${isActive ? 'group-hover:text-yellow-400' : ''} transition-colors`}>
                    {service.title}
                  </h3>
                  <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="space-y-1.5 mb-4">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs">
                        <FaCheckCircle className="text-green-400 flex-shrink-0 text-xs" />
                        <span className="text-zinc-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg border border-zinc-700/30 mb-4">
                    <div>
                      <p className="text-xs text-zinc-400">Price</p>
                      <p className="text-lg font-black bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                        {service.pricing}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-400">Delivery</p>
                      <p className="text-sm font-bold text-white flex items-center gap-1">
                        <FaClock className="text-cyan-400 text-xs" />
                        {service.deliveryTime}
                      </p>
                    </div>
                  </div>

                  <button className={`w-full py-2.5 bg-gradient-to-r ${service.color} text-white text-sm font-bold rounded-lg ${isActive ? 'opacity-60 cursor-not-allowed group-hover:opacity-100' : 'opacity-50'} transition-all relative overflow-hidden`}>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <FaRocket className="text-sm" />
                      {isActive ? 'Coming Soon' : 'Locked'}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-zinc-800/40 backdrop-blur-xl p-8 rounded-2xl border border-zinc-700/50 mb-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-white mb-2 flex items-center justify-center gap-2">
              <FaHeart className="text-red-400 animate-pulse" />
              Why Choose Us?
            </h2>
            <p className="text-zinc-400 text-sm italic">India's most trusted services marketplace</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-2 p-4 bg-zinc-900/60 rounded-xl border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-300 hover:scale-105 group"
              >
                <div className={`${benefit.color} text-2xl group-hover:scale-125 transition-transform`}>
                  {benefit.icon}
                </div>
                <span className="text-white font-semibold text-xs">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-zinc-800/80 backdrop-blur-xl p-10 rounded-2xl border-2 border-yellow-400/30 shadow-xl">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400/20 rounded-full mb-4 border-4 border-yellow-400/50 animate-pulse">
            <FaInfinity className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            Get Ready for Launch!
          </h2>
          <p className="text-zinc-400 mb-6 max-w-2xl mx-auto text-sm">
            Join thousands of students and businesses. Get verified sellers, quality work, and affordable pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-200 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <FaGlobe />
              <span>Browse Books</span>
              <FaArrowRight />
            </Link>
            
            {!loading && (
              isSeller ? (
                <Link
                  to="/seller/services/add"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 border-2 border-blue-400/50 text-white font-bold rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                >
                  <FaPlusCircle />
                  <span>Add Your Service</span>
                  <FaStore />
                </Link>
              ) : (
                <Link
                  to="/profile/become-seller"
                  className="px-8 py-3 bg-zinc-700/50 border-2 border-yellow-400/50 text-white font-bold rounded-xl hover:bg-zinc-600/50 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <span>Become a Seller</span>
                  <FaRocket />
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesComingSoon;