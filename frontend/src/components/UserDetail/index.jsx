import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, Typography } from '@mui/material';
import { fetchData } from '../../lib/fetchModelData';

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchData(`/user/${id}`, { withCredentials: true });
        setUser(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch user details');
      }
    };
    getUser();
  }, [id]);

  if (!user) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <Card sx={{ maxWidth: 500, margin: '20px auto', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="body1">Location: {user.location || 'N/A'}</Typography>
        <Typography variant="body1">Description: {user.description || 'N/A'}</Typography>
        <Typography variant="body1">Occupation: {user.occupation || 'N/A'}</Typography>
        <Typography variant="body2" mt={2}>
          <Link to={`/photos/${id}`}>View Photos</Link>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default UserDetail;