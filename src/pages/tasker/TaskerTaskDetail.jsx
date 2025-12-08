// TaskerTaskDetail Page
// Shows detailed task information for tasker

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import ConfirmDialog from '../../components/ConfirmDialog';
import BackButton from '../../components/BackButton';
import api from '../../utils/api';

const TaskerTaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [task, setTask] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRemoveFavoriteConfirm, setShowRemoveFavoriteConfirm] = useState(false);
  const [favoriteActionLoading, setFavoriteActionLoading] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false); // Hidden by default

  useEffect(() => {
    fetchTask();
    checkFavorite();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await api.get(`/tasks/${id}`);
      setTask(response.data.data);
    } catch (err) {
      console.error('Error fetching task:', err);
      setError('Unable to load task information');
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const response = await api.get(`/favorites/check/${id}`);
      setIsFavorited(response.data.data.isFavorited);
    } catch (err) {
      console.error('Error checking favorite:', err);
    }
  };

  const handleFavoriteToggle = async () => {
    if (isFavorited) {
      // Show confirmation for removal
      setShowRemoveFavoriteConfirm(true);
    } else {
      // Add to favorites directly
      await addToFavorites();
    }
  };

  const addToFavorites = async () => {
    setFavoriteActionLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await api.post('/favorites', { taskId: id });
      setIsFavorited(true);
      setSuccess('Added to favorites');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error adding to favorites:', err);
      setError('Unable to add to favorites');
    } finally {
      setFavoriteActionLoading(false);
    }
  };

  const removeFromFavorites = async () => {
    setFavoriteActionLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await api.delete(`/favorites/${id}`);
      setIsFavorited(false);
      setSuccess('Removed from favorites');
      setShowRemoveFavoriteConfirm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError('Unable to remove from favorites');
    } finally {
      setFavoriteActionLoading(false);
    }
  };

  const handleMessage = () => {
    navigate(`/messages/${id}/${task.requester._id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const maskEmail = (email) => {
    if (!email) return '';
    return '***************';
  };

  const maskPhone = (phone) => {
    if (!phone) return '';
    return '***********';
  };

  const toggleContactInfo = () => {
    setShowContactInfo(!showContactInfo);
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

  if (!task) {
    return (
      <Layout>
        <ErrorMessage message="Task not found" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <BackButton />

        <ErrorMessage message={error} />
        <SuccessMessage message={success} />

        {/* Task Details */}
        <div className="card mb-6">
          {/* Header with actions */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
            <div className="flex space-x-2">
              <button
                onClick={handleFavoriteToggle}
                disabled={favoriteActionLoading}
                className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                  isFavorited
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {favoriteActionLoading ? (
                  <LoadingSpinner size="small" />
                ) : isFavorited ? (
                  '❤️ Favorited'
                ) : (
                  '🤍 Favorite'
                )}
              </button>
              <button
                onClick={handleMessage}
                className="btn-primary"
              >
                💬 Message
              </button>
            </div>
          </div>

          {/* Images */}
          {task.images && task.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {task.images.map((img, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000${img}`}
                  alt={`Task ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
              ))}
            </div>
          )}

          {/* Task Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{task.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Category</h3>
                <p className="text-gray-600">{task.category}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">Location</h3>
                <p className="text-gray-600">{task.location.ward}, {task.location.province}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">Price</h3>
                <p className="text-2xl font-bold text-primary-600">
                  {task.price.toLocaleString('en-US')} ₫
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">Deadline</h3>
                <p className="text-gray-600">{formatDate(task.deadline)}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">Posted Date</h3>
                <p className="text-gray-600">{formatDate(task.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Requester Information */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Requester Information</h2>
            <button
              onClick={toggleContactInfo}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
              title={showContactInfo ? "Hide contact details" : "Show contact details"}
            >
              <span>{showContactInfo ? '🙈' : '👁️'}</span>
              <span>{showContactInfo ? 'Hide Contact' : 'Show Contact'}</span>
            </button>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {task.requester.avatarUrl ? (
                <img
                  src={`http://localhost:5000${task.requester.avatarUrl}`}
                  alt={task.requester.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl text-gray-500">
                  👤
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{task.requester.fullName}</h3>
              {task.requester.email && (
                <p className="text-gray-600 text-sm">
                  📧 {showContactInfo ? task.requester.email : maskEmail(task.requester.email)}
                </p>
              )}
              {task.requester.phone && (
                <p className="text-gray-600 text-sm">
                  📱 {showContactInfo ? task.requester.phone : maskPhone(task.requester.phone)}
                </p>
              )}
              <button
                onClick={handleMessage}
                className="mt-3 btn-primary"
              >
                💬 Contact Now
              </button>
            </div>
          </div>
        </div>

        {/* Remove from Favorites Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showRemoveFavoriteConfirm}
          onClose={() => setShowRemoveFavoriteConfirm(false)}
          onConfirm={removeFromFavorites}
          title="Remove from Favorites"
          message={`Are you sure you want to remove "${task?.title}" from your favorites?`}
          confirmText="Yes, Remove"
          cancelText="No, Keep It"
          confirmButtonClass="bg-red-500 hover:bg-red-600"
          isLoading={favoriteActionLoading}
        />
      </div>
    </Layout>
  );
};

export default TaskerTaskDetail;

