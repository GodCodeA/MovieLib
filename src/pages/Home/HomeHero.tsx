import { Movie } from "../../types/movie";
import { Link } from "react-router-dom";
import formatRuntime from "../../utils/formatRuntime";
import shortMoviePlot from "../../utils/shortMoviePlot";

interface HomeHeroProps {
  movie: Movie;
  onNextMovie: () => void;
  isLoading: boolean;
}

export default function HomeHero({
  movie,
  onNextMovie,
  isLoading,
}: HomeHeroProps): JSX.Element {
  return (
    <div
      className="home__hero"
      style={{
        backgroundImage: ` linear-gradient(
    90deg,
    rgba(9, 11, 15, 0.9) 0%,
    rgba(9, 11, 15, 0.56) 42%,
    rgba(9, 11, 15, 0.16) 100%
  ),
  linear-gradient(
    0deg,
    rgba(9, 11, 15, 0.82) 0%,
    transparent 55%
  ), url(${movie.backdropUrl ?? movie.posterUrl})`,
      }}
    >
      <div className="home__hero-content">
        <p className="home__hero-eyebrow">
          MovieLib — choose a movie in seconds
        </p>
        <h1 className="home__hero-title" title={movie.title}>
          {movie.title}
        </h1>
        <p className="home__hero-subtitle">
          A random movie, genre collections, and top 9 — the perfect idea for
          the evening.
        </p>
        <p
          className="home__hero-top-rating"
          title="Movie with rating above 8.5"
        >
          {movie.imdbRating >= 7.5 ? `Top rating • ${movie.imdbRating}` : null}
        </p>

        <div className="home__hero-meta">
          <span>{movie.releaseYear}</span>
          <span>IMDb {movie.imdbRating}/10</span>
          <span>{formatRuntime(movie.runtime)}</span>
        </div>

        <p className="home__hero-description">{shortMoviePlot(movie.plot)}</p>

        <div className="home__hero-genres">
          {movie.genres.slice(0, 4).map((genre) => (
            <span key={genre} className="home__hero-genre">
              {genre}
            </span>
          ))}
        </div>

        <div className="home__hero-actions">
          <Link
            to={`/movie/${movie.id}`}
            className="home__hero-button home__hero-button_primary"
            title="Go to movie page"
          >
            View movie
          </Link>

          <button
            type="button"
            className="home__hero-button home__hero-button_secondary"
            onClick={onNextMovie}
            disabled={isLoading}
            title={
              !isLoading ? "Show another random movie" : "Loading another movie"
            }
          >
            {isLoading === true ? "Loading movie..." : "Another movie"}
          </button>
        </div>
      </div>
    </div>
  );
}
