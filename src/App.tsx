import { AppRouter } from "./router/AppRouter";
import { useEffect } from "react";
import { getFavoriteMovies } from "./api/moviesApi";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { getCurrentUser } from "./api/authApi";
import { useAppDispatch } from "./hooks/redux";
import {
  clearUser,
  finishUserLoading,
  setUser,
  startUserLoading,
} from "./store/userSlice";
import {
  clearFavoriteMovies,
  setFavoriteMovies,
  setFavoritesError,
} from "./store/favoritesSlice";
import { getFavoritesErrorMessage } from "./utils/Errors";
import { useNavigate } from "react-router-dom";

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    checkUserSession();
  }, []);

  async function checkUserSession(): Promise<void> {
    try {
      dispatch(startUserLoading());

      const token = localStorage.getItem("token");

      if (!token) {
        dispatch(clearUser());
        dispatch(clearFavoriteMovies());
        return;
      }

      const profilePromise = getCurrentUser();
      const favoritesPromise = getFavoriteMovies();

      const [profileResult, favoritesResult] = await Promise.allSettled([
        profilePromise,
        favoritesPromise,
      ]);

      if (profileResult.status === "fulfilled") {
        dispatch(setUser(profileResult.value));
        navigate("/profile");
      } else {
        localStorage.removeItem("token");
        dispatch(clearUser());
        dispatch(clearFavoriteMovies());
      }

      if (favoritesResult.status === "fulfilled") {
        dispatch(setFavoriteMovies(favoritesResult.value));
      } else {
        dispatch(clearFavoriteMovies());
        const message = getFavoritesErrorMessage(favoritesResult.reason);
        dispatch(setFavoritesError(message));
      }
    } catch (error) {
      localStorage.removeItem("token");
      dispatch(clearUser());
      dispatch(clearFavoriteMovies());
    } finally {
      dispatch(finishUserLoading());
    }
  }
  return (
    <>
      <ScrollToTop />
      <AppRouter />
    </>
  );
}

export default App;
