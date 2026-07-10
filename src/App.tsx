import { useState, useEffect, useRef } from 'react';
import { Player, Cell } from './types/game';
import { Lobby } from './components/Lobby';
import { Board } from './components/Board';
import { ChainReactionEngine } from './utils/ChainReactionEngine';
import { ChainReactionAI } from './utils/ChainReactionAI';
import { useGameStats } from './hooks/useGameStats';

export function App() {
  const [inGame, setInGame] = useState(false);
  const [boardRows, setBoardRows] = useState(9);
  const [boardCols, setBoardCols] = useState(6);

  const [players, setPlayers] = useState<Player[]>([
    { id: 0, name: 'Player 1', color: '#ff0055', type: 'human' },
    { id: 1, name: 'AI Bot', color: '#00ff66', type: 'ai', difficulty: 'medium' }
  ]);

  const [grid, setGrid] = useState<Cell[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [explodingCells, setExplodingCells] = useState<{ r: number; c: number }[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);

  const engineRef = useRef<ChainReactionEngine | null>(null);

  const { stats, leaderboard, recordWin, recordLoss, recordEfficiency, resetStats } = useGameStats();

  const handleStartGame = () => {
    const engine = new ChainReactionEngine(boardRows, boardCols, players.length);
    engineRef.current = engine;
    setGrid(engine.cloneGridState());
    setCurrentPlayer(engine.currentPlayer);
    setWinner(null);
    setExplodingCells([]);
    setIsProcessing(false);
    setInGame(true);
  };

  const handleExitGame = () => {
    setInGame(false);
    setWinner(null);
    engineRef.current = null;
  };

  useEffect(() => {
    if (!inGame || winner || isProcessing || !engineRef.current) return;

    const activePlayer = players[currentPlayer];
    if (activePlayer && activePlayer.type === 'ai') {
      setIsProcessing(true);
      const timer = setTimeout(async () => {
        const engine = engineRef.current;
        if (!engine) return;

        const bestMove = ChainReactionAI.getBestMove(engine, currentPlayer, activePlayer.difficulty || 'medium');
        if (bestMove) {
          await handleCellMove(bestMove.r, bestMove.c);
        } else {
          engine.advanceTurn();
          setGrid(engine.cloneGridState());
          setCurrentPlayer(engine.currentPlayer);
          setIsProcessing(false);
        }
      }, 700);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inGame, currentPlayer, isProcessing, winner]);

  const handleCellMove = async (r: number, c: number) => {
    const engine = engineRef.current;
    if (!engine) return;

    setIsProcessing(true);

    const success = await engine.placeOrb(r, c, currentPlayer, async (snapshot) => {
      const exploding = [];
      for (let row = 0; row < engine.rows; row++) {
        for (let col = 0; col < engine.cols; col++) {
          if (engine.grid[row][col].orbs >= engine.grid[row][col].criticalMass + 1) {
            exploding.push({ r: row, c: col });
          }
        }
      }
      setExplodingCells(exploding);
      setGrid(snapshot);
      await new Promise(resolve => setTimeout(resolve, 350));
    });

    if (success) {
      setExplodingCells([]);
      setGrid(engine.cloneGridState());

      if (engine.checkGameOver()) {
        const winIdx = engine.getWinner();
        if (winIdx !== null) {
          const winningPlayer = players[winIdx];
          setWinner(winningPlayer);

          if (winningPlayer.type === 'human') {
            recordWin();
            const boardDiff = players.some(p => p.type === 'ai')
              ? (players.find(p => p.type === 'ai')?.difficulty || 'medium')
              : 'local';
            recordEfficiency(engine.turnCount, boardRows, boardCols, boardDiff);
          } else {
            recordLoss();
          }
        }
      } else {
        setCurrentPlayer(engine.currentPlayer);
      }
    }

    setIsProcessing(false);
  };

  const handleCellClick = async (r: number, c: number) => {
    if (isProcessing || winner) return;
    const activePlayer = players[currentPlayer];
    if (activePlayer.type === 'ai') return;

    await handleCellMove(r, c);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-neonBlue selection:text-slate-950">
      <header className="p-4 border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neonGreen animate-pulse shadow-neon-green" />
          <span className="font-mono text-sm tracking-widest font-bold uppercase text-slate-400">
            Chain Reaction PWA
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-semibold text-neonRed font-mono tracking-wider ml-1">
            v1.0.0
          </span>
        </div>

        {inGame && (
          <button
            onClick={handleExitGame}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-xs font-semibold uppercase tracking-wider transition-all"
          >
            ← Back to Lobby
          </button>
        )}
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        {!inGame ? (
          <Lobby
            players={players}
            setPlayers={setPlayers}
            boardRows={boardRows}
            setBoardRows={setBoardRows}
            boardCols={boardCols}
            setBoardCols={setBoardCols}
            onStartGame={handleStartGame}
            stats={stats}
            leaderboard={leaderboard}
            onResetStats={resetStats}
          />
        ) : (
          <div className="w-full max-w-4xl flex flex-col items-center gap-6">
            <Board
              grid={grid}
              currentPlayer={currentPlayer}
              players={players}
              onCellClick={handleCellClick}
              isProcessing={isProcessing}
              explodingCells={explodingCells}
            />

            {winner && (
              <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-50 p-4">
                <div
                  style={{ borderColor: winner.color }}
                  className="max-w-md w-full bg-slate-900 border-2 p-8 rounded-2xl text-center space-y-6 shadow-2xl"
                >
                  <h2 className="text-4xl font-extrabold uppercase tracking-widest text-slate-100">
                    VICTORY!
                  </h2>
                  <div className="flex justify-center">
                    <div
                      style={{ backgroundColor: winner.color }}
                      className="w-16 h-16 rounded-full flex items-center justify-center font-black text-slate-950 text-xl shadow-lg"
                    >
                      🏆
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold uppercase" style={{ color: winner.color }}>
                      {winner.name}
                    </p>
                    <p className="text-xs text-slate-500 uppercase font-semibold mt-1">
                      has claimed ultimate dominance over the reactor!
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      onClick={handleStartGame}
                      className="py-3 bg-neonGreen text-slate-950 font-bold rounded-lg hover:brightness-110 uppercase text-xs tracking-wider font-extrabold transition-all"
                    >
                      ⚡ REMATCH ⚡
                    </button>
                    <button
                      onClick={handleExitGame}
                      className="py-3 bg-slate-950 border border-slate-800 text-slate-400 font-bold rounded-lg hover:text-slate-200 uppercase text-xs tracking-wider transition-all"
                    >
                      Exit to Lobby
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="p-4 border-t border-slate-900 text-center text-[10px] font-mono text-slate-600 uppercase tracking-widest bg-slate-950">
        © CHAIN REACTION ENGINE v1.0.0 • LOCAL-FIRST • OFFLINE CAPABLE PWA
      </footer>
    </div>
  );
}
