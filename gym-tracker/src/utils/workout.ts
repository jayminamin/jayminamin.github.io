import { DEFAULT_CSV, SCHED, ScheduleDay } from '../data/programs';

export interface CSVRow {
  Block?: string;
  Day?: string;
  Workout?: string;
  Exercise?: string;
  'Target Muscle'?: string;
  Sets?: string;
  Reps?: string;
  'Reps to Failure'?: string;
  Rest?: string;
  'Form Notes'?: string;
  'Video Tutorial'?: string;
  [key: string]: string | undefined;
}

export interface SetEntry {
  w?: string;
  r?: string;
}

export interface RunMeta {
  dist?: string;
  time?: string;
}

export interface HistEntry {
  w: string;
  items: string[];
}

export interface CustomFile {
  name: string;
  csv: string;
}

export interface TrackerState {
  prog: string;
  day: number;
  unit: 'kg' | 'lbs';
  done: Record<string, Record<string, boolean[]>>;
  weights: Record<string, Record<string, SetEntry[]>>;
  prevWeights: Record<string, Record<string, SetEntry[]>>;
  best1rm: Record<string, number>;
  runs: Record<string, Record<string, RunMeta>>;
  log: Record<string, Record<number, number>>;
  hist: Record<string, Record<number, HistEntry>>;
  custom?: CustomFile;
  core?: CustomFile;
}

export interface ProgramInfo {
  id: string;
  csv: string;
  file?: string;
  rows: CSVRow[];
  name: string;
}

export interface ExerciseModel {
  r: CSVRow;
  sets: number;
  key: string;
  arr: boolean[];
  wArr: SetEntry[];
  pwArr: SetEntry[];
  done: number;
  hasPR: boolean;
}

export interface ExerciseGroup {
  title: string;
  rows: CSVRow[];
  core?: number;
  ex: ExerciseModel[];
}

export interface DayModel extends ScheduleDay {
  groups: ExerciseGroup[];
  total: number;
  done: number;
  count: number;
  runOn: boolean;
  runMeta: RunMeta;
}

export interface TrackerModel {
  P: ProgramInfo[];
  p: ProgramInfo;
  days: DayModel[];
  core: CSVRow[];
  placed: number;
  total: number;
  done: number;
  vol: number;
}

export const defaultState = (): TrackerState => ({
  prog: 'w14',
  day: 1,
  unit: 'kg',
  done: {},
  weights: {},
  prevWeights: {},
  best1rm: {},
  runs: {},
  log: {},
  hist: {},
});

export const norm = (s: string | undefined): string =>
  (s || '').toLowerCase().replace(/\s+/g, ' ').trim();

const MO: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

export function fixReps(s: string): string {
  let m = /^(\d+)-([A-Za-z]{3})$/.exec(s);
  if (m && MO[m[2].toLowerCase()]) return `${m[1]}-${MO[m[2].toLowerCase()]}`;
  m = /^([A-Za-z]{3})-(\d+)$/.exec(s);
  if (m && MO[m[1].toLowerCase()]) return `${MO[m[1].toLowerCase()]}-${m[2]}`;
  return s;
}

export function parseCSV(t: string): CSVRow[] {
  const clean = t.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let r: string[] = [];
  let f = '';
  let q = false;
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (q) {
      if (c === '"') {
        if (clean[i + 1] === '"') {
          f += '"';
          i++;
        } else {
          q = false;
        }
      } else {
        f += c;
      }
    } else if (c === '"') {
      q = true;
    } else if (c === ',') {
      r.push(f);
      f = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && clean[i + 1] === '\n') i++;
      r.push(f);
      f = '';
      rows.push(r);
      r = [];
    } else {
      f += c;
    }
  }
  if (f !== '' || r.length) {
    r.push(f);
    rows.push(r);
  }
  const h = (rows.shift() || []).map((x) => x.trim());
  return rows
    .filter((row) => row.some((x) => x.trim()))
    .map((row) => {
      const o: CSVRow = {};
      h.forEach((k, i) => {
        o[k] = (row[i] == null ? '' : row[i]).trim();
      });
      o.Reps = fixReps(o.Reps || '');
      return o;
    });
}

export function buildUsers(loginsText: string): Record<string, string> {
  const users: Record<string, string> = {};
  loginsText
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .forEach((line) => {
      const l = line.trim();
      if (!l || l[0] === '#') return;
      const m = /^([^\s:,=;]+)\s*[:,=;\s]\s*(.+)$/.exec(l);
      if (m) users[m[1].toLowerCase()] = m[2].trim();
    });
  return users;
}

export function calc1RM(w: string | number | undefined, r: string | number | undefined): number {
  const wVal = typeof w === 'number' ? w : parseFloat(String(w || ''));
  const rVal = typeof r === 'number' ? r : parseInt(String(r || ''), 10);
  if (!wVal || !rVal || wVal <= 0 || rVal <= 0) return 0;
  return rVal === 1 ? wVal : Math.round(wVal * (1 + rVal / 30) * 10) / 10;
}

export function ymd(d: Date): string {
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

export function calcStreak(log: Record<string, Record<number, number>>, today = new Date()): number {
  const dates = Object.keys(log || {}).sort();
  if (!dates.length) return 0;
  const weekKey = (ds: string) => {
    const d = new Date(ds + 'T00:00:00');
    const day = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - day);
    return ymd(d);
  };
  const weeks = new Set(dates.map(weekKey));
  const cur = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let streak = 0;
  for (let i = 0; i < 104; i++) {
    const wk = weekKey(ymd(cur));
    if (weeks.has(wk)) streak++;
    else if (i > 0) break;
    cur.setDate(cur.getDate() - 7);
  }
  return streak;
}

export const getPercent = (a: number, b: number): number => (b ? Math.round((100 * a) / b) : 0);

export function formatClock(ms: number): string {
  const tot = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(tot / 60);
  const s = String(tot % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export function formatStopwatch(ms: number): string {
  const tot = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(tot / 3600);
  const m = Math.floor((tot % 3600) / 60);
  const s = String(tot % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

export interface CsvSourceMap {
  w14: string;
  w58: string;
  core: string;
}

export function getPrograms(
  state: TrackerState,
  csvSources: CsvSourceMap = DEFAULT_CSV,
): ProgramInfo[] {
  const list: { id: string; csv: string; file?: string }[] = [
    { id: 'w14', csv: csvSources.w14 },
    { id: 'w58', csv: csvSources.w58 },
  ];
  if (state.custom) {
    list.push({ id: 'custom', csv: state.custom.csv, file: state.custom.name });
  }
  return list.map((p) => {
    const rows = parseCSV(p.csv);
    return {
      ...p,
      rows,
      name: (rows[0] && rows[0].Block) || p.file || p.id,
    };
  });
}

export function buildModel(
  state: TrackerState,
  csvSources: CsvSourceMap = DEFAULT_CSV,
): TrackerModel {
  const P = getPrograms(state, csvSources);
  const p = P.find((x) => x.id === state.prog) || P[0];
  const core = parseCSV(state.core ? state.core.csv : csvSources.core);
  const dn = state.done[p.id] || {};
  const wt = state.weights[p.id] || {};
  const pwt = state.prevWeights[p.id] || {};
  const rn = state.runs[p.id] || {};

  let placed = 0;
  let T = 0;
  let D = 0;
  let vol = 0;

  const days: DayModel[] = SCHED.map((d) => {
    if (d.rest) {
      return {
        ...d,
        groups: [],
        total: 0,
        done: 0,
        count: 0,
        runOn: false,
        runMeta: {},
      };
    }

    const rawGroups: { title: string; rows: CSVRow[]; core?: number }[] = [];
    if (d.run) {
      rawGroups.push({
        title: 'Run / Core',
        rows: p.rows.filter(
          (r) =>
            norm(r.Workout) === 'run / core' &&
            (!/^day\s*\d+$/i.test(r.Day || '') || norm(r.Day) === 'day ' + d.n),
        ),
      });
      rawGroups.push({
        title: (core[0] && core[0].Workout) || 'Core',
        rows: core,
        core: 1,
      });
    } else {
      rawGroups.push({
        title: d.w,
        rows: p.rows.filter((r) => norm(r.Workout) === norm(d.w)),
      });
    }

    let total = 0;
    let done = 0;
    let count = 0;

    const groups: ExerciseGroup[] = rawGroups
      .filter((x) => x.rows.length)
      .map((x, gi) => {
        const ex: ExerciseModel[] = x.rows.map((r, i) => {
          const sets = Math.max(1, parseInt(r.Sets || '1', 10) || 1);
          const key = `${d.n}.${gi}.${i}.${r.Exercise}`;
          const arr = dn[key] || [];
          const wArr = wt[key] || [];
          const pwArr = pwt[key] || [];
          let c = 0;
          let hasPR = false;
          for (let j = 0; j < sets; j++) {
            if (arr[j]) {
              c++;
              const entry = wArr[j] || {};
              const wVal = parseFloat(entry.w || '') || 0;
              const rVal = parseInt(entry.r || '', 10) || parseInt(r.Reps || '', 10) || 0;
              if (wVal > 0 && rVal > 0) vol += wVal * rVal;
              if (
                wVal > 0 &&
                (state.best1rm[r.Exercise || ''] || 0) > 0 &&
                calc1RM(wVal, rVal) >= (state.best1rm[r.Exercise || ''] || 0)
              ) {
                hasPR = true;
              }
            }
          }
          total += sets;
          done += c;
          count++;
          return { r, sets, key, arr, wArr, pwArr, done: c, hasPR };
        });
        if (!x.core) placed += x.rows.length;
        return { ...x, ex };
      });

    T += total;
    D += done;
    const runMeta = rn['run' + d.n] || {};
    return {
      ...d,
      groups,
      total,
      done,
      count,
      runOn: !!(dn['run' + d.n] || [])[0],
      runMeta,
    };
  });

  return { P, p, days, core, placed, total: T, done: D, vol: Math.round(vol) };
}

export function applyLogDay(
  state: TrackerState,
  k: string,
  csvSources: CsvSourceMap = DEFAULT_CSV,
  today = new Date(),
): { log: TrackerState['log']; hist: TrackerState['hist'] } {
  const n = k.startsWith('run') ? +k.slice(3) : +k.split('.')[0];
  const m = buildModel(state, csvSources);
  const dd = m.days.find((x) => x.n === n);
  const L: TrackerState['log'] = { ...(state.log || {}) };
  const H: TrackerState['hist'] = { ...(state.hist || {}) };
  if (!dd) return { log: L, hist: H };

  const st = dd.done || dd.runOn ? (dd.done === dd.total && (!dd.run || dd.runOn) ? 2 : 1) : 0;
  const key = ymd(today);
  const e = { ...(L[key] || {}) };
  if (st) e[n] = st;
  else delete e[n];

  if (Object.keys(e).length) L[key] = e;
  else delete L[key];

  if (st) {
    const items: string[] = [];
    if (dd.run && dd.runOn) {
      const rm = dd.runMeta || {};
      items.push(
        `${dd.run}${rm.dist ? ' (' + rm.dist + ')' : ''}${rm.time ? ' in ' + rm.time : ''}`,
      );
    }
    dd.groups.forEach((g) =>
      g.ex.forEach((ex) => {
        if (ex.done > 0) {
          const wList = ex.wArr
            .slice(0, ex.done)
            .map((x) => (x && x.w ? x.w + state.unit : ''))
            .filter(Boolean);
          items.push(
            `${ex.r.Exercise}: ${ex.done}/${ex.sets} sets${wList.length ? ' @ ' + wList.join(', ') : ''}`,
          );
        }
      }),
    );
    H[key] = { ...(H[key] || {}), [n]: { w: dd.w, items } };
  } else if (H[key]) {
    const dayHist = { ...H[key] };
    delete dayHist[n];
    if (Object.keys(dayHist).length) H[key] = dayHist;
    else delete H[key];
  }

  return { log: L, hist: H };
}
