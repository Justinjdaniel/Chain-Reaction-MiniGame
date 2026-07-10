# 🌌 Chain Reaction Gameplay Design Document

This document outlines the core gameplay mechanics, state machines, and configuration rules of the Chain Reaction PWA. Use this document as a design blueprint when modifying or extending game mechanics in the future.

---

## 1. Grid Properties and Critical Mass

Each cell has a **Critical Mass Capacity** based on its coordinate position on the grid ($M \times N$).

| Location Type | Description | Critical Mass Capacity | Explosion Threshold (Orbs) |
| :--- | :--- | :--- | :--- |
| **Corners** | 2 orthogonal neighbors (e.g. `(0,0)`) | **2** | **3 orbs** |
| **Edges (Border)** | 3 orthogonal neighbors (e.g. `(0,1)`) | **3** | **4 orbs** |
| **Center (Inner)** | 4 orthogonal neighbors (e.g. `(1,1)`) | **4** | **5 orbs** |

### Code References
- **Capacity calculation:** Determined by `ChainReactionEngine.getCriticalMass(r, c)`.
- **Explosion trigger:** Triggered when cell orbs satisfy `cell.orbs >= cell.criticalMass + 1`.

---

## 2. Explosion and Subtraction Formula

When a cell reaches or exceeds its **Explosion Threshold**, it triggers an immediate cascading explosion:

1. **Orb Deduction:** The exploding cell loses exactly `criticalMass + 1` orbs.
   - *Formula:* `cell.orbs -= (cell.criticalMass + 1)`
   - *Result:* When a cell containing exactly the threshold amount of orbs explodes, it loses all of its orbs, leaving exactly **0** behind (`cell.orbs = 0`, `cell.player = null`).
2. **Orthogonal Distribution:** Exactly 1 orb is sent to each of its orthogonally adjacent neighbors (Up, Down, Left, Right).
3. **Color Conversion:** All adjacent cells receiving these orbs are converted to the exploding player's color, regardless of who previously owned them.

---

## 3. Early Victory Condition

To avoid unnecessarily filling the board with orbs when a winner has already emerged, the game checks for early termination during cascading reactions:

- **Check Timing:** Run after every single explosion step during the cascade loop (`processExplosions`).
- **Elimination Criteria:** A player is marked as eliminated if they have taken their first turn but currently have 0 orbs on the board.
- **Immediate Termination:** If at any point during cascades there is only **1** player remaining with dots on the board (after all players have had at least their first turn), the game terminates immediately. The cascade stops processing, and that player is declared the winner.

This behavior is implemented in `ChainReactionEngine.ts` and simulated in `ChainReactionAI.ts`.

---

## 4. Modifying Gameplay Rules in the Future

If you want to alter the gameplay logic in the future, follow these guideposts:

### A. Changing Critical Mass or Thresholds
- To adjust the layout or neighborhood calculation (e.g. including diagonals), edit `getCriticalMass` in `ChainReactionEngine.ts`.
- To change the trigger threshold, edit `getExplodingCells()` in `ChainReactionEngine.ts` and the visual indicator code in `Board.tsx` (the `isUnstable` check).

### B. Adjusting Remaining Orbs After Explosion
- Modify `cell.orbs -= (cell.criticalMass + 1)` inside `processExplosions` in `ChainReactionEngine.ts` and `simulateMoveSync` in `ChainReactionAI.ts`.

### C. Adding Modes or Custom Rules
- Update `Lobby.tsx` to let players configure gameplay modes.
- Pass custom parameters/configs into the `ChainReactionEngine` constructor.
