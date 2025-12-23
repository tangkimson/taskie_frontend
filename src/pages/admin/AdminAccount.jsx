// AdminAccount Page
// Admin account settings and password change

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import api, { getBaseURL } from '../../utils/api';

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
  const [dbLoading, setDbLoading] = useState(false);
  const [dbAction, setDbAction] = useState('');

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

  const handleDatabaseAction = async (action, comprehensive = false) => {
    // Check if we're on production
    const isProduction = import.meta.env.VITE_API_URL && 
                         !import.meta.env.VITE_API_URL.includes('localhost');
    
    const actionNames = {
      'reset': 'XÓA TẤT CẢ DỮ LIỆU',
      'seed': 'SEED DỮ LIỆU TEST',
      'reset-and-seed': 'RESET VÀ SEED'
    };
    
    let confirmMessage = `⚠️ BẠN CÓ CHẮC CHẮN MUỐN ${actionNames[action]}?\n\n`;
    
    if (isProduction) {
      confirmMessage += `🚨 CẢNH BÁO: Bạn đang ở PRODUCTION!\n`;
      confirmMessage += `- Hành động này sẽ ảnh hưởng đến database PRODUCTION\n`;
      confirmMessage += `- Tất cả dữ liệu thật sẽ bị xóa\n`;
      confirmMessage += `- Hành động này KHÔNG THỂ hoàn tác!\n\n`;
    } else {
      confirmMessage += `📍 Bạn đang ở LOCAL DEVELOPMENT\n\n`;
    }
    
    confirmMessage += `Hành động: ${actionNames[action]}\n`;
    if (action === 'seed' || action === 'reset-and-seed') {
      confirmMessage += `Loại seed: ${comprehensive ? 'Đầy đủ (Users, Tasks, Messages, Favorites)' : 'Cơ bản (Categories, Locations, Admin)'}\n\n`;
    }
    confirmMessage += `Bạn có chắc chắn muốn tiếp tục?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    // Double confirmation for production reset
    if (isProduction && (action === 'reset' || action === 'reset-and-seed')) {
      const doubleConfirm = window.prompt(
        `🚨 XÁC NHẬN LẦN CUỐI!\n\n` +
        `Bạn đang sắp XÓA TẤT CẢ dữ liệu PRODUCTION!\n\n` +
        `Để xác nhận, vui lòng gõ "DELETE PRODUCTION" (chính xác):`
      );
      
      if (doubleConfirm !== 'DELETE PRODUCTION') {
        setError('Hành động đã bị hủy. Bạn chưa xác nhận đúng.');
        return;
      }
    }

    setDbLoading(true);
    setDbAction(action);
    setError('');
    setSuccess('');

    try {
      let endpoint = '';
      let body = {};

      if (action === 'reset') {
        endpoint = '/admin/reset';
      } else if (action === 'seed') {
        endpoint = '/admin/seed';
        body = { comprehensive };
      } else if (action === 'reset-and-seed') {
        endpoint = '/admin/reset-and-seed';
        body = { comprehensive };
      }

      const response = await api.post(endpoint, body);

      if (response.data.success) {
        let message = '';
        if (action === 'reset') {
          message = '✅ Database đã được reset thành công!';
        } else if (action === 'seed') {
          message = comprehensive 
            ? '✅ Database đã được seed với dữ liệu test đầy đủ!'
            : '✅ Database đã được seed với dữ liệu cơ bản!';
        } else {
          message = comprehensive
            ? '✅ Database đã được reset và seed với dữ liệu test đầy đủ!'
            : '✅ Database đã được reset và seed với dữ liệu cơ bản!';
        }
        setSuccess(message);
        
        // Reload page after 2 seconds to see new data
        if (action === 'reset-and-seed' || action === 'seed') {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }
    } catch (err) {
      console.error('Database action error:', err);
      setError(err.response?.data?.message || `Không thể thực hiện ${action}. Vui lòng thử lại.`);
    } finally {
      setDbLoading(false);
      setDbAction('');
    }
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

        {/* Database Management */}
        <div className="card mt-6 border-red-200 bg-red-50">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🗄️ Database Management</h2>
          <p className="text-sm text-gray-700 mb-4">
            <strong className="text-red-600">⚠️ CẢNH BÁO:</strong> Các thao tác này sẽ ảnh hưởng đến toàn bộ database. Chỉ sử dụng khi cần thiết!
          </p>
          
          <div className="space-y-3">
            {/* Reset Database */}
            <div className="p-4 bg-white rounded-lg border border-red-200">
              <h3 className="font-semibold text-gray-900 mb-2">Reset Database</h3>
              <p className="text-sm text-gray-600 mb-3">
                Xóa TẤT CẢ dữ liệu trong database (users, tasks, messages, favorites, categories, locations)
              </p>
              <button
                onClick={() => handleDatabaseAction('reset')}
                disabled={dbLoading}
                className="btn-danger disabled:opacity-50"
              >
                {dbLoading && dbAction === 'reset' ? <LoadingSpinner size="small" /> : '🗑️ Reset Database'}
              </button>
            </div>

            {/* Seed Database */}
            <div className="p-4 bg-white rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-gray-900 mb-2">Seed Database</h3>
              <p className="text-sm text-gray-600 mb-3">
                Thêm dữ liệu test vào database (không xóa dữ liệu hiện có)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDatabaseAction('seed', false)}
                  disabled={dbLoading}
                  className="btn-secondary disabled:opacity-50 flex-1"
                >
                  {dbLoading && dbAction === 'seed' ? <LoadingSpinner size="small" /> : '📝 Seed Cơ Bản'}
                </button>
                <button
                  onClick={() => handleDatabaseAction('seed', true)}
                  disabled={dbLoading}
                  className="btn-primary disabled:opacity-50 flex-1"
                >
                  {dbLoading && dbAction === 'seed' ? <LoadingSpinner size="small" /> : '🌱 Seed Đầy Đủ'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <strong>Seed Cơ Bản:</strong> Categories, Locations, Admin user<br/>
                <strong>Seed Đầy Đủ:</strong> + Users, Tasks, Messages, Favorites
              </p>
            </div>

            {/* Reset and Seed */}
            <div className="p-4 bg-white rounded-lg border border-orange-200">
              <h3 className="font-semibold text-gray-900 mb-2">Reset & Seed (Khuyến nghị)</h3>
              <p className="text-sm text-gray-600 mb-3">
                Xóa tất cả dữ liệu và seed lại với dữ liệu test mới
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDatabaseAction('reset-and-seed', false)}
                  disabled={dbLoading}
                  className="btn-secondary disabled:opacity-50 flex-1"
                >
                  {dbLoading && dbAction === 'reset-and-seed' ? <LoadingSpinner size="small" /> : '🔄 Reset & Seed Cơ Bản'}
                </button>
                <button
                  onClick={() => handleDatabaseAction('reset-and-seed', true)}
                  disabled={dbLoading}
                  className="btn-primary disabled:opacity-50 flex-1"
                >
                  {dbLoading && dbAction === 'reset-and-seed' ? <LoadingSpinner size="small" /> : '🔄 Reset & Seed Đầy Đủ'}
                </button>
              </div>
            </div>
          </div>
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
