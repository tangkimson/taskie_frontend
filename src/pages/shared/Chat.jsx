// Chat Page
// Shows conversation between two users about a specific task

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import BackButton from '../../components/BackButton';
import api, { getBaseURL } from '../../utils/api';

const Chat = () => {
  const { taskId, userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [task, setTask] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversation();
    // Auto-refresh messages every 5 seconds
    const interval = setInterval(fetchConversation, 5000);
    return () => clearInterval(interval);
  }, [taskId, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversation = async () => {
    try {
      const response = await api.get(`/messages/${taskId}/${userId}`);
      setMessages(response.data.data.messages);
      setTask(response.data.data.task);
      
      // Determine other user
      if (response.data.data.messages.length > 0) {
        const firstMsg = response.data.data.messages[0];
        const otherUserData = firstMsg.sender._id === user._id 
          ? firstMsg.receiver 
          : firstMsg.sender;
        setOtherUser(otherUserData);
      }
      
      setError('');
    } catch (err) {
      console.error('Error fetching conversation:', err);
      setError('Unable to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    setSending(true);
    setError('');

    try {
      const response = await api.post('/messages', {
        taskId,
        receiverId: userId,
        content: newMessage.trim()
      });

      if (response.data.success) {
        setMessages([...messages, response.data.data]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Unable to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / 86400000);

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US') + ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <BackButton />

        {/* Chat container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Chat header */}
          <div className="bg-primary-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex-shrink-0">
                  {otherUser?.avatarUrl ? (
                    <img
                      src={`${getBaseURL()}${otherUser.avatarUrl}`}
                      alt={otherUser.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl text-gray-500">
                      👤
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    {otherUser?.fullName || 'Loading...'}
                  </h2>
                  {task && (
                    <p className="text-xs text-primary-100 mt-0.5">
                      📋 {task.title}
                    </p>
                  )}
                </div>
              </div>
              {task && (
                <button
                  onClick={() => navigate(
                    user.currentRole === 'requester' 
                      ? `/requester/task/${taskId}` 
                      : `/tasker/task/${taskId}`
                  )}
                  className="bg-primary-500 hover:bg-primary-700 px-4 py-2 rounded text-sm transition-colors font-medium"
                >
                  👁️ View Task
                </button>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4">
              <ErrorMessage message={error} />
            </div>
          )}

          {/* Messages area */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <div className="text-5xl mb-3">💬</div>
                <p className="font-medium">No messages yet</p>
                <p className="text-sm mt-1">Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isMe = message.sender._id === user._id;
                  const showAvatar = index === 0 || messages[index - 1].sender._id !== message.sender._id;
                  
                  return (
                    <div
                      key={message._id}
                      className={`flex items-end ${isMe ? 'justify-end' : 'justify-start'} gap-2`}
                    >
                      {!isMe && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                          {showAvatar ? (
                            otherUser?.avatarUrl ? (
                              <img
                                src={`${getBaseURL()}${otherUser.avatarUrl}`}
                                alt={otherUser.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                                👤
                              </div>
                            )
                          ) : (
                            <div className="w-full h-full"></div>
                          )}
                        </div>
                      )}
                      
                      <div className={`max-w-xs lg:max-w-md`}>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            isMe
                              ? 'bg-primary-600 text-white rounded-br-sm'
                              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                          }`}
                        >
                          <p className="break-words">{message.content}</p>
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>

                      {isMe && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                          {showAvatar ? (
                            user?.avatarUrl ? (
                              <img
                                src={`${getBaseURL()}${user.avatarUrl}`}
                                alt={user.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                                👤
                              </div>
                            )
                          ) : (
                            <div className="w-full h-full"></div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white">
            <div className="flex items-end space-x-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Type message... (Enter to send, Shift+Enter for new line)"
                className="flex-1 input-field resize-none"
                rows="2"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3"
              >
                {sending ? <LoadingSpinner size="small" /> : '📤'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Press Enter to send message, Shift+Enter for new line
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;

