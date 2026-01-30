import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaShieldAlt,
  FaChartLine,
  FaLock,
  FaUserShield,
  FaDatabase,
  FaKey,
  FaFileContract,
  FaCookie,
  FaEnvelope,
  FaGlobe,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaHandshake,
  FaCertificate,
  FaBalanceScale,
  FaEye,
  FaTrash,
  FaDownload,
  FaBell,
  FaHistory,
  FaHome,
  FaArrowUp,
  FaPhone,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCloud,
  FaServer,
  FaFingerprint,
  FaUserFriends,
} from 'react-icons/fa';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [readProgress, setReadProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Track scroll progress and active section
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setReadProgress(Math.min(progress, 100));
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
    { icon: <FaShieldAlt />, label: "256-bit SSL", color: "text-yellow-400" },
    { icon: <FaCertificate />, label: "ISO 27001", color: "text-yellow-400" },
    { icon: <FaBalanceScale />, label: "GDPR", color: "text-yellow-400" },
    { icon: <FaHandshake />, label: "Never Sell", color: "text-yellow-400" },
  ];

  const tableOfContents = [
    { id: 'overview', icon: <FaInfoCircle />, title: 'Overview', description: 'Quick summary' },
    { id: 'collection', icon: <FaDatabase />, title: 'Data Collection', description: 'What we gather' },
    { id: 'usage', icon: <FaEye />, title: 'How We Use Data', description: 'Processing purposes' },
    { id: 'security', icon: <FaLock />, title: 'Security', description: 'Data protection' },
    { id: 'sharing', icon: <FaHandshake />, title: 'Data Sharing', description: 'Third parties' },
    { id: 'rights', icon: <FaBalanceScale />, title: 'Your Rights', description: 'Your control' },
    { id: 'cookies', icon: <FaCookie />, title: 'Cookies', description: 'Tracking tech' },
    { id: 'retention', icon: <FaHistory />, title: 'Retention', description: 'Storage period' },
    { id: 'children', icon: <FaUserFriends />, title: "Children's Privacy", description: 'Minor protection' },
    { id: 'international', icon: <FaGlobe />, title: 'International', description: 'Cross-border' },
    { id: 'changes', icon: <FaBell />, title: 'Updates', description: 'Policy changes' },
    { id: 'contact', icon: <FaEnvelope />, title: 'Contact', description: 'Get in touch' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900">
      {/* Hero Section - Compact */}
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
              <FaShieldAlt className="text-4xl text-black" />
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-4 leading-relaxed">
              Your privacy is our priority. Protecting your data with transparency.
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs mb-6">
              <div className="flex items-center gap-2 bg-zinc-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <FaHistory className="text-yellow-400" />
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
              <FaChevronDown className="animate-bounce" />
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

          {/* Main Content Area - Compact */}
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
                  <h2 className="text-2xl font-black text-white">Privacy at a Glance</h2>
                  <p className="text-zinc-400 text-xs">Your data protection, simplified</p>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                  At <strong className="text-white">BookBalcony</strong>, we believe privacy is a fundamental right. This Privacy Policy explains how we collect, use, protect, and share your personal information.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
                  {[
                    { icon: <FaLock />, text: "We never sell your personal data", color: "from-yellow-400 to-yellow-200" },
                    { icon: <FaUserShield />, text: "You have full control over your info", color: "from-yellow-400 to-yellow-200" },
                    { icon: <FaShieldAlt />, text: "Industry-standard encryption", color: "from-yellow-400 to-yellow-200" },
                    { icon: <FaTrash />, text: "Delete your account anytime", color: "from-yellow-400 to-yellow-200" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-2 bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
                      <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <span className="text-black text-sm">{item.icon}</span>
                      </div>
                      <p className="text-zinc-200 text-xs leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-400/10 border-l-4 border-yellow-400 rounded-r-lg p-4 mt-4">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Important Notice</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        By using BookBalcony, you consent to the data practices described in this policy. If you do not agree, please do not use our services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 2: Data Collection */}
            <motion.section
              id="collection"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaDatabase className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Information We Collect</h2>
                  <p className="text-zinc-400 text-xs">What data we gather</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  We collect only necessary information to provide exceptional service and improve your experience.
                </p>

                {/* Account Information */}
                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <div className="flex items-center gap-2 mb-3">
                    <FaUserShield className="text-lg text-yellow-400" />
                    <h3 className="text-base font-bold text-white">Account Information</h3>
                  </div>
                  <ul className="space-y-1.5 text-zinc-300 text-xs">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0 text-xs" />
                      <span><strong>Personal Details:</strong> Name, username, email, phone (optional)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0 text-xs" />
                      <span><strong>Authentication:</strong> Encrypted password, security questions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0 text-xs" />
                      <span><strong>Profile Data:</strong> Picture, bio, reading preferences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0 text-xs" />
                      <span><strong>Seller Verification:</strong> ID, business documents (sellers only)</span>
                    </li>
                  </ul>
                </div>

                {/* Transaction Data */}
                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <div className="flex items-center gap-2 mb-3">
                    <FaCreditCard className="text-lg text-yellow-400" />
                    <h3 className="text-base font-bold text-white">Transaction & Payment Data</h3>
                  </div>
                  <ul className="space-y-1.5 text-zinc-300 text-xs">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0 text-xs" />
                      <span><strong>Purchase History:</strong> Books bought/sold, prices, dates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0 text-xs" />
                      <span><strong>Payment Info:</strong> Via Razorpay (we don't store cards)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0 text-xs" />
                      <span><strong>Shipping:</strong> Delivery addresses, contact info</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0 text-xs" />
                      <span><strong>Wishlists & Carts:</strong> Saved items, preferences</span>
                    </li>
                  </ul>
                </div>

                {/* Usage Data */}
                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <div className="flex items-center gap-2 mb-3">
                    <FaServer className="text-lg text-yellow-400" />
                    <h3 className="text-base font-bold text-white">Usage & Technical Data</h3>
                  </div>
                  <ul className="space-y-1.5 text-zinc-300 text-xs">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0 text-xs" />
                      <span><strong>Device Info:</strong> Browser, OS, device model</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0 text-xs" />
                      <span><strong>Log Data:</strong> IP, access times, pages viewed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0 text-xs" />
                      <span><strong>Interaction:</strong> Clicks, scrolls, search queries</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0 text-xs" />
                      <span><strong>Location:</strong> Approximate (IP-based)</span>
                    </li>
                  </ul>
                </div>

                {/* Communication Data */}
                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <div className="flex items-center gap-2 mb-3">
                    <FaEnvelope className="text-lg text-yellow-400" />
                    <h3 className="text-base font-bold text-white">Communication & Social Data</h3>
                  </div>
                  <ul className="space-y-1.5 text-zinc-300 text-xs">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0 text-xs" />
                      <span><strong>Messages:</strong> Buyer-seller communication (encrypted)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0 text-xs" />
                      <span><strong>Reviews:</strong> Feedback on books and sellers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0 text-xs" />
                      <span><strong>Support:</strong> Tickets, chat logs, emails</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0 text-xs" />
                      <span><strong>Newsletter:</strong> Email preferences, status</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Section 3: How We Use Data */}
            <motion.section
              id="usage"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaEye className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">How We Use Your Information</h2>
                  <p className="text-zinc-400 text-xs">Transparency in processing</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                  We use your information exclusively to provide, improve, and protect our services.
                </p>

                {[
                  {
                    icon: <FaHandshake />,
                    title: "Service Delivery",
                    description: "Process transactions, manage accounts, deliver books, handle returns, and provide support.",
                    color: "from-yellow-400 to-yellow-200"
                  },
                  {
                    icon: <FaChartLine />,
                    title: "Platform Improvement",
                    description: "Analyze usage, fix bugs, develop features, and enhance user experience.",
                    color: "from-yellow-400 to-yellow-200"
                  },
                  {
                    icon: <FaBell />,
                    title: "Communications",
                    description: "Send order confirmations, updates, notifications, and offers (opt-out available).",
                    color: "from-yellow-400 to-yellow-200"
                  },
                  {
                    icon: <FaShieldAlt />,
                    title: "Security & Fraud Prevention",
                    description: "Detect fraud, enforce Terms, verify sellers, and maintain platform security.",
                    color: "from-yellow-400 to-yellow-200"
                  },
                  {
                    icon: <FaBalanceScale />,
                    title: "Legal Compliance",
                    description: "Comply with laws, respond to legal requests, protect rights, and resolve disputes.",
                    color: "from-yellow-400 to-yellow-200"
                  },
                  {
                    icon: <FaUserFriends />,
                    title: "Personalization",
                    description: "Provide book recommendations, tailor results, and customize your experience.",
                    color: "from-yellow-400 to-yellow-200"
                  }
                ].map((purpose, index) => (
                  <div key={index} className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-transparent hover:border-yellow-400 transition-all">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 bg-gradient-to-br ${purpose.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <span className="text-black text-base">{purpose.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white mb-1">{purpose.title}</h3>
                        <p className="text-zinc-300 text-xs leading-relaxed">{purpose.description}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4 mt-4">
                  <div className="flex items-start gap-2">
                    <FaInfoCircle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Data Minimization</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        We collect only necessary information for specific purposes. No excessive data retention.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 4: Security Measures */}
            <motion.section
              id="security"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaLock className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Data Security & Protection</h2>
                  <p className="text-zinc-400 text-xs">Industry-leading safeguards</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  We implement comprehensive security measures to protect your personal information.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      icon: <FaShieldAlt />,
                      title: "256-bit SSL/TLS",
                      description: "Bank-level encryption for all data transmission.",
                      color: "from-yellow-400 to-yellow-200"
                    },
                    {
                      icon: <FaKey />,
                      title: "Password Hashing",
                      description: "Bcrypt with salt. Never plain text storage.",
                      color: "from-yellow-400 to-yellow-200"
                    },
                    {
                      icon: <FaDatabase />,
                      title: "Secure Storage",
                      description: "Encrypted servers with restricted access.",
                      color: "from-yellow-400 to-yellow-200"
                    },
                    {
                      icon: <FaServer />,
                      title: "Access Controls",
                      description: "Role-based access with full audit logging.",
                      color: "from-yellow-400 to-yellow-200"
                    },
                    {
                      icon: <FaFingerprint />,
                      title: "Two-Factor Auth",
                      description: "Optional 2FA for enhanced security.",
                      color: "from-yellow-400 to-yellow-200"
                    },
                    {
                      icon: <FaCertificate />,
                      title: "Security Audits",
                      description: "Quarterly assessments and testing.",
                      color: "from-yellow-400 to-yellow-200"
                    }
                  ].map((measure, index) => (
                    <div key={index} className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50 hover:border-yellow-400/50 transition-all">
                      <div className={`w-9 h-9 bg-gradient-to-br ${measure.color} rounded-lg flex items-center justify-center mb-3`}>
                        <span className="text-black text-lg">{measure.icon}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1">{measure.title}</h3>
                      <p className="text-zinc-300 text-xs leading-relaxed">{measure.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-red-500/10 border-l-4 border-red-500 rounded-r-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaBell className="text-red-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-red-300 mb-1">Breach Notification</h3>
                      <p className="text-red-200 text-xs leading-relaxed">
                        In case of a data breach, we'll notify you within 72 hours via email with full details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 5: Data Sharing */}
            <motion.section
              id="sharing"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaHandshake className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Data Sharing & Third Parties</h2>
                  <p className="text-zinc-400 text-xs">When and with whom</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-yellow-400/10 border-l-4 border-yellow-400 rounded-r-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaShieldAlt className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Our Commitment</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        <strong>We do not sell, rent, or trade your personal information.</strong> We only share with trusted partners when necessary.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-zinc-300 text-sm leading-relaxed">
                  We may share your information with these categories of third parties:
                </p>

                {[
                  {
                    name: "Payment Processors",
                    logo: "💳",
                    partner: "Razorpay",
                    purpose: "Secure payment processing",
                    dataShared: "Payment details, transaction amounts",
                    protection: "PCI DSS Level 1 Certified",
                  },
                  {
                    name: "Shipping Partners",
                    logo: "📦",
                    partner: "India Post, Delhivery",
                    purpose: "Book delivery and fulfillment",
                    dataShared: "Name, address, phone, order details",
                    protection: "Data sharing agreement",
                  },
                  {
                    name: "Cloud Infrastructure",
                    logo: "☁️",
                    partner: "AWS / Google Cloud",
                    purpose: "Secure hosting and storage",
                    dataShared: "All platform data (encrypted)",
                    protection: "SOC 2 Type II, ISO 27001",
                  },
                  {
                    name: "Analytics Services",
                    logo: "📊",
                    partner: "Google Analytics",
                    purpose: "Usage analysis and improvement",
                    dataShared: "Anonymized usage data",
                    protection: "GDPR compliant",
                  },
                ].map((partner, index) => (
                  <div key={index} className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50 hover:border-yellow-400/50 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{partner.logo}</span>
                        <div>
                          <h3 className="text-sm font-bold text-white">{partner.name}</h3>
                          <p className="text-yellow-400 text-xs">{partner.partner}</p>
                        </div>
                      </div>
                      <div className="bg-yellow-400/20 px-2 py-0.5 rounded-full">
                        <span className="text-yellow-400 text-[10px] font-semibold">Trusted</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-zinc-400 font-semibold">Purpose: </span>
                        <span className="text-zinc-200">{partner.purpose}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 font-semibold">Data: </span>
                        <span className="text-zinc-200">{partner.dataShared}</span>
                      </div>
                      <div className="bg-zinc-900/50 rounded p-2 border border-zinc-700/50">
                        <span className="text-yellow-400 font-semibold">Security: </span>
                        <span className="text-yellow-300">{partner.protection}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Legal Disclosures</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed mb-2">
                        We may disclose your information if required by law or to:
                      </p>
                      <ul className="space-y-0.5 text-yellow-200 text-xs">
                        <li className="flex items-start gap-1">
                          <span className="text-yellow-400">•</span>
                          <span>Comply with legal obligations</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-yellow-400">•</span>
                          <span>Protect rights, property, or safety</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-yellow-400">•</span>
                          <span>Prevent fraud or security issues</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 6: Your Rights */}
            <motion.section
              id="rights"
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
                  <h2 className="text-2xl font-black text-white">Your Privacy Rights</h2>
                  <p className="text-zinc-400 text-xs">Control over your data</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                  You have comprehensive rights regarding your personal information.
                </p>

                {[
                  {
                    icon: <FaEye />,
                    title: "Right to Access",
                    description: "Request a complete copy of all data we hold about you.",
                    action: "Settings → Privacy → Export Data",
                    color: "from-yellow-400 to-yellow-200"
                  },
                  {
                    icon: <FaDownload />,
                    title: "Data Portability",
                    description: "Receive your data in a portable, machine-readable format.",
                    action: "Settings → Privacy → Download",
                    color: "from-yellow-400 to-yellow-200"
                  },
                  {
                    icon: <FaFileContract />,
                    title: "Rectification",
                    description: "Correct any inaccurate or incomplete information.",
                    action: "Profile → Edit Information",
                    color: "from-yellow-400 to-yellow-200"
                  },
                  {
                    icon: <FaTrash />,
                    title: "Erasure (Right to be Forgotten)",
                    description: "Request permanent deletion of your account and data.",
                    action: "Settings → Account → Delete",
                    color: "from-yellow-400 to-yellow-200"
                  },
                  {
                    icon: <FaBell />,
                    title: "Opt-Out",
                    description: "Unsubscribe from marketing communications anytime.",
                    action: "Settings → Notifications",
                    color: "from-yellow-400 to-yellow-200"
                  },
                  {
                    icon: <FaExclamationTriangle />,
                    title: "Object to Processing",
                    description: "Object to data use for marketing or profiling.",
                    action: "Contact privacy@bookbalcony.com",
                    color: "from-yellow-400 to-yellow-200"
                  },
                ].map((right, index) => (
                  <div key={index} className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-transparent hover:border-yellow-400 transition-all">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 bg-gradient-to-br ${right.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <span className="text-black text-base">{right.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white mb-1">{right.title}</h3>
                        <p className="text-zinc-300 text-xs leading-relaxed mb-2">{right.description}</p>
                        <div className="bg-zinc-900/50 rounded p-2 border border-zinc-700/50">
                          <p className="text-[10px] text-yellow-400">
                            <strong>How:</strong> <span className="text-zinc-300">{right.action}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-yellow-400/10 border-l-4 border-yellow-400 rounded-r-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaInfoCircle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Response Timeline</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        We respond within <strong>30 days</strong>. Complex requests may take 60 days (we'll notify you).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 7: Cookies */}
            <motion.section
              id="cookies"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaCookie className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Cookies & Tracking</h2>
                  <p className="text-zinc-400 text-xs">How we use cookies</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  We use cookies to enhance your experience and analyze usage.
                </p>

                {[
                  {
                    type: "Essential Cookies",
                    icon: "🔒",
                    purpose: "Required for basic functionality and security",
                    examples: "Session management, authentication, security",
                    control: "Cannot be disabled (necessary)",
                    canDisable: false,
                    color: "border-yellow-400"
                  },
                  {
                    type: "Functional Cookies",
                    icon: "⚙️",
                    purpose: "Remember preferences and settings",
                    examples: "Language, theme, saved filters",
                    control: "Can be disabled in Cookie Preferences",
                    canDisable: true,
                    color: "border-yellow-400"
                  },
                  {
                    type: "Analytics Cookies",
                    icon: "📊",
                    purpose: "Understand how you use our website",
                    examples: "Page views, click patterns, time spent",
                    control: "Can be disabled in Cookie Preferences",
                    canDisable: true,
                    color: "border-yellow-400"
                  },
                  {
                    type: "Marketing Cookies",
                    icon: "🎯",
                    purpose: "Show relevant advertisements",
                    examples: "Ad personalization, retargeting",
                    control: "Can be disabled in Cookie Preferences",
                    canDisable: true,
                    color: "border-yellow-400"
                  }
                ].map((cookie, index) => (
                  <div key={index} className={`bg-zinc-800/30 rounded-lg p-4 border-l-4 ${cookie.color}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{cookie.icon}</span>
                        <div>
                          <h3 className="text-sm font-bold text-white">{cookie.type}</h3>
                          <p className="text-zinc-400 text-xs">{cookie.purpose}</p>
                        </div>
                      </div>
                      {cookie.canDisable ? (
                        <span className="bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap">
                          Optional
                        </span>
                      ) : (
                        <span className="bg-yellow-400/30 text-yellow-300 px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap">
                          Required
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-zinc-400 font-semibold">Examples: </span>
                        <span className="text-zinc-200">{cookie.examples}</span>
                      </div>
                      <div className="bg-zinc-900/50 rounded p-2 border border-zinc-700/50">
                        <span className="text-yellow-400 font-semibold">Control: </span>
                        <span className="text-zinc-300">{cookie.control}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaInfoCircle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Managing Cookies</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed mb-2">
                        Manage preferences anytime. Note: Disabling may limit functionality.
                      </p>
                      <a
                        href="/cookie-preferences"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 rounded-lg text-black font-semibold text-xs transition-all"
                      >
                        <FaCookie />
                        <span>Cookie Preferences</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 8: Data Retention */}
            <motion.section
              id="retention"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaHistory className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Data Retention Policy</h2>
                  <p className="text-zinc-400 text-xs">How long we keep data</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                  We retain your data only as long as necessary for our services and legal obligations.
                </p>

                {[
                  {
                    category: "Active Accounts",
                    period: "Indefinitely (while active)",
                    rationale: "To provide ongoing services and maintain history",
                    icon: <FaUserShield />
                  },
                  {
                    category: "Deleted Accounts",
                    period: "30 days from deletion",
                    rationale: "Grace period for account recovery",
                    icon: <FaTrash />
                  },
                  {
                    category: "Transaction Records",
                    period: "7 years",
                    rationale: "Legal requirement for financial records (India)",
                    icon: <FaCreditCard />
                  },
                  {
                    category: "Communication Logs",
                    period: "3 years",
                    rationale: "Dispute resolution and support quality",
                    icon: <FaEnvelope />
                  },
                  {
                    category: "Marketing Data",
                    period: "Until opt-out or 2 years",
                    rationale: "Respect preferences and anti-spam laws",
                    icon: <FaBell />
                  },
                  {
                    category: "Analytics Data",
                    period: "26 months",
                    rationale: "Long-term trends while limiting storage",
                    icon: <FaDatabase />
                  },
                ].map((item, index) => (
                  <div key={index} className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="text-lg text-yellow-400">{item.icon}</div>
                        <h3 className="text-sm font-bold text-white">{item.category}</h3>
                      </div>
                      <span className="bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-zinc-300 text-xs leading-relaxed">{item.rationale}</p>
                  </div>
                ))}

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaInfoCircle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">After Retention Period</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed">
                        Once periods expire, we securely delete or anonymize your data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 9: Children's Privacy */}
            <motion.section
              id="children"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaUserFriends className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Children's Privacy</h2>
                  <p className="text-zinc-400 text-xs">Safeguarding minors</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-yellow-400/10 border-l-4 border-yellow-400 rounded-r-lg p-4">
                  <h3 className="text-sm font-bold text-yellow-300 mb-2">Child Safety Commitment</h3>
                  <p className="text-yellow-200 text-xs leading-relaxed mb-3">
                    BookBalcony is committed to protecting children's privacy and safety.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-1.5">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0 text-xs" />
                      <p className="text-yellow-200 text-xs">
                        <strong>Age Requirement:</strong> Not directed to children under 13. We don't knowingly collect their data.
                      </p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0 text-xs" />
                      <p className="text-yellow-200 text-xs">
                        <strong>Parental Consent:</strong> Users 13-18 should use with parental supervision.
                      </p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0 text-xs" />
                      <p className="text-yellow-200 text-xs">
                        <strong>Discovery Protocol:</strong> If we find under-13 data, we delete it within 30 days.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                  <h3 className="text-sm font-bold text-white mb-2">For Parents & Guardians</h3>
                  <p className="text-zinc-300 text-xs leading-relaxed mb-3">
                    If your child provided information, contact us immediately:
                  </p>
                  <a
                    href="mailto:privacy@bookbalcony.com"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 rounded-lg text-black font-semibold text-xs transition-all"
                  >
                    <FaEnvelope />
                    <span>privacy@bookbalcony.com</span>
                  </a>
                </div>
              </div>
            </motion.section>

            {/* Section 10: International Transfers */}
            <motion.section
              id="international"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaGlobe className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">International Data Transfers</h2>
                  <p className="text-zinc-400 text-xs">Cross-border protection</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  We may transfer your data internationally with appropriate safeguards.
                </p>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-sm font-bold text-white mb-3">Transfer Safeguards</h3>
                  <div className="space-y-2">
                    {[
                      "Standard Contractual Clauses (SCCs)",
                      "Adequacy decisions by authorities",
                      "Binding Corporate Rules (BCRs)",
                      "Your explicit consent when required",
                      "Certification schemes (Privacy Shield)"
                    ].map((safeguard, index) => (
                      <div key={index} className="flex items-start gap-1.5">
                        <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0 text-xs" />
                        <span className="text-zinc-200 text-xs">{safeguard}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                  <h3 className="text-sm font-bold text-white mb-2">Third-Country Transfers</h3>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {[
                      { country: "United States", flag: "🇺🇸" },
                      { country: "European Union", flag: "🇪🇺" },
                      { country: "Singapore", flag: "🇸🇬" },
                      { country: "United Kingdom", flag: "🇬🇧" }
                    ].map((location, index) => (
                      <div key={index} className="bg-zinc-900/50 rounded p-2 border border-zinc-700/50 text-center">
                        <div className="text-2xl mb-1">{location.flag}</div>
                        <p className="text-zinc-200 text-[10px] font-semibold">{location.country}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 11: Policy Changes */}
            <motion.section
              id="changes"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaBell className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Changes to This Policy</h2>
                  <p className="text-zinc-400 text-xs">How we handle updates</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  We may update this policy periodically. We'll keep you informed about material changes.
                </p>

                <div className="bg-zinc-800/30 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h3 className="text-sm font-bold text-white mb-3">Notification Methods</h3>
                  <div className="space-y-2">
                    {[
                      { icon: <FaEnvelope />, text: "Email notification 30 days before changes" },
                      { icon: <FaBell />, text: "Prominent banner on website/app" },
                      { icon: <FaHistory />, text: "Updated 'Last Updated' date" },
                      { icon: <FaFileContract />, text: "Archive of previous versions" }
                    ].map((method, index) => (
                      <div key={index} className="flex items-start gap-2 bg-zinc-900/50 rounded p-2">
                        <div className="text-yellow-400 text-base flex-shrink-0 mt-0.5">{method.icon}</div>
                        <p className="text-zinc-200 text-xs">{method.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                  <h3 className="text-sm font-bold text-white mb-2">Version History</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-zinc-900/50 rounded">
                      <div>
                        <p className="text-white font-semibold text-xs">Version 2.0</p>
                        <p className="text-zinc-400 text-[10px]">Current - Enhanced protection</p>
                      </div>
                      <span className="text-yellow-400 text-xs font-semibold">{lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 12: Contact Us */}
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
                  <h2 className="text-2xl font-black text-white">Contact Us</h2>
                  <p className="text-zinc-400 text-xs">We're here to help</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Questions or concerns? We're committed to addressing them promptly.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Data Protection Officer */}
                  <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                        <FaUserShield className="text-lg text-black" />
                      </div>
                      <h3 className="text-sm font-bold text-white">Data Protection Officer</h3>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-1.5">
                        <FaUserShield className="text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-zinc-400">Name</p>
                          <p className="text-white font-semibold">Roshan Avatirak</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <FaEnvelope className="text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-zinc-400">Email</p>
                          <a href="mailto:privacy@bookbalcony.com" className="text-yellow-400 hover:text-yellow-300 font-semibold underline">
                            privacy@bookbalcony.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* General Inquiries */}
                  <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                        <FaEnvelope className="text-lg text-black" />
                      </div>
                      <h3 className="text-sm font-bold text-white">General Inquiries</h3>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-1.5">
                        <FaEnvelope className="text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-zinc-400">Email</p>
                          <a href="mailto:support@bookbalcony.com" className="text-yellow-400 hover:text-yellow-300 font-semibold underline">
                            support@bookbalcony.com
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <FaPhone className="text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-zinc-400">Phone</p>
                          <a href="tel:+911234567890" className="text-white font-semibold">
                            +91 123 456 7890
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registered Office */}
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

                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaInfoCircle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300 mb-1">Privacy Request Portal</h3>
                      <p className="text-yellow-200 text-xs leading-relaxed mb-2">
                        For faster processing of data requests, use our Privacy Request Portal.
                      </p>
                      <a
                        href="/profile/settings?tab=privacy"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 rounded-lg text-black font-semibold text-xs transition-all"
                      >
                        <FaUserShield />
                        <span>Go to Privacy Settings</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Final Acknowledgment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-yellow-400/10 to-yellow-200/10 backdrop-blur-sm rounded-xl border-2 border-yellow-400/50 p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <FaFileContract className="text-3xl text-yellow-400 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Acknowledgment & Acceptance</h2>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    By using BookBalcony, you acknowledge that you have read and agree to this Privacy Policy. If you disagree, please discontinue use.
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
              <span>Need help?</span>
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
                href="mailto:privacy@bookbalcony.com"
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-200 hover:from-yellow-500 hover:to-yellow-300 rounded-lg text-black font-semibold text-xs transition-all flex items-center gap-2"
              >
                <FaEnvelope />
                <span>Contact Privacy Team</span>
              </a>
              <a
                href="/profile/settings?tab=privacy"
                className="px-4 py-2 bg-yellow-400/20 border border-yellow-400/50 hover:bg-yellow-400/30 rounded-lg text-yellow-400 font-semibold text-xs transition-all flex items-center gap-2"
              >
                <FaUserShield />
                <span>Privacy Settings</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;