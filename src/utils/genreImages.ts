const API_URL = import.meta.env.VITE_API_URL;

const genreImageMap: Record<string, string> = {
  action: `${API_URL}/genres/action.avif`,
  adventure: `${API_URL}/genres/adventure.avif`,
  biography: `${API_URL}/genres/biography.avif`,
  comedy: `${API_URL}/genres/comedy.avif`,
  crime: `${API_URL}/genres/crime.avif`,
  drama: `${API_URL}/genres/drama.avif`,
  family: `${API_URL}/genres/backdrop.avif`,
  fantasy: `${API_URL}/genres/fantasy.avif`,
  history: `${API_URL}/genres/history.avif`,
  horror: `${API_URL}/genres/horror.avif`,
  mystery: `${API_URL}/genres/backdrop.avif`,
  romance: `${API_URL}/genres/romance.avif`,
  "sci-fi": `${API_URL}/genres/sci-fi.avif`,
  thriller: `${API_URL}/genres/thriller.avif`,
  war: `${API_URL}/genres/war.avif`,
  western: `${API_URL}/genres/western.avif`,
};

export function getGenreImage(genreName: string): string {
  return (
    genreImageMap[genreName.toLowerCase()] ?? `${API_URL}/genres/backdrop.avif`
  );
}
