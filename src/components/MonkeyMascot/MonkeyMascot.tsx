interface MonkeyMascotProps {
  className?: string;
  ariaLabel?: string;
}

export function MonkeyMascot({
  className = "header__mascot",
  ariaLabel = "MovieLib monkey mascot wearing 3D glasses and holding popcorn",
}: MonkeyMascotProps): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 120 130"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <linearGradient id="monkey-fur" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#a96b42" />
          <stop offset="0.55" stopColor="#754126" />
          <stop offset="1" stopColor="#482719" />
        </linearGradient>
        <linearGradient id="monkey-face" x1="0" x2="0.9" y1="0" y2="1">
          <stop offset="0" stopColor="#f7d7a7" />
          <stop offset="1" stopColor="#d99d65" />
        </linearGradient>
      </defs>
      <g className="monkey-mascot__figure">
        <path
          className="monkey-mascot__tail"
          d="M78 96c23 7 29 1 29-8 0-6-5-9-10-6"
        />
        <g transform="translate(47 94)">
          <g className="monkey-mascot__leg monkey-mascot__leg--left">
            <path d="M0 0c-4 7-7 14-5 22l2 7 7 1 2-3-3-7 4-17Z" />
            <path className="monkey-mascot__foot" d="m-3 27 1 5 9 1c3 0 4-2 2-4l-5-3Z" />
          </g>
        </g>
        <g transform="translate(73 94)">
          <g className="monkey-mascot__leg monkey-mascot__leg--right">
            <path d="M0 0c4 7 7 14 5 22l-2 7-7 1-2-3 3-7-4-17Z" />
            <path className="monkey-mascot__foot" d="m3 27-1 5-9 1c-3 0-4-2-2-4l5-3Z" />
          </g>
        </g>
        <path
          className="monkey-mascot__torso"
          d="M49 68c8-5 22-3 27 5l5 17-7 10H46l-7-10 5-17Z"
        />
        <path
          className="monkey-mascot__arm"
          d="M49 78c-7 3-10 7-10 12l6 7 7-3-2-5 4-3"
        />
        <path
          className="monkey-mascot__arm"
          d="M76 78c7 3 10 7 10 12l-6 7-7-3 2-5-4-3"
        />
        <path
          className="monkey-mascot__ear"
          d="M36 38C21 21 8 30 14 48c4 12 14 16 25 9m45-19c15-17 28-8 22 10-4 12-14 16-25 9"
        />
        <g transform="translate(60 55) scale(.93) translate(-60 -55)">
          <path
            className="monkey-mascot__head"
            d="M60 12c-20 0-33 13-34 34-1 20 12 34 34 35 22-1 35-15 34-35C93 25 80 12 60 12Z"
          />
          <path
            className="monkey-mascot__face"
            d="M60 35c-13 0-23 8-24 20-1 14 8 21 24 22 16-1 25-8 24-22-1-12-11-20-24-20Z"
          />
          <g className="monkey-mascot__brows">
            <path d="m43 43 13 3m8 0 13-5" />
          </g>
          <g className="monkey-mascot__eyes">
            <g className="monkey-mascot__pupils">
              <ellipse cx="50" cy="49" rx="2.5" ry="3.5" />
              <ellipse cx="70" cy="48" rx="2.5" ry="3.5" />
            </g>
          </g>
          <path
            className="monkey-mascot__muzzle"
            d="M45 58c1-6 8-9 15-9s14 3 15 9c1 8-6 13-15 14-9-1-16-6-15-14Z"
          />
          <path className="monkey-mascot__nose" d="M55 56c2-2 8-2 10 0l-2 3h-6Z" />
          <path className="monkey-mascot__smile" d="M53 66c5 3 11 2 15-2" />
          <g className="monkey-mascot__glasses">
            <path
              className="monkey-mascot__lens monkey-mascot__lens--red"
              d="M40 43h15q2 0 2 2v6q0 2-2 2H43q-3 0-3-3Z"
            />
            <path
              className="monkey-mascot__lens monkey-mascot__lens--blue"
              d="M64 43h15l-1 7q0 3-3 3h-9q-2 0-2-2Z"
            />
            <path
              className="monkey-mascot__glasses-frame"
              d="M39 42h17q3 0 3 3v6q0 3-3 3H43q-4 0-4-4Zm21 3h3m2-3h16l-1 8q0 4-4 4h-9q-3 0-3-3Zm-21 0-5-2m46 2 5-2"
            />
            <path
              className="monkey-mascot__lens-glint"
              d="m43 45 5 0m19 0 5 0"
            />
          </g>
          <path
            className="monkey-mascot__tuft"
            d="M43 20c-1-7 5-10 10-6 3-8 11-7 13 1 7-4 13 0 11 7-9-3-21-3-34-2Z"
          />
        </g>
        <path
          className="monkey-mascot__inner-ear"
          d="M31 39c-8-6-15 1-11 9 2 5 7 7 13 5m56-14c8-6 15 1 11 9-2 5-7 7-13 5"
        />
        <g className="monkey-mascot__popcorn">
          <path
            className="monkey-mascot__popcorn-cup"
            d="m45 89 30 0-4 27H49Z"
          />
          <path
            className="monkey-mascot__popcorn-stripe"
            d="m51 90 6 0-1 25h-5Zm13 0 6 0-3 25h-5Z"
          />
          <path
            className="monkey-mascot__popcorn-top"
            d="M45 90c-3-4 0-7 4-6 0-5 6-6 8-2 2-5 8-4 9 0 4-3 8 0 7 4 4-1 6 2 4 5-5 2-27 2-32-1Z"
          />
          <circle cx="50" cy="84" r="2.4" />
          <circle cx="57" cy="82" r="2.8" />
          <circle cx="64" cy="83" r="2.5" />
          <circle cx="70" cy="85" r="2.2" />
        </g>
        <g className="monkey-mascot__hands">
          <path
            className="monkey-mascot__hand monkey-mascot__hand--left"
            d="M49 94c-3-2-7-1-9 2-1 3 1 6 4 7l6 1 3-4-2-5Zm-7 4 5 2m-3 1 5 2"
          />
          <path
            className="monkey-mascot__hand monkey-mascot__hand--right"
            d="M71 94c3-2 7-1 9 2 1 3-1 6-4 7l-6 1-3-4 2-5Zm7 4-5 2m3 1-5 2"
          />
        </g>
        <path
          className="monkey-mascot__fur-detail"
          d="m28 30 5-4m-10 15 5-3m65-8-5-4m10 15-5-3M49 73l3 3m16-3-3 3"
        />
      </g>
    </svg>
  );
}
