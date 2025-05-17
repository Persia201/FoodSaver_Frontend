import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar({ token, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/browse', label: 'Browse' },
  ];

  if (token) {
    links.push({ to: '/donate', label: 'Donate' });
  }

  return (
    <nav className="bg-green-600 text-white px-6 py-4 fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-2xl tracking-wide hover:text-green-200">
          FoodSaver
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? 'underline underline-offset-4 font-semibold text-green-200'
                  : 'hover:text-green-300'
              }
            >
              {label}
            </NavLink>
          ))}

          {token ? (
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="bg-green-800 px-3 py-1 rounded hover:bg-green-700 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login" className="hover:text-green-300">
                Login
              </NavLink>
              <NavLink to="/signup" className="hover:text-green-300">
                Signup
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            aria-label="Toggle Menu"
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            {isOpen ? (
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-green-700 px-6 pt-4 pb-6"
          >
            <nav className="flex flex-col space-y-3">
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? 'underline underline-offset-4 font-semibold text-green-200'
                      : 'hover:text-green-300'
                  }
                >
                  {label}
                </NavLink>
              ))}

              {token ? (
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="bg-green-800 px-3 py-1 rounded hover:bg-green-700 transition"
                >
                  Logout
                </button>
              ) : (
                <>
                  <NavLink to="/login" onClick={() => setIsOpen(false)} className="hover:text-green-300">
                    Login
                  </NavLink>
                  <NavLink to="/signup" onClick={() => setIsOpen(false)} className="hover:text-green-300">
                    Signup
                  </NavLink>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;