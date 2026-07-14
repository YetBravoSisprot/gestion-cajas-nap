import React, { useState, useEffect } from 'react';

export default function BoxForm({ box, onSave, onCancel }) {
  const isEdit = !!box;
  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lng: '',
    sector: '',
    shopping_center: false,
    start_port: '1',
    detail: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (box) {
      setFormData({
        name: box.name || '',
        lat: box.lat || '',
        lng: box.lng || '',
        sector: box.sector !== undefined ? String(box.sector) : '',
        shopping_center: !!box.shopping_center,
        start_port: box.start_port !== undefined ? String(box.start_port) : '1',
        detail: box.detail || ''
      });
    }
  }, [box]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError('El nombre es requerido.');
    if (!formData.lat.trim()) return setError('La latitud es requerida.');
    if (!formData.lng.trim()) return setError('La longitud es requerida.');
    if (!formData.sector) return setError('El sector es requerido.');
    if (!formData.start_port) return setError('El puerto inicial es requerido.');
    
    setError('');
    onSave(formData);
  };

  return (
    <div className="card">
      <div className="form-header">
        <h3 className="form-title">
          {isEdit ? `✏️ Editar Caja NAP ID: ${box.id}` : '➕ Crear Nueva Caja NAP'}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
          Todos los campos marcados con asterisco (*) son obligatorios.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-body">
          {error && (
            <div style={{ padding: '12px', backgroundColor: '#fef2f2', borderLeft: '4px solid var(--danger-color)', color: '#991b1b', borderRadius: '4px', marginBottom: '20px', fontSize: '0.875rem' }}>
              ⚠️ {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre de la Caja *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Ej. Caja NAP Centro 1"
                maxLength={100}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Puerto Inicial *</label>
              <input
                type="text"
                name="start_port"
                className="form-input"
                placeholder="Ej. 1"
                maxLength={100}
                value={formData.start_port}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Latitud *</label>
              <input
                type="text"
                name="lat"
                className="form-input"
                placeholder="Ej. 10.4806"
                maxLength={50}
                value={formData.lat}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Longitud *</label>
              <input
                type="text"
                name="lng"
                className="form-input"
                placeholder="Ej. -66.9036"
                maxLength={50}
                value={formData.lng}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Sector (Número Entero) *</label>
              <input
                type="number"
                name="sector"
                className="form-input"
                placeholder="Ej. 3"
                value={formData.sector}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group" style={{ justifyContent: 'center' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '24px' }}>
                <input
                  type="checkbox"
                  name="shopping_center"
                  checked={formData.shopping_center}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                ¿Es Centro Comercial / Almacén?
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label className="form-label">Detalle (Usa el nombre por defecto si se deja vacío)</label>
              <textarea
                name="detail"
                className="form-textarea"
                rows={3}
                placeholder="Información de detalle guardado en NapBoxes..."
                value={formData.detail}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Guardar Cambios' : 'Crear Caja NAP'}
          </button>
        </div>
      </form>
    </div>
  );
}
