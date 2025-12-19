// SuccessMessage Component
// Displays success messages with consistent styling

const SuccessMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default SuccessMessage;


















