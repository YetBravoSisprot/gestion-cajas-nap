// Service layer for Managing Cajas NAP via Real API Endpoints
const BASE_URL = 'https://api.sisprotgf.com/api/network/nap_box/';

const getHeaders = () => {
  // Load token securely from environment variables, or silent local storage fallback
  const token = import.meta.env.VITE_AUTH_TOKEN || localStorage.getItem('auth_token') || '';
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiService = {
  // GET https://api.sisprotgf.com/api/network/nap_box/ (Listar)
  async getCajas(search = '', page = 1, pageSize = 10) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('page_size', pageSize);

    const url = `${BASE_URL}?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText || 'No se pudo obtener el listado'}`);
    }

    return response.json();
  },

  // GET https://api.sisprotgf.com/api/network/nap_box/{id}/ (Consultar)
  async getCaja(id) {
    const url = `${BASE_URL}${id}/`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText || 'No se pudo obtener la caja NAP'}`);
    }

    return response.json();
  },

  // POST https://api.sisprotgf.com/api/network/nap_box/ (Crear)
  async createCaja(data) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: data.name,
        lat: data.lat,
        lng: data.lng,
        sector: parseInt(data.sector),
        shopping_center: !!data.shopping_center,
        start_port: String(data.start_port),
        detail: data.detail || data.name
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText || 'No se pudo crear la caja NAP'}`);
    }

    return response.json();
  },

  // PATCH https://api.sisprotgf.com/api/network/nap_box/{id}/ (Editar)
  async updateCaja(id, data) {
    const url = `${BASE_URL}${id}/`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        name: data.name,
        lat: data.lat,
        lng: data.lng,
        sector: parseInt(data.sector),
        shopping_center: !!data.shopping_center,
        start_port: String(data.start_port),
        detail: data.detail || data.name
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText || 'No se pudo actualizar la caja NAP'}`);
    }

    return response.json();
  },

  // DELETE https://api.sisprotgf.com/api/network/nap_box/{id}/ (Eliminar)
  async deleteCaja(id) {
    const url = `${BASE_URL}${id}/`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText || 'No se pudo eliminar la caja NAP'}`);
    }

    return { success: true };
  }
};
