import React, { useRef, useState } from 'react';
import { DAY_COLORS, SCHED } from '../data/programs';
import {
  calcStreak,
  DayModel,
  getPercent,
  parseCSV,
  TrackerModel,
  TrackerState,
  ymd,
} from '../utils/workout';
import { Icon, ThemeToggleButton } from './Icons';

interface DashboardViewProps {
  user: string;
  theme: 'dark' | 'light';
  state: TrackerState;
  model: TrackerModel;
  onToggleTheme: () => void;
  onLogout: () => void;
  onSelectDay: (day: number) => void;
  onSetProg: (progId: string) => void;
  onSetUnit: (unit: 'kg' | 'lbs') => void;
  onResetWeek: () => void;
  onUploadCustomProg: (name: string, csv: string) => void;
  onRemoveCustomProg: () => void;
  onUploadCore: (name: string, csv: string) => void;
  onResetCore: () => void;
  onRestoreBackup: (data: TrackerState) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  theme,
  state,
  model,
  onToggleTheme,
  onLogout,
  onSelectDay,
  onSetProg,
  onSetUnit,
  onResetWeek,
  onUploadCustomProg,
  onRemoveCustomProg,
  onUploadCore,
  onResetCore,
  onRestoreBackup,
}) => {
  const [askReset, setAskReset] = useState(false);
  const [optOpen, setOptOpen] = useState(false);
  const [note, setNote] = useState('');
  const [selDate, setSelDate] = useState<string | null>(null);
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [calAnim, setCalAnim] = useState<{ key: number; dir: -1 | 1 } | null>(null);

  const uppRef = useRef<HTMLInputElement>(null);
  const upcRef = useRef<HTMLInputElement>(null);
  const impRef = useRef<HTMLInputElement>(null);

  const pct = getPercent(model.done, model.total);
  const streak = calcStreak(state.log || {});
  const trainedDays = Object.keys(state.log || {}).length;
  const prCount = model.p.rows.length;
  const hidCount = prCount - model.placed;

  const firstOfMonth = new Date(calYear, calMonth, 1);
  const lead = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const todayStr = ymd(new Date());

  const handleCalPrev = () => {
    setCalAnim((prev) => ({ key: (prev?.key || 0) + 1, dir: -1 }));
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const handleCalNext = () => {
    setCalAnim((prev) => ({ key: (prev?.key || 0) + 1, dir: 1 }));
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gym-tracker-backup-${ymd(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNote('Backup exported.');
  };

  const handleExportCsv = () => {
    const rows: string[][] = [['Date', 'Workout', 'Summary']];
    Object.entries(state.hist || {})
      .sort()
      .forEach(([dt, days]) => {
        Object.values(days).forEach((d) => rows.push([dt, d.w, d.items.join(' | ')]));
      });
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gym-logs-${ymd(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setNote('CSV log exported.');
  };

  const handleCsvUpload = async (
    file: File | undefined,
    kind: 'prog' | 'core',
    inputEl: HTMLInputElement | null,
  ) => {
    if (!file) return;
    try {
      const txt = await file.text();
      const rows = parseCSV(txt);
      const ok =
        rows.length > 0 && ['Exercise', 'Sets', 'Workout'].every((k) => k in rows[0]);
      if (ok) {
        if (kind === 'prog') onUploadCustomProg(file.name, txt);
        else onUploadCore(file.name, txt);
        setNote(`Loaded ${rows.length} exercises from ${file.name}.`);
      } else {
        setNote(
          `${file.name} couldn’t be loaded. The CSV needs at least Workout, Exercise and Sets columns.`,
        );
      }
    } catch {
      setNote(
        `${file.name} couldn’t be loaded. The CSV needs at least Workout, Exercise and Sets columns.`,
      );
    }
    if (inputEl) inputEl.value = '';
  };

  const handleBackupImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data && typeof data === 'object' && data.done) {
        onRestoreBackup(data);
        setNote('Backup restored successfully.');
      } else {
        setNote('Invalid backup file.');
      }
    } catch {
      setNote('Could not read backup file.');
    }
    if (impRef.current) impRef.current.value = '';
  };

  const renderDayRow = (d: DayModel) => {
    const c = DAY_COLORS[d.n - 1];
    if (d.rest) {
      return (
        <div key={d.n} className="dayrow rest" style={{ '--c': c } as React.CSSProperties}>
          <span className="dno">{d.n}</span>
          <span className="dtx">
            <b>Rest Day</b>
          </span>
        </div>
      );
    }
    const rm = d.runMeta || {};
    const rExtra = d.runOn
      ? rm.dist || rm.time
        ? ` · ${[rm.dist, rm.time].filter(Boolean).join(' / ')}`
        : ', run done'
      : '';
    const isDone = Boolean(d.total && d.done === d.total);
    return (
      <button
        key={d.n}
        type="button"
        className={`dayrow${isDone ? ' done' : ''}`}
        style={{ '--c': c } as React.CSSProperties}
        onClick={() => onSelectDay(d.n)}
      >
        <span className="dno">{d.n}</span>
        <span className="dtx">
          <b>{d.w}</b>
          <span>
            {d.run ? `${d.run}, ` : ''}
            {d.count
              ? `${d.count}${d.count === 1 ? ' exercise' : ' exercises'}`
              : 'No exercises in CSV'}
            {rExtra}
          </span>
        </span>
        <span className="dst">
          {d.done}/{d.total} sets
        </span>
        <span className="bar">
          <i style={{ width: `${getPercent(d.done, d.total)}%` }} />
        </span>
      </button>
    );
  };

  const renderSelectedDateDetail = () => {
    if (!selDate) return null;
    const h = (state.hist || {})[selDate];
    const lg = (state.log || {})[selDate];
    return (
      <div key={selDate} className="day-detail anim-unfold">
        <h4>{selDate}</h4>
        {h && Object.keys(h).length > 0 ? (
          Object.values(h).map((x, idx) => (
            <div key={idx}>
              <p style={{ margin: '4px 0', fontWeight: 600 }}>{x.w}</p>
              <ul>
                {x.items.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            </div>
          ))
        ) : lg && Object.keys(lg).length > 0 ? (
          <p className="sub">
            {Object.keys(lg)
              .map((n) => (SCHED[+n - 1] ? SCHED[+n - 1].w : `Day ${n}`))
              .join(', ')}{' '}
            logged.
          </p>
        ) : (
          <p className="sub">No workouts logged on this date.</p>
        )}
      </div>
    );
  };

  return (
    <div className="anim-view">
      <div className="bar0">
        <span className="brand">Gym Tracker</span>
        <div className="bar0-r">
          <ThemeToggleButton theme={theme} onToggle={onToggleTheme} />
          <button type="button" className="lo" onClick={onLogout}>
            Log out ({user})
          </button>
        </div>
      </div>

      <h1 className="ttl">Weekly training</h1>
      <p className="sub">{model.p.name}</p>

      {askReset ? (
        <div className="sum anim-unfold">
          <p className="pt" style={{ marginBottom: 12 }}>
            Start a new week? Current weights are saved as &quot;Last&quot; targets, and
            checkboxes reset. Calendar history stays.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn dng"
              onClick={() => {
                onResetWeek();
                setAskReset(false);
                setNote('New week started — previous weights saved as targets.');
              }}
            >
              Start new week
            </button>
            <button type="button" className="btn" onClick={() => setAskReset(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="sum">
          <div className="sr">
            <p className="pt">
              {model.done}/{model.total} sets completed ({pct}%)
            </p>
            <button type="button" className="btn sm" onClick={() => setAskReset(true)}>
              <Icon name="reset" />
              New week
            </button>
          </div>
          <span className="bar">
            <i style={{ width: `${pct}%` }} />
          </span>
        </div>
      )}

      <div className="stats-row">
        <div className="stat-box">
          <span>Week Streak</span>
          <b>
            {streak} wk{streak === 1 ? '' : 's'}
          </b>
        </div>
        <div className="stat-box">
          <span>Week Volume</span>
          <b>
            {model.vol.toLocaleString()} {state.unit}
          </b>
        </div>
        <div className="stat-box">
          <span>Days Logged</span>
          <b>{trainedDays}</b>
        </div>
      </div>

      <div className="list">{model.days.map(renderDayRow)}</div>

      <section className="cal2" aria-label="Workout Calendar">
        <div className="ch">
          <button
            type="button"
            className="cb"
            onClick={handleCalPrev}
            aria-label="Previous month"
          >
            <Icon name="back" />
          </button>
          <h2 className="sec">
            {firstOfMonth.toLocaleString('en', { month: 'long' })} {calYear}
          </h2>
          <button
            type="button"
            className="cb"
            onClick={handleCalNext}
            aria-label="Next month"
          >
            <Icon name="next" />
          </button>
        </div>

        <div
          key={calAnim ? calAnim.key : 0}
          className={`cg${
            calAnim ? (calAnim.dir > 0 ? ' cal-in-r' : ' cal-in-l') : ''
          }`}
        >
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <small key={i}>{d}</small>
          ))}
          {Array.from({ length: lead }).map((_, i) => (
            <span key={`lead-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const d = idx + 1;
            const k = ymd(new Date(calYear, calMonth, d));
            const e = (state.log || {})[k] || {};
            const dots = Object.keys(e).sort();
            return (
              <button
                key={k}
                type="button"
                className={`cd${k === todayStr ? ' td' : ''}${k === selDate ? ' sel' : ''}`}
                onClick={() => setSelDate((prev) => (prev === k ? null : k))}
                aria-label={`${k}${dots.length ? `, ${dots.length} logged` : ''}`}
              >
                <b>{d}</b>
                <em>
                  {dots.map((n) => (
                    <i
                      key={n}
                      className={e[+n] === 2 ? 'f' : ''}
                      style={{ '--c': DAY_COLORS[+n - 1] } as React.CSSProperties}
                    />
                  ))}
                </em>
              </button>
            );
          })}
        </div>

        {renderSelectedDateDetail()}
        <p className="sub">
          Tap any date to inspect logged workouts. Filled dot = completed, outlined = started.
        </p>
      </section>

      <section className={`opt${optOpen ? ' open' : ''}`}>
        <button
          type="button"
          className="opt-summary"
          aria-expanded={optOpen}
          onClick={() => setOptOpen((o) => !o)}
        >
          <span>Programme &amp; Data Options</span>
          <span className="chev">
            <Icon name="next" />
          </span>
        </button>

        <div className={`acc-wrap${optOpen ? ' open' : ''}`} inert={!optOpen || undefined}>
          <div className="acc-inner">
            <div className="in">
              {note && <p className="note anim-unfold">{note}</p>}

              <div className="opt-grp">
                <span className="opt-lbl">Active Programme</span>
                <div className="prog-seg" role="group" aria-label="Active Programme">
                  {model.P.map((x) => {
                    const lbl =
                      x.id === 'w14'
                        ? 'Weeks 1–4'
                        : x.id === 'w58'
                          ? 'Weeks 5–8'
                          : x.file || x.name;
                    return (
                      <button
                        key={x.id}
                        type="button"
                        className={x.id === model.p.id ? 'on' : ''}
                        aria-pressed={x.id === model.p.id}
                        onClick={() => {
                          onSetProg(x.id);
                          setNote('');
                        }}
                      >
                        {lbl}
                      </button>
                    );
                  })}
                </div>
                <p className="opt-desc">
                  {model.p.name} · {prCount} exercises loaded.
                  {hidCount > 0 ? ` (${hidCount} unscheduled rows hidden)` : ''}
                </p>
                <div className="opt-actions">
                  <button
                    type="button"
                    className={`btn${state.custom ? '' : ' full'}`}
                    onClick={() => uppRef.current?.click()}
                  >
                    <Icon name="up" />
                    Upload CSV
                  </button>
                  <input
                    ref={uppRef}
                    id="upp"
                    type="file"
                    accept=".csv,text/csv"
                    hidden
                    onChange={(e) => handleCsvUpload(e.target.files?.[0], 'prog', uppRef.current)}
                  />
                  {state.custom && (
                    <button
                      type="button"
                      className="btn dng"
                      onClick={() => {
                        onRemoveCustomProg();
                        setNote('Uploaded programme removed.');
                      }}
                    >
                      Remove CSV
                    </button>
                  )}
                </div>
              </div>

              <div className="opt-grp">
                <span className="opt-lbl">Weight Unit</span>
                <div className="unit-seg" role="group" aria-label="Weight unit">
                  <button
                    type="button"
                    className={state.unit === 'kg' ? 'on' : ''}
                    aria-pressed={state.unit === 'kg'}
                    onClick={() => onSetUnit('kg')}
                  >
                    Kilograms (kg)
                  </button>
                  <button
                    type="button"
                    className={state.unit === 'lbs' ? 'on' : ''}
                    aria-pressed={state.unit === 'lbs'}
                    onClick={() => onSetUnit('lbs')}
                  >
                    Pounds (lbs)
                  </button>
                </div>
              </div>

              <div className="opt-grp">
                <span className="opt-lbl">Run &amp; Core Routine</span>
                <p className="opt-desc" style={{ marginTop: 0 }}>
                  {state.core ? state.core.name : 'Built-in 360-degree core routine'} ·{' '}
                  {model.core.length} exercises on run days.
                </p>
                <div className="opt-actions">
                  <button
                    type="button"
                    className={`btn${state.core ? '' : ' full'}`}
                    onClick={() => upcRef.current?.click()}
                  >
                    <Icon name="up" />
                    Upload Core CSV
                  </button>
                  <input
                    ref={upcRef}
                    id="upc"
                    type="file"
                    accept=".csv,text/csv"
                    hidden
                    onChange={(e) => handleCsvUpload(e.target.files?.[0], 'core', upcRef.current)}
                  />
                  {state.core && (
                    <button
                      type="button"
                      className="btn dng"
                      onClick={() => {
                        onResetCore();
                        setNote('Using the built-in core workout.');
                      }}
                    >
                      Reset Core
                    </button>
                  )}
                </div>
              </div>

              <div className="opt-grp">
                <span className="opt-lbl">Backup &amp; History</span>
                <div className="opt-actions" style={{ marginTop: 0 }}>
                  <button type="button" className="btn" onClick={handleExportJson}>
                    <Icon name="down" />
                    Backup (.json)
                  </button>
                  <button type="button" className="btn" onClick={handleExportCsv}>
                    <Icon name="down" />
                    Logs (.csv)
                  </button>
                  <button
                    type="button"
                    className="btn full"
                    onClick={() => impRef.current?.click()}
                  >
                    <Icon name="up" />
                    Restore Backup (.json)
                  </button>
                  <input
                    ref={impRef}
                    id="impjson"
                    type="file"
                    accept=".json,application/json"
                    hidden
                    onChange={(e) => handleBackupImport(e.target.files?.[0])}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
