import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getRandomMovie, getTopMovies } from "../../api/moviesApi";
import { Movie } from "../../types/movie";
import formatRuntime from "../../utils/formatRuntime";
import "./index.css";

export function HomePage(): JSX.Element {
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [loadRandomMovie, setLoadRandomMovie] = useState(false);

  useEffect(() => {
    loadHomePageData();
  }, []);

  async function loadHomePageData(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [randomMovieData, topMoviesData] = await Promise.all([
        getRandomMovie(),
        getTopMovies(),
      ]);

      setRandomMovie(randomMovieData);
      const top = topMoviesData.slice(0, 9);
      setTopMovies(top);
    } catch (error) {
      setErrorMessage("Failed to load movies :(");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadNextRandomMovie(): Promise<void> {
    try {
      setErrorMessage("");
      setLoadRandomMovie(true);
      const movie = await getRandomMovie();
      setRandomMovie(movie);
    } catch (error) {
      setErrorMessage("Failed to load random movie");
    } finally {
      setLoadRandomMovie(false);
    }
  }

  function shortMoviePlot(plot: string) {
    if (plot.length <= 160) {
      return plot;
    }

    return plot.slice(0, 160) + "...";
  }

  if (isLoading) {
    return <p className="home__page-loading">Loading homepage...</p>;
  }

  if (errorMessage) {
    return (
      <div className="home__error">
        <p className="home__error-message">{errorMessage}</p>
        <button
          className="home__error-btn"
          type="button"
          onClick={loadHomePageData}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="home">
      {randomMovie && (
        <div
          className="home__hero"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(9, 11, 15, 0.94) 0%, rgba(9, 11, 15, 0.88) 45%, rgba(9, 11, 15, 0.52) 100%), url(${randomMovie.backdropUrl ?? randomMovie.posterUrl})`,
          }}
        >
          <div className="home__hero-content">
            <p className="home__hero-eyebrow">
              MovieLib — choose a movie in seconds
            </p>
            <h1 className="home__hero-title" title={randomMovie.title}>
              {randomMovie.title}
            </h1>
            <p className="home__hero-subtitle">
              A random movie, genre collections, and top 9 — the perfect idea
              for the evening.
            </p>
            <p
              className="home__hero-top-rating"
              title="Movie with rating above 8.5"
            >
              {randomMovie.imdbRating >= 7.5
                ? `Top rating • ${randomMovie.imdbRating}`
                : null}
            </p>

            <div className="home__hero-meta">
              <span>{randomMovie.releaseYear}</span>
              <span>IMDb {randomMovie.imdbRating}/10</span>
              <span>{formatRuntime(randomMovie.runtime)}</span>
            </div>

            <p className="home__hero-description">
              {shortMoviePlot(randomMovie.plot)}
            </p>

            <div className="home__hero-genres">
              {randomMovie.genres.slice(0, 4).map((genre) => (
                <span key={genre} className="home__hero-genre">
                  {genre}
                </span>
              ))}
            </div>

            <div className="home__hero-actions">
              <Link
                to={`/movie/${randomMovie.id}`}
                className="home__hero-button home__hero-button_primary"
                title="Go to movie page"
              >
                View movie
              </Link>

              <button
                type="button"
                className="home__hero-button home__hero-button_secondary"
                onClick={loadNextRandomMovie}
                disabled={loadRandomMovie}
                title={
                  !loadRandomMovie
                    ? "Show another random movie"
                    : "Loading another movie"
                }
              >
                {loadRandomMovie === true
                  ? "Loading movie..."
                  : "Another movie"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="home__top">
        <div className="home__top-header">
          <div>
            <p className="home__top-eyebrow">Evening selection</p>
            <h2 className="home__top-title">Top 9 movies</h2>
            <p className="home__top-subtitle">
              A quick choice for your evening movie — high-rated films.
            </p>
          </div>

          <Link to="/genres" className="home__top-link">
            View genres
          </Link>
        </div>

        <div className="home__top-list">
          <Swiper
            modules={[Navigation]}
            loop={true}
            watchOverflow={false}
            centeredSlides={false}
            slidesPerView={3}
            slidesPerGroup={4}
            spaceBetween={10}
            speed={300}
            navigation
            breakpoints={{
              640: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 18 },
              900: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 18 },
            }}
          >
            {topMovies.map((movie) => (
              <SwiperSlide key={movie.id}>
                <Link to={`/movie/${movie.id}`} className="home__top-card">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="home__top-card-image"
                    title={movie.title}
                  />

                  <div className="home__top-card-content">
                    <h3 className="home__top-card-title">{movie.title}</h3>
                    <p className="home__top-card-meta">
                      {movie.releaseYear} • IMDb {movie.imdbRating}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
