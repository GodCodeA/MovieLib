import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getMoviesByGenre } from "../../api/moviesApi";
import { Movie } from "../../types/movie";
import "./index.css";

const MOVIES_PORTION_SIZE = 10;

export function GenreDetailsPage(): JSX.Element {
  const { genreName = "" } = useParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [visibleMoviesCount, setVisibleMoviesCount] =
    useState(MOVIES_PORTION_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const observerTargetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadMoviesByGenre();
  }, [genreName]);

  useEffect(() => {
    if (!observerTargetRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry.isIntersecting) {
          return;
        }

        setVisibleMoviesCount((currentValue) => {
          if (currentValue >= movies.length) {
            return currentValue;
          }

          return currentValue + MOVIES_PORTION_SIZE;
        });
      },
      {
        threshold: 0.2,
      },
    );

    observer.observe(observerTargetRef.current);

    return () => observer.disconnect();
  }, [movies.length]);

  async function loadMoviesByGenre(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setVisibleMoviesCount(MOVIES_PORTION_SIZE);

      const moviesData = await getMoviesByGenre(genreName);
      const sortedMovies = [...moviesData].sort((firstMovie, secondMovie) => {
        return secondMovie.imdbRating - firstMovie.imdbRating;
      });

      setMovies(sortedMovies);
    } catch (error) {
      setErrorMessage("Failed to load genre movies");
    } finally {
      setIsLoading(false);
    }
  }

  const visibleMovies = movies.slice(0, visibleMoviesCount);
  const hasMoreMovies = visibleMoviesCount < movies.length;

  if (isLoading) {
    return <p>Loading movies</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }
  return (
    <section className="genre-details">
      <div className="container">
        <h1 className="genre-details__title">Genre: {genreName}</h1>

        <div className="genre-details__grid">
          {visibleMovies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="genre-details__card"
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="genre-details__image"
              />
              <div className="genre-details__content">
                <h2 className="genre-details__movie-title">{movie.title}</h2>
                <p className="genre-details__rating">
                  Rating: {movie.imdbRating}
                </p>
                <p className="genre-details__year">{movie.releaseYear}</p>
              </div>
            </Link>
          ))}
        </div>

        {hasMoreMovies && (
          <div
            ref={observerTargetRef}
            className="genre-details__loader-trigger"
          >
            Loading more movies...
          </div>
        )}
      </div>
    </section>
  );
}
