const API_URL = 'http://localhost:6700/api';

// Helper to get token from storage (assuming standard implementation for now)
const getToken = () => localStorage.getItem('token');

async function fetchApi(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data.data; // our backend standardizes on { success, message, data }
}

export const getBlueprint = async (projectId) => {
  return fetchApi(`/projects/${projectId}/blueprint`);
};

export const updateBlueprint = async (projectId, payload) => {
  return fetchApi(`/projects/${projectId}/blueprint`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
};

export const loginUser = async (credentials) => {
  return fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
};

export const registerUser = async (credentials) => {
  return fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(credentials) });
};

export const createProject = async (payload) => {
  return fetchApi('/projects', { method: 'POST', body: JSON.stringify(payload) });
};

export const getProjects = async () => {
  return fetchApi('/projects', { method: 'GET' });
};
