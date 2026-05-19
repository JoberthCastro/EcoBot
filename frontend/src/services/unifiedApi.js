import apiClient from './apiClient';

async function getCities() {
  const response = await apiClient.get('/unified/cities');
  return response.data;
}

async function getMonths(city) {
  const params = {};
  if (city) {
    params.city = city;
  }

  const response = await apiClient.get('/unified/months', { params });
  return response.data;
}

async function getDataForCityAndMonth(city, month) {
  const params = { city };
  if (month) {
    params.month = month;
  }

  const response = await apiClient.get('/unified/data', { params });
  return response.data;
}

async function getMetricsForCity(city, month) {
  const params = { city };
  if (month) {
    params.month = month;
  }

  const response = await apiClient.get('/unified/metrics', { params });
  return response.data;
}

export {
  getCities,
  getMonths,
  getDataForCityAndMonth,
  getMetricsForCity
};
