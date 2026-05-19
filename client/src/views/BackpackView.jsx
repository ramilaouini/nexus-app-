import { useState, useEffect } from 'react';

const SHOP_ITEMS = [
  { id: 'keyboard', name: 'Mechanical Blue-Switch Keyboard', cost: 150, boost: '+20% ByteCoins bonus', desc: 'Clicks loud enough to trigger compile warnings. Grants a persistent bonus to all coin payouts!', icon: '⌨️', color: 'var(--cyan)' },
  { id: 'monitor', name: 'Curved 34" Ultrawide Monitor', cost: 200, boost: '+15% Leitner Box memory recall', desc: 'Allows you to fit 8 browser tabs in one view. Enhances flashcard spaced repetition precision!', icon: '🖥️', color: 'var(--purple)' },
  { id: 'espresso', name: 'Double Espresso Potion', cost: 80, boost: '+10% Focus Multiplier', desc: 'Concentrated caffeine roasted at ESPRIT labs. Multiplies focus performance during Pomodoro timers.', icon: '☕', color: 'var(--orange)' },
  { id: 'deskmat', name: 'RGB Cybernetic Fiber Desk Mat', cost: 100, boost: '+10% Overall Study Speed', desc: 'Strips of glowing LEDs embedded in custom neoprene fiber sheets. Adds maximum styling points.', icon: '💡', color: 'var(--green)' }
];

export default function BackpackView() {
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('nexus_coins') || '100'));
  const [inventory, setInventory] = useState(() => {
    return JSON.parse(localStorage.getItem('nexus_inventory') || '[]');
  });
  const [equipped, setEquipped] = useState(() => {
    return JSON.parse(localStorage.getItem('nexus_equipped') || '[]');
  });

  useEffect(() => {
    localStorage.setItem('nexus_inventory', JSON.stringify(inventory));
    localStorage.setItem('nexus_equipped', JSON.stringify(equipped));
    localStorage.setItem('nexus_coins', coins.toString());
  }, [inventory, equipped, coins]);

  const buyItem = (item) => {
    if (inventory.includes(item.id)) {
      alert("You already own this item!");
      return;
    }
    if (coins < item.cost) {
      alert("❌ Insufficient ByteCoins in your Wallet!");
      return;
    }
    setCoins(coins - item.cost);
    setInventory([...inventory, item.id]);
    alert(`🎉 Purchase Successful! ${item.name} added to inventory.`);
  };

  const toggleEquip = (itemId) => {
    if (equipped.includes(itemId)) {
      setEquipped(equipped.filter(id => id !== itemId));
    } else {
      setEquipped([...equipped, itemId]);
    }
  };

  return (
    <div className="view" style={{ overflowY: 'auto' }}>
      
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div className="page-eyebrow">Knowledge OS · RPG Gear</div>
        <h1 className="page-title">🎒 RPG Inventory & Student Backpack</h1>
        <p className="page-subtitle">Seed-invest ByteCoins to buy and equip computer engineering accessories that grant performance multipliers!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, paddingBottom: 40 }}>
        
        {/* Left Column: Gear Shop */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1 }}>🎒 ACCESSORIES SHOP</span>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {SHOP_ITEMS.map(item => {
              const owned = inventory.includes(item.id);
              const isEquipped = equipped.includes(item.id);

              return (
                <div key={item.id} className="card" style={{ 
                  padding: 20, display: 'flex', flexDirection: 'column', gap: 8,
                  border: isEquipped ? `1px solid ${item.color}` : '1px solid var(--border)',
                  background: isEquipped ? `${item.color}11` : 'var(--surface)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 32 }}>{item.icon}</span>
                    <span className="badge badge-purple" style={{ fontSize: 10 }}>{item.boost}</span>
                  </div>

                  <h3 style={{ fontSize: 15, color: '#fff', fontWeight: 800, marginTop: 4 }}>{item.name}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                    <span style={{ fontSize: 13, color: 'var(--yellow)', fontWeight: 'bold' }}>🪙 {item.cost} Coins</span>
                    
                    {owned ? (
                      <button 
                        className={`btn ${isEquipped ? 'btn-ghost' : 'btn-cyan'}`} 
                        onClick={() => toggleEquip(item.id)}
                        style={{ fontSize: 11, padding: '4px 12px' }}
                      >
                        {isEquipped ? '✓ Equipped' : 'Equip Gear'}
                      </button>
                    ) : (
                      <button className="btn btn-cyan" onClick={() => buyItem(item)} style={{ fontSize: 11, padding: '4px 12px' }}>
                        Buy Item
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Character Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Character visual panel */}
          <div className="card" style={{ padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--cyan)', letterSpacing: 1 }}>STUDENT CHARACTER</span>
            
            <div style={{ 
              width: 110, height: 110, borderRadius: '50%', background: 'var(--surface)', 
              border: '3px solid var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(168,85,247,0.3)', fontSize: 52
            }}>
              👤
            </div>

            <div>
              <h3 style={{ fontSize: 18, color: '#fff', fontWeight: 800, margin: 0 }}>Rami Laouini</h3>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Level 11 Software Engineer</span>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, width: '100%', display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
              <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--purple)', display: 'block', marginBottom: 4 }}>ACTIVE MULTIPLIERS</span>
              {equipped.length === 0 ? (
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>No gear equipped. Equiping shop accessories yields performance multipliers.</div>
              ) : (
                equipped.map(id => {
                  const match = SHOP_ITEMS.find(i => i.id === id);
                  return (
                    <div key={id} style={{ fontSize: 12, color: '#fff', display: 'flex', gap: 6 }}>
                      <span>{match.icon}</span>
                      <span>{match.boost}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Wallet status */}
          <div className="card" style={{ padding: 20, textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Wallet Balance:</span>
            <strong style={{ fontSize: 18, color: 'var(--yellow)' }}>🪙 {coins} Coins</strong>
          </div>

        </div>

      </div>

    </div>
  );
}
