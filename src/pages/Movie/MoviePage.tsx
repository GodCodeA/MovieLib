import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  addMovieToFavorites,
  getMovieById,
  removeMovieFromFavorites,
} from "../../api/moviesApi";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  addFavoriteMovie,
  removeFavoriteMovie,
} from "../../store/favoritesSlice";
import { Movie } from "../../types/movie";
import formatRuntime from "../../utils/formatRuntime";
import formatNumber from "../../utils/formatNumber";
import "./index.css";

export function MoviePage(): JSX.Element {
  const { movieId = "" } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const isAuthorized = useAppSelector((state) => state.user.isAuthorized);
  const favoriteMovies = useAppSelector((state) => state.favorites.movies);

  useEffect(() => {
    loadMovie();
  }, [movieId]);

  async function loadMovie(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const movieData = await getMovieById(movieId);
      setMovie(movieData);
    } catch (error) {
      setErrorMessage("Failed to load movie");
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleFavoriteMovie(): Promise<void> {
    if (!movie) {
      return;
    }

    if (!isAuthorized) {
      navigate(`/movie/${movie.id}`, {
        state: { openAuthModal: true },
      });
      return;
    }

    try {
      setIsFavoriteLoading(true);
      setErrorMessage("");

      if (isFavorite) {
        await removeMovieFromFavorites(String(movie.id));
        dispatch(removeFavoriteMovie(movie.id));
        return;
      }

      await addMovieToFavorites(String(movie.id));
      dispatch(addFavoriteMovie(movie));
    } catch (error: any) {
      setErrorMessage(
        isFavorite
          ? "Failed to remove movie from favorites"
          : "Failed to add movie to favorites",
      );
    } finally {
      setIsFavoriteLoading(false);
    }
  }

  if (isLoading) {
    return <p>Loading movie...</p>;
  }

  if (errorMessage && !movie) {
    return <p>{errorMessage}</p>;
  }

  if (!movie) {
    return <p>Movie not found</p>;
  }

  const isFavorite = favoriteMovies.some(
    (favoriteMovie) => favoriteMovie.id === movie.id,
  );

  return (
    <section className="movie">
      <div className="container">
        <div className="movie__wrapper">
          <div className="movie__poster-wrapper">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="movie__poster"
              title={movie.title}
            />
          </div>
          <h1 className="movie__title" title={movie.title}>
            {movie.title}
          </h1>
          <div className="movie__actions">
            <button
              type="button"
              className="movie__button-favorite btn"
              onClick={toggleFavoriteMovie}
              disabled={isFavoriteLoading}
              title={
                isFavoriteLoading
                  ? isFavorite
                    ? "Removing movie from favorites"
                    : "Adding movie to favorites"
                  : isFavorite
                    ? "Remove movie from favorites"
                    : "Add movie to favorites"
              }
            >
              {isFavoriteLoading
                ? isFavorite
                  ? "Removing..."
                  : "Adding..."
                : isFavorite
                  ? "Remove from favorites"
                  : "Add to favorites"}
            </button>
          </div>
          <div className="movie__info">
            <div className="movie__data-info">
              <div className="movie__text">
                <span className="movie__text-title">Year:</span>
                <span className="movie__data-text">{movie.releaseYear}</span>
              </div>
              <div className="movie__text">
                <span className="movie__text-title">Rating IMDb:</span>
                <span className="movie__data-text">
                  <span>{movie.imdbRating} </span>
                  <span className="movie__text-gray">
                    ({formatNumber(movie.quantityImdbRating)})
                  </span>
                </span>
              </div>
              <div className="movie__text">
                <span className="movie__text-title">Runtime:</span>
                <span className="movie__data-text">
                  {formatRuntime(movie.runtime)}
                </span>
              </div>
              <div className="movie__text">
                <span className="movie__text-title">Budget:</span>
                <span className="movie__data-text">
                  $ {formatNumber(movie.budget)}
                </span>
              </div>
              <div className="movie__text">
                <span className="movie__text-title">Gross worldwide:</span>
                <span className="movie__data-text">
                  $ {formatNumber(movie.worldEarning)}
                </span>
              </div>
              <div className="movie__text">
                <span className="movie__text-title">Director:</span>
                <span className="movie__data-text">
                  {movie.director.join(", ")}
                </span>
              </div>
              <div className="movie__text">
                <span className="movie__text-title">Writer:</span>
                <span className="movie__data-text">
                  {movie.writer.join(", ")}
                </span>
              </div>
              <div className="movie__text">
                <span className="movie__text-title">Producer:</span>
                <span className="movie__data-text">
                  {movie.producer.join(", ")}
                </span>
              </div>
              <div className="movie__text">
                <span className="movie__text-title">Composer:</span>
                <span className="movie__data-text">
                  {movie.composer.join(", ")}
                </span>
              </div>
              <div className="movie__text">
                <span className="movie__text-title">Cast:</span>
                <span className="movie__data-text">
                  {movie.movieStars.join(", ")}
                </span>
              </div>
              <div className="movie__text">
                <span className="movie__text-title">Country:</span>
                <span className="movie__data-text">
                  {movie.country.join(", ")}
                </span>
              </div>
              <div className="movie__text">
                <span className="movie__text-title">Genres:</span>
                <span className="movie__data-text">
                  {movie.genres.join(", ")}
                </span>
              </div>
              <div className="movie__text">
                <span className="movie__text-title">Rating MPPA:</span>
                <span className="movie__data-text">{movie.ratingMPPA}</span>
              </div>
              <div className="movie__text">
                <span className="movie__text-title">Age:</span>
                <span className="movie__data-text">{movie.ageWatch}</span>
              </div>
            </div>

            {errorMessage && <p className="auth-form__error">{errorMessage}</p>}
          </div>
        </div>
        <h2 className="movie__story-title">Storyline</h2>
        <p className="movie__description">{movie.plot}</p>
        {movie.trailerDailyMotionId && (
          <div className="movie__trailer">
            <h2 className="movie__story-title">Trailer</h2>

            <div className="movie__trailer-player">
              <iframe
                src={`https://www.dailymotion.com/embed/video/${movie.trailerDailyMotionId}`}
                title={`Trailer for ${movie.title}`}
                width="640"
                height="360"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
