# Mô tả dự án
Ứng dụng Chia sẻ Ảnh

Đây là một ứng dụng web full-stack để chia sẻ ảnh, được xây dựng bằng React (frontend) và Node.js/Express (backend). Người dùng có thể đăng ký, đăng nhập, tải ảnh lên, xem ảnh của người khác và bình luận về chúng. Ứng dụng sử dụng MongoDB làm cơ sở dữ liệu và Material-UI (MUI) cho các thành phần giao diện người dùng.
Cấu trúc dự án

photo-sharing-v1/
├── backend/               # Mã nguồn backend (Node.js/Express)
│   ├── db/               # Mô hình cơ sở dữ liệu và kết nối
│   │   ├── connection.js  # Thiết lập kết nối MongoDB
│   │   ├── userModel.js   # Schema và mô hình cho người dùng
│   │   ├── photoModel.js  # Schema và mô hình cho ảnh và bình luận
│   │   ├── schemaInfo.js  # SchemaInfo cho phiên bản cơ sở dữ liệu
│   │   └── dbLoad.js      # Script để tải dữ liệu mẫu
│   ├── public/           # File tĩnh (ví dụ: ảnh đã tải lên)
│   │   └── images/
│   ├── server.js         # File chính của server Express
│   ├── package.json      # Phụ thuộc backend
│   └── package-lock.json
│
├── frontend/              # Mã nguồn frontend (React)
│   ├── public/           # Tài nguyên công khai
│   │   └── index.html    # File HTML chính
│   ├── src/              # Mã nguồn React
│   │   ├── components/   # Các thành phần React
│   │   │   ├── LoginRegister/  # Form đăng nhập và đăng ký
│   │   │   ├── TopBar/        # Thanh điều hướng trên cùng
│   │   │   ├── UserList/      # Danh sách người dùng
│   │   │   ├── UserDetail/    # Trang chi tiết người dùng
│   │   │   ├── UserPhotos/    # Ảnh và bình luận của người dùng
│   │   │   └── PhotoUpload/   # Form tải ảnh lên
│   │   ├── lib/          # Hàm tiện ích
│   │   │   └── fetchModelData.js  # Hàm gọi API
│   │   ├── App.js        # Ứng dụng React chính với định tuyến
│   │   ├── index.js      # Điểm khởi đầu React
│   │   └── index.css     # CSS toàn cục
│   ├── package.json      # Phụ thuộc frontend
│   └── package-lock.json
│
└── README.md             # Tài liệu dự án

Tính năng

Xác thực người dùng: Chức năng đăng ký, đăng nhập và đăng xuất.
Chia sẻ ảnh: Tải ảnh lên và xem ảnh của người khác.
Bình luận: Thêm, chỉnh sửa và xóa bình luận trên ảnh (hiển thị tối đa 3 bình luận mặc định với nút "Xem thêm").
Hồ sơ người dùng: Xem chi tiết người dùng và ảnh của họ.
Giao diện đáp ứng: Xây dựng với Material-UI cho thiết kế sạch và đáp ứng.
Đánh dấu người dùng đang xem: Người dùng đang được xem được đánh dấu bằng nền xám trong danh sách người dùng.

Yêu cầu trước
Trước khi chạy dự án, hãy đảm bảo bạn đã cài đặt các công cụ sau:

Node.js (phiên bản 14 trở lên)
MongoDB (cài đặt cục bộ hoặc sử dụng MongoDB Atlas)
npm (đi kèm với Node.js)

Cài đặt và Chạy
1. Clone kho lưu trữ
git clone https://github.com/yourusername/photo-sharing-v1.git
cd photo-sharing-v1

2. Cài đặt Backend

Di chuyển đến thư mục backend:
cd backend


Cài đặt các phụ thuộc:
npm install


Tải dữ liệu mẫu (tùy chọn):

Điều này sẽ tạo một người dùng mẫu (user1/pass1) và một ảnh mẫu.

npm run load-data


Khởi động server backend:
npm start


Server backend sẽ chạy trên http://localhost:3001.



3. Cài đặt Frontend

Di chuyển đến thư mục frontend:
cd ../frontend


Cài đặt các phụ thuộc:
npm install


Khởi động server phát triển frontend:
npm start


Frontend sẽ chạy trên http://localhost:3000.



4. Cấu hình MongoDB

Nếu sử dụng MongoDB Atlas, chuỗi kết nối đã được cấu hình trong backend/db/connection.js:mongodb+srv://photo-sharing:123@cluster0.jwieqem.mongodb.net/PhotoApp?retryWrites=true&w=majority&appName=Cluster0


Nếu sử dụng MongoDB cục bộ, cập nhật chuỗi kết nối trong backend/db/connection.js thành:mongodb://localhost:27017/PhotoApp



Cách sử dụng

Mở trình duyệt và truy cập http://localhost:3000.
Đăng ký một tài khoản mới hoặc đăng nhập với tài khoản hiện có (ví dụ: user1/pass1 nếu bạn đã tải dữ liệu mẫu).
Sau khi đăng nhập, bạn sẽ thấy:
Danh sách người dùng bên trái (UserList).
Thanh điều hướng trên cùng (TopBar) với các tùy chọn để tải ảnh lên hoặc đăng xuất.


Nhấn vào một người dùng để xem chi tiết (UserDetail) và ảnh của họ (UserPhotos).
Tải ảnh lên bằng nút "Add Photo" (PhotoUpload).
Thêm, chỉnh sửa hoặc xóa bình luận trên ảnh (UserPhotos).

Các Endpoint API
Backend cung cấp các endpoint API sau:

POST /user: Đăng ký người dùng mới.
Dữ liệu yêu cầu: { "login_name": "email@example.com", "password": "pass123", "first_name": "John", "last_name": "Doe", "location": "Hanoi", "description": "Photographer", "occupation": "Freelancer" }


POST /admin/login: Đăng nhập người dùng.
Dữ liệu yêu cầu: { "login_name": "email@example.com", "password": "pass123" }


POST /logout: Đăng xuất người dùng hiện tại.
GET /user/list: Lấy danh sách người dùng (yêu cầu đăng nhập).
GET /user/:id: Lấy chi tiết của một người dùng cụ thể (yêu cầu đăng nhập).
GET /photos/user/:id: Lấy ảnh của một người dùng cụ thể (yêu cầu đăng nhập).
POST /photos/new: Tải lên ảnh mới (yêu cầu đăng nhập, dạng multipart form-data).
POST /photos/:id/comment: Thêm bình luận cho một ảnh (yêu cầu đăng nhập).
Dữ liệu yêu cầu: { "comment": "Nice photo!" }


PUT /photos/:photoId/comment/:commentId: Chỉnh sửa bình luận (yêu cầu đăng nhập).
Dữ liệu yêu cầu: { "comment": "Updated comment" }


DELETE /photos/:photoId/comment/:commentId: Xóa bình luận (yêu cầu đăng nhập).

Công nghệ sử dụng

Frontend:
React (v18)
React Router (v6)
Material-UI (v5)
Axios (để gọi API)


Backend:
Node.js
Express
MongoDB (với Mongoose)
Multer (để tải file lên)
Express-session (quản lý phiên)
CORS


Cơ sở dữ liệu: MongoDB (MongoDB Atlas hoặc cục bộ)

Khắc phục sự cố

Backend không chạy: Đảm bảo server backend đang chạy trên http://localhost:3001. Kiểm tra lỗi kết nối MongoDB trong terminal.
Vấn đề CORS: Đảm bảo cấu hình CORS trong server.js khớp với URL frontend (http://localhost:3000).
Ảnh không tải được: Kiểm tra thư mục public/images/ tồn tại và có thể truy cập. Kiểm tra đường dẫn file trong phản hồi API.
Bình luận không hiển thị: Đảm bảo trường comments.user được populate đúng trong phản hồi API (/photos/user/:id).

Cải tiến trong tương lai

Thêm xác thực người dùng bằng JWT thay vì session.
Triển khai chức năng xóa ảnh.
Thêm phân trang cho danh sách ảnh.
Cải thiện xử lý lỗi và phản hồi người dùng.
Thêm đơn vị kiểm thử cho cả frontend và backend.

Tác giả

Phùng Huy - Nhà phát triển dự án này.


