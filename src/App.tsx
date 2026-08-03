import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {AuthProvider } from './contexts/Authcontext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';

export function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;