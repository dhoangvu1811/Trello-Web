# Trello Web Clone

Một ứng dụng Trello clone tương tác và đáp ứng được xây dựng bằng React và các công nghệ frontend hiện đại. Ứng dụng này cung cấp giao diện bảng kanban nơi người dùng có thể quản lý các công việc thông qua giao diện kéo và thả.

## Tính năng

- 🔐 Xác thực người dùng (đăng nhập/đăng ký)
- 📋 Bảng kanban với chức năng kéo và thả
- 📱 Thiết kế đáp ứng cho mọi thiết bị
- 🎨 Chủ đề có thể tùy chỉnh với Material UI
- 📌 Quản lý thẻ và cột
- 🔄 Quản lý trạng thái với Redux

## Công nghệ sử dụng

### Frontend

- **React 18**: Thư viện UI hiện đại
- **Vite**: Công cụ build nhanh
- **Material UI**: Thư viện component với chủ đề
- **@dnd-kit**: Chức năng kéo và thả
- **Redux Toolkit**: Quản lý trạng thái
- **React Router Dom**: Định tuyến
- **React Hook Form**: Xử lý biểu mẫu
- **React Toastify**: Thông báo toast
- **Axios**: HTTP client
- **Lodash**: Các hàm tiện ích

## Yêu cầu hệ thống

- Node.js (>=18.x)
- npm hoặc yarn

## Cài đặt

1. Sao chép repository:

   ```
   git clone https://github.com/yourusername/vite-trello-web-base-project.git
   cd vite-trello-web-base-project
   ```

2. Cài đặt các dependencies:

   ```
   npm install
   ```

3. Khởi động máy chủ phát triển:
   ```
   npm run dev
   ```

## Cấu trúc dự án

```
src/
├── App.jsx                  # Component ứng dụng chính
├── main.jsx                 # Điểm vào
├── theme.js                 # Cấu hình chủ đề MUI
├── apis/                    # Tích hợp API
├── assets/                  # Tài nguyên tĩnh
├── components/              # Các component có thể tái sử dụng
│   ├── AppBar/              # Thanh điều hướng
│   ├── Form/                # Các component biểu mẫu
│   └── ModeSelect/          # Bộ chọn chế độ chủ đề
├── customHooks/             # Custom React hooks
├── customLibraries/         # Thư viện tùy chỉnh (DndKit sensors)
├── pages/                   # Các trang ứng dụng
│   ├── 404/                 # Trang không tìm thấy
│   ├── Auth/                # Trang xác thực
│   ├── Boards/              # Các view bảng
│   │   ├── BoardBar/        # Tiêu đề bảng
│   │   └── BoardContent/    # Nội dung bảng với cột và thẻ
│   └── Users/               # Trang liên quan đến người dùng
├── redux/                   # Redux store và slices
└── utils/                   # Các hàm tiện ích
```

## Scripts có sẵn

- **npm run dev**: Khởi động máy chủ phát triển
- **npm run build**: Build cho production
- **npm run lint**: Chạy ESLint
- **npm run preview**: Xem trước bản build production

## Chi tiết tính năng

### Kéo và thả

Ứng dụng sử dụng @dnd-kit để cung cấp trải nghiệm kéo và thả mượt mà cho cột và thẻ. Người dùng có thể:

- Sắp xếp lại cột
- Di chuyển thẻ giữa các cột
- Sắp xếp lại thẻ trong cột

### Xác thực

Ứng dụng bao gồm biểu mẫu đăng nhập và đăng ký với xác thực.

### Thiết kế đáp ứng

Được xây dựng với Material UI để đảm bảo trải nghiệm tốt trên mọi thiết bị.

---
