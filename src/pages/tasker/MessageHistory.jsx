// MessageHistory Page
// Shows tasker's message conversations

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import api, { getBaseURL } from '../../utils/api';

const MessageHistory = () => {
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
        return <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>;
      case 'completed':
        return <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Message History</h1>

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
            <p className="text-gray-600 text-lg mb-4">
              You have no conversations yet
            </p>
            <Link to="/tasker/search" className="btn-primary inline-block">
              Search Tasks
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
                            src={`${getBaseURL()}${conv.otherUser.avatarUrl}`}
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
                          <h3 className="font-semibold text-gray-900">
                            {conv.otherUser.fullName}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTime(conv.lastMessageTime)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          {conv.taskTitle}
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

                        <div className="mt-2">
                          {getStatusBadge(conv.taskStatus)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MessageHistory;

