import React from 'react';

export default function BoxList({
  boxes,
  search,
  onSearchChange,
  page,
  totalCount,
  onPageChange,
  onViewDetails,
  onEdit,
  onDelete,
  onCreateNew
}) {
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="card">
      <div className="table-controls">
        <div className="search-wrapper">
          <svg
            className="search-icon-inside"
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
            className="search-input"
            placeholder="Buscar por nombre, puerto..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={onCreateNew}>
          <span>➕</span> Crear Caja Nap
        </button>
      </div>

      <div className="responsive-table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre de Caja</th>
              <th>Puerto Inicial</th>
              <th>Sector</th>
              <th>Coordenadas</th>
              <th>Tipo</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {boxes.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No se encontraron cajas NAP. Intenta cambiar los criterios de búsqueda o crea una nueva.
                </td>
              </tr>
            ) : (
              boxes.map((box) => (
                <tr key={box.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#1e3a8a' }}>
                    {box.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{box.name}</div>
                    {box.detail && box.detail !== box.name && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {box.detail}
                      </div>
                    )}
                  </td>
                  <td>{box.start_port}</td>
                  <td>Sector {box.sector}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {box.lat}, {box.lng}
                  </td>
                  <td>
                    <span className={`badge ${box.shopping_center ? 'badge-primary' : 'badge-info'}`}>
                      {box.shopping_center ? 'C.C. / Almacén' : 'Estándar'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        className="btn-icon-only view"
                        title="Consultar Detalles"
                        onClick={() => onViewDetails(box)}
                      >
                        🔍
                      </button>
                      <button
                        className="btn-icon-only edit"
                        title="Editar Caja"
                        onClick={() => onEdit(box)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon-only delete"
                        title="Eliminar Caja"
                        onClick={() => onDelete(box.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <span className="pagination-info">
          Mostrando página <strong>{page}</strong> de <strong>{totalPages}</strong> ({totalCount} resultados en total)
        </span>
        <div className="pagination-actions">
          <button
            className="btn btn-secondary"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Anterior
          </button>
          <button
            className="btn btn-secondary"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
