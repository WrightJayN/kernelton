# Kernelton demo video prompt

How to use this file:

1. Record the voiceover from the script in Section 1 and save it as an MP3.
2. Take your original explainer prompt and replace its TASK block and Sections 1, 4, 5 and 6 with the blocks below.
3. Keep Sections 2, 3 and 7 to 17 of the original prompt exactly as they are.
4. Attach the MP3, the nine character files from `assets/`, and three or four screenshots of the game.

The original prompt was written for a dark terminal look. Kernelton has its own look (a cream town and a dark Lens view), so Sections 4, 5 and 6 are rewritten to match the game.

---

# TASK

Create a professionally designed animated product demo of a browser game, in a game UI showcase style, where game screens build themselves, residents and objects move, puzzles are solved on screen, and the view flips between an illustrated town and a dark technical diagram, following the project configuration below.

Use JavaScript to generate a visually rich, information-dense animation with crisp game panels, illustrated town scenes, a simulated terminal, charts that build as the puzzle is solved, and meaningful transitions. It must be clear to Operating Systems students and inviting to someone who has never opened the game.

Create the experience directly inside a playable HTML Artifact in this Claude conversation.

The result should feel like a short, professionally produced motion graphics sequence rather than a slideshow, a basic cartoon, or a collection of independent animations.

Use the stages selected by the project configuration:

**Stage 1 — Storyboard:** Develop the visual story, scene timing, motion choreography, and actual rendered storyboard frames. Present these for approval.

**Stage 2 — Animation:** After approval when a storyboard is requested, or immediately otherwise, build the animation with the configured audio, playback controls, and video export.

When storyboard is enabled, stop before Stage 2 for explicit approval. Otherwise, proceed directly to Stage 2.

Prioritize visual quality, useful information, and purposeful movement. Keep implementation focused and avoid unnecessary testing or development overhead.

---

# 1. PROJECT CONFIGURATION — EDIT SETTINGS ONLY HERE

**Topic:** KERNELTON DEMO: learn Operating Systems by running a town (about 3 minutes)

A demo video made by a student for fellow Operating Systems (CIT3002) students. It shows what Kernelton is, how one level plays from start to finish, and how the game helps with the theory tests and the lab test. The viewer should finish knowing what the game is, why the town idea makes the concepts easier, and how to start playing.

Kernelton is a browser game. The player is the apprentice Town Manager of a small town, and every town service is an Operating Systems concept in disguise. The Town Manager is the operating system. Residents are processes. The workshop is the CPU. The line outside the workshop is the ready queue. Desks are main memory and the warehouse is the disk. A blocked four way junction is deadlock. A button called the Lens swaps every town word for the real term.

Show the game itself, not a description of it. Recreate its screens faithfully from the attached screenshots and character files. Do not invent features, levels, characters or numbers that are not in this configuration.

Facts that may appear on screen, and no others:

- 10 worlds and 51 levels, one world per lecture week, following the CIT3002 syllabus.
- 13 practical levels with a simulated Linux terminal. Worlds 1 to 5 follow Practical sheets 1 to 5.
- 4 mock tests that mirror Theory Tests 1, 2 and 3 and the Lab Test.
- 228 checkpoint questions, each with a one line explanation.
- Runs by opening `index.html` in any modern browser. Nothing to install. Progress is saved in the browser on that device.
- Lens button, or the `L` key, shows the real term for every town word.
- "I know this" skips a puzzle and goes straight to its checkpoint.
- "Test out" clears a whole district with 4 of 5 correct.
- The placement test starts the player at the first district they did not pass.
- Settings has Expert mode, Revision mode, story, music and sound switches.

Characters, each standing for one concept: Mayor Root (root user), Tick (CPU scheduler), Paige (memory manager), Archie (file system), Lockhart (mutex and semaphores), Belle (interrupts and input and output), Sentry (protection and security), Shelly the hermit crab (the shell), and Gridlock (deadlock), the antagonist.

Scenes:

1. **Hook.** A lecture slide full of terms (ready queue, context switch, page fault) blurs out. The Kernelton title screen builds in with the six characters lined up.
2. **The idea.** The town map draws itself. Labels appear on town objects one at a time: Town Manager, resident, workshop, the line, desks, warehouse. The Lens button is pressed and each label flips to its real term: operating system, process, CPU, ready queue, main memory, disk.
3. **One level, start to finish.** Level 3.1, First in line. Tick gives the briefing. Four residents wait outside the workshop: Ana (arrives 0, job length 8), Ben (arrives 1, job length 2), Cy (arrives 2, job length 3), Dee (arrives 3, job length 1). They are sent in one by one in arrival order and a Gantt chart builds: Ana 0 to 8, Ben 8 to 10, Cy 10 to 13, Dee 13 to 14. The waiting times appear: Ana 0, Ben 7, Cy 8, Dee 10, average 6.25. The reveal card shows First Come, First Served and the convoy effect. A three question checkpoint is answered and three stars pop.
4. **More ways to play.** Quick cuts of three other puzzles, each held long enough to read: page replacement with boxes on three desks and a warehouse, where a box is sent back and the trip counter goes up; the delivery cart moving along numbered warehouse shelves; and the four cars stuck at the junction with Gridlock looming.
5. **The real terminal.** Shelly's terminal types real commands and prints their output: `ps -ef`, `sleep 1000 &`, `jobs`, `ls -l | wc -l`. Then a "predict the output" task: `echo a{1,2}b`, with the answer `a1b a2b` typed in.
6. **Fast track.** Three cards slide in: the placement test, Test out (4 of 5), and I know this. The settings panel opens with Expert mode and Revision mode switched on.
7. **Mock tests.** The town map shows four mock test cards: Town Inspection 1, Town Inspection 2, Shelly's Exam, Final Inspection. Each is tagged with what it mirrors. One opens, a score appears, and a short list of levels to revise slides out.
8. **Close.** The four numbers count up: 10 worlds, 51 levels, 13 practical levels, 228 questions. The line "Open index.html. Nothing to install." appears, followed by an end card with the game title and a space for a link.

- Storyboard: Enabled
- Voiceover: Enabled — attached MP3
- Voiceover transcript (optional): "# Kernelton demo script. About 3 minutes at a steady pace. Recorded by a student for fellow Operating Systems students.

## Scene 1: Hook (0:00–0:15)
**Narration:** Operating Systems is full of things you can't see. Ready queues, context switches, page faults. So I built a game where you can see them. This is Kernelton.

## Scene 2: The idea (0:15–0:40)
**Narration:** In Kernelton you run a small town, and every part of the town is an Operating Systems concept in disguise. You are the Town Manager, which is the operating system. The residents are processes. The workshop is the CPU, and the line outside it is the ready queue. Any time you want the real term, press Lens, and every town word flips to the one you'll see on the test.

## Scene 3: One level, start to finish (0:40–1:25)
**Narration:** Here's one level. Tick runs the line outside the workshop, and today the rule is simple: whoever arrived first goes first. Ana is first, and her job takes eight units. So Ben, Cy and Dee all wait behind her, even though their jobs are short. When the line is done, the game shows you the waiting times, and then it tells you what you just did. That was First Come, First Served, and the wait behind Ana is the convoy effect. A three question checkpoint follows, and you earn up to three stars.

## Scene 4: More ways to play (1:25–1:55)
**Narration:** Every topic gets its own kind of puzzle. For virtual memory, you choose which box goes back to the warehouse when the desks are full. For disk scheduling, you plan the route of a delivery cart. And for deadlock, you meet Gridlock, who gets stronger every time you make a mistake.

## Scene 5: The real terminal (1:55–2:20)
**Narration:** It isn't only theory. Thirteen levels put you in a simulated Linux terminal, where you type the real commands. The first five worlds follow our practical sheets, one to five. Some tasks ask you to predict the output before you run it, which is exactly the kind of question the lab test asks.

## Scene 6: Fast track (2:20–2:40)
**Narration:** If you already know a topic, you don't have to sit through it. Take the placement test and start where you need to. Test out of a whole district with four out of five. Or tap 'I know this' and go straight to the checkpoint.

## Scene 7: Mock tests (2:40–2:55)
**Narration:** There are four mock tests, matching Theory Tests one, two and three, and the Lab Test. When you finish one, it lists the exact levels to go back and revise.

## Scene 8: Close (2:55–3:10)
**Narration:** Ten worlds. Fifty-one levels. Two hundred and twenty-eight questions. There's nothing to install. Open it in your browser and start running the town."
- Subtitles: Generate SRT, with optional on-screen display
- Duration without voiceover: Not used — the runtime follows the attached voiceover's actual decoded length
- Format: Horizontal, 16:9
- Native resolution: 1920 × 1080
- Target export frame rate: 30 fps
- Preview: Smooth, ideally 60 fps where supported
- Style: Game UI showcase motion graphics, in Kernelton's own flat vector look
- Sound effects: Enabled
- Background music: Enabled
- Final video format: MP4

**This is the only editable project-input section.** Everything below this configuration is reusable. Use these values as the single source of truth; do not treat illustrative examples or instructions as additional project settings, a fixed script, or a predetermined scene list.

Treat the topic as a free-text creative brief. It may be a single sentence, a question, a comparison, or a longer paragraph.

Interpret the subject independently and determine what the viewer should learn, which information matters most, and how to communicate it through animated graphics in this style.

Do not ask for a detailed script, scene breakdown, or additional visual instructions unless something essential is missing.

This prompt must remain adaptable to unrelated subjects. Every subject-specific illustration, label, diagram, and factual statement must come from the configured topic and any supplied narration, never from examples written in this prompt.

---

# 4. VISUAL DIRECTION — KERNELTON GAME UI

Recreate the game's own look. It has two views, and the contrast between them is the visual idea of the whole video.

**Town view.** Flat vector art with chunky navy outlines, built from circles and rounded rectangles, on a warm cream background. Characters are simple figures with one identifying prop each. Panels are white with a thick navy border and rounded corners.

**Lens view.** The same scene redrawn as a dark terminal style diagram with monospace labels, where town words are replaced by the real terms in amber.

Where this section and Section 7 disagree about components, this section wins. Read Section 7's list of window components as game panels, town scenes, a terminal and a Lens diagram.

## Palette

- Cream background: #FBF3E4
- Sand ground: #F1E4C8
- Ink navy, outlines and text: #22304A
- Teal, working or running: #2BA6A0
- Amber, waiting or ready: #F2B134
- Coral, blocked, errors and Gridlock: #E8604C
- Leaf green, success: #6BBF59
- Violet, Mayor Root: #7A5CC2
- Terminal black, Lens view background: #10151F
- White, panels: #FFFFFF

## Screens and UI

- A dark navy top bar with Map, the level name, a star count, Lens and Settings.
- Dialogue: a character portrait beside a white speech panel.
- Town scenes: a workshop with a coral roof and residents in a line, a row of desks with numbered boxes, a warehouse with a violet roof, a delivery cart on a numbered aisle, a four way junction with four cars.
- Charts that build as the player acts: a Gantt chart of teal and amber blocks, a row of request numbers marked F for a fault and H for a hit.
- A terminal panel: black background, green typed commands, a teal prompt reading `student@kernelton:~$`.
- Reward: three large amber stars.
- Use the attached character files and screenshots as the reference. If they are not accessible, provide an upload control and name the missing files, and do not redraw the characters from imagination.

## Typography

A rounded sans serif for town words and interface text. A monospace font for real terms, the terminal and the Lens view. This split is part of the game's design: the viewer should always be able to tell which language they are reading. Text must be large enough to read on a phone.

---

# 5. MOTION DIRECTION — A TOWN THAT RUNS

Motion should make the town feel alive and make each concept visible as a physical event.

## Signature motion

- Residents walk into the workshop one at a time, and a Gantt block grows as each one works.
- The Lens flip: a quick wipe across the frame that turns cream to black and swaps each town label for its real term. Use it as the signature transition and return to it several times.
- Boxes slide between desks and the warehouse, and a counter ticks up.
- The delivery cart rolls along the aisle and each visited shelf turns green.
- Terminal commands type themselves with natural rhythm, then output streams in.
- Stars pop one by one. Numbers count up.
- Gridlock swells slightly whenever a mistake is shown.

## Pace

Speed up typing and walking so the story keeps moving. Hold on each reveal, each real term and each number long enough to read it.

## Transitions

Transitions should come from the game: the town map zooms into a district, a level card opens into its puzzle, the Lens wipes between views, a reward screen folds back into the map.

## Pacing

For this runtime, aim for approximately 25 to 35 meaningful visual beats across the complete animation.

A visual beat is a noticeable development that advances the explanation: new information is revealed, an object changes state, a diagram expands or transforms, a comparison develops, or the story changes direction.

Use these as creative targets, not rigid timing constraints. Keep attention moving naturally from one piece of information to the next, avoid long pauses where nothing meaningful changes, and allow brief holds when viewers need time to read or understand something important.

---

# 6. INFORMATION DESIGN AND STORYTELLING

## Story structure

1. The problem: Operating Systems concepts are hard to picture.
2. The idea: a town where every service is one of those concepts.
3. The proof: one level played from briefing to stars.
4. The range: other puzzles, the terminal, the fast track and the mock tests.
5. The invitation: what is in the game and how to start.

## Information hierarchy

1. A short headline naming what the viewer is looking at.
2. The game screen showing it happen.
3. A label or callout pointing at the exact resident, box, command or number that matters.

## Readability

Show one idea per moment. Use highlights, dimming and zooms to focus attention. Whenever a real Operating Systems term first appears, show it beside the town word it replaces.
