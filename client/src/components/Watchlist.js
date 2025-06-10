import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/watchlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist(res.data);
      } catch (err) {
        console.error('Error fetching watchlist:', err);
      }
    };

    fetchWatchlist();
  }, []);

  const removeFromWatchlist = async (movieId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/user/watchlist/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist(res.data);
    } catch (err) {
      console.error('Error removing from watchlist:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Watchlist 🎥</h2>
       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {watchlist.map((movie, idx) => {
          const posterUrl = movie.posterPath
            ? `https://image.tmdb.org/t/p/w200${movie.posterPath}`
            : 'https://via.placeholder.com/200x300?text=No+Image';

          return (
            <div key={idx} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition">
                <Link to={`/movie/${movie.movieId}`}>
              <img src={posterUrl} alt={movie.title} className="w-full h-72 object-cover" />
              <h3 className="text-sm font-semibold mt-2 text-center">{movie.title}</h3>
              </Link>
              <button
                onClick={() => removeFromWatchlist(movie.movieId)}
                className="text-red-500 text-sm mt-2 block w-full"
              >
                ❌ Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Watchlist;
