import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardMedia, Typography, Grid, TextField, Button, Box, Menu, MenuItem } from '@mui/material';
import { fetchData } from '../../lib/fetchModelData';
import axios from 'axios';

function UserPhotos() {
  const { id } = useParams();
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const [showAllComments, setShowAllComments] = useState({});
  const [editComment, setEditComment] = useState(null); // Quản lý bình luận đang chỉnh sửa
  const [anchorEl, setAnchorEl] = useState(null); // Quản lý menu thả xuống
  const user = JSON.parse(sessionStorage.getItem('user'));

  const fetchPhotos = async () => {
    try {
      const data = await fetchData(`/photos/user/${id}`, { withCredentials: true });
      if (!Array.isArray(data)) throw new Error('Dữ liệu trả về không hợp lệ');
      console.log('Photos data:', data); // Kiểm tra dữ liệu trả về từ API
      setPhotos(data);
      const initialInputs = {};
      const initialShowAll = {};
      data.forEach((photo) => {
        initialInputs[photo._id] = '';
        initialShowAll[photo._id] = false;
      });
      setCommentInputs(initialInputs);
      setShowAllComments(initialShowAll);
    } catch (err) {
      setError(`Không thể tải ảnh: ${err.message}`);
    }
  };

  const handleCommentChange = (photoId, value) => {
    setCommentInputs((prev) => ({ ...prev, [photoId]: value }));
  };

  const handleCommentSubmit = async (photoId) => {
    const comment = commentInputs[photoId]?.trim();
    if (!comment) {
      setError('Bình luận không được để trống');
      return;
    }

    try {
      console.log('Sending comment for photo:', photoId, 'Comment:', comment);
      const response = await axios.post(
        `http://localhost:3001/photos/${photoId}/comment`,
        { comment },
        { withCredentials: true }
      );
      setPhotos((prev) =>
        prev.map((photo) =>
          photo._id === photoId ? { ...photo, comments: response.data.comments } : photo
        )
      );
      setCommentInputs((prev) => ({ ...prev, [photoId]: '' }));
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(`Không thể gửi bình luận: ${errorMessage}`);
      console.error('Comment submit error:', err);
    }
  };

  const toggleShowAllComments = (photoId) => {
    setShowAllComments((prev) => ({
      ...prev,
      [photoId]: !prev[photoId],
    }));
  };

  const handleDeleteComment = async (photoId, commentId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/photos/${photoId}/comment/${commentId}`,
        { withCredentials: true }
      );
      setPhotos((prev) =>
        prev.map((photo) =>
          photo._id === photoId ? { ...photo, comments: response.data.comments } : photo
        )
      );
      setAnchorEl(null); // Đóng menu sau khi xóa
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(`Không thể thu hồi bình luận: ${errorMessage}`);
      console.error('Delete comment error:', err);
    }
  };

  const handleEditComment = (photoId, comment) => {
    setEditComment({ photoId, commentId: comment._id, commentText: comment.comment });
    setCommentInputs((prev) => ({ ...prev, [photoId]: comment.comment }));
    setAnchorEl(null); // Đóng menu sau khi chọn chỉnh sửa
  };

  const handleSaveEdit = async (photoId) => {
    const newComment = commentInputs[photoId]?.trim();
    if (!newComment || newComment === editComment.commentText) {
      setEditComment(null);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3001/photos/${photoId}/comment/${editComment.commentId}`,
        { comment: newComment },
        { withCredentials: true }
      );
      setPhotos((prev) =>
        prev.map((photo) =>
          photo._id === photoId ? { ...photo, comments: response.data.comments } : photo
        )
      );
      setEditComment(null);
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(`Không thể chỉnh sửa bình luận: ${errorMessage}`);
      console.error('Edit comment error:', err);
    }
  };

  const handleMenuOpen = (event, photoId, commentId) => {
    setAnchorEl(event.currentTarget);
    setEditComment({ photoId, commentId }); // Chỉ lưu photoId và commentId để xác định bình luận
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setEditComment(null);
  };

  useEffect(() => {
    fetchPhotos();
  }, [id]);

  if (error && !photos.length) return <Typography color="error" sx={{ p: 2 }}>{error}</Typography>;
  if (photos.length === 0) return <Typography sx={{ p: 2 }}>Không có ảnh nào để hiển thị</Typography>;

  console.log('Current user:', user); // Kiểm tra user trong sessionStorage

  return (
    <Grid container spacing={2} sx={{ padding: '20px' }}>
      {photos.map((photo) => {
        const comments = photo.comments || [];
        const displayedComments = showAllComments[photo._id] ? comments : comments.slice(0, 3);

        return (
          <Grid item xs={12} sm={6} md={4} key={photo._id}>
            <Card sx={{ boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:3001/images/${photo.file_name}`}
                alt={photo.file_name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/200?text=Ảnh+không+tải+được';
                }}
              />
              <Typography variant="caption" display="block" gutterBottom sx={{ p: 1 }}>
                Đã tải lên: {new Date(photo.date_time).toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
              <Box sx={{ p: 1 }}>
                <Typography variant="body2">Bình luận:</Typography>
                {displayedComments.length > 0 ? (
                  displayedComments.map((comment) => {
                    console.log(
                      `Checking comment ${comment._id}: User ID: ${user?._id}, Comment User ID: ${comment.user?._id}`
                    );
                    const isEditing =
                      editComment &&
                      editComment.photoId === photo._id &&
                      editComment.commentId === comment._id &&
                      editComment.commentText !== undefined; // Kiểm tra nếu đang chỉnh sửa và đã nhấn "Chỉnh sửa"

                    return (
                      <Box key={comment._id} sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ flexGrow: 1 }}>
                          {isEditing ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TextField
                                value={commentInputs[photo._id] || ''}
                                onChange={(e) => handleCommentChange(photo._id, e.target.value)}
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{ mr: 1 }}
                              />
                              <Button
                                onClick={() => handleSaveEdit(photo._id)}
                                variant="contained"
                                color="primary"
                                size="small"
                              >
                                Lưu
                              </Button>
                              <Button
                                onClick={() => setEditComment(null)}
                                variant="outlined"
                                color="secondary"
                                size="small"
                                sx={{ ml: 1 }}
                              >
                                Hủy
                              </Button>
                            </Box>
                          ) : (
                            <>
                              <Typography variant="body2">
                                <Link to={`/user/${comment.user._id}`}>
                                  {comment.user.first_name} {comment.user.last_name}
                                </Link>{' '}
                                : {comment.comment}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {new Date(comment.date_time).toLocaleString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </Typography>
                            </>
                          )}
                        </Box>
                        {user && comment.user && user._id === comment.user._id.toString() ? (
                          <>
                            <Button
                              onClick={(e) => handleMenuOpen(e, photo._id, comment._id)}
                              size="small"
                              sx={{ ml: 1, textTransform: 'none' }}
                            >
                              ...
                            </Button>
                            <Menu
                              anchorEl={anchorEl}
                              open={
                                Boolean(anchorEl) &&
                                editComment?.photoId === photo._id &&
                                editComment?.commentId === comment._id
                              }
                              onClose={handleMenuClose}
                            >
                              <MenuItem onClick={() => handleEditComment(photo._id, comment)}>
                                Chỉnh sửa
                              </MenuItem>
                              <MenuItem onClick={() => handleDeleteComment(photo._id, comment._id)}>
                                Xóa
                              </MenuItem>
                            </Menu>
                          </>
                        ) : (
                          console.log(
                            `Không hiển thị nút ... cho bình luận ${comment._id}. User ID: ${user?._id}, Comment User ID: ${comment.user?._id}`
                          )
                        )}
                      </Box>
                    );
                  })
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Chưa có bình luận nào
                  </Typography>
                )}
                {comments.length > 3 && (
                  showAllComments[photo._id] ? (
                    <Button
                      onClick={() => toggleShowAllComments(photo._id)}
                      sx={{ mt: 1, textTransform: 'none' }}
                    >
                      Rút gọn
                    </Button>
                  ) : (
                    <Button
                      onClick={() => toggleShowAllComments(photo._id)}
                      sx={{ mt: 1, textTransform: 'none' }}
                    >
                      Xem thêm bình luận
                    </Button>
                  )
                )}
                {user && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      label="Thêm bình luận"
                      value={commentInputs[photo._id] || ''}
                      onChange={(e) => handleCommentChange(photo._id, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleCommentSubmit(photo._id);
                        }
                      }}
                      fullWidth
                      variant="outlined"
                      size="small"
                      error={!!error}
                      helperText={error}
                    />
                    <Button
                      onClick={() => handleCommentSubmit(photo._id)}
                      variant="contained"
                      color="primary"
                      sx={{ mt: 1 }}
                    >
                      Gửi
                    </Button>
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default UserPhotos;