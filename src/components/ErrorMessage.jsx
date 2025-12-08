// ErrorMessage Component
// Displays error messages with consistent styling

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default ErrorMessage;












