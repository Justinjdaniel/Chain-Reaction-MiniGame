# 🌌 Chain Reaction PWA Strategy Game

[![Build & Deploy](https://github.com/Justinjdaniel/Chain-Reaction-MiniGame/actions/workflows/deploy.yml/badge.svg)](https://github.com/Justinjdaniel/Chain-Reaction-MiniGame/actions/workflows/deploy.yml)
[![Deployed URL](https://img.shields.io/badge/Deployed-Live_App-00ff66?style=flat-squared&logo=google-chrome&logoColor=fff)](https://justinjdaniel.github.io/Chain-Reaction-MiniGame/)
[![Version](https://img.shields.io/badge/Version-v1.0.0-ff0055?style=flat-squared)](package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-00f0ff?style=flat-squared)](LICENSE)

An extremely responsive, high-performance, dark-themed **Chain Reaction Strategy Game** built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. Designed with a futuristic neon aesthetic, local-first performance, offline-capable Progressive Web App (PWA) features, and an advanced AI engine.

📌 Play the live game directly in your browser or install it on your device:
➡️ **[Live Deployed URL](https://justinjdaniel.github.io/Chain-Reaction-MiniGame/)**

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
1. The cell loses exactly its Critical Mass worth of orbs (leaving exactly **0** behind when exploding at exactly the threshold).
2. One orb is sent to each of its adjacent neighbor cells (up, down, left, right).
3. The newly populated adjacent cells take on the **exploding player's color**, even if they previously belonged to an opponent!
4. If any adjacent cells also reach their Critical Mass due to this influx, they will trigger a **cascading chain reaction** of explosions!

### 💀 Player Elimination
- A player is eliminated if they have **no orbs left on the board**.
- > [!IMPORTANT]
  > Elimination checks are delayed until *after* each player has had their first turn (to allow everyone a chance to place their starting orb).

---

## 🛠️ Tech Stack & Architecture

This modern progressive web app is crafted using standard web technologies optimized for high performance and low latency:

*   **Frontend Library:** [React 18](https://react.dev/) (with TypeScript for robust type-safety)
*   **Build Tool:** [Vite](https://vite.dev/) (delivering blazingly fast hot module replacement and bundle optimization)
*   **Styling:** [Tailwind CSS v3](https://tailwindcss.com/) (augmented with custom neon utilities, animations, and radial orb glow effects)
*   **PWA Engine:** `vite-plugin-pwa` (offline caching, background service worker registration, and app installation capabilities)
*   **Test Suite:** [Vitest](https://vitest.dev/) (running supercharged unit tests and AI benchmark simulations)

### 📂 Directory Structure

The repository separates game logic, visuals, and bot simulations:
*   `src/utils/ChainReactionEngine.ts`: Core state machine, cell limit checks, turn mechanics, explosion cascade queues, and win/elimination conditions.
*   `src/utils/ChainReactionAI.ts`: AI search algorithms, heuristics, evaluation functions, and Minimax search tree pruning. (See details in [`docs/AI_DESIGN.md`](docs/AI_DESIGN.md)).
*   `src/components/Lobby.tsx` & `Board.tsx`: Neon-themed user interface, lobbies, customization menus, interactive board grid, and explosion visuals.
*   `src/hooks/useGameStats.ts`: Encapsulation of Local Storage statistics and leaderboard records.
*   `TASKS.md`: Conceptual planning board tracking sub-agent progression. (See [`TASKS.md`](TASKS.md)).

---

## 🚀 Key Features

*   **Customizable Lobby (2-8 Players):** Supports any mix of Human and AI players in a single game lobby.
*   **Smart AI Bots with 3 Difficulty Levels:**
    *   🟢 **Easy:** Plays randomly, with a slight heuristic bias.
    *   🟡 **Medium:** One-step greedy heuristic (immediate captures and defense).
    *   🔴 **Hard (Minimax with Alpha-Beta Pruning):** 3-plies deep searches evaluating board position, player counts, explosion potential, and corner dominance.
*   **Progressive Web App (PWA):** Installable directly onto iOS, Android, macOS, or Windows. Fully offline-capable via background Service Worker asset caching.
*   **Local Stats & Achievements Tracker:** Persists your profile statistics (games played, games won, win streaks) and efficiency records ("Fewest Turns to Win" by board dimensions and difficulty) in Local Storage.
*   **Immersive Neon UI:** Smooth custom animations, vibrant high-contrast glowing elements, responsive grid scalability, and interactive feedback.
*   **A11y & Keyboard Navigation:** Rich screen reader labels for cells and fully accessible color swatches via keyboard tab order.

---

## ⚙️ Local Development & Setup

Follow these steps to run the reactor environment locally.

> [!NOTE]
> The package manager choice for this project is strictly **pnpm**. Do not use `npm` or `yarn`.

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ or v22 recommended).

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Dev Server
Starts the local development server with hot-reload:
```bash
pnpm dev
```

### 3. Build & Compile Production App
Runs the TypeScript compiler and builds the optimized, offline-ready production PWA bundle to `/dist`:
```bash
pnpm build
```

### 4. Preview Build Locally
To run a local web server serving the production `/dist` folder:
```bash
pnpm preview
```

### 5. Run Unit Tests
Runs the Vitest unit tests verifying the core game engine, rules, and AI decisions:
```bash
pnpm test
```

### 6. Run Match Simulation & AI Benchmark Suite
Runs automated headless matches between different bots to verify search times, pruning efficiency, and engine stability:
```bash
pnpm benchmark
```

---

## 🤝 Contributing

We welcome contributions to make the game even better! Please read the following guidelines before submitting a pull request:

### 💡 Code Quality & Formatting
*   Follow clean-code principles, ensuring components remain modular and decoupled from the engine.
*   Run linting before proposing changes:
    ```bash
    pnpm lint
    ```
*   Ensure all tests pass successfully (`pnpm test`).

### 📦 Performance Guidelines
*   **Bypass Object Spreads in Hot Paths:** To maintain ultra-low latency (< 15ms AI response time), avoid standard JS collection arrays mapping (`.map()`) or object spreads (`{...cell}`) inside deep minimax loops. Always prefer pre-allocated arrays, raw nested `for` loops, and `skipGridInit` clones.

> [!TIP]
> Refer to the design documents inside the `docs/` directory (`docs/AI_DESIGN.md` and `docs/GAMEPLAY_DESIGN.md`) to align your code style and engine design with existing architectures.

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
Where `type` is one of `feat`, `fix`, `docs`, `style`, `refactor`, `test`, or `chore`.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
