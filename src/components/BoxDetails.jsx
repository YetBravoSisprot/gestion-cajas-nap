import React from 'react';

export default function BoxDetails({ box, onClose }) {
  if (!box) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="form-title">🔍 Detalle de Caja NAP</h3>
          <button className="btn-icon-only" onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: '1.2rem' }}>
            ✕
          </button>
        </div>
        
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Identificador (ID)</span>
            <span className="detail-value" style={{ fontFamily: 'monospace', color: '#1e3a8a' }}>{box.id}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Nombre</span>
            <span className="detail-value">{box.name}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Puerto Inicial (Start Port)</span>
            <span className="detail-value">{box.start_port}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Sector</span>
            <span className="detail-value">{box.sector}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Latitud</span>
            <span className="detail-value">{box.lat}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Longitud</span>
            <span className="detail-value">{box.lng}</span>
          </div>

          <div className="detail-item" style={{ gridColumn: 'span 2' }}>
            <span className="detail-label">Tipo de Ubicación</span>
            <span className="detail-value">
              <span className={`badge ${box.shopping_center ? 'badge-primary' : 'badge-info'}`}>
                {box.shopping_center ? 'Centro Comercial / Almacén' : 'Estándar / Calle'}
              </span>
            </span>
          </div>

          <div className="detail-item" style={{ gridColumn: 'span 2' }}>
            <span className="detail-label">Detalle Guardado (Gsoft)</span>
            <span className="detail-value" style={{ fontWeight: 'normal', color: '#475569' }}>
              {box.detail || 'Sin detalles especificados.'}
            </span>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
