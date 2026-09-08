import "./index.css";

interface TrailerModalProps {
  isOpen: boolean;
  trailerDailyMotionId: string;
  movieTitle: string;
  onClose: () => void;
}

export function TrailerModal({
  isOpen,
  trailerDailyMotionId,
  movieTitle,
  onClose,
}: TrailerModalProps): JSX.Element | null {
  if (!isOpen || !trailerDailyMotionId) {
    return null;
  }

  const trailerUrl = `https://www.dailymotion.com/embed/video/${trailerDailyMotionId}`;
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
            width="640"
            height="360"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
