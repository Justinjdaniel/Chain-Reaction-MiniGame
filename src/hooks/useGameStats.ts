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

export function useGameStats() {
  const [stats, setStats] = useState<Stats>(() => {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
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
        return JSON.parse(saved);
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
