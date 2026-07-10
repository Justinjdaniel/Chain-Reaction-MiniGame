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
    await engine.placeOrb(0, 0, 0); // 2nd orb in corner (0,0) - capacity is 2, explodes at 3, so not exploding yet

    expect(engine.grid[0][0].orbs).toBe(2);
    expect(engine.grid[0][0].player).toBe(0);

    await engine.placeOrb(2, 2, 1);
    await engine.placeOrb(0, 0, 0); // 3rd orb - triggers explosion!

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
    // Turn 1: Player 0 places at (0,0)
    await engine.placeOrb(0, 0, 0);
    // Turn 2: Player 1 places at (2,2) - Player 1 has a safe separate orb
    await engine.placeOrb(2, 2, 1);
    // Turn 3: Player 0 places at (0,0)
    await engine.placeOrb(0, 0, 0);
    // Turn 4: Player 1 places at (0,1)
    await engine.placeOrb(0, 1, 1);
    // Turn 5: Player 0 places at (1,1)
    await engine.placeOrb(1, 1, 0);
    // Turn 6: Player 1 places at (0,1)
    await engine.placeOrb(0, 1, 1);
    // Turn 7: Player 0 places at (1,1)
    await engine.placeOrb(1, 1, 0);
    // Turn 8: Player 1 places at (0,1)
    await engine.placeOrb(0, 1, 1);

    // Turn 9: Player 0 places at (0,0) - triggers explosion at (0,0) which cascades into (0,1)!
    await engine.placeOrb(0, 0, 0);

    // After cascade:
    // (0,1) should have exploded, so 0 orbs left and owner null
    expect(engine.grid[0][1].orbs).toBe(0);
    expect(engine.grid[0][1].player).toBe(null);

    // (0,2) should have received 1 orb from (0,1) and be owned by player 0
    expect(engine.grid[0][2].orbs).toBe(1);
    expect(engine.grid[0][2].player).toBe(0);

    // (1,1) should have received 1 orb from (0,1), having 3 orbs of player 0 (started with 2)
    expect(engine.grid[1][1].orbs).toBe(3);
    expect(engine.grid[1][1].player).toBe(0);
  });
});
