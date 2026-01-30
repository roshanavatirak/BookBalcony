import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHeadset,
  FaEnvelope,
  FaPhone,
  FaComments,
  FaQuestionCircle,
  FaSearch,
  FaShoppingCart,
  FaTruck,
  FaUndo,
  FaCreditCard,
  FaUserCircle,
  FaBook,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaArrowUp,
  FaHome,
  FaClock,
  FaMapMarkerAlt,
  FaFileContract,
  FaLightbulb,
  FaChevronDown,
  FaChevronRight,
  FaWhatsapp,
  FaTelegramPlane,
  FaFacebookMessenger,
  FaRobot,
  FaUserTie,
  FaTools,
  FaBug,
  FaShieldAlt,
} from 'react-icons/fa';

const Support = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

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

  const trustIndicators = [
    { icon: <FaHeadset />, label: "24/7 Support", color: "text-yellow-400" },
    { icon: <FaClock />, label: "Quick Response", color: "text-yellow-400" },
    { icon: <FaShieldAlt />, label: "Expert Team", color: "text-yellow-400" },
    { icon: <FaCheckCircle />, label: "Issue Resolution", color: "text-yellow-400" },
  ];

  const tableOfContents = [
    { id: 'overview', icon: <FaInfoCircle />, title: 'Overview', description: 'Get help fast' },
    { id: 'contact', icon: <FaHeadset />, title: 'Contact Us', description: 'Reach our team' },
    { id: 'faqs', icon: <FaQuestionCircle />, title: 'FAQs', description: 'Common questions' },
    { id: 'ordering', icon: <FaShoppingCart />, title: 'Ordering', description: 'Purchase help' },
    { id: 'shipping', icon: <FaTruck />, title: 'Shipping', description: 'Delivery info' },
    { id: 'returns', icon: <FaUndo />, title: 'Returns', description: 'Return assistance' },
    { id: 'account', icon: <FaUserCircle />, title: 'Account', description: 'Profile issues' },
    { id: 'payment', icon: <FaCreditCard />, title: 'Payment', description: 'Billing help' },
    { id: 'technical', icon: <FaTools />, title: 'Technical', description: 'Site issues' },
    { id: 'resources', icon: <FaBook />, title: 'Resources', description: 'Guides & docs' },
  ];

  const contactMethods = [
    {
      icon: <FaEnvelope />,
      title: "Email Support",
      description: "Best for detailed inquiries",
      contact: "support@bookbalcony.com",
      href: "mailto:support@bookbalcony.com",
      response: "Within 24 hours",
      color: "from-yellow-400 to-yellow-200",
      available: "24/7"
    },
    {
      icon: <FaPhone />,
      title: "Phone Support",
      description: "Speak with our team",
      contact: "+91 123 456 7890",
      href: "tel:+911234567890",
      response: "Immediate",
      color: "from-yellow-400 to-yellow-200",
      available: "Mon-Sat: 9 AM - 6 PM IST"
    },
    {
      icon: <FaComments />,
      title: "Live Chat",
      description: "Instant messaging support",
      contact: "Chat with us",
      href: "#chat",
      response: "Real-time",
      color: "from-yellow-400 to-yellow-200",
      available: "Mon-Sat: 9 AM - 9 PM IST"
    },
    {
      icon: <FaWhatsapp />,
      title: "WhatsApp",
      description: "Message us anytime",
      contact: "+91 123 456 7890",
      href: "https://wa.me/911234567890",
      response: "Within 1-2 hours",
      color: "from-yellow-400 to-yellow-200",
      available: "24/7"
    }
  ];

  const faqs = [
    {
      category: "Account & Login",
      icon: <FaUserCircle />,
      questions: [
        {
          q: "How do I create an account?",
          a: "Click 'Sign Up' in the top right corner, enter your email, create a password, and verify your email address. It takes less than 2 minutes!"
        },
        {
          q: "I forgot my password. How do I reset it?",
          a: "Click 'Forgot Password' on the login page, enter your email, and we'll send you a reset link. Check your spam folder if you don't see it within 5 minutes."
        },
        {
          q: "Can I change my email address?",
          a: "Yes! Go to Settings → Account → Email and update it. You'll need to verify your new email address."
        },
        {
          q: "How do I delete my account?",
          a: "Go to Settings → Account → Delete Account. Please note this is permanent and all your data will be removed within 30 days."
        }
      ]
    },
    {
      category: "Orders & Shopping",
      icon: <FaShoppingCart />,
      questions: [
        {
          q: "How do I place an order?",
          a: "Browse books, click 'Add to Cart', review your cart, proceed to checkout, enter shipping details, and complete payment. You'll receive instant confirmation."
        },
        {
          q: "Can I modify my order after placing it?",
          a: "Yes, but only before it ships (usually within 1-2 hours). Go to My Orders and click 'Modify Order'. After shipment, you'll need to return and reorder."
        },
        {
          q: "Where can I track my order?",
          a: "Go to My Orders → Select your order → View tracking details. You'll get real-time updates via email and SMS."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept Credit/Debit cards, UPI, Net Banking, and popular digital wallets through our secure payment partner Razorpay."
        }
      ]
    },
    {
      category: "Shipping & Delivery",
      icon: <FaTruck />,
      questions: [
        {
          q: "How long does shipping take?",
          a: "Standard shipping: 5-7 business days. Express shipping: 2-3 business days. Processing takes 1-2 days before dispatch."
        },
        {
          q: "Do you ship internationally?",
          a: "Currently, we only ship within India. International shipping will be available soon!"
        },
        {
          q: "What are the shipping charges?",
          a: "Calculated based on weight and destination. Typically ₹40-₹150. Free shipping on orders above ₹500!"
        },
        {
          q: "My package hasn't arrived. What should I do?",
          a: "Check tracking first. If delayed beyond estimated date, contact us with your order number and we'll investigate with the courier immediately."
        }
      ]
    },
    {
      category: "Returns & Refunds",
      icon: <FaUndo />,
      questions: [
        {
          q: "What is your return policy?",
          a: "7-day returns from delivery date. Book must be in original condition. Free returns for wrong/damaged items. See our Refund Policy for details."
        },
        {
          q: "How do I initiate a return?",
          a: "Go to My Orders → Select order → Click 'Return Item' → Choose reason → Upload photos (if damaged) → Submit request."
        },
        {
          q: "When will I get my refund?",
          a: "5-7 business days after we receive and inspect your return. Refunded to original payment method."
        },
        {
          q: "Who pays for return shipping?",
          a: "We cover return shipping for wrong/damaged items. For change of mind, you cover return shipping costs (₹40-₹150)."
        }
      ]
    },
    {
      category: "Payments & Pricing",
      icon: <FaCreditCard />,
      questions: [
        {
          q: "Is it safe to pay on BookBalcony?",
          a: "Absolutely! We use Razorpay (PCI DSS Level 1 certified) for all payments. We never store your card details. All transactions are 256-bit encrypted."
        },
        {
          q: "Why was my payment declined?",
          a: "Common reasons: insufficient balance, incorrect card details, or bank security blocks. Try another payment method or contact your bank."
        },
        {
          q: "Can I get an invoice for my order?",
          a: "Yes! Invoices are automatically sent to your email after order confirmation. You can also download them from My Orders."
        },
        {
          q: "Do you offer EMI options?",
          a: "Yes, for orders above ₹3,000. Select EMI at checkout and choose your preferred tenure (3/6/9/12 months)."
        }
      ]
    },
    {
      category: "Seller Related",
      icon: <FaUserTie />,
      questions: [
        {
          q: "How do I become a seller?",
          a: "Go to Profile → Become a Seller → Fill application → Upload ID & documents → Wait for verification (2-3 business days)."
        },
        {
          q: "What commission does BookBalcony charge?",
          a: "We charge 10% commission on each sale. No listing fees, no hidden charges."
        },
        {
          q: "How do I get paid as a seller?",
          a: "Payments are released 7 days after delivery confirmation. Transferred directly to your bank account."
        },
        {
          q: "Can I edit my listings?",
          a: "Yes! Go to Seller Dashboard → My Listings → Edit. You can update price, description, images, and availability anytime."
        }
      ]
    }
  ];

  const quickLinks = [
    { icon: <FaBook />, title: "User Guide", desc: "Complete platform guide", link: "#" },
    { icon: <FaFileContract />, title: "Terms of Service", desc: "Legal agreements", link: "/terms-of-service" },
    { icon: <FaShieldAlt />, title: "Privacy Policy", desc: "Data protection", link: "/privacy-policy" },
    { icon: <FaUndo />, title: "Refund Policy", desc: "Return guidelines", link: "/refund-policy" },
  ];

  const toggleFaq = (category, index) => {
    const key = `${category}-${index}`;
    setExpandedFaq(expandedFaq === key ? null : key);
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
              <FaHeadset className="text-4xl text-black" />
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Help & Support
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-6 leading-relaxed">
              We're here to help! Get answers, contact support, or browse our resources.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for answers... (e.g., 'how to return a book')"
                  className="w-full px-6 py-4 pl-12 bg-zinc-800/60 backdrop-blur-sm border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-lg" />
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
                <FaHeadset className="text-yellow-400" />
                Quick Access
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
                  <h2 className="text-2xl font-black text-white">How Can We Help You?</h2>
                  <p className="text-zinc-400 text-xs">Choose the best way to get support</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Welcome to <strong className="text-white">BookBalcony Support</strong>! Whether you have a question, need help with an order, or want to report an issue, we're here to assist you 24/7.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { icon: <FaLightbulb />, title: "Browse FAQs", desc: "Quick answers to common questions", link: "#faqs" },
                    { icon: <FaHeadset />, title: "Contact Support", desc: "Speak with our team directly", link: "#contact" },
                    { icon: <FaBook />, title: "View Resources", desc: "Guides and documentation", link: "#resources" },
                  ].map((item, index) => (
                    <a
                      key={index}
                      href={item.link}
                      className="flex flex-col items-center text-center gap-2 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50 hover:border-yellow-400/50 transition-all group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-black text-2xl">{item.icon}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-zinc-400">{item.desc}</p>
                    </a>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Section 2: Contact Methods */}
            <motion.section
              id="contact"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaHeadset className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Contact Our Team</h2>
                  <p className="text-zinc-400 text-xs">Multiple ways to reach us</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contactMethods.map((method, index) => (
                  <a
                    key={index}
                    href={method.href}
                    className="bg-zinc-800/30 rounded-lg p-5 border border-zinc-700/50 hover:border-yellow-400/50 transition-all group"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <span className="text-black text-2xl">{method.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-white mb-1">{method.title}</h3>
                        <p className="text-zinc-400 text-xs mb-2">{method.description}</p>
                        <p className="text-yellow-400 text-sm font-semibold">{method.contact}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-zinc-900/50 rounded p-2">
                        <p className="text-zinc-400">Response Time</p>
                        <p className="text-white font-semibold">{method.response}</p>
                      </div>
                      <div className="bg-zinc-900/50 rounded p-2">
                        <p className="text-zinc-400">Available</p>
                        <p className="text-white font-semibold text-[10px]">{method.available}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-yellow-300 mb-1">Priority Support</h3>
                    <p className="text-yellow-200 text-xs leading-relaxed">
                      For urgent issues (payment failures, wrong items, account access), call us directly for immediate assistance.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 3: FAQs */}
            <motion.section
              id="faqs"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                  <FaQuestionCircle className="text-2xl text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Frequently Asked Questions</h2>
                  <p className="text-zinc-400 text-xs">Find quick answers</p>
                </div>
              </div>

              <div className="space-y-4">
                {(searchQuery ? filteredFaqs : faqs).map((category, catIndex) => (
                  <div key={catIndex} className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                        <span className="text-black text-base">{category.icon}</span>
                      </div>
                      <h3 className="text-base font-bold text-white">{category.category}</h3>
                      <span className="ml-auto text-xs text-zinc-400 bg-zinc-900/50 px-2 py-1 rounded">
                        {category.questions.length} questions
                      </span>
                    </div>

                    <div className="space-y-2">
                      {category.questions.map((faq, qIndex) => {
                        const faqKey = `${category.category}-${qIndex}`;
                        const isExpanded = expandedFaq === faqKey;

                        return (
                          <div key={qIndex} className="bg-zinc-900/50 rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleFaq(category.category, qIndex)}
                              className="w-full flex items-start justify-between gap-3 p-3 text-left hover:bg-zinc-800/50 transition-all"
                            >
                              <div className="flex items-start gap-2 flex-1">
                                <FaQuestionCircle className="text-yellow-400 mt-0.5 flex-shrink-0 text-xs" />
                                <span className="text-sm font-semibold text-white">{faq.q}</span>
                              </div>
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <FaChevronDown className="text-yellow-400 text-xs" />
                              </motion.div>
                            </button>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-3 pt-0 pl-8">
                                    <p className="text-xs text-zinc-300 leading-relaxed">{faq.a}</p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {searchQuery && filteredFaqs.length === 0 && (
                  <div className="text-center py-8">
                    <FaQuestionCircle className="text-5xl text-zinc-600 mx-auto mb-3" />
                    <p className="text-zinc-400 text-sm">No FAQs found matching "{searchQuery}"</p>
                    <p className="text-zinc-500 text-xs mt-1">Try different keywords or contact support</p>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Quick Topic Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ordering Help */}
              <motion.section
                id="ordering"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                    <FaShoppingCart className="text-2xl text-black" />
                  </div>
                  <h2 className="text-xl font-black text-white">Ordering Help</h2>
                </div>

                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>How to browse and search for books</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Adding items to cart and wishlist</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Applying coupons and discounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Order confirmation and tracking</span>
                  </li>
                </ul>
              </motion.section>

              {/* Shipping Help */}
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
                  <h2 className="text-xl font-black text-white">Shipping Info</h2>
                </div>

                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Delivery timeframes and options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Tracking your shipment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Shipping charges and free shipping</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Delivery issues and delays</span>
                  </li>
                </ul>
              </motion.section>

              {/* Returns Help */}
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
                  <h2 className="text-xl font-black text-white">Returns & Refunds</h2>
                </div>

                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>7-day return policy details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>How to initiate a return</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Refund processing timeline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Return shipping information</span>
                  </li>
                </ul>
              </motion.section>

              {/* Account Help */}
              <motion.section
                id="account"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                    <FaUserCircle className="text-2xl text-black" />
                  </div>
                  <h2 className="text-xl font-black text-white">Account Issues</h2>
                </div>

                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Creating and managing your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Password reset and recovery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Updating personal information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Account security and privacy</span>
                  </li>
                </ul>
              </motion.section>

              {/* Payment Help */}
              <motion.section
                id="payment"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                    <FaCreditCard className="text-2xl text-black" />
                  </div>
                  <h2 className="text-xl font-black text-white">Payment Help</h2>
                </div>

                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Accepted payment methods</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Payment security and safety</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Failed payment troubleshooting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Invoices and receipts</span>
                  </li>
                </ul>
              </motion.section>

              {/* Technical Help */}
              <motion.section
                id="technical"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center">
                    <FaTools className="text-2xl text-black" />
                  </div>
                  <h2 className="text-xl font-black text-white">Technical Issues</h2>
                </div>

                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Website not loading or errors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Mobile app troubleshooting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Browser compatibility issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Reporting bugs and glitches</span>
                  </li>
                </ul>
              </motion.section>
            </div>

            {/* Section: Resources */}
            <motion.section
              id="resources"
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
                  <h2 className="text-2xl font-black text-white">Helpful Resources</h2>
                  <p className="text-zinc-400 text-xs">Guides and documentation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.link}
                    className="flex items-start gap-3 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50 hover:border-yellow-400/50 transition-all group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-black text-lg">{link.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-white mb-1">{link.title}</h3>
                      <p className="text-xs text-zinc-400">{link.desc}</p>
                    </div>
                    <FaChevronRight className="text-yellow-400 text-sm mt-1" />
                  </a>
                ))}
              </div>
            </motion.section>

            {/* Still Need Help CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-yellow-400/10 to-yellow-200/10 backdrop-blur-sm rounded-xl border-2 border-yellow-400/50 p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <FaHeadset className="text-3xl text-yellow-400 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Still Need Help?</h2>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                    Can't find what you're looking for? Our support team is ready to assist you with any questions or concerns.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="mailto:support@bookbalcony.com"
                      className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-200 hover:from-yellow-500 hover:to-yellow-300 rounded-lg text-black font-semibold text-xs transition-all flex items-center gap-2"
                    >
                      <FaEnvelope />
                      <span>Email Us</span>
                    </a>
                    <a
                      href="tel:+911234567890"
                      className="px-4 py-2 bg-yellow-400/20 border border-yellow-400/50 hover:bg-yellow-400/30 rounded-lg text-yellow-400 font-semibold text-xs transition-all flex items-center gap-2"
                    >
                      <FaPhone />
                      <span>Call Now</span>
                    </a>
                    <a
                      href="#chat"
                      className="px-4 py-2 bg-yellow-400/20 border border-yellow-400/50 hover:bg-yellow-400/30 rounded-lg text-yellow-400 font-semibold text-xs transition-all flex items-center gap-2"
                    >
                      <FaComments />
                      <span>Live Chat</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white mb-1">BookBalcony Support Center</p>
                    <p className="text-xs text-zinc-300">RAO DevStudio, Nagpur, Maharashtra, India</p>
                  </div>
                </div>
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
              <span>Available 24/7 to assist you</span>
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
                href="mailto:support@bookbalcony.com"
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-200 hover:from-yellow-500 hover:to-yellow-300 rounded-lg text-black font-semibold text-xs transition-all flex items-center gap-2"
              >
                <FaEnvelope />
                <span>Contact Support</span>
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

export default Support;