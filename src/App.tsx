/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flag, Bomb, RotateCcw, Timer, Settings2, Trophy, Skull } from 'lucide-react';

type Cell = {
  isMine: boolean;
  neighborMines: number;
  isRevealed: boolean;
  isFlagged: boolean;
  x: number;
  y: number;
};

type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export default function App() {
  // Settings
  const [cols, setCols] = useState(10);
  const [rows, setRows] = useState(10);
  const [mineCount, setMineCount] = useState(15);
  
  // Internal state for settings (before applying)
  const [tempCols, setTempCols] = useState(10);
  const [tempRows, setTempRows] = useState(10);
  const [tempMineCount, setTempMineCount] = useState(15);
  
  // Game State
  const [board, setBoard] = useState<Cell[][]>([]);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [flags, setFlags] = useState(0);
  const [time, setTime] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initBoard = useCallback((w: number, h: number, m: number) => {
    // Basic validation
    const actualMines = Math.min(m, w * h - 1);
    
    // Create empty board
    let newBoard: Cell[][] = [];
    for (let y = 0; y < h; y++) {
      let row: Cell[] = [];
      for (let x = 0; x < w; x++) {
        row.push({
          isMine: false,
          neighborMines: 0,
          isRevealed: false,
          isFlagged: false,
          x,
          y
        });
      }
      newBoard.push(row);
    }

    // Place mines
    let placed = 0;
    while (placed < actualMines) {
      const rx = Math.floor(Math.random() * w);
      const ry = Math.floor(Math.random() * h);
      if (!newBoard[ry][rx].isMine) {
        newBoard[ry][rx].isMine = true;
        placed++;
      }
    }

    // Calculate neighbor counts
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (newBoard[y][x].isMine) continue;
        
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (ny >= 0 && ny < h && nx >= 0 && nx < w && newBoard[ny][nx].isMine) {
              count++;
            }
          }
        }
        newBoard[y][x].neighborMines = count;
      }
    }

    setBoard(newBoard);
    setStatus('idle');
    setFlags(0);
    setTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    initBoard(cols, rows, mineCount);
  }, [cols, rows, mineCount, initBoard]);

  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const checkWin = (currentBoard: Cell[][]) => {
    let revealedCount = 0;
    for (let row of currentBoard) {
      for (let cell of row) {
        if (cell.isRevealed) revealedCount++;
      }
    }
    return revealedCount === (cols * rows - mineCount);
  };

  const revealCell = (x: number, y: number) => {
    if (status === 'won' || status === 'lost' || board[y][x].isRevealed || board[y][x].isFlagged) return;

    if (status === 'idle') {
      setStatus('playing');
      startTimer();
    }

    const newBoard = JSON.parse(JSON.stringify(board)) as Cell[][];
    
    if (newBoard[y][x].isMine) {
      // Game Over
      newBoard[y][x].isRevealed = true;
      // Reveal all mines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (newBoard[r][c].isMine) newBoard[r][c].isRevealed = true;
        }
      }
      setBoard(newBoard);
      setStatus('lost');
      stopTimer();
      return;
    }

    const floodReveal = (bx: number, by: number) => {
      if (bx < 0 || bx >= cols || by < 0 || by >= rows || newBoard[by][bx].isRevealed || newBoard[by][bx].isFlagged) return;
      
      newBoard[by][bx].isRevealed = true;
      
      if (newBoard[by][bx].neighborMines === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            floodReveal(bx + dx, by + dy);
          }
        }
      }
    };

    floodReveal(x, y);
    setBoard(newBoard);

    if (checkWin(newBoard)) {
      setStatus('won');
      stopTimer();
    }
  };

  const toggleFlag = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (status === 'won' || status === 'lost' || board[y][x].isRevealed) return;

    const newBoard = JSON.parse(JSON.stringify(board)) as Cell[][];
    newBoard[y][x].isFlagged = !newBoard[y][x].isFlagged;
    
    setBoard(newBoard);
    setFlags(f => newBoard[y][x].isFlagged ? f + 1 : f - 1);
  };

  const handleReset = () => {
    initBoard(cols, rows, mineCount);
  };

  const handleApplySettings = () => {
    setCols(tempCols);
    setRows(tempRows);
    setMineCount(tempMineCount);
    // initBoard is called via useEffect dependency
  };

  return (
    <div className="h-screen bg-[#0A0A0A] text-white flex flex-col font-sans overflow-hidden">
      {/* Header Section */}
      <header className="h-32 border-b border-white/10 flex items-center justify-between px-12 shrink-0">
        <h1 className="text-8xl font-black tracking-tighter leading-none select-none">
          {mineCount}<span className="text-[#C1FF00]">MINES</span>
        </h1>
        <div className="flex gap-12 text-right">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-1 font-mono">Session Time</p>
            <p className="text-4xl font-bold font-mono tracking-tight">
              {Math.floor(time / 60).toString().padStart(2, '0')}:{ (time % 60).toString().padStart(2, '0') }
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-1 font-mono">Flags Left</p>
            <p className="text-4xl font-bold font-mono text-[#C1FF00] tracking-tight">
              {Math.max(0, mineCount - flags).toString().padStart(3, '0')}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Controls */}
        <aside className="w-80 border-r border-white/10 p-12 flex flex-col shrink-0">
          <div className="space-y-12">
            <div className="group">
              <label className="text-[10px] uppercase tracking-[0.4em] text-[#C1FF00] font-bold block mb-4">Dimensions</label>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[9px] uppercase opacity-40 mb-2">Width</p>
                  <input 
                    type="number"
                    value={tempCols}
                    onChange={(e) => setTempCols(Math.max(5, Math.min(30, parseInt(e.target.value) || 5)))}
                    className="w-full text-3xl font-bold border-b-2 border-white/20 bg-transparent py-2 focus:border-[#C1FF00] outline-none transition-colors"
                  />
                </div>
                <div>
                  <p className="text-[9px] uppercase opacity-40 mb-2">Height</p>
                  <input 
                    type="number"
                    value={tempRows}
                    onChange={(e) => setTempRows(Math.max(5, Math.min(30, parseInt(e.target.value) || 5)))}
                    className="w-full text-3xl font-bold border-b-2 border-white/20 bg-transparent py-2 focus:border-[#C1FF00] outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.4em] text-[#C1FF00] font-bold block mb-4">Explosives</label>
              <input 
                type="number"
                value={tempMineCount}
                onChange={(e) => setTempMineCount(Math.max(1, Math.min(tempCols * tempRows - 1, parseInt(e.target.value) || 1)))}
                className="w-full text-3xl font-bold border-b-2 border-white/20 bg-transparent py-2 focus:border-[#C1FF00] outline-none transition-colors"
              />
              <p className="text-[9px] uppercase opacity-40 mt-3 font-mono">Mining Density: {((mineCount / (cols * rows)) * 100).toFixed(1)}%</p>
            </div>

            <button 
              onClick={handleApplySettings}
              className="w-full py-5 bg-[#C1FF00] text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-white transition-all active:scale-95 cursor-pointer shadow-lg shadow-[#C1FF00]/10"
            >
              Initialize Grid
            </button>
            
            <button 
              onClick={handleReset}
              className="w-full py-4 border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all cursor-pointer"
            >
              Reset Current Match
            </button>
          </div>

          <div className="mt-auto">
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 leading-relaxed font-mono">
              Click to clear.<br/>Right-click to flag.<br/>Avoid the blast.
            </p>
          </div>
        </aside>

        {/* Game Board Area */}
        <section className="flex-1 bg-[#111111] flex items-center justify-center p-12 relative overflow-auto">
          {/* Status Overlay */}
          <AnimatePresence>
            {(status === 'won' || status === 'lost') && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-[#0A0A0A]/80 backdrop-blur-md"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-[#1A1A1A] p-12 border border-white/10 shadow-2xl text-center max-w-md w-full relative"
                >
                  <div className={`w-24 h-24 mx-auto mb-8 flex items-center justify-center ${status === 'won' ? 'text-[#C1FF00]' : 'text-red-500'}`}>
                    {status === 'won' ? <Trophy size={64} strokeWidth={1.5} /> : <Skull size={64} strokeWidth={1.5} />}
                  </div>
                  <h2 className="text-5xl font-black mb-4 tracking-tighter uppercase italic">{status === 'won' ? 'Mission Success' : 'Fatal Anomaly'}</h2>
                  <p className="text-white/40 mb-10 font-mono text-[10px] uppercase tracking-[0.3em]">
                    {status === 'won' ? `Time: ${time}s // Sector Clear` : `Match Terminated at ${time}s`}
                  </p>
                  <button 
                    onClick={handleReset}
                    className="w-full bg-[#C1FF00] text-black font-black py-5 text-xs uppercase tracking-[0.2em] hover:bg-white transition-all active:scale-95"
                  >
                    Deploy Next Mission
                  </button>
                  
                  {/* Decorative edge line */}
                  <div className={`absolute top-0 left-0 w-1 h-full ${status === 'won' ? 'bg-[#C1FF00]' : 'bg-red-500'}`} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div 
            className="grid gap-1 bg-white/5 p-1 border border-white/10 shadow-3xl"
            style={{ 
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              width: 'fit-content'
            }}
          >
            {board.map((row, y) => (
              row.map((cell, x) => (
                <CellView 
                  key={`${x}-${y}`} 
                  cell={cell} 
                  onClick={() => revealCell(x, y)}
                  onContextMenu={(e) => toggleFlag(e, x, y)}
                />
              ))
            ))}
          </div>
        </section>
      </main>

      {/* Visual Footer Decoration */}
      <footer className="h-12 border-t border-white/10 flex items-center px-12 justify-between shrink-0">
        <div className="flex gap-8 opacity-30">
          <span className="text-[9px] uppercase font-mono tracking-[0.3em]">STATUS: {status.toUpperCase()}</span>
          <span className="text-[9px] uppercase font-mono tracking-[0.3em]">THREAT LEVEL: {mineCount > (cols * rows / 4) ? 'CRITICAL' : 'MODERATE'}</span>
          <span className="text-[9px] uppercase font-mono tracking-[0.3em]">CORE: V.4.2</span>
          <span id="busuanzi_container_site_pv" className="text-[9px] uppercase font-mono tracking-[0.3em]" style={{ display: 'none' }}>
            VIEWS: <span id="busuanzi_value_site_pv"></span>
          </span>
          <span id="busuanzi_container_site_uv" className="text-[9px] uppercase font-mono tracking-[0.3em]" style={{ display: 'none' }}>
            VISITORS: <span id="busuanzi_value_site_uv"></span>
          </span>
        </div>
        <div className="text-[9px] font-mono opacity-30 tracking-[0.2em] uppercase">
          PROTOCOL OVERRIDE: ACTIVE // GRID SIZE: {cols}X{rows}
        </div>
      </footer>
    </div>
  );
}

function CellView({ cell, onClick, onContextMenu }: { 
  cell: Cell, 
  onClick: () => void, 
  onContextMenu: (e: React.MouseEvent) => void,
}) {
  const getNumberColor = (num: number) => {
    switch (num) {
      case 1: return 'text-blue-400';
      case 2: return 'text-green-400';
      case 3: return 'text-red-400';
      case 4: return 'text-[#C1FF00]';
      case 5: return 'text-yellow-400';
      case 6: return 'text-cyan-400';
      case 7: return 'text-pink-400';
      case 8: return 'text-gray-400';
      default: return 'text-white/40';
    }
  };

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`
        w-10 h-10 flex items-center justify-center text-xl font-black cursor-pointer transition-all duration-75 select-none
        ${cell.isRevealed 
          ? (cell.isMine ? 'bg-red-500 text-black' : 'bg-white/5') 
          : 'bg-white/10 hover:bg-white/20 active:bg-white/30'}
      `}
    >
      {cell.isRevealed ? (
        cell.isMine ? (
          <Bomb size={24} />
        ) : (
          cell.neighborMines > 0 && (
            <span className={getNumberColor(cell.neighborMines)}>{cell.neighborMines}</span>
          )
        )
      ) : (
        cell.isFlagged && (
          <span className="text-[#C1FF00] text-sm group-hover:scale-110 transition-transform">🚩</span>
        )
      )}
    </div>
  );
}

