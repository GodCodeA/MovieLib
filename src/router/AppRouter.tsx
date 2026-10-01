import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { GenreDetailsPage } from "../pages/GenreDetails/GenreDetailsPage";
import { GenresPage } from "../pages/Genres/GenresPage";
import { HomePage } from "../pages/Home/HomePage";
import { MoviesPage } from "../pages/Movies/MoviesPage";
import { MoviePage } from "../pages/Movie/MoviePage";
import { NotFoundPage } from "../pages/NotFound/NotFoundPage";
import { ProfilePage } from "../pages/Profile/ProfilePage";

export function AppRouter(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="movies" element={<MoviesPage />} />
        <Route path="genres" element={<GenresPage />} />
        <Route path="genres/:genreName" element={<GenreDetailsPage />} />
        <Route path="movie/:movieId" element={<MoviePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
