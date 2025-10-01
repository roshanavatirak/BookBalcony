import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import Rao from '../../src/assets/Rao.png'

const AboutUs = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 40, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    hover: { 
      scale: 1.05, 
      y: -8,
      rotateY: 5,
      transition: { duration: 0.3, ease: "easeOut" } 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 text-zinc-100 min-h-screen py-16 px-6 sm:px-10 lg:px-24 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 50, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 60, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-zinc-400/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-6xl mx-auto space-y-20 relative z-10">

        {/* BookBalcony Intro */}
        <motion.section 
          {...fadeInUp}
          className="text-center space-y-6"
        >
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "backOut" }}
            className="text-5xl font-bold text-yellow-400 drop-shadow-lg"
          >
            📚 About BookBalcony
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-zinc-300 text-lg max-w-3xl mx-auto leading-relaxed"
          >
            Hi, I'm <strong className="text-yellow-300">Roshan Avatirak</strong> — Founder, CEO, and Developer of <strong className="text-yellow-300">BookBalcony</strong>.  
            This platform was born from my own struggle during exams. I wanted to buy a second-hand book, but in Amravati, Maharashtra, there was no proper platform for that.  
            That moment made me think: <em className="text-yellow-200">"What if I build something for students like me, who can't afford new books — and connect them to those who no longer need theirs?"</em>
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-yellow-300 italic text-md bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 p-6 rounded-2xl border border-yellow-400/20 backdrop-blur-sm"
          >
            That small thought became BookBalcony — where every book gets a second home, and every learner gets a fair chance.
          </motion.p>
        </motion.section>

        {/* Mission, Vision, Objective */}
        <motion.section 
          {...fadeInUp}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 rounded-3xl blur-xl"></div>
          <div className="relative bg-zinc-800/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-zinc-700/50">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl font-bold text-yellow-400 text-center mb-10 drop-shadow-md"
            >
              🌟 Vision, Mission & Goals
            </motion.h2>
            <motion.div 
              variants={staggerContainer}
              animate="animate"
              className="grid md:grid-cols-3 gap-10"
            >
              {[
                {
                  icon: "🌈",
                  title: "Vision",
                  content: "To build India's most trusted platform for buying and selling used books — for school, college, competitive exams, or passion — all in one place."
                },
                {
                  icon: "🎯",
                  title: "Mission",
                  content: [
                    "Make books accessible and affordable for every student.",
                    "Encourage a culture of reuse and smart learning.",
                    "Build a trusted platform where sellers and buyers feel safe and valued."
                  ]
                },
                {
                  icon: "🚀",
                  title: "Goals",
                  content: [
                    "Bring together books for all levels — UG, PG, Engineering, UPSC, NEET, JEE, MBBS, arts, and more.",
                    "Cover every city and village, so no learner is left behind.",
                    "Create a digital shelf of books for every student on BookBalcony."
                  ]
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-zinc-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                  <div className="relative bg-zinc-700/50 backdrop-blur-sm border border-zinc-600/50 rounded-2xl p-6 h-full hover:border-yellow-400/50 transition-all duration-500">
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                    <h3 className="text-2xl font-semibold mb-2 text-yellow-300 group-hover:text-yellow-400 transition-colors duration-300">{item.title}</h3>
                    {Array.isArray(item.content) ? (
                      <ul className="list-disc list-inside text-zinc-300 space-y-2">
                        {item.content.map((point, idx) => (
                          <li key={idx} className="hover:text-zinc-200 transition-colors duration-200">{point}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-zinc-300 group-hover:text-zinc-200 transition-colors duration-300">{item.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* What is BookBalcony */}
        <motion.section 
          {...fadeInUp}
          className="text-center space-y-6"
        >
          <motion.h2 
            whileHover={{ scale: 1.05 }}
            className="text-3xl text-yellow-400 font-bold drop-shadow-md"
          >
            📖 What is BookBalcony?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-zinc-300 max-w-4xl mx-auto text-lg leading-relaxed"
          >
            BookBalcony is a bridge between people who have books and people who need them. Whether you're preparing for UPSC, NEET, GATE, CAT, SSC, JEE, or simply want to read motivational stories — you'll find your book here.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
            className="text-yellow-300 font-medium italic text-lg bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 p-6 rounded-2xl border border-yellow-400/20 backdrop-blur-sm"
          >
            I don't want any student to give up on their dreams just because a book was too expensive.
          </motion.p>
        </motion.section>

        {/* Unique Features */}
        <motion.section 
          {...fadeInUp}
        >
          <motion.h2 
            whileHover={{ scale: 1.05 }}
            className="text-3xl font-bold text-yellow-400 text-center mb-10 drop-shadow-md"
          >
            💡 What Makes BookBalcony Special?
          </motion.h2>
          <motion.div 
            variants={staggerContainer}
            animate="animate"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {[
              { title: "📦 All Books in One Place", desc: "From engineering to medical, UPSC to fiction — get everything here." },
              { title: "💰 Half Price Listings", desc: "Buy quality second-hand books at affordable prices." },
              { title: "🔁 Easy Selling Flow", desc: "Want to sell your books? It's super easy and fast!" },
              { title: "📍 Local + Pan India", desc: "Find sellers nearby or across the country." },
              { title: "🌐 Digital Book Locker", desc: "Keep track of what you've bought or sold — all in one account." },
              { title: "⚡ Smooth & Secure", desc: "Smooth transitions, fast loading, and secure user experience." },
            ].map(({ title, desc }, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover="hover"
                className="group relative perspective-1000"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-zinc-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                <div className="relative bg-zinc-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-zinc-700/50 hover:border-yellow-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/20">
                  <h3 className="text-xl font-semibold text-yellow-300 mb-2 group-hover:text-yellow-400 transition-colors duration-300">{title}</h3>
                  <p className="text-zinc-300 group-hover:text-zinc-200 transition-colors duration-300 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Developer Section */}
        <motion.section 
          {...fadeInUp}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 rounded-xl blur-xl"></div>
          <div className="relative bg-zinc-800/80 backdrop-blur-sm rounded-xl shadow-2xl border border-zinc-700/50 p-8 flex flex-col md:flex-row items-center gap-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-yellow-600/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <img
                src={Rao}
                alt="Developer"
                className="relative w-60 h-72 rounded-full border-4 border-yellow-400 object-cover shadow-2xl group-hover:border-yellow-300 transition-all duration-500"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex-1"
            >
              <h2 className="text-2xl text-yellow-400 font-bold mb-4 drop-shadow-md">👨‍💻 Meet The <strong>Developer</strong></h2>
              <p className="text-zinc-300 mt-4 text-lg leading-relaxed">
                I'm <strong className="text-yellow-300">Roshan Avatirak</strong>, a <strong className="text-yellow-300">Software Developer</strong> passionate about building things that solve real problems. BookBalcony is my heart. I wrote every line of code, designed every page, and imagined a platform where students could help each other, not just compete.
              </p>
              <p className="text-zinc-400 italic mt-2 text-lg">This isn't just a product — it's my promise to every student like me.</p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="flex gap-4 text-yellow-300 mt-6 text-xl"
              >
                {[
                  { icon: <FaEnvelope />, href: "mailto:roshanavatirak@gmail.com" },
                  { icon: <FaGithub />, href: "https://github.com/roshanavatirak" },
                  { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/roshan-avatirak/" }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    whileHover={{ 
                      scale: 1.2, 
                      y: -5,
                      color: "#fbbf24",
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-zinc-700/50 rounded-full border border-zinc-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/20"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Founder Message */}
        <motion.section 
          {...fadeInUp}
          className="text-center mt-16 space-y-4"
        >
          <motion.h2 
            whileHover={{ scale: 1.05 }}
            className="text-3xl font-bold text-yellow-400 drop-shadow-md"
          >
            📝 A Message From <strong>Developer</strong>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-700/50 max-w-4xl mx-auto"
          >
            <p className="text-zinc-300 italic leading-loose text-lg mb-6">
              I created BookBalcony because I believe in equal access to education. No student should feel helpless during exams because of a book they can't afford.  
              I started with engineering books — but BookBalcony has no limits. My dream is to bring together <strong className="text-yellow-300">all academic</strong> and <strong className="text-yellow-300">non-academic books</strong>, across <strong className="text-yellow-300">every corner of India</strong>.
            </p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-yellow-300 font-medium text-xl"
            >
              — <strong>Roshan Avatirak</strong> <br />
              <span className="text-sm italic text-zinc-400">(Founder & CEO, BookBalcony)</span>
            </motion.p>
          </motion.div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default AboutUs;