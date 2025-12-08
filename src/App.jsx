// Main App Component
// Sets up routing and overall app structure

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ChooseRole from './pages/auth/ChooseRole';

// Requester pages
import RequesterTasks from './pages/requester/RequesterTasks';
import CreateTask from './pages/requester/CreateTask';
import EditTask from './pages/requester/EditTask';
import RequesterTaskDetail from './pages/requester/RequesterTaskDetail';
import RequesterProfile from './pages/requester/RequesterProfile';
import RequesterMessageHistory from './pages/requester/RequesterMessageHistory';

// Tasker pages
import TaskerSearch from './pages/tasker/TaskerSearch';
import TaskerTaskDetail from './pages/tasker/TaskerTaskDetail';
import Favorites from './pages/tasker/Favorites';
import MessageHistory from './pages/tasker/MessageHistory';
import TaskerProfile from './pages/tasker/TaskerProfile';

// Shared pages
import Chat from './pages/shared/Chat';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAccount from './pages/admin/AdminAccount';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!user.currentRole) {
    return <Navigate to="/choose-role" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.currentRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// App Routes Component
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={user ? <Navigate to={getRoleBasedHome(user.currentRole)} /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to={getRoleBasedHome(user.currentRole)} /> : <Register />} 
      />

      {/* Role selection */}
      <Route 
        path="/choose-role" 
        element={
          user ? <ChooseRole /> : <Navigate to="/" replace />
        } 
      />

      {/* Requester routes */}
      <Route 
        path="/requester/tasks" 
        element={
          <ProtectedRoute allowedRoles={['requester']}>
            <RequesterTasks />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/requester/create-task" 
        element={
          <ProtectedRoute allowedRoles={['requester']}>
            <CreateTask />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/requester/task/:id/edit" 
        element={
          <ProtectedRoute allowedRoles={['requester']}>
            <EditTask />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/requester/task/:id" 
        element={
          <ProtectedRoute allowedRoles={['requester']}>
            <RequesterTaskDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/requester/messages" 
        element={
          <ProtectedRoute allowedRoles={['requester']}>
            <RequesterMessageHistory />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/requester/profile" 
        element={
          <ProtectedRoute allowedRoles={['requester']}>
            <RequesterProfile />
          </ProtectedRoute>
        } 
      />

      {/* Tasker routes */}
      <Route 
        path="/tasker/search" 
        element={
          <ProtectedRoute allowedRoles={['tasker']}>
            <TaskerSearch />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tasker/task/:id" 
        element={
          <ProtectedRoute allowedRoles={['tasker']}>
            <TaskerTaskDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tasker/favorites" 
        element={
          <ProtectedRoute allowedRoles={['tasker']}>
            <Favorites />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tasker/messages" 
        element={
          <ProtectedRoute allowedRoles={['tasker']}>
            <MessageHistory />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tasker/profile" 
        element={
          <ProtectedRoute allowedRoles={['tasker']}>
            <TaskerProfile />
          </ProtectedRoute>
        } 
      />

      {/* Shared chat route */}
      <Route 
        path="/messages/:taskId/:userId" 
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } 
      />

      {/* Admin routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/account" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAccount />
          </ProtectedRoute>
        } 
      />

      {/* 404 route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Helper function to get home page based on role
const getRoleBasedHome = (role) => {
  switch (role) {
    case 'requester':
      return '/requester/tasks';
    case 'tasker':
      return '/tasker/search';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/choose-role';
  }
};

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;





