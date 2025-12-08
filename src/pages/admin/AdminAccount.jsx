// AdminAccount Page
// Admin account settings and password change

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import api from '../../utils/api';

const AdminAccount = () => {
  const { user, updateUser } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
                  src={`http://localhost:5000${user.avatarUrl}`}
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

        {/* Account Information */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
              <p className="text-gray-900">{user?.fullName}</p>
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
              <h3 className="text-sm font-medium text-gray-500">Role</h3>
              <p className="text-gray-900 capitalize">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  {user?.currentRole}
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Joined Date</h3>
              <p className="text-gray-900">{user?.createdAt ? formatDate(user.createdAt) : 'No information'}</p>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="card">
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

export default AdminAccount;
