// CreateTask Page
// Allows requester to create a new task

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import api from '../../utils/api';

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    province: 'Hue City',
    ward: '',
    price: '',
    deadline: ''
  });
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [wards, setWards] = useState([]);
  const [postingFee, setPostingFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [createdTaskId, setCreatedTaskId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchLocations();
  }, []);

  useEffect(() => {
    if (formData.province && locations.length > 0) {
      const location = locations.find(loc => loc.province === formData.province);
      if (location) {
        setWards(location.wards);
      }
    }
  }, [formData.province, locations]);

  useEffect(() => {
    if (formData.category && categories.length > 0) {
      const category = categories.find(cat => cat.name === formData.category);
      if (category) {
        setPostingFee(category.postingFee);
      }
    }
  }, [formData.category, categories]);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate required fields
    if (!formData.title || !formData.description || !formData.category || 
        !formData.ward || !formData.price || !formData.deadline) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate images
    if (images.length < 2) {
      setError('Please upload at least 2 images');
      return;
    }

    setLoading(true);

    try {
      // Create task
      const taskData = new FormData();
      taskData.append('title', formData.title);
      taskData.append('description', formData.description);
      taskData.append('category', formData.category);
      taskData.append('location', JSON.stringify({
        province: formData.province,
        ward: formData.ward
      }));
      taskData.append('price', formData.price);
      taskData.append('deadline', formData.deadline);

      // Append images
      images.forEach(image => {
        taskData.append('images', image);
      });

      const response = await api.post('/tasks', taskData);

      if (response.data.success) {
        setSuccess('Task created successfully!');
        setCreatedTaskId(response.data.data._id);
      }
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.message || 'Unable to create task');
    } finally {
      setLoading(false);
    }
  };

  // If task created successfully, show payment proof upload
  if (createdTaskId) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <SuccessMessage message="Task created successfully!" />
          
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Payment Proof</h2>
            <p className="text-gray-600 mb-4">
              Posting Fee: <span className="text-xl font-bold text-primary-600">
                {postingFee.toLocaleString('en-US')} ₫
              </span>
            </p>
            <PaymentProofUpload taskId={createdTaskId} onSuccess={() => navigate('/requester/tasks')} />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Task</h1>

        <div className="card">
          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Assemble IKEA Bookshelf"
                disabled={loading}
              />
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
                placeholder="Describe the task in detail..."
                disabled={loading}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Province/City *
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="input-field"
                  disabled={loading}
                >
                  {locations.map(loc => (
                    <option key={loc._id} value={loc.province}>
                      {loc.province}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ward/Commune *
                </label>
                <select
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  className="input-field"
                  disabled={loading}
                >
                  <option value="">Select ward/commune</option>
                  {wards.map((ward, index) => (
                    <option key={index} value={ward}>
                      {ward}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Images * (Minimum 2 images)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="input-field"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Selected: {images.length} image(s)
              </p>
            </div>

            {/* Price and Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="100000"
                  min="0"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline *
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Posting Fee Display */}
            {postingFee > 0 && (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  Posting Fee: <span className="text-lg font-bold text-primary-600">
                    {postingFee.toLocaleString('en-US')} ₫
                  </span>
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary flex items-center justify-center"
              >
                {loading ? <LoadingSpinner size="small" /> : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/requester/tasks')}
                disabled={loading}
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

// Payment Proof Upload Component
const PaymentProofUpload = ({ taskId, onSuccess }) => {
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setProofFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!proofFile) {
      setError('Please select a payment proof file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('paymentProof', proofFile);

      await api.post(`/tasks/${taskId}/payment-proof`, formData);

      onSuccess();
    } catch (err) {
      console.error('Error uploading payment proof:', err);
      setError('Unable to upload payment proof');
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onSuccess();
  };

  return (
    <div className="space-y-4">
      <ErrorMessage message={error} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Proof (Transaction Screenshot)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="input-field"
          disabled={loading}
        />
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleUpload}
          disabled={loading}
          className="flex-1 btn-primary flex items-center justify-center"
        >
          {loading ? <LoadingSpinner size="small" /> : 'Upload'}
        </button>
        <button
          onClick={handleSkip}
          disabled={loading}
          className="flex-1 btn-secondary"
        >
          Skip
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Payment proof will be automatically approved
      </p>
    </div>
  );
};

export default CreateTask;

