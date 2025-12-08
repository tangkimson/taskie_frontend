// ConfirmDialog Component
// Reusable confirmation dialog for destructive actions

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-red-500 hover:bg-red-600',
  isLoading = false
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6 whitespace-pre-line">{message}</p>
        <div className="flex space-x-4">
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${confirmButtonClass}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 btn-secondary"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;







