// BackButton Component
// Provides a back navigation button for better UX

import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="mb-6 flex items-center text-gray-600 hover:text-primary-600 transition-colors group"
    >
      <svg 
        className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 19l-7-7 7-7" 
        />
      </svg>
      <span className="font-medium">Go Back</span>
    </button>
  );
};

export default BackButton;


