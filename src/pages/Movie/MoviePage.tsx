import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  addMovieToFavorites,
  getMovieById,
  removeMovieFromFavorites,
  getMoviesByGenre,
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
import Loader from "../../components/Loader/loader";

export function MoviePage(): JSX.Element {
  const { movieId = "" } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isSimilarLoading, setIsSimilarLoading] = useState(false);
  const [similarError, setSimilarError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const isAuthorized = useAppSelector((state) => state.user.isAuthorized);
  const favoriteMovies = useAppSelector((state) => state.favorites.movies);

  useEffect(() => {
    let cancelled = false;

    async function loadMovie(): Promise<void> {
      try {
        setIsLoading(true);
        setErrorMessage("");
        setMovie(null);

        const movieData = await getMovieById(movieId);

        if (!cancelled) {
          setMovie(movieData);
        }
      } catch {
        if (!cancelled) {
          setErrorMessage("Failed to load movie");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadMovie();

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  useEffect(() => {
    if (!movie || movie.genres.length === 0) {
      setSimilarMovies([]);
      setSimilarError("");
      setIsSimilarLoading(false);
      return;
    }

    const currentMovie = movie;

    let cancelled = false;

    async function loadSimilarMovies(): Promise<void> {
      try {
        setIsSimilarLoading(true);
        setSimilarError("");

        const movieLists = await Promise.all(
          currentMovie.genres.map((genre) => getMoviesByGenre(genre)),
        );

        if (cancelled) {
          return;
        }

        const uniqueMovies = new Map<number, Movie>();

        movieLists.flat().forEach((candidate) => {
          if (candidate.id !== currentMovie.id) {
            uniqueMovies.set(candidate.id, candidate);
          }
        });

        const countMatches = (first: string[], second: string[]) =>
          first.filter((item) => second.includes(item)).length;

        const getSimilarityScore = (candidate: Movie) =>
          countMatches(currentMovie.genres, candidate.genres) * 3 +
          countMatches(currentMovie.movieStars, candidate.movieStars) * 2 +
          countMatches(currentMovie.director, candidate.director) * 2;

        const sortedMovies = [...uniqueMovies.values()].sort(
          (first, second) => {
            const scoreDifference =
              getSimilarityScore(second) - getSimilarityScore(first);

            return scoreDifference || second.imdbRating - first.imdbRating;
          },
        );

        setSimilarMovies(sortedMovies.slice(0, 8));
      } catch {
        if (!cancelled) {
          setSimilarError("Failed to load similar movies");
        }
      } finally {
        if (!cancelled) {
          setIsSimilarLoading(false);
        }
      }
    }

    void loadSimilarMovies();

    return () => {
      cancelled = true;
    };
  }, [movie]);

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
    return (
      <div className="movie__loader-wrapper">
        <Loader />
      </div>
    );
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
              width={480}
              height={720}
            />
          </div>
          <h1 className="movie__title" title={movie.title}>
            {movie.title}
          </h1>
          <div className="movie__actions">
            <button
              type="button"
              className="movie__button-favorite btn btn-favorite"
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

            {errorMessage && <p className="movie__error">{errorMessage}</p>}
          </div>
        </div>
        <h2 className="movie__story-title">Storyline</h2>
        <p className="movie__description">{movie.plot}</p>
        {movie.youtubeId && (
          <div className="movie__trailer">
            <h2 className="movie__story-title">Trailer</h2>

            <div className="movie__trailer-player">
              <iframe
                className="movie__trailer-iframe"
                src={`https://www.youtube.com/embed/${movie.youtubeId}`}
                title={`Trailer for ${movie.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        )}
        <section className="movie__similar">
          <h2 className="movie__story-title">Similar movies</h2>

          {isSimilarLoading && <p>Loading similar movies...</p>}
          {similarError && <p className="movie__error">{similarError}</p>}

          {!isSimilarLoading && !similarError && similarMovies.length === 0 && (
            <p>Similar movies not found.</p>
          )}

          {!isSimilarLoading && !similarError && similarMovies.length > 0 && (
            <Swiper
              className="movie__similar-swiper"
              modules={[Navigation, Mousewheel]}
              loop={true}
              navigation
              mousewheel={{ forceToAxis: true }}
              watchOverflow
              slidesPerView={2}
              slidesPerGroup={1}
              spaceBetween={12}
              breakpoints={{
                640: { slidesPerView: 3, spaceBetween: 16 },
                1024: { slidesPerView: 5, spaceBetween: 20 },
              }}
            >
              {similarMovies.map((similarMovie) => (
                <SwiperSlide key={similarMovie.id}>
                  <Link
                    to={`/movie/${similarMovie.id}`}
                    className="movie__similar-card"
                  >
                    <img
                      src={similarMovie.posterUrl}
                      alt={similarMovie.title}
                      className="movie__similar-poster"
                      loading="lazy"
                    />
                    <h3 className="movie__similar-title">
                      {similarMovie.title}
                    </h3>
                    <p className="movie__similar-meta">
                      {similarMovie.releaseYear} · IMDb{" "}
                      {similarMovie.imdbRating}
                    </p>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </section>
      </div>
    </section>
  );
}
