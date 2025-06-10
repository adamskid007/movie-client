import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [defaultMovies, setDefaultMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc'); // default sort
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
    


  // Load popular movies on home load
  useEffect(() => {
    const fetchDefaultMovies = async (pageNum = 1) => {
    try {
        const res = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=${pageNum}`
        );
        setDefaultMovies((prev) => [...prev, ...res.data.results]);
        setHasMore(res.data.page < res.data.total_pages);
    } catch (err) {
        console.error('Error loading default movies:', err);
    }
    };

    fetchDefaultMovies(page);
  }, [page]);

  // Fetch genres for filter
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
        );
        setGenres(res.data.genres);
      } catch (err) {
        console.error('Error loading genres:', err);
      }
    };
    fetchGenres();
  }, []);

  const searchMovies = async () => {
    if (!query.trim()) return;

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${query}&language=en-US`;

    if (year) url += `&year=${year}`;
    if (genre) url += `&with_genres=${genre}`;

    try {
      const res = await axios.get(url);
      // Sort results manually since TMDB /search doesn't support sort_by
      const sorted = [...res.data.results].sort((a, b) => {
        if (sortBy === 'popularity.desc') return b.popularity - a.popularity;
        if (sortBy === 'release_date.desc') return new Date(b.release_date) - new Date(a.release_date);
        if (sortBy === 'vote_average.desc') return b.vote_average - a.vote_average;
        return 0;
      });

      setSearchResults(sorted);
    } catch (err) {
      console.error('Error searching movies:', err);
    }
  };

  const saveToFavorites = async (movie) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in to save favorites');

    try {
      await axios.post(
        `${API_BASE_URL}/user/favorites`,
        {
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          releaseDate: movie.release_date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(`${movie.title} saved to favorites!`);
    } catch (err) {
      console.error('Error saving favorite:', err);
      alert(err.response?.data?.msg || 'Error saving movie');
    }
  };

  const moviesToShow = searchResults.length > 0 ? searchResults : defaultMovies;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Search for Movies 🎬</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="p-2 border rounded w-24"
        />

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="popularity.desc">Sort by Popularity</option>
          <option value="release_date.desc">Sort by Release Date</option>
          <option value="vote_average.desc">Sort by Rating</option>
        </select>
      </div>
          <button
            onClick={() => {
                setQuery('');
                setYear('');
                setGenre('');
                setSortBy('popularity.desc');
                setSearchResults([]);
                }}
                className="bg-gray-300 text-sm text-black px-3 py-1 rounded hover:bg-gray-400 m-2"
                >
                Reset Filters
          </button>


      {/* Search Bar */}
<div className="flex flex-col sm:flex-row gap-2 mb-6">
  <input
    type="text"
    placeholder="Search for a movie..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500"
  />
  <button
    onClick={searchMovies}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
  >
    🔍 Search
  </button>
</div>

      {/* Movie Results */}
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
  {[...new Map(moviesToShow.map(movie => [movie.id, movie])).values()].map((movie) => (
    <div
      key={movie.id}
      className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
    > 
    <Link to={`/movie/${movie.id}`}>
      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-60 object-cover"
        />
      )}
       </Link>
      <div className="p-4">
        <h4 className="font-semibold text-lg mb-1">{movie.title}</h4>
       
        <p className="text-sm text-gray-600">📅 {movie.release_date}</p>
        <p className="text-sm text-yellow-500">⭐ {movie.vote_average}</p>
        <button
          onClick={() => saveToFavorites(movie)}
          className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white py-1 rounded"
        >
          ❤️ Save to Favorites
        </button>
      </div>
    </div>
  ))}
</div>


      {searchResults.length === 0 && hasMore && (
        <div className="mt-6 text-center">
            <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
            Load More
            </button>
        </div>
        )}

    </div>
    </div>
  );
};

export default Home;
