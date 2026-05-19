import { useState, useEffect, useRef } from 'react';

// list of 20 mini games
const GAMES = [
  { id: 'snake',   name: 'Neon Snake 🐍', desc: 'Classic canvas snake. Eat code node bytes and grow.', category: 'Canvas' },
  { id: 'memory',  name: 'Code Memory 🎴', desc: 'Flip and match programming language cards.', category: 'Puzzle' },
  { id: 'flappy',  name: 'Flappy Neon 🚀', desc: 'Navigate high-voltage energy barriers in a canvas rocket.', category: 'Canvas' },
  { id: 'clicker', name: 'Retro Clicker 💻', desc: 'Compile bytes, purchase RAM, and hire AI helper scripts.', category: 'Idle' },
  { id: 'duel',    name: 'Code Duel ⚔️', desc: 'Engage in a classic Tic-Tac-Toe battle against the Nexus AI.', category: 'Strategy' },
  { id: 'pong',    name: 'Cyberpunk Pong 🏓', desc: 'Classic neon arcade bounce-back against a clever bot.', category: 'Canvas' },
  { id: 'color',   name: 'Color Catch 🔴', desc: 'Catch falling drops into matching buckets.', category: 'Reaction' },
  { id: 'scramble',name: 'Word Scramble 🔠', desc: 'Unscramble coding terms under a ticking clock.', category: 'Word' },
  { id: 'math',    name: 'Math Rush ➕', desc: 'Solve rapid arithmetic equations in 4 seconds.', category: 'Logic' },
  { id: 'reflex',  name: 'Reflex Tester ⚡', desc: 'Click as fast as possible when the screen turns Neon Green!', category: 'Reaction' },
  { id: 'guess',   name: 'Number Guesser 🎲', desc: 'Guess the secret number between 1 and 50.', category: 'Logic' },
  { id: 'simon',   name: 'Simon Glow 💡', desc: 'Memorize and reproduce the sequence of flashing lights.', category: 'Puzzle' },
  { id: 'typing',  name: 'Keyboard Speed ⌨️', desc: 'Type displayed strings as fast as possible.', category: 'Skill' },
  { id: 'rps',     name: 'Code-R-P-S ✊', desc: 'Play Rock-Paper-Scissors against the AI generator.', category: 'Luck' },
  { id: 'flip',    name: 'Aesthetic Flip 🪙', desc: 'Bet your coins on a heads/tails double-or-nothing streak.', category: 'Luck' },
  { id: 'binary',  name: 'Binary Speedrun 🔢', desc: 'Convert decimal numbers to binary under a timer.', category: 'Logic' },
  { id: 'hex',     name: 'Hex Matcher 🎨', desc: 'Adjust R-G-B sliders to match the secret HEX color.', category: 'Design' },
  { id: 'tone',    name: 'Pitch Memory 🎵', desc: 'Follow the musical patterns and match the frequencies.', category: 'Audio' },
  { id: 'trivia',  name: 'CS Trivia 💡', desc: 'A quick fire multiple choice computing trivia deck.', category: 'Trivia' },
  { id: 'stack',   name: 'Blox Stacker 🧱', desc: 'Stack moving blocks on top of each other exactly.', category: 'Skill' }
];

export default function ChillZoneView() {
  const [activeGame, setActiveGame] = useState('menu');
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('nexus_coins') || '100'));

  const rewardCoins = (amount) => {
    setCoins(prev => {
      const next = prev + amount;
      localStorage.setItem('nexus_coins', next.toString());
      return next;
    });
  };

  const spendCoins = (amount) => {
    if (coins < amount) return false;
    setCoins(prev => {
      const next = prev - amount;
      localStorage.setItem('nexus_coins', next.toString());
      return next;
    });
    return true;
  };

  return (
    <div className="view" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="page-header" style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <div className="page-eyebrow">Aesthetic Space · Study Breaks</div>
          <h1 className="page-title">🕹️ Arcade Chill Zone</h1>
          <p className="page-subtitle">Recharge your brain with 20 premium mini-games and earn ByteCoins!</p>
        </div>
        
        {/* Wallet Balance */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,140,0,0.1))',
          border: '1px solid rgba(255,215,0,0.3)', padding: '10px 20px', borderRadius: 16,
          display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 0 15px rgba(255,215,0,0.15)'
        }}>
          <span style={{ fontSize: 24 }}>🪙</span>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>BYTECOINS</span>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--yellow)', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>{coins}</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {activeGame === 'menu' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, width: '100%', padding: '10px 0 40px' }}>
            {GAMES.map(g => (
              <div 
                key={g.id} 
                className="card clickable" 
                style={{ 
                  padding: 20, display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid var(--border)',
                  background: 'linear-gradient(135deg, var(--cyan-dim), var(--purple-dim))'
                }}
                onClick={() => setActiveGame(g.id)}
              >
                <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', textTransform: 'uppercase' }}>{g.category}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>+20 🪙</span>
                </div>
                <h3 style={{ color: 'var(--text-bright)', fontSize: 16, fontWeight: 800, margin: 0 }}>{g.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.4, flexGrow: 1, margin: 0 }}>{g.desc}</p>
                <button className="btn btn-ghost" style={{ width: '100%', fontSize: 11, padding: '6px' }}>Launch Game</button>
              </div>
            ))}
          </div>
        )}

        {/* 20 Game Viewports */}
        {activeGame === 'snake' && <SnakeGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
        {activeGame === 'memory' && <MemoryGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
        {activeGame === 'flappy' && <FlappyGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
        {activeGame === 'clicker' && <ClickerGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
        {activeGame === 'duel' && <DuelGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
        {activeGame === 'pong' && <PongGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
        {activeGame === 'color' && <ColorCatchGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
        {activeGame === 'scramble' && <ScrambleGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
        {activeGame === 'math' && <MathGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
        {activeGame === 'reflex' && <ReflexGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
        {activeGame === 'guess' && <GuessGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
        {activeGame === 'simon' && <SimonGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
        {activeGame === 'typing' && <TypingGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
        {activeGame === 'rps' && <RPSGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
        {activeGame === 'flip' && <FlipGame onBack={() => setActiveGame('menu')} coins={coins} spendCoins={spendCoins} onReward={rewardCoins} />}
        {activeGame === 'binary' && <BinaryGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
        {activeGame === 'hex' && <HexGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
        {activeGame === 'tone' && <ToneGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
        {activeGame === 'trivia' && <TriviaGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
        {activeGame === 'stack' && <StackGame onBack={() => setActiveGame('menu')} onReward={rewardCoins} />}
      </div>
    </div>
  );
}

// ── 1. NEON SNAKE ──
function SnakeGame({ onBack, onReward }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const grid = 20; let count = 0;
    let snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [{x:160, y:160}], maxCells: 4 };
    let apple = { x: 320, y: 320 };
    let localScore = 0; let localGameOver = false;

    function resetApple() {
      apple.x = Math.floor(Math.random() * 20) * grid;
      apple.y = Math.floor(Math.random() * 20) * grid;
    }
    
    let animationFrameId;
    function loop() {
      if (localGameOver) return;
      animationFrameId = requestAnimationFrame(loop);
      if (++count < 6) return;
      count = 0;
      ctx.clearRect(0,0,canvas.width,canvas.height);

      snake.x += snake.dx; snake.y += snake.dy;
      if (snake.x < 0) snake.x = canvas.width - grid; else if (snake.x >= canvas.width) snake.x = 0;
      if (snake.y < 0) snake.y = canvas.height - grid; else if (snake.y >= canvas.height) snake.y = 0;

      snake.cells.unshift({x: snake.x, y: snake.y});
      if (snake.cells.length > snake.maxCells) snake.cells.pop();

      ctx.fillStyle = '#ff7043'; ctx.shadowBlur = 10; ctx.shadowColor = '#ff7043';
      ctx.fillRect(apple.x + 2, apple.y + 2, grid - 4, grid - 4);

      ctx.fillStyle = '#00e5ff'; ctx.shadowColor = '#00e5ff';
      snake.cells.forEach(function(cell, index) {
        ctx.fillRect(cell.x + 1, cell.y + 1, grid - 2, grid - 2);
        if (cell.x === apple.x && cell.y === apple.y) {
          snake.maxCells++;
          localScore += 10; setScore(localScore);
          onReward(5); // +5 ByteCoins per apple!
          resetApple();
        }
        for (let i = index + 1; i < snake.cells.length; i++) {
          if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
            localGameOver = true; setGameOver(true);
            onReward(10); // Completion bonus
          }
        }
      });
      ctx.shadowBlur = 0;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && snake.dx === 0) { snake.dx = -grid; snake.dy = 0; }
      else if (e.key === 'ArrowUp' && snake.dy === 0) { snake.dy = -grid; snake.dx = 0; }
      else if (e.key === 'ArrowRight' && snake.dx === 0) { snake.dx = grid; snake.dy = 0; }
      else if (e.key === 'ArrowDown' && snake.dy === 0) { snake.dy = grid; snake.dx = 0; }
    };
    window.addEventListener('keydown', handleKeyDown);
    animationFrameId = requestAnimationFrame(loop);
    return () => { window.removeEventListener('keydown', handleKeyDown); cancelAnimationFrame(animationFrameId); };
  }, [gameOver]);

  return (
    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>Score: {score}</span>
      </div>
      <canvas ref={canvasRef} width={400} height={400} style={{ background: '#0b0f19', borderRadius: 12, border: '2px solid var(--border)' }} />
      {gameOver && <button className="btn btn-cyan" onClick={() => setGameOver(false)}>Try Again</button>}
    </div>
  );
}

// ── 2. CODE MEMORY ──
function MemoryGame({ onBack, onReward }) {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const double = [...CARD_ICONS, ...CARD_ICONS].map((icon, i) => ({ id: i, icon })).sort(() => Math.random() - 0.5);
    setCards(double);
  }, []);

  const clickCard = (c) => {
    if (selected.length === 2 || matched.includes(c.id) || selected.some(s => s.id === c.id)) return;
    const next = [...selected, c]; setSelected(next);
    if (next.length === 2) {
      setMoves(m => m + 1);
      if (next[0].icon === next[1].icon) {
        setMatched(m => [...m, next[0].id, next[1].id]);
        setSelected([]);
        onReward(10); // +10 ByteCoins for pair match!
      } else {
        setTimeout(() => setSelected([]), 800);
      }
    }
  };

  return (
    <div className="card" style={{ padding: 24, maxWidth: 450, width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <span style={{ fontFamily: 'var(--font-mono)' }}>Moves: {moves}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {cards.map(c => {
          const visible = selected.some(s => s.id === c.id) || matched.includes(c.id);
          return (
            <div key={c.id} onClick={() => clickCard(c)} style={{
              aspectRatio: '1', borderRadius: 12, background: visible ? 'var(--card2)' : 'linear-gradient(135deg, var(--cyan-dim), var(--purple-dim))',
              border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, cursor: 'pointer'
            }}>{visible ? c.icon : '❓'}</div>
          );
        })}
      </div>
      {matched.length === cards.length && cards.length > 0 && <button className="btn btn-purple" onClick={onBack}>Finish</button>}
    </div>
  );
}

// ── 3. FLAPPY NEON ──
function FlappyGame({ onBack, onReward }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rocket = { y: 200, velocity: 0, gravity: 0.35, jump: -6.5, radius: 11 };
    let pipes = []; let frames = 0; let localScore = 0; let localGameOver = false;

    let id;
    function loop() {
      if (localGameOver) return;
      id = requestAnimationFrame(loop);
      ctx.clearRect(0,0,canvas.width,canvas.height);

      rocket.velocity += rocket.gravity; rocket.y += rocket.velocity;

      ctx.fillStyle = '#a855f7'; ctx.shadowBlur = 10; ctx.shadowColor = '#a855f7';
      ctx.beginPath(); ctx.arc(80, rocket.y, rocket.radius, 0, Math.PI * 2); ctx.fill();

      if (rocket.y < 0 || rocket.y > canvas.height) { localGameOver = true; setGameOver(true); onReward(5); }

      if (frames % 90 === 0) {
        let topHeight = Math.random() * 150 + 50;
        pipes.push({ x: canvas.width, top: topHeight, bottom: canvas.height - topHeight - 110, passed: false });
      }

      ctx.fillStyle = '#00e5ff'; ctx.shadowColor = '#00e5ff';
      pipes.forEach(p => {
        p.x -= 2;
        ctx.fillRect(p.x, 0, 40, p.top);
        ctx.fillRect(p.x, canvas.height - p.bottom, 40, p.bottom);

        if (!p.passed && p.x + 40 < 80) {
          p.passed = true; localScore++; setScore(localScore);
          onReward(8); // +8 ByteCoins per pipe!
        }
        if (80 + rocket.radius > p.x && 80 - rocket.radius < p.x + 40 && (rocket.y - rocket.radius < p.top || rocket.y + rocket.radius > canvas.height - p.bottom)) {
          localGameOver = true; setGameOver(true); onReward(5);
        }
      });
      pipes = pipes.filter(p => p.x + 40 > 0);
      frames++; ctx.shadowBlur = 0;
    }
    const jump = () => { rocket.velocity = rocket.jump; };
    canvas.addEventListener('click', jump);
    id = requestAnimationFrame(loop);
    return () => { canvas?.removeEventListener('click', jump); cancelAnimationFrame(id); };
  }, [gameOver]);

  return (
    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--purple)' }}>Score: {score}</span>
      </div>
      <canvas ref={canvasRef} width={400} height={400} style={{ background: '#0b0f19', borderRadius: 12, border: '2px solid var(--border)' }} />
      {gameOver && <button className="btn btn-cyan" onClick={() => setGameOver(false)}>Try Again</button>}
    </div>
  );
}

// ── 4. RETRO CLICKER ──
function ClickerGame({ onBack, onReward }) {
  const [clicks, setClicks] = useState(0);
  const click = () => {
    setClicks(c => c + 1);
    if ((clicks + 1) % 15 === 0) onReward(10); // +10 ByteCoins for every 15 compiles!
  };
  return (
    <div className="card" style={{ padding: 30, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ alignSelf: 'flex-start' }}>← Back</button>
      <h3 style={{ color: 'var(--text-bright)' }}>Bytes Clicker</h3>
      <div style={{ fontSize: 44, fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>{clicks}</div>
      <div 
        onClick={click}
        style={{ width: 130, height: 130, borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), var(--purple))', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, boxShadow: '0 0 20px var(--cyan-glow)' }}
      >💻</div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Click compile to earn passive coins!</p>
    </div>
  );
}

// ── 5. CODE DUEL ──
function DuelGame({ onBack, onReward }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  const checkWin = (b) => {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let w of wins) {
      if (b[w[0]] && b[w[0]] === b[w[1]] && b[w[0]] === b[w[2]]) return b[w[0]];
    }
    return b.includes(null) ? null : 'Tie';
  };

  const clickCell = (idx) => {
    if (board[idx] || winner || !turn) return;
    const next = [...board]; next[idx] = 'X'; setBoard(next);
    const win = checkWin(next);
    if (win) {
      setWinner(win); if (win === 'X') onReward(25); // +25 ByteCoins for beating AI!
    } else {
      setTurn(false);
      setTimeout(() => {
        const empties = next.map((c, i) => c === null ? i : null).filter(v => v !== null);
        if (empties.length > 0) {
          const choice = empties[Math.floor(Math.random() * empties.length)];
          next[choice] = 'O'; setBoard(next);
          const aiWin = checkWin(next);
          if (aiWin) setWinner(aiWin); else setTurn(true);
        }
      }, 500);
    }
  };

  return (
    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ alignSelf: 'flex-start' }}>← Back</button>
      <h3 style={{ color: 'var(--text-bright)' }}>AI Code Duel</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, width: 240, height: 240 }}>
        {board.map((v, i) => (
          <button key={i} onClick={() => clickCell(i)} style={{ background: 'var(--surface)', border: '1px solid var(--border-hi)', fontSize: 24, cursor: 'pointer', borderRadius: 8 }}>{v}</button>
        ))}
      </div>
      {winner && <button className="btn btn-cyan" onClick={() => { setBoard(Array(9).fill(null)); setWinner(null); setTurn(true); }}>Reset</button>}
    </div>
  );
}

// ── 6. PONG GAME ──
function PongGame({ onBack, onReward }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let ball = { x: 200, y: 200, dx: 3, dy: 3, r: 8 };
    let playerY = 150; let compY = 150;
    let localScore = 0; let active = true;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      playerY = e.clientY - rect.top - 40;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    let id;
    function loop() {
      if (!active) return;
      id = requestAnimationFrame(loop);
      ctx.clearRect(0,0,canvas.width,canvas.height);

      // Ball move
      ball.x += ball.dx; ball.y += ball.dy;
      if (ball.y < 0 || ball.y > canvas.height) ball.dy *= -1;

      // Computer AI
      compY += (ball.y - (compY + 40)) * 0.12;

      // Draw Paddles
      ctx.fillStyle = '#00e5ff'; ctx.fillRect(10, playerY, 10, 80);
      ctx.fillStyle = '#a855f7'; ctx.fillRect(canvas.width - 20, compY, 10, 80);

      // Draw Ball
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();

      // Collisions
      if (ball.x < 20 && ball.y > playerY && ball.y < playerY + 80) {
        ball.dx *= -1.1; localScore++; setScore(localScore); onReward(5);
      }
      if (ball.x > canvas.width - 20 && ball.y > compY && ball.y < compY + 80) {
        ball.dx *= -1;
      }

      // Out of bounds
      if (ball.x < 0) { active = false; setGameOver(true); onReward(10); }
      if (ball.x > canvas.width) { ball.x = 200; ball.y = 200; ball.dx = -3; }
    }
    id = requestAnimationFrame(loop);
    return () => { canvas?.removeEventListener('mousemove', handleMouseMove); cancelAnimationFrame(id); };
  }, [gameOver]);

  return (
    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <span style={{ fontFamily: 'var(--font-mono)' }}>Score: {score}</span>
      </div>
      <canvas ref={canvasRef} width={400} height={300} style={{ background: '#0b0f19', borderRadius: 12, cursor: 'none' }} />
      {gameOver && <button className="btn btn-cyan" onClick={() => setGameOver(false)}>Restart</button>}
    </div>
  );
}

// ── 7. COLOR CATCH ──
function ColorCatchGame({ onBack, onReward }) {
  const [bucket, setBucket] = useState('🔴'); // '🔴' | '🔵'
  const [ball, setBall] = useState({ y: 0, x: 100, color: '🔴' });
  const [score, setScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBall(b => {
        if (b.y >= 200) {
          if (b.color === bucket) {
            setScore(s => s + 1); onReward(8); // +8 ByteCoins per bucket color match
          }
          return { y: 0, x: Math.random() * 180, color: Math.random() > 0.5 ? '🔴' : '🔵' };
        }
        return { ...b, y: b.y + 15 };
      });
    }, 150);
    return () => clearInterval(interval);
  }, [bucket]);

  return (
    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ alignSelf: 'flex-start' }}>← Back</button>
      <span style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--text-bright)' }}>Color Catch Score: {score}</span>
      <div style={{ width: 200, height: 220, position: 'relative', border: '1px solid var(--border)', background: '#000', overflow: 'hidden', borderRadius: 12 }}>
        <div style={{ position: 'absolute', top: ball.y, left: ball.x, fontSize: 24 }}>{ball.color}</div>
        <div style={{ position: 'absolute', bottom: 10, left: 80, fontSize: 32 }}>{bucket}</div>
      </div>
      <button className="btn btn-cyan" onClick={() => setBucket(b => b === '🔴' ? '🔵' : '🔴')}>Toggle Bucket Color</button>
    </div>
  );
}

// ── 8. WORD SCRAMBLE ──
const SCRAMBLES = [
  { word: 'REACT', hint: 'Popular JavaScript view engine framework.' },
  { word: 'PYTHON', hint: 'High-level clean syntax computer language.' },
  { word: 'COMPILER', hint: 'Translates source code to binary operations.' },
  { word: 'RECURSION', hint: 'Function loop calling itself.' }
];
function ScrambleGame({ onBack, onReward }) {
  const [curr, setCurr] = useState(SCRAMBLES[0]);
  const [guess, setGuess] = useState('');
  const [status, setStatus] = useState('');

  const scramble = (str) => str.split('').sort(() => Math.random() - 0.5).join('');

  const check = () => {
    if (guess.toUpperCase() === curr.word) {
      setStatus('Correct! +15 ByteCoins'); onReward(15);
      setTimeout(() => {
        setCurr(SCRAMBLES[Math.floor(Math.random() * SCRAMBLES.length)]);
        setGuess(''); setStatus('');
      }, 1000);
    } else {
      setStatus('Wrong! Try again.');
    }
  };

  return (
    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, width: '100%' }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ alignSelf: 'flex-start' }}>← Back</button>
      <h3 style={{ color: 'var(--text-bright)' }}>Word Scramble</h3>
      <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 2, textAlign: 'center', color: 'var(--cyan)' }}>{scramble(curr.word)}</div>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Hint: {curr.hint}</span>
      <input className="input" value={guess} onChange={e => setGuess(e.target.value)} placeholder="Unscrambled word..." />
      <button className="btn btn-cyan" onClick={check}>Submit Guess</button>
      {status && <div style={{ fontSize: 13, color: 'var(--purple)', textAlign: 'center' }}>{status}</div>}
    </div>
  );
}

// ── 9. MATH RUSH ──
function MathGame({ onBack, onReward }) {
  const [eq, setEq] = useState({ text: '2 + 3 = 5', val: true });
  const [score, setScore] = useState(0);

  const next = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const correct = a + b;
    const fake = Math.random() > 0.5 ? correct : correct + Math.floor(Math.random() * 4) - 2;
    setEq({ text: `${a} + ${b} = ${fake}`, val: correct === fake });
  };

  const answer = (ans) => {
    if (ans === eq.val) {
      setScore(s => s + 1); onReward(10); // +10 ByteCoins for fast math
      next();
    } else {
      setScore(0); next();
    }
  };

  return (
    <div className="card" style={{ padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ alignSelf: 'flex-start' }}>← Back</button>
      <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>Streak: {score}</span>
      <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--cyan)' }}>{eq.text}</div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-cyan" onClick={() => answer(true)}>True</button>
        <button className="btn btn-purple" onClick={() => answer(false)}>False</button>
      </div>
    </div>
  );
}

// ── 10. REFLEX TESTER ──
function ReflexGame({ onBack, onReward }) {
  const [state, setState] = useState('wait'); // 'wait' | 'ready' | 'result'
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  const start = () => {
    setState('wait');
    const delay = Math.random() * 3000 + 1500;
    timerRef.current = setTimeout(() => {
      setState('ready');
      setTime(Date.now());
    }, delay);
  };

  const clickGrid = () => {
    if (state === 'wait') {
      clearTimeout(timerRef.current);
      alert('Too early! Start over.');
    } else if (state === 'ready') {
      const diff = Date.now() - time;
      setState('result');
      setTime(diff);
      if (diff < 350) onReward(20); // +20 ByteCoins for fast reflexes!
    }
  };

  return (
    <div className="card" style={{ padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ alignSelf: 'flex-start' }}>← Back</button>
      <div 
        onClick={clickGrid}
        style={{
          width: 300, height: 200, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer',
          background: state === 'wait' ? '#ff3b30' : state === 'ready' ? '#34c759' : 'var(--cyan-dim)',
          color: '#fff', border: '1px solid var(--border)'
        }}
      >
        {state === 'wait' ? 'Hold... Wait for Green' : state === 'ready' ? 'CLICK NOW!' : `Reflex: ${time}ms`}
      </div>
      <button className="btn btn-purple" onClick={start}>Restart Reflex Test</button>
    </div>
  );
}

// ── 11. NUMBER GUESSER ──
function GuessGame({ onBack, onReward }) {
  const [target] = useState(() => Math.floor(Math.random() * 50) + 1);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');

  const submit = () => {
    const val = Number(guess);
    if (val === target) {
      setFeedback('Correct! +15 ByteCoins added.'); onReward(15);
    } else if (val < target) {
      setFeedback('Too low! Try higher.');
    } else {
      setFeedback('Too high! Try lower.');
    }
  };

  return (
    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 350, width: '100%' }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ alignSelf: 'flex-start' }}>← Back</button>
      <h3 style={{ color: 'var(--text-bright)' }}>Guess the Number</h3>
      <input className="input" type="number" value={guess} onChange={e => setGuess(e.target.value)} placeholder="Guess 1 to 50..." />
      <button className="btn btn-cyan" onClick={submit}>Submit</button>
      {feedback && <div style={{ fontSize: 13, color: 'var(--cyan)', textAlign: 'center' }}>{feedback}</div>}
    </div>
  );
}

// ── 12. SIMON GLOW ──
function SimonGame({ onBack, onReward }) {
  const [seq, setSeq] = useState([0]);
  const [player, setPlayer] = useState([]);
  const [active, setActive] = useState(null);

  const flash = (idx) => {
    setActive(idx);
    setTimeout(() => setActive(null), 300);
  };

  const handleBtnClick = (idx) => {
    flash(idx);
    const next = [...player, idx]; setPlayer(next);
    if (seq[next.length - 1] !== idx) {
      alert('Game Over! Retrying sequence...'); setSeq([0]); setPlayer([]); return;
    }
    if (next.length === seq.length) {
      onReward(15); // Completion bonus
      setTimeout(() => {
        setSeq([...seq, Math.floor(Math.random() * 4)]);
        setPlayer([]);
      }, 800);
    }
  };

  return (
    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ alignSelf: 'flex-start' }}>← Back</button>
      <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Level Sequence: {seq.length}</span>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: 200, height: 200 }}>
        {[0,1,2,3].map(i => (
          <button 
            key={i} 
            onClick={() => handleBtnClick(i)}
            style={{
              borderRadius: 12, border: 'none', cursor: 'pointer',
              background: i === 0 ? '#ff3b30' : i === 1 ? '#34c759' : i === 2 ? '#007aff' : '#ffcc00',
              opacity: active === i ? 1 : 0.4, transition: 'opacity 0.15s'
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── 13. KEYBOARD SPEEDRUN ──
const TYPING_WORDS = ['COMPILER', 'REACT', 'PYTHON', 'VARIABLES', 'DEVELOPER'];
function TypingGame({ onBack, onReward }) {
  const [word, setWord] = useState('NEXUS');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);

  const check = (e) => {
    const val = e.target.value; setInput(val);
    if (val.toUpperCase() === word) {
      setScore(s => s + 1); onReward(10);
      setWord(TYPING_WORDS[Math.floor(Math.random() * TYPING_WORDS.length)]);
      setInput('');
    }
  };

  return (
    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 350, width: '100%' }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ alignSelf: 'flex-start' }}>← Back</button>
      <span style={{ color: 'var(--text-muted)' }}>Compiled Strings: {score}</span>
      <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--purple)', textAlign: 'center' }}>{word}</div>
      <input className="input" value={input} onChange={check} placeholder="Type the string..." />
    </div>
  );
}

// ── 14. ROCK PAPER SCISSORS ──
function RPSGame({ onBack, onReward }) {
  const [result, setResult] = useState('');
  const play = (p) => {
    const opts = ['Rock', 'Paper', 'Scissors'];
    const ai = opts[Math.floor(Math.random() * 3)];
    if (p === ai) setResult(`Tie! Both chose ${p}`);
    else if ((p==='Rock'&&ai==='Scissors') || (p==='Paper'&&ai==='Rock') || (p==='Scissors'&&ai==='Paper')) {
      setResult(`You Won! AI chose ${ai}. +15 Coins`); onReward(15);
    } else {
      setResult(`AI Wins! AI chose ${ai}`);
    }
  };
  return (
    <div className="card" style={{ padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ alignSelf: 'flex-start' }}>← Back</button>
      <h3 style={{ color: 'var(--text-bright)' }}>AI Code Duel R-P-S</h3>
      <div style={{ display: 'flex', gap: 12 }}>
        {['Rock', 'Paper', 'Scissors'].map(o => (
          <button key={o} className="btn btn-cyan" onClick={() => play(o)}>{o}</button>
        ))}
      </div>
      {result && <span style={{ color: 'var(--purple)', fontSize: 13 }}>{result}</span>}
    </div>
  );
}

// ── 15. AESTHETIC FLIP 🪙 ──
function FlipGame({ onBack, coins, spendCoins, onReward }) {
  const [result, setResult] = useState('');
  const flip = (guess) => {
    if (!spendCoins(10)) { alert('Not enough ByteCoins!'); return; }
    const coin = Math.random() > 0.5 ? 'Heads' : 'Tails';
    if (guess === coin) {
      setResult(`Correct! It was ${coin}. +20 Coins`); onReward(20);
    } else {
      setResult(`Wrong! It was ${coin}.`);
    }
  };
  return (
    <div className="card" style={{ padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ alignSelf: 'flex-start' }}>← Back</button>
      <h3 style={{ color: 'var(--text-bright)' }}>Coin Flip (Cost: 10 Coins)</h3>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn btn-cyan" onClick={() => flip('Heads')}>Heads</button>
        <button className="btn btn-purple" onClick={() => flip('Tails')}>Tails</button>
      </div>
      {result && <span style={{ color: 'var(--cyan)', fontSize: 13 }}>{result}</span>}
    </div>
  );
}

// ── 16. BINARY SPEEDRUN ──
function BinaryGame({ onBack, onReward }) {
  const [num] = useState(() => Math.floor(Math.random() * 15) + 1);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');

  const check = () => {
    const correct = num.toString(2);
    if (guess === correct) {
      setFeedback('Correct! +20 Coins'); onReward(20);
    } else {
      setFeedback(`Incorrect. Correct binary representation is ${correct}`);
    }
  };

  return (
    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 350, width: '100%' }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ alignSelf: 'flex-start' }}>← Back</button>
      <h3 style={{ color: 'var(--text-bright)' }}>Decimal to Binary</h3>
      <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--cyan)', textAlign: 'center' }}>Convert Number: {num}</span>
      <input className="input" value={guess} onChange={e => setGuess(e.target.value)} placeholder="Enter binary..." />
      <button className="btn btn-cyan" onClick={check}>Submit Binary</button>
      {feedback && <span style={{ fontSize: 12, color: 'var(--purple)', textAlign: 'center' }}>{feedback}</span>}
    </div>
  );
}

// ── 17. HEX MATCHER ──
function HexGame({ onBack, onReward }) {
  const [target] = useState(() => ({ r: Math.floor(Math.random()*255), g: Math.floor(Math.random()*255), b: Math.floor(Math.random()*255) }));
  const [r, setR] = useState(128);
  const [g, setG] = useState(128);
  const [b, setB] = useState(128);

  const verify = () => {
    const diff = Math.abs(r - target.r) + Math.abs(g - target.g) + Math.abs(b - target.b);
    if (diff < 80) {
      alert('Excellent Color Match! +30 ByteCoins added.'); onReward(30); onBack();
    } else {
      alert('Keep adjusting sliders to match colors closer!');
    }
  };

  return (
    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, width: 340 }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ alignSelf: 'flex-start' }}>← Back</button>
      <h3 style={{ color: 'var(--text-bright)' }}>Hex Color Sliders</h3>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <div style={{ width: 100, height: 100, borderRadius: 12, background: `rgb(${target.r},${target.g},${target.b})` }} />
        <div style={{ width: 100, height: 100, borderRadius: 12, background: `rgb(${r},${g},${b})` }} />
      </div>
      <div>
        <label style={{ fontSize: 11 }}>R: {r}</label>
        <input type="range" min="0" max="255" value={r} onChange={e => setR(Number(e.target.value))} style={{ width: '100%' }} />
      </div>
      <div>
        <label style={{ fontSize: 11 }}>G: {g}</label>
        <input type="range" min="0" max="255" value={g} onChange={e => setG(Number(e.target.value))} style={{ width: '100%' }} />
      </div>
      <div>
        <label style={{ fontSize: 11 }}>B: {b}</label>
        <input type="range" min="0" max="255" value={b} onChange={e => setB(Number(e.target.value))} style={{ width: '100%' }} />
      </div>
      <button className="btn btn-purple" onClick={verify}>Match Colors</button>
    </div>
  );
}

// ── 18. PITCH MEMORY TONE ──
function ToneGame({ onBack, onReward }) {
  const [seq, setSeq] = useState([1, 2]);
  const [player, setPlayer] = useState([]);
  const flash = (btn) => {
    const audio = new AudioContext();
    const osc = audio.createOscillator();
    osc.frequency.value = btn === 1 ? 261.6 : btn === 2 ? 329.6 : 392.0;
    osc.connect(audio.destination); osc.start();
    setTimeout(() => osc.stop(), 300);
  };
  const select = (btn) => {
    flash(btn);
    const next = [...player, btn]; setPlayer(next);
    if (seq[next.length - 1] !== btn) { alert('Pattern wrong!'); setSeq([1]); setPlayer([]); return; }
    if (next.length === seq.length) {
      onReward(20);
      setTimeout(() => { setSeq([...seq, Math.floor(Math.random()*3)+1]); setPlayer([]); }, 800);
    }
  };
  return (
    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ alignSelf: 'flex-start' }}>← Back</button>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Notes Sequence: {seq.length}</span>
      <div style={{ display: 'flex', gap: 12 }}>
        {[1,2,3].map(i => (
          <button key={i} onClick={() => select(i)} style={{ width: 60, height: 60, borderRadius: 12, background: 'var(--cyan)', border: 'none', cursor: 'pointer' }}>{i}</button>
        ))}
      </div>
    </div>
  );
}

// ── 19. CS TRIVIA ──
function TriviaGame({ onBack, onReward }) {
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState(null);

  const q = [
    { q: 'Who is known as the father of modern computing?', a: ['Alan Turing', 'Bill Gates', 'Steve Jobs'], c: 0 },
    { q: 'Which port is default for secure HTTP (HTTPS)?', a: ['80', '443', '8080'], c: 1 }
  ];

  const verify = (sel) => {
    setAns(sel);
    if (sel === q[idx].c) onReward(20);
  };

  return (
    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, width: 340 }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ alignSelf: 'flex-start' }}>← Back</button>
      <span style={{ color: 'var(--text-bright)' }}>{q[idx].q}</span>
      {q[idx].a.map((opt, i) => (
        <button key={i} className="btn btn-ghost" onClick={() => verify(i)} style={{ border: '1px solid var(--border)', textAlign: 'left', width: '100%' }}>{opt}</button>
      ))}
      {ans !== null && (
        <button className="btn btn-purple" onClick={() => { setIdx(i => (i+1)%q.length); setAns(null); }}>Next Question</button>
      )}
    </div>
  );
}

// ── 20. BLOX STACKER ──
function StackGame({ onBack, onReward }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stack = [{ x: 100, y: 280, w: 200 }];
    let currentBlock = { x: 0, y: 250, w: 200, dx: 4 };
    let localScore = 0; let active = true;

    const place = () => {
      const top = stack[stack.length - 1];
      // Check overlaps
      if (currentBlock.x + currentBlock.w < top.x || currentBlock.x > top.x + top.w) {
        active = false; setGameOver(true); onReward(10);
      } else {
        // Cut overlapping block size
        const overlapX = Math.max(currentBlock.x, top.x);
        const overlapW = Math.min(currentBlock.x + currentBlock.w, top.x + top.w) - overlapX;
        stack.push({ x: overlapX, y: currentBlock.y, w: overlapW });
        localScore++; setScore(localScore); onReward(15); // +15 ByteCoins for clean block stacking!
        
        currentBlock = { x: 0, y: currentBlock.y - 30, w: overlapW, dx: 4 + localScore * 0.5 };
      }
    };

    canvas.addEventListener('click', place);

    let id;
    function loop() {
      if (!active) return;
      id = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move current block
      currentBlock.x += currentBlock.dx;
      if (currentBlock.x < 0 || currentBlock.x + currentBlock.w > canvas.width) currentBlock.dx *= -1;

      // Draw stack
      ctx.fillStyle = '#a855f7';
      stack.forEach(s => ctx.fillRect(s.x, s.y, s.w, 30));

      // Draw current block
      ctx.fillStyle = '#00e5ff';
      ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.w, 30);
    }
    id = requestAnimationFrame(loop);
    return () => { canvas?.removeEventListener('click', place); cancelAnimationFrame(id); };
  }, [gameOver]);

  return (
    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <span style={{ fontFamily: 'var(--font-mono)' }}>Score: {score}</span>
      </div>
      <canvas ref={canvasRef} width={400} height={300} style={{ background: '#0b0f19', borderRadius: 12 }} />
      {gameOver && <button className="btn btn-cyan" onClick={() => setGameOver(false)}>Restart</button>}
    </div>
  );
}

const CARD_ICONS = ['⚛️', '🐍', '💻', '☕', '🔥', '🧠', '⚙️', '🛡️'];
