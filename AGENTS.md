# 🤖 AI Agent Specifications, Guidelines & Skills

Welcome, AI Agent! This repository is designed to be highly AI-friendly. Below are the comprehensive specifications, skills architecture, test case guidelines, and system instructions for modifying and interacting with this codebase.

---

## 1. Project Specifications for AI

This is a Progressive Web App (PWA) Chain Reaction game built with React, Vite, TypeScript, and Tailwind CSS.

### Key Directory Structure
- `src/utils/ChainReactionEngine.ts`: Core state machine, cell limit checks, turn mechanics, and victory rules.
- `src/utils/ChainReactionAI.ts`: Heuristics and search algorithms for Easy, Medium, and Hard AI levels.
- `src/components/`: Frontend components (Lobby / Board / Controls).
- `src/tests/`: Vitest test suites (Engine, AI, Benchmark).

---

## 2. Agents & Skills Matrix

AI agents working on this repo are expected to possess or exhibit the following skills:

### ⚡ Game Logic Engineering (Skill Level: Expert)
- **Cascade Simulation:** Fully understand deep synchronous recursive simulations for game tree evaluation.
- **State Serialization:** Ability to clone the game engine completely without pointer-sharing (`clone()` method in engine) to avoid corrupting active search trees.

### 🧠 Strategic Heuristic Modeling (Skill Level: Advanced)
- **Minimax Search:** Familiarity with depth plies, alpha-beta pruning bounds ($[-\infty, \infty]$), and utility valuations.
- **Evaluation Heuristics:** Balancing positional advantages (corners/edges) against dynamic assets (total orbs) and vulnerability risks.

### 🧪 Quality Assurance & Test Verification (Skill Level: Expert)
- **TDD Practices:** Writing and verifying regression tests, and benchmarking algorithm speeds (seeking moves calculated in under 15ms).

---

## 3. Test Cases & Test Instructions

All changes to gameplay or AI algorithms **must** be verified with automated test suites.

### How to Run Tests
```bash
# Run unit tests
npm test

# Run AI vs AI matchup simulation benchmark
npm run benchmark
```

### Writing Custom Test Cases
When adding new features or modifying game rules, add corresponding test cases in `src/tests/ChainReactionEngine.test.ts`.

#### Example Test Pattern:
```typescript
it('should evaluate custom scenario successfully', async () => {
  const engine = new ChainReactionEngine(3, 3, 2);
  // Setup moves...
  await engine.placeOrb(0, 0, 0);

  // Assert expected cell state
  expect(engine.grid[0][0].orbs).toBe(1);
});
```

---

## 4. Instructions for Future AI Development

If you are an AI assisting in this repository:
1. **Never Break Early-Termination:** Ensure that anytime `checkGameOver()` evaluates to true mid-cascade, the loop immediately terminates via `break`.
2. **Synchronous/Asynchronous Alignment:** Keep synchronous simulations in `ChainReactionAI.ts` exactly aligned in logic with the asynchronous simulation in `ChainReactionEngine.ts`.
3. **Responsive Visuals:** Ensure Tailwind classes in components (e.g., `Board.tsx`) scale correctly for mobile devices and retain the high-performance dark-theme neon aesthetic.
