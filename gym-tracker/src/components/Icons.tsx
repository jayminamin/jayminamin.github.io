import React from 'react';

export type IconName =
  | 'dumb'
  | 'pulse'
  | 'moon'
  | 'sun'
  | 'timer'
  | 'back'
  | 'next'
  | 'play'
  | 'clock'
  | 'rep'
  | 'flame'
  | 'target'
  | 'sets'
  | 'up'
  | 'down'
  | 'fill'
  | 'reset'
  | 'check'
  | 'eye'
  | 'eyeoff';

const PATHS: Record<IconName, React.ReactNode> = {
  dumb: <path d="M6.5 6.5v11M17.5 6.5v11M3 9.5v5M21 9.5v5M6.5 12h11" />,
  pulse: <path d="M3 12h4l2.5-6 4 12 2.5-6H21" />,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5M9 2h6M12 2v3" />
    </>
  ),
  back: <path d="M15 5l-7 7 7 7" />,
  next: <path d="M9 5l7 7-7 7" />,
  play: <path d="M8 5.5v13l11-6.5z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  rep: (
    <path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3" />
  ),
  flame: (
    <path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .3 1.5 1 2 2 2 0-3-1-5 1-8z" />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
    </>
  ),
  sets: <path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5" />,
  up: <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />,
  down: <path d="M12 4v12M7 11l5 5 5-5M5 20h14" />,
  fill: <path d="M12 5v14M7 14l5 5 5-5" />,
  reset: <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeoff: (
    <path d="M3 3l18 18M9.9 5.2A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.3 4.2M6.5 6.8A17 17 0 0 0 2 12s3.5 7 10 7a9.6 9.6 0 0 0 4.1-.9" />
  ),
};

export const Icon: React.FC<{ name: IconName }> = ({ name }) => (
  <svg className="i" viewBox="0 0 24 24" aria-hidden="true">
    {PATHS[name]}
  </svg>
);

export const ThemeToggleButton: React.FC<{
  theme: 'dark' | 'light';
  onToggle: () => void;
}> = ({ theme, onToggle }) => {
  const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`;
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={onToggle}
      aria-label={label}
      title={label}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
    </button>
  );
};
