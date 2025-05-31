import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function TopBar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null); // Người dùng đăng nhập
  const [viewedUser, setViewedUser] = useState(null); // Người dùng đang xem (cho /photos/:id)
  const [loading, setLoading] = useState(false); // Trạng thái loading API

  useEffect(() => {
    // Lấy thông tin người dùng đăng nhập
    const handleStorageChange = () => {
      const storedUser = sessionStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();

    // Lấy thông tin người dùng đang xem khi ở trang /photos/:id
    const path = location.pathname;
    if (user && path.startsWith('/photos/') && !loading) {
      setLoading(true);
      const userId = path.split('/')[2];
      fetch(`http://localhost:3001/user/${userId}`, {
        credentials: 'include',
      })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          return response.json();
        })
        .then((data) => {
          setViewedUser(data);
        })
        .catch((err) => {
          console.error('API request failed:', err.message);
          setViewedUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (!path.startsWith('/photos/')) {
      setViewedUser(null);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location.pathname, user, loading]);

  const handleLogoutClick = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      try {
        await fetch('http://localhost:3001/admin/logout', {
          method: 'POST',
          credentials: 'include',
        });
        onLogout();
      } catch (err) {
        console.error('Logout failed:', err);
      }
    }
  };

  const getContext = () => {
    if (!user) return 'Photo Sharing App'; // Khi chưa đăng nhập
    const path = location.pathname;
    if (path.startsWith('/photos/') && viewedUser) {
      return `Photos of ${viewedUser.first_name || ''} ${viewedUser.last_name || ''}`;
    }
    // Sử dụng thông tin từ user đã đăng nhập
    return `Hi ${user.first_name || ''} ${user.last_name || ''}`;
  };

  const handleLoginClick = () => {
    navigate('/', { state: { tab: 'login' } });
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          [PHÙNG HUY] - {getContext()}
        </Typography>
        {user && (
          <Button color="inherit" onClick={() => navigate('/upload')}>
            Add Photo
          </Button>
        )}
        {user ? (
          <Button color="inherit" onClick={handleLogoutClick}>Logout</Button>
        ) : (
          <Button color="inherit" onClick={handleLoginClick}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;