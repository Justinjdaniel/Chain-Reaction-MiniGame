import { describe, it, expect } from 'vitest';
import { ChainReactionEngine } from '../utils/ChainReactionEngine';
import { ChainReactionAI } from '../utils/ChainReactionAI';

describe('ChainReactionAI', () => {
  it('should find legal moves on a new board', () => {
    const engine = new ChainReactionEngine(3, 3, 2);
    const moves = ChainReactionAI.getLegalMoves(engine, 0);
    expect(moves.length).toBe(9);
  });

  it('Easy AI should make a random choice from legal options', () => {
    const engine = new ChainReactionEngine(3, 3, 2);
    const move = ChainReactionAI.getBestMove(engine, 0, 'easy');
    expect(move).not.toBeNull();
    expect(move!.r).toBeGreaterThanOrEqual(0);
    expect(move!.r).toBeLessThan(3);
    expect(move!.c).toBeGreaterThanOrEqual(0);
    expect(move!.c).toBeLessThan(3);
  });

  it('Medium AI should greedily capture corners or choose unstable cells', async () => {
    const engine = new ChainReactionEngine(3, 3, 2);
    const move = ChainReactionAI.getBestMove(engine, 0, 'medium');
    expect(move).not.toBeNull();
    const corners = [
      { r: 0, c: 0 },
      { r: 0, c: 2 },
      { r: 2, c: 0 },
      { r: 2, c: 2 }
    ];
    const isCorner = corners.some(c => c.r === move!.r && c.c === move!.c);
    expect(isCorner).toBe(true);
  });

  it('Hard AI with Alpha-Beta pruning should compute a strategic move within milliseconds', () => {
    const engine = new ChainReactionEngine(5, 5, 2);
    const startTime = Date.now();
    const move = ChainReactionAI.getBestMove(engine, 0, 'hard');
    const duration = Date.now() - startTime;

    expect(move).not.toBeNull();
    expect(duration).toBeLessThan(200);
  });
});
