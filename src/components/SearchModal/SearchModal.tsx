import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { searchMoviesByTitle } from "../../api/moviesApi";
import { Movie } from "../../types/movie";
import { X } from "lucide-react";
import "./index.css";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({
  isOpen,
  onClose,
}: SearchModalProps): JSX.Element | null {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setMovies([]);
      setErrorMessage("");
      return;
    }

    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      setMovies([]);
      setErrorMessage("");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      loadMovies(normalizedQuery);
    }, 400);
    return () => window.clearTimeout(timeoutId);
  }, [query, isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") onClose();
    }

    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  async function loadMovies(title: string): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const moviesData = await searchMoviesByTitle(title);
      setMovies(moviesData);
    } catch (error) {
      setErrorMessage("Search failed");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="search-overlay" onClick={onClose} />
      <div
        className="search-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="search-modal__close btn-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X />
        </button>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          className="search-modal__input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        {query.trim() && (
          <div className="search-modal__results">
            {isLoading && <p>Searching movies...</p>}

            {!isLoading && errorMessage && (
              <p className="search-modal__error">{errorMessage}</p>
            )}

            {!isLoading && !errorMessage && movies.length === 0 && (
              <p>Nothing found.</p>
            )}

            {!isLoading &&
              movies.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className="search-result"
                  onClick={onClose}
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="search-result__image"
                  />
                  <div className="search-result__content">
                    <h3 className="search-result__title">{movie.title}</h3>
                    <p className="search-result__meta">
                      {movie.releaseYear} • Rating {movie.imdbRating}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </>
  );
}
