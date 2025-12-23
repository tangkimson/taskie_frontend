// Favorites Page
// Shows tasker's favorite tasks

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import ConfirmDialog from '../../components/ConfirmDialog';
import api, { getBaseURL } from '../../utils/api';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [taskToRemove, setTaskToRemove] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      setFavorites(response.data.data);
      setError('');
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Unable to load favorites list');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveClick = (taskId, taskTitle) => {
    setTaskToRemove({ id: taskId, title: taskTitle });
    setShowRemoveConfirm(true);
  };

  const handleRemoveFavorite = async () => {
    if (!taskToRemove) return;

    setRemovingId(taskToRemove.id);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/favorites/${taskToRemove.id}`);
      setFavorites(favorites.filter(fav => fav.taskId._id !== taskToRemove.id));
      setSuccess('Removed from favorites');
      setShowRemoveConfirm(false);
      setTaskToRemove(null);
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('Unable to remove from favorites');
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Favorite Tasks</h1>

        {/* Error and Success messages */}
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <LoadingSpinner size="large" />
          </div>
        )}

        {/* Empty state */}
        {!loading && favorites.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg mb-4">
              You have no favorite tasks yet
            </p>
            <Link to="/tasker/search" className="btn-primary inline-block">
              Search for tasks
            </Link>
          </div>
        )}

        {/* Favorites grid */}
        {!loading && favorites.length > 0 && (
          <>
            <p className="text-gray-600 mb-4">
              <span className="font-semibold">{favorites.length}</span> favorite task(s)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map(favorite => (
                <div key={favorite._id} className="relative">
                  <Link to={`/tasker/task/${favorite.taskId._id}`} className="block">
                    <div className="card hover:shadow-lg transition-shadow cursor-pointer">
                      {/* Task image */}
                      {favorite.taskId.images && favorite.taskId.images.length > 0 && (
                        <img
                          src={`${getBaseURL()}${favorite.taskId.images[0]}`}
                          alt={favorite.taskId.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                          }}
                        />
                      )}

                      {/* Task title */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{favorite.taskId.title}</h3>

                      {/* Task category and location */}
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded mr-2">
                          {favorite.taskId.category}
                        </span>
                        <span>📍 {favorite.taskId.location.ward}, {favorite.taskId.location.province}</span>
                      </div>

                      {/* Task description (truncated) */}
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {favorite.taskId.description}
                      </p>

                      {/* Price and deadline */}
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <span className="text-2xl font-bold text-primary-600">
                            {favorite.taskId.price.toLocaleString('en-US')} ₫
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Deadline: {formatDate(favorite.taskId.deadline)}
                        </div>
                      </div>

                      {/* Requester info */}
                      {favorite.taskId.requester && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            Posted by: <span className="font-medium">{favorite.taskId.requester.fullName}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  {/* Remove from favorites button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveClick(favorite.taskId._id, favorite.taskId.title);
                    }}
                    disabled={removingId === favorite.taskId._id}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50"
                    title="Remove from favorites"
                  >
                    {removingId === favorite.taskId._id ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      '❌'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Remove Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showRemoveConfirm}
          onClose={() => {
            setShowRemoveConfirm(false);
            setTaskToRemove(null);
          }}
          onConfirm={handleRemoveFavorite}
          title="Remove from Favorites"
          message={`Are you sure you want to remove "${taskToRemove?.title}" from your favorites?`}
          confirmText="Yes, Remove"
          cancelText="No, Keep It"
          confirmButtonClass="bg-red-500 hover:bg-red-600"
          isLoading={removingId !== null}
        />
      </div>
    </Layout>
  );
};

export default Favorites;





