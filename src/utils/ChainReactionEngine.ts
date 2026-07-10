import { Cell } from '../types/game';

export class ChainReactionEngine {
  rows: number;
  cols: number;
  playersCount: number;
  currentPlayer: number;
  hasTakenFirstTurn: boolean[];
  isEliminated: boolean[];
  grid: Cell[][];
  turnCount: number; // to track efficiency

  constructor(rows = 9, cols = 6, playersCount = 2) {
    this.rows = rows;
    this.cols = cols;
    this.playersCount = playersCount;
    this.currentPlayer = 0;
    this.turnCount = 0;

    // Track if each player has taken their first turn
    this.hasTakenFirstTurn = new Array(playersCount).fill(false);
    // Track elimination status
    this.isEliminated = new Array(playersCount).fill(false);

    // Initialize empty grid
    this.grid = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => ({
        player: null,
        orbs: 0,
        criticalMass: this.getCriticalMass(r, c)
      }))
    );
  }

  // Calculate critical mass based on orthogonally adjacent neighbors
  getCriticalMass(r: number, c: number): number {
    let neighbors = 0;
    if (r > 0) neighbors++;
    if (r < this.rows - 1) neighbors++;
    if (c > 0) neighbors++;
    if (c < this.cols - 1) neighbors++;
    return neighbors;
  }

  // Check if a move is valid
  isValidMove(r: number, c: number, playerId: number): boolean {
    if (playerId < 0 || playerId >= this.playersCount) return false;
    if (this.isEliminated[playerId] || this.currentPlayer !== playerId) return false;
    const cell = this.grid[r][c];
    return cell.player === null || cell.player === playerId;
  }

  // Executes a move and processes the cascading explosions asynchronously
  async placeOrb(
    r: number,
    c: number,
    playerId: number,
    onStepCallback: ((grid: Cell[][]) => Promise<void> | void) | null = null
  ): Promise<boolean> {
    if (!this.isValidMove(r, c, playerId)) return false;

    // Place the orb
    const cell = this.grid[r][c];
    cell.player = playerId;
    cell.orbs++;

    this.hasTakenFirstTurn[playerId] = true;

    // Process explosions sequentially to handle cascades
    await this.processExplosions(onStepCallback);

    // Check for player eliminations after the chain reaction ends
    this.checkEliminations();

    // Advance turn to the next active player
    this.advanceTurn();
    return true;
  }

  async processExplosions(onStepCallback: ((grid: Cell[][]) => Promise<void> | void) | null) {
    let explodingCells = this.getExplodingCells();

    while (explodingCells.length > 0) {
      // Create a snapshot or notify UI before this explosion step
      if (onStepCallback) {
        await onStepCallback(this.cloneGridState());
      }

      // Track distribution to avoid multi-exploding the same cell in a single step
      const distributionQueue: { r: number; c: number; player: number }[] = [];

      for (const { r, c } of explodingCells) {
        const cell = this.grid[r][c];
        const activePlayer = cell.player;

        if (activePlayer === null) continue;

        // Deduct exactly critical mass + 1, retain the remainder
        cell.orbs -= (cell.criticalMass + 1);
        if (cell.orbs <= 0) {
          cell.orbs = 0;
          cell.player = null;
        }

        // Queue adjacent cells for orbs
        const neighbors = [];
        if (r > 0) neighbors.push({ r: r - 1, c });
        if (r < this.rows - 1) neighbors.push({ r: r + 1, c });
        if (c > 0) neighbors.push({ r, c: c - 1 });
        if (c < this.cols - 1) neighbors.push({ r, c: c + 1 });

        for (const neighbor of neighbors) {
          distributionQueue.push({ ...neighbor, player: activePlayer });
        }
      }

      // Apply distribution and convert opponent colors
      for (const { r, c, player } of distributionQueue) {
        const cell = this.grid[r][c];
        cell.player = player;
        cell.orbs++;
      }

      // Check eliminations and check if game is over early (no player dot exist)
      this.checkEliminations();
      if (this.checkGameOver()) {
        break;
      }

      // Find next batch of unstable cells
      explodingCells = this.getExplodingCells();
    }

    // Final state callback after reaction settles
    if (onStepCallback) {
      await onStepCallback(this.cloneGridState());
    }
  }

  getExplodingCells(): { r: number; c: number }[] {
    const list: { r: number; c: number }[] = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c].orbs >= this.grid[r][c].criticalMass + 1) {
          list.push({ r, c });
        }
      }
    }
    return list;
  }

  checkEliminations() {
    // Count remaining orbs per player
    const orbCounts = new Array(this.playersCount).fill(0);
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (cell.player !== null) {
          orbCounts[cell.player] += cell.orbs;
        }
      }
    }

    // Eliminate players who have taken their first turn but have 0 orbs left
    for (let p = 0; p < this.playersCount; p++) {
      if (this.hasTakenFirstTurn[p] && orbCounts[p] === 0) {
        this.isEliminated[p] = true;
      }
    }
  }

  advanceTurn() {
    this.turnCount++;
    if (this.checkGameOver()) return;

    let nextPlayer = (this.currentPlayer + 1) % this.playersCount;
    // Loop until we find a player who isn't eliminated
    let iterations = 0;
    while (this.isEliminated[nextPlayer] && iterations < this.playersCount) {
      nextPlayer = (nextPlayer + 1) % this.playersCount;
      iterations++;
    }
    this.currentPlayer = nextPlayer;
  }

  checkGameOver(): boolean {
    const activePlayers = this.isEliminated.filter(eliminated => !eliminated).length;
    // Game over when 1 or fewer players are not eliminated, AND all players have had at least one turn
    const allTookTurn = this.hasTakenFirstTurn.every(turn => turn);
    return activePlayers <= 1 && allTookTurn;
  }

  getWinner(): number | null {
    if (!this.checkGameOver()) return null;
    const winnerId = this.isEliminated.findIndex(eliminated => !eliminated);
    return winnerId !== -1 ? winnerId : null;
  }

  cloneGridState(): Cell[][] {
    return this.grid.map(row => row.map(cell => ({ ...cell })));
  }

  // Clone entire engine state for minimax simulations
  clone(): ChainReactionEngine {
    const copy = new ChainReactionEngine(this.rows, this.cols, this.playersCount);
    copy.currentPlayer = this.currentPlayer;
    copy.turnCount = this.turnCount;
    copy.hasTakenFirstTurn = [...this.hasTakenFirstTurn];
    copy.isEliminated = [...this.isEliminated];
    copy.grid = this.cloneGridState();
    return copy;
  }
}
