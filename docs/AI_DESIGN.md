# Chain Reaction AI Design Document

This design document outlines the architecture, heuristic evaluations, and search algorithms of the three integrated AI players in the Chain Reaction game.

## 1. AI Difficulties & Behavior Tiers

### Easy AI (Heuristics-Free Random/Consolidator)
- **Goal:** Provide a very light, unpredictable opponent suitable for casual play or absolute beginners.
- **Rules:**
  1. Identifies all legal moves on the board.
  2. If there are empty cells adjacent to current cells or owned cells, it prefers to claim them to spread out.
  3. Otherwise, it simply picks a random legal cell from all possible legal options.

### Medium AI (One-Step Lookahead Greedy Agent)
- **Goal:** Create an opponent that takes immediate tactical opportunities without thinking deep into the future.
- **Rules:**
  1. Scans every legal cell move.
  2. Runs a single-step mock execution for each legal move.
  3. Evaluates if the move triggers an explosion that captures enemy cells or immediately eliminates an opponent.
  4. Assigns points to cells:
     - +50 points if the move converts a highly populated enemy cell.
     - +10 points if the cell is highly unstable (orbs = criticalMass - 1).
     - +5 points for edge/corner ownership.
  5. Selects the move that scores the highest, or falls back to a random legal move if scores are equal.

### Hard AI (Minimax with Alpha-Beta Pruning)
- **Goal:** Provide an extremely challenging strategic adversary capable of anticipating cascades and defensive traps.
- **Rules:**
  - **Algorithm:** Minimax with Alpha-Beta Pruning, searching at a default depth of 3-4 plies (steps ahead).
  - **Pruning:** Prunes subtrees where the evaluation is guaranteed to be worse than the currently chosen branch, optimizing performance to finish moves in milliseconds.
  - **Evaluation Function:**
    $$U(s) = w_1 \cdot O_{count} + w_2 \cdot C_{owned} + w_3 \cdot S_{corners\_edges} - w_4 \cdot V_{vulnerable}$$
    Where:
    - **$O_{count}$**: Total orbs owned by the AI.
    - **$C_{owned}$**: Number of cells owned by the AI.
    - **$S_{corners\_edges}$**: Ownership of critical corners and edges (since corners only require 2 orbs to explode and are safer from cascades, and edges require 3).
    - **$V_{vulnerable}$**: Vulnerability factor (whether an opponent cell adjacent to ours is highly unstable and could explode to wipe us out).
    - If the game results in immediate win/loss during evaluation, returns $+1,000,000$ or $-1,000,000$.

---

## 2. Benchmark Simulation Architecture
The benchmark script (`scripts/ai_benchmark.js`) spins up several match configurations:
1. **Easy AI vs Medium AI**
2. **Medium AI vs Hard AI**
3. **Hard AI vs Hard AI**

It outputs average turn calculation latency, explosion cascade times, and total turn efficiencies to guarantee the engine does not enter infinite recursion during massive chain reactions.
