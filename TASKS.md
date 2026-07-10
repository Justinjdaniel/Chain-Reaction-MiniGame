# Chain Reaction PWA Task List

This file tracks the division of labor among the conceptual sub-agents to keep development highly structured, traceable, and verifiable.

## Conceptual Sub-Agents
- **Architect/PM Agent**: Handles project bootstrap, build configurations, and CI/CD pipelines.
- **Game Engine Agent**: Implements the pure state machines, board grid, explosion cascades, and turn mechanics.
- **AI Specialist Agent**: Implements the Easy/Medium/Hard AI bots, AI_DESIGN.md, and the automated simulation benchmarks.
- **Frontend/PWA Agent**: Implements the user interface, neon theme, high score local storage, and service workers.
- **QA/Testing Agent**: Authors tests, runs verification scripts, and executes benchmarks.

---

## Task Progress Board

| Task ID | Description | Assigned Sub-Agent | Status | Verification Method |
|:---|:---|:---|:---|:---|
| **TASK-1.1** | Create conceptual TASKS.md file tracking all duties and responsibilities. | Architect/PM Agent | DONE | Manual verification of file creation. |
| **TASK-1.2** | Bootstrap React + TypeScript + Vite project with Tailwind CSS configuration. | Architect/PM Agent | DONE | Inspect `package.json`, `vite.config.ts`, and project structure. |
| **TASK-2.1** | Design & implement the standard Chain Reaction Core Engine logic with orb explosions and cascading. | Game Engine Agent | DONE | Unit testing board states and explosion cascades. |
| **TASK-2.2** | Implement critical mass checks per cell type (Corner=2, Border=3, Center=4). | Game Engine Agent | DONE | Unit tests evaluating individual cell limits. |
| **TASK-2.3** | Implement delayed player elimination check (only check if they placed their first orb). | Game Engine Agent | DONE | Integration testing round-by-round elimination checks. |
| **TASK-3.1** | Develop Easy and Medium AI decision heuristics. | AI Specialist Agent | DONE | Run mock games using AI selectors. |
| **TASK-3.2** | Develop Hard AI using Minimax with Alpha-Beta pruning (3-4 plies deep) and positional utility evaluation. | AI Specialist Agent | DONE | Run performance tests and check execution speed. |
| **TASK-3.3** | Code the `scripts/ai_benchmark.js` simulation script to run unattended games. | AI Specialist Agent | DONE | Run script locally to verify average move duration & no infinite loops. |
| **TASK-3.4** | Document the AI architecture and pruning details in `docs/AI_DESIGN.md`. | AI Specialist Agent | DONE | File review. |
| **TASK-4.1** | Develop responsive, modern, dark-themed Neon UI with player customization lobby (2-8 players, Human/AI mix, board size selection). | Frontend/PWA Agent | DONE | Playwright/Manual UI review and visual check. |
| **TASK-4.2** | Design CSS/Canvas/DOM-based visual explosion cascade animations. | Frontend/PWA Agent | DONE | Interactive play-testing and UI inspection. |
| **TASK-4.3** | Integrate Local Storage database for Player Profile Stats and Efficiency records. | Frontend/PWA Agent | DONE | Assert values in local storage via browser simulation. |
| **TASK-5.1** | Setup Vite PWA plugin or manual Service Worker registration for offline assets caching. | Frontend/PWA Agent | DONE | Audit build folder, verify service worker register event. |
| **TASK-5.2** | Configure GitHub Actions CI/CD workflows for linting, testing, and GitHub Pages deployment. | Architect/PM Agent | DONE | Push to branch and observe pipeline success. |
| **TASK-6.1** | Comprehensive testing: Write and execute tests spanning game engine, AI logic, and page actions. | QA/Testing Agent | DONE | Run test scripts successfully. |
| **TASK-7.1** | Update explosion rules (leave 0 orbs), early victory condition, and remove results bouncing. Add clear neon-styled instructions panel. | Game Engine & Frontend Agents | DONE | Unit tests and Playwright visual screenshot check. |
