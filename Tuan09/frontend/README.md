# MiniMax Tours Frontend

Frontend React/Vite cho hệ thống Travel Booking SOA.

Quy tắc kiến trúc:

- Frontend chỉ gọi **Orchestrator Service**.
- Frontend không gọi trực tiếp User, Tour, Booking, Payment.

## Máy Hiền

IP frontend:

```text
10.11.58.17
```

Địa chỉ Orchestrator:

```text
http://10.11.58.156:8080
```

## Cách Chạy

Nếu chưa có `node_modules`:

```powershell
cd frontend
npm.cmd install
```

Chạy frontend:

```powershell
cd frontend
npm.cmd run dev
```

Mở trình duyệt:

```text
http://10.11.58.17:3000
```

Nếu chạy ngay trên máy Hiền, cũng có thể mở:

```text
http://localhost:3000
```

## Cấu Hình Orchestrator

Mặc định frontend gọi:

```text
http://10.11.58.156:8080
```

Nếu cần đổi, tạo file `.env.local` trong thư mục `frontend`:

```text
VITE_ORCHESTRATOR_URL="http://10.11.58.156:8080"
```

Sau khi sửa `.env.local`, tắt terminal đang chạy frontend rồi chạy lại:

```powershell
npm.cmd run dev
```

## Tài Khoản Demo

```text
truong@example.com / 123456
huy@example.com / 123456
sang@example.com / 123456
hien@example.com / 123456
```
