import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildModel,
  buildUsers,
  calc1RM,
  calcStreak,
  defaultState,
  fixReps,
  formatClock,
  formatStopwatch,
  getPercent,
  parseCSV,
} from './workout';

test('fixReps repairs Excel-mangled month ranges', () => {
  assert.equal(fixReps('10-Dec'), '10-12');
  assert.equal(fixReps('Dec-15'), '12-15');
  assert.equal(fixReps('15-20'), '15-20');
  assert.equal(fixReps('10/leg'), '10/leg');
});

test('parseCSV parses quoted fields and repairs Reps', () => {
  const csv = `Block,Day,Workout,Exercise,Sets,Reps\nW58,Day 2,Upper Body #1,"Barbell Shrug",3,10-Dec\nW58,Day 4,Upper Body #2,"Dumbbell Shrug",3,Dec-15\n`;
  const rows = parseCSV(csv);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].Exercise, 'Barbell Shrug');
  assert.equal(rows[0].Reps, '10-12');
  assert.equal(rows[1].Reps, '12-15');
});

test('buildUsers parses valid login lines and ignores comments', () => {
  const users = buildUsers('# comment\ndemo:demo123\nFriend:LetMeIn\n');
  assert.deepEqual(users, { demo: 'demo123', friend: 'LetMeIn' });
});

test('calc1RM uses Epley formula accurately', () => {
  assert.equal(calc1RM(100, 1), 100);
  assert.equal(calc1RM(100, 10), 133.3);
  assert.equal(calc1RM(0, 10), 0);
});

test('buildModel aggregates sets, completion, and volume across programs', () => {
  const state = defaultState();
  const model = buildModel(state);
  assert.equal(model.p.id, 'w14');
  assert.equal(model.days.length, 7);
  assert.ok(model.total > 0);
  assert.equal(model.done, 0);

  // Mark Back Squat set 1 done with weight and reps
  const day1 = model.days[0];
  const firstEx = day1.groups[0].ex[0];
  state.done.w14 = { [firstEx.key]: [true, false, false] };
  state.weights.w14 = { [firstEx.key]: [{ w: '100', r: '6' }] };

  const updated = buildModel(state);
  assert.equal(updated.done, 1);
  assert.equal(updated.vol, 600);
  assert.equal(updated.days[0].done, 1);
});

test('calcStreak counts consecutive logged weeks', () => {
  const today = new Date(2026, 10, 16); // Monday 2026-11-16
  const log = {
    '2026-11-16': { 1: 2 },
    '2026-11-10': { 2: 2 },
    '2026-11-02': { 1: 1 },
  };
  assert.equal(calcStreak(log, today), 3);
});

test('clock formatting and percentage helpers', () => {
  assert.equal(getPercent(1, 3), 33);
  assert.equal(getPercent(0, 0), 0);
  assert.equal(formatClock(90000), '1:30');
  assert.equal(formatStopwatch(3661000), '1:01:01');
});
