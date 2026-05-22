import apiClient from './apiClient';

export async function getSuggestions() {
  const response = await apiClient.get('/suggestions');
  return response.data;
}
