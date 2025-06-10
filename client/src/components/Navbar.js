import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
        <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">   
         <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">
          🎬 MovieApp
        </h1>
         <ul className="hidden md:flex space-x-4 text-sm sm:text-base">
          <li>
             <Link to="/" className="hover:text-blue-400">Home</Link>
          </li>
          <li>
            {!token && <Link to="/login"  className="hover:text-blue-400">Login</Link>}
          </li>
          <li>
            {!token && <Link to="/register" className="hover:text-blue-400">Register</Link>}
          </li>
          <li>
            {token && <button className="hover:text-blue-400" onClick={handleLogout}>Logout</button>}
          </li>
          <li>
            <Link to="/favorites" className="hover:text-blue-400">Favorites</Link>
          </li>
          <li>
            <Link to="/watchlist" className="hover:text-blue-400">Watchlist</Link>
          </li>
          <li>
            <Link to="/profile" className="hover:text-blue-400">Profile</Link>
          </li>
          </ul>
          <button className="md:hidden focus:outline-none" onClick={toggleMenu}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

      </div>
       {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link to="/" className="block text-sm hover:text-blue-400" onClick={toggleMenu}>Home</Link>
          {!token && <Link to="/login"  className="block text-sm hover:text-blue-400" onClick={toggleMenu}>Login</Link>}
          {!token && <Link to="/register" className="block text-sm hover:text-blue-400" onClick={toggleMenu}>Register</Link>}
          {token && <button className="block text-sm hover:text-blue-400" onClick={() => {toggleMenu(); handleLogout()}}>Logout</button>}
          <Link to="/favorites" className="block text-sm hover:text-blue-400" onClick={toggleMenu}>Favorites</Link>
          <Link to="/watchlist" className="block text-sm hover:text-blue-400" onClick={toggleMenu}>Watchlist</Link>
          <Link to="/profile" className="block text-sm hover:text-blue-400" onClick={toggleMenu}>Profile</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
