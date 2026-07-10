export type PlayerType = 'human' | 'ai';
export type AIDifficulty = 'easy' | 'medium' | 'hard';

export interface Player {
  id: number;
  name: string;
  color: string; // Hex code or tailwind color name
  type: PlayerType;
  difficulty?: AIDifficulty;
}

export interface Cell {
  player: number | null; // ID of player owning the cell
  orbs: number;
  criticalMass: number;
}

export interface GridState {
  grid: Cell[][];
  currentPlayer: number;
  hasTakenFirstTurn: boolean[];
  isEliminated: boolean[];
  turnCount: number;
}

export interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  highestStreak: number;
  currentStreak: number;
}

export interface EfficiencyRecord {
  turns: number;
  boardSize: string; // e.g., "9x6"
  difficulty: AIDifficulty | 'local';
  date: string;
}
