import { logoutUser } from "../../api/authApi";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { clearUser } from "../../store/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { clearFavoriteMovies } from "../../store/favoritesSlice";
import "./index.css";

export function ProfilePage(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthorized } = useAppSelector((state) => state.user);
  const favoriteMovies = useAppSelector((state) => state.favorites.movies);
  const favoritesError = useAppSelector((state) => state.favorites.error);

  async function handleLogout(): Promise<void> {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Error logging out");
    } finally {
      localStorage.removeItem("token");
      dispatch(clearUser());
      dispatch(clearFavoriteMovies());
      navigate("/");
    }
  }

  if (!isAuthorized || !user) {
    return <h1>User is not authorized</h1>;
  }

  return (
    <section className="profile">
      <div className="container">
        <div className="profile__title-log-wrap">
          <h1 className="profile__title">Account</h1>
          <button
            type="button"
            className="profile__card-button btn btn-logout"
            onClick={handleLogout}
            title="Log out"
          >
            Log out
          </button>
        </div>
        <div className="profile__card">
          <p className="profile__card-text">
            <strong>First name:</strong> {user.name}
          </p>
          <p className="profile__card-text">
            <strong>Last name:</strong> {user.surname}
          </p>
          <p className="profile__card-text" title={user.email}>
            <strong>Email:</strong> {user.email}
          </p>
          <p className="profile__card-text">
            <strong>User ID:</strong> {user.id}
          </p>
        </div>

        <div className="profile__favorites">
          <h2 className="profile__favorites-title">
            {favoriteMovies.length >= 1
              ? `Favorite movies: ${favoriteMovies.length}`
              : "Favorite movies"}
          </h2>

          {favoritesError ? (
            <div className="error">{favoritesError}</div>
          ) : favoriteMovies.length === 0 ? (
            <p>It is empty here for now...</p>
          ) : (
            <>
              <p className="profile__favorites-subtitle">
                {favoriteMovies.length === 1
                  ? `You have saved ${favoriteMovies.length} movie`
                  : `You have saved ${favoriteMovies.length} movies`}
              </p>
              <div className="profile__movie-grid">
                {favoriteMovies.map((movie) => (
                  <Link
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    className="profile__movie"
                  >
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="profile__movie-image"
                      title={movie.title}
                    />
                    <div className="profile__movie-content">
                      <h3 className="profile__movie-title">{movie.title}</h3>
                      <p className="profile__movie-rating">
                        Rating: {movie.imdbRating}
                      </p>
                      <p className="profile__movie-text">
                        <strong>Release year:</strong> {movie.releaseYear}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
