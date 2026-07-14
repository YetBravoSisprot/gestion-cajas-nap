import React from 'react';

export default function Sidebar({ activeView, onViewChange, searchNav, setSearchNav }) {
  const menuItems = [
    { id: 'listar', label: 'Listar Cajas Nap', icon: '📋' },
    { id: 'crear', label: 'Crear Caja Nap', icon: '➕' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span style={{ fontSize: '1.5rem' }}>🌐</span>
          <span>Redes Admin</span>
        </div>
        <div className="sidebar-search-box">
          <svg
            className="sidebar-search-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            className="sidebar-search-input"
            placeholder="Buscar..."
            value={searchNav}
            onChange={(e) => setSearchNav(e.target.value)}
          />
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Servicios</div>
          <div 
            className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onViewChange('dashboard')}
          >
            <div className="nav-item-content">
              <span>📊</span>
              <span>Dashboard</span>
            </div>
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Redes</div>
          <div className={`nav-item ${['listar', 'crear', 'editar'].includes(activeView) ? 'active' : ''} has-children`}>
            <div className="nav-item-content">
              <span>🔌</span>
              <strong>Gestión Cajas NAP</strong>
            </div>
            <span>▼</span>
          </div>
          
          <div className="nav-sub-list">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`nav-sub-item ${activeView === item.id ? 'active' : ''}`}
                onClick={() => onViewChange(item.id)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Otros</div>
          <div 
            className={`nav-item ${activeView === 'ajustes' ? 'active' : ''}`}
            onClick={() => onViewChange('ajustes')}
          >
            <div className="nav-item-content">
              <span>⚙️</span>
              <span>Ajustes</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}
