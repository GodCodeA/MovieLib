import "./index.css";

interface TrailerModalProps {
  isOpen: boolean;
  trailerYouTubeId: string;
  movieTitle: string;
  onClose: () => void;
}

export function TrailerModal({
  isOpen,
  trailerYouTubeId,
  movieTitle,
  onClose,
}: TrailerModalProps): JSX.Element | null {
  if (!isOpen || !trailerYouTubeId) {
    return null;
  }

  const trailerUrl = `https://www.youtube.com/embed/${trailerYouTubeId}`;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="trailer-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="auth-modal__close" onClick={onClose}>
          ×
        </button>

        <h2 className="auth-modal__title">Trailer: {movieTitle}</h2>

        <div className="trailer-modal__player-wrapper">
          <iframe
            className="trailer-modal__player"
            src={trailerUrl}
            title={`Trailer for ${movieTitle}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
