const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const connectDB = require('./db/connection');
const User = require('./db/userModel');
const { Photo, Comment } = require('./db/photoModel');
const cors = require('cors');

const app = express();

// Cấu hình middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Middleware kiểm tra đăng nhập
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    console.log('Unauthorized access attempt:', req.url);
    return res.status(401).json({ error: 'Unauthorized: Please login' });
  }
  next();
};

// Cấu hình multer để tải ảnh
const storage = multer.diskStorage({
  destination: './public/images/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Kết nối MongoDB và khởi động server
connectDB()
  .then(() => {
    app.listen(3001, () => {
      console.log('Backend server running on http://localhost:3001');
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// Hàm kiểm tra định dạng email
const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|biz|info|name|museum|coop|aero|pro|jobs|travel|xxx|mobi|asia|cat|tel|int|post|xxx)$/;
  return re.test(email.toLowerCase());
};

// Route đăng ký người dùng
app.post('/user', async (req, res) => {
  try {
    const { login_name, password, first_name, last_name, location, description, occupation } = req.body;
    console.log('Received registration data:', req.body);

    // Kiểm tra tất cả các trường bắt buộc
    if (
      !login_name?.trim() ||
      !password?.trim() ||
      !first_name?.trim() ||
      !last_name?.trim() ||
      !location?.trim() ||
      !description?.trim() ||
      !occupation?.trim()
    ) {
      return res.status(400).json({
        error:
          'All fields (Login Name, Password, First Name, Last Name, Location, Description, Occupation) are required',
      });
    }

    // Kiểm tra định dạng email
    if (!validateEmail(login_name)) {
      return res.status(400).json({ error: 'Invalid email format. Please use a valid email (e.g., example@domain.com)' });
    }

    // Kiểm tra login_name không trùng
    const existingUser = await User.findOne({ login_name });
    if (existingUser) {
      return res.status(400).json({ error: 'Login name already exists' });
    }

    const user = new User({
      login_name: login_name.trim(),
      password: password.trim(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      location: location.trim(),
      description: description.trim(),
      occupation: occupation.trim(),
    });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Route đăng nhập admin
app.post('/admin/login', async (req, res) => {
  try {
    const { login_name, password } = req.body;
    console.log('Login attempt:', { login_name });
    const user = await User.findOne({ login_name, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid login name or password' });
    }

    req.session.user = user;
    console.log('User logged in:', user._id);
    res.json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Route đăng xuất
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Route lấy danh sách người dùng
app.get('/user/list', requireLogin, async (req, res) => {
  try {
    const users = await User.find({}, 'first_name last_name _id');
    res.json(users);
  } catch (err) {
    console.error('User list error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Route lấy chi tiết người dùng
app.get('/user/:id', requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('User detail error:', err);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Route lấy ảnh của người dùng
app.get('/photos/user/:id', requireLogin, async (req, res) => {
  try {
    const photos = await Photo.find({ user_id: req.params.id }).populate({
      path: 'comments.user',
      select: '_id first_name last_name',
    });
    console.log('Photos fetched for user', req.params.id, ':', photos.length);
    res.json(photos);
  } catch (err) {
    console.error('Photos error:', err);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

// Route tải ảnh lên
app.post('/photos/new', requireLogin, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }

    const photo = new Photo({
      user_id: req.session.user._id,
      file_name: req.file.filename,
      date_time: new Date(),
      comments: [],
    });

    await photo.save();
    console.log('Photo uploaded:', photo._id);

    res.json({
      message: 'Photo uploaded successfully',
      photo: {
        _id: photo._id,
        file_name: photo.file_name,
        date_time: photo.date_time,
        user_id: photo.user_id,
      },
    });
  } catch (err) {
    console.error('Photo upload error:', err);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

// Route thêm bình luận cho ảnh
app.post('/photos/:id/comment', requireLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    console.log('Comment request:', { id, comment, user: req.session.user?._id });

    if (!comment) {
      return res.status(400).json({ error: 'Bình luận không được để trống' });
    }

    const photo = await Photo.findById(id);
    if (!photo) {
      return res.status(404).json({ error: 'Không tìm thấy ảnh' });
    }

    const newComment = {
      user: req.session.user._id,
      comment,
      date_time: new Date(),
    };

    photo.comments.push(newComment);
    await photo.save();

    await photo.populate({
      path: 'comments.user',
      select: '_id first_name last_name',
    });

    console.log('Comment added to photo:', id);
    res.json({ message: 'Bình luận thành công', comments: photo.comments });
  } catch (err) {
    console.error('Comment error:', err);
    res.status(500).json({ error: 'Không thể thêm bình luận' });
  }
});

// Route thu hồi bình luận
app.delete('/photos/:photoId/comment/:commentId', requireLogin, async (req, res) => {
  try {
    const { photoId, commentId } = req.params;
    const user = req.session.user;

    const photo = await Photo.findById(photoId);
    if (!photo) return res.status(404).json({ error: 'Ảnh không tồn tại' });

    const comment = photo.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Bình luận không tồn tại' });

    if (comment.user.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Bạn không có quyền thu hồi bình luận này' });
    }

    photo.comments.id(commentId).remove();
    await photo.save();

    await photo.populate({
      path: 'comments.user',
      select: '_id first_name last_name',
    });

    res.json({ message: 'Bình luận đã được thu hồi', comments: photo.comments });
  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route chỉnh sửa bình luận
app.put('/photos/:photoId/comment/:commentId', requireLogin, async (req, res) => {
  try {
    const { photoId, commentId } = req.params;
    const { comment } = req.body;
    const user = req.session.user;

    if (!comment) {
      return res.status(400).json({ error: 'Bình luận không được để trống' });
    }

    const photo = await Photo.findById(photoId);
    if (!photo) return res.status(404).json({ error: 'Ảnh không tồn tại' });

    const commentToEdit = photo.comments.id(commentId);
    if (!commentToEdit) return res.status(404).json({ error: 'Bình luận không tồn tại' });

    if (commentToEdit.user.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Bạn không có quyền chỉnh sửa bình luận này' });
    }

    commentToEdit.comment = comment;
    commentToEdit.date_time = new Date();
    await photo.save();

    await photo.populate({
      path: 'comments.user',
      select: '_id first_name last_name',
    });

    res.json({ message: 'Bình luận đã được chỉnh sửa', comments: photo.comments });
  } catch (err) {
    console.error('Edit comment error:', err);
    res.status(500).json({ error: err.message });
  }
});