import React from 'react';
import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-zinc-900 text-white py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Branding */}
        <div>
          <h1 className="text-2xl font-bold mb-2">📚 BookBalcanoy</h1>
          <p className="text-zinc-400 text-sm">
            Where Stories Find a Second Home. Resell, Reuse, Reignite the joy of reading.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-zinc-400 text-sm">
            <li><a href="#" className="hover:text-yellow-400 transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition">Terms of Service</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition">Refund Policy</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition">Support</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Connect With Us</h2>
          <div className="flex space-x-5 text-2xl text-zinc-400">
            <a href="#" className="hover:text-pink-500 transition"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-500 transition"><FaLinkedin /></a>
            <a href="#" className="hover:text-gray-300 transition"><FaGithub /></a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Subscribe</h2>
          <p className="text-sm text-zinc-400 mb-4">Get updates on deals and new arrivals.</p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
             className="w-full px-4 py-2 rounded-md bg-transparent border border-white text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none"

            />
            <button className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-300 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
     <div className="text-center text-zinc-500 text-sm mt-10 border-t border-zinc-700 pt-6">
  &copy; {new Date().getFullYear()} <span className="text-white font-semibold">BookBalcanoy</span> — A Legacy Curated by <span className="text-yellow-400 font-medium">RAO</span>. All rights reserved.
</div>

    </footer>
  );
}

export default Footer;
