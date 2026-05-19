import { useState } from 'react';

const PEERS = [
  { id: 1, name: 'Skander ESPRIT', level: 'Grandmaster Lvl 14', specialty: 'C++', difficulty: 'Hard', avatar: '🧙‍♂️', hp: 100 },
  { id: 2, name: 'Farah ESPRIT', level: 'Expert Lvl 12', specialty: 'Algorithms', difficulty: 'Medium', avatar: '👩‍💻', hp: 100 },
  { id: 3, name: 'Youssef ESPRIT', level: 'Apprentice Lvl 8', specialty: 'SQL', difficulty: 'Easy', avatar: '👨‍🎓', hp: 100 }
];

const QUESTIONS = [
  {
    q: 'What is a C++ smart pointer that allows shared ownership?',
    options: ['std::unique_ptr', 'std::shared_ptr', 'std::weak_ptr', 'std::auto_ptr'],
    answer: 'std::shared_ptr'
  },
  {
    q: 'Which database command is used to remove all records from a table without logging the individual row deletions?',
    options: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'],
    answer: 'TRUNCATE'
  },
  {
    q: 'What is the average time complexity of a Quick Sort algorithm?',
    options: ['O(N log N)', 'O(N^2)', 'O(N)', 'O(log N)'],
    answer: 'O(N log N)'
  }
];

export default function DuelView() {
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [gameState, setGameState] = useState('lobby'); // 'lobby' | 'combat' | 'victory' | 'defeat'
  const [userHp, setUserHp] = useState(100);
  const [peerHp, setPeerHp] = useState(100);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [combatLog, setCombatLog] = useState('The duel is about to begin! Ready your compiler...');

  const startDuel = (peer) => {
    setSelectedPeer(peer);
    setUserHp(100);
    setPeerHp(100);
    setQuestionIdx(0);
    setGameState('combat');
    setCombatLog(`⚔️ Combat Initiated against ${peer.name}!`);
  };

  const handleAnswer = (option) => {
    const q = QUESTIONS[questionIdx];
    const isCorrect = option === q.answer;

    if (isCorrect) {
      const nextHp = Math.max(0, peerHp - 35);
      setPeerHp(nextHp);
      setCombatLog(`🔥 Critical Hit! You answered correctly and dealt 35 damage to ${selectedPeer.name}!`);
      
      if (nextHp <= 0) {
        handleVictory();
        return;
      }
    } else {
      const nextHp = Math.max(0, userHp - 35);
      setUserHp(nextHp);
      setCombatLog(`❌ Runtime Error! Incorrect answer. ${selectedPeer.name} counter-attacked and dealt 35 damage!`);
      
      if (nextHp <= 0) {
        setGameState('defeat');
        return;
      }
    }

    if (questionIdx + 1 < QUESTIONS.length) {
      setQuestionIdx(questionIdx + 1);
    } else {
      // If we finished questions and nobody is dead, person with more HP wins!
      if (userHp >= peerHp) {
        handleVictory();
      } else {
        setGameState('defeat');
      }
    }
  };

  const handleVictory = () => {
    setGameState('victory');
    const coins = Number(localStorage.getItem('nexus_coins') || '100');
    localStorage.setItem('nexus_coins', (coins + 100).toString());
  };

  return (
    <div className="view" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div className="page-eyebrow">Knowledge OS · Algorithmic Arena</div>
        <h1 className="page-title">⚔️ Coding Arena Duel</h1>
        <p className="page-subtitle">Challenge ESPRIT engineering peers to rapid-fire algorithm showdowns to climb the leaderboard!</p>
      </div>

      {gameState === 'lobby' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 40 }}>
          <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1 }}>CHALLENGE AN ELITE PEER</span>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {PEERS.map(p => (
              <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24, textAlign: 'center', gap: 10 }}>
                <div style={{ fontSize: 44, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.avatar}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 800 }}>{p.name}</h3>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.level}</span>
                </div>

                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: 10, width: '100%', justifyContent: 'center' }}>
                  <span>Specialty: <strong>{p.specialty}</strong></span>
                  <span>·</span>
                  <span style={{ color: p.difficulty === 'Hard' ? '#ef4444' : p.difficulty === 'Medium' ? 'var(--orange)' : 'var(--green)' }}>{p.difficulty}</span>
                </div>

                <button className="btn btn-purple" style={{ width: '100%', marginTop: 10 }} onClick={() => startDuel(p)}>
                  ⚔️ Duel Challenger
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {gameState === 'combat' && selectedPeer && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, paddingBottom: 40 }}>
          
          {/* Left: Active Question Deck */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--purple)', letterSpacing: 1 }}>ARENA QUESTION {questionIdx + 1} OF {QUESTIONS.length}</span>
              <span className="badge badge-cyan" style={{ fontSize: 9 }}>Category: {selectedPeer.specialty}</span>
            </div>

            <h3 style={{ fontSize: 18, color: '#fff', fontWeight: 800, lineHeight: 1.6, marginBottom: 24 }}>
              {QUESTIONS[questionIdx].q}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {QUESTIONS[questionIdx].options.map(opt => (
                <button 
                  key={opt} 
                  className="btn btn-ghost" 
                  style={{ textAlign: 'left', padding: '14px 20px', fontSize: 13, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}
                  onClick={() => handleAnswer(opt)}
                >
                  <span>{opt}</span>
                  <span style={{ color: 'var(--cyan)' }}>→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Combat Status Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* User Health Card */}
            <div className="card" style={{ padding: 20, borderLeft: '4px solid var(--cyan)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>👤 Rami Laouini (You)</strong>
                <span style={{ color: 'var(--cyan)' }}>{userHp} HP</span>
              </div>
              <div style={{ height: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 5, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{ width: `${userHp}%`, height: '100%', background: 'var(--cyan)', boxShadow: '0 0 10px var(--cyan)', transition: 'width 0.4s' }} />
              </div>
            </div>

            {/* Peer Opponent Health Card */}
            <div className="card" style={{ padding: 20, borderLeft: '4px solid #ef4444' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>{selectedPeer.avatar} {selectedPeer.name}</strong>
                <span style={{ color: '#ef4444' }}>{peerHp} HP</span>
              </div>
              <div style={{ height: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 5, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{ width: `${peerHp}%`, height: '100%', background: '#ef4444', boxShadow: '0 0 10px #ef4444', transition: 'width 0.4s' }} />
              </div>
            </div>

            {/* Combat Logs */}
            <div className="card" style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: 10 }}>COMBAT EVENT FEED</span>
              <pre style={{ flex: 1, background: '#000', borderRadius: 8, padding: 12, fontSize: 12, color: 'var(--green)', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)', margin: 0, lineHeight: 1.5 }}>
                {combatLog}
              </pre>
            </div>

          </div>

        </div>
      )}

      {gameState === 'victory' && selectedPeer && (
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 48, gap: 20, maxWidth: 500, margin: '40px auto' }}>
          <div style={{ fontSize: 64 }}>🏆</div>
          <h2 style={{ fontSize: 24, color: 'var(--cyan)', fontWeight: 800 }}>VICTORY ACHIEVED!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            You masterfully out-compiled **{selectedPeer.name}** in the Algorithmic Arena Duel!
          </p>
          <div style={{ 
            fontSize: 20, fontWeight: 'bold', color: 'var(--yellow)', padding: '10px 24px', borderRadius: 30,
            background: 'rgba(251,191,36,0.1)', border: '1px solid var(--yellow)', boxShadow: '0 0 15px rgba(251,191,36,0.15)'
          }}>
            🎉 +100 ByteCoins Payout!
          </div>
          <button className="btn btn-purple" style={{ marginTop: 10 }} onClick={() => setGameState('lobby')}>Return to Arena</button>
        </div>
      )}

      {gameState === 'defeat' && selectedPeer && (
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 48, gap: 20, maxWidth: 500, margin: '40px auto' }}>
          <div style={{ fontSize: 64 }}>😓</div>
          <h2 style={{ fontSize: 24, color: '#ef4444', fontWeight: 800 }}>DEFEAT IN ARENA</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Your compiler threw a fatal segmentation fault! **{selectedPeer.name}** counter-attacked and won this round.
          </p>
          <button className="btn btn-cyan" style={{ marginTop: 10 }} onClick={() => setGameState('lobby')}>Try Again</button>
        </div>
      )}

    </div>
  );
}
