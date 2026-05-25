import React, { useState, useEffect } from 'react';
import './VirtualDesk.css';

// Mock inventory (we will let users load this from their actual Backpack later or use local state)
const DEFAULT_INVENTORY = [
  { id: 'item_plant', name: 'Bonsai Tree', type: 'plant', icon: '🪴' },
  { id: 'item_cat', name: 'Sleeping Orange Cat', type: 'pet', icon: '🐈' },
  { id: 'item_coffee', name: 'Coffee Mug', type: 'drink', icon: '☕' },
  { id: 'item_lamp', name: 'Lava Lamp', type: 'decor', icon: '🌋' },
  { id: 'item_book', name: 'C++ Textbook', type: 'book', icon: '📘' }
];

export default function DeskView() {
  const [placedItems, setPlacedItems] = useState(() => {
    return JSON.parse(localStorage.getItem('nexus_desk_items') || '[]');
  });
  const [inventory, setInventory] = useState(DEFAULT_INVENTORY);
  const [draggingItem, setDraggingItem] = useState(null);

  useEffect(() => {
    localStorage.setItem('nexus_desk_items', JSON.stringify(placedItems));
  }, [placedItems]);

  const handleDragStart = (e, item, isPlaced) => {
    e.dataTransfer.setData('text/plain', item.id);
    setDraggingItem({ ...item, isPlaced });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropRoom = (e) => {
    e.preventDefault();
    if (!draggingItem) return;

    // Calculate approximate isometric grid position based on mouse drop coordinates relative to container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (draggingItem.isPlaced) {
      // Move existing item
      setPlacedItems(prev => prev.map(p => p.id === draggingItem.id ? { ...p, x, y } : p));
    } else {
      // Add new item from inventory
      setPlacedItems(prev => [...prev, { ...draggingItem, id: Date.now().toString(), originId: draggingItem.id, x, y }]);
    }
    setDraggingItem(null);
  };

  const handleRemove = (e, id) => {
    e.stopPropagation();
    setPlacedItems(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="view-container desk-view-container">
      <header style={{ padding: '40px 40px 0 40px', flexShrink: 0 }}>
        <h1 style={{ fontSize: '3rem', margin: 0, color: 'var(--text-bright)' }}>My Virtual Room 🏠</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', margin: '10px 0 20px 0' }}>
          Drag and drop items from your backpack to build your perfect cozy study vibe.
        </p>
      </header>

      <div className="desk-layout">
        <div className="desk-left-panel">
          <div className="card inventory-box">
            <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>🎒 My Backpack</h3>
            <div className="inventory-grid">
              {inventory.map(item => (
                <div 
                  key={item.id} 
                  className="inventory-item" 
                  draggable 
                  onDragStart={(e) => handleDragStart(e, item, false)}
                >
                  <span className="item-icon">{item.icon}</span>
                  <span className="item-name">{item.name}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 20 }}>
              *Buy more items using <strong>MarketView</strong> to populate your backpack!
            </p>
          </div>
        </div>

        <div className="desk-right-panel">
          {/* Isometric Room Wrapper */}
          <div className="isometric-room-container" onDragOver={handleDragOver} onDrop={handleDropRoom}>
            
            <div className="room-grid">
              {/* Background Walls & Desk element */}
              <div className="wall wall-left"></div>
              <div className="wall wall-right"></div>
              <div className="floor"></div>
              
              <div className="main-desk">
                <div className="laptop">💻</div>
              </div>

              {/* Render Placed Items */}
              {placedItems.map(item => (
                <div 
                  key={item.id}
                  className="placed-item"
                  style={{ left: item.x - 20, top: item.y - 20 }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item, true)}
                >
                  <span className="placed-icon">{item.icon}</span>
                  <button className="remove-btn" onClick={(e) => handleRemove(e, item.id)}>x</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
