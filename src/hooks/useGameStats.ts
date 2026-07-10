import { useState, useEffect } from 'react';
import { Stats, EfficiencyRecord, AIDifficulty } from '../types/game';

const STATS_KEY = 'chain_reaction_stats';
const LEADERBOARD_KEY = 'chain_reaction_leaderboard';

const DEFAULT_STATS: Stats = {
  gamesPlayed: 0,
  gamesWon: 0,
  highestStreak: 0,
  currentStreak: 0
};

export const sanitizeStats = (parsed: any): Stats => {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return DEFAULT_STATS;
  }
  return {
    gamesPlayed: Object.prototype.hasOwnProperty.call(parsed, 'gamesPlayed') && typeof parsed.gamesPlayed === 'number' && Number.isFinite(parsed.gamesPlayed) ? parsed.gamesPlayed : 0,
    gamesWon: Object.prototype.hasOwnProperty.call(parsed, 'gamesWon') && typeof parsed.gamesWon === 'number' && Number.isFinite(parsed.gamesWon) ? parsed.gamesWon : 0,
    highestStreak: Object.prototype.hasOwnProperty.call(parsed, 'highestStreak') && typeof parsed.highestStreak === 'number' && Number.isFinite(parsed.highestStreak) ? parsed.highestStreak : 0,
    currentStreak: Object.prototype.hasOwnProperty.call(parsed, 'currentStreak') && typeof parsed.currentStreak === 'number' && Number.isFinite(parsed.currentStreak) ? parsed.currentStreak : 0,
  };
};

export const sanitizeLeaderboard = (parsed: any): EfficiencyRecord[] => {
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed
    .filter(item => item && typeof item === 'object' && !Array.isArray(item))
    .map(item => {
      const turns = Object.prototype.hasOwnProperty.call(item, 'turns') && typeof item.turns === 'number' && Number.isFinite(item.turns) ? item.turns : 999;
      const boardSize = Object.prototype.hasOwnProperty.call(item, 'boardSize') && typeof item.boardSize === 'string' ? item.boardSize.slice(0, 10) : 'unknown';
      const difficulty = Object.prototype.hasOwnProperty.call(item, 'difficulty') && ['easy', 'medium', 'hard', 'local'].includes(item.difficulty) ? item.difficulty : 'local';
      const date = Object.prototype.hasOwnProperty.call(item, 'date') && typeof item.date === 'string' ? item.date.slice(0, 30) : new Date().toLocaleDateString();
      return { turns, boardSize, difficulty, date } as EfficiencyRecord;
    })
    .slice(0, 10);
};

export function useGameStats() {
  const [stats, setStats] = useState<Stats>(() => {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      try {
        return sanitizeStats(JSON.parse(saved));
      } catch (e) {
        return DEFAULT_STATS;
      }
    }
    return DEFAULT_STATS;
  });

  const [leaderboard, setLeaderboard] = useState<EfficiencyRecord[]>(() => {
    const saved = localStorage.getItem(LEADERBOARD_KEY);
    if (saved) {
      try {
        return sanitizeLeaderboard(JSON.parse(saved));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  }, [leaderboard]);

  const recordWin = () => {
    setStats(prev => {
      const nextStreak = prev.currentStreak + 1;
      return {
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: prev.gamesWon + 1,
        currentStreak: nextStreak,
        highestStreak: Math.max(prev.highestStreak, nextStreak)
      };
    });
  };

  const recordLoss = () => {
    setStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      currentStreak: 0
    }));
  };

  const recordEfficiency = (turns: number, rows: number, cols: number, difficulty: AIDifficulty | 'local') => {
    const record: EfficiencyRecord = {
      turns,
      boardSize: `${rows}x${cols}`,
      difficulty,
      date: new Date().toLocaleDateString()
    };
    setLeaderboard(prev => {
      const updated = [...prev, record];
      // Sort by fewest turns to win first
      return updated.sort((a, b) => a.turns - b.turns).slice(0, 10);
    });
  };

  const resetStats = () => {
    setStats(DEFAULT_STATS);
    setLeaderboard([]);
  };

  return {
    stats,
    leaderboard,
    recordWin,
    recordLoss,
    recordEfficiency,
    resetStats
  };
}
