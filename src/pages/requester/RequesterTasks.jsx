// RequesterTasks Page
// Shows all tasks created by the requester with filters

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import TaskCard from '../../components/TaskCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import api from '../../utils/api';

const RequesterTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, activeFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks/my');
      setTasks(response.data.data);
      setError('');
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Unable to load task list');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    if (activeFilter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === activeFilter));
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <Link to="/requester/create-task" className="btn-primary">
            ➕ Create New Task
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending ({tasks.filter(t => t.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'completed'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed ({tasks.filter(t => t.status === 'completed').length})
          </button>
        </div>

        {/* Error message */}
        <ErrorMessage message={error} />

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <LoadingSpinner size="large" />
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredTasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg mb-4">
              {activeFilter === 'all' 
                ? 'You have no tasks yet' 
                : activeFilter === 'pending'
                ? 'No pending tasks'
                : 'No completed tasks'}
            </p>
            {activeFilter === 'all' && (
              <Link to="/requester/create-task" className="btn-primary inline-block">
                Create Your First Task
              </Link>
            )}
          </div>
        )}

        {/* Tasks grid */}
        {!loading && filteredTasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                linkPath={`/requester/task/${task._id}`}
                showStatus={true}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RequesterTasks;

