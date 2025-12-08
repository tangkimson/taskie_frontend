// AdminDashboard Page
// Shows admin panel with users, tasks, and statistics

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('stats'); // stats, users, tasks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, tasksRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/tasks')
      ]);

      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setTasks(tasksRes.data.data);
      setError('');
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Unable to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">System Management</h1>

        <ErrorMessage message={error} />

        {/* Tabs */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'stats'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📊 Statistics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            👥 Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'tasks'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📋 Tasks ({tasks.length})
          </button>
        </div>

        {/* Statistics Tab */}
        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Stats */}
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Users</h3>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-blue-600">{stats.users.total}</p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Requesters: {stats.users.requesters}</p>
                  <p>Taskers: {stats.users.taskers}</p>
                  <p>Admins: {stats.users.admins}</p>
                  <p className="text-green-600 font-medium">New (7 days): +{stats.users.recent}</p>
                </div>
              </div>
            </div>

            {/* Task Stats */}
            <div className="card bg-gradient-to-br from-green-50 to-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Tasks</h3>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-green-600">{stats.tasks.total}</p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Pending: {stats.tasks.pending}</p>
                  <p>Completed: {stats.tasks.completed}</p>
                  <p className="text-green-600 font-medium">New (7 days): +{stats.tasks.recent}</p>
                </div>
              </div>
            </div>

            {/* Message Stats */}
            <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💬 Messages</h3>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-purple-600">{stats.messages.total}</p>
                <div className="text-sm text-gray-600">
                  <p>Total messages in system</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email / Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Joined Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {user.email || user.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.currentRole === 'admin' ? 'bg-red-100 text-red-800' :
                        user.currentRole === 'requester' ? 'bg-blue-100 text-blue-800' :
                        user.currentRole === 'tasker' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.currentRole || 'Not selected'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="card overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Posted By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Posted Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {task.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{task.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {task.requester?.fullName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {task.price.toLocaleString('vi-VN')} ₫
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(task.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;

