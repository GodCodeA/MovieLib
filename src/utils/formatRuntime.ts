export default function formatRuntime(runtime: number): string {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (!hours) {
    return `${minutes} min`;
  }

  return `${hours} h ${minutes} min`;
}
