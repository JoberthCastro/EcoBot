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

async function resolveMonthForCity(city, month) {
  const months = await getMonths(city);
  if (!months.length) {
    return month;
  }
  if (month && months.includes(month)) {
    return month;
  }
  return months[months.length - 1];
}

async function getDataForCityAndMonth(city, month) {
  const validMonth = month ? await resolveMonthForCity(city, month) : null;
  const params = { city };
  if (validMonth) {
    params.month = validMonth;
  }

  const response = await apiClient.get('/unified/data', { params });
  return response.data;
}

async function getMetricsForCity(city, month) {
  const validMonth = month ? await resolveMonthForCity(city, month) : null;
  const params = { city };
  if (validMonth) {
    params.month = validMonth;
  }

  const response = await apiClient.get('/unified/metrics', { params });
  return response.data;
}

async function getMapOverview(month) {
  const params = {};
  if (month) {
    params.month = month;
  }

  const response = await apiClient.get('/unified/map', { params });
  return response.data;
}

export {
  getCities,
  getMonths,
  resolveMonthForCity,
  getDataForCityAndMonth,
  getMetricsForCity,
  getMapOverview,
};
