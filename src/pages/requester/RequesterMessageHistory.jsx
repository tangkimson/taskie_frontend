// RequesterMessageHistory Page
// Shows requester's message conversations with taskers

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import api from '../../utils/api';

const RequesterMessageHistory = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data.data);
      setError('');
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Unable to load message history');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays < 7) return `${diffDays} day ago`;
    return date.toLocaleDateString('en-US');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Posted</span>;
      case 'completed':
        return <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Message History</h1>
          <Link 
            to="/requester/tasks" 
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            ← Back to Tasks
          </Link>
        </div>

        {/* Error message */}
        <ErrorMessage message={error} />

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <LoadingSpinner size="large" />
          </div>
        )}

        {/* Empty state */}
        {!loading && conversations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-600 text-lg mb-4">
              You have no conversations with Taskers yet
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Taskers will contact you when they're interested in your tasks
            </p>
            <Link to="/requester/tasks" className="btn-primary inline-block">
              View my tasks
            </Link>
          </div>
        )}

        {/* Conversations list */}
        {!loading && conversations.length > 0 && (
          <div className="space-y-3">
            {conversations.map((conv, index) => (
              <Link
                key={index}
                to={`/messages/${conv.taskId}/${conv.otherUser._id}`}
                className="block"
              >
                <div className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    {/* Avatar and info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        {conv.otherUser.avatarUrl ? (
                          <img
                            src={`http://localhost:5000${conv.otherUser.avatarUrl}`}
                            alt={conv.otherUser.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl text-gray-500">
                            👤
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">
                              {conv.otherUser.fullName}
                            </h3>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              Tasker
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatTime(conv.lastMessageTime)}
                          </span>
                        </div>

                        <p className="text-sm text-primary-600 font-medium mb-2">
                          📋 {conv.taskTitle}
                        </p>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 truncate flex-1">
                            {conv.lastMessage}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex items-center space-x-2">
                          {getStatusBadge(conv.taskStatus)}
                          <button className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors">
                            → View Task
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Info card */}
        {!loading && conversations.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">💡</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Tips for Requesters</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Reply to messages quickly to increase chances of finding suitable Taskers</li>
                  <li>• Provide detailed task information when asked</li>
                  <li>• Check Tasker's profile before deciding to hire</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RequesterMessageHistory;

