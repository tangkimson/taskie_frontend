// RequesterProfile Page
// Shows and allows editing of requester profile and account settings

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import api, { getBaseURL } from '../../utils/api';

const RequesterProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    email: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File too large! Please select an image under 5MB');
        e.target.value = '';
        return;
      }
      setAvatarFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.fullName || !formData.dateOfBirth) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Update profile info
      const response = await api.put('/profile', formData);
      
      if (response.data.success) {
        updateUser(response.data.data);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Unable to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await api.post('/profile/avatar', formData);

      if (response.data.success) {
        updateUser({ avatarUrl: response.data.data.avatarUrl });
        setSuccess('Avatar updated successfully!');
        setAvatarFile(null);
        // Reset file input
        document.querySelector('input[type="file"]').value = '';
      }
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError(err.response?.data?.message || 'Unable to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await api.put('/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.data.success) {
        setSuccess('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.message || 'Unable to change password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Account</h1>

        <ErrorMessage message={error} />
        <SuccessMessage message={success} />

        {/* Avatar Section */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Avatar</h2>
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
              {user?.avatarUrl ? (
                <img
                  src={`${getBaseURL()}${user.avatarUrl}`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500">
                  👤
                </div>
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="input-field mb-2"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mb-2">
                Select image under 5MB (JPG, PNG, GIF)
              </p>
              <button
                onClick={handleAvatarUpload}
                disabled={loading || !avatarFile}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="small" /> : 'Upload'}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary"
              >
                ✏️ Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  disabled={loading}
                />
              </div>

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
                  disabled={loading}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary flex items-center justify-center"
                >
                  {loading ? <LoadingSpinner size="small" /> : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                <p className="text-gray-900">{user?.fullName}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                <p className="text-gray-900">{user?.dateOfBirth ? formatDate(user.dateOfBirth) : 'Not updated'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-gray-900">{user?.email || 'Not updated'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                <p className="text-gray-900">{user?.phone || 'Not updated'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Current Role</h3>
                <p className="text-gray-900 capitalize">{user?.currentRole}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Joined Date</h3>
                <p className="text-gray-900">{user?.createdAt ? formatDate(user.createdAt) : 'No information'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Change Password Section */}
        <div className="card mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔒 Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password *
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="input-field"
                disabled={loading}
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password *
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="input-field"
                disabled={loading}
                placeholder="Enter new password (minimum 6 characters)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="input-field"
                disabled={loading}
                placeholder="Re-enter new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? <LoadingSpinner size="small" /> : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Security Tips */}
        <div className="card mt-6 bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-2">💡 Security Tips</h3>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>Use a strong password with at least 8 characters</li>
            <li>Combine uppercase, lowercase, numbers and special characters</li>
            <li>Don't use the same password as other accounts</li>
            <li>Change your password regularly to ensure security</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default RequesterProfile;

