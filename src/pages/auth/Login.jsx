// Login Page
// Allows users to login with email or phone

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailInputRef = useRef(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!emailOrPhone || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const result = await login(emailOrPhone, password);

      if (result && result.success) {
        // Redirect based on role
        if (!result.user.currentRole) {
          navigate('/choose-role');
        } else if (result.user.currentRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (result.user.currentRole === 'requester') {
          navigate('/requester/tasks');
        } else if (result.user.currentRole === 'tasker') {
          navigate('/tasker/search');
        }
      } else {
        // Clear password for security when login fails
        setPassword('');
        setError(result?.message || 'Login failed. Please try again.');
        // Focus on email input to help user retry
        setTimeout(() => {
          emailInputRef.current?.focus();
        }, 100);
      }
    } catch (error) {
      console.error('Login error:', error);
      // Clear password for security when error occurs
      setPassword('');
      setError('An error occurred. Please try again later.');
      // Focus on email input to help user retry
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">🌱 Taskie</h1>
          <p className="text-gray-600">Connecting task requesters with task workers</p>
        </div>

        {/* Login form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email or Phone input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email or Phone Number *
              </label>
              <input
                ref={emailInputRef}
                type="text"
                value={emailOrPhone}
                onChange={(e) => {
                  setEmailOrPhone(e.target.value);
                  if (error) setError(''); // Clear error when user starts typing
                }}
                className="input-field"
                placeholder="Enter email or phone number"
                disabled={loading}
                autoComplete="username"
              />
            </div>

            {/* Password input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(''); // Clear error when user starts typing
                }}
                className="input-field"
                placeholder="Enter password"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {loading ? <LoadingSpinner size="small" /> : 'Login'}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Register now
            </Link>
          </p>
        </div>

        {/* Demo credentials info */}
        <div className="mt-6 bg-white rounded-lg shadow p-4 text-sm text-gray-600">
          <p className="font-semibold mb-2">Demo account:</p>
          <p>Admin: admin@taskie.com / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;





