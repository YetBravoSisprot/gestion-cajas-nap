import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BoxList from './components/BoxList';
import BoxForm from './components/BoxForm';
import BoxDetails from './components/BoxDetails';
import { apiService } from './services/api';
import './App.css';

export default function App() {
  const [activeView, setActiveView] = useState('listar'); // 'listar' | 'crear' | 'editar'
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
      // Don't show annoying alerts repeatedly if unauthorized, just keep empty list
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

              {loading ? (
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
