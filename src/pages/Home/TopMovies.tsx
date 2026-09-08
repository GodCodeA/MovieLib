import { Movie } from "../../types/movie";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface TopMoviesProps {
  movies: Movie[];
}

export default function TopMovies({ movies }: TopMoviesProps): JSX.Element {
  return (
    <section className="home__top">
      <div className="home__top-header">
        <div>
          <p className="home__top-eyebrow">Evening selection</p>
          <h2 className="home__top-title">Top 10 movies</h2>
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
          slidesPerView={2}
          slidesPerGroup={1}
          spaceBetween={10}
          speed={300}
          navigation
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 18 },
          }}
        >
          {movies.map((movie) => (
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
    </section>
  );
}
