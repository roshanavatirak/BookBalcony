import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFileContract,
  FaShieldAlt,
  FaUserShield,
  FaGavel,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaHandshake,
  FaBook,
  FaShoppingCart,
  FaMoneyBillWave,
  FaTruck,
  FaUndo,
  FaBan,
  FaUserTie,
  FaBalanceScale,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaInfoCircle,
  FaArrowUp,
  FaHome,
  FaCopyright,
  FaLock,
  FaExchangeAlt,
  FaClipboardList,
  FaUserClock,
} from 'react-icons/fa';

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState('introduction');
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
    { icon: <FaGavel />, label: "Legally Binding", color: "text-yellow-400" },
    { icon: <FaShieldAlt />, label: "User Protected", color: "text-yellow-400" },
    { icon: <FaBalanceScale />, label: "Fair Terms", color: "text-yellow-400" },
    { icon: <FaHandshake />, label: "Transparent", color: "text-yellow-400" },
  ];

  const tableOfContents = [
    { id: 'introduction', icon: <FaInfoCircle />, title: 'Introduction', description: 'Overview & acceptance' },
    { id: 'definitions', icon: <FaBook />, title: 'Definitions', description: 'Key terms' },
    { id: 'eligibility', icon: <FaUserShield />, title: 'Eligibility', description: 'Who can use' },
    { id: 'account', icon: <FaUserClock />, title: 'Account Rules', description: 'Registration & use' },
    { id: 'buying', icon: <FaShoppingCart />, title: 'Buying Books', description: 'Purchase terms' },
    { id: 'selling', icon: <FaUserTie />, title: 'Selling Books', description: 'Seller obligations' },
    { id: 'payment', icon: <FaMoneyBillWave />, title: 'Payment', description: 'Pricing & fees' },
    { id: 'shipping', icon: <FaTruck />, title: 'Shipping', description: 'Delivery terms' },
    { id: 'returns', icon: <FaUndo />, title: 'Returns', description: 'Refund policy' },
    { id: 'prohibited', icon: <FaBan />, title: 'Prohibited', description: 'Banned conduct' },
    { id: 'intellectual', icon: <FaCopyright />, title: 'IP Rights', description: 'Content ownership' },
    { id: 'liability', icon: <FaBalanceScale />, title: 'Liability', description: 'Legal limits' },
    { id: 'termination', icon: <FaTimesCircle />, title: 'Termination', description: 'Account closure' },
    { id: 'disputes', icon: <FaGavel />, title: 'Disputes', description: 'Resolution process' },
    { id: 'changes', icon: <FaClipboardList />, title: 'Changes', description: 'Terms updates' },
    { id: 'contact', icon: <FaEnvelope />, title: 'Contact', description: 'Get in touch' },
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
              <FaFileContract className="text-4xl text-black" />
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Terms of Service
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-4 leading-relaxed">
              Clear rules for a fair and safe marketplace. Please read carefully.
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
              href="#introduction"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-200 text-black hover:from-yellow-500 hover:to-yellow-300 rounded-lg font-bold text-sm shadow-2xl hover:shadow-yellow-400/50 transition-all transform hover:scale-105"
            >
              <span>Read Terms</span>
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
            {/* Section 1: Introduction */}
            <motion.section
              id="introduction"
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
                  <h2 className="text-2xl font-black text-white">Introduction & Acceptance</h2>
                  <p className="text-zinc-400 text-xs">Agreement to these terms</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Welcome to <strong className="text-white">BookBalcony</strong>. These Terms of Service ("Terms") govern your access to and use of our platform, services, and features. By creating an account or using BookBalcony, you agree to be bound by these Terms.
                </p>

                <div className="bg-yellow-400/10 border-l-4 border-yellow-400 rounded-r-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Legal Agreement</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        These Terms constitute a legally binding agreement between you and BookBalcony. If you do not agree to these Terms, you must not use our services.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { icon: <FaCheckCircle />, text: "You accept all terms by using BookBalcony" },
                    { icon: <FaCheckCircle />, text: "Terms apply to all users: buyers & sellers" },
                    { icon: <FaCheckCircle />, text: "We may update these terms periodically" },
                    { icon: <FaCheckCircle />, text: "Continued use means acceptance of changes" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-2 bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-black text-sm">{item.icon}</span>
                      </div>
                      <p className="text-zinc-200 text-xs leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Section 2: Definitions */}
            <motion.section
              id="definitions"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaBook className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Key Definitions</h2>
                  <p className="text-zinc-400 text-xs">Important terms explained</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                  For clarity, the following terms have specific meanings in these Terms:
                </p>

                {[
                  {
                    term: "Platform",
                    definition: "The BookBalcony website, mobile applications, and all related services and features."
                  },
                  {
                    term: "User",
                    definition: "Any person who accesses or uses the Platform, including buyers and sellers."
                  },
                  {
                    term: "Seller",
                    definition: "A verified User who lists books for sale on the Platform."
                  },
                  {
                    term: "Buyer",
                    definition: "A User who purchases books from Sellers through the Platform."
                  },
                  {
                    term: "Listing",
                    definition: "A book or item posted for sale by a Seller on the Platform."
                  },
                  {
                    term: "Transaction",
                    definition: "The purchase and sale of a book between a Buyer and Seller facilitated by the Platform."
                  },
                  {
                    term: "Content",
                    definition: "All text, images, reviews, listings, and other materials posted on the Platform."
                  },
                  {
                    term: "Services",
                    definition: "All features, tools, and functionality provided by BookBalcony."
                  },
                ].map((item, index) => (
                  <div key={index} className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                    <h3 className="text-sm font-bold text-white mb-1">"{item.term}"</h3>
                    <p className="text-zinc-300 text-xs leading-relaxed">{item.definition}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Section 3: Eligibility */}
            <motion.section
              id="eligibility"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaUserShield className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Eligibility Requirements</h2>
                  <p className="text-zinc-400 text-xs">Who can use BookBalcony</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  To use BookBalcony, you must meet the following requirements:
                </p>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Age Requirements</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Minimum Age:</strong> You must be at least 18 years old to create an account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Minors (13-17):</strong> May use with parental consent and supervision</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Under 13:</strong> Not permitted to use the Platform under any circumstances</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Legal Capacity</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>You have the legal capacity to enter into binding contracts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>You are not prohibited by law from using our services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>You have not been previously banned from BookBalcony</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaInfoCircle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Geographic Restrictions</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        BookBalcony is currently available only in India. Users from other countries may not be able to access all features.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 4: Account Rules */}
            <motion.section
              id="account"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaUserClock className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Account Registration & Use</h2>
                  <p className="text-zinc-400 text-xs">Your responsibilities</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Account Creation</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Provide accurate, complete, and current information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Maintain and update your information as needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>One account per person; multiple accounts prohibited</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Account is non-transferable and cannot be sold</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Account Security</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaLock className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Keep your password secure and confidential</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaLock className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Never share your login credentials with anyone</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaLock className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Notify us immediately of any unauthorized access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaLock className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>You are responsible for all activity on your account</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Section 5: Buying Books */}
            <motion.section
              id="buying"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaShoppingCart className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Buying Books</h2>
                  <p className="text-zinc-400 text-xs">Purchase terms for buyers</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  When you purchase books on BookBalcony, you agree to the following:
                </p>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Purchase Process</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>All purchases are binding contracts between you and the Seller</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Prices are set by Sellers and may vary</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>You must provide accurate shipping information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>BookBalcony facilitates transactions but is not the seller</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Important Notice</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        By placing an order, you make an offer to purchase. The contract is formed when the Seller accepts your order and we send you a confirmation email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 6: Selling Books */}
            <motion.section
              id="selling"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaUserTie className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Selling Books</h2>
                  <p className="text-zinc-400 text-xs">Seller obligations & rules</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Seller Verification</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Must apply and be approved as a verified seller</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Provide valid identification and business documentation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Maintain accurate seller profile information</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Listing Requirements</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Provide accurate book descriptions, conditions, and images</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Only list books you legally own and have right to sell</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>No counterfeit, pirated, or illegally reproduced books</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Set fair and reasonable prices</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Seller Obligations</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Ship orders promptly within stated timeframes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Package items securely to prevent damage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Respond to buyer inquiries within 24 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Honor our return and refund policies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Section 7: Payment Terms */}
            <motion.section
              id="payment"
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
                  <h2 className="text-2xl font-black text-white">Payment Terms</h2>
                  <p className="text-zinc-400 text-xs">Pricing, fees & payments</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Payment Processing</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>All payments processed securely through Razorpay</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>We do not store credit card information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Prices displayed in Indian Rupees (₹)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Payment must be received before order processing</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Platform Fees</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Commission:</strong> BookBalcony charges sellers 10% commission on each sale</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Payment Gateway Fees:</strong> 2% + ₹2 per transaction (borne by buyer)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Shipping Costs:</strong> Calculated based on weight and destination</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaInfoCircle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Taxes & Compliance</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        Sellers are responsible for applicable taxes (GST, income tax, etc.). BookBalcony may be required to report transaction information to tax authorities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 8: Shipping & Delivery */}
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
                  <h2 className="text-2xl font-black text-white">Shipping & Delivery</h2>
                  <p className="text-zinc-400 text-xs">Delivery terms & timelines</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Delivery Timeframes</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaClock className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Processing Time:</strong> 1-2 business days after payment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaClock className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Standard Shipping:</strong> 5-7 business days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaClock className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Express Shipping:</strong> 2-3 business days (additional cost)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaClock className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Delays may occur due to weather, holidays, or courier issues</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Shipping Partners</h3>
                  <p className="text-zinc-300 text-xs leading-relaxed mb-3">
                    We partner with trusted courier services including:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {['India Post', 'Delhivery', 'Blue Dart'].map((partner, index) => (
                      <div key={index} className="bg-zinc-900/50 rounded p-2 border border-zinc-700/50 text-center">
                        <p className="text-zinc-200 text-xs font-semibold">{partner}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 9: Returns & Refunds */}
            <motion.section
              id="returns"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaUndo className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Returns & Refunds</h2>
                  <p className="text-zinc-400 text-xs">Our refund policy</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">7-Day Return Policy</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Return within 7 days of delivery if item is not as described</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Books must be in original condition with no damage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Return shipping costs borne by seller if item defective</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Buyer pays return shipping for change-of-mind returns</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Refund Process</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Refunds processed within 5-7 business days after return received</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Refunded to original payment method</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Platform fees non-refundable on buyer-initiated returns</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Non-Returnable Items</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        Digital books, personalized items, and items marked "Final Sale" cannot be returned unless defective or not as described.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 10: Prohibited Conduct */}
            <motion.section
              id="prohibited"
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
                  <h2 className="text-2xl font-black text-white">Prohibited Conduct</h2>
                  <p className="text-zinc-400 text-xs">Banned activities & violations</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  The following activities are strictly prohibited on BookBalcony:
                </p>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Illegal Activities</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Selling counterfeit, pirated, or stolen books</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Copyright infringement or intellectual property violations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Money laundering or fraudulent transactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Tax evasion or providing false tax information</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Abusive Behavior</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Harassment, threats, or abusive language toward other users</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Fake reviews or rating manipulation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Creating multiple accounts to circumvent bans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Spam, phishing, or malicious content</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Platform Misuse</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Scraping, data mining, or unauthorized automated access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Attempting to hack, disrupt, or compromise security</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Reverse engineering or copying platform features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaTimesCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Circumventing payment systems or platform fees</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Section 11: Intellectual Property */}
            <motion.section
              id="intellectual"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaCopyright className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Intellectual Property Rights</h2>
                  <p className="text-zinc-400 text-xs">Content ownership & usage</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Platform Content</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>BookBalcony owns all platform design, features, and branding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Logo, trademarks, and name are protected intellectual property</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>You may not use our branding without written permission</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">User-Generated Content</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>You retain ownership of content you post (reviews, listings, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>You grant us a license to display and use your content on the platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>You must have rights to all content you upload</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Section 12: Limitation of Liability */}
            <motion.section
              id="liability"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaBalanceScale className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Limitation of Liability</h2>
                  <p className="text-zinc-400 text-xs">Legal disclaimers</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-yellow-400/10 border-l-4 border-yellow-400 rounded-r-lg p-4">
                  <p className="text-yellow-200 text-xs leading-relaxed">
                    <strong className="text-yellow-300">AS-IS SERVICE:</strong> BookBalcony is provided "as is" without warranties of any kind. We do not guarantee uninterrupted, error-free, or secure service.
                  </p>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Liability Limitations</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>BookBalcony is a marketplace platform, not a party to buyer-seller transactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>We are not liable for quality, condition, or legality of listed books</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Maximum liability limited to fees paid in the last 12 months</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Not liable for indirect, incidental, or consequential damages</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Section 13: Account Termination */}
            <motion.section
              id="termination"
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
                  <h2 className="text-2xl font-black text-white">Account Termination</h2>
                  <p className="text-zinc-400 text-xs">Suspension & closure</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Your Right to Terminate</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>You may close your account at any time from settings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Complete all pending transactions before closing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Some data retained for legal/accounting requirements</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Our Right to Terminate</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>We may suspend or terminate accounts for Terms violations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>No refund of fees for terminated accounts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Immediate termination for serious violations (fraud, illegal activity)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Section 14: Dispute Resolution */}
            <motion.section
              id="disputes"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaGavel className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Dispute Resolution</h2>
                  <p className="text-zinc-400 text-xs">Handling conflicts</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Governing Law</h3>
                  <p className="text-zinc-300 text-xs leading-relaxed mb-3">
                    These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Nagpur, Maharashtra, India.
                  </p>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Resolution Process</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Step 1:</strong> Contact our support team for mediation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Step 2:</strong> Attempt good-faith negotiation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Step 3:</strong> Arbitration or legal proceedings if unresolved</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Section 15: Changes to Terms */}
            <motion.section
              id="changes"
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
                  <h2 className="text-2xl font-black text-white">Changes to These Terms</h2>
                  <p className="text-zinc-400 text-xs">Updates & modifications</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  We may update these Terms from time to time. We will notify you of material changes.
                </p>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-base font-bold text-white mb-3">Notification of Changes</h3>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Email notification 30 days before material changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Prominent notice on platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Updated "Last Modified" date at top of page</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Continued Use = Acceptance</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        Your continued use of BookBalcony after changes take effect constitutes acceptance of the new Terms. If you disagree, you must stop using the platform.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 16: Contact Information */}
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
                  <h2 className="text-2xl font-black text-white">Contact Information</h2>
                  <p className="text-zinc-400 text-xs">Questions about these terms?</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  If you have questions about these Terms of Service, please contact us:
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
                          <p className="text-zinc-400">General Inquiries</p>
                          <a href="mailto:legal@bookbalcony.com" className="text-yellow-400 hover:text-yellow-300 font-semibold underline">
                            legal@bookbalcony.com
                          </a>
                        </div>
                      </div>
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
                          <p className="text-zinc-400">Customer Service</p>
                          <a href="tel:+911234567890" className="text-white font-semibold">
                            +91 123 456 7890
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="text-lg text-black" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-white mb-2">Registered Office</h3>
                      <div className="text-zinc-300 text-xs leading-relaxed">
                        <p className="font-semibold text-white">BookBalcony</p>
                        <p>RAO DevStudio</p>
                        <p>Nagpur, Maharashtra, India</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Final Acceptance Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-yellow-400/10 to-yellow-200/10 backdrop-blur-sm rounded-xl border-2 border-yellow-400/50 p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <FaFileContract className="text-3xl text-yellow-400 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Acceptance of Terms</h2>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    By using BookBalcony, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. These Terms constitute a legal agreement between you and BookBalcony.
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
              <span>Have questions?</span>
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
                href="mailto:legal@bookbalcony.com"
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-200 hover:from-yellow-500 hover:to-yellow-300 rounded-lg text-black font-semibold text-xs transition-all flex items-center gap-2"
              >
                <FaEnvelope />
                <span>Contact Legal Team</span>
              </a>
              <a
                href="/privacy-policy"
                className="px-4 py-2 bg-yellow-400/20 border border-yellow-400/50 hover:bg-yellow-400/30 rounded-lg text-yellow-400 font-semibold text-xs transition-all flex items-center gap-2"
              >
                <FaShieldAlt />
                <span>Privacy Policy</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;