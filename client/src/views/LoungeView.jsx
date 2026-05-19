import { useState, useEffect, useRef } from 'react';

const INITIAL_MESSAGES = [
  { sender: 'Skander ESPRIT', text: 'Hey Rami, did you solve the homework on relational schema normalization?', time: '10:42 AM', avatar: '🧙‍♂️', color: 'var(--cyan)' },
  { sender: 'Farah ESPRIT', text: 'Yes! The third normal form is mandatory for the systems compilation task.', time: '10:44 AM', avatar: '👩‍💻', color: 'var(--purple)' },
  { sender: 'Youssef ESPRIT', text: 'I am studying flashcards in the Block Library now. Highly quiet space!', time: '10:45 AM', avatar: '👨‍🎓', color: 'var(--green)' }
];

const PEER_REPLIES = [
  "Solid C++ pointer overview, Rami! That will help with the upcoming compiler project.",
  "Thanks for the tip! The database server coefficients are highly optimized now.",
  "Awesome study sessions! Let's conquer the ESPRIT hackathon team brackets this October!",
  "Make sure to check-in on the timetable schedule, we have dynamic focus modules starting."
];

export default function LoungeView() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      sender: 'Rami Laouini (You)',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: '👨‍💻',
      color: 'var(--yellow)'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Peer replies dynamically in 1.5 seconds!
    setTimeout(() => {
      const peers = ['Skander ESPRIT', 'Farah ESPRIT', 'Youssef ESPRIT'];
      const randomPeer = peers[Math.floor(Math.random() * peers.length)];
      const avatars = { 'Skander ESPRIT': '🧙‍♂️', 'Farah ESPRIT': '👩‍💻', 'Youssef ESPRIT': '👨‍🎓' };
      const colors = { 'Skander ESPRIT': 'var(--cyan)', 'Farah ESPRIT': 'var(--purple)', 'Youssef ESPRIT': 'var(--green)' };
      
      const peerMsg = {
        sender: randomPeer,
        text: PEER_REPLIES[Math.floor(Math.random() * PEER_REPLIES.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: avatars[randomPeer],
        color: colors[randomPeer]
      };
      
      setMessages(prev => [...prev, peerMsg]);
    }, 1500);
  };

  return (
    <div className="view" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div className="page-eyebrow">Knowledge OS · Peer Community</div>
        <h1 className="page-title">💬 Student Lounge Chat</h1>
        <p className="page-subtitle">Chat with virtual ESPRIT sophomore engineering classmates to share blueprints, codes, and study tips.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, flex: 1, minHeight: 0, paddingBottom: 40 }}>
        
        {/* Chat Feed */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 420, padding: 20 }}>
          
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingRight: 10, marginBottom: 16 }}>
            {messages.map((msg, idx) => (
              <div key={idx} className="animate-fade-in" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 24, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {msg.avatar}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <strong style={{ fontSize: 13, color: msg.color }}>{msg.sender}</strong>
                    <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{msg.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#fff', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', lineHeight: 1.5 }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input field */}
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 10 }}>
            <input 
              className="input" 
              placeholder="Type message to class chatroom..." 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-cyan" style={{ height: 40 }}>Send</button>
          </form>

        </div>

        {/* Right Sidebar: Active Peers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1, padding: '0 4px' }}>MEMBERS ONLINE</span>
          
          {['Skander ESPRIT', 'Farah ESPRIT', 'Youssef ESPRIT'].map(name => {
            const avatars = { 'Skander ESPRIT': '🧙‍♂️', 'Farah ESPRIT': '👩‍💻', 'Youssef ESPRIT': '👨‍🎓' };
            const sub = { 'Skander ESPRIT': 'Studying: C++', 'Farah ESPRIT': 'Studying: Compilers', 'Youssef ESPRIT': 'Studying: Relational SQL' };
            const col = { 'Skander ESPRIT': 'var(--cyan)', 'Farah ESPRIT': 'var(--purple)', 'Youssef ESPRIT': 'var(--green)' };

            return (
              <div key={name} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 24 }}>{avatars[name]}</div>
                <div>
                  <strong style={{ fontSize: 13, color: col[name] }}>{name}</strong>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>{sub[name]}</span>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
