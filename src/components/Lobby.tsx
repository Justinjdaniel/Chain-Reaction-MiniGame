import React from 'react';
import { Player } from '../types/game';

interface LobbyProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  boardRows: number;
  setBoardRows: (r: number) => void;
  boardCols: number;
  setBoardCols: (c: number) => void;
  onStartGame: () => void;
  stats: any;
  leaderboard: any[];
  onResetStats: () => void;
}

const COLOR_PALETTE = [
  { name: 'Red', class: 'bg-neonRed text-neonRed', hex: '#ff0055', shadow: 'shadow-neon-red' },
  { name: 'Green', class: 'bg-neonGreen text-neonGreen', hex: '#00ff66', shadow: 'shadow-neon-green' },
  { name: 'Blue', class: 'bg-neonBlue text-neonBlue', hex: '#00f0ff', shadow: 'shadow-neon-blue' },
  { name: 'Yellow', class: 'bg-neonYellow text-neonYellow', hex: '#ffea00', shadow: 'shadow-neon-yellow' },
  { name: 'Purple', class: 'bg-neonPurple text-neonPurple', hex: '#d000ff', shadow: 'shadow-neon-purple' },
  { name: 'Orange', class: 'bg-neonOrange text-neonOrange', hex: '#ff8800', shadow: 'shadow-neon-orange' },
  { name: 'Pink', class: 'bg-neonPink text-neonPink', hex: '#ff00aa', shadow: 'shadow-neon-pink' },
  { name: 'Cyan', class: 'bg-neonCyan text-neonCyan', hex: '#00ffff', shadow: 'shadow-neon-cyan' },
];

export const Lobby: React.FC<LobbyProps> = ({
  players,
  setPlayers,
  boardRows,
  setBoardRows,
  boardCols,
  setBoardCols,
  onStartGame,
  stats,
  leaderboard,
  onResetStats
}) => {
  const addPlayer = () => {
    if (players.length >= 8) return;
    const nextId = players.length;
    const usedColors = players.map(p => p.color);
    const availableColor = COLOR_PALETTE.find(c => !usedColors.includes(c.hex)) || COLOR_PALETTE[nextId % COLOR_PALETTE.length];

    setPlayers([
      ...players,
      {
        id: nextId,
        name: `Player ${nextId + 1}`,
        color: availableColor.hex,
        type: 'human'
      }
    ]);
  };

  const removePlayer = (id: number) => {
    if (players.length <= 2) return;
    const updated = players.filter(p => p.id !== id).map((p, idx) => ({
      ...p,
      id: idx,
      name: p.name.startsWith('Player ') ? `Player ${idx + 1}` : p.name
    }));
    setPlayers(updated);
  };

  const updatePlayerType = (id: number, type: 'human' | 'ai') => {
    setPlayers(players.map(p => {
      if (p.id === id) {
        const defaultName = type === 'ai' ? 'AI Bot' : `Player ${id + 1}`;
        return {
          ...p,
          type,
          name: defaultName,
          difficulty: type === 'ai' ? 'medium' : undefined
        };
      }
      return p;
    }));
  };

  const updatePlayerDifficulty = (id: number, difficulty: 'easy' | 'medium' | 'hard') => {
    setPlayers(players.map(p => {
      if (p.id === id) {
        return { ...p, difficulty };
      }
      return p;
    }));
  };

  const updatePlayerColor = (id: number, color: string) => {
    setPlayers(players.map(p => {
      if (p.id === id) {
        return { ...p, color };
      }
      return p;
    }));
  };

  const updatePlayerName = (id: number, name: string) => {
    setPlayers(players.map(p => {
      if (p.id === id) {
        return { ...p, name };
      }
      return p;
    }));
  };

  const winRate = stats.gamesPlayed > 0 ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(0) : '0';

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-neonRed via-neonBlue to-neonGreen drop-shadow-lg uppercase">
          Chain Reaction
        </h1>
        <p className="text-sm text-slate-400 tracking-widest uppercase">Classic Cascade Strategy Game</p>
      </div>

      {/* Rules and Instructions Panel */}
      <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl space-y-3 shadow-inner">
        <h3 className="text-md font-bold text-neonBlue uppercase tracking-wider flex items-center gap-2">
          <span>🌌 REACTOR RULES & INSTRUCTIONS</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950/60 p-3 rounded border border-slate-800/60 space-y-1">
            <span className="font-bold text-neonRed uppercase">💥 Explosion Thresholds</span>
            <p>Each cell has a Critical Mass capacity determined by its location:</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400 font-mono mt-1">
              <li>Corners: Cap = 2 (explodes at 3 orbs)</li>
              <li>Edges: Cap = 3 (explodes at 4 orbs)</li>
              <li>Centers: Cap = 4 (explodes at 5 orbs)</li>
            </ul>
          </div>
          <div className="bg-slate-950/60 p-3 rounded border border-slate-800/60 space-y-1">
            <span className="font-bold text-neonGreen uppercase">🔄 Cascade Subtraction</span>
            <p>When a cell explodes, it loses its full critical mass capacity plus one orb (leaving 0 orbs behind in that cell).</p>
            <p className="text-slate-400 mt-1">Orbs are distributed orthogonally, converting opponent cells to your color!</p>
          </div>
          <div className="bg-slate-950/60 p-3 rounded border border-slate-800/60 space-y-1">
            <span className="font-bold text-neonYellow uppercase">💀 Early Victory Condition</span>
            <p>If all other players have 0 dots left on the board, the game ends immediately. No need to wait for further explosions to fill all cells.</p>
            <p className="text-slate-400 mt-1">Elimination check begins after each player has placed their first orb.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-200 border-b border-slate-800 pb-2 flex justify-between items-center">
              <span>BOARD DIMENSIONS</span>
              <span className="text-xs text-neonBlue font-mono">{boardRows} × {boardCols}</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Rows (Height)</label>
                <select
                  value={boardRows}
                  onChange={(e) => setBoardRows(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded p-2 focus:border-neonBlue focus:outline-none"
                >
                  {[5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                    <option key={n} value={n}>{n} Rows</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Columns (Width)</label>
                <select
                  value={boardCols}
                  onChange={(e) => setBoardCols(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded p-2 focus:border-neonBlue focus:outline-none"
                >
                  {[4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>{n} Columns</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h2 className="text-xl font-bold text-slate-200 uppercase">PLAYERS LOBBY</h2>
              <button
                onClick={addPlayer}
                disabled={players.length >= 8}
                className="px-3 py-1 bg-neonGreen/10 border border-neonGreen text-neonGreen text-xs rounded hover:bg-neonGreen/20 transition-all font-semibold"
              >
                + ADD PLAYER
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex flex-col sm:flex-row items-center justify-between p-3 bg-slate-950 border border-slate-800/80 rounded-lg gap-3"
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative group">
                      <div
                        className="w-6 h-6 rounded-full cursor-pointer border border-slate-700 hover:scale-110 transition-all shadow-inner"
                        style={{ backgroundColor: player.color }}
                      />
                      <div className="absolute left-0 mt-2 hidden group-hover:grid grid-cols-4 gap-1 p-2 bg-slate-900 border border-slate-700 rounded-lg z-20">
                        {COLOR_PALETTE.map(cp => (
                          <div
                            key={cp.hex}
                            onClick={() => updatePlayerColor(player.id, cp.hex)}
                            className="w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-all"
                            style={{ backgroundColor: cp.hex }}
                          />
                        ))}
                      </div>
                    </div>

                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) => updatePlayerName(player.id, e.target.value)}
                      className="bg-transparent border-b border-slate-800 hover:border-slate-700 focus:border-neonBlue focus:outline-none text-slate-200 text-sm font-semibold w-24 sm:w-32 py-0.5"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <select
                      value={player.type}
                      onChange={(e) => updatePlayerType(player.id, e.target.value as 'human' | 'ai')}
                      className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded px-2 py-1 focus:border-neonBlue focus:outline-none"
                    >
                      <option value="human">Human</option>
                      <option value="ai">AI Bot</option>
                    </select>

                    {player.type === 'ai' && (
                      <select
                        value={player.difficulty}
                        onChange={(e) => updatePlayerDifficulty(player.id, e.target.value as 'easy' | 'medium' | 'hard')}
                        className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded px-2 py-1 focus:border-neonBlue focus:outline-none"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard (Minimax)</option>
                      </select>
                    )}

                    {players.length > 2 && (
                      <button
                        onClick={() => removePlayer(player.id)}
                        className="p-1 bg-red-950/40 border border-red-800/60 text-red-400 text-xs rounded hover:bg-red-950/80 transition-all"
                        title="Remove Player"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-200 border-b border-slate-800 pb-2">PROFILE STATS</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-3 rounded border border-slate-900 text-center">
                <span className="block text-slate-500 text-xs font-mono uppercase">Played</span>
                <span className="text-2xl font-bold text-slate-200 font-mono">{stats.gamesPlayed}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded border border-slate-900 text-center">
                <span className="block text-slate-500 text-xs font-mono uppercase">Win Rate</span>
                <span className="text-2xl font-bold text-neonBlue font-mono">{winRate}%</span>
              </div>
              <div className="bg-slate-950 p-3 rounded border border-slate-900 text-center">
                <span className="block text-slate-500 text-xs font-mono uppercase">Streak</span>
                <span className="text-2xl font-bold text-neonGreen font-mono">{stats.currentStreak}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded border border-slate-900 text-center">
                <span className="block text-slate-500 text-xs font-mono uppercase">Max Streak</span>
                <span className="text-2xl font-bold text-neonYellow font-mono">{stats.highestStreak}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h2 className="text-xl font-bold text-slate-200 uppercase">LEADERBOARD</h2>
              {leaderboard.length > 0 && (
                <button
                  onClick={onResetStats}
                  className="text-[10px] text-red-400 hover:underline uppercase"
                >
                  Clear Stats
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {leaderboard.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4 uppercase font-semibold">No efficiency records yet</p>
              ) : (
                leaderboard.map((record, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-slate-950 border border-slate-900 rounded text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neonBlue">#{index + 1}</span>
                      <span className="text-slate-400 font-mono">{record.boardSize}</span>
                      <span className="text-slate-500 px-1 py-0.2 bg-slate-900 border border-slate-800 rounded text-[9px] uppercase font-bold">
                        {record.difficulty}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-neonGreen font-mono">{record.turns} Turns</span>
                      <span className="block text-[8px] text-slate-600">{record.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 text-center">
        <button
          onClick={onStartGame}
          className="w-full sm:w-2/3 py-4 bg-gradient-to-r from-neonBlue to-neonGreen text-slate-950 font-extrabold rounded-xl text-lg hover:brightness-110 active:scale-[0.99] transition-all tracking-widest shadow-lg uppercase"
        >
          ENTER THE REACTOR
        </button>
      </div>
    </div>
  );
};
