import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import Select, { type StylesConfig } from "react-select";
import { getMovies } from "../../api/moviesApi";
import Loader from "../../components/Loader/loader";
import { Movie } from "../../types/movie";
import "./index.css";

type SortOption = "rating" | "newest" | "oldest";

interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

const sortOptions: SelectOption<SortOption>[] = [
  { value: "rating", label: "Highest IMDb rating" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

function createSelectStyles<Option extends SelectOption>(): StylesConfig<
  Option,
  false
> {
  return {
    control: (base, state) => ({
      ...base,
      minHeight: 46,
      backgroundColor: "#1b1c1d",
      borderColor: state.isFocused
        ? "#c8ff76"
        : "rgba(255, 255, 255, 0.2)",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(200, 255, 118, 0.3)"
        : "none",
      "&:hover": {
        borderColor: "#c8ff76",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      backgroundColor: "#1b1c1d",
    }),
    option: (base, state) => ({
      ...base,
      color: "#f5f5f5",
      backgroundColor: state.isSelected
        ? "#34382c"
        : state.isFocused
          ? "#2a2c2d"
          : "#1b1c1d",
      "&:active": {
        backgroundColor: "#34382c",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "#f5f5f5",
    }),
    input: (base) => ({
      ...base,
      color: "#f5f5f5",
    }),
    placeholder: (base) => ({
      ...base,
      color: "rgba(255, 255, 255, 0.65)",
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "rgba(255, 255, 255, 0.68)",
      "&:hover": {
        color: "#c8ff76",
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: "rgba(255, 255, 255, 0.68)",
      "&:hover": {
        color: "#c8ff76",
      },
    }),
  };
}

export function MoviesPage(): JSX.Element {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    if (!isLoading && !errorMessage) {
      searchInputRef.current?.focus();
    }
  }, [isLoading, errorMessage]);

  async function loadMovies(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setMovies(await getMovies());
    } catch (error) {
      setErrorMessage("Failed to load movies");
    } finally {
      setIsLoading(false);
    }
  }

  const normalizedQuery = query.trim().toLowerCase();
  const genres = [...new Set(movies.flatMap((movie) => movie.genres))].sort();
  const genreOptions: SelectOption[] = genres.map((genre) => ({
    value: genre,
    label: genre,
  }));
  const years = [...new Set(movies.map((movie) => movie.releaseYear))].sort(
    (first, second) => second - first,
  );
  const yearOptions: SelectOption[] = years.map((year) => ({
    value: String(year),
    label: String(year),
  }));

  const filteredMovies = movies
    .filter((movie) => {
      const matchesTitle = movie.title.toLowerCase().includes(normalizedQuery);
      const matchesGenre =
        !selectedGenre || movie.genres.includes(selectedGenre);
      const matchesYear =
        !selectedYear || String(movie.releaseYear) === selectedYear;

      return matchesTitle && matchesGenre && matchesYear;
    })
    .sort((first, second) => {
      if (sortBy === "rating") {
        return second.imdbRating - first.imdbRating;
      }

      if (sortBy === "newest") {
        return second.releaseYear - first.releaseYear;
      }

      return first.releaseYear - second.releaseYear;
    });

  if (isLoading) {
    return (
      <div className="movies__loader-wrapper">
        <Loader />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <section className="movies">
        <div className="container">
          <p>{errorMessage}</p>
          <button type="button" onClick={loadMovies}>
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="movies">
      <div className="container">
        <h1 className="movies__title">Search</h1>
        <div className="movies__filters" role="search">
          <div className="movies__search-field">
            <input
              ref={searchInputRef}
              type="search"
              className="movies__search-input"
              placeholder="Search movies..."
              aria-label="Search movies by title"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query ? (
              <button
                type="button"
                className="movies__search-clear"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  searchInputRef.current?.focus();
                }}
              >
                <X size={18} aria-hidden="true" />
              </button>
            ) : (
              <Search
                className="movies__search-icon"
                size={18}
                aria-hidden="true"
              />
            )}
          </div>

          <Select<SelectOption>
            className="movies__filter-select"
            classNamePrefix="movies-select"
            styles={createSelectStyles<SelectOption>()}
            aria-label="Filter by genre"
            isClearable
            isSearchable
            placeholder="All genres"
            options={genreOptions}
            value={
              genreOptions.find((option) => option.value === selectedGenre) ??
              null
            }
            onChange={(option) => setSelectedGenre(option?.value ?? "")}
          />

          <Select<SelectOption>
            className="movies__filter-select"
            classNamePrefix="movies-select"
            styles={createSelectStyles<SelectOption>()}
            aria-label="Filter by release year"
            isClearable
            isSearchable
            placeholder="All years"
            options={yearOptions}
            value={
              yearOptions.find((option) => option.value === selectedYear) ??
              null
            }
            onChange={(option) => setSelectedYear(option?.value ?? "")}
          />

          <Select<SelectOption<SortOption>>
            className="movies__filter-select"
            classNamePrefix="movies-select"
            styles={createSelectStyles<SelectOption<SortOption>>()}
            aria-label="Sort movies"
            isSearchable={false}
            options={sortOptions}
            value={sortOptions.find((option) => option.value === sortBy) ?? null}
            onChange={(option) => {
              if (option) {
                setSortBy(option.value);
              }
            }}
          />
        </div>

        {movies.length === 0 ? (
          <p>No movies available.</p>
        ) : filteredMovies.length === 0 ? (
          <p>No movies found.</p>
        ) : (
          <div className="movies__grid">
            {filteredMovies.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="movies__card"
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="movies__poster"
                  loading="lazy"
                />
                <div className="movies__content">
                  <h3 className="movies__movie-title">{movie.title}</h3>
                  <p className="movies__meta">
                    {movie.releaseYear} · Rating {movie.imdbRating}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}