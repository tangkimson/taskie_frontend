// Login Page
// Allows users to login with email or phone

import { useState, useRef } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo and title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
            <span className="text-4xl">🌱</span>
          </div>
          <h1 className="text-4xl font-bold text-primary-600 mb-3">Taskie</h1>
          <p className="text-gray-600 text-base">Connecting task requesters with task workers</p>
        </div>

        {/* Login form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Welcome Back</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">Sign in to continue to your account</p>

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email or Phone input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                Email or Phone Number
              </label>
              <div className="relative">
                <input
                  ref={emailInputRef}
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => {
                    setEmailOrPhone(e.target.value);
                    if (error) setError(''); // Clear error when user starts typing
                  }}
                  className="input-field pl-4 pr-4 py-3 text-base transition-all duration-200 hover:border-primary-400"
                  placeholder="Enter email or phone number"
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(''); // Clear error when user starts typing
                  }}
                  className="input-field pl-4 pr-4 py-3 text-base transition-all duration-200 hover:border-primary-400"
                  placeholder="Enter your password"
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center py-3.5 text-base font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:shadow-md"
            >
              {loading ? <LoadingSpinner size="small" /> : 'Sign In'}
            </button>
          </form>

          {/* Demo account for testing */}
          <div className="mt-4">
            <p className="text-[10px] text-gray-500 text-center leading-relaxed">
              Admin account: <span className="font-medium">admin@taskie.com</span> / <span className="font-medium">password123</span>
            </p>
          </div>

          {/* Register link */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;





