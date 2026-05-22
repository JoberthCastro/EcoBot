import apiClient from './apiClient';

export function mapApiUser(apiUser) {
  if (!apiUser) {
    return null;
  }

  const id = apiUser.id || (apiUser._id ? String(apiUser._id) : null);

  return {
    id,
    name: apiUser.name || apiUser.nome,
    email: apiUser.email,
    role: apiUser.role || 'Usuário',
    avatar: apiUser.avatar || '/logo.png',
    joinedDate:
      apiUser.joinedDate ||
      (apiUser.createdAt
        ? new Date(apiUser.createdAt).toLocaleDateString('pt-BR')
        : new Date().toLocaleDateString('pt-BR')),
    preferences: {
      theme: apiUser.preferences?.theme || 'light',
      notifications:
        typeof apiUser.preferences?.notifications === 'boolean'
          ? apiUser.preferences.notifications
          : true,
      language: apiUser.preferences?.language || 'pt-BR'
    }
  };
}

function storeAuthSession(token, apiUser) {
  if (token) {
    localStorage.setItem('ecobot-token', token);
  }
  localStorage.setItem('ecobot-authenticated', 'true');
  return mapApiUser(apiUser);
}

export async function loginRequest({ email, password }) {
  const response = await apiClient.post('/auth/login', {
    email,
    senha: password
  });
  return storeAuthSession(response.data.token, response.data.user);
}

export async function registerRequest({ name, email, password }) {
  await apiClient.post('/auth/register', {
    nome: name,
    email,
    senha: password
  });
  return { success: true };
}

export async function getUserById(id) {
  const response = await apiClient.get(`/users/${id}`);
  return mapApiUser(response.data);
}

export async function updateUserProfile(id, payload) {
  const response = await apiClient.put(`/users/${id}/profile`, payload);
  return mapApiUser(response.data);
}

export async function updateUserPreferences(id, payload) {
  const response = await apiClient.patch(`/users/${id}/preferences`, payload);
  return mapApiUser(response.data);
}

export function clearAuthSession() {
  localStorage.removeItem('ecobot-token');
  localStorage.removeItem('ecobot-authenticated');
  localStorage.removeItem('ecobot-user');
}
