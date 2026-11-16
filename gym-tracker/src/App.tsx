import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ClockModal, ClockState, TimerPill } from './components/ClockModal';
import { DashboardView } from './components/DashboardView';
import { LoginView } from './components/LoginView';
import { WorkoutView } from './components/WorkoutView';
import { DAY_COLORS, DEFAULT_CSV } from './data/programs';
import {
  applyDocumentTheme,
  fetchOptionalText,
  getInitialTheme,
  getSavedSession,
  initDynamicPWA,
  loadUserState,
  saveSession,
  saveUserState,
} from './utils/storage';
import {
  applyLogDay,
  buildModel,
  buildUsers,
  calc1RM,
  CsvSourceMap,
  defaultState,
  TrackerState,
} from './utils/workout';

function playTimerBeep(): void {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    [0, 0.18, 0.36].forEach((d) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.18, ctx.currentTime + d);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d + 0.14);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(ctx.currentTime + d);
      o.stop(ctx.currentTime + d + 0.15);
    });
    if (navigator.vibrate) navigator.vibrate([150, 80, 150]);
  } catch {
    // AudioContext might be blocked without gesture
  }
}

export default function App() {
  const [users, setUsers] = useState<Record<string, string>>(() => buildUsers(DEFAULT_CSV.logins));
  const [csvSources, setCsvSources] = useState<CsvSourceMap>({
    w14: DEFAULT_CSV.w14,
    w58: DEFAULT_CSV.w58,
    core: DEFAULT_CSV.core,
  });

  const [user, setUser] = useState<string | null>(() => getSavedSession(buildUsers(DEFAULT_CSV.logins)));
  const [state, setState] = useState<TrackerState>(() =>
    user ? loadUserState(user) : defaultState(),
  );
  const [route, setRoute] = useState<'dashboard' | 'workout'>(() =>
    window.location.hash === '#workout' ? 'workout' : 'dashboard',
  );
  const [theme, setTheme] = useState<'dark' | 'light'>(() => getInitialTheme());
  const [justCheckedKey, setJustCheckedKey] = useState<string | null>(null);
  const [clockModalOpen, setClockModalOpen] = useState(false);
  const [clk, setClk] = useState<ClockState>({
    mode: null,
    running: false,
    endAt: 0,
    remMs: 0,
    startAt: 0,
    elapsedMs: 0,
  });

  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Initialize PWA manifest & theme once
  useEffect(() => {
    initDynamicPWA();
    applyDocumentTheme(theme, false);
  }, []);

  // Optional live CSV/logins fetch (keeps embedded defaults if not hosted alongside CSVs)
  useEffect(() => {
    let active = true;
    (async () => {
      const loginTxt = await fetchOptionalText([
        'logins.txt',
        'logins.txt.txt',
        'Logins.txt',
        'login.txt',
      ]);
      if (active && loginTxt) {
        const parsed = buildUsers(loginTxt);
        if (Object.keys(parsed).length) setUsers(parsed);
      }
      const [w14, w58, core] = await Promise.all([
        fetchOptionalText(['weeks-1-4.csv']),
        fetchOptionalText(['weeks-5-8.csv']),
        fetchOptionalText(['core-workout.csv']),
      ]);
      if (active && (w14 || w58 || core)) {
        setCsvSources((prev) => ({
          w14: w14 || prev.w14,
          w58: w58 || prev.w58,
          core: core || prev.core,
        }));
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Sync hash route
  useEffect(() => {
    const onHashChange = () => {
      setRoute(window.location.hash === '#workout' ? 'workout' : 'dashboard');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Persist user state on change
  useEffect(() => {
    if (user) saveUserState(user, state);
  }, [user, state]);

  // Sync root accent & ambient glow variables ONLY when view/day changes
  useEffect(() => {
    const rootStyle = document.documentElement.style;
    const isWorkout = Boolean(user && route === 'workout');
    const dc = DAY_COLORS[(state.day || 1) - 1] || DAY_COLORS[0];
    if (isWorkout) {
      rootStyle.setProperty('--ac', dc);
      [dc, dc, dc, dc].forEach((c, i) => rootStyle.setProperty(`--g${i + 1}`, c));
    } else {
      rootStyle.removeProperty('--ac');
      [DAY_COLORS[0], DAY_COLORS[1], DAY_COLORS[4], DAY_COLORS[2]].forEach((c, i) =>
        rootStyle.setProperty(`--g${i + 1}`, c),
      );
    }
  }, [user, route, state.day]);

  // Wake Lock on workout view
  useEffect(() => {
    const syncWakeLock = async () => {
      try {
        if (user && route === 'workout') {
          if (!wakeLockRef.current && 'wakeLock' in navigator) {
            wakeLockRef.current = await navigator.wakeLock.request('screen');
          }
        } else if (wakeLockRef.current) {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
        }
      } catch {
        // Ignore unsupported / denied wakeLock
      }
    };
    syncWakeLock();
    const onVis = () => {
      if (document.visibilityState === 'visible') syncWakeLock();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [user, route]);

  // Clear checkbox pop marker after animation finishes
  useEffect(() => {
    if (!justCheckedKey) return;
    const t = window.setTimeout(() => setJustCheckedKey(null), 450);
    return () => window.clearTimeout(t);
  }, [justCheckedKey]);

  // Timer / stopwatch interval
  useEffect(() => {
    if (!clk.mode || !clk.running) return;
    const iv = window.setInterval(() => {
      setClk((prev) => {
        if (!prev.mode || !prev.running) return prev;
        if (prev.mode === 'timer') {
          const rem = prev.endAt - Date.now();
          if (rem <= 0) {
            playTimerBeep();
            return { ...prev, remMs: 0, running: false };
          }
          return { ...prev, remMs: rem };
        }
        return { ...prev, elapsedMs: Date.now() - prev.startAt };
      });
    }, 200);
    return () => window.clearInterval(iv);
  }, [clk.mode, clk.running]);

  const model = useMemo(() => buildModel(state, csvSources), [state, csvSources]);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      applyDocumentTheme(next, true);
      return next;
    });
  }, []);

  const handleLogin = useCallback(
    (username: string, password: string): boolean => {
      const u = username.toLowerCase();
      if (u && users[u] !== undefined && users[u] === password) {
        setUser(u);
        setState(loadUserState(u));
        saveSession(u);
        return true;
      }
      return false;
    },
    [users],
  );

  const handleLogout = useCallback(() => {
    if (user) saveUserState(user, state);
    setUser(null);
    saveSession(null);
  }, [user, state]);

  const handleSelectDay = useCallback((day: number) => {
    setState((prev) => ({ ...prev, day }));
    if (window.location.hash !== '#workout') {
      window.location.hash = 'workout';
    }
  }, []);

  const handleGoDashboard = useCallback(() => {
    window.location.hash = 'dashboard';
  }, []);

  const handleUpdateSetField = useCallback(
    (key: string, idx: number, field: 'w' | 'r', value: string) => {
      setState((prev) => {
        const pid = buildModel(prev, csvSources).p.id;
        const progWeights = { ...(prev.weights[pid] || {}) };
        const exArr = [...(progWeights[key] || [])];
        exArr[idx] = { ...(exArr[idx] || {}), [field]: value };
        progWeights[key] = exArr;
        return {
          ...prev,
          weights: { ...prev.weights, [pid]: progWeights },
        };
      });
    },
    [csvSources],
  );

  const handleCopyFirstSet = useCallback(
    (key: string, sets: number) => {
      setState((prev) => {
        const pid = buildModel(prev, csvSources).p.id;
        const progWeights = { ...(prev.weights[pid] || {}) };
        const exArr = [...(progWeights[key] || [])];
        const first = exArr[0] || {};
        for (let i = 1; i < sets; i++) {
          exArr[i] = { w: first.w || '', r: first.r || '' };
        }
        progWeights[key] = exArr;
        return {
          ...prev,
          weights: { ...prev.weights, [pid]: progWeights },
        };
      });
    },
    [csvSources],
  );

  const handleToggleSetDone = useCallback(
    (key: string, idx: number, checked: boolean, exName: string) => {
      if (checked) {
        setJustCheckedKey(`${key}:${idx}`);
      }
      setState((prev) => {
        const pid = buildModel(prev, csvSources).p.id;
        const progDone = { ...(prev.done[pid] || {}) };
        const exDone = [...(progDone[key] || [])];
        exDone[idx] = checked;
        progDone[key] = exDone;

        let nextBest = prev.best1rm;
        if (checked && exName) {
          const wEntry = ((prev.weights[pid] || {})[key] || [])[idx] || {};
          if (wEntry.w) {
            const e1rm = calc1RM(wEntry.w, wEntry.r || 1);
            const prevBest = prev.best1rm[exName] || 0;
            if (e1rm > prevBest) {
              nextBest = { ...prev.best1rm, [exName]: e1rm };
            }
          }
        }

        const draft: TrackerState = {
          ...prev,
          done: { ...prev.done, [pid]: progDone },
          best1rm: nextBest,
        };
        const { log, hist } = applyLogDay(draft, key, csvSources);
        return { ...draft, log, hist };
      });
    },
    [csvSources],
  );

  const handleUpdateRunField = useCallback(
    (runKey: string, field: 'dist' | 'time', value: string) => {
      setState((prev) => {
        const pid = buildModel(prev, csvSources).p.id;
        const progRuns = { ...(prev.runs[pid] || {}) };
        progRuns[runKey] = { ...(progRuns[runKey] || {}), [field]: value };
        return {
          ...prev,
          runs: { ...prev.runs, [pid]: progRuns },
        };
      });
    },
    [csvSources],
  );

  const handleResetWeek = useCallback(() => {
    setState((prev) => {
      const pid = buildModel(prev, csvSources).p.id;
      const clonedWeights = JSON.parse(JSON.stringify(prev.weights[pid] || {}));
      return {
        ...prev,
        prevWeights: { ...prev.prevWeights, [pid]: clonedWeights },
        done: { ...prev.done, [pid]: {} },
      };
    });
  }, [csvSources]);

  const handleStartTimer = (seconds: number) => {
    setClk({
      mode: 'timer',
      running: true,
      endAt: Date.now() + seconds * 1000,
      remMs: seconds * 1000,
      startAt: 0,
      elapsedMs: 0,
    });
  };

  const handleStartStopwatch = () => {
    setClk({
      mode: 'sw',
      running: true,
      endAt: 0,
      remMs: 0,
      startAt: Date.now(),
      elapsedMs: 0,
    });
  };

  const handleToggleClockRun = () => {
    setClk((prev) => {
      if (!prev.mode) return prev;
      if (prev.running) {
        return {
          ...prev,
          running: false,
          remMs: prev.mode === 'timer' ? Math.max(0, prev.endAt - Date.now()) : prev.remMs,
          elapsedMs: prev.mode === 'sw' ? Date.now() - prev.startAt : prev.elapsedMs,
        };
      }
      if (prev.mode === 'timer') {
        if (prev.remMs <= 0) return prev;
        return { ...prev, running: true, endAt: Date.now() + prev.remMs };
      }
      return { ...prev, running: true, startAt: Date.now() - prev.elapsedMs };
    });
  };

  const handleAdjustTimer = (deltaSec: number) => {
    setClk((prev) => {
      if (prev.mode !== 'timer') return prev;
      if (prev.running) {
        const endAt = Math.max(Date.now() + 1000, prev.endAt + deltaSec * 1000);
        return { ...prev, endAt, remMs: endAt - Date.now() };
      }
      return { ...prev, remMs: Math.max(0, prev.remMs + deltaSec * 1000) };
    });
  };

  const handleResetSw = () => {
    setClk((prev) => {
      if (prev.mode !== 'sw') return prev;
      return { ...prev, elapsedMs: 0, startAt: prev.running ? Date.now() : prev.startAt };
    });
  };

  const handleCloseClockPill = () => {
    setClk({
      mode: null,
      running: false,
      endAt: 0,
      remMs: 0,
      startAt: 0,
      elapsedMs: 0,
    });
  };

  return (
    <>
      <main id="app">
        {!user ? (
          <LoginView
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onLogin={handleLogin}
          />
        ) : route === 'workout' ? (
          <WorkoutView
            theme={theme}
            clockActive={Boolean(clk.mode)}
            state={state}
            model={model}
            justCheckedKey={justCheckedKey}
            onGoDashboard={handleGoDashboard}
            onOpenClock={() => setClockModalOpen(true)}
            onToggleTheme={handleToggleTheme}
            onSelectDay={handleSelectDay}
            onUpdateSetField={handleUpdateSetField}
            onCopyFirstSet={handleCopyFirstSet}
            onToggleSetDone={handleToggleSetDone}
            onUpdateRunField={handleUpdateRunField}
          />
        ) : (
          <DashboardView
            user={user}
            theme={theme}
            state={state}
            model={model}
            onToggleTheme={handleToggleTheme}
            onLogout={handleLogout}
            onSelectDay={handleSelectDay}
            onSetProg={(prog) => setState((prev) => ({ ...prev, prog }))}
            onSetUnit={(unit) => setState((prev) => ({ ...prev, unit }))}
            onResetWeek={handleResetWeek}
            onUploadCustomProg={(name, csv) =>
              setState((prev) => ({ ...prev, custom: { name, csv }, prog: 'custom' }))
            }
            onRemoveCustomProg={() =>
              setState((prev) => {
                const next = { ...prev, prog: 'w14' };
                delete next.custom;
                return next;
              })
            }
            onUploadCore={(name, csv) =>
              setState((prev) => ({ ...prev, core: { name, csv } }))
            }
            onResetCore={() =>
              setState((prev) => {
                const next = { ...prev };
                delete next.core;
                return next;
              })
            }
            onRestoreBackup={(data) =>
              setState({ ...defaultState(), ...data })
            }
          />
        )}
      </main>

      <ClockModal
        open={clockModalOpen}
        onClose={() => setClockModalOpen(false)}
        onStartTimer={handleStartTimer}
        onStartStopwatch={handleStartStopwatch}
      />

      <TimerPill
        clk={clk}
        onAdjust={handleAdjustTimer}
        onToggle={handleToggleClockRun}
        onResetSw={handleResetSw}
        onClose={handleCloseClockPill}
      />
    </>
  );
}
