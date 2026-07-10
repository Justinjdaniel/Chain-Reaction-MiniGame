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
    <div className="flex flex-col items-center justify-center p-4">
      <div className="mb-6 flex items-center gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl max-w-sm w-full shadow-lg">
        <div
          className="w-4 h-4 rounded-full animate-ping"
          style={{ backgroundColor: activePlayer?.color }}
        />
        <div className="flex-1">
          <p className="text-xs text-slate-500 font-semibold tracking-widest uppercase">CURRENT TURN</p>
          <p className="text-md font-bold text-slate-200 uppercase flex items-center justify-between">
            <span>{activePlayer?.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">
              {activePlayer?.type === 'ai' ? `AI (${activePlayer.difficulty})` : 'HUMAN'}
            </span>
          </p>
        </div>
      </div>

      <div className="relative p-2 md:p-3 bg-slate-950 border-2 border-slate-800 rounded-2xl shadow-[0_0_20px_rgba(15,23,42,0.8)] overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 blur-2xl pointer-events-none transition-all duration-500"
          style={{ background: activePlayer?.color }}
        />

        <div
          className="grid gap-1 md:gap-2 relative z-10"
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

              const isUnstable = cell.orbs === maxVal - 1;
              const borderGlow = cellOwner && isUnstable
                ? `1px solid ${cellOwner.color}`
                : '1px solid #1e293b';

              const shadowGlow = cellOwner && isUnstable
                ? `0 0 8px ${cellOwner.color}`
                : 'none';

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => onCellClick(r, c)}
                  disabled={isProcessing || (cell.player !== null && cell.player !== currentPlayer)}
                  style={{
                    border: borderGlow,
                    boxShadow: shadowGlow
                  }}
                  className={`
                    w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center relative transition-all duration-300 bg-slate-900/40 hover:bg-slate-900
                    disabled:cursor-not-allowed group overflow-hidden
                    ${isCellExploding ? 'scale-110 !border-red-500 bg-red-950/20 shadow-[0_0_15px_#ff0055] z-20' : ''}
                  `}
                >
                  <span className="absolute top-1 left-1 text-[8px] text-slate-700 font-mono pointer-events-none">
                    {r},{c}
                  </span>

                  {cell.orbs > 0 && cellOwner && (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {cell.orbs === 1 && (
                        <div
                          style={{ backgroundColor: cellOwner.color, boxShadow: `0 0 10px ${cellOwner.color}` }}
                          className="w-4 h-4 rounded-full animate-pulse transform hover:scale-110 transition-transform duration-300"
                        />
                      )}

                      {cell.orbs === 2 && (
                        <div className="flex gap-1 items-center justify-center">
                          <div
                            style={{ backgroundColor: cellOwner.color, boxShadow: `0 0 10px ${cellOwner.color}` }}
                            className="w-3.5 h-3.5 rounded-full animate-bounce"
                          />
                          <div
                            style={{ backgroundColor: cellOwner.color, boxShadow: `0 0 10px ${cellOwner.color}` }}
                            className="w-3.5 h-3.5 rounded-full animate-bounce [animation-delay:0.15s]"
                          />
                        </div>
                      )}

                      {cell.orbs === 3 && (
                        <div className="grid grid-cols-2 gap-1 items-center justify-center p-2">
                          <div
                            style={{ backgroundColor: cellOwner.color, boxShadow: `0 0 10px ${cellOwner.color}` }}
                            className="w-3 h-3 rounded-full animate-bounce"
                          />
                          <div
                            style={{ backgroundColor: cellOwner.color, boxShadow: `0 0 10px ${cellOwner.color}` }}
                            className="w-3 h-3 rounded-full animate-bounce [animation-delay:0.1s]"
                          />
                          <div
                            style={{ backgroundColor: cellOwner.color, boxShadow: `0 0 10px ${cellOwner.color}` }}
                            className="w-3 h-3 rounded-full col-span-2 mx-auto animate-bounce [animation-delay:0.2s]"
                          />
                        </div>
                      )}

                      {cell.orbs >= 4 && (
                        <div className="grid grid-cols-2 gap-0.5 items-center justify-center p-1.5 animate-spin duration-1000">
                          {Array.from({ length: Math.min(cell.orbs, 4) }).map((_, idx) => (
                            <div
                              key={idx}
                              style={{ backgroundColor: cellOwner.color, boxShadow: `0 0 10px ${cellOwner.color}` }}
                              className="w-2.5 h-2.5 rounded-full"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {!isProcessing && (cell.player === null || cell.player === currentPlayer) && (
                    <div
                      style={{ borderColor: activePlayer?.color }}
                      className="absolute inset-1.5 border border-dashed border-transparent rounded-lg opacity-0 group-hover:opacity-40 transition-opacity duration-200"
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
