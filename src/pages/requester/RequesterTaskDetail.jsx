// RequesterTaskDetail Page
// Shows detailed task information for requester

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import ConfirmDialog from '../../components/ConfirmDialog';
import BackButton from '../../components/BackButton';
import api, { getBaseURL } from '../../utils/api';

const RequesterTaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [uploadingPayment, setUploadingPayment] = useState(false);
  const [showPaymentProof, setShowPaymentProof] = useState(false);

  useEffect(() => {
    fetchTask();
    fetchConversations();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await api.get(`/tasks/${id}`);
      setTask(response.data.data);
    } catch (err) {
      console.error('Error fetching task:', err);
      setError('Unable to load task information');
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      // Filter conversations for this specific task
      const taskConversations = response.data.data.filter(
        conv => conv.taskId === id
      );
      setConversations(taskConversations);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${id}`);
      navigate('/requester/tasks');
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Unable to delete task');
      setShowDeleteConfirm(false);
    }
  };

  const handleComplete = async () => {
    try {
      setCompleting(true);
      setError('');
      setSuccess('');
      const response = await api.put(`/tasks/${id}/complete`);
      if (response.data.success) {
        setSuccess('Task marked as completed successfully!');
        setShowCompleteConfirm(false);
        await fetchTask();
      }
    } catch (err) {
      console.error('Error completing task:', err);
      setError(err.response?.data?.message || 'Unable to complete task');
    } finally {
      setCompleting(false);
    }
  };

  const handlePaymentProofUpload = async () => {
    if (!paymentProofFile) {
      setError('Please select a payment proof image');
      return;
    }

    setUploadingPayment(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('paymentProof', paymentProofFile);

      const response = await api.post(`/tasks/${id}/payment-proof`, formData);
      if (response.data.success) {
        setSuccess('Payment proof uploaded successfully!');
        setPaymentProofFile(null);
        await fetchTask();
      }
    } catch (err) {
      console.error('Error uploading payment proof:', err);
      setError(err.response?.data?.message || 'Unable to upload payment proof');
    } finally {
      setUploadingPayment(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      default: return status;
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

  if (!task) {
    return (
      <Layout>
        <ErrorMessage message="Task not found" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <BackButton />

        <ErrorMessage message={error} />
        <SuccessMessage message={success} />

        {/* Task Details */}
        <div className="card mb-6">
          {/* Header with status and actions */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                {getStatusText(task.status)}
              </span>
            </div>
            <div className="flex space-x-2">
              {task.status === 'pending' && (
                <button
                  onClick={() => setShowCompleteConfirm(true)}
                  disabled={completing}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
                >
                  {completing ? 'Completing...' : '✅ Complete Task'}
                </button>
              )}
              {task.status !== 'completed' && (
                <Link
                  to={`/requester/task/${id}/edit`}
                  className="btn-secondary"
                >
                  ✏️ Edit
                </Link>
              )}
              {task.status !== 'completed' && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>

          {/* Images */}
          {task.images && task.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {task.images.map((img, index) => (
                <img
                  key={index}
                  src={`${getBaseURL()}${img}`}
                  alt={`Task ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
              ))}
            </div>
          )}

          {/* Payment Proof Section */}
          {task.status !== 'completed' && !task.paymentProofUrl && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">💳 Upload Payment Proof</h3>
              <p className="text-sm text-gray-600 mb-3">
                Upload proof of posting fee payment to activate your task listing.
              </p>
              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPaymentProofFile(e.target.files[0])}
                  className="input-field flex-1"
                  disabled={uploadingPayment}
                />
                <button
                  onClick={handlePaymentProofUpload}
                  disabled={uploadingPayment || !paymentProofFile}
                  className="btn-primary disabled:opacity-50"
                >
                  {uploadingPayment ? <LoadingSpinner size="small" /> : 'Upload'}
                </button>
              </div>
            </div>
          )}

          {/* Payment Proof Display */}
          {task.paymentProofUrl && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">✅ Payment Proof Uploaded</h3>
                <button
                  onClick={() => setShowPaymentProof(!showPaymentProof)}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                >
                  {showPaymentProof ? '🙈 Ẩn Payment Proof' : '👁️ Xem Payment Proof'}
                </button>
              </div>
              {showPaymentProof && (
                <img
                  src={`${getBaseURL()}${task.paymentProofUrl}`}
                  alt="Payment Proof"
                  className="w-full max-w-md h-auto rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Payment+Proof';
                  }}
                />
              )}
            </div>
          )}

          {/* Task Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{task.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Category</h3>
                <p className="text-gray-600">{task.category}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">Location</h3>
                <p className="text-gray-600">{task.location.ward}, {task.location.province}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">Price</h3>
                <p className="text-2xl font-bold text-primary-600">
                  {task.price.toLocaleString('en-US')} ₫
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">Posting Fee</h3>
                <p className="text-gray-600">{task.postingFee.toLocaleString('en-US')} ₫</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">Deadline</h3>
                <p className="text-gray-600">{formatDate(task.deadline)}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">Posted Date</h3>
                <p className="text-gray-600">{formatDate(task.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conversations/Messages */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
          
          {conversations.length === 0 ? (
            <p className="text-gray-600">No messages for this task yet</p>
          ) : (
            <div className="space-y-3">
              {conversations.map((conv, index) => (
                <Link
                  key={index}
                  to={`/messages/${id}/${conv.otherUser._id}`}
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{conv.otherUser.fullName}</p>
                      <p className="text-sm text-gray-600 mt-1">{conv.lastMessage}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title="Confirm Delete"
          message={`Are you sure you want to delete "${task.title}"?\nThis action cannot be undone.`}
          confirmText="Yes, Delete"
          cancelText="No, Keep It"
          confirmButtonClass="bg-red-500 hover:bg-red-600"
        />

        {/* Complete Task Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showCompleteConfirm}
          onClose={() => setShowCompleteConfirm(false)}
          onConfirm={handleComplete}
          title="Complete Task"
          message="Are you sure you want to mark this task as completed? This action cannot be undone."
          confirmText="Yes, Complete Task"
          cancelText="Cancel"
          confirmButtonClass="bg-indigo-500 hover:bg-indigo-600"
          isLoading={completing}
        />
      </div>
    </Layout>
  );
};

export default RequesterTaskDetail;

