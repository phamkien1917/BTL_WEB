import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Divider } from '@mui/material';
import { fetchData } from '../../lib/fetchModelData';

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchData('/user/list', { withCredentials: true });
        setUsers(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch users');
      }
    };
    getUsers();
  }, []);

  // Xác định userId đang được xem từ URL
  const currentUserId = location.pathname.match(/\/(user|photos)\/([a-f0-9]+)/)?.[2] || null;

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <List>
      {users.map((user) => {
        const isActive = currentUserId === user._id;
        return (
          <div key={user._id}>
            <ListItem
              button
              component={Link}
              to={`/user/${user._id}`}
              sx={{
                backgroundColor: isActive ? '#616161' : '#ffffff', // Xám đậm cho active, trắng cho inactive
                color: isActive ? '#ffffff' : '#000000', // Chữ trắng cho active, đen cho inactive
                '&:hover': {
                  backgroundColor: isActive ? '#757575' : '#f5f5f5', // Đậm hơn khi hover
                },
              }}
            >
              <ListItemText primary={`${user.first_name} ${user.last_name}`} />
            </ListItem>
            <Divider />
          </div>
        );
      })}
    </List>
  );
}

export default UserList;