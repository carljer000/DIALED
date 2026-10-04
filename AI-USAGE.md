# AI Usage — DIALED

This project was built with AI assistance. This file is the record of it. The assistant was OpenAI Codex, used through the Codex desktop app with my project files and course requirements available while I worked. I approached the app one focused change at a time: I chose the next feature or adjustment, checked the result in the running app on desktop and mobile, and used screenshots to explain visual problems when a revision missed the mark. The finished journal reflects the check-in flow, tracking priorities, and visual direction I chose.

## 1. How I used AI

### 2026-09-26 — Initial DIALED app and reflection features

* Tool: OpenAI Codex
* What I asked for: I wanted DIALED to be a daily cutting journal, not only a calorie tracker, with check-ins for hunger, cravings, sleep quality, training, and reflection alongside the nutrition numbers.
* What it gave back: Implementation support for the Today, Dashboard, and History screens, along with daily signals, training status, challenges, daily wins, and guided reflections.
* What I kept, what I changed, and why: I kept the overall daily-journal structure and reflection fields. I directed changes to the layout and wording so the app matched how I wanted to use it.
* Commit: [Initial DIALED app and documentation](https://github.com/carljer000/DIALED/commit/e94e7fe)

### 2026-09-26 — PostgreSQL and Supabase data setup

* Tool: OpenAI Codex
* What I asked for: I wanted my daily check-ins to save through the Express app into PostgreSQL, with a Supabase setup that could be recreated from migrations instead of being changed by hand.
* What it gave back: A PostgreSQL connection pool, check-in API routes and controller, Supabase migrations, a seed script, and a migration script for moving older local data into Supabase.
* What I kept, what I changed, and why: I kept one database record per daily check-in date and versioned migrations so the schema can be recreated instead of being changed manually. I also kept database credentials out of the repository by using environment variables.
* Commit: [Initial DIALED app and documentation](https://github.com/carljer000/DIALED/commit/e94e7fe)

### 2026-09-27 — Settings defaults and persistence

* Tool: OpenAI Codex
* What I asked for: I wanted a Settings screen where I could save my usual calorie, protein, step, weight-unit, and training defaults so I would not have to enter the same targets every day.
* What it gave back: A Settings route, preference state in React context, local-storage persistence, and logic for applying defaults to new check-ins.
* What I kept, what I changed, and why: I kept browser-local preferences because defaults should be quick to use and should not overwrite existing logs. I also kept each daily check-in editable after defaults are loaded.
* Commit: [Added settings screen for preferred personal check in defaults](https://github.com/carljer000/DIALED/commit/df4d2c7)

### 2026-09-27 — Dashboard progress insights

* Tool: OpenAI Codex
* What I asked for: I wanted the Dashboard to show useful patterns from my saved check-ins instead of only displaying a list of old entries.
* What it gave back: Recent-pattern cards, calorie/protein/step consistency calculations, averages for energy, hunger, and sleep, and weekly feedback.
* What I kept, what I changed, and why: I kept the insights behind a minimum-log threshold so the dashboard does not imply a pattern from one or two entries. I chose measures that suit a cut: adherence, recovery, and recurring challenges.
* Commit: [Added dashboard progress insights](https://github.com/carljer000/DIALED/commit/7394add)

### 2026-09-27 — Goal tracking and weekly reflection

* Tool: OpenAI Codex
* What I asked for: I wanted to add optional body-weight goal tracking and a weekly reflection that connects my daily check-ins to progress over time.
* What it gave back: Goal calculations, a weekly reflection component, a revised weight chart, and related settings fields.
* What I kept, what I changed, and why: I kept goal tracking optional because not every user has a starting or target weight ready. I kept the reflection focused on the latest seven logs so the time window is clear and does not imply an undefined long-term trend.
* Commit: [Add goal tracking and weekly dashboard insights](https://github.com/carljer000/DIALED/commit/b4dc54f)

### 2026-10-04 — Monthly dashboard summary

* Tool: OpenAI Codex
* What I asked for: I wanted a monthly-progress view that shows logged days and adherence at a glance without making the Dashboard feel like a spreadsheet.
* What it gave back: A monthly summary component, summary calculations, Dashboard placement, and responsive metric tiles.
* What I kept, what I changed, and why: I kept four compact measures—logged days, calorie target, protein target, and step goal—because they answer the main consistency questions at a glance. I later adjusted their card shape and styling to match the rest of DIALED.
* Commit: [Add monthly dashboard summary](https://github.com/carljer000/DIALED/commit/a77fc5d)

## 2. Where the AI got it wrong

### Case 1 — The mobile dock disappeared on taller iPhones

* What it gave me: A bottom-navigation layout that could fall below the visible content area on certain phone sizes.
* What was wrong with it: Main navigation is essential. Losing it on a tall iPhone viewport made the app difficult to move through.
* What I did instead: I tested the affected viewport, reported that the first result was still missing, and required bottom spacing that accounts for the dock and phone safe area.
* Commit: [Fix and Polish of typography, controls, colors and mobile layout](https://github.com/carljer000/DIALED/commit/81ae9a4)

### Case 2 — Calorie, protein, and step rows were not consistently centered or sized

* What it gave me: Several versions of the Numbers section placed the Calorie Target and Steps rows differently from the correctly aligned Protein Target row. The number values and smaller `KG`, `KCAL`, and step-unit labels also became too small, especially on phone screens.
* What was wrong with it: Comparable rows should share the same vertical center, scale, and label placement. Uneven baselines and undersized data made quick daily logging harder to scan and made the section look unfinished.
* What I did instead: I used the Protein Target row as the visual reference, sent screenshots of the Calorie Target and Steps misalignment, and required vertically centered rows, larger readable values and units, and matching dotted-red treatment for the key numbers.
* Commit: [Fix and Polish of typography, controls, colors and mobile layout](https://github.com/carljer000/DIALED/commit/81ae9a4)

### Case 3 — Calendar-icon placement required repeated debugging across screens

* What it gave me: Several spacing revisions for the calendar icon, including a shared forced offset intended to move the icon closer to the date.
* What was wrong with it: Each revision fixed one view while breaking another: the Today desktop field became cramped, while the History icon moved away from its correct far-right position. The controls have different layouts, so one global offset did not work.
* What I did instead: I repeatedly compared the desktop, mobile, Today, and History controls, then removed the shared forced offset and kept the natural layout appropriate to each control.
* Commit: [Implement UI animations and refinements](https://github.com/carljer000/DIALED/commit/1459697)

## 3. Who wrote what

### Written by me

#### DIALED design system — Base, Today, and Dashboard CSS

* Files: [`client/src/styles/base.css`](client/src/styles/base.css), [`client/src/styles/checkin.css`](client/src/styles/checkin.css), and [`client/src/styles/dashboard.css`](client/src/styles/dashboard.css)
* Commit: [Organized styles into CSS files](https://github.com/carljer000/DIALED/commit/fb04402)
* What it does and why it is built this way: I wrote the base stylesheet and worked directly on the Today and Dashboard styles. I separated shared rules from page-specific layout so typography, spacing, inputs, cards, and responsive behavior can remain consistent while Today focuses on logging and Dashboard focuses on reviewing progress.

#### History filters

* Files: [`client/src/pages/HistoryPage.jsx`](client/src/pages/HistoryPage.jsx), [`client/src/styles/dashboard.css`](client/src/styles/dashboard.css), and [`client/src/styles/theme.css`](client/src/styles/theme.css)
* Commit: [Complete History filters and styling](https://github.com/carljer000/DIALED/commit/532808e)
* What it does and why it is built this way: I implemented date-range, Headspace, and result filters so users can find relevant past check-ins immediately. Filtering happens on the loaded journal entries, which keeps changes immediate without adding another page or request. I also made the controls usable on narrow phone screens.

#### Monthly dashboard summary

* Files: [`client/src/components/organisms/MonthlySummary.jsx`](client/src/components/organisms/MonthlySummary.jsx), [`client/src/pages/DashboardPage.jsx`](client/src/pages/DashboardPage.jsx), and [`client/src/utils/checkins.js`](client/src/utils/checkins.js)
* Commit: [Add monthly dashboard summary](https://github.com/carljer000/DIALED/commit/a77fc5d)
* What it does and why it is built this way: I built the monthly summary around logged days and calorie, protein, and step adherence. Each metric checks whether its target exists so optional targets are not incorrectly shown as failures.

### Later features I specified and Codex built or edited

* **Personal reflection system:** I specified Headspace, energy, hunger, sleep, training, challenges, wins, and guided reflection so DIALED records the context behind a day, not only nutrition numbers. Codex built and expanded the related components; I chose the questions and removed options that did not fit the journal’s tone. [Commit](https://github.com/carljer000/DIALED/commit/fac8fd3)
* **DIALED visual direction:** I specified the black, white, and deeper-red system, IBM Mono labels, dotted-number treatment, rounded controls, and floating mobile dock. Codex implemented much of the styling; I reviewed screenshots and directed the spacing, hierarchy, color, and responsive corrections. [Typography and mobile-layout commit](https://github.com/carljer000/DIALED/commit/81ae9a4), [red-accent refinement](https://github.com/carljer000/DIALED/commit/80389a6)
* **Goal tracking and weekly reflection:** I specified optional weight-goal tracking and a weekly reflection based on the most recent seven logs. Codex built the calculations and components; I chose the metrics and kept the scope focused on recent behavior rather than unsupported long-term predictions. [Commit](https://github.com/carljer000/DIALED/commit/b4dc54f)

### The AI-written part I understand best

* File: [`client/src/context/DialedContext.jsx`](client/src/context/DialedContext.jsx)
* Commit: [Added settings screen for preferred personal check in defaults](https://github.com/carljer000/DIALED/commit/df4d2c7)
* What it does and why we kept it: Codex wrote the shared React context that keeps check-ins, preferences, loading state, and request errors in one place. When the app starts, `refresh` loads saved check-ins. `saveCheckin` updates an existing date or inserts a new record, then sorts the local list by date; `deleteCheckin` removes a saved item from that list. `savePreferences` merges new values with the defaults and stores them in `localStorage`, while a theme effect updates the document theme. Today, Dashboard, History, and Settings all use this provider, so they work with the same data instead of each keeping a separate copy. I kept this structure because it makes shared state predictable and lets every screen update when a check-in or preference changes.
