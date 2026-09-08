import { useEffect, useState } from "react";
import { getRandomMovie, getTopMovies } from "../../api/moviesApi";
import { Movie } from "../../types/movie";
import HomeHero from "./HomeHero";
import TopMovies from "./TopMovies";
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
      const top = topMoviesData.slice(0, 10);
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
    <>
      <div className="container">
        {randomMovie && (
          <HomeHero
            movie={randomMovie}
            onNextMovie={loadNextRandomMovie}
            isLoading={loadRandomMovie}
          />
        )}
        <TopMovies movies={topMovies} />
      </div>
    </>
  );
}
