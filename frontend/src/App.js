import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import TopBar from './components/TopBar';
import UserList from './components/UserList';
import UserDetail from './components/UserDetail';
import UserPhotos from './components/UserPhotos';
import LoginRegister from './components/LoginRegister';
import UploadPhoto from './components/UploadPhoto';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = sessionStorage.getItem('user');
      const newUser = storedUser ? JSON.parse(storedUser) : null;
      setUser(newUser);
      if (!newUser) {
        navigate('/', { replace: true });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    navigate('/', { replace: true });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar onLogout={handleLogout} />
      <Box sx={{ display: 'flex', flex: 1 }}>
        {user && <UserList />}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={!user ? <LoginRegister /> : <Navigate to={`/user/${user?._id}`} replace />} />
            <Route path="/user/:id" element={user ? <UserDetail /> : <Navigate to="/" replace />} />
            <Route path="/photos/:id" element={user ? <UserPhotos /> : <Navigate to="/" replace />} />
            <Route path="/upload" element={user ? <UploadPhoto /> : <Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;