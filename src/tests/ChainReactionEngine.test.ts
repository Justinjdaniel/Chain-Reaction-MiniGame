import { describe, it, expect } from 'vitest';
import { ChainReactionEngine } from '../utils/ChainReactionEngine';

describe('ChainReactionEngine', () => {
  it('should initialize correctly', () => {
    const engine = new ChainReactionEngine(9, 6, 3);
    expect(engine.rows).toBe(9);
    expect(engine.cols).toBe(6);
    expect(engine.playersCount).toBe(3);
    expect(engine.currentPlayer).toBe(0);
    expect(engine.grid[0][0].criticalMass).toBe(2); // corner
    expect(engine.grid[0][1].criticalMass).toBe(3); // edge
    expect(engine.grid[1][1].criticalMass).toBe(4); // center
  });

  it('should enforce critical mass bounds correctly', () => {
    const engine = new ChainReactionEngine(5, 5, 2);
    expect(engine.getCriticalMass(0, 0)).toBe(2);
    expect(engine.getCriticalMass(0, 4)).toBe(2);
    expect(engine.getCriticalMass(4, 0)).toBe(2);
    expect(engine.getCriticalMass(4, 4)).toBe(2);
    expect(engine.getCriticalMass(0, 2)).toBe(3);
    expect(engine.getCriticalMass(2, 0)).toBe(3);
    expect(engine.getCriticalMass(2, 2)).toBe(4);
  });

  it('should allow valid moves and reject invalid moves', () => {
    const engine = new ChainReactionEngine(3, 3, 2);
    expect(engine.isValidMove(0, 0, 0)).toBe(true);
    expect(engine.isValidMove(0, 0, 1)).toBe(false);

    engine.grid[0][0].player = 0;
    engine.grid[0][0].orbs = 1;
    expect(engine.isValidMove(0, 0, 0)).toBe(true);
    expect(engine.isValidMove(1, 1, 1)).toBe(false);
  });

  it('should handle single step explosion correctly', async () => {
    const engine = new ChainReactionEngine(3, 3, 2);
    await engine.placeOrb(0, 0, 0);
    expect(engine.grid[0][0].orbs).toBe(1);
    expect(engine.grid[0][0].player).toBe(0);

    await engine.placeOrb(2, 2, 1);
    await engine.placeOrb(0, 0, 0);

    expect(engine.grid[0][0].orbs).toBe(0);
    expect(engine.grid[0][0].player).toBe(null);

    expect(engine.grid[0][1].orbs).toBe(1);
    expect(engine.grid[0][1].player).toBe(0);
    expect(engine.grid[1][0].orbs).toBe(1);
    expect(engine.grid[1][0].player).toBe(0);
  });

  it('should delay elimination checks until first turns are made', async () => {
    const engine = new ChainReactionEngine(3, 3, 3);
    await engine.placeOrb(0, 0, 0);
    await engine.placeOrb(1, 1, 1);
    await engine.placeOrb(2, 2, 2);

    expect(engine.isEliminated[0]).toBe(false);
    expect(engine.isEliminated[1]).toBe(false);
    expect(engine.isEliminated[2]).toBe(false);
  });

  it('should cascade explosions and convert opponent colors', async () => {
    const engine = new ChainReactionEngine(3, 3, 2);
    await engine.placeOrb(0, 0, 0);
    await engine.placeOrb(0, 1, 1);
    await engine.placeOrb(1, 0, 0);
    await engine.placeOrb(0, 1, 1);
    await engine.placeOrb(0, 0, 0);

    expect(engine.grid[0][1].orbs).toBe(0);
    expect(engine.grid[0][1].player).toBe(null);
    expect(engine.grid[0][2].player).toBe(0);
    expect(engine.grid[1][1].player).toBe(0);
  });
});
