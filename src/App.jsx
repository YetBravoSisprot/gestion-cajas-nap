import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BoxList from './components/BoxList';
import BoxForm from './components/BoxForm';
import BoxDetails from './components/BoxDetails';
import Login from './components/Login';
import { apiService } from './services/api';
import './App.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!sessionStorage.getItem('authenticated_user');
  });
  const [activeView, setActiveView] = useState('listar'); // 'listar' | 'crear' | 'editar'
  const [boxes, setBoxes] = useState([]);
  const [search, setSearch] = useState('');
  const [searchNav, setSearchNav] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null); // for Details modal
  const [editingBox, setEditingBox] = useState(null); // box object being edited
  const [apiError, setApiError] = useState('');

  // Fetch NAP Boxes
  const fetchBoxes = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setApiError('');
    try {
      const activeSearch = search || searchNav;
      const data = await apiService.getCajas(activeSearch, page, 10);
      
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
      setApiError(err.message || 'Error al conectar con el servidor.');
      setBoxes([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoxes();
  }, [search, searchNav, page, isAuthenticated]);

  // Handle Save (Create / Update)
  const handleSave = async (formData) => {
    try {
      if (editingBox) {
        await apiService.updateCaja(editingBox.id, formData);
        alert('Caja NAP actualizada con éxito.');
      } else {
        await apiService.createCaja(formData);
        alert('Caja NAP creada con éxito.');
      }
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

  const handleLogout = () => {
    sessionStorage.removeItem('authenticated_user');
    setIsAuthenticated(false);
  };

  // If not authenticated, render Login view
  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

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
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {sessionStorage.getItem('authenticated_user')}
            </span>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
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
              </div>

              {apiError && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#fef2f2',
                  borderLeft: '4px solid var(--danger-color)',
                  color: '#991b1b',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  fontSize: '0.9rem',
                  textAlign: 'left'
                }}>
                  <strong>⚠️ Error de Conexión / Autenticación:</strong> {apiError}
                  <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#7f1d1d' }}>
                    Asegúrese de haber configurado el token de acceso en sus variables de entorno de Vercel como <strong>VITE_AUTH_TOKEN</strong> o en su archivo <strong>.env.local</strong> localmente.
                  </div>
                </div>
              )}

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
