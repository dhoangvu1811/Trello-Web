# 🔄 Trello Web Clone

Một ứng dụng Trello clone tương tác và đáp ứng được xây dựng bằng React 18 và các công nghệ frontend hiện đại. Ứng dụng này cung cấp giao diện bảng kanban trực quan nơi người dùng có thể quản lý công việc thông qua giao diện kéo thả, với tính năng quản lý bảng, cột, và thẻ hoàn chỉnh tương tự như Trello.

## 📋 Tính năng chính

- **🔐 Hệ thống xác thực toàn diện**:

  - Đăng nhập/đăng ký với xác thực email
  - Bảo vệ route yêu cầu đăng nhập
  - Xác minh tài khoản qua email

- **📊 Quản lý bảng Kanban**:

  - Tạo và quản lý nhiều bảng khác nhau
  - Kéo và thả cột/thẻ dễ dàng
  - Sắp xếp lại thứ tự cột và thẻ

- **👥 Tính năng cộng tác**:

  - Mời người dùng vào bảng
  - Quản lý thành viên bảng
  - Thêm thành viên vào thẻ

- **📝 Quản lý thẻ nâng cao**:

  - Thêm mô tả cho thẻ với Markdown
  - Theo dõi hoạt động trên thẻ
  - Tùy chỉnh thông tin thẻ

- **🚀 Trải nghiệm người dùng**:

  - Giao diện đáp ứng trên mọi thiết bị
  - Chế độ sáng/tối tùy chỉnh
  - Thông báo theo thời gian thực (real-time)
  - Tìm kiếm bảng nhanh chóng

- **⚙️ Cài đặt người dùng**:
  - Quản lý tài khoản
  - Cài đặt bảo mật

## 🛠️ Công nghệ sử dụng

### Frontend

- **React 18**: Thư viện UI hiện đại với React Hooks
- **Vite**: Công cụ build siêu nhanh với hot-reload
- **Material UI v5**: Hệ thống design component với CSS-in-JS
- **@dnd-kit**: Thư viện kéo thả mạnh mẽ và hiệu năng cao
- **Redux Toolkit**: Quản lý trạng thái ứng dụng một cách hiệu quả
- **Redux Persist**: Lưu trữ state vào localStorage
- **React Router Dom v6**: Định tuyến ứng dụng với các tính năng mới nhất
- **React Hook Form**: Xử lý form với hiệu suất cao
- **Socket.IO Client**: Kết nối realtime với backend
- **React MD Editor**: Trình soạn thảo Markdown cho mô tả thẻ
- **Axios**: HTTP client với interceptors xử lý token
- **React Toastify**: Thông báo toast đa dạng
- **Moment.js**: Định dạng thời gian

### Backend (Tích hợp API)

- API RESTful xây dựng trên Node.js/Express
- Xác thực JWT
- Socket.IO cho tính năng realtime
- MongoDB lưu trữ dữ liệu

## 📦 Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js (>=18.x)
- npm hoặc yarn

### Các bước cài đặt

1. **Sao chép repository**:

   ```bash
   git clone https://github.com/dhoangvu1811/Trello-Web.git
   cd Trello-Web
   ```

2. **Cài đặt các dependencies**:

   ```bash
   npm install
   # hoặc
   yarn install
   ```

3. **Khởi động máy chủ phát triển**:

   ```bash
   npm run dev
   # hoặc
   yarn dev
   ```

4. **Build cho production**:
   ```bash
   npm run build
   # hoặc
   yarn build
   ```

Ứng dụng sẽ chạy tại địa chỉ: [http://localhost:5173](http://localhost:5173)

## 🏗️ Cấu trúc dự án

```
src/
├── App.jsx                  # Component ứng dụng chính và cấu hình routes
├── main.jsx                 # Điểm vào ứng dụng với các providers
├── socketClient.js          # Cấu hình Socket.IO client
├── theme.js                 # Cấu hình theme Material UI
├── apis/                    # Tích hợp API và gọi API
│   ├── index.js             # Các hàm gọi API
│   └── mock-data.js         # Dữ liệu mẫu cho dev
├── assets/                  # Tài nguyên tĩnh (hình ảnh, SVG)
├── components/              # Các component dùng chung
│   ├── AppBar/              # Thanh điều hướng và menus
│   ├── Form/                # Component form dùng chung
│   ├── Loading/             # Spinner và loading indicators
│   ├── Modal/               # Các modal/dialog
│   └── ModeSelect/          # Chọn chế độ sáng/tối
├── customHooks/             # Custom React hooks
├── customLibraries/         # Thư viện tùy chỉnh (DndKit sensors)
├── pages/                   # Các trang ứng dụng
│   ├── 404/                 # Trang không tìm thấy
│   ├── Auth/                # Trang xác thực (đăng nhập/đăng ký)
│   ├── Boards/              # Trang hiển thị và quản lý bảng
│   │   ├── BoardBar/        # Tiêu đề và thanh công cụ bảng
│   │   └── BoardContent/    # Nội dung bảng với cột và thẻ
│   ├── Settings/            # Trang cài đặt người dùng
│   └── Users/               # Trang quản lý người dùng
├── redux/                   # Quản lý trạng thái với Redux
│   ├── store.js             # Cấu hình Redux store với persist
│   ├── activeBoard/         # State và logic cho bảng đang hoạt động
│   ├── activeCard/          # State và logic cho thẻ đang hoạt động
│   ├── notifications/       # State và logic cho thông báo
│   └── user/                # State và logic cho người dùng
└── utils/                   # Các hàm tiện ích
    ├── authorizeAxios.js    # Cấu hình Axios với interceptors
    ├── constants.js         # Các hằng số toàn cục
    ├── formatters.js        # Hàm định dạng dữ liệu
    ├── sort.js              # Hàm sắp xếp dữ liệu
    └── validators.js        # Xác thực đầu vào
```

## ⚙️ Scripts có sẵn

- **npm run dev**: Khởi động máy chủ phát triển với host sẵn sàng truy cập từ mạng cục bộ
- **npm run build**: Build ứng dụng cho production với các tối ưu hóa
- **npm run lint**: Kiểm tra lỗi code với ESLint
- **npm run preview**: Xem trước bản build production

## 🔍 Chi tiết tính năng

### Kéo và thả (Drag & Drop)

Ứng dụng sử dụng thư viện @dnd-kit để cung cấp trải nghiệm kéo và thả mượt mà. Các tính năng kéo thả bao gồm:

- **Sắp xếp cột**: Kéo thả để sắp xếp lại vị trí các cột trên bảng
- **Di chuyển thẻ**: Kéo thẻ giữa các cột khác nhau
- **Sắp xếp thẻ**: Kéo thả để thay đổi thứ tự các thẻ trong cùng một cột
- **Hiệu ứng trực quan**: Hiệu ứng khi kéo các phần tử giúp trải nghiệm người dùng tốt hơn

### Xác thực và bảo mật

- **Đăng nhập/đăng ký**: Form xác thực với đầy đủ validation
- **Xác minh email**: Gửi email xác minh khi đăng ký tài khoản
- **Route được bảo vệ**: Các route yêu cầu đăng nhập trước khi truy cập
- **JWT Authentication**: Xác thực bằng JSON Web Token
- **Quản lý phiên**: Tự động gia hạn token và xử lý hết hạn

### Quản lý bảng (Boards)

- **Danh sách bảng**: Hiển thị tất cả bảng người dùng có quyền truy cập
- **Tạo bảng mới**: Tạo bảng với tên và các thiết lập tùy chỉnh
- **Mời thành viên**: Mời người dùng khác tham gia cộng tác trên bảng
- **Tùy chỉnh bảng**: Thay đổi tên, mô tả và các thiết lập bảng

### Real-time với Socket.IO

- **Mời tham gia Board**: Người dùng được mời nhận thông báo real-time và có thể chấp nhận/từ chối ngay lập tức

### Quản lý thẻ nâng cao

- **Trình soạn thảo Markdown**: Thêm mô tả chi tiết cho thẻ với định dạng Markdown
- **Quản lý thành viên**: Thêm/xóa thành viên cho từng thẻ

### Thông báo hệ thống

- **Thông báo Toast**: Hiển thị thông báo khi thực hiện các hành động
- **Xác nhận hành động**: Hộp thoại xác nhận trước khi thực hiện các hành động quan trọng

### Tùy chỉnh giao diện

- **Chế độ tối/sáng**: Chuyển đổi giữa giao diện tối và sáng
- **Giao diện đáp ứng**: Tối ưu hiển thị trên máy tính, máy tính bảng và điện thoại di động
