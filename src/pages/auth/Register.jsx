// Register Page
// Allows new users to create an account

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [proofFile, setProofFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setProofFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.fullName || !formData.dateOfBirth || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    // Check if at least email or phone is provided
    if (!formData.email && !formData.phone) {
      setError('Please provide email or phone number');
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Password confirmation does not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append('fullName', formData.fullName);
    submitData.append('dateOfBirth', formData.dateOfBirth);
    if (formData.email) submitData.append('email', formData.email);
    if (formData.phone) submitData.append('phone', formData.phone);
    submitData.append('password', formData.password);
    submitData.append('confirmPassword', formData.confirmPassword);
    if (proofFile) submitData.append('proofOfExperience', proofFile);

    const result = await register(submitData);

    if (result.success) {
      navigate('/choose-role');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">🌱 Taskie</h1>
          <p className="text-gray-600">Create a new account</p>
        </div>

        {/* Register form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Register</h2>

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            {/* Date of birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              />
            </div>

            {/* Proof of experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload proof of experience (student ID, CV, etc.)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="input-field"
                accept=".jpg,.jpeg,.png,.pdf"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Accepted: JPG, PNG, PDF (Max 5MB)
              </p>
            </div>

            {/* Email and Phone (at least one required) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="example@email.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0123456789"
                  disabled={loading}
                />
              </div>
            </div>

            <p className="text-xs text-gray-500">
              * At least one of Email or Phone Number is required
            </p>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="At least 6 characters"
                disabled={loading}
              />
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Re-enter password"
                disabled={loading}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {loading ? <LoadingSpinner size="small" /> : 'Register'}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;











