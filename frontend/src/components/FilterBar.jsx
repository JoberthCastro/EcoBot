import React, { useState, useEffect } from 'react';
import { getCities, getMonths } from '../services/unifiedApi';
import './FilterBar.css';

function FilterBar({ onFilterChange, defaultCity = 'São Paulo', defaultMonth = 'Jun', showMonthFilter = true }) {
  const [cities, setCities] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedCity, setSelectedCity] = useState(defaultCity);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [filtersReady, setFiltersReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadCities() {
      const citiesData = await getCities();
      if (!isMounted) {
        return;
      }
      setCities(citiesData);
    }

    loadCities();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadMonthsForCity() {
      setFiltersReady(false);
      const monthsData = await getMonths(selectedCity);
      if (!isMounted) {
        return;
      }

      setMonths(monthsData);
      if (monthsData.length && !monthsData.includes(selectedMonth)) {
        setSelectedMonth(monthsData[monthsData.length - 1]);
      }
      setFiltersReady(true);
    }

    if (showMonthFilter && selectedCity) {
      loadMonthsForCity();
    } else {
      setFiltersReady(true);
    }

    return () => {
      isMounted = false;
    };
  }, [selectedCity, showMonthFilter]);

  useEffect(() => {
    if (!filtersReady || !onFilterChange) {
      return;
    }
    onFilterChange({ city: selectedCity, month: showMonthFilter ? selectedMonth : null });
  }, [selectedCity, selectedMonth, showMonthFilter, filtersReady, onFilterChange]);

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label className="filter-label">Cidade:</label>
        <select
          className="filter-select"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}, {city.country}
            </option>
          ))}
        </select>
      </div>

      {showMonthFilter && (
        <div className="filter-group">
          <label className="filter-label">Mês:</label>
          <select
            className="filter-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default FilterBar;
