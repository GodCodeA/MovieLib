import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { getMovies } from "../../api/moviesApi";
import Loader from "../../components/Loader/loader";
import { Movie } from "../../types/movie";
import "./index.css";

export function MoviesPage(): JSX.Element {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    if (!isLoading && !errorMessage) {
      searchInputRef.current?.focus();
    }
  }, [isLoading, errorMessage]);

  async function loadMovies(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setMovies(await getMovies());
    } catch (error) {
      setErrorMessage("Failed to load movies");
    } finally {
      setIsLoading(false);
    }
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(normalizedQuery),
  );

  if (isLoading) {
    return (
      <div className="movies__loader-wrapper">
        <Loader />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <section className="movies">
        <div className="container">
          <p>{errorMessage}</p>
          <button type="button" onClick={loadMovies}>
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="movies">
      <div className="container">
        <h1 className="movies__title">Search</h1>
        <div className="movies__search" role="search">
          <div className="movies__search-field">
            <input
              ref={searchInputRef}
              type="search"
              className="movies__search-input"
              placeholder="Search movies..."
              aria-label="Search movies by title"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Search
              className="movies__search-icon"
              size={18}
              aria-hidden="true"
            />
          </div>
        </div>

        {movies.length === 0 ? (
          <p>No movies available.</p>
        ) : filteredMovies.length === 0 ? (
          <p>No movies found.</p>
        ) : (
          <div className="movies__grid">
            {filteredMovies.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="movies__card"
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="movies__poster"
                  loading="lazy"
                />
                <div className="movies__content">
                  <h3 className="movies__movie-title">{movie.title}</h3>
                  <p className="movies__meta">
                    {movie.releaseYear} · Rating {movie.imdbRating}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}