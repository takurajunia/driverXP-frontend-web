import React from "react";
import {
  FaCar,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPaperPlane,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <FaCar className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-blue-400 font-bold text-xl">SYDNEY</h3>
                <h3 className="text-blue-400 font-bold text-xl">DRIVING</h3>
                <h3 className="text-blue-400 font-bold text-xl">SCHOOL</h3>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Your trusted partner for modern, convenient driving education in
              Sydney. Learn with confidence using our innovative DriverXP
              platform.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="tel:0212345678"
                className="flex items-center space-x-3 hover:text-blue-400 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FaPhone className="text-white text-sm" />
                </div>
                <span className="text-sm">(02) 1234 5678</span>
              </a>
              <a
                href="mailto:info@driverxp.com.za"
                className="flex items-center space-x-3 hover:text-blue-400 transition-colors"
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <FaEnvelope className="text-white text-sm" />
                </div>
                <span className="text-sm">info@driverxp.com.za</span>
              </a>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <FaMapMarkerAlt className="text-white text-sm" />
                </div>
                <span className="text-sm">Somewhere in South Africa</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h3 className="text-yellow-400 font-bold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/dashboard"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/bookings"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Book Lesson
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-yellow-400 font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  My Account
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Instructor Login
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Admin Panel
                </a>
              </li>
              <li>
                <a
                  href="/bookings"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Lesson Booking
                </a>
              </li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div>
            <h3 className="text-yellow-400 font-bold text-lg mb-4">
              Stay Connected
            </h3>

            {/* Social Media Icons */}
            <div className="flex space-x-3 mb-6">
              <a
                href="#"
                className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="Instagram"
              >
                <FaInstagram className="text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="text-white" />
              </a>
            </div>

            <p className="text-gray-400 text-sm mb-4">
              Get driving tips & updates
            </p>

            {/* Newsletter Signup */}
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                aria-label="Subscribe"
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2025 Sydney Driving School. All rights reserved. |{" "}
              <a
                href="https://www.linkedin.com/in/takura-junia-mudzimbasekwa-0b20ab275/"
                className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
              >
                SRI Corp.
              </a>
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
