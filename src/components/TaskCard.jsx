// TaskCard Component
// Displays a task in card format

import { Link } from 'react-router-dom';

const TaskCard = ({ task, linkPath, showStatus = true }) => {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <Link to={linkPath} className="block">
      <div className="card hover:shadow-lg transition-shadow cursor-pointer">
        {/* Task image */}
        {task.images && task.images.length > 0 && (
          <img
            src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${task.images[0]}`}
            alt={task.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        )}

        {/* Task title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>

        {/* Task category and location */}
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded mr-2">
            {task.category}
          </span>
          <span>📍 {task.location.ward}, {task.location.province}</span>
        </div>

        {/* Task description (truncated) */}
        <p className="text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>

        {/* Price and deadline */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              {task.price.toLocaleString('en-US')} ₫
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Deadline: {formatDate(task.deadline)}
          </div>
        </div>

        {/* Status badge */}
        {showStatus && (
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
            {getStatusText(task.status)}
          </div>
        )}

        {/* Requester info (if available) */}
        {task.requester && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Posted by: <span className="font-medium">{task.requester.fullName}</span>
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default TaskCard;

