import { useState, useMemo } from 'react';

const generateItems = (count, categories, typeStr) => {
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  const colors = { Common: '#9ca3af', Uncommon: '#2ecc71', Rare: '#3b82f6', Epic: '#a855f7', Legendary: '#f59e0b' };
  const items = [];
  for (let i = 0; i < count; i++) {
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const price = 0;
    items.push({
      id: typeStr + '-' + Math.random().toString(36).substr(2, 9),
      type: typeStr,
      name: cat.prefix + ' ' + cat.noun,
      rarity,
      color: colors[rarity],
      baseColor: cat.baseColor || colors[rarity],
      shape: cat.shape || 'box',
      price: 0,
      icon: cat.icon
    });
  }
  return items.sort((a,b) => b.price - a.price);
};

const SKIN_TYPES = [
  { prefix: 'Forest', noun: 'Ranger', icon: '🧝‍♂️', baseColor: '#228b22' }, 
  { prefix: 'Neon', noun: 'Cyber-Suit', icon: '🤖', baseColor: '#00ffff' },
  { prefix: 'Shadow', noun: 'Assassin', icon: '🥷', baseColor: '#1a1a1a' }, 
  { prefix: 'Crystal', noun: 'Mage', icon: '🧙‍♂️', baseColor: '#a855f7' },
  { prefix: 'Golden', noun: 'Paladin', icon: '🛡️', baseColor: '#ffd700' }, 
  { prefix: 'Void', noun: 'Walker', icon: '🌌', baseColor: '#4b0082' }
];

const ITEM_TYPES = [
  { prefix: 'Vorpal', noun: 'Blade', icon: '⚔️', shape: 'sword' }, 
  { prefix: 'Mana', noun: 'Tome', icon: '📖', shape: 'book' },
  { prefix: 'Aether', noun: 'Lantern', icon: '🏮', shape: 'lantern' }, 
  { prefix: 'Dragon', noun: 'Staff', icon: '🪄', shape: 'staff' },
  { prefix: 'Quantum', noun: 'Core', icon: '🔮', shape: 'orb' }, 
  { prefix: 'Elven', noun: 'Bow', icon: '🏹', shape: 'bow' }
];

const PACK_TYPES = [
  { prefix: 'Travelers', noun: 'Satchel', icon: '🎒', shape: 'box' }, 
  { prefix: 'Alchemists', noun: 'Pouch', icon: '👝', shape: 'sphere' },
  { prefix: 'Dimensional', noun: 'Rucksack', icon: '🧳', shape: 'box' }, 
  { prefix: 'Iron', noun: 'Vault', icon: '🗃️', shape: 'crate' },
  { prefix: 'Starlight', noun: 'Quiver', icon: '🏹', shape: 'cylinder' }
];

export default function MarketView({ coins, setCoins, inventory, setInventory, equipped, setEquipped }) {
  const [tab, setTab] = useState('skins');

  const { skins, items, backpacks } = useMemo(() => {
    return {
      skins: generateItems(50, SKIN_TYPES, 'skin'),
      items: generateItems(50, ITEM_TYPES, 'item'),
      backpacks: generateItems(50, PACK_TYPES, 'backpack'),
    };
  }, []);

  const handleBuy = (item) => {
    if (coins >= item.price) {
      setCoins(prev => prev - item.price);
      setInventory(prev => [...prev, item]);
    } else {
      alert('Not enough coins! Keep studying!');
    }
  };

  const handleEquip = (item) => {
    setEquipped(prev => ({
      ...prev,
      [item.type]: item
    }));
  };

  const renderGrid = (itemList) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
      {itemList.map(item => {
        const isOwned = inventory.some(i => i.id === item.id);
        const isEquipped = equipped[item.type]?.id === item.id;

        return (
          <div key={item.id} style={{ 
            background: 'rgba(255,255,255,0.02)', border: '1px solid ' + item.color + (isEquipped ? 'ff' : '40'), 
            borderRadius: '16px', padding: '20px', textAlign: 'center', position: 'relative', overflow: 'hidden', transition: 'all 0.3s',
            boxShadow: isEquipped ? '0 0 20px ' + item.color + '80' : 'none'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px ' + item.color + '30'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isEquipped ? '0 0 20px ' + item.color + '80' : 'none'; }}
          >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, ' + item.color + '40 0%, transparent 70%)' }} />
            <div style={{ fontSize: '4rem', marginBottom: '10px', filter: 'drop-shadow(0 0 10px ' + item.color + ')' }}>{item.icon}</div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: 'var(--text-bright)' }}>{item.name}</h3>
            <span style={{ color: item.color, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{item.rarity}</span>
            <div style={{ marginTop: '20px' }}>
              {isEquipped ? (
                <button className='btn' disabled style={{ width: '100%', background: item.color, color: '#000', fontWeight: 'bold' }}>EQUIPPED</button>
              ) : isOwned ? (
                <button className='btn' onClick={() => handleEquip(item)} style={{ width: '100%', borderColor: item.color, color: item.color }}>EQUIP</button>
              ) : (
                <button className='btn' onClick={() => handleBuy(item)} style={{ width: '100%', borderColor: item.color, color: coins >= item.price ? item.color : '#666', opacity: coins >= item.price ? 1 : 0.5 }}>
                  🪙 {item.price.toLocaleString()}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  );

  return (
    <div className='view-container' style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: '3rem', color: 'var(--text-bright)', margin: 0, textShadow: '0 0 20px #f59e0b' }}>The Grand Bazaar</h1>
          <p style={{ color: 'var(--text-muted)' }}>Equip your Guide with legendary gear.</p>
        </div>
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.5rem' }}>🪙</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{coins.toLocaleString()}</span>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexShrink: 0 }}>
        {['skins', 'items', 'backpacks', 'crates'].map(t => (
          <button 
            key={t} className={'btn ' + (tab === t ? 'btn-primary' : '')} onClick={() => setTab(t)}
            style={tab === t ? { background: '#f59e0b', color: '#000', borderColor: '#f59e0b', textTransform: 'capitalize' } : { textTransform: 'capitalize' }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
        {tab === 'skins' && renderGrid(skins)}
        {tab === 'items' && renderGrid(items)}
        {tab === 'backpacks' && renderGrid(backpacks)}
        {tab === 'crates' && (
          <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            {['Common', 'Rare', 'Legendary'].map((type, i) => {
              const colors = ['#9ca3af', '#3b82f6', '#f59e0b'];
              const prices = [0, 0, 0];
              return (
                <div key={type} className='card' style={{ 
                  width: '300px', padding: '40px 20px', textAlign: 'center',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
                  border: '2px solid ' + colors[i], boxShadow: '0 0 40px ' + colors[i] + '30'
                }}>
                  <div style={{ fontSize: '5rem', marginBottom: '20px', filter: 'drop-shadow(0 0 20px ' + colors[i] + ')' }}>📦</div>
                  <h2 style={{ color: colors[i], fontSize: '2rem', margin: '0 0 10px 0' }}>{type} Crate</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Contains random items. Higher chance for rare loot.</p>
                  <button className='btn' style={{ width: '100%', background: colors[i], color: i === 0 ? '#000' : '#fff', fontWeight: 'bold' }}>
                    Open for 🪙 {prices[i].toLocaleString()}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
