import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BoxList from './components/BoxList';
import BoxForm from './components/BoxForm';
import BoxDetails from './components/BoxDetails';
import { apiService } from './services/api';
import './App.css';

export default function App() {
  const [activeView, setActiveView] = useState('listar'); // 'dashboard' | 'listar' | 'crear' | 'editar' | 'ajustes'
  const [boxes, setBoxes] = useState([]);
  const [search, setSearch] = useState('');
  const [searchNav, setSearchNav] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null); // for Details modal
  const [editingBox, setEditingBox] = useState(null); // box object being edited
  const [token, setToken] = useState(localStorage.getItem('auth_token') || '');

  // Update token in storage and trigger reload
  const handleTokenChange = (e) => {
    const val = e.target.value;
    setToken(val);
    localStorage.setItem('auth_token', val);
  };

  // Fetch NAP Boxes
  const fetchBoxes = async () => {
    if (!token) {
      setBoxes([]);
      setTotalCount(0);
      return;
    }
    setLoading(true);
    try {
      const activeSearch = search || searchNav;
      const data = await apiService.getCajas(activeSearch, page, 10);
      
      // Handle page results depending on list structure
      if (data && Array.isArray(data.results)) {
        setBoxes(data.results);
        setTotalCount(data.count || data.results.length);
      } else if (data && Array.isArray(data)) {
        setBoxes(data);
        setTotalCount(data.length);
      } else {
        setBoxes([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error("Error al cargar cajas NAP:", err);
      setBoxes([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoxes();
  }, [search, searchNav, page, token]);

  // Handle Save (Create / Update)
  const handleSave = async (formData) => {
    try {
      if (editingBox) {
        // Update / Edit Caja (PATCH)
        await apiService.updateCaja(editingBox.id, formData);
        alert('Caja NAP actualizada con éxito.');
      } else {
        // Create Caja (POST)
        await apiService.createCaja(formData);
        alert('Caja NAP creada con éxito.');
      }
      // Return to list view
      setActiveView('listar');
      setEditingBox(null);
      fetchBoxes();
    } catch (err) {
      alert(`Error al guardar: ${err.message}`);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la caja NAP con ID "${id}"?`)) {
      try {
        await apiService.deleteCaja(id);
        alert('Caja NAP eliminada.');
        fetchBoxes();
      } catch (err) {
        alert(`Error al eliminar: ${err.message}`);
      }
    }
  };

  const handleEditClick = (box) => {
    setEditingBox(box);
    setActiveView('editar');
  };

  const handleCreateNewClick = () => {
    setEditingBox(null);
    setActiveView('crear');
  };

  return (
    <>
      <Sidebar
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          if (view === 'crear') {
            setEditingBox(null);
          }
        }}
        searchNav={searchNav}
        setSearchNav={setSearchNav}
      />

      <main className="main-content">
        <div className="top-bar">
          <div className="top-bar-title">Gestión de Cajas NAP</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Token Bearer:</span>
              <input
                type="text"
                placeholder="Pegar token JWT..."
                value={token}
                onChange={handleTokenChange}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.8rem',
                  width: '200px'
                }}
              />
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
          </div>
        </div>

        <div className="content-body">
          {activeView === 'dashboard' && (
            <>
              <div className="page-header">
                <h1 className="page-title">Dashboard General</h1>
                <p className="page-subtitle">Vista general del estado de la red y las cajas NAP registradas.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <div className="card" style={{ padding: '24px', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cajas NAP en Red</div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', margin: '10px 0 5px 0' }}>{totalCount}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>● Operativas en producción</div>
                </div>
                <div className="card" style={{ padding: '24px', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estado de API</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', margin: '15px 0 5px 0', color: token ? 'var(--success-color)' : 'var(--danger-color)' }}>
                    {token ? 'Conectado' : 'Requiere Token'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>https://api.sisprotgf.com</div>
                </div>
                <div className="card" style={{ padding: '24px', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sincronización Gsoft</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', margin: '15px 0 5px 0', color: 'var(--primary-color)' }}>Automática</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sincronizada con NapBoxBackend</div>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => setActiveView('listar')}>
                Ir a la Gestión de Cajas NAP
              </button>
            </>
          )}

          {activeView === 'ajustes' && (
            <>
              <div className="page-header">
                <h1 className="page-title">Ajustes de Configuración</h1>
                <p className="page-subtitle">Administra los parámetros de conexión y variables de la aplicación.</p>
              </div>
              <div className="card" style={{ padding: '30px', textAlign: 'left' }}>
                <h3 style={{ marginBottom: '15px' }}>Autenticación API</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Define el Token Bearer persistente en este navegador para realizar llamadas a la API de Sisprot.
                </p>
                <div className="form-group" style={{ maxWidth: '600px' }}>
                  <label className="form-label">Token Bearer Actual</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    placeholder="Pegar token JWT..."
                    value={token}
                    onChange={handleTokenChange}
                  />
                </div>
                <div style={{ marginTop: '20px' }}>
                  <button className="btn btn-primary" onClick={() => alert('Configuración guardada en el navegador')}>
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </>
          )}

          {activeView === 'listar' && (
            <>
              <div className="page-header">
                <h1 className="page-title">Listar Cajas Nap</h1>
                <p className="page-subtitle">
                  Ruta para listar y administrar cajas nap. Al crear, sincroniza NapBoxBackend (default) y NapBoxes (gsoft) con el mismo ID. También asegura los puertos 1..start_port en nap_boxes_port.
                </p>
                <div className="alert-info-box">
                  <span>ℹ️</span>
                  <span>
                    <strong>Nota de autenticación:</strong> Ingrese el token Bearer arriba a la derecha para autorizar las peticiones a la API <strong>api.sisprotgf.com</strong>.
                  </span>
                </div>
              </div>

              {!token ? (
                <div className="card" style={{ padding: '50px', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔑</div>
                  <h3>Se requiere Autenticación</h3>
                  <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '10px auto 20px auto' }}>
                    Por favor, ingrese un Token Bearer válido en el campo superior derecho para poder listar y administrar las cajas NAP.
                  </p>
                </div>
              ) : loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                  <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <style>{`
                    @keyframes spin {
                      to { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              ) : (
                <BoxList
                  boxes={boxes}
                  search={search}
                  onSearchChange={setSearch}
                  page={page}
                  totalCount={totalCount}
                  onPageChange={setPage}
                  onViewDetails={setSelectedBox}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                  onCreateNew={handleCreateNewClick}
                />
              )}
            </>
          )}

          {(activeView === 'crear' || activeView === 'editar') && (
            <>
              <div className="page-header">
                <h1 className="page-title">
                  {activeView === 'crear' ? 'Crear Caja Nap' : 'Editar Caja Nap'}
                </h1>
                <button className="btn btn-secondary" style={{ marginTop: '10px' }} onClick={() => setActiveView('listar')}>
                  ← Volver al Listado
                </button>
              </div>

              <BoxForm
                box={editingBox}
                onSave={handleSave}
                onCancel={() => setActiveView('listar')}
              />
            </>
          )}
        </div>
      </main>

      {/* Details Modal */}
      {selectedBox && (
        <BoxDetails
          box={selectedBox}
          onClose={() => setSelectedBox(null)}
        />
      )}
    </>
  );
}
