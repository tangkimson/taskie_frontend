// EditTask Page
// Allows requester to edit task (title, description, price only)

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import api from '../../utils/api';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    description: '',
    price: ''
  });
  const [taskTitle, setTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await api.get(`/tasks/${id}`);
      const task = response.data.data;
      
      setTaskTitle(task.title);
      setFormData({
        description: task.description,
        price: task.price
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching task:', err);
      setError('Unable to load task information');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.description || !formData.price) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      await api.put(`/tasks/${id}`, formData);
      setSuccess('Task updated successfully!');
      setTimeout(() => {
        navigate(`/requester/task/${id}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.response?.data?.message || 'Unable to update task');
      setSubmitting(false);
    }
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Task</h1>

        <div className="card">
          <ErrorMessage message={error} />
          <SuccessMessage message={success} />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title - Read Only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title (Cannot be changed)
              </label>
              <input
                type="text"
                value={taskTitle}
                className="input-field bg-gray-100 cursor-not-allowed"
                disabled
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">
                Task title cannot be changed after creation for security reasons.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="input-field"
                disabled={submitting}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (VND) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input-field"
                min="0"
                disabled={submitting}
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 btn-primary flex items-center justify-center"
              >
                {submitting ? <LoadingSpinner size="small" /> : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/requester/task/${id}`)}
                disabled={submitting}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditTask;

