import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Box, Alert, Tabs, Tab } from '@mui/material';
import axios from 'axios';

function LoginRegister() {
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({
    login_name: '',
    password: '',
    first_name: '',
    last_name: '',
    location: '',
    description: '',
    occupation: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.tab === 'login') {
      setTabIndex(0);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|biz|info|name|museum|coop|aero|pro|jobs|travel|xxx|mobi|asia|cat|tel|int|post|xxx)$/;
    return re.test(email.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset lỗi trước khi kiểm tra

    const { login_name, password, first_name, last_name, location, description, occupation } = formData;

    if (tabIndex === 1) {
      // Kiểm tra tất cả các trường bắt buộc cho đăng ký
      if (
        !login_name.trim() ||
        !password.trim() ||
        !confirmPassword.trim() ||
        !first_name.trim() ||
        !last_name.trim() ||
        !location.trim() ||
        !description.trim() ||
        !occupation.trim()
      ) {
        setError(
          'All fields (Login Name, Password, Confirm Password, First Name, Last Name, Location, Description, Occupation) are required.'
        );
        return;
      }

      // Kiểm tra định dạng email cho login_name
      if (!validateEmail(login_name)) {
        setError('Invalid email format. Please use a valid email (e.g., example@domain.com).');
        return;
      }

      // Kiểm tra mật khẩu khớp
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    } else {
      // Kiểm tra các trường bắt buộc cho đăng nhập
      if (!login_name.trim() || !password.trim()) {
        setError('Login Name and Password are required.');
        return;
      }
    }

    const url = tabIndex === 0 ? '/admin/login' : '/user';
    try {
      const response = await axios.post(
        `http://localhost:3001${url}`,
        {
          login_name: login_name.trim(),
          password: password.trim(),
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          location: location.trim(),
          description: description.trim(),
          occupation: occupation.trim(),
        },
        { withCredentials: true }
      );

      if (tabIndex === 0) {
        sessionStorage.setItem('user', JSON.stringify(response.data));
        window.dispatchEvent(new Event('storage'));
        if (response.data._id) {
          navigate(`/user/${response.data._id}`, { replace: true });
        } else {
          navigate('/users', { replace: true });
        }
      } else {
        setFormData({
          login_name: '',
          password: '',
          first_name: '',
          last_name: '',
          location: '',
          description: '',
          occupation: '',
        });
        setConfirmPassword('');
        setTabIndex(0);
      }
    } catch (err) {
      setError(err.response?.data?.error || (tabIndex === 0 ? 'Login failed' : 'Registration failed'));
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '20px auto', padding: 2 }}>
      <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} centered>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Login Name"
          name="login_name"
          value={formData.login_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          autoComplete="username"
          required
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          autoComplete="current-password"
          required
        />
        {tabIndex === 1 && (
          <>
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              autoComplete="new-password"
              required
            />
            <TextField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              autoComplete="given-name"
              required
            />
            <TextField
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              autoComplete="family-name"
              required
            />
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              autoComplete="address-level2"
              required // Thêm required
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              required // Thêm required
            />
            <TextField
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              required // Thêm required
            />
          </>
        )}
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          {tabIndex === 0 ? 'Login' : 'Register'}
        </Button>
      </form>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
}

export default LoginRegister;