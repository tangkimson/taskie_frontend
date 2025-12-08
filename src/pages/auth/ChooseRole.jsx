// ChooseRole Page
// Allows user to choose or switch their role

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';

const ChooseRole = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setLoading(true);

    const result = await switchRole(selectedRole);

    if (result.success) {
      // Redirect based on role
      if (selectedRole === 'requester') {
        navigate('/requester/tasks');
      } else {
        navigate('/tasker/search');
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">🌱 Taskie</h1>
          <p className="text-gray-600">Hello, {user?.fullName}!</p>
          <p className="text-lg text-gray-700 mt-2">
            {user?.currentRole ? 'Which role would you like to switch to?' : 'Which role would you like to join as?'}
          </p>
        </div>

        {/* Role selection */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Role</h2>

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Requester role */}
              <div
                onClick={() => !loading && setSelectedRole('requester')}
                className={`cursor-pointer rounded-lg border-2 p-6 transition-all ${
                  selectedRole === 'requester'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">👤</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Requester</h3>
                  <p className="text-gray-600 mb-4">Looking for someone to do tasks</p>
                  <ul className="text-sm text-gray-600 text-left space-y-2">
                    <li>✅ Post tasks that need to be done</li>
                    <li>✅ Manage posted tasks</li>
                    <li>✅ Receive messages from workers</li>
                    <li>✅ Edit task information</li>
                  </ul>
                </div>
              </div>

              {/* Tasker role */}
              <div
                onClick={() => !loading && setSelectedRole('tasker')}
                className={`cursor-pointer rounded-lg border-2 p-6 transition-all ${
                  selectedRole === 'tasker'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">💼</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Tasker</h3>
                  <p className="text-gray-600 mb-4">Worker looking to earn extra income</p>
                  <ul className="text-sm text-gray-600 text-left space-y-2">
                    <li>✅ Search for suitable tasks</li>
                    <li>✅ Save favorite tasks</li>
                    <li>✅ Message task posters</li>
                    <li>✅ Filter tasks by area</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !selectedRole}
              className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner size="small" /> : 'Confirm'}
            </button>
          </form>
        </div>

        {/* Back button if user already has a role */}
        {user?.currentRole && (
          <div className="text-center mt-6">
            <button
              onClick={() => navigate(-1)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChooseRole;











