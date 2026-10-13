import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import LoadingScreen from './components/shared/LoadingScreen';
import ConfigGate from './components/shared/ConfigGate';
import { AuthProvider } from './context/AuthContext';
import { ActivityProvider } from './context/ActivityContext';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import CommandCenterPage from './pages/CommandCenterPage';
import NotFoundPage from './pages/NotFoundPage';

/** Only rendered for signed-in navigators; otherwise → /auth */
function ProtectedRoute({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'initializing') return <LoadingScreen />;
  if (status === 'unconfigured') return <ConfigGate />;
  if (status !== 'authenticated') {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  return children;
}

/** Only rendered when signed out; otherwise → / */
function PublicRoute({ children }) {
  const { status } = useAuth();

  if (status === 'initializing') return <LoadingScreen />;
  if (status === 'unconfigured') return <ConfigGate />;
  if (status === 'authenticated') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <ActivityProvider>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CommandCenterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </ActivityProvider>
  );
}
