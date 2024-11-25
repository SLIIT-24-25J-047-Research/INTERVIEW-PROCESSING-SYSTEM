import React from 'react';

import { AiFillInstagram,AiOutlineWhatsApp,AiFillFacebook ,AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { BsArrowUpCircleFill } from "react-icons/bs";
import { BiSolidMap } from "react-icons/bi";
import './footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-gray-100">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AIPT
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Crafting digital experiences that inspire and innovate. We're committed to excellence in everything we do.
            </p>
          </div>

          {/* Quick Links, Stay Updated, and Contact Us */}
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['About Us', 'Services', 'Portfolio', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition duration-300 block py-1">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stay Updated */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
              <div className="space-y-4">
                <p className="text-gray-400">Subscribe to our newsletter for updates and insights.</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition duration-300">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Us */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-400">
                  <AiOutlineMail size={18} />
                  <span>info@AIPT.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <AiOutlinePhone size={18} />
                  <span>+94 (76) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <BiSolidMap size={18} />
                  <span>123 Malabe, Malabe<br />Sri Lanaka, SL 10001</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-6">
              {[AiFillFacebook , AiOutlineWhatsApp, AiFillInstagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="SocialIcon hover:text-white transition duration-300"
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} AIPT. All rights reserved.
            </div>
            <button
              onClick={scrollToTop}
              className="topBtn hover:text-white transition duration-300"
              aria-label="Scroll to top"
            >
              <BsArrowUpCircleFill size={24} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
