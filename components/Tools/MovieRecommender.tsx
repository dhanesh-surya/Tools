import React, { useState, useEffect } from 'react';
import { Film, Star, Clock, Calendar, Search, RefreshCw, Sparkles } from 'lucide-react';
import { recommendMovies } from '../../services/geminiService';

interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string[];
  rating: number;
  duration: number;
  description: string;
  poster: string;
  director: string;
}

const MovieRecommender: React.FC = () => {
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('');
  const [year, setYear] = useState('');
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Documentary', 'Adventure', 'Crime', 'Fantasy'];
  const moods = ['Happy', 'Sad', 'Excited', 'Relaxed', 'Thoughtful', 'Adventurous', 'Romantic', 'Scary'];

  // Show initial recommendations on component mount
  useEffect(() => {
    getRecommendations();
  }, []);

  const getRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call AI API for movie recommendations
      const response = await recommendMovies(genre, mood, year);

      if (!response || response.includes('Error')) {
        throw new Error('Failed to get movie recommendations. Please try again.');
      }

      // Parse the JSON response
      const parsedResponse = JSON.parse(response);

      if (parsedResponse.movies && Array.isArray(parsedResponse.movies)) {
        // Add unique IDs and ensure proper structure
        const moviesWithIds = parsedResponse.movies.map((movie: any, index: number) => ({
          id: `ai-${Date.now()}-${index}`,
          title: movie.title || 'Unknown Title',
          year: movie.year || 2023,
          genre: Array.isArray(movie.genre) ? movie.genre : ['Unknown'],
          rating: movie.rating || 0,
          duration: movie.duration || 120,
          description: movie.description || 'No description available.',
          director: movie.director || 'Unknown Director',
          poster: movie.poster || '🎬'
        }));

        setRecommendedMovies(moviesWithIds);
      } else {
        throw new Error('Invalid response format from AI service.');
      }
    } catch (err) {
      console.error('Movie recommendation error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');

      // Fallback to some default movies if AI fails
      const fallbackMovies: Movie[] = [
        {
          id: 'fallback-1',
          title: 'The Shawshank Redemption',
          year: 1994,
          genre: ['Drama'],
          rating: 9.3,
          duration: 142,
          description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
          poster: '🎥',
          director: 'Frank Darabont'
        },
        {
          id: 'fallback-2',
          title: 'Inception',
          year: 2010,
          genre: ['Sci-Fi', 'Thriller'],
          rating: 8.8,
          duration: 148,
          description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
          poster: '🧠',
          director: 'Christopher Nolan'
        },
        {
          id: 'fallback-3',
          title: 'The Dark Knight',
          year: 2008,
          genre: ['Action', 'Crime', 'Drama'],
          rating: 9.0,
          duration: 152,
          description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
          poster: '🦇',
          director: 'Christopher Nolan'
        }
      ];
      setRecommendedMovies(fallbackMovies);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            <Sparkles className="text-white" size={24} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">AI Movie Recommender</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400">Get personalized movie suggestions powered by AI based on your preferences</p>
      </div>

      {/* Preferences Form */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Preferred Genre
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
            >
              <option value="">Any Genre</option>
              {genres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Mood/Feeling
            </label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
            >
              <option value="">Any Mood</option>
              {moods.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Release Year (approx)
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g., 2020"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
            />
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={getRecommendations}
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mx-auto"
          >
            {isLoading ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                AI is thinking...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Get AI Recommendations
              </>
            )}
          </button>
        </div>
      </div>

      {/* Movie Recommendations */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles size={48} className="text-purple-500 animate-pulse" />
            <RefreshCw size={48} className="text-indigo-500 animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
            AI is analyzing your preferences...
          </h3>
          <p className="text-slate-500 dark:text-slate-500">
            Finding the perfect movies just for you!
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Unable to get AI recommendations
          </h3>
          <p className="text-slate-500 dark:text-slate-500 mb-4">
            {error}
          </p>
          <button
            onClick={getRecommendations}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 mx-auto"
          >
            <RefreshCw size={20} />
            Try Again
          </button>
        </div>
      ) : recommendedMovies.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="text-purple-500" size={24} />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">AI-Powered Recommendations</h3>
            </div>
            <button
              onClick={getRecommendations}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
            >
              <RefreshCw size={16} />
              Get New Suggestions
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedMovies.map((movie) => (
                <div key={movie.id} className="group bg-white dark:bg-slate-900 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border-2 border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 relative">
                  {/* AI Badge */}
                  <div className="absolute top-3 left-3 z-20">
                    <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                      <Sparkles size={10} />
                      AI
                    </div>
                  </div>
                <div className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{movie.poster}</div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {movie.title}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{movie.year}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                      <Star size={16} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">{movie.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                      <Clock size={14} />
                      {movie.duration}m
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {movie.genre.map((g, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full border border-indigo-200 dark:border-indigo-800"
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                    {movie.description}
                  </p>

                  <div className="text-xs text-slate-500 dark:text-slate-500 border-t border-slate-200 dark:border-slate-700 pt-3">
                    <span className="font-medium">Directed by:</span> {movie.director}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Film size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
          <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
            Ready for Movie Night?
          </h3>
          <p className="text-slate-500 dark:text-slate-500">
            Select your preferences above and discover your next favorite movie!
          </p>
        </div>
      )}
    </div>
  );
};

export default MovieRecommender;