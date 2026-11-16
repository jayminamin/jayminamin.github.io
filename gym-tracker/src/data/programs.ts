export interface ScheduleDay {
  n: number;
  w: string;
  run?: string;
  rest?: number;
}

export const SCHED: ScheduleDay[] = [
  { n: 1, w: 'Lower Body #1' },
  { n: 2, w: 'Upper Body #1' },
  { n: 3, w: 'Run / Core', run: 'Run 1: HIIT' },
  { n: 4, w: 'Lower Body #2' },
  { n: 5, w: 'Upper Body #2' },
  { n: 6, w: 'Run / Core', run: 'Run 2: Easy run' },
  { n: 7, w: 'Rest Day', rest: 1 },
];

export const DAY_COLORS = [
  '#ff7a45',
  '#4da3ff',
  '#2fd6a0',
  '#ff4d7e',
  '#b277ff',
  '#ffc83d',
  '#6b7280',
];

export const DEFAULT_CSV = {
  w14: `﻿Block,Day,Workout,Exercise,Target Muscle,Sets,Reps,Reps to Failure,Rest,Form Notes,Video Tutorial
Weeks 1-4 (Modified Strength Base),Day 1,Lower Body #1,Back Squat,"Quads, Glutes",3,6,3 reps from failure,3-4 min,"Sit back and down, 15° toe flare, drive your knees out laterally.",https://www.youtube.com/watch?v=bEv6CCg2BC8
Weeks 1-4 (Modified Strength Base),Day 1,Lower Body #1,Romanian Deadlift,"Hamstrings, Glutes",3,10,3 reps from failure,2-3 min,"Maintain a neutral lower back, set your hips back, don't allow your spine to round.",https://www.youtube.com/watch?v=_oyxCn2iSjU
Weeks 1-4 (Modified Strength Base),Day 1,Lower Body #1,Barbell Hip Thrust,Glutes,3,12,2 reps from failure,2-3 min,"Tuck your chin and rib cage down, only move your hips. Use a pad on the bar across your bench.",https://www.youtube.com/watch?v=xDmFkJxPzeM
Weeks 1-4 (Modified Strength Base),Day 1,Lower Body #1,Leg Extension,Quads,3,12,1 rep from failure,1-2 min,Focus on squeezing your quads to make the weight move.,https://www.youtube.com/watch?v=ljO4jkwv8wQ
Weeks 1-4 (Modified Strength Base),Day 1,Lower Body #1,Lying Leg Curl (or Seated),Hamstrings,3,12,1 rep from failure,1-2 min,Focus on squeezing your hamstrings to make the weight move.,https://www.youtube.com/watch?v=Lh3iMIcbkBQ
Weeks 1-4 (Modified Strength Base),Day 1,Lower Body #1,Side-Lying Dumbbell Hip Abduction,Upper Glutes,3,12/side,3 reps from failure,1-2 min,"Lie on your side on the floor/bench, hold a dumbbell on your outer thigh, and raise your top leg with a straight knee.",https://www.youtube.com/watch?v=-rDiQXjeXO0
Weeks 1-4 (Modified Strength Base),Day 1,Lower Body #1,Crunch,Abs,3,12,3 reps from failure,1-2 min,"Focus on flexing your spine, don't yank your head with your arms.",https://www.youtube.com/watch?v=1G0y8D5rFDc
Weeks 1-4 (Modified Strength Base),Day 2,Upper Body #1,Barbell Bench Press,"Chest, Triceps",3,5,3 reps from failure,3-4 min,"Tuck elbows at a 45° angle, squeeze your shoulder blades and stay firm on the bench.",https://www.youtube.com/watch?v=vcBig73ojpE
Weeks 1-4 (Modified Strength Base),Day 2,Upper Body #1,Lat Pulldown,Lats,3,10,2 reps from failure,2-3 min,"Pull your elbows straight out to your sides, use a 1.5x shoulder width grip.",https://www.youtube.com/watch?v=hnSqbBk15tw
Weeks 1-4 (Modified Strength Base),Day 2,Upper Body #1,Military Press,Front Delts,3,10,3 reps from failure,3-4 min,"Squeeze your glutes to keep your torso upright, clear your head out of the way, press up and slightly back.",https://www.youtube.com/watch?v=_RlRDWO2jfg
Weeks 1-4 (Modified Strength Base),Day 2,Upper Body #1,Chest-Supported Dumbbell Row,"Mid-Back, Mid/Lower Traps",3,12,2 reps from failure,2-3 min,Lie chest-down on a 30-45° incline bench (or brace one hand on a flat bench); retract shoulder blades at the top.,https://www.youtube.com/watch?v=2ByilQ4NaAs
Weeks 1-4 (Modified Strength Base),Day 2,Upper Body #1,Dumbbell Flye,Chest,3,12,2 reps from failure,1-2 min,"Keep shoulder blades retracted and elbows slightly bent; lower until upper arms are level with the bench, then squeeze together.",https://www.youtube.com/watch?v=QENKPHhQVi4
Weeks 1-4 (Modified Strength Base),Day 2,Upper Body #1,Barbell Shrug,Upper Traps,3,10-12,2 reps from failure,1-2 min,"Stand tall with a slight forward torso lean, pull shoulders straight up toward your ears without rolling them, pause 1 sec at the top.",https://www.youtube.com/watch?v=C6sYjDFuq9I
Weeks 1-4 (Modified Strength Base),Day 2,Upper Body #1,Dumbbell Supinated Curl,Biceps,3,10,2 reps from failure,1-2 min,Drive your pinky into the handle harder than your pointer finger.,https://www.youtube.com/watch?v=i1YgFZB6alI
Weeks 1-4 (Modified Strength Base),Day 2,Upper Body #1,Single-Arm Dumbbell Overhead Extension,Triceps,3,12,2 reps from failure,1-2 min,"Sit upright on the bench, keep your upper arm locked near your ear, and lower the dumbbell behind your head for a full stretch.",https://www.youtube.com/watch?v=b_r_LW4HEcM
Weeks 1-4 (Modified Strength Base),Day 2,Upper Body #1,Lying Neck Curl,Neck (Front / Flexors),3,15-20,2 reps from failure,1-2 min,Lie on your back on the bench with head off the edge; gently hold a light plate/dumbbell with a folded towel on your forehead and tuck chin to chest smoothly.,https://www.youtube.com/watch?v=r_yLxDo9h_k
Weeks 1-4 (Modified Strength Base),Day 3,Lower Body #2,Deadlift,Posterior Chain,3,8,3 reps from failure,3-4 min,"Brace your lats, chest tall, hips high, pull the slack out of the bar prior to moving it off the ground.",https://www.youtube.com/watch?v=VL5Ab0T07e4
Weeks 1-4 (Modified Strength Base),Day 3,Lower Body #2,Dumbbell Walking Lunge,"Quads, Glutes",3,10/leg,2 reps from failure,2-3 min,"10 steps each leg. Take medium strides, let your torso lean forward.",https://www.youtube.com/watch?v=Pbmj6xPo-Hw
Weeks 1-4 (Modified Strength Base),Day 3,Lower Body #2,Single-Leg Leg Extension,Quads,3,15,2 reps from failure,1-2 min,Focus on squeezing your quads to make the weight move.,https://www.youtube.com/watch?v=ztNBgrGy6FQ
Weeks 1-4 (Modified Strength Base),Day 3,Lower Body #2,Single-Leg Lying Leg Curl (or Seated),Hamstrings,3,15,2 reps from failure,1-2 min,Focus on squeezing your hamstrings to make the weight move.,https://www.youtube.com/watch?v=i6m3Vp9H40Y
Weeks 1-4 (Modified Strength Base),Day 3,Lower Body #2,Side-Lying Dumbbell Hip Abduction,Upper Glutes,3,15/side,1 rep from failure,1-2 min,Keep hips stacked vertically; squeeze your upper glute at the top of each rep without swinging.,https://www.youtube.com/watch?v=-rDiQXjeXO0
Weeks 1-4 (Modified Strength Base),Day 3,Lower Body #2,Single-Leg Dumbbell Calf Raise (off a step),Calves,3,12-15/leg,2 reps from failure,1-2 min,"Stand on a step/plate holding one dumbbell; lower heel into a deep 2-sec stretch at the bottom, press all the way up onto toes without bouncing.",https://www.youtube.com/watch?v=1_B7pkicFk8
Weeks 1-4 (Modified Strength Base),Day 3,Lower Body #2,Plank,Core,3,20 sec,2 reps from failure,1-2 min,"Squeeze your glutes, keep your hips low.",https://www.youtube.com/watch?v=v25dawSzRTM
Weeks 1-4 (Modified Strength Base),Day 4,Upper Body #2,Dumbbell Incline Press (or Flat if bench is fixed),Upper Chest,3,8,2 reps from failure,2-3 min,Keep your scapulae retracted and depressed.,https://www.youtube.com/watch?v=-iWjdKWNpNg
Weeks 1-4 (Modified Strength Base),Day 4,Upper Body #2,Reverse Grip Lat Pulldown,"Lats, Biceps",3,8,2 reps from failure,2-3 min,"Pull your elbows down against your sides, use shoulder width underhand grip.",https://www.youtube.com/watch?v=O94yEoGXtBY
Weeks 1-4 (Modified Strength Base),Day 4,Upper Body #2,Close-Grip Push-Up,"Triceps, Lower/Mid Chest",3,10-15,3 reps from failure,2-3 min,"Hands just inside shoulder width, elbows tucked at ~30-45° against ribs; elevates feet on bench or add a weight plate on back if needed.",https://www.youtube.com/watch?v=2eUBTgqK5Ng
Weeks 1-4 (Modified Strength Base),Day 4,Upper Body #2,Barbell Bent Over Row,"Mid-Back, Lats, Traps",3,12,3 reps from failure,2-3 min,"Lean your torso over at a 45° angle, keep your lower back neutral, double overhand grip.",https://www.youtube.com/watch?v=axoeDmW0oAY
Weeks 1-4 (Modified Strength Base),Day 4,Upper Body #2,Dumbbell Lateral Raise,Side Delts,3,15,2 reps from failure,1-2 min,Tilt the dumbbell such that your pinky comes up first.,https://www.youtube.com/watch?v=f_OGBg2KxgY
Weeks 1-4 (Modified Strength Base),Day 4,Upper Body #2,Chest-Supported Dumbbell Rear Delt Flye,"Rear Delts, Upper/Mid Traps",3,15,2 reps from failure,1-2 min,Lie chest-down on an incline bench (or sit bent-over on a flat bench) and sweep dumbbells out and slightly back.,https://www.youtube.com/watch?v=sIQNCJ6Xwsk
Weeks 1-4 (Modified Strength Base),Day 4,Upper Body #2,Dumbbell Shrug,Upper Traps,3,12-15,2 reps from failure,1-2 min,Hold dumbbells slightly in front of thighs with a subtle forward torso lean; shrug up and slightly back toward your ears.,https://www.youtube.com/watch?v=r74q9EF_ni4
Weeks 1-4 (Modified Strength Base),Day 4,Upper Body #2,Hammer Curl,"Biceps, Brachialis",3,8,1 rep from failure,1-2 min,"Neutral grip, prevent your upper arm from moving.",https://www.youtube.com/watch?v=j5f_0rNkPwU
Weeks 1-4 (Modified Strength Base),Day 4,Upper Body #2,Lying Neck Extension,Neck (Back / Extensors),3,15-20,2 reps from failure,1-2 min,Lie face-down on the bench with head off the edge; use controlled bodyweight or gently hold a light towel-wrapped plate on the back of your head.,https://www.youtube.com/watch?v=3-yAPkua_cA
`,
  w58: `﻿Block,Day,Workout,Exercise,Target Muscle,Sets,Reps,Reps to Failure,Rest,Form Notes,Video Tutorial
Weeks 5-8 (Modified Strength Base),Day 1,Lower Body #1,Deadlift,Posterior Chain,3,5,2 reps from failure,3-4 min,"Brace your lats, chest tall, hips high, pull the slack out of the bar prior to moving it off the ground.",https://www.youtube.com/watch?v=VL5Ab0T07e4
Weeks 5-8 (Modified Strength Base),Day 1,Lower Body #1,Goblet Squat,"Quads, Glutes",3,12,2 reps from failure,2-3 min,"Hold a dumbbell directly underneath your chin, sit back and down, push your knees out laterally.",https://www.youtube.com/watch?v=lRYBbchqxtI
Weeks 5-8 (Modified Strength Base),Day 1,Lower Body #1,Dumbbell Single-Leg Hip Thrust,Glutes,3,10,1 rep from failure,2-3 min,"Place the dumbbell on your working thigh, tuck your chin and rib cage, only move your hips.",https://www.youtube.com/watch?v=L4nTaesNm0E
Weeks 5-8 (Modified Strength Base),Day 1,Lower Body #1,Dumbbell Bulgarian Split Squat,"Quads, Glutes",3,12/leg,2 reps from failure,1-2 min,"Rear foot elevated on your bench, hold dumbbells at your sides, drop straight down into a deep knee bend.",https://www.youtube.com/watch?v=uODWo4YqbT8
Weeks 5-8 (Modified Strength Base),Day 1,Lower Body #1,Lying Leg Curl (or Seated),Hamstrings,3,15,1 rep from failure,1-2 min,Focus on squeezing your hamstrings to make the weight move.,https://www.youtube.com/watch?v=Lh3iMIcbkBQ
Weeks 5-8 (Modified Strength Base),Day 1,Lower Body #1,Single-Leg Dumbbell Calf Raise (off a step),Calves,3,12-15/leg,2 reps from failure,1-2 min,"Stand on a step/plate holding one dumbbell; pause in a full stretch at the bottom, press all the way up onto toes without bouncing.",https://www.youtube.com/watch?v=1_B7pkicFk8
Weeks 5-8 (Modified Strength Base),Day 1,Lower Body #1,Bicycle Crunch,"Abs, Obliques",3,12,2 reps from failure,1-2 min,"Focus on flexing and rotating your spine, bring your left elbow to right knee, right elbow to left knee.",https://www.youtube.com/watch?v=wpRI3xBhJmo
Weeks 5-8 (Modified Strength Base),Day 2,Upper Body #1,Barbell Bench Press,"Chest, Triceps",3,8,2 reps from failure,3-4 min,"Tuck elbows at a 45° angle, squeeze your shoulder blades and stay firm on the bench.",https://www.youtube.com/watch?v=vcBig73ojpE
Weeks 5-8 (Modified Strength Base),Day 2,Upper Body #1,Dumbbell Pullover (or Single-Arm Pulldown),Lats,3,8,2 reps from failure,2-3 min,"Lie across/along the bench, lower a dumbbell behind your head for a deep lat stretch, then pull with straight elbows.",https://www.youtube.com/watch?v=6yYVcIOAERY
Weeks 5-8 (Modified Strength Base),Day 2,Upper Body #1,Dumbbell Seated Shoulder Press,Front Delts,3,12,3 reps from failure,2-3 min,"Bring the dumbbell all the way down to your shoulders, keep your torso upright.",https://www.youtube.com/watch?v=E9ShwbwZ1zw
Weeks 5-8 (Modified Strength Base),Day 2,Upper Body #1,Dumbbell Row,"Mid-Back, Lats, Traps",3,12,2 reps from failure,2-3 min,"Brace onto a bench for support, pull your elbow against your sides.",https://www.youtube.com/watch?v=djKXLt7kv7Q
Weeks 5-8 (Modified Strength Base),Day 2,Upper Body #1,Single-Arm Dumbbell Overhead Tricep Extension,Triceps (Long Head),3,10-12/arm,2 reps from failure,1-2 min,"Sit upright on the bench, keep upper arm locked beside your head, lower dumbbell deep behind your neck for a full stretch.",https://www.youtube.com/watch?v=b_r_LW4HEcM
Weeks 5-8 (Modified Strength Base),Day 2,Upper Body #1,Barbell Shrug,Upper Traps,3,10-Dec,2 reps from failure,1-2 min,"Slight forward lean, shrug straight up toward your ears with a 1-sec squeeze at the top; avoid rolling shoulders.",https://www.youtube.com/watch?v=C6sYjDFuq9I
Weeks 5-8 (Modified Strength Base),Day 2,Upper Body #1,Chest-Supported Dumbbell Rear Delt Flye,"Rear Delts, Mid/Lower Traps",3,15,1 rep from failure,1-2 min,Pull your arms back and out with palms facing down/back to target rear delts and mid-traps.,https://www.youtube.com/watch?v=sIQNCJ6Xwsk
Weeks 5-8 (Modified Strength Base),Day 2,Upper Body #1,Barbell Curl,Biceps,3,12,1 rep from failure,1-2 min,Shoulder-width underhand grip; press your pinky into the bar harder than your pointer finger.,https://www.youtube.com/watch?v=QZEqB6wUPxQ
Weeks 5-8 (Modified Strength Base),Day 2,Upper Body #1,Lying Neck Curl,Neck (Front / Flexors),3,15-20,2 reps from failure,1-2 min,Lie supine on the bench with head off the edge; hold a light plate/dumbbell wrapped in a towel on forehead and curl chin to chest smoothly.,https://www.youtube.com/watch?v=r_yLxDo9h_k
Weeks 5-8 (Modified Strength Base),Day 3,Lower Body #2,Back Squat,"Quads, Glutes",3,8,2 reps from failure,3-4 min,"Sit back and down, 15° toe flare, drive your knees out laterally.",https://www.youtube.com/watch?v=bEv6CCg2BC8
Weeks 5-8 (Modified Strength Base),Day 3,Lower Body #2,Barbell Hip Thrust,Glutes,3,8,2 reps from failure,2-3 min,"Tuck your chin and rib cage down, only move your hips. Use a pad.",https://www.youtube.com/watch?v=xDmFkJxPzeM
Weeks 5-8 (Modified Strength Base),Day 3,Lower Body #2,Romanian Deadlift,"Hamstrings, Glutes",3,12,2 reps from failure,2-3 min,"Maintain a neutral lower back, set your hips back, don't allow your spine to round.",https://www.youtube.com/watch?v=_oyxCn2iSjU
Weeks 5-8 (Modified Strength Base),Day 3,Lower Body #2,Seated Leg Curl (or Lying),Hamstrings,3,8,1 rep from failure,1-2 min,Focus on squeezing your hamstrings to make the weight move.,https://www.youtube.com/watch?v=xdbEG3xGLI8
Weeks 5-8 (Modified Strength Base),Day 3,Lower Body #2,Single-Leg Dumbbell Calf Raise (off a step),Calves,3,15-20/leg,1 rep from failure,1-2 min,"Stand on a step/plate holding one dumbbell; lower heel into a deep stretch at the bottom, press all the way up onto toes without bouncing.",https://www.youtube.com/watch?v=1_B7pkicFk8
Weeks 5-8 (Modified Strength Base),Day 3,Lower Body #2,Bench Reverse Crunch / Leg Raise,Lower Abs,3,10,2 reps from failure,1-2 min,"Lie flat on the bench, grip the bench behind your head, and curl your hips/pelvis upward off the pad.",https://www.youtube.com/watch?v=HoeOTXgNiXk
Weeks 5-8 (Modified Strength Base),Day 3,Lower Body #2,Side-Lying Dumbbell Hip Abduction,Upper Glutes,3,20/side,1 rep from failure,1-2 min,Keep your hips stacked and focus on squeezing your upper glute to lift the weight.,https://www.youtube.com/watch?v=-rDiQXjeXO0
Weeks 5-8 (Modified Strength Base),Day 4,Upper Body #2,Military Press,Front Delts,3,6,2 reps from failure,3-4 min,"Squeeze your glutes to keep your torso upright, clear your head out of the way, press up and slightly back.",https://www.youtube.com/watch?v=_RlRDWO2jfg
Weeks 5-8 (Modified Strength Base),Day 4,Upper Body #2,Close-Grip Underhand Lat Pulldown,Lats,3,6,2 reps from failure,3-4 min,Palms facing you at shoulder width; pull your elbows tight against your sides to mimic a neutral-grip pull.,https://www.youtube.com/watch?v=5YC67yVpBGE
Weeks 5-8 (Modified Strength Base),Day 4,Upper Body #2,Dumbbell Incline Press (or Flat if bench is fixed),Upper Chest,3,8,2 reps from failure,2-3 min,Keep your scapulae retracted and depressed.",https://www.youtube.com/watch?v=-iWjdKWNpNg
Weeks 5-8 (Modified Strength Base),Day 4,Upper Body #2,Chest-Supported Dumbbell Row (Neutral Grip),"Mid-Back, Lats, Traps",3,8,1 rep from failure,2-3 min,Palms facing each other (neutral grip); let your shoulder blades protract at the bottom of each rep.,https://www.youtube.com/watch?v=ro2vfHfD0DQ
Weeks 5-8 (Modified Strength Base),Day 4,Upper Body #2,Leaning Single-Arm Dumbbell Lateral Raise,Side Delts,3,12/arm,2 reps from failure,1-2 min,"Hold the lat pulldown frame with your free hand, lean your body away at ~20°, and raise the dumbbell out to your side.",https://www.youtube.com/watch?v=qWif_7SOYpQ
Weeks 5-8 (Modified Strength Base),Day 4,Upper Body #2,Chest-Supported Dumbbell Reverse Flye,"Rear Delts, Mid/Lower Traps",3,12,2 reps from failure,1-2 min,"Protract your scapulae, sweep the dumbbells out and back without swinging.",https://www.youtube.com/watch?v=sIQNCJ6Xwsk
Weeks 5-8 (Modified Strength Base),Day 4,Upper Body #2,Dumbbell Shrug,Upper Traps,3,Dec-15,2 reps from failure,1-2 min,Hold dumbbells slightly in front of thighs with a subtle forward torso lean; shrug up and slightly back toward your ears.,https://www.youtube.com/watch?v=r74q9EF_ni4
Weeks 5-8 (Modified Strength Base),Day 4,Upper Body #2,Incline Dumbbell Curl,Biceps (Long Head),3,15,1 rep from failure,1-2 min,Set bench to ~45-60° incline so your arms hang behind your torso for a deep stretch.,https://www.youtube.com/watch?v=DCe8f6vMe9A
Weeks 5-8 (Modified Strength Base),Day 4,Upper Body #2,Lying Neck Extension,Neck (Back / Extensors),3,15-20,2 reps from failure,1-2 min,Lie face-down on the bench with head off the edge; use controlled bodyweight or gently hold a light towel-wrapped plate on the back of your head.,https://www.youtube.com/watch?v=3-yAPkua_cA
`,
  core: `﻿Block,Day,Workout,Exercise,Target Muscle,Sets,Reps,Reps to Failure,Rest,Form Notes,Video Tutorial
360-Degree Core Routine (Weeks 1-8),2-3x / Week,Complete Core Workout,Bench Reverse Crunch / Leg Raise,Lower Abs (Spinal Flexion),3,10-15,2 reps from failure,60-90 sec,"Lie flat on the bench, grip behind your head, and curl your pelvis/hips upward off the pad; lower slowly with control instead of swinging your legs.",https://www.youtube.com/watch?v=HoeOTXgNiXk
360-Degree Core Routine (Weeks 1-8),2-3x / Week,Complete Core Workout,Barbell Ab Rollout,Deep Core / Transverse Abdominis & Abs (Anti-Extension),3,8-12,2 reps from failure,90 sec,Kneel on a pad holding a barbell loaded with round plates; brace your abs and squeeze glutes to tuck your pelvis under so your lower back never sags as you roll forward.,https://www.youtube.com/watch?v=3C1TRMJveXo
360-Degree Core Routine (Weeks 1-8),2-3x / Week,Complete Core Workout,Dumbbell Suitcase Carry,Obliques & Quadratus Lumborum (Anti-Lateral Flexion),3,30-40 sec/side,2 reps from failure,60 sec,"Hold one heavy dumbbell at your side like a suitcase, keep your ribcage stacked over your pelvis, and walk slowly without leaning toward or away from the weight.",https://www.youtube.com/watch?v=v8O0kNuvp_k
360-Degree Core Routine (Weeks 1-8),2-3x / Week,Complete Core Workout,Weighted Crunch (Dumbbell or Plate),Upper Abs (Loaded Spinal Flexion),3,12-15,1 rep from failure,60-90 sec,"Hold a dumbbell or plate against your upper chest/chin, exhale hard, and curl your ribcage toward your pelvis without pulling on your neck; progress weight over time.",https://www.youtube.com/watch?v=1YSxi0qv3wg
360-Degree Core Routine (Weeks 1-8),2-3x / Week,Complete Core Workout,Dumbbell Plank Pull-Through,Obliques & Transverse Abdominis (Anti-Rotation),3,10-12/side,2 reps from failure,60 sec,Set up in a high plank with feet slightly wider than hip-width; reach across underneath your torso to drag a dumbbell from one side to the other without letting your hips twist.,https://www.youtube.com/watch?v=iXtAv61NEIo
360-Degree Core Routine (Weeks 1-8),2-3x / Week,Complete Core Workout,Tempo Bird Dog (2-Sec Pause),"Erector Spinae, Multifidus & Glutes (Posterior Core)",3,8-10/side,2 reps from failure,60 sec,"On hands and knees with a neutral spine, extend opposite arm and leg straight out, pause for 2 full seconds while bracing your abs, and avoid arching your lower back.",https://www.youtube.com/watch?v=QABW99qPiNM
`,
  logins: `# Approved logins. One per line, written as  username:password
# Lines starting with # are ignored. Usernames are not case sensitive, passwords are.
demo:demo123
friend:letmein
`,
};
