import { ChainReactionEngine } from '../utils/ChainReactionEngine';

export interface AIMove {
  r: number;
  c: number;
  score: number;
}

export class ChainReactionAI {
  /**
   * Main entry point to get the best move for any AI difficulty level.
   */
  static getBestMove(
    engine: ChainReactionEngine,
    playerId: number,
    difficulty: 'easy' | 'medium' | 'hard'
  ): { r: number; c: number } | null {
    const legalMoves = this.getLegalMoves(engine, playerId);
    if (legalMoves.length === 0) return null;

    switch (difficulty) {
      case 'easy':
        return this.getEasyMove(engine, legalMoves, playerId);
      case 'medium':
        return this.getMediumMove(engine, legalMoves, playerId);
      case 'hard':
        return this.getHardMove(engine, legalMoves, playerId);
      default:
        return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }
  }

  // Get all coordinates that the player can validly play
  static getLegalMoves(engine: ChainReactionEngine, playerId: number): { r: number; c: number }[] {
    // Optimization: Hoist player and elimination validation out of the loop
    if (playerId < 0 || playerId >= engine.playersCount) return [];
    if (engine.isEliminated[playerId] || engine.currentPlayer !== playerId) return [];

    const moves: { r: number; c: number }[] = [];
    const rows = engine.rows;
    const cols = engine.cols;
    const grid = engine.grid;

    for (let r = 0; r < rows; r++) {
      const row = grid[r];
      for (let c = 0; c < cols; c++) {
        const player = row[c].player;
        if (player === null || player === playerId) {
          moves.push({ r, c });
        }
      }
    }
    return moves;
  }

  // Easy AI: Selects randomly among moves, with a minor bias to consolidate owned cells
  private static getEasyMove(
    engine: ChainReactionEngine,
    legalMoves: { r: number; c: number }[],
    playerId: number
  ): { r: number; c: number } {
    const ownedMoves = legalMoves.filter(m => engine.grid[m.r][m.c].player === playerId);
    // 40% chance of consolidation if possible, otherwise complete random
    if (ownedMoves.length > 0 && Math.random() < 0.4) {
      return ownedMoves[Math.floor(Math.random() * ownedMoves.length)];
    }
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
  }

  // Medium AI: 1-step lookahead greedy heuristic
  private static getMediumMove(
    engine: ChainReactionEngine,
    legalMoves: { r: number; c: number }[],
    playerId: number
  ): { r: number; c: number } {
    let bestMove = legalMoves[0];
    let highestScore = -Infinity;

    for (const move of legalMoves) {
      const score = this.evaluateSingleMove(engine, move.r, move.c, playerId);
      if (score > highestScore) {
        highestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  private static evaluateSingleMove(
    engine: ChainReactionEngine,
    r: number,
    c: number,
    playerId: number
  ): number {
    let score = 0;
    const cell = engine.grid[r][c];

    // Favor corner/edge cells as stable building blocks
    if (cell.criticalMass === 2) score += 15; // corner
    else if (cell.criticalMass === 3) score += 5;  // edge

    // If cell is unstable and placing an orb will explode it (reaches criticalMass + 1)
    if (cell.orbs === cell.criticalMass) {
      score += 25; // Good to explode

      // Check adjacent enemies we could convert
      const neighbors = [];
      if (r > 0) neighbors.push(engine.grid[r - 1][c]);
      if (r < engine.rows - 1) neighbors.push(engine.grid[r + 1][c]);
      if (c > 0) neighbors.push(engine.grid[r][c - 1]);
      if (c < engine.cols - 1) neighbors.push(engine.grid[r][c + 1]);

      for (const n of neighbors) {
        if (n.player !== null && n.player !== playerId) {
          score += (n.orbs * 10); // Reward converting highly-populated opponent cells
        }
      }
    } else {
      // Just adding safe orb
      score += 2;
    }

    return score;
  }

  // Hard AI: Minimax with Alpha-Beta Pruning (Default depth 3)
  private static getHardMove(
    engine: ChainReactionEngine,
    legalMoves: { r: number; c: number }[],
    playerId: number
  ): { r: number; c: number } {
    let bestMove = legalMoves[0];
    let bestVal = -Infinity;
    const depth = 3; // depth ply for robust prediction without latency issues

    for (const move of legalMoves) {
      // Create a fast synchronous simulation copy
      const sim = engine.clone();

      // Perform move (simulating synchronously without callback delay)
      // We manually inline orbs placement & sync explosion loop for speed
      this.simulateMoveSync(sim, move.r, move.c, playerId);

      const val = this.minimax(sim, depth - 1, -Infinity, Infinity, false, playerId);
      if (val > bestVal) {
        bestVal = val;
        bestMove = move;
      }
    }

    return bestMove;
  }

  // Synchronous engine simulator helper to avoid Promise performance overhead during search tree
  private static simulateMoveSync(engine: ChainReactionEngine, r: number, c: number, playerId: number) {
    const cell = engine.grid[r][c];
    cell.player = playerId;
    cell.orbs++;
    engine.hasTakenFirstTurn[playerId] = true;

    // Run cascade explosion loop
    let exploding = engine.getExplodingCells();
    while (exploding.length > 0) {
      const dist: { r: number; c: number; player: number }[] = [];
      for (const { r: er, c: ec } of exploding) {
        const ecCell = engine.grid[er][ec];
        const active = ecCell.player;
        if (active === null) continue;

        ecCell.orbs -= (ecCell.criticalMass + 1);
        if (ecCell.orbs <= 0) {
          ecCell.orbs = 0;
          ecCell.player = null;
        }

        if (er > 0) dist.push({ r: er - 1, c: ec, player: active });
        if (er < engine.rows - 1) dist.push({ r: er + 1, c: ec, player: active });
        if (ec > 0) dist.push({ r: er, c: ec - 1, player: active });
        if (ec < engine.cols - 1) dist.push({ r: er, c: ec + 1, player: active });
      }

      for (const { r: dr, c: dc, player: dp } of dist) {
        const target = engine.grid[dr][dc];
        target.player = dp;
        target.orbs++;
      }

      engine.checkEliminations();
      if (engine.checkGameOver()) {
        break;
      }

      exploding = engine.getExplodingCells();
    }

    engine.checkEliminations();
    engine.advanceTurn();
  }

  private static minimax(
    engine: ChainReactionEngine,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizingPlayer: boolean,
    aiPlayerId: number
  ): number {
    if (engine.checkGameOver()) {
      const winner = engine.getWinner();
      if (winner === aiPlayerId) return 1000000 + depth;
      return -1000000 - depth;
    }

    if (depth === 0) {
      return this.evaluateBoard(engine, aiPlayerId);
    }

    const currentPlayerId = engine.currentPlayer;
    const legalMoves = this.getLegalMoves(engine, currentPlayerId);

    if (legalMoves.length === 0) {
      // Skip turn/pass or handle no moves
      const sim = engine.clone();
      sim.advanceTurn();
      return this.minimax(sim, depth - 1, alpha, beta, !isMaximizingPlayer, aiPlayerId);
    }

    if (isMaximizingPlayer) {
      let maxEval = -Infinity;
      for (const move of legalMoves) {
        const sim = engine.clone();
        this.simulateMoveSync(sim, move.r, move.c, currentPlayerId);
        const evaluation = this.minimax(sim, depth - 1, alpha, beta, false, aiPlayerId);
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break; // Beta cut-off
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of legalMoves) {
        const sim = engine.clone();
        this.simulateMoveSync(sim, move.r, move.c, currentPlayerId);
        // Is the next player also an opponent or is it back to Maximizing player?
        const nextIsAI = sim.currentPlayer === aiPlayerId;
        const evaluation = this.minimax(sim, depth - 1, alpha, beta, nextIsAI, aiPlayerId);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break; // Alpha cut-off
      }
      return minEval;
    }
  }

  // Heuristic Board Evaluation Function
  private static evaluateBoard(engine: ChainReactionEngine, aiPlayerId: number): number {
    let score = 0;
    let aiOrbs = 0;
    let enemyOrbs = 0;
    let aiCells = 0;
    let enemyCells = 0;

    for (let r = 0; r < engine.rows; r++) {
      for (let c = 0; c < engine.cols; c++) {
        const cell = engine.grid[r][c];
        if (cell.player !== null) {
          if (cell.player === aiPlayerId) {
            aiOrbs += cell.orbs;
            aiCells++;

            // Corner bonus (2 critical mass means highly active/stable start point)
            if (cell.criticalMass === 2) {
              score += 10;
            } else if (cell.criticalMass === 3) {
              score += 4;
            }
          } else {
            enemyOrbs += cell.orbs;
            enemyCells++;
          }
        }
      }
    }

    // Weight allocations
    score += (aiOrbs * 4);
    score += (aiCells * 6);
    score -= (enemyOrbs * 3);
    score -= (enemyCells * 4);

    return score;
  }
}
