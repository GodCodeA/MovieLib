const API_URL = import.meta.env.VITE_API_URL;

const genreImageMap: Record<string, string> = {
  action: `${API_URL}/genres/action_compressed.avif`,
  adventure: `${API_URL}/genres/adventure_compressed.avif`,
  biography: `${API_URL}/genres/biography_compressed.avif`,
  comedy: `${API_URL}/genres/comedy_compressed.avif`,
  crime: `${API_URL}/genres/crime_compressed.avif`,
  drama: `${API_URL}/genres/drama_compressed.avif`,
  family: `${API_URL}/genres/family_compressed.avif`,
  fantasy: `${API_URL}/genres/fantasy_compressed.avif`,
  history: `${API_URL}/genres/history_compressed.avif`,
  horror: `${API_URL}/genres/horror_compressed.avif`,
  mystery: `${API_URL}/genres/mystery_compressed.avif`,
  romance: `${API_URL}/genres/romance_compressed.avif`,
  "sci-fi": `${API_URL}/genres/sci-fi_compressed.avif`,
  thriller: `${API_URL}/genres/thriller_compressed.avif`,
  war: `${API_URL}/genres/war_compressed.avif`,
  western: `${API_URL}/genres/western_compressed.avif`,
};

export function getGenreImage(genreName: string): string {
  return (
    genreImageMap[genreName.toLowerCase()] ?? `${API_URL}/genres/backdrop_compressed.avif`
  );
}
