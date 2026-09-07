import { httpClient } from "./http";
import { Movie } from "../types/movie";

export async function getTopMovies(): Promise<Movie[]> {
  const response = await httpClient.get<Movie[]>("/movie/top10");
  return response.data;
}

export async function getRandomMovie(): Promise<Movie> {
  const response = await httpClient.get<Movie>("/movie/random");
  return response.data;
}

export async function getMovieById(movieId: string): Promise<Movie> {
  const response = await httpClient.get<Movie>(`/movie/${movieId}`);
  return response.data;
}

export async function getGenres(): Promise<string[]> {
  const response = await httpClient.get<string[]>("/movie/genres");
  return response.data;
}

export async function getMoviesByGenre(genreName: string): Promise<Movie[]> {
  const response = await httpClient.get<Movie[]>("/movie", {
    params: {
      genre: genreName,
    },
  });
  return response.data;
}

export async function getFavoriteMovies(): Promise<Movie[]> {
  const response = await httpClient.get<Movie[]>("/favorites");
  return response.data;
}

export async function addMovieToFavorites(movieId: string): Promise<void> {
  await httpClient.post("/favorites", {
    id: movieId,
  });
}

export async function removeMovieFromFavorites(movieId: string): Promise<void> {
  await httpClient.delete(`/favorites/${movieId}`);
}

export async function searchMoviesByTitle(title: string): Promise<Movie[]> {
  const response = await httpClient.get<Movie[]>("/movie", {
    params: {
      title,
    },
  });

  return response.data;
}
