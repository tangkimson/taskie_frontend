// Layout Component
// Wraps pages with consistent layout (navbar, footer, etc.)

import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Taskie. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">
            Connecting task requesters with task workers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;











