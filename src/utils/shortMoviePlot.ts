export default function shortMoviePlot(plot: string) {
  if (plot.length <= 160) {
    return plot;
  }

  return `${plot.slice(0, 160)}...`;
}
