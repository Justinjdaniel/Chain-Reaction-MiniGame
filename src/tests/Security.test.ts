import { describe, it, expect } from 'vitest';
import { sanitizeStats, sanitizeLeaderboard } from '../hooks/useGameStats';

describe('Security Sanitization', () => {
  it('should successfully sanitize stats from malicious or malformed inputs', () => {
    // Malformed input (null/undefined/arrays)
    expect(sanitizeStats(null)).toEqual({
      gamesPlayed: 0,
      gamesWon: 0,
      highestStreak: 0,
      currentStreak: 0
    });

    expect(sanitizeStats([])).toEqual({
      gamesPlayed: 0,
      gamesWon: 0,
      highestStreak: 0,
      currentStreak: 0
    });

    // Prototype pollution attempt
    const maliciousPayload = JSON.parse('{"gamesPlayed": 42, "__proto__": {"polluted": true}}');
    const result = sanitizeStats(maliciousPayload);
    expect(result.gamesPlayed).toBe(42);
    expect((result as any).polluted).toBeUndefined();

    // Unexpected properties
    const extraProps = {
      gamesPlayed: 10,
      gamesWon: 5,
      highestStreak: 2,
      currentStreak: 1,
      extraMaliciousProperty: 'xss_payload'
    };
    const sanitized = sanitizeStats(extraProps);
    expect(sanitized).toEqual({
      gamesPlayed: 10,
      gamesWon: 5,
      highestStreak: 2,
      currentStreak: 1
    });
    expect((sanitized as any).extraMaliciousProperty).toBeUndefined();
  });

  it('should successfully sanitize and restrict leaderboard from malformed inputs', () => {
    // Malformed payload
    expect(sanitizeLeaderboard(null)).toEqual([]);
    expect(sanitizeLeaderboard({})).toEqual([]);

    // Malicious item with long strings and invalid types
    const badLeaderboard = [
      {
        turns: 12,
        boardSize: '9x6_extremely_long_board_size_to_cause_dos',
        difficulty: 'hard',
        date: '2023-10-10_extremely_long_date_to_cause_dos'
      },
      {
        turns: 'invalid_turns',
        boardSize: '5x5',
        difficulty: 'unsupported_difficulty',
        date: '2023-11-11'
      }
    ];

    const sanitized = sanitizeLeaderboard(badLeaderboard);
    expect(sanitized).toHaveLength(2);

    // Board size should be truncated
    expect(sanitized[0].boardSize).toBe('9x6_extrem');
    expect(sanitized[0].boardSize.length).toBeLessThanOrEqual(10);

    // Date should be truncated
    expect(sanitized[0].date).toBe('2023-10-10_extremely_long_date');
    expect(sanitized[0].date.length).toBeLessThanOrEqual(30);

    // Turn fallback
    expect(sanitized[1].turns).toBe(999);

    // Difficulty fallback
    expect(sanitized[1].difficulty).toBe('local');
  });
});
