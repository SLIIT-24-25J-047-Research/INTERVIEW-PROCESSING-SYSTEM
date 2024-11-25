import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, ArrowUpCircle } from 'lucide-react';
import './footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();
  const quickLinks = ['About Us', 'Services', 'Portfolio', 'Careers', 'Contact'];
  const socialLinks = [
    { icon: Facebook, name: 'Facebook', href: '#' },
    { icon: Twitter, name: 'Twitter', href: '#' },
    { icon: Instagram, name: 'Instagram', href: '#' },
  ];

  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-gray-100">
      {/* Wave SVG Divider */}
      {/* <div className="w-full overflow-hidden">
        <svg
          className="w-full h-24"
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M0 50L48 45.7C96 41.3 192 32.7 288 37.3C384 42 480 60 576 62.5C672 65 768 52 864 47.5C960 43 1056 47 1152 45.8C1248 44.7 1344 38.3 1392 35.2L1440 32V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
            fill="currentColor"
            className="text-slate-900"
          />
        </svg>
      </div> */}

      <div className="container mx-auto px-6 py-12">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              CompanyName
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Crafting digital experiences that inspire and innovate. We're committed to excellence in everything we do.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition duration-300 block py-1"
                    aria-label={`Navigate to ${link}`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail size={18} aria-hidden="true" />
                <span>info@company.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone size={18} aria-hidden="true" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin size={18} aria-hidden="true" />
                <span>
                  123 Business Ave, Suite 100<br />
                  New York, NY 10001
                </span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates and insights.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-slate-700 text-white px-4 py-2 rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Enter your email to subscribe"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition duration-300"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-6">
              {socialLinks.map(({ icon: Icon, name, href }, index) => (
                <a
                  key={index}
                  href={href}
                  className="text-gray-400 hover:text-white transition duration-300"
                  aria-label={`Follow us on ${name}`}
                >
                  <Icon size={24} aria-hidden="true" />
                </a>
              ))}
            </div>
            <div className="text-gray-400 text-sm">© {currentYear} CompanyName. All rights reserved.</div>
            <button
              onClick={scrollToTop}
              className="text-gray-400 hover:text-white transition duration-300"
              aria-label="Scroll to top"
            >
              <ArrowUpCircle size={24} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
