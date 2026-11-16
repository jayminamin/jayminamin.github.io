import { defaultState, TrackerState } from './workout';

const KEY = 'gymtracker.v1';
export const SESS_KEY = KEY + '.session';
export const THEME_KEY = KEY + '.theme';

const ckSafe = (s: string) =>
  s.replace(/[^a-z0-9]/gi, (c) => '_' + c.charCodeAt(0).toString(16));

export function ckSet(n: string, v: string, days: number): void {
  try {
    document.cookie =
      n +
      '=' +
      v +
      ';max-age=' +
      days * 86400 +
      ';path=/' +
      (location.protocol === 'https:' ? ';SameSite=Lax;Secure' : ';SameSite=Lax');
  } catch {
    // Ignore cookie errors in restricted contexts
  }
}

export function ckGet(n: string): string | null {
  try {
    const m = document.cookie.split('; ').find((x) => x.startsWith(n + '='));
    return m ? m.slice(n.length + 1) : null;
  } catch {
    return null;
  }
}

function ckSave(u: string, o: unknown): void {
  const b = 'gt.' + ckSafe(u) + '.';
  const enc = encodeURIComponent(JSON.stringify(o));
  const old = +(ckGet(b + 'n') || 0) || 0;
  const n = Math.ceil(enc.length / 3500);
  if (n > 6) return;
  for (let i = 0; i < n; i++) ckSet(b + i, enc.slice(i * 3500, (i + 1) * 3500), 365);
  for (let i = n; i < old; i++) ckSet(b + i, '', 0);
  ckSet(b + 'n', String(n), 365);
}

function ckLoad(u: string): Partial<TrackerState> | null {
  const b = 'gt.' + ckSafe(u) + '.';
  const n = +(ckGet(b + 'n') || 0) || 0;
  if (!n) return null;
  let s = '';
  for (let i = 0; i < n; i++) {
    const p = ckGet(b + i);
    if (p == null) return null;
    s += p;
  }
  try {
    return JSON.parse(decodeURIComponent(s));
  } catch {
    return null;
  }
}

export function loadUserState(u: string): TrackerState {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY + '.u.' + u);
    if (!raw && localStorage.getItem(KEY)) {
      raw = localStorage.getItem(KEY);
      localStorage.removeItem(KEY);
    }
  } catch {
    // Ignore storage errors
  }
  try {
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...defaultState(), ...parsed };
      }
    }
  } catch {
    // Fallback to cookies
  }
  return { ...defaultState(), ...(ckLoad(u) || {}) };
}

export function saveUserState(u: string | null, state: TrackerState): void {
  if (!u) return;
  try {
    localStorage.setItem(KEY + '.u.' + u, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
  ckSave(u, {
    prog: state.prog,
    day: state.day,
    unit: state.unit,
    done: state.done,
    log: state.log,
  });
}

export function getSavedSession(users: Record<string, string>): string | null {
  let u: string | null = null;
  try {
    u = localStorage.getItem(SESS_KEY);
  } catch {
    // Ignore
  }
  if (!u) {
    try {
      u = decodeURIComponent(ckGet('gt_session') || '');
    } catch {
      // Ignore
    }
  }
  return u && users[u] !== undefined ? u : null;
}

export function saveSession(u: string | null): void {
  if (u) {
    try {
      localStorage.setItem(SESS_KEY, u);
    } catch {
      // Ignore
    }
    ckSet('gt_session', encodeURIComponent(u), 365);
  } else {
    try {
      localStorage.removeItem(SESS_KEY);
    } catch {
      // Ignore
    }
    ckSet('gt_session', '', 0);
  }
}

export function getInitialTheme(): 'dark' | 'light' {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function applyDocumentTheme(theme: 'dark' | 'light', animate: boolean): void {
  if (animate) {
    document.documentElement.classList.add('theme-xf');
    window.setTimeout(() => document.documentElement.classList.remove('theme-xf'), 320);
  }
  document.documentElement.classList.toggle('light', theme === 'light');
  const metaTheme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (metaTheme) metaTheme.content = theme === 'light' ? '#f5f6f8' : '#0c0d0f';
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Ignore
  }
}

export function initDynamicPWA(): void {
  try {
    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#0c0d0f"/><rect x="24" y="24" width="464" height="464" rx="92" fill="none" stroke="#ff7a45" stroke-width="14" stroke-opacity="0.35"/><g fill="none" stroke="#ff7a45" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"><path d="M138 156v200M374 156v200M82 204v104M430 204v104M138 256h236"/></g></svg>`;
    const iconUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgIcon);
    const iconLink = document.getElementById('pwa-icon') as HTMLLinkElement | null;
    if (iconLink) iconLink.href = iconUrl;
    const manifest = {
      name: 'Gym Tracker',
      short_name: 'Gym Tracker',
      description: 'Weekly strength, run, and core workout tracker',
      start_url: location.href.split('#')[0],
      display: 'standalone',
      background_color: '#0c0d0f',
      theme_color: '#0c0d0f',
      orientation: 'portrait',
      icons: [{ src: iconUrl, sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' }],
    };
    const mBlob = new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' });
    const mLink = document.getElementById('pwa-manifest') as HTMLLinkElement | null;
    if (mLink) mLink.href = URL.createObjectURL(mBlob);
  } catch {
    // Ignore
  }
}

export async function fetchOptionalText(names: string[]): Promise<string | null> {
  for (const n of names) {
    try {
      const r = await fetch(n, { cache: 'no-store' });
      if (!r.ok) continue;
      const x = await r.text();
      if (x.trim() && !/^\s*</.test(x)) return x;
    } catch {
      // Ignore missing optional external CSVs
    }
  }
  return null;
}
