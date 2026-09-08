import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGenres } from "../../api/moviesApi";
import { Genre } from "../../types/genre";
import { getGenreImage } from "../../utils/genreImages";
import "./index.css";

export function GenresPage(): JSX.Element {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadGenres();
  }, []);

  async function loadGenres(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const genresData = await getGenres();
      const preparedGenres = genresData.map((genreName) => ({
        name: genreName,
        imageUrl: getGenreImage(genreName),
      }));

      setGenres(preparedGenres);
    } catch (error) {
      setErrorMessage("Failed to load genres");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <p>Loading genres...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <section className="genres">
      <div className="container">
        <h1 className="genres__title">Genres</h1>

        <div className="genres__grid">
          {genres.map((genre) => (
            <Link
              key={genre.name}
              to={`/genres/${genre.name}`}
              className="genres__card"
            >
              <img
                src={genre.imageUrl}
                alt={genre.name}
                className="genres__image"
              />
              <span className="genres__movie-title">{genre.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
