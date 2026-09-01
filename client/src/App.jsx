import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import Meetings from './pages/Meetings';
import Invoices from './pages/Invoices';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <AuthProvider>
      <Toaster 
        toastOptions={{
          className: '',
          style: {
            border: '2px solid black',
            padding: '16px',
            color: 'black',
            fontWeight: 'bold',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
            borderRadius: '12px'
          },
          success: {
            iconTheme: {
              primary: '#4DE3B1',
              secondary: 'black',
            },
          },
        }}
      />
      <ErrorBoundary>
        <Router>
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected/Internal Routes */}
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/meetings" element={<Meetings />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
