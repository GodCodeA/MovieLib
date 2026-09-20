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
  const searchRequestId = useRef(0);

  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const normalizedQuery = query.trim();
    const requestId = ++searchRequestId.current;

    if (!isOpen || !normalizedQuery) {
      if (!isOpen) return;

      setMovies([]);
      setErrorMessage("");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      loadMovies(normalizedQuery, controller.signal, requestId);
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, isOpen]);

  useEffect(() => {
    if (isOpen && shouldRender && !isClosing) {
      inputRef.current?.focus();
    }
  }, [isOpen, shouldRender, isClosing]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") onClose();
    }

    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
    }
  }, [isOpen, shouldRender]);

  function resetSearch(): void {
    searchRequestId.current += 1;
    setQuery("");
    setMovies([]);
    setErrorMessage("");
    setIsLoading(false);
  }

  async function loadMovies(
    title: string,
    signal: AbortSignal,
    requestId: number,
  ): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const moviesData = await searchMoviesByTitle(title, signal);

      if (requestId !== searchRequestId.current) return;

      setMovies(moviesData);
    } catch (error) {
      if (signal.aborted || requestId !== searchRequestId.current) return;

      setErrorMessage("Search failed");
    } finally {
      if (requestId !== searchRequestId.current) return;

      setIsLoading(false);
    }
  }

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <div
        className={`search-overlay ${isClosing ? "search-overlay__closing" : ""}`}
        onClick={onClose}
      />
      <div
        className={`search-modal ${isClosing ? "search-modal__closing" : ""}`}
        onClick={(event) => event.stopPropagation()}
        onAnimationEnd={(event) => {
          if (isClosing && event.target === event.currentTarget) {
            resetSearch();
            setShouldRender(false);
          }
        }}
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
                    loading="lazy"
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
