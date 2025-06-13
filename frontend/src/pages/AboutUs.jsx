import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import Rao from '../../src/assets/Rao.png'

const AboutUs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 text-zinc-100 min-h-screen py-16 px-6 sm:px-10 lg:px-24"
    >
      <div className="max-w-6xl mx-auto space-y-20">

        {/* BookBalcony Intro */}
        <section className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-yellow-400">📚 About BookBalcony</h1>
          <p className="text-zinc-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Hi, I’m <strong>Roshan Avatirak</strong> — Founder, CEO, and Developer of <strong>BookBalcony</strong>.  
            This platform was born from my own struggle during exams. I wanted to buy a second-hand book, but in Amravati, Maharashtra, there was no proper platform for that.  
            That moment made me think: <em>"What if I build something for students like me, who can’t afford new books — and connect them to those who no longer need theirs?"</em>
          </p>
          <p className="text-yellow-300 italic text-md">That small thought became BookBalcony — where every book gets a second home, and every learner gets a fair chance.</p>
        </section>

        {/* Mission, Vision, Objective */}
        <section className="bg-zinc-800 rounded-3xl p-10 shadow-lg">
          <h2 className="text-3xl font-bold text-yellow-400 text-center mb-10">🌟 Vision, Mission & Goals</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-2xl font-semibold mb-2 text-yellow-300">🌈 Vision</h3>
              <p className="text-zinc-300">
                To build India’s most trusted platform for buying and selling used books — for school, college, competitive exams, or passion — all in one place.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2 text-yellow-300">🎯 Mission</h3>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li>Make books accessible and affordable for every student.</li>
                <li>Encourage a culture of reuse and smart learning.</li>
                <li>Build a trusted platform where sellers and buyers feel safe and valued.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2 text-yellow-300">🚀 Goals</h3>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li>Bring together books for all levels — UG, PG, <strong>Engineering</strong>, UPSC, NEET, JEE, MBBS, arts, and more.</li>
                <li>Cover every city and village, so no learner is left behind.</li>
                <li>Create a digital shelf of books for every student on BookBalcony.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* What is BookBalcony */}
        <section className="text-center space-y-6">
          <h2 className="text-3xl text-yellow-400 font-bold">📖 What is BookBalcony?</h2>
          <p className="text-zinc-300 max-w-4xl mx-auto">
            BookBalcony is a bridge between people who have books and people who need them. Whether you’re preparing for UPSC, NEET, GATE, CAT, SSC, JEE, or simply want to read motivational stories — you’ll find your book here.
          </p>
          <p className="text-yellow-300 font-medium italic">
            I don’t want any student to give up on their dreams just because a book was too expensive.
          </p>
        </section>

        {/* Unique Features */}
        <section>
          <h2 className="text-3xl font-bold text-yellow-400 text-center mb-10">💡 What Makes BookBalcony Special?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { title: "📦 All Books in One Place", desc: "From engineering to medical, UPSC to fiction — get everything here." },
              { title: "💰 Half Price Listings", desc: "Buy quality second-hand books at affordable prices." },
              { title: "🔁 Easy Selling Flow", desc: "Want to sell your books? It’s super easy and fast!" },
              { title: "📍 Local + Pan India", desc: "Find sellers nearby or across the country." },
              { title: "🌐 Digital Book Locker", desc: "Keep track of what you’ve bought or sold — all in one account." },
              { title: "⚡ Smooth & Secure", desc: "Smooth transitions, fast loading, and secure user experience." },
            ].map(({ title, desc }, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-zinc-800 p-6 rounded-xl shadow-md"
              >
                <h3 className="text-xl font-semibold text-yellow-300 mb-2">{title}</h3>
                <p className="text-zinc-300">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Developer Section */}
        <section className="bg-zinc-800 rounded-xl shadow-inner p-8 flex flex-col md:flex-row items-center gap-10">
          <img
            src={Rao}
            alt="Developer"
            className="w-60 h-72 rounded-full border-4 border-yellow-400 object-cover"
          />
          <div>
            <h2 className="text-2xl text-yellow-400 font-bold">👨‍💻 Meet The <strong>Developer</strong></h2>
            <p className="text-zinc-300 mt-4">
              I'm <strong>Roshan Avatirak</strong>, a <strong>Software Developer</strong> passionate about building things that solve real problems. BookBalcony is my heart. I wrote every line of code, designed every page, and imagined a platform where students could help each other, not just compete.
            </p>
            <p className="text-zinc-400 italic mt-2">This isn’t just a product — it’s my promise to every student like me.</p>

            <div className="flex gap-4 text-yellow-300 mt-4 text-xl">
              <a href="mailto:roshanavatirak@gmail.com"><FaEnvelope /></a>
              <a href="https://github.com/roshanavatirak"><FaGithub /></a>
              <a href="https://www.linkedin.com/in/roshan-avatirak/"><FaLinkedin /></a>
            </div>
          </div>
        </section>

        {/* Founder Message */}
        <section className="text-center mt-16 space-y-4">
          <h2 className="text-3xl font-bold text-yellow-400">📝 A Message From <strong>Developer</strong></h2>
          <p className="text-zinc-300 max-w-4xl mx-auto italic leading-loose">
            I created BookBalcony because I believe in equal access to education. No student should feel helpless during exams because of a book they can’t afford.  
            I started with engineering books — but BookBalcony has no limits. My dream is to bring together <strong>all academic</strong> and <strong>non-academic books</strong>, across <strong>every corner of India</strong>.
          </p>
          <p className="text-yellow-300 font-medium">— <strong>Roshan Avatirak</strong> <br /><span className="text-sm italic">(Founder & CEO, BookBalcony)</span></p>
        </section>
      </div>
    </motion.div>
  );
};

export default AboutUs;
