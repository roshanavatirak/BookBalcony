import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUndo,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaClock,
  FaBox,
  FaTruck,
  FaExclamationTriangle,
  FaInfoCircle,
  FaFileContract,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowUp,
  FaHome,
  FaClipboardList,
  FaExchangeAlt,
  FaCalendarAlt,
  FaUserShield,
  FaCreditCard,
  FaBoxOpen,
  FaHandHoldingUsd,
  FaBan,
  FaShippingFast,
  FaCamera,
  FaClipboardCheck,
} from 'react-icons/fa';

const RefundPolicy = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Track scroll and active section
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setShowScrollTop(scrolled > 500);

      // Update active section based on scroll position
      const sections = tableOfContents.map(item => item.id);
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const lastUpdated = "January 28, 2026";
  const effectiveDate = "February 1, 2026";

  const trustIndicators = [
    { icon: <FaUndo />, label: "7-Day Returns", color: "text-yellow-400" },
    { icon: <FaMoneyBillWave />, label: "Full Refunds", color: "text-yellow-400" },
    { icon: <FaShieldAlt />, label: "Buyer Protected", color: "text-yellow-400" },
    { icon: <FaClock />, label: "Fast Processing", color: "text-yellow-400" },
  ];

  const tableOfContents = [
    { id: 'overview', icon: <FaInfoCircle />, title: 'Overview', description: 'Policy summary' },
    { id: 'eligibility', icon: <FaClipboardCheck />, title: 'Eligibility', description: 'Return criteria' },
    { id: 'timeframe', icon: <FaCalendarAlt />, title: 'Timeframe', description: '7-day window' },
    { id: 'process', icon: <FaClipboardList />, title: 'Return Process', description: 'Step-by-step' },
    { id: 'conditions', icon: <FaBox />, title: 'Conditions', description: 'Item requirements' },
    { id: 'refund', icon: <FaMoneyBillWave />, title: 'Refund Process', description: 'Payment timeline' },
    { id: 'shipping', icon: <FaTruck />, title: 'Shipping Costs', description: 'Who pays what' },
    { id: 'non-returnable', icon: <FaBan />, title: 'Non-Returnable', description: 'Exclusions' },
    { id: 'damaged', icon: <FaBoxOpen />, title: 'Damaged Items', description: 'Special cases' },
    { id: 'exchange', icon: <FaExchangeAlt />, title: 'Exchanges', description: 'Item swaps' },
    { id: 'cancellation', icon: <FaTimesCircle />, title: 'Cancellations', description: 'Order cancels' },
    { id: 'contact', icon: <FaEnvelope />, title: 'Contact', description: 'Get help' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white py-12 px-4">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-2xl mb-4 shadow-2xl">
              <FaUndo className="text-4xl text-black" />
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Refund & Return Policy
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-4 leading-relaxed">
              Easy returns, hassle-free refunds. Your satisfaction is our priority.
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs mb-6">
              <div className="flex items-center gap-2 bg-zinc-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <FaClock className="text-yellow-400" />
                <span className="text-zinc-300">Updated:</span>
                <strong className="text-white">{lastUpdated}</strong>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <FaCheckCircle className="text-green-400" />
                <span className="text-zinc-300">Effective:</span>
                <strong className="text-white">{effectiveDate}</strong>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <FaMapMarkerAlt className="text-yellow-400" />
                <strong className="text-white">India</strong>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              {trustIndicators.map((indicator, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="flex items-center gap-2 bg-zinc-800/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-zinc-700/50 hover:border-yellow-400/50 transition-all"
                >
                  <span className={`text-lg ${indicator.color}`}>{indicator.icon}</span>
                  <span className="text-xs font-semibold text-white">{indicator.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Quick Action Button */}
            <motion.a
              href="#overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-200 text-black hover:from-yellow-500 hover:to-yellow-300 rounded-lg font-bold text-sm shadow-2xl hover:shadow-yellow-400/50 transition-all transform hover:scale-105"
            >
              <span>Read Policy</span>
              <FaFileContract />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Table of Contents */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-4">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <FaFileContract className="text-yellow-400" />
                Contents
              </h3>
              <nav className="space-y-1">
                {tableOfContents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 group ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-200 text-black shadow-md'
                        : 'hover:bg-zinc-800/50 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className={`text-sm ${activeSection === item.id ? 'text-black' : 'text-zinc-500 group-hover:text-yellow-400'}`}>
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate">{item.title}</div>
                      <div className="text-[10px] opacity-75 truncate">{item.description}</div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3 space-y-6">
            {/* Section 1: Overview */}
            <motion.section
              id="overview"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaInfoCircle className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Policy Overview</h2>
                  <p className="text-zinc-400 text-xs">Quick summary of our returns</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  At <strong className="text-white">BookBalcony</strong>, we want you to be completely satisfied with your purchase. If you're not happy with your book, we offer a straightforward return and refund process.
                </p>

                <div className="bg-yellow-400/10 border-l-4 border-yellow-400 rounded-r-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">7-Day Return Window</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        You have 7 days from the date of delivery to return any item that doesn't meet your expectations. We make returns simple and hassle-free.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { icon: <FaUndo />, text: "Easy return process in 3 simple steps", color: "from-yellow-400 to-yellow-200" },
                    { icon: <FaMoneyBillWave />, text: "Full refund within 5-7 business days", color: "from-yellow-400 to-yellow-200" },
                    { icon: <FaShieldAlt />, text: "Buyer protection on all orders", color: "from-yellow-400 to-yellow-200" },
                    { icon: <FaTruck />, text: "Free return shipping for defective items", color: "from-yellow-400 to-yellow-200" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-2 bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
                      <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <span className="text-black text-sm">{item.icon}</span>
                      </div>
                      <p className="text-zinc-200 text-xs leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Section 2: Return Eligibility */}
            <motion.section
              id="eligibility"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaClipboardCheck className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Return Eligibility</h2>
                  <p className="text-zinc-400 text-xs">What qualifies for returns</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  We accept returns for the following reasons:
                </p>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Valid Return Reasons</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Wrong Item:</strong> You received a different book than ordered</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Not as Described:</strong> Book condition doesn't match the listing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Damaged in Transit:</strong> Book arrived damaged or defective</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Missing Pages:</strong> Book has missing or torn pages not disclosed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Quality Issues:</strong> Counterfeit, pirated, or unauthorized copy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Change of Mind:</strong> You no longer want the book (conditions apply)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaInfoCircle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Proof Required</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        For claims of wrong items, damage, or quality issues, please provide clear photos as evidence when initiating your return request.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 3: Return Timeframe */}
            <motion.section
              id="timeframe"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaCalendarAlt className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Return Timeframe</h2>
                  <p className="text-zinc-400 text-xs">Important deadlines</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">7-Day Return Window</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaClock className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Starts:</strong> From the date of delivery (as per tracking)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaClock className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Ends:</strong> Exactly 7 calendar days after delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaClock className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Request Deadline:</strong> Return must be initiated within this period</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaClock className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Shipment:</strong> Item must be shipped back within 3 days of approval</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Late Returns Not Accepted</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        Returns initiated after the 7-day window will not be accepted. Please ensure you check your items promptly upon delivery.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                  <h3 className="text-sm font-bold text-white mb-2">Example Timeline</h3>
                  <div className="space-y-2 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <span className="w-24 text-zinc-400">Day 0:</span>
                      <span>Book delivered to your address ✅</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-24 text-zinc-400">Day 1-7:</span>
                      <span>Return window (you can initiate return) ⏰</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-24 text-zinc-400">Day 8:</span>
                      <span>Return window closes ❌</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 4: Return Process */}
            <motion.section
              id="process"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaClipboardList className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">How to Return an Item</h2>
                  <p className="text-zinc-400 text-xs">Step-by-step process</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Follow these simple steps to return your book:
                </p>

                {[
                  {
                    step: "Step 1",
                    title: "Initiate Return Request",
                    description: "Go to My Orders → Select the order → Click 'Return Item'",
                    icon: <FaClipboardList />,
                    details: [
                      "Select return reason from dropdown",
                      "Upload photos if claiming damage/wrong item",
                      "Provide additional comments (optional)",
                      "Submit your return request"
                    ]
                  },
                  {
                    step: "Step 2",
                    title: "Get Return Approval",
                    description: "We'll review your request within 24 hours",
                    icon: <FaCheckCircle />,
                    details: [
                      "Receive email confirmation of approval",
                      "Get return shipping address",
                      "Receive return authorization number",
                      "Note: Some returns may require additional verification"
                    ]
                  },
                  {
                    step: "Step 3",
                    title: "Ship the Item Back",
                    description: "Pack securely and ship to the provided address",
                    icon: <FaTruck />,
                    details: [
                      "Pack book in original or equivalent packaging",
                      "Include all accessories and materials received",
                      "Write return authorization number on package",
                      "Ship within 3 days of approval via any courier"
                    ]
                  },
                  {
                    step: "Step 4",
                    title: "Receive Your Refund",
                    description: "Get refund once return is received and inspected",
                    icon: <FaMoneyBillWave />,
                    details: [
                      "Item inspected within 2 business days of receipt",
                      "Refund initiated immediately after approval",
                      "Money credited within 5-7 business days",
                      "Email notification sent at each stage"
                    ]
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-zinc-800/30 rounded-lg p-5 border-l-4 border-yellow-400">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-black text-lg">{item.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-yellow-400 text-xs font-bold">{item.step}</span>
                          <h3 className="text-base font-bold text-white">{item.title}</h3>
                        </div>
                        <p className="text-zinc-400 text-xs mb-3">{item.description}</p>
                        <ul className="space-y-1.5">
                          {item.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                              <span className="text-yellow-400 mt-0.5">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Section 5: Return Conditions */}
            <motion.section
              id="conditions"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaBox className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Item Return Conditions</h2>
                  <p className="text-zinc-400 text-xs">Requirements for acceptance</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">For Seller Fault Returns</h3>
                  <p className="text-zinc-300 text-xs mb-2">(Wrong item, damaged, not as described)</p>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>No specific condition requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Book can be in any condition as received</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Photos of damage/issue must be provided</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">For Change of Mind Returns</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Book must be in original, unused condition</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>No writing, highlighting, or annotations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>No bent pages, creases, or spine damage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Original packaging/wrapping intact if applicable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>No signs of reading or use</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Rejection of Returns</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        Returns that don't meet the above conditions will be rejected and shipped back to you at your expense. Refunds will not be processed for rejected returns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 6: Refund Process */}
            <motion.section
              id="refund"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaMoneyBillWave className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Refund Processing</h2>
                  <p className="text-zinc-400 text-xs">How you get your money back</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Refund Amount</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaMoneyBillWave className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Book Price:</strong> Full amount refunded</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaMoneyBillWave className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Shipping Costs:</strong> Refunded only if seller's fault</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaMoneyBillWave className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Platform Fee:</strong> Non-refundable for buyer-initiated returns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaMoneyBillWave className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Payment Gateway Fee:</strong> Non-refundable</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Refund Timeline</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaClock className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Return Received:</strong> Item arrives at our warehouse</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaClock className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Inspection:</strong> 1-2 business days for quality check</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaClock className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Refund Initiated:</strong> Processed immediately after approval</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaClock className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Money in Account:</strong> 5-7 business days from initiation</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Refund Method</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCreditCard className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Original Payment Method:</strong> Refunded to card/UPI used for purchase</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCreditCard className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Bank Transfer:</strong> If original method unavailable (rare cases)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCreditCard className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Store Credit:</strong> Optional, instant credit for future purchases</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Section 7: Return Shipping Costs */}
            <motion.section
              id="shipping"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaTruck className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Return Shipping Costs</h2>
                  <p className="text-zinc-400 text-xs">Who pays for what</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                        <FaShieldAlt className="text-black text-sm" />
                      </div>
                      <h3 className="text-base font-bold text-white">Seller's Fault</h3>
                    </div>
                    <p className="text-zinc-400 text-xs mb-3">Wrong item, damaged, or not as described</p>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      <li className="flex items-start gap-2">
                        <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0" />
                        <span><strong>We cover</strong> return shipping completely</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0" />
                        <span>Prepaid shipping label provided</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0" />
                        <span>Or reimbursement of actual shipping costs</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                        <FaUserShield className="text-black text-sm" />
                      </div>
                      <h3 className="text-base font-bold text-white">Change of Mind</h3>
                    </div>
                    <p className="text-zinc-400 text-xs mb-3">You no longer want the item</p>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      <li className="flex items-start gap-2">
                        <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                        <span><strong>You cover</strong> return shipping costs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                        <span>Ship via courier of your choice</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                        <span>Deducted from refund if prepaid label used</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaInfoCircle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Shipping Cost Guidelines</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed mb-2">
                        Typical return shipping costs in India:
                      </p>
                      <ul className="space-y-1 text-yellow-200 text-xs">
                        <li className="flex items-start gap-1">
                          <span className="text-yellow-400">•</span>
                          <span>Local (same city): ₹40-₹60</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-yellow-400">•</span>
                          <span>Within state: ₹60-₹100</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-yellow-400">•</span>
                          <span>Interstate: ₹80-₹150</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 8: Non-Returnable Items */}
            <motion.section
              id="non-returnable"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaBan className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Non-Returnable Items</h2>
                  <p className="text-zinc-400 text-xs">Items we cannot accept back</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  The following items cannot be returned unless defective or not as described:
                </p>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Excluded Categories</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Digital Books:</strong> eBooks, PDFs, and digital downloads (instant delivery items)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Personalized Items:</strong> Books with custom inscriptions, name engravings, or personalizations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Final Sale Items:</strong> Books explicitly marked as "Final Sale" or "Non-Returnable"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Opened Sealed Items:</strong> Books sold in sealed packaging (exam prep, competitive tests) once opened</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Gift Cards:</strong> BookBalcony gift cards and vouchers (non-refundable)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Used/Read Books:</strong> Books showing clear signs of reading or use (unless quality issue)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Exceptions Apply</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        Even non-returnable items can be returned if they arrive damaged, defective, or significantly different from the description. Contact support for assistance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 9: Damaged/Defective Items */}
            <motion.section
              id="damaged"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaBoxOpen className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Damaged or Defective Items</h2>
                  <p className="text-zinc-400 text-xs">Special handling procedures</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">What to Do</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCamera className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Step 1:</strong> Take clear photos of the damage (packaging + book)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCamera className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Step 2:</strong> Take photos of the shipping label and box</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaEnvelope className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Step 3:</strong> Contact us within 48 hours of delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Step 4:</strong> Submit return request with photos attached</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Priority Processing</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Immediate approval (usually within 2-4 hours)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Free return shipping label provided</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Option for replacement or full refund (your choice)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>No deductions or fees applied</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaInfoCircle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Report Immediately</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        For damaged items, report within 48 hours of delivery for fastest resolution. Late reports may require additional verification.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 10: Exchanges */}
            <motion.section
              id="exchange"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaExchangeAlt className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Exchanges</h2>
                  <p className="text-zinc-400 text-xs">Swapping items</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  We currently do not offer direct exchanges. However, you can:
                </p>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Alternative Process</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Step 1:</strong> Return the unwanted book following our return process</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Step 2:</strong> Receive your refund (5-7 business days)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Step 3:</strong> Place a new order for the book you want</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaInfoCircle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Why No Direct Exchanges?</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        Books are sold by different sellers, making direct exchanges complicated. Our return and repurchase method ensures you get exactly what you want from any available seller.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 11: Order Cancellations */}
            <motion.section
              id="cancellation"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaTimesCircle className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Order Cancellations</h2>
                  <p className="text-zinc-400 text-xs">Before shipment</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Before Shipment</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Cancel anytime before the book is shipped</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Go to My Orders → Cancel Order button</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Full refund processed immediately</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Money returned within 5-7 business days</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">After Shipment</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Cannot cancel once shipped</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Must wait for delivery and initiate return</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Follow standard return process (7-day window)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Quick Action Required</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        Orders are typically processed and shipped within 1-2 business days. Cancel quickly if you change your mind!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 12: Contact Support */}
            <motion.section
              id="contact"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaEnvelope className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Need Help with Returns?</h2>
                  <p className="text-zinc-400 text-xs">Our team is here to assist</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  If you have questions about returns or need assistance, contact us:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                        <FaEnvelope className="text-lg text-black" />
                      </div>
                      <h3 className="text-sm font-bold text-white">Email Support</h3>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-1.5">
                        <FaEnvelope className="text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-zinc-400">Returns Team</p>
                          <a href="mailto:returns@bookbalcony.com" className="text-yellow-400 hover:text-yellow-300 font-semibold underline">
                            returns@bookbalcony.com
                          </a>
                        </div>
                      </div>
                      <p className="text-zinc-400 text-xs">Response within 24 hours</p>
                    </div>
                  </div>

                  <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                        <FaPhone className="text-lg text-black" />
                      </div>
                      <h3 className="text-sm font-bold text-white">Phone Support</h3>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-1.5">
                        <FaPhone className="text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-zinc-400">Customer Care</p>
                          <a href="tel:+911234567890" className="text-white font-semibold">
                            +91 123 456 7890
                          </a>
                        </div>
                      </div>
                      <p className="text-zinc-400 text-xs">Mon-Sat: 9 AM - 6 PM IST</p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="text-lg text-black" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-white mb-2">Return Address</h3>
                      <div className="text-zinc-300 text-xs leading-relaxed">
                        <p className="font-semibold text-white">BookBalcony Returns Department</p>
                        <p>RAO DevStudio</p>
                        <p>Nagpur, Maharashtra, India</p>
                        <p className="text-yellow-400 mt-2">*Specific address provided after return approval</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Final Policy Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-yellow-400/10 to-yellow-200/10 backdrop-blur-sm rounded-xl border-2 border-yellow-400/50 p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <FaHandHoldingUsd className="text-3xl text-yellow-400 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Your Satisfaction Guaranteed</h2>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    We're committed to making returns as easy as possible. If you're not satisfied with your purchase, we'll work with you to make it right. Your happiness is our priority at BookBalcony.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700">
                <p className="text-zinc-300 text-xs leading-relaxed">
                  Last updated: <strong className="text-white">{lastUpdated}</strong> | Effective: <strong className="text-white">{effectiveDate}</strong>
                </p>
              </div>
            </motion.div>
          </main>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40 group"
          >
            <FaArrowUp className="text-xl text-black group-hover:animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="bg-zinc-900 border-t border-zinc-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <FaHome />
              <span>Need assistance with returns?</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <a
                href="/"
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white font-semibold text-xs transition-all flex items-center gap-2"
              >
                <FaHome />
                <span>Back to Home</span>
              </a>
              <a
                href="mailto:returns@bookbalcony.com"
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-200 hover:from-yellow-500 hover:to-yellow-300 rounded-lg text-black font-semibold text-xs transition-all flex items-center gap-2"
              >
                <FaEnvelope />
                <span>Contact Returns Team</span>
              </a>
              <a
                href="/terms-of-service"
                className="px-4 py-2 bg-yellow-400/20 border border-yellow-400/50 hover:bg-yellow-400/30 rounded-lg text-yellow-400 font-semibold text-xs transition-all flex items-center gap-2"
              >
                <FaFileContract />
                <span>Terms of Service</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;