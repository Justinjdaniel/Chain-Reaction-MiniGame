# 🌌 Chain Reaction PWA Strategy Game

[![Build & Deploy](https://github.com/Justinjdaniel/Chain-Reaction-MiniGame/actions/workflows/deploy.yml/badge.svg)](https://github.com/Justinjdaniel/Chain-Reaction-MiniGame/actions/workflows/deploy.yml)
[![Deployed URL](https://img.shields.io/badge/Deployed-Live_App-00ff66?style=flat-squared&logo=google-chrome&logoColor=fff)](https://justinjdaniel.github.io/Chain-Reaction-MiniGame/)
[![Version](https://img.shields.io/badge/Version-v1.0.0-ff0055?style=flat-squared)](package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-00f0ff?style=flat-squared)](LICENSE)

An extremely responsive, high-performance, dark-themed **Chain Reaction Strategy Game** built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. Designed with a futuristic neon aesthetic, local-first performance, offline-capable Progressive Web App (PWA) features, and an advanced AI engine.

## 🔗 Live Access & Deployment
Play the live, fully-deployed game directly in your browser or install it on your device:
📌 **[https://justinjdaniel.github.io/Chain-Reaction-MiniGame/](https://justinjdaniel.github.io/Chain-Reaction-MiniGame/)**

---

## 🎮 How to Play (Rules of the Reactor)

The objective of Chain Reaction is to take complete control of the board by eliminating your opponents' orbs.

### ⚡ Placement Mechanics
- Players take turns placing an orb of their color in an **empty cell** or a cell **already containing orbs of their own color**.
- If you click an empty cell or one of your own cells, an orb is added to that cell, and its ownership is set to you.

### 💥 Critical Mass & Cascade Explosions
Each cell has a **Critical Mass** capacity determined by its location on the grid:
- **Corners:** Critical Mass = **2** (explodes at 2 orbs)
- **Edges (Border):** Critical Mass = **3** (explodes at 3 orbs)
- **Center (Inner):** Critical Mass = **4** (explodes at 4 orbs)

When a cell reaches or exceeds its Critical Mass, it **explodes** immediately:
1. The cell loses exactly its Critical Mass worth of orbs (keeping any remainder).
2. One orb is sent to each of its adjacent neighbor cells (up, down, left, right).
3. The newly populated adjacent cells take on the **exploding player's color**, even if they previously belonged to an opponent!
4. If any adjacent cells also reach their Critical Mass due to this influx, they will trigger a **cascading chain reaction** of explosions!

### 💀 Player Elimination
- A player is eliminated if they have **no orbs left on the board**.
- **Important:** Elimination checks are delayed until *after* each player has had their first turn (to allow everyone a chance to place their starting orb).

---

## 🚀 Key Features

- **Customizable Lobby (2-8 Players):** Supports any mix of Human and AI players in a single game lobby.
- **Smart AI Bots with 3 Difficulty Levels:**
  - 🟢 **Easy:** Plays randomly, with a slight heuristic bias.
  - 🟡 **Medium:** One-step greedy heuristic (immediate captures and defense).
  - 🔴 **Hard (Minimax with Alpha-Beta Pruning):** 3-plies deep searches evaluating board position, player counts, explosion potential, and corner dominance.
- **Progressive Web App (PWA):** Installable directly onto iOS, Android, macOS, or Windows. Fully offline-capable via background Service Worker asset caching.
- **Local Stats & Achievements Tracker:** Persists your profile statistics (games played, games won, win streaks) and efficiency records ("Fewest Turns to Win" by board dimensions and difficulty) in Local Storage.
- **Immersive Neon UI:** Smooth custom animations, vibrant high-contrast glowing elements, responsive grid scalability, and interactive feedback.

---

## 🛠️ Architecture & Project Structure

The project separates logic, presentation, and bots into highly decoupled components:
- `src/utils/ChainReactionEngine.ts`: Core state machine, cell limit checks, turn mechanics, explosion cascade queues, and win/elimination conditions.
- `src/utils/ChainReactionAI.ts`: AI search algorithms, heuristics, evaluation functions, and Minimax search tree pruning. (See details in [`docs/AI_DESIGN.md`](docs/AI_DESIGN.md)).
- `src/components/Lobby.tsx` & `Board.tsx`: Neon-themed user interface, lobbies, customization menus, interactive board grid, and explosion visuals.
- `src/hooks/useGameStats.ts`: Encapsulation of Local Storage statistics and leaderboard records.
- `TASKS.md`: Conceptual planning board tracking sub-agent progression. (See [`TASKS.md`](TASKS.md)).

---

## 📦 Local Development & Commands

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ or v22 recommended).

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Dev Server
Starts the local development server with hot-reload:
```bash
npm run dev
```

### 3. Build & Compile Production App
Runs the TypeScript compiler and builds the optimized PWA bundle to `/dist`:
```bash
npm run build
```

### 4. Run Unit Tests
Runs the Vitest unit tests verifying the core game engine and AI mechanics:
```bash
npm run test
```

### 5. Run Match Simulation & AI Benchmark Suite
Runs automated headless matches between different bots to verify search times, pruning efficiency, and engine stability:
```bash
npm run benchmark
```

---

## 🏷️ Semantic Versioning & Conventional Updates

This project strictly follows **Semantic Versioning (SemVer)** (`MAJOR.MINOR.PATCH`) to track and identify updates:
- **MAJOR (`X.0.0`):** Incompatible API or gameplay system updates.
- **MINOR (`0.Y.0`):** Backward-compatible new features (e.g., a new AI level, extra theme options, or gameplay modes).
- **PATCH (`0.0.Z`):** Backward-compatible bug fixes, optimizations, or documentation changes.

### Conventional Commits Style
We enforce **Conventional Commits** to easily generate version history. Commit messages are structured as:
```text
<type>(<scope>): <description>

[optional body]
```
Where `type` is one of:
- `feat`: A new feature (corresponds to a **MINOR** version bump)
- `fix`: A bug fix (corresponds to a **PATCH** version bump)
- `docs`: Documentation changes
- `style`: Code style/formatting changes
- `refactor`: Code changes that neither fix a bug nor add a feature
- `test`: Adding or correcting tests
- `chore`: Internal tool or build process updates

### 🔍 Identifying the App Version
The current running version of the application can be identified in two places:
1. **Source of Truth:** Defined in the `"version"` field inside the project's [`package.json`](package.json).
2. **User Interface:** Displayed dynamically in the game's header/footer, so users can instantly verify they are running the latest cached build of the PWA.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
