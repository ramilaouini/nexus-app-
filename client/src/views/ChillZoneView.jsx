import { useState, useEffect, useRef } from 'react';

export default function ChillZoneView() {
  const [game, setGame] = useState('menu'); // 'menu' | 'snake' | 'memory' | 'flappy' | 'clicker' | 'duel'

  return (
    <div className="view" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header" style={{ flexShrink: 0 }}>
        <div className="page-eyebrow">Aesthetic Space · Study Break</div>
        <h1 className="page-title">🕹️ Chill Zone</h1>
        <p className="page-subtitle">Take a relaxing break with retro games to recharge your brain.</p>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        {game === 'menu' && <GameMenu onSelect={setGame} />}
        {game === 'snake' && <SnakeGame onBack={() => setGame('menu')} />}
        {game === 'memory' && <MemoryGame onBack={() => setGame('menu')} />}
        {game === 'flappy' && <FlappyGame onBack={() => setGame('menu')} />}
        {game === 'clicker' && <ClickerGame onBack={() => setGame('menu')} />}
        {game === 'duel' && <DuelGame onBack={() => setGame('menu')} />}
      </div>
    </div>
  );
}

// ── GAME MENU ──
function GameMenu({ onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, maxWidth: 1000, width: '100%', padding: 20 }}>
      {/* Snake Card */}
      <div className="card" style={{ 
        padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        background: 'linear-gradient(135deg, rgba(0,229,255,0.05), rgba(168,85,247,0.05))',
        border: '1px solid var(--border-hi)', cursor: 'pointer'
      }} onClick={() => onSelect('snake')}>
        <div style={{ fontSize: 40 }}>🐍</div>
        <h2 style={{ color: 'var(--text-bright)', fontSize: 18, fontWeight: 800 }}>Neon Snake</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, flexGrow: 1 }}>Navigate the retro snake, eat glowing node bytes, and reach the high score.</p>
        <button className="btn btn-cyan" style={{ marginTop: 'auto', width: '100%', fontSize: 12 }}>Play Snake</button>
      </div>

      {/* Memory Match Card */}
      <div className="card" style={{ 
        padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        background: 'linear-gradient(135deg, rgba(168,85,247,0.05), rgba(0,229,255,0.05))',
        border: '1px solid var(--border-hi)', cursor: 'pointer'
      }} onClick={() => onSelect('memory')}>
        <div style={{ fontSize: 40 }}>🎴</div>
        <h2 style={{ color: 'var(--text-bright)', fontSize: 18, fontWeight: 800 }}>Code Memory</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, flexGrow: 1 }}>Flip cards and match the programming language icons in the shortest time.</p>
        <button className="btn btn-purple" style={{ marginTop: 'auto', width: '100%', fontSize: 12 }}>Play Memory</button>
      </div>

      {/* Flappy Neon Card */}
      <div className="card" style={{ 
        padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        background: 'linear-gradient(135deg, rgba(0,229,255,0.05), rgba(168,85,247,0.05))',
        border: '1px solid var(--border-hi)', cursor: 'pointer'
      }} onClick={() => onSelect('flappy')}>
        <div style={{ fontSize: 40 }}>🚀</div>
        <h2 style={{ color: 'var(--text-bright)', fontSize: 18, fontWeight: 800 }}>Flappy Neon</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, flexGrow: 1 }}>Guide the glowing rocket vessel through high-voltage energy barriers.</p>
        <button className="btn btn-cyan" style={{ marginTop: 'auto', width: '100%', fontSize: 12 }}>Play Flappy</button>
      </div>

      {/* Code Clicker Card */}
      <div className="card" style={{ 
        padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        background: 'linear-gradient(135deg, rgba(168,85,247,0.05), rgba(0,229,255,0.05))',
        border: '1px solid var(--border-hi)', cursor: 'pointer'
      }} onClick={() => onSelect('clicker')}>
        <div style={{ fontSize: 40 }}>💻</div>
        <h2 style={{ color: 'var(--text-bright)', fontSize: 18, fontWeight: 800 }}>Code Clicker</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, flexGrow: 1 }}>Generate Byte Coins, upgrade your workstation and hire AI scripts.</p>
        <button className="btn btn-purple" style={{ marginTop: 'auto', width: '100%', fontSize: 12 }}>Play Clicker</button>
      </div>

      {/* Code Duel Card */}
      <div className="card" style={{ 
        padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        background: 'linear-gradient(135deg, rgba(0,229,255,0.05), rgba(168,85,247,0.05))',
        border: '1px solid var(--border-hi)', cursor: 'pointer'
      }} onClick={() => onSelect('duel')}>
        <div style={{ fontSize: 40 }}>⚔️</div>
        <h2 style={{ color: 'var(--text-bright)', fontSize: 18, fontWeight: 800 }}>Code Duel</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, flexGrow: 1 }}>Engage in a classic Tic-Tac-Toe battle against the Nexus AI Core.</p>
        <button className="btn btn-cyan" style={{ marginTop: 'auto', width: '100%', fontSize: 12 }}>Play Duel</button>
      </div>
    </div>
  );
}

// ── NEON SNAKE GAME ──
function SnakeGame({ onBack }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('snake_highscore') || '0'));
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const grid = 20;
    let count = 0;
    
    let snake = {
      x: 160,
      y: 160,
      dx: grid,
      dy: 0,
      cells: [{x: 160, y: 160}, {x: 140, y: 160}],
      maxCells: 4
    };

    let apple = { x: 320, y: 320 };
    let localScore = 0;
    let localGameOver = false;

    function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min)) + min; }
    function resetApple() {
      apple.x = getRandomInt(0, 20) * grid;
      apple.y = getRandomInt(0, 20) * grid;
    }

    let animationFrameId;

    function loop() {
      if (localGameOver) return;
      animationFrameId = requestAnimationFrame(loop);

      if (++count < 6) return;
      count = 0;
      ctx.clearRect(0,0,canvas.width,canvas.height);

      snake.x += snake.dx;
      snake.y += snake.dy;

      if (snake.x < 0) snake.x = canvas.width - grid;
      else if (snake.x >= canvas.width) snake.x = 0;
      
      if (snake.y < 0) snake.y = canvas.height - grid;
      else if (snake.y >= canvas.height) snake.y = 0;

      snake.cells.unshift({x: snake.x, y: snake.y});
      if (snake.cells.length > snake.maxCells) snake.cells.pop();

      ctx.fillStyle = '#ff7043';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff7043';
      ctx.fillRect(apple.x + 2, apple.y + 2, grid - 4, grid - 4);

      ctx.fillStyle = '#00e5ff';
      ctx.shadowColor = '#00e5ff';
      snake.cells.forEach(function(cell, index) {
        ctx.fillRect(cell.x + 1, cell.y + 1, grid - 2, grid - 2);
        if (cell.x === apple.x && cell.y === apple.y) {
          snake.maxCells++;
          localScore += 10;
          setScore(localScore);
          resetApple();
        }
        for (let i = index + 1; i < snake.cells.length; i++) {
          if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
            localGameOver = true;
            setGameOver(true);
            setHighScore(h => {
              const next = Math.max(h, localScore);
              localStorage.setItem('snake_highscore', next.toString());
              return next;
            });
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

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver]);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 30, maxWidth: 500, width: '100%', gap: 20 }}>
      <div style={{ display: 'flex', justifySelf: 'stretch', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>
          Score: <span style={{ color: 'var(--cyan)' }}>{score}</span> | High: {highScore}
        </div>
      </div>
      <div style={{ border: '2px solid var(--border-hi)', borderRadius: 12, overflow: 'hidden', background: '#0b0f19' }}>
        <canvas ref={canvasRef} width={400} height={400} />
      </div>
      {gameOver ? (
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#ff7043', fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Game Over!</h3>
          <button className="btn btn-cyan" onClick={() => setGameOver(false)}>Try Again</button>
        </div>
      ) : (
        <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center' }}>Use keyboard Arrow keys to move.</p>
      )}
    </div>
  );
}

// ── CODE MEMORY MATCH GAME ──
const CARD_ICONS = ['⚛️', '🐍', '💻', '☕', '🔥', '🧠', '⚙️', '🛡️'];
function MemoryGame({ onBack }) {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    const shuffled = [...CARD_ICONS, ...CARD_ICONS]
      .map((icon, i) => ({ id: i, icon, flipped: false }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelected([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => { initGame(); }, []);

  const handleCardClick = (card) => {
    if (selected.length === 2 || matched.includes(card.id) || selected.some(c => c.id === card.id)) return;
    const nextSelected = [...selected, card];
    setSelected(nextSelected);

    if (nextSelected.length === 2) {
      setMoves(m => m + 1);
      if (nextSelected[0].icon === nextSelected[1].icon) {
        setMatched(m => [...m, nextSelected[0].id, nextSelected[1].id]);
        setSelected([]);
      } else {
        setTimeout(() => setSelected([]), 1000);
      }
    }
  };

  const won = matched.length === cards.length && cards.length > 0;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 30, maxWidth: 500, width: '100%', gap: 20 }}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>
          Moves: <span style={{ color: 'var(--purple)' }}>{moves}</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, width: '100%' }}>
        {cards.map(card => {
          const isFlipped = selected.some(c => c.id === card.id) || matched.includes(card.id);
          return (
            <div 
              key={card.id} 
              onClick={() => handleCardClick(card)}
              style={{
                aspectRatio: '1', borderRadius: 12, background: isFlipped ? 'var(--card2)' : 'linear-gradient(135deg, var(--cyan-dim), var(--purple-dim))',
                border: isFlipped ? '1px solid var(--purple)' : '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              {isFlipped ? card.icon : '❓'}
            </div>
          );
        })}
      </div>
      {won && (
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'var(--green)', fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>🎉 You Won in {moves} Moves!</h3>
          <button className="btn btn-purple" onClick={initGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

// ── FLAPPY NEON GAME ──
function FlappyGame({ onBack }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('flappy_highscore') || '0'));
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rocket = { y: 200, velocity: 0, gravity: 0.4, jump: -7, radius: 12 };
    let pipes = [];
    let pipeWidth = 40;
    let pipeGap = 120;
    let frames = 0;
    let localScore = 0;
    let localGameOver = false;

    function reset() {
      rocket.y = 200;
      rocket.velocity = 0;
      pipes = [];
      frames = 0;
      localScore = 0;
      setScore(0);
    }

    let animationFrameId;
    function loop() {
      if (localGameOver) return;
      animationFrameId = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      rocket.velocity += rocket.gravity;
      rocket.y += rocket.velocity;

      ctx.fillStyle = '#a855f7';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#a855f7';
      ctx.beginPath();
      ctx.arc(100, rocket.y, rocket.radius, 0, Math.PI * 2);
      ctx.fill();

      if (rocket.y - rocket.radius < 0 || rocket.y + rocket.radius > canvas.height) {
        handleGameOver();
      }

      if (frames % 90 === 0) {
        let topHeight = Math.random() * (canvas.height - pipeGap - 80) + 40;
        pipes.push({ x: canvas.width, top: topHeight, bottom: canvas.height - topHeight - pipeGap, passed: false });
      }

      ctx.fillStyle = '#00e5ff';
      ctx.shadowColor = '#00e5ff';
      pipes.forEach((p) => {
        p.x -= 2.5;
        ctx.fillRect(p.x, 0, pipeWidth, p.top);
        ctx.fillRect(p.x, canvas.height - p.bottom, pipeWidth, p.bottom);

        if (!p.passed && p.x + pipeWidth < 100) {
          p.passed = true;
          localScore++;
          setScore(localScore);
        }

        if (
          100 + rocket.radius > p.x &&
          100 - rocket.radius < p.x + pipeWidth &&
          (rocket.y - rocket.radius < p.top || rocket.y + rocket.radius > canvas.height - p.bottom)
        ) {
          handleGameOver();
        }
      });

      pipes = pipes.filter(p => p.x + pipeWidth > 0);
      frames++;
      ctx.shadowBlur = 0;
    }

    function handleGameOver() {
      localGameOver = true;
      setGameOver(true);
      setHighScore(h => {
        const next = Math.max(h, localScore);
        localStorage.setItem('flappy_highscore', next.toString());
        return next;
      });
    }

    const handleJump = () => { rocket.velocity = rocket.jump; };
    const handleKeyDown = (e) => { if (e.code === 'Space') { e.preventDefault(); handleJump(); } };

    canvas.addEventListener('click', handleJump);
    window.addEventListener('keydown', handleKeyDown);
    reset();
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      canvas.removeEventListener('click', handleJump);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver]);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 30, maxWidth: 500, width: '100%', gap: 20 }}>
      <div style={{ display: 'flex', justifySelf: 'stretch', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>
          Score: <span style={{ color: 'var(--cyan)' }}>{score}</span> | High: {highScore}
        </div>
      </div>
      <div style={{ border: '2px solid var(--border-hi)', borderRadius: 12, overflow: 'hidden', background: '#0b0f19' }}>
        <canvas ref={canvasRef} width={400} height={400} style={{ cursor: 'pointer' }} />
      </div>
      {gameOver ? (
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#ff7043', fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Game Over!</h3>
          <button className="btn btn-cyan" onClick={() => setGameOver(false)}>Try Again</button>
        </div>
      ) : (
        <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center' }}>Click screen or tap SPACEBAR to flap.</p>
      )}
    </div>
  );
}

// ── RETRO CODE CLICKER GAME ──
function ClickerGame({ onBack }) {
  const [bytes, setBytes] = useState(0);
  const [byteRate, setByteRate] = useState(0); // Bytes per second
  const [clickPower, setClickPower] = useState(1);

  // Upgrades
  const [ramCost, setRamCost] = useState(15);
  const [ramLevel, setRamLevel] = useState(0);
  const [cpuCost, setCpuCost] = useState(100);
  const [cpuLevel, setCpuLevel] = useState(0);
  const [aiCost, setAiCost] = useState(500);
  const [aiLevel, setAiLevel] = useState(0);

  // Auto increment logic
  useEffect(() => {
    const timer = setInterval(() => {
      setBytes(b => b + byteRate);
    }, 1000);
    return () => clearInterval(timer);
  }, [byteRate]);

  const handleClick = () => {
    setBytes(b => b + clickPower);
  };

  const buyRam = () => {
    if (bytes >= ramCost) {
      setBytes(b => b - ramCost);
      setClickPower(p => p + 1);
      setRamLevel(l => l + 1);
      setRamCost(c => Math.round(c * 1.5));
    }
  };

  const buyCpu = () => {
    if (bytes >= cpuCost) {
      setBytes(b => b - cpuCost);
      setByteRate(r => r + 2);
      setCpuLevel(l => l + 1);
      setCpuCost(c => Math.round(c * 1.6));
    }
  };

  const buyAi = () => {
    if (bytes >= aiCost) {
      setBytes(b => b - aiCost);
      setByteRate(r => r + 15);
      setAiLevel(l => l + 1);
      setAiCost(c => Math.round(c * 1.7));
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 30, maxWidth: 600, width: '100%', gap: 20 }}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
          Auto Rate: <span style={{ color: 'var(--purple)' }}>{byteRate} B/s</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%', marginTop: 10 }}>
        
        {/* Clicker Module */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: 16, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Byte Balance</h3>
            <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>{bytes} 💾</div>
          </div>

          <div 
            onClick={handleClick}
            style={{
              width: 140, height: 140, borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, cursor: 'pointer',
              boxShadow: '0 0 30px var(--cyan-glow)', transition: 'all 0.1s', border: '3px solid rgba(255,255,255,0.2)'
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            💻
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Click to compile bytecoins! (+{clickPower})</span>
        </div>

        {/* Upgrades Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--purple)', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>UPGRADES</div>
          
          {/* Upgrade RAM */}
          <button className="btn btn-ghost" onClick={buyRam} disabled={bytes < ramCost} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', width: '100%', fontSize: 13, border: '1px solid var(--border)' }}>
            <div style={{ textAlign: 'left' }}>
              <strong>Upgrade RAM (Lvl {ramLevel})</strong>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>+1 Byte per Click</div>
            </div>
            <span style={{ color: bytes >= ramCost ? 'var(--green)' : 'var(--text-muted)' }}>{ramCost} B</span>
          </button>

          {/* Upgrade CPU */}
          <button className="btn btn-ghost" onClick={buyCpu} disabled={bytes < cpuCost} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', width: '100%', fontSize: 13, border: '1px solid var(--border)' }}>
            <div style={{ textAlign: 'left' }}>
              <strong>Overclock CPU (Lvl {cpuLevel})</strong>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>+2 Bytes Auto/sec</div>
            </div>
            <span style={{ color: bytes >= cpuCost ? 'var(--green)' : 'var(--text-muted)' }}>{cpuCost} B</span>
          </button>

          {/* Upgrade AI Core */}
          <button className="btn btn-ghost" onClick={buyAi} disabled={bytes < aiCost} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', width: '100%', fontSize: 13, border: '1px solid var(--border)' }}>
            <div style={{ textAlign: 'left' }}>
              <strong>AI Automation (Lvl {aiLevel})</strong>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>+15 Bytes Auto/sec</div>
            </div>
            <span style={{ color: bytes >= aiCost ? 'var(--green)' : 'var(--text-muted)' }}>{aiCost} B</span>
          </button>
        </div>

      </div>
    </div>
  );
}

// ── CODE DUEL GAME (TIC-TAC-TOE VS AI) ──
function DuelGame({ onBack }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.includes(null) ? null : 'Tie';
  };

  const handleAIPlay = (squares) => {
    // Collect available positions
    const emptyIndices = squares.map((s, idx) => s === null ? idx : null).filter(val => val !== null);
    if (emptyIndices.length === 0) return;
    
    // Simple AI: block player or pick random
    let choice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    
    squares[choice] = 'O';
    setBoard(squares);
    
    const win = calculateWinner(squares);
    if (win) setWinner(win);
    else setIsXNext(true);
  };

  const handleSquareClick = (idx) => {
    if (board[idx] || winner || !isXNext) return;

    const nextBoard = [...board];
    nextBoard[idx] = 'X';
    setBoard(nextBoard);

    const win = calculateWinner(nextBoard);
    if (win) {
      setWinner(win);
    } else {
      setIsXNext(false);
      setTimeout(() => handleAIPlay(nextBoard), 500);
    }
  };

  const restart = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 30, maxWidth: 450, width: '100%', gap: 20 }}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>
          {winner ? (
            winner === 'Tie' ? '🤝 Code Draw!' : winner === 'X' ? '🎉 You Won!' : '🤖 AI Core Wins!'
          ) : (
            isXNext ? '⚔️ Your Turn (X)' : '🤖 AI calculating...'
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '300px', height: '300px' }}>
        {board.map((val, idx) => (
          <button
            key={idx}
            onClick={() => handleSquareClick(idx)}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border-hi)', borderRadius: 12,
              fontSize: 36, fontWeight: 900, color: val === 'X' ? 'var(--cyan)' : 'var(--purple)',
              cursor: 'pointer', transition: 'all 0.15s'
            }}
          >
            {val}
          </button>
        ))}
      </div>

      {winner && (
        <button className="btn btn-cyan" onClick={restart} style={{ width: '100%' }}>Restart Duel</button>
      )}
    </div>
  );
}
