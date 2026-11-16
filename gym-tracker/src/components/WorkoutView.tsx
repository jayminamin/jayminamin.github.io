import React, { useState } from 'react';
import { DAY_COLORS } from '../data/programs';
import {
  ExerciseModel,
  getPercent,
  TrackerModel,
  TrackerState,
} from '../utils/workout';
import { Icon, IconName, ThemeToggleButton } from './Icons';

interface ExerciseCardProps {
  ex: ExerciseModel;
  num: number;
  unit: 'kg' | 'lbs';
  open: boolean;
  detailsOpen: boolean;
  justCheckedKey: string | null;
  onToggleOpen: (key: string) => void;
  onToggleDetails: (key: string) => void;
  onUpdateSetField: (key: string, idx: number, field: 'w' | 'r', value: string) => void;
  onCopyFirstSet: (key: string, sets: number) => void;
  onToggleSetDone: (key: string, idx: number, checked: boolean, exName: string) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = React.memo(
  ({
    ex,
    num,
    unit,
    open,
    detailsOpen,
    justCheckedKey,
    onToggleOpen,
    onToggleDetails,
    onUpdateSetField,
    onCopyFirstSet,
    onToggleSetDone,
  }) => {
    const f = ex.r;
    const n = ex.sets;
    const c = ex.done;
    const full = c === n;
    const rp = /^[\d-]+$/.test(f.Reps || '') ? `${f.Reps} reps` : f.Reps;
    const tutUrl = f['Video Tutorial'] || '';
    const justDone = Boolean(full && justCheckedKey && justCheckedKey.startsWith(ex.key + ':'));

    const renderField = (label: string, val: string | undefined, icon: IconName, wide?: boolean) => (
      <div className={wide ? 'w' : undefined}>
        <dt>
          <Icon name={icon} />
          {label}
        </dt>
        <dd>{val || '—'}</dd>
      </div>
    );

    return (
      <article className={`ex${full ? ' done' : ''}${open ? ' open' : ''}`}>
        <button
          type="button"
          className="eh"
          aria-expanded={open}
          onClick={() => onToggleOpen(ex.key)}
        >
          <span className={`no${justDone ? ' no-pop' : ''}`}>
            {full ? <Icon name="check" /> : num}
          </span>
          <span className="en">
            {f.Exercise || 'Untitled exercise'}
            {ex.hasPR && <span className="pr-badge">PR</span>}
          </span>
          <span className="rs">
            <b>
              {f.Sets || n} × {f.Reps || '—'}
            </b>
            <span>
              {c}/{n} completed
            </span>
          </span>
          <span className="chev">
            <Icon name="next" />
          </span>
        </button>

        <div className={`acc-wrap${open ? ' open' : ''}`} inert={!open || undefined}>
          <div className="acc-inner">
            <div className="eb">
              {f['Form Notes'] && <p className="notes">{f['Form Notes']}</p>}
              <div className="sets">
                {Array.from({ length: n }).map((_, i) => {
                  const on = !!ex.arr[i];
                  const cur = ex.wArr[i] || {};
                  const prv = ex.pwArr[i] || {};
                  const subTxt = prv.w
                    ? `Last: ${prv.w}${unit}${prv.r ? ' × ' + prv.r : ''}`
                    : rp
                      ? `Rec: ${rp}`
                      : '';
                  const isPop = justCheckedKey === `${ex.key}:${i}`;
                  const cbId = `cb-${ex.key}-${i}`;

                  return (
                    <div key={i} className={`set${on ? ' on' : ''}`}>
                      <label className="set-lbl" htmlFor={cbId}>
                        <b>Set {i + 1}</b>
                        {subTxt && <small>{subTxt}</small>}
                      </label>
                      <div className="set-in">
                        {i === 0 && n > 1 && (
                          <button
                            type="button"
                            className="copy-btn"
                            onClick={() => onCopyFirstSet(ex.key, n)}
                            title="Copy Set 1 weight & reps to all sets"
                            aria-label="Copy Set 1 weight and reps to all sets"
                          >
                            <Icon name="fill" />
                          </button>
                        )}
                        <input
                          className="num-in"
                          type="number"
                          inputMode="decimal"
                          step="0.5"
                          placeholder={prv.w || unit}
                          aria-label={`Set ${i + 1} weight`}
                          value={cur.w || ''}
                          onChange={(e) => onUpdateSetField(ex.key, i, 'w', e.target.value)}
                        />
                        <input
                          className="num-in"
                          type="number"
                          inputMode="numeric"
                          placeholder={
                            prv.r || String(f.Reps || '').replace(/[^\d]/g, '') || 'reps'
                          }
                          aria-label={`Set ${i + 1} reps`}
                          value={cur.r || ''}
                          onChange={(e) => onUpdateSetField(ex.key, i, 'r', e.target.value)}
                        />
                        <input
                          id={cbId}
                          type="checkbox"
                          className={isPop ? 'chk-pop' : undefined}
                          checked={on}
                          onChange={(e) =>
                            onToggleSetDone(ex.key, i, e.target.checked, f.Exercise || '')
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className="more"
                aria-expanded={detailsOpen}
                onClick={() => onToggleDetails(ex.key)}
              >
                {detailsOpen ? 'Hide details' : 'More details'}
                <Icon name="next" />
              </button>

              <div
                className={`acc-wrap${detailsOpen ? ' open' : ''}`}
                inert={!detailsOpen || undefined}
              >
                <div className="acc-inner">
                  <dl className="meta">
                    {renderField('Target muscle', f['Target Muscle'], 'target', true)}
                    {renderField('Reps to failure', f['Reps to Failure'], 'flame')}
                    {renderField('Rest', f.Rest, 'clock')}
                  </dl>
                  <div className="tut-row">
                    {/^https?:\/\//i.test(tutUrl) ? (
                      <a
                        className="tut"
                        href={tutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon name="play" />
                        Watch Tutorial ↗
                      </a>
                    ) : (
                      <span className="sub">No tutorial listed</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  },
);

ExerciseCard.displayName = 'ExerciseCard';

interface WorkoutViewProps {
  theme: 'dark' | 'light';
  clockActive: boolean;
  state: TrackerState;
  model: TrackerModel;
  justCheckedKey: string | null;
  onGoDashboard: () => void;
  onOpenClock: () => void;
  onToggleTheme: () => void;
  onSelectDay: (day: number) => void;
  onUpdateSetField: (key: string, idx: number, field: 'w' | 'r', value: string) => void;
  onCopyFirstSet: (key: string, sets: number) => void;
  onToggleSetDone: (key: string, idx: number, checked: boolean, exName: string) => void;
  onUpdateRunField: (runKey: string, field: 'dist' | 'time', value: string) => void;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({
  theme,
  clockActive,
  state,
  model,
  justCheckedKey,
  onGoDashboard,
  onOpenClock,
  onToggleTheme,
  onSelectDay,
  onUpdateSetField,
  onCopyFirstSet,
  onToggleSetDone,
  onUpdateRunField,
}) => {
  const [openEx, setOpenEx] = useState<Set<string>>(() => new Set());
  const [openDetails, setOpenDetails] = useState<Set<string>>(() => new Set());

  const d = model.days.find((x) => x.n === state.day) || model.days[0];
  const r0 = d.groups?.[0]?.rows?.[0];
  const dayColor = DAY_COLORS[d.n - 1];
  const sub =
    d.rest || d.run
      ? `Day ${d.n}`
      : r0
        ? `${r0.Block}, listed as ${r0.Day} in the CSV`
        : 'No exercises for this workout in the CSV';

  const handleToggleOpen = (key: string) => {
    setOpenEx((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleToggleDetails = (key: string) => {
    setOpenDetails((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const runKey = `run${d.n}`;
  const runPop = justCheckedKey === `${runKey}:0`;

  return (
    <div key="workout-shell" className="anim-view" style={{ '--ac': dayColor } as React.CSSProperties}>
      <div className="bar0">
        <a
          className="back"
          href="#dashboard"
          onClick={(e) => {
            e.preventDefault();
            onGoDashboard();
          }}
        >
          <Icon name="back" />
          Dashboard
        </a>
        <div className="bar0-r">
          <button
            type="button"
            className={`icon-btn${clockActive ? ' active' : ''}`}
            onClick={onOpenClock}
            aria-label="Timer & Stopwatch"
            title="Timer & Stopwatch"
          >
            <Icon name="timer" />
          </button>
          <ThemeToggleButton theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>

      <h1 className="ttl">{d.w}</h1>
      <p className="sub">{sub}</p>

      <div className="cal">
        <div className="strip">
          {model.days.map((x) => {
            const full = Boolean(x.total && x.done === x.total);
            return (
              <button
                key={x.n}
                type="button"
                className={`dy${x.n === d.n ? ' on' : ''}${full ? ' full' : ''}`}
                style={{ '--c': DAY_COLORS[x.n - 1] } as React.CSSProperties}
                onClick={() => onSelectDay(x.n)}
                aria-label={`Day ${x.n}`}
              >
                Day<span>{x.n}</span>
              </button>
            );
          })}
        </div>
        {!d.rest && (
          <>
            <p className="pt">
              {d.done}/{d.total} sets completed ({getPercent(d.done, d.total)}%)
            </p>
            <span className="bar">
              <i style={{ width: `${getPercent(d.done, d.total)}%` }} />
            </span>
          </>
        )}
      </div>

      {d.rest ? (
        <p className="sub">No training scheduled.</p>
      ) : (
        <>
          {d.run && (
            <article className={`ex${d.runOn ? ' done' : ''}`}>
              <div className="eh static">
                <span className={`no${d.runOn && runPop ? ' no-pop' : ''}`}>
                  {d.runOn ? <Icon name="check" /> : <Icon name="pulse" />}
                </span>
                <span className="en">{d.run}</span>
              </div>
              <div className="eb">
                <div className="sets" style={{ margin: 0 }}>
                  <label className={`set${d.runOn ? ' on' : ''}`}>
                    <span className="set-lbl">
                      <b>Run completed</b>
                      <small>Log optional distance &amp; duration below</small>
                    </span>
                    <input
                      type="checkbox"
                      className={runPop ? 'chk-pop' : undefined}
                      checked={d.runOn}
                      onChange={(e) => onToggleSetDone(runKey, 0, e.target.checked, '')}
                    />
                  </label>
                </div>
                <div className="run-grid">
                  <label>
                    Distance
                    <input
                      type="text"
                      placeholder="e.g. 5 km"
                      value={d.runMeta.dist || ''}
                      onChange={(e) => onUpdateRunField(runKey, 'dist', e.target.value)}
                    />
                  </label>
                  <label>
                    Duration / Intervals
                    <input
                      type="text"
                      placeholder="e.g. 28:30 or 8×400m"
                      value={d.runMeta.time || ''}
                      onChange={(e) => onUpdateRunField(runKey, 'time', e.target.value)}
                    />
                  </label>
                </div>
              </div>
            </article>
          )}

          {d.groups.map((g, gi) => (
            <React.Fragment key={`${d.n}-${gi}-${g.title}`}>
              {d.run && g.rows[0] && (
                <>
                  <h2 className="sec">{g.title}</h2>
                  <p className="sub">
                    {g.rows[0].Block}, {g.rows[0].Day}
                  </p>
                </>
              )}
              {g.ex.map((ex, i) => (
                <ExerciseCard
                  key={ex.key}
                  ex={ex}
                  num={i + 1}
                  unit={state.unit}
                  open={openEx.has(ex.key)}
                  detailsOpen={openDetails.has(ex.key)}
                  justCheckedKey={justCheckedKey}
                  onToggleOpen={handleToggleOpen}
                  onToggleDetails={handleToggleDetails}
                  onUpdateSetField={onUpdateSetField}
                  onCopyFirstSet={onCopyFirstSet}
                  onToggleSetDone={onToggleSetDone}
                />
              ))}
            </React.Fragment>
          ))}
        </>
      )}
    </div>
  );
};
