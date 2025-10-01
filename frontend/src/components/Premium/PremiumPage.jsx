import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCrown, FaCheck, FaStar, FaShieldAlt, FaBolt, FaGift } from 'react-icons/fa';
import axios from 'axios';
import { authActions } from '../../store/auth';

const PremiumPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const isPremium = useSelector((state) => state.auth.isPremium);
  const premiumType = useSelector((state) => state.auth.premiumType);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/v1/premium/plans');
      setPlans(res.data.plans);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    try {
      setSelectedPlan(plan.id);

      // Create order
      const { data } = await axios.post(
        'http://localhost:3000/api/v1/premium/create-order',
        { planType: plan.id },
        {
          headers: {
            id: localStorage.getItem('id'),
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Open Razorpay
      const options = {
        key: 'rzp_test_NBQpcL6r3o5ntb', // Replace with your key
        amount: data.order.amount,
        currency: 'INR',
        name: 'BookBalcony Premium',
        description: `${plan.name} Subscription`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            // Verify and activate
            const verifyRes = await axios.post(
              'http://localhost:3000/api/v1/premium/verify-and-activate',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planType: plan.id,
              },
              {
                headers: {
                  id: localStorage.getItem('id'),
                  authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );

            // Update Redux
            dispatch(
              authActions.updatePremium({
                isPremium: true,
                premiumType: plan.id,
                premiumExpiry: verifyRes.data.premium?.expiryDate,
              })
            );

            alert('🎉 Premium activated successfully!');
            navigate('/profile');
          } catch (err) {
            console.error('Activation failed:', err);
            alert('Payment succeeded but activation failed. Contact support.');
          }
        },
        theme: {
          color: '#FFC107',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment failed:', err);
      alert('Failed to initiate payment');
    } finally {
      setSelectedPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 flex items-center justify-center">
        <div className="text-yellow-400 text-2xl animate-pulse">Loading premium plans...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 py-16 px-4 sm:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <FaCrown className="text-yellow-400 text-5xl drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            Go Premium
          </h1>
        </div>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Unlock exclusive features and take your BookBalcony experience to the next level
        </p>
        
        {isPremium && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-6 inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-full font-bold shadow-lg shadow-yellow-400/30"
          >
            <FaStar className="inline mr-2" />
            You're on {premiumType.toUpperCase()} plan
          </motion.div>
        )}
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-5xl mx-auto mb-16 relative z-10"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Why Go Premium?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <FaShieldAlt />,
              title: 'See Seller Info',
              desc: 'View detailed seller information before purchasing',
              color: 'from-blue-400 to-cyan-400',
            },
            {
              icon: <FaBolt />,
              title: 'Priority Support',
              desc: 'Get your queries resolved faster with premium support',
              color: 'from-yellow-400 to-orange-400',
            },
            {
              icon: <FaGift />,
              title: 'Exclusive Deals',
              desc: 'Access special discounts and early access to new books',
              color: 'from-purple-400 to-pink-400',
            },
          ].map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6 text-center backdrop-blur-sm overflow-hidden group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className={`text-4xl mb-4 flex justify-center bg-gradient-to-br ${benefit.color} bg-clip-text text-transparent drop-shadow-lg`}>
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
              <p className="text-zinc-400 text-sm">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Pricing Plans */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const isPopular = plan.id === 'yearly';
            const isLifetime = plan.id === 'lifetime';
            const isCurrentPlan = isPremium && premiumType === plan.id;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + 0.1 * index }}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`relative rounded-3xl p-8 border-2 backdrop-blur-sm transition-all duration-300
                  ${isPopular 
                    ? 'bg-gradient-to-br from-yellow-500/20 via-yellow-400/10 to-yellow-600/20 border-yellow-400 shadow-2xl shadow-yellow-400/30' 
                    : isLifetime
                    ? 'bg-gradient-to-br from-purple-500/20 via-purple-400/10 to-purple-600/20 border-purple-400 shadow-2xl shadow-purple-400/30'
                    : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                  }`}
              >
                {/* Animated glow effect */}
                <div className={`absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500
                  ${isPopular ? 'bg-yellow-400' : isLifetime ? 'bg-purple-400' : 'bg-zinc-600'}`}></div>

                {/* Popular/Best Value Badge */}
                {isPopular && (
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg"
                  >
                    ⭐ MOST POPULAR
                  </motion.div>
                )}

                {isLifetime && (
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg"
                  >
                    💎 BEST VALUE
                  </motion.div>
                )}

                {/* Plan Icon */}
                <div className="text-center mb-6 relative z-10">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FaCrown className={`text-5xl mx-auto mb-3 
                      ${isPopular ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' 
                      : isLifetime ? 'text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]' 
                      : 'text-zinc-400'}`} 
                    />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <p className="text-zinc-400 text-sm">{plan.duration}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-6 relative z-10">
                  <div className="text-5xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent mb-2">
                    ₹{plan.price}
                  </div>
                  {plan.savings && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-semibold text-sm border border-green-500/30"
                    >
                      {plan.savings}
                    </motion.div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 relative z-10">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      className="flex items-start gap-2 text-zinc-300"
                    >
                      <FaCheck className="text-green-400 mt-1 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Subscribe Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSubscribe(plan)}
                  disabled={selectedPlan === plan.id || isCurrentPlan}
                  className={`relative w-full py-4 rounded-xl font-bold transition-all duration-300 overflow-hidden z-10
                    ${isCurrentPlan
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : isPopular
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 shadow-lg hover:shadow-yellow-400/50'
                      : isLifetime
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-purple-400/50'
                      : 'bg-zinc-700 text-white hover:bg-zinc-600'
                    }`}
                >
                  {isCurrentPlan
                    ? '✓ Current Plan'
                    : selectedPlan === plan.id
                    ? 'Processing...'
                    : 'Subscribe Now'}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-4xl mx-auto mt-16 text-center relative z-10"
      >
        <div className="bg-zinc-800/30 border border-zinc-700 rounded-2xl p-6 backdrop-blur-sm">
          <p className="text-zinc-300 mb-4">
            All plans include a <span className="text-yellow-400 font-semibold">7-day money-back guarantee</span>. Cancel anytime from your profile settings.
          </p>
          <div className="flex justify-center gap-6 flex-wrap text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-green-400" />
              <span>Secure Payment</span>
            </div>
            <div>•</div>
            <div className="flex items-center gap-2">
              <FaBolt className="text-yellow-400" />
              <span>Instant Activation</span>
            </div>
            <div>•</div>
            <div className="flex items-center gap-2">
              <FaStar className="text-purple-400" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumPage;