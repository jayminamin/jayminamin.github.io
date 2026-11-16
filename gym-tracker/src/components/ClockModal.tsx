import React, { useEffect, useState } from 'react';
import { formatClock, formatStopwatch } from '../utils/workout';

export interface ClockState {
  mode: 'timer' | 'sw' | null;
  running: boolean;
  endAt: number;
  remMs: number;
  startAt: number;
  elapsedMs: number;
}

interface ClockModalProps {
  open: boolean;
  onClose: () => void;
  onStartTimer: (seconds: number) => void;
  onStartStopwatch: () => void;
}

const PRESETS = [
  { label: '0:45', sec: 45 },
  { label: '1:00', sec: 60 },
  { label: '1:30', sec: 90 },
  { label: '2:00', sec: 120 },
  { label: '3:00', sec: 180 },
  { label: '4:00', sec: 240 },
  { label: '5:00', sec: 300 },
  { label: '10:00', sec: 600 },
];

export const ClockModal: React.FC<ClockModalProps> = ({
  open,
  onClose,
  onStartTimer,
  onStartStopwatch,
}) => {
  const [tab, setTab] = useState<'timer' | 'sw'>('timer');
  const [customMin, setCustomMin] = useState(1);
  const [customSec, setCustomSec] = useState(30);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) setClosing(false);
  }, [open]);

  if (!open && !closing) return null;

  const triggerClose = () => {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, 150);
  };

  const handleStartCustom = () => {
    const m = Math.max(0, Number.isFinite(customMin) ? customMin : 0);
    const s = Math.max(0, Number.isFinite(customSec) ? customSec : 0);
    const total = m * 60 + s;
    if (total > 0) {
      onStartTimer(total);
      triggerClose();
    }
  };

  return (
    <div
      className={`modal-bg${closing ? ' closing' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) triggerClose();
      }}
    >
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label="Timer and Stopwatch"
      >
        <div className="modal-hd">
          <h3>Timer &amp; Stopwatch</h3>
          <button
            type="button"
            className="modal-x"
            onClick={triggerClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="seg" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'timer'}
            className={tab === 'timer' ? 'on' : ''}
            onClick={() => setTab('timer')}
          >
            Timer
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'sw'}
            className={tab === 'sw' ? 'on' : ''}
            onClick={() => setTab('sw')}
          >
            Stopwatch
          </button>
        </div>

        {tab === 'timer' ? (
          <div key="timer" className="anim-unfold">
            <div className="presets">
              {PRESETS.map((p) => (
                <button
                  key={p.sec}
                  type="button"
                  onClick={() => {
                    onStartTimer(p.sec);
                    triggerClose();
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="custom-time">
              <label>
                Minutes
                <input
                  type="number"
                  min={0}
                  max={180}
                  value={customMin}
                  onChange={(e) => setCustomMin(parseInt(e.target.value || '0', 10) || 0)}
                />
              </label>
              <label>
                Seconds
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={customSec}
                  onChange={(e) => setCustomSec(parseInt(e.target.value || '0', 10) || 0)}
                />
              </label>
            </div>
            <button
              type="button"
              className="btn pri"
              style={{ marginTop: 0 }}
              onClick={handleStartCustom}
            >
              Start Timer
            </button>
          </div>
        ) : (
          <div key="sw" className="anim-unfold">
            <p className="sub" style={{ marginBottom: 16 }}>
              Track rest periods, planks, carries, or total workout duration with a floating
              stopwatch pill.
            </p>
            <button
              type="button"
              className="btn pri"
              style={{ marginTop: 0 }}
              onClick={() => {
                onStartStopwatch();
                triggerClose();
              }}
            >
              Start Stopwatch
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface TimerPillProps {
  clk: ClockState;
  onAdjust: (deltaSec: number) => void;
  onToggle: () => void;
  onResetSw: () => void;
  onClose: () => void;
}

export const TimerPill: React.FC<TimerPillProps> = ({
  clk,
  onAdjust,
  onToggle,
  onResetSw,
  onClose,
}) => {
  if (!clk.mode) return null;
  const done = clk.mode === 'timer' && clk.remMs <= 0 && !clk.running;

  return (
    <div
      className={`timer-pill pill-in${done ? ' pill-done' : ''}`}
      role="status"
      aria-live="polite"
    >
      <span className="tag">
        {clk.mode === 'timer' ? (done ? 'Done' : 'Timer') : 'Stopwatch'}
      </span>
      <b>{clk.mode === 'timer' ? formatClock(clk.remMs) : formatStopwatch(clk.elapsedMs)}</b>
      {clk.mode === 'timer' ? (
        <>
          <button type="button" onClick={() => onAdjust(-15)}>
            -15s
          </button>
          <button type="button" onClick={() => onAdjust(15)}>
            +15s
          </button>
          {!done && (
            <button type="button" className="pri-sm" onClick={onToggle}>
              {clk.running ? 'Pause' : 'Start'}
            </button>
          )}
        </>
      ) : (
        <>
          <button type="button" className="pri-sm" onClick={onToggle}>
            {clk.running ? 'Pause' : 'Start'}
          </button>
          <button type="button" onClick={onResetSw}>
            Reset
          </button>
        </>
      )}
      <button
        type="button"
        className="x"
        onClick={onClose}
        aria-label={clk.mode === 'timer' ? 'Close timer' : 'Close stopwatch'}
      >
        ✕
      </button>
    </div>
  );
};
