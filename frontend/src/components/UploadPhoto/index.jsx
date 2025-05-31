import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Alert } from '@mui/material';
import axios from 'axios';

function UploadPhoto() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Vui lòng chọn một ảnh để tải lên');
      return;
    }

    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
      setError('Vui lòng đăng nhập để tải ảnh lên');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await axios.post('http://localhost:3001/photos/new', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(response.data.message);
      setFile(null);
      // Chờ 1 giây trước khi chuyển hướng để người dùng thấy thông báo thành công
      setTimeout(() => navigate(`/photos/${user._id}`), 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Không thể tải ảnh lên');
      console.error('Upload error:', err); // Log lỗi chi tiết
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: '20px auto', padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Tải ảnh lên
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'block', marginBottom: '10px' }}
          />
          <Button type="submit" variant="contained" color="primary">
            Tải lên
          </Button>
        </Box>
      </form>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
    </Box>
  );
}

export default UploadPhoto;