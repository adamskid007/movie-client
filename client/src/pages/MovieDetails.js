import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const MovieDetails = () => {
  const { id } = useParams(); // Get movie ID from URL
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState('');
  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;
  const currentUserId = decoded?.id;
  const [editingReview, setEditingReview] = useState(null);





useEffect(() => {
const fetchDetails = async () => {
  try {
    // Fetch movie details
    const movieRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
    );
    setMovie(movieRes.data);

    // Fetch trailer
    const videoRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
    );
    const trailer = videoRes.data.results.find(
      (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
    );
    setTrailerKey(trailer?.key);

    // ✅ Fetch user's saved favorites
    const token = localStorage.getItem('token');
    const favRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFavorites(favRes.data);

    // ✅ Check if this movie is already saved
    const found = favRes.data.find((m) => m.movieId === id);
    setIsFavorite(!!found);
    // Fetch watchlist
    const watchlistRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/watchlist`, {
    headers: { Authorization: `Bearer ${token}` },
    });
    const watchlistMatch = watchlistRes.data.find((m) => m.movieId === id);
    setIsInWatchlist(!!watchlistMatch);

    const reviewsRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/reviews/${id}`);
    setReviews(reviewsRes.data);


  } catch (err) {
    console.error('Error loading data:', err);
  }
};


  fetchDetails();
}, [id]);
    const handleFavoriteToggle = async () => {
    const token = localStorage.getItem('token');

    if (isFavorite) {
        // Remove
        try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/user/favorites/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(false);
        } catch (err) {
        console.error('Error removing favorite:', err);
        }
    } else {
        // Add
        try {
        await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/user/favorites`,
            {
            movieId: movie.id.toString(), // match DB format
            title: movie.title,
            posterPath: movie.poster_path,
            releaseDate: movie.release_date,
            },
            {
            headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log('User favorites:', favorites);

        setIsFavorite(true);
        } catch (err) {
        console.error('Error saving favorite:', err);
        }
    }
    };
    const handleWatchlistToggle = async () => {
    const token = localStorage.getItem('token');

    if (isInWatchlist) {
        // Remove from watchlist
        try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/user/watchlist/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setIsInWatchlist(false);
        } catch (err) {
        console.error('Error removing from watchlist:', err);
        }
    } else {
        // Add to watchlist
        try {
        await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/user/watchlist`,
            {
            movieId: movie.id.toString(),
            title: movie.title,
            posterPath: movie.poster_path,
            releaseDate: movie.release_date,
            },
            {
            headers: { Authorization: `Bearer ${token}` },
            }
        );
        setIsInWatchlist(true);
        } catch (err) {
        console.error('Error adding to watchlist:', err);
        }
    }
    };
    const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
        const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/reviews/${id}`,
        { reviewText, rating },
        { headers: { Authorization: `Bearer ${token}` } }
        );
        if (editingReview) {
        // Replace the updated review in state
        setReviews((prev) =>
            prev.map((r) => (r._id === res.data._id ? res.data : r))
        );
        setEditingReview(null);
        } else {
        setReviews((prev) => [res.data, ...prev]);
        }


        setReviews((prev) => [res.data, ...prev]); // Add new review to top
        setReviewText('');
        setRating('');
    } catch (err) {
        console.error('Error submitting review:', err);
    }
    };
    const handleEditStart = (review) => {
    setEditingReview(review);
    setReviewText(review.reviewText);
    setRating(review.rating);
    };

    const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/reviews/delete/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
        });

        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
        console.error('Error deleting review:', err);
    }
    };





  if (!movie) return  <div className="text-center mt-10">Loading...</div>;

return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-gray-800">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline">
        ⬅ Back
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-1/3 rounded-lg shadow-md"
        />

        <div className="flex-1 space-y-3">
          <h2 className="text-3xl font-bold">{movie.title}</h2>
          <p className="text-sm text-gray-500"><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>⭐ Rating:</strong> {movie.vote_average}</p>
          <p><strong>🎭 Genres:</strong> {movie.genres.map((g) => g.name).join(', ')}</p>
          <p className="text-gray-700">{movie.overview}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={handleFavoriteToggle}
              className={`px-4 py-2 rounded ${isFavorite ? 'bg-red-500' : 'bg-green-600'} text-white`}
            >
              {isFavorite ? '❤️ Remove from Favorites' : '❤️ Add to Favorites'}
            </button>
            <button
              onClick={handleWatchlistToggle}
              className={`px-4 py-2 rounded ${isInWatchlist ? 'bg-yellow-600' : 'bg-blue-600'} text-white`}
            >
              {isInWatchlist ? '🎬 Remove from Watchlist' : '🎬 Add to Watchlist'}
            </button>
          </div>
        </div>
      </div>

      {trailerKey && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Watch Trailer</h3>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full rounded"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Trailer"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
        <form onSubmit={handleReviewSubmit} className="space-y-3">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full p-3 border rounded"
            placeholder="Your review..."
            required
          />
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Rating (1–10)"
            min="1"
            max="10"
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingReview ? 'Update Review' : 'Submit Review'}
          </button>
        </form>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">User Reviews</h3>
        {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
        {reviews.map((r) => (
          <div key={r._id} className="border-t pt-4 mt-4">
            <p className="text-sm text-gray-700">
              <strong>{r.username || 'Anonymous'}</strong> — {r.rating}/10
            </p>
            <p>{r.reviewText}</p>
            {r.userId === currentUserId && (
              <div className="mt-2 space-x-2">
                <button onClick={() => handleEditStart(r)} className="text-blue-500 text-sm">
                  ✏️ Edit
                </button>
                <button onClick={() => handleDeleteReview(r._id)} className="text-red-500 text-sm">
                  ❌ Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetails;
