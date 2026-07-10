import React from 'react';
import { Cell, Player } from '../types/game';

interface BoardProps {
  grid: Cell[][];
  currentPlayer: number;
  players: Player[];
  onCellClick: (r: number, c: number) => void;
  isProcessing: boolean;
  explodingCells: { r: number; c: number }[];
}

export const Board: React.FC<BoardProps> = ({
  grid,
  currentPlayer,
  players,
  onCellClick,
  isProcessing,
  explodingCells
}) => {
  const activePlayer = players[currentPlayer];

  return (
    <div className="flex flex-col items-center justify-center p-2 md:p-4 w-full" role="region" aria-label="Game Board and Status">
      {/* Top Status Console Header */}
      <div
        className="mb-6 bg-slate-950/95 border-2 rounded-2xl p-4 max-w-md w-full shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur relative overflow-hidden transition-all duration-500"
        style={{ borderColor: `${activePlayer?.color}40`, boxShadow: `0 0 25px ${activePlayer?.color}15` }}
        aria-live="polite"
        role="status"
      >
        {/* Holographic scanner laser line */}
        <div
          className="absolute left-0 right-0 h-[1px] opacity-25 top-0 bg-gradient-to-r from-transparent via-white to-transparent"
          style={{
            animation: 'scan-down 3s infinite linear',
            background: `linear-gradient(to right, transparent, ${activePlayer?.color}, transparent)`
          }}
        />

        <div className="flex items-center gap-4 relative z-10">
          {/* Active Player Status Ring */}
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl border border-slate-900 bg-slate-900/60 overflow-hidden">
            <div
              className="absolute inset-0.5 rounded-lg opacity-25"
              style={{ backgroundColor: activePlayer?.color }}
            />
            <div
              className="w-4 h-4 rounded-full relative z-10 animate-pulse"
              style={{
                backgroundColor: activePlayer?.color,
                boxShadow: `0 0 15px ${activePlayer?.color}, 0 0 30px ${activePlayer?.color}`
              }}
              aria-hidden="true"
            />
            {/* Corner tech angles inside the miniature dashboard */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-slate-700" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-slate-700" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase font-mono">
                REACTOR OPERATOR
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: activePlayer?.color }} />
                <span
                  className="text-[9px] font-mono font-black tracking-widest px-2 py-0.5 rounded border uppercase"
                  style={{
                    borderColor: `${activePlayer?.color}50`,
                    color: activePlayer?.color,
                    backgroundColor: `${activePlayer?.color}08`
                  }}
                >
                  {activePlayer?.type === 'ai' ? `AI (${activePlayer.difficulty})` : 'PILOT'}
                </span>
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <p className="text-lg font-black text-slate-100 uppercase truncate font-gaming tracking-wide">
                {activePlayer?.name}
              </p>

              <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase shrink-0">
                {isProcessing ? (
                  <span className="text-neonYellow animate-pulse font-bold flex items-center gap-1">
                    <svg className="animate-spin h-3.5 w-3.5 text-neonYellow" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    PROCESSING...
                  </span>
                ) : (
                  <span className="text-neonGreen font-bold">YOUR MOVE</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Reactor Board Container */}
      <div
        className="relative p-3 md:p-5 bg-slate-950 border-2 border-slate-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden tech-grid-fine transition-all duration-500"
        style={{ boxShadow: `0 0 40px ${activePlayer?.color}05, 0 20px 50px rgba(0,0,0,0.9)` }}
        role="grid"
        aria-label="Reactor grid"
      >
        {/* Subtle ambient light source */}
        <div
          className="absolute inset-0 opacity-10 blur-[80px] pointer-events-none transition-all duration-700"
          style={{ background: `radial-gradient(circle, ${activePlayer?.color} 0%, transparent 70%)` }}
        />

        <div
          className="grid gap-1.5 md:gap-2.5 relative z-10"
          style={{
            gridTemplateRows: `repeat(${grid.length}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${grid[0]?.length || 6}, minmax(0, 1fr))`
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const cellOwner = cell.player !== null ? players[cell.player] : null;
              const isCellExploding = explodingCells.some(ec => ec.r === r && ec.c === c);
              const maxVal = cell.criticalMass;

              const isUnstable = cell.orbs === maxVal;
              const borderGlow = cellOwner && isUnstable
                ? `2px solid ${cellOwner.color}`
                : cellOwner
                ? `1px solid ${cellOwner.color}40`
                : '1px solid #1e293b50';

              const shadowGlow = cellOwner && isUnstable
                ? `0 0 15px ${cellOwner.color}40, inset 0 0 8px ${cellOwner.color}20`
                : 'none';

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => onCellClick(r, c)}
                  disabled={isProcessing || (cell.player !== null && cell.player !== currentPlayer)}
                  aria-label={`Cell at Row ${r + 1}, Column ${c + 1}. ${cell.orbs === 0 ? 'Empty' : `${cell.orbs} orb${cell.orbs > 1 ? 's' : ''} owned by ${cellOwner?.name || 'unknown player'}`}. Critical mass capacity is ${maxVal}.`}
                  style={{
                    border: borderGlow,
                    boxShadow: shadowGlow
                  }}
                  className={`
                    w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center relative transition-all duration-300 bg-slate-900/30 hover:bg-slate-900/80
                    disabled:cursor-not-allowed group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neonBlue
                    ${isCellExploding ? 'scale-110 !border-red-500 bg-red-950/30 shadow-[0_0_20px_#ff0055] z-20 animate-pulse' : ''}
                  `}
                >
                  {/* Digital Coordinate Labels */}
                  <span className="absolute top-0.5 left-1 text-[6px] sm:text-[7px] text-slate-750 font-mono pointer-events-none font-bold" aria-hidden="true">
                    {r},{c}
                  </span>

                  {cell.orbs > 0 && cellOwner && (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Ambient Energy Glow inside the Cell */}
                      <div
                        className="absolute w-6 h-6 rounded-full blur-md opacity-35 pointer-events-none transition-all"
                        style={{ backgroundColor: cellOwner.color }}
                      />

                      {/* Rendering Orbs with dynamic quantum styling */}
                      {cell.orbs === 1 && (
                        <div
                          style={{
                            backgroundColor: cellOwner.color,
                            boxShadow: `0 0 12px ${cellOwner.color}, 0 0 24px ${cellOwner.color}80, inset -2px -2px 4px rgba(0,0,0,0.4)`
                          }}
                          className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full animate-pulse transform hover:scale-110 transition-transform duration-300 relative"
                        >
                          {/* Highlight reflection */}
                          <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white/40 rounded-full" />
                        </div>
                      )}

                      {cell.orbs === 2 && (
                        cell.criticalMass === 2 ? (
                          // Corner unstable: spin 2 orbs rapidly
                          <div className="flex gap-1 items-center justify-center animate-spin duration-1000">
                            <div
                              style={{
                                backgroundColor: cellOwner.color,
                                boxShadow: `0 0 10px ${cellOwner.color}, inset -1px -1px 3px rgba(0,0,0,0.4)`
                              }}
                              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full relative"
                            >
                              <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white/40 rounded-full" />
                            </div>
                            <div
                              style={{
                                backgroundColor: cellOwner.color,
                                boxShadow: `0 0 10px ${cellOwner.color}, inset -1px -1px 3px rgba(0,0,0,0.4)`
                              }}
                              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full relative"
                            >
                              <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white/40 rounded-full" />
                            </div>
                          </div>
                        ) : (
                          // Normal 2 orbs: springy bounce
                          <div className="flex gap-1 items-center justify-center">
                            <div
                              style={{
                                backgroundColor: cellOwner.color,
                                boxShadow: `0 0 8px ${cellOwner.color}, inset -1px -1px 3px rgba(0,0,0,0.4)`
                              }}
                              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full animate-bounce relative"
                            />
                            <div
                              style={{
                                backgroundColor: cellOwner.color,
                                boxShadow: `0 0 8px ${cellOwner.color}, inset -1px -1px 3px rgba(0,0,0,0.4)`
                              }}
                              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full animate-bounce [animation-delay:0.15s] relative"
                            />
                          </div>
                        )
                      )}

                      {cell.orbs === 3 && (
                        cell.criticalMass === 3 ? (
                          // Edge unstable: high speed spin 3 orbs
                          <div className="grid grid-cols-2 gap-0.5 sm:gap-1 items-center justify-center p-1 animate-spin duration-1000">
                            <div
                              style={{
                                backgroundColor: cellOwner.color,
                                boxShadow: `0 0 8px ${cellOwner.color}, inset -1px -1px 3px rgba(0,0,0,0.4)`
                              }}
                              className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full relative animate-pulse"
                            />
                            <div
                              style={{
                                backgroundColor: cellOwner.color,
                                boxShadow: `0 0 8px ${cellOwner.color}, inset -1px -1px 3px rgba(0,0,0,0.4)`
                              }}
                              className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full relative animate-pulse"
                            />
                            <div
                              style={{
                                backgroundColor: cellOwner.color,
                                boxShadow: `0 0 8px ${cellOwner.color}, inset -1px -1px 3px rgba(0,0,0,0.4)`
                              }}
                              className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full col-span-2 mx-auto relative animate-pulse"
                            />
                          </div>
                        ) : (
                          // Normal 3 orbs: double bounce waves
                          <div className="grid grid-cols-2 gap-0.5 sm:gap-1 items-center justify-center p-1">
                            <div
                              style={{
                                backgroundColor: cellOwner.color,
                                boxShadow: `0 0 8px ${cellOwner.color}, inset -1px -1px 3px rgba(0,0,0,0.4)`
                              }}
                              className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full animate-bounce relative"
                            />
                            <div
                              style={{
                                backgroundColor: cellOwner.color,
                                boxShadow: `0 0 8px ${cellOwner.color}, inset -1px -1px 3px rgba(0,0,0,0.4)`
                              }}
                              className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full animate-bounce [animation-delay:0.1s] relative"
                            />
                            <div
                              style={{
                                backgroundColor: cellOwner.color,
                                boxShadow: `0 0 8px ${cellOwner.color}, inset -1px -1px 3px rgba(0,0,0,0.4)`
                              }}
                              className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full col-span-2 mx-auto animate-bounce [animation-delay:0.2s] relative"
                            />
                          </div>
                        )
                      )}

                      {cell.orbs >= 4 && (
                        <div className={`grid grid-cols-2 gap-0.5 sm:gap-1 items-center justify-center p-0.5 ${cell.orbs === cell.criticalMass ? 'animate-spin duration-1000' : ''}`}>
                          {Array.from({ length: Math.min(cell.orbs, 4) }).map((_, idx) => (
                            <div
                              key={idx}
                              style={{
                                backgroundColor: cellOwner.color,
                                boxShadow: `0 0 8px ${cellOwner.color}, inset -0.5px -0.5px 2px rgba(0,0,0,0.4)`
                              }}
                              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full relative animate-pulse"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cell placement hover guidelines */}
                  {!isProcessing && (cell.player === null || cell.player === currentPlayer) && (
                    <div
                      style={{ borderColor: activePlayer?.color }}
                      className="absolute inset-1 border border-dashed border-transparent rounded-xl opacity-0 group-hover:opacity-60 group-focus:opacity-60 transition-opacity duration-200"
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
