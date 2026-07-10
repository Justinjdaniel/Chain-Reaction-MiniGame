import { describe, it } from 'vitest';
import { ChainReactionEngine } from '../utils/ChainReactionEngine';
import { ChainReactionAI } from '../utils/ChainReactionAI';

describe('Chain Reaction AI Benchmark Execution', () => {
  it('runs complete AI matchups to ensure stability and verify execution times', () => {
    function runMatch(rows: number, cols: number, difficultyP1: 'easy' | 'medium' | 'hard', difficultyP2: 'easy' | 'medium' | 'hard') {
      const engine = new ChainReactionEngine(rows, cols, 2);
      let movesCount = 0;
      let totalCalculationTime = 0;

      while (!engine.checkGameOver() && movesCount < 40) {
        const activePlayer = engine.currentPlayer;
        const diff = activePlayer === 0 ? difficultyP1 : difficultyP2;

        const calcStart = Date.now();
        const move = ChainReactionAI.getBestMove(engine, activePlayer, diff);
        const calcEnd = Date.now();
        totalCalculationTime += (calcEnd - calcStart);

        if (!move) {
          engine.advanceTurn();
          continue;
        }

        const cell = engine.grid[move.r][move.c];
        cell.player = activePlayer;
        cell.orbs++;
        engine.hasTakenFirstTurn[activePlayer] = true;

        let exploding = engine.getExplodingCells();
        while (exploding.length > 0) {
          const dist = [];
          for (const { r: er, c: ec } of exploding) {
            const ecCell = engine.grid[er][ec];
            const active = ecCell.player;
            if (active === null) continue;

            ecCell.orbs -= ecCell.criticalMass;
            if (ecCell.orbs === 0) ecCell.player = null;

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
          exploding = engine.getExplodingCells();
        }

        engine.checkEliminations();
        engine.advanceTurn();

        movesCount++;
      }

      const winner = engine.getWinner();
      console.log(`🏆 [Benchmark] Finished! Winner: Player ${winner}. Moves: ${movesCount}. Search Time: ${totalCalculationTime}ms.`);
    }

    runMatch(5, 5, 'easy', 'medium');
    runMatch(5, 5, 'medium', 'hard');
  });
});
