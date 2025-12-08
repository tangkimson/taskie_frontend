// TaskerSearch Page
// Allows tasker to search and filter tasks

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import TaskCard from '../../components/TaskCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import api from '../../utils/api';

const getInitialFilters = () => ({
  keyword: '',
  category: '',
  province: '',
  ward: '',
  minPrice: '',
  maxPrice: ''
});

const TaskerSearch = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [wards, setWards] = useState([]);
  const [filters, setFilters] = useState(getInitialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favoritedTaskIds, setFavoritedTaskIds] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchLocations();
    fetchFavorites();
    searchTasks();
  }, []);

  useEffect(() => {
    if (filters.province && locations.length > 0) {
      const location = locations.find(loc => loc.province === filters.province);
      if (location) {
        setWards(location.wards);
      } else {
        setWards([]);
      }
    } else {
      setWards([]);
    }
  }, [filters.province, locations]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await api.get('/locations');
      setLocations(response.data.data);
    } catch (err) {
      console.error('Error fetching locations:', err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      const favIds = response.data.data.map(fav => fav.taskId._id);
      setFavoritedTaskIds(favIds);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const searchTasks = async (overrideFilters) => {
    setLoading(true);
    setError('');

    try {
      // Build query params
      const params = {};
      const activeFilters = overrideFilters || filters;
      if (activeFilters.keyword) params.keyword = activeFilters.keyword;
      if (activeFilters.category) params.category = activeFilters.category;
      if (activeFilters.province) params.province = activeFilters.province;
      if (activeFilters.ward) params.ward = activeFilters.ward;
      if (activeFilters.minPrice) params.minPrice = activeFilters.minPrice;
      if (activeFilters.maxPrice) params.maxPrice = activeFilters.maxPrice;

      const response = await api.get('/tasks/search', { params });
      setTasks(response.data.data);
    } catch (err) {
      console.error('Error searching tasks:', err);
      setError('Unable to search tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = {
      ...filters,
      [name]: value
    };

    if (name === 'province') {
      updatedFilters.ward = '';
      if (!value) {
        setWards([]);
      }
    }

    setFilters(updatedFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchTasks();
  };

  const handleResetFilters = () => {
    const resetFilters = getInitialFilters();
    setFilters(resetFilters);
    setWards([]);
    searchTasks(resetFilters);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Tasks</h1>

        {/* Search and Filter Form */}
        <div className="card mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Keyword search */}
            <div>
              <input
                type="text"
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
                placeholder="🔍 Search by keyword..."
                className="input-field"
              />
            </div>

            {/* Filters row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category */}
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Province */}
              <select
                name="province"
                value={filters.province}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Provinces/Cities</option>
                {locations.map(loc => (
                  <option key={loc._id} value={loc.province}>
                    {loc.province}
                  </option>
                ))}
              </select>

              {/* Ward */}
              <select
                name="ward"
                value={filters.ward}
                onChange={handleFilterChange}
                className="input-field"
                disabled={!filters.province}
              >
                <option value="">All Wards/Communes</option>
                {wards.map((ward, index) => (
                  <option key={index} value={ward}>
                    {ward}
                  </option>
                ))}
              </select>
            </div>

            {/* Price range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min Price (VND)"
                className="input-field"
                min="0"
              />
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max Price (VND)"
                className="input-field"
                min="0"
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button type="submit" className="flex-1 btn-primary">
                🔍 Search
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn-secondary"
              >
                🔄 Reset
              </button>
            </div>
          </form>
        </div>

        {/* Error message */}
        <ErrorMessage message={error} />

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <LoadingSpinner size="large" />
          </div>
        )}

        {/* Results count */}
        {!loading && (
          <p className="text-gray-600 mb-4">
            Found <span className="font-semibold">{tasks.length}</span> task(s)
          </p>
        )}

        {/* Empty state */}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">
              No matching tasks found
            </p>
          </div>
        )}

        {/* Tasks grid */}
        {!loading && tasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map(task => {
              const isFavorited = favoritedTaskIds.includes(task._id);
              return (
                <div key={task._id} className="relative">
                  <TaskCard
                    task={task}
                    linkPath={`/tasker/task/${task._id}`}
                    showStatus={false}
                  />
                  {isFavorited && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg" title="Favorited">
                      ❤️
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TaskerSearch;

