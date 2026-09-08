export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  releaseYear: number;
  country: string[];
  genres: string[];
  plot: string;
  trailerDailyMotionId: string;
  backdropUrl: string | null;
  // crew
  director: string[];
  writer: string[];
  producer: string[];
  composer: string[];
  movieStars: string[];
  // movie info
  runtime: number;
  budget: number;
  worldEarning: number;
  imdbRating: number;
  quantityImdbRating: number;
  ratingMPPA: string;
  ageWatch: string;
}
