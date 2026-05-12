Bài Tập Thực Hành
Kiến Trúc và Thiết Kế Phần Mềm

Nguyễn Trọng Tiến

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

SOFTWARE ARCHITECTURE

Buổi 5 — SERVICE-BASED ARCHITECTURE

Bài toán: Mini Food Ordering System

Một công ty muốn xây dựng hệ thống đặt món ăn nội bộ cho nhân viên (giống
ShopeeFood mini).

❖  Yêu cầu chức năng:

1.  Quản lý món ăn:

•  Xem danh sách món ăn
•  Thêm / sửa / xóa món ăn

2.  Quản lý người dùng:

•  Đăng ký / đăng nhập
•  Phân quyền (USER / ADMIN)

3.  Đặt món:

•  Thêm món vào giỏ hàng
•  Tạo đơn hàng
4.  Thanh toán (giả lập):

•  Chọn phương thức thanh toán (COD / Banking)
•  Cập nhật trạng thái đơn hàng

5.  Thông báo

•  Khi đặt hàng thành công → gửi thông báo (console log hoặc REST call)

❖  Yêu cầu kiến trúc:

Áp dụng Service-Based Architecture:

•  Mỗi chức năng = 1 service riêng biệt (Spring Boot)
•  Giao tiếp qua REST API (HTTP)
•  Có thể dùng API Gateway (optional)

Phân công 5 người:
❖  Người 1– Frontend (ReactJS)

UI:

•  Login/Register
•  Danh sách món
•  Giỏ hàng
•  Đặt hàng

Gọi API từ các service
Tech:

•  ReactJS + Axios

---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

1

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

❖  Người 2 – User Service (Spring Boot)

API:

•  POST /register
•  POST /login
•  GET /users

Yêu cầu:

•  JWT đơn giản (optional)
•  Lưu memory hoặc H2

❖  Người 3 – Food Service

API:

•  GET /foods
•  POST /foods
•  PUT /foods/{id}
•  DELETE /foods/{id}

Yêu cầu:

•  Không cần auth phức tạp
•  Seed sẵn dữ liệu

❖  Người 4 – Order Service

API:

•  POST /orders
•  GET /orders

Khi tạo order:

•  Gọi Food Service để lấy thông tin món
•  Gọi User Service để validate user

❖  Người 5 – Payment + Notification Service

API:

•  POST /payments

Khi thanh toán:

•  Update trạng thái order (gọi Order Service)
•  Gửi notification

Notification:

•  Gọi API hoặc log:

Mô hình triển khai (LAN)

User A đã đặt đơn #123 thành công

•  Mỗi người chạy service trên máy riêng:
▪  192.168.?.?:8081 → User Service
▪  192.168. ?.?:8082 → Food Service

---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

2

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

▪  192.168. ?.?:8083 → Order Service
▪  192.168. ?.?:8084 → Payment Service

•  Frontend gọi trực tiếp

Cấu hình CORS + IP thật (KHÔNG dùng localhost chéo máy)

Kịch bản Test (BẮT BUỘC DEMO)

1.  User đăng ký + login
2.  Xem danh sách món
3.  Thêm vào giỏ → tạo order
4.  Thanh toán
5.  Nhận thông báo
Bonus (nếu còn thời gian)

1.  API Gateway (Spring Cloud Gateway)
2.  Load balancing (round robin giả lập)
3.  Retry khi service fail
4.  Logging tập trung

Tiêu chí chấm điểm

Tiêu chí

Đúng kiến trúc Service-Based

API hoạt động

Giao tiếp giữa services

Frontend chạy mượt

Demo hoàn chỉnh

Giai đoạn 2 (Homework):

•  Dockerize

Điểm

3

2

2

1.5

1

▪  Mỗi service = 1 container
▪  docker-compose chạy toàn hệ thống

•  Deploy local server (1 máy)

Giai đoạn 3: (Optional)

•  Dockerize

▪  Chạy hệ thống trên 1 server thật (VPS hoặc máy lab)

---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

3

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

Buổi 6 — EVENT-DRIVEN ARCHITECTURE

Bài toán: Movie Ticket System

Một hệ thống đặt vé xem phim với yêu cầu xử lý bất đồng bộ (asynchronous) để đảm
bảo hệ thống scalable.

❖  Yêu cầu chức năng:

•  Quản lý phim:

•  Xem danh sách phim
•  Thêm / sửa phim

•  Quản lý người dùng:

•  Đăng ký / đăng nhập

•  Đặt vé:

•  Chọn phim + số ghế
•  Tạo booking

•  Thanh toán:

•  Thanh toán vé (giả lập)
•  Cập nhật trạng thái booking

•  Thông báo

•  Gửi thông báo khi đặt vé thành công

❖  Yêu cầu kiến trúc:

Áp dụng Event-Driven Architecture:

•  Các service KHÔNG gọi trực tiếp nhau
•  Giao tiếp qua Message Broker (Kafka / RabbitMQ / Redis PubSub)

Luồng event chính:

User → Booking Service → (Publish Event)
→ Payment Service (Consume)
→ Notification Service (Consume)

Danh sách Event:

Event

Mô tả

USER_REGISTERED
BOOKING_CREATED
PAYMENT_COMPLETED
BOOKING_FAILED

Người dùng đăng ký
Tạo booking
Thanh toán xong
Thanh toán thất bại

Phân công 5 người:
❖  Người 1– Frontend (ReactJS)

UI:

---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

4

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

•  Login/Register
•  Danh sách phim
•  Đặt vé

Gọi API chỉ vào 1 service (Gateway hoặc Booking Service)
Không gọi trực tiếp tất cả service
❖  Người 2 – User Service (Spring Boot)

API:

•  POST /register
•  POST /login

Khi đăng ký:

•  Publish event: USER_REGISTERED

❖  Người 3 – Movie Service

API:

•  GET /movies
•  POST /movies

Yêu cầu:

•  Không cần event phức tạp

❖  Người 4 – Booking Service (CORE)

API:

•  POST /bookings
•  GET / bookings

Khi tạo booking:

•  Publish event: BOOKING_CREATED

KHÔNG xử lý payment trực tiếp
❖  Người 5 – Payment + Notification Service

Payment:

•  Listen: BOOKING_CREATED
•  Xử lý: Random success/fail
•  Publish:

PAYMENT_COMPLETED hoặc BOOKING_FAILED

Notification:

•  Listen: PAYMENT_COMPLETED
•  Output: "Booking #123 thành công!"

Notification:

•  Gọi API hoặc log:

Mô hình triển khai trên LAN:

User A đã đặt đơn #123 thành công

---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

5

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

Service

IP

User
Movie
Booking
Payment
Frontend

192.168.?.?:8081
192.168.?.?:8082
192.168.?.?:8083
192.168.?.?:8084
192.168.?.?:8085

Broker chạy riêng:

Kafka / RabbitMQ: 192.168.?.?:9092

Kịch bản Test (BẮT BUỘC DEMO)
1.  User đăng ký → log event
2.  Chọn phim→ đặt vé
3.  Payment xử lý
4.  Notification hiển thị kết quả

Bonus (nếu làm nhanh)

1.  Dead Letter Queue
2.  Retry mechanism
3.  Event log (lưu lịch sử event)
4.  Dashboard realtimeAPI Gateway (Spring Cloud Gateway)

Tiêu chí chấm điểm

Tiêu chí

Điểm

Đúng Event-Driven
Publish/Consume đúng
Flow hoạt động end-to-end
Không gọi trực tiếp service
Demo + log rõ ràng

Giai đoạn 2 (Homework):

•  Dockerize

3
2.5
2
1.5
1

▪  Mỗi service = 1 container
▪  docker-compose chạy toàn hệ thống

•  Deploy local server (1 máy)

Giai đoạn 3: (Optional)

•  Chạy hệ thống trên 1 server thật (VPS hoặc máy lab)

---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

6

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

Buổi 7 — SPACE-BASED ARCHITECTURE

Bài toán: Hệ thống Flash Sale (Bán hàng sốc – chịu tải cao)

Một hệ thống bán hàng flash sale (giống Shopee/Lazada) cần:

•  Chịu tải cao (1000+ request/s)
•  Tránh nghẽn database
•  Xử lý nhanh (low latency)

❖  Yêu cầu 5 chức năng chính:

•  Xem danh sách sản phẩm
•  Xem chi tiết sản phẩm
•  Thêm vào giỏ hàng
•  Đặt hàng (checkout)
•  Giảm tồn kho (real-time)

❖  Yêu cầu kiến trúc:

Áp dụng Space-Based Architecture:

❖  Nguyên lý:

•  Hạn chế DB (tránh bottleneck)
•  Dữ liệu nằm trong Memory Grid (Data Grid)
•  Xử lý tại Processing Unit (PU)

❖  Thành phần chính

•  Processing Unit (PU) = Service xử lý + cache local
•  Data Grid = Redis / Hazelcast (chia sẻ dữ liệu RAM)
•  Messaging (optional)

Phân công 5 người:
❖  Người 1– Frontend (ReactJS)

UI:

•  Danh sách sản phẩm
•  Giỏ hàng
•  Đặt hàng

Gọi API vào Processing Unit (PU)

❖  Người 2 – Product Processing Unit (PU1)

API:

Data:

•  GET /products
•  GET /products/{id}

•  Load từ Data Grid (Redis)

Không đọc DB trực tiếp

❖  Người 3 – Cart Processing Unit (PU2)
---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

7

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

API:

Data:

•  POST /cart/add
•  GET /cart

•  Lưu trong Data Grid (session/cart)

❖  Người 4 – Order Processing Unit (PU3)

API:

•  POST / checkout

Xử lý:

•  Lấy cart từ Data Grid
•  Tạo order
•  Publish event (optional)

❖  Người 5 – Inventory Processing Unit (PU4)

API:

•  GET /stock/{productId}

Xử lý:

•  Khi checkout

-  Giảm tồn kho trực tiếp trên Data Grid

Không gọi DB

Mô hình triển khai trên LAN:

Service

IP

Redis (Data Grid)
PU1 – Product
PU2 – Cart
PU3 – Order
PU4 – Inventory
Frontend

192.168.?.?:6379
192.168.?.?:8081
192.168.?.?:8082
192.168.?.?:8083
192.168.?.?:8084
192.168.?.?:3000

Luồng xử lý chính

❖  Luồng đặt hàng

1.  User chọn sản phẩm → add to cart

2.  Cart lưu vào Data Grid (Redis)

3.  User checkout

4.  Order PU:

o  Lấy cart từ Redis

---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

8

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

o  Gọi Inventory (hoặc trực tiếp Redis)
o  Giảm stock

5.  Trả kết quả ngay (KHÔNG chờ DB)

Kịch bản Test (BẮT BUỘC DEMO)

1.  Load danh sách sản phẩm từ Redis
2.  Add to card
3.  Checkout
4.  Stock giảm ngay lập tức
5.  Không bị chậm khi nhiều request

Bonus (nếu làm nhanh)

1.  Dùng Hazelcast thay Redis
2.  Implement locking (SETNX)
3.  Thêm Queue xử lý async
4.  Simulate load test (Postman Runner)

Tiêu chí chấm điểm

Tiêu chí

Đúng Space-Based
Không phụ thuộc DB
Dùng Data Grid đúng
Flow nhanh, không nghẽn
Demo scale (clone PU)

Điểm

3
2.5
2
1.5
1

---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

9

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

Buổi 8: ORCHESTRATION-DRIVEN SOA

Bài toán: Travel Booking System

Xây dựng hệ thống đặt tour:

•  Người dùng chọn tour
•  Đặt tour
•  Thanh toán
•  Nhận xác nhận

❖  5 chức năng chính

1.  Quản lý người dùng

•  Đăng ký / đăng nhập

2.  Quản lý tour

•  Xem danh sách tour
•  Chi tiết tour

3.  Đặt tour

•  Tạo booking

4.  Thanh toán

•  Thanh toán booking

5.  Xác nhận

•  Gửi thông báo booking thành công

Yêu cầu kiến trúc:

Áp dụng Orchestration-Driven SOA

Nguyên lý:

•  Có Orchestrator Service (trung tâm)
•  Các service khác:

o  KHÔNG gọi nhau trực tiếp
o  Chỉ nhận lệnh từ Orchestrator

Thành phần hệ thống

Thành phần

Vai trò

Orchestrator
User Service
Tour Service
Booking Service
Payment Service

Điều phối toàn bộ flow
Quản lý user
Quản lý tour
Tạo booking
Thanh toán

---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

10

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

Phân công 5 người

❖  Người 1 – Frontend (ReactJS)

•  UI:

o  Login
o  Xem tour
o  Đặt tour

Gọi:

•  Chỉ gọi Orchestrator

Không gọi service khác

❖  Người 2 – Orchestrator Service

•  API:

o  POST /book-tour

Flow trong Orchestrator:

1.  Validate user (User Service)
2.  Lấy thông tin tour (Tour Service)
3.  Tạo booking (Booking Service)
4.  Gọi Payment Service
5.  Trả kết quả về Frontend

Tất cả đều là REST call

❖  Người 3 – User Service

•  API:

o  POST /login
o  GET /users/{id}

❖  Người 4 – Tour Service

•  API:

o  GET /tours
o  GET /tours/{id}

❖  Người 5 – Booking + Payment Service

Booking:

•  API:

o  POST /bookings

Payment:

•  API:

o  POST /payments

Logic:

---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

11

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

•  Random success/fail

Triển khai trên LAN

IP

192.168.1.10:8080
192.168.1.11:8081
192.168.1.12:8082
192.168.1.13:8083
192.168.1.14:8084
192.168.1.15:3000

Service

Orchestrator
User
Tour
Booking
Payment
Frontend

Flow chi tiết
Flow đặt tour

1.  Frontend → Orchestrator
2.  Orchestrator:

o  gọi User Service
o  gọi Tour Service
o  gọi Booking Service
o  gọi Payment Service

3.  Trả kết quả về Frontend

---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

12

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

Buổi 09: MICROSERVICES ARCHITECTURE

Bài toán: E-Commerce Mini

Xây dựng hệ thống bán hàng đơn giản (giống Shopee mini):

•  Người dùng mua sản phẩm
•  Tạo đơn hàng
•  Thanh toán

❖  5 chức năng chính

1.  Quản lý người dùng

•  Đăng ký / đăng nhập

2.  Quản lý sản phẩm

•  Xem danh sách sản phẩm
•  Thêm / sửa sản phẩm

3.  Giỏ hàng

•  Thêm / xóa sản phẩm

4.  Đặt hàng

•  Tạo đơn hàng từ giỏ

5.  Thanh toán

•  Thanh toán đơn hàng

Yêu cầu kiến trúc:

Áp dụng Microservices Architecture

Nguyên tắc:

•  Mỗi domain = 1 service
•  Service có database riêng
•  Giao tiếp qua REST API
•  Không share DB

Danh sách Microservices

Service

User Service
Product Service
Cart Service
Order Service

Chức năng

User
Product
Cart
Order

---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

13

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

Payment

Payment Service
Phân công 5 người
❖  Người 1 – Frontend (ReactJS)
UI:

•  Login/Register
•  Danh sách sản phẩm
•  Giỏ hàng
•  Checkout

Gọi:

•  API Gateway (hoặc gọi trực tiếp service)

❖  Người 2 – User Service
API:

•  POST /register
•  POST /login
•  GET /users

DB riêng:

•  users table

❖  Người 3 – Product Service
API:

•  GET /products
•  POST /products
•  PUT /products/{id}

DB riêng:

•  products table

❖  Người 4 – Cart Service
API:

•  POST /cart/add
•  GET /cart/{userId}
•  DELETE /cart/item

Logic:

•  Lưu cart theo user

Không lưu product detail (chỉ productId)
❖  Người 5 – Order + Payment Service

---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

14

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

Order:

API:

•  POST /orders
•  GET /orders

Flow:

•  Lấy cart từ Cart Service
•  Gọi Product Service để lấy giá
•  Tạo order

Payment:

API:

•  POST /payments

Logic:

•  Update trạng thái order

Triển khai trên LAN

Service

User
Product
Cart
Order
Frontend
User

Luồng xử lý chính
Flow đặt hàng

1.  User login
2.  Xem sản phẩm
3.  Add to cart
4.  Checkout:

•  Cart Service → lấy cart
•  Product Service → lấy giá
•  Order Service → tạo order

5.  Payment → update trạng thái

IP

192.168.?.?:8081
192.168.?.?:8082
192.168.?.?:8083
192.168.?.?:8084
192.168.?.?:3000
192.168.?.?:8081

---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

15

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

Buổi 10: HYBRID (EVENT-DRIVEN + MICROSERVICES)

Bài toán: Food Delivery System

Hệ thống giống GrabFood/ShopeeFood mini:
•  Cần phản hồi nhanh (REST)
•  Nhưng xử lý hậu trường (async) → Event

❖  5 chức năng chính

1.  Quản lý người dùng

•  Đăng ký / đăng nhập

2.  Xem món ăn

•  Danh sách món
•  Chi tiết món

3.  Đặt hàng

•  Tạo order
•  Xem order

4.  Thanh toán

•  Thanh toán đơn hàng

5.  Thông báo

•  Gửi thông báo khi order thành công

Yêu cầu kiến trúc: Hybrid
Microservices (REST – synchronous)

•  Frontend → API Gateway → Service
•  Dùng cho:

o  Login
o  Get data (foods, orders)

Event-Driven (async)
•  Dùng cho:

o  Payment
o  Notification
o  Order processing hậu kỳ

---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

16

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

Dùng gì

REST
Event

Nguyên lý thiết kế

Loại xử lý

Cần response ngay
Không cần response ngay

Luồng hệ thống (QUAN TRỌNG)
Flow chính:

1.  User → Frontend → API Gateway
2.  Gateway → Order Service (REST)
3.  Order Service:

•  Lưu order
•  Publish event:

ORDER_CREATED

4.  Payment Service (consume event):

•  Xử lý thanh toán
•  Publish:

PAYMENT_SUCCESS

5.  Notification Service:
•  Gửi thông báo

Danh sách Event

Event

Mô tả

Tạo đơn
Thanh toán thành công
Thanh toán thất bại

ORDER_CREATED
PAYMENT_SUCCESS
PAYMENT_FAILED

Phân công 5 người
❖  Người 1 – Frontend (ReactJS)
UI:

•  Login/Register
•  Danh sách món
•  Đặt hàng

Gọi:

•  API Gateway (REST)

Không biết event phía sau
❖  Người 2 – API Gateway

---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

17

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

Route:

•

•

•

/api/users → User Service
/api/foods → Food Service
/api/orders → Order Service

Có thể dùng:

•  Spring Cloud Gateway
❖  Người 3 – User + Food Service
User:

•  POST /register
•  POST /login

Food:

•  GET /foods

Pure REST (không event)
❖  Người 4 – Order Service (CORE)

•  API:

o  POST /orders
o  GET /orders

Khi tạo order:

•  Lưu DB
•  Publish event:
ORDER_CREATED
Không xử lý payment trực tiếp
❖  Người 5 – Payment + Notification Service
Payment Service:
•  Consume:
ORDER_CREATED

•  Xử lý:

o  Random success/fail

•  Publish:

PAYMENT_SUCCESS hoặc PAYMENT_FAILED
Notification Service:
•  Consume:

PAYMENT_SUCCESS

•  Output:

"Đơn hàng #123 đã thanh toán thành công!"

---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

18

Bài tập thực hành Kiến trúc và thiết kế phần mềm
---------------------------------------------------------------------------------------------------------------------------

IP

192.168.1.10:8080
192.168.1.11:8081
192.168.1.12:8082
192.168.1.13:8083
192.168.1.14:3000
192.168.1.100:9092

Triển khai trên LAN

Service

Gateway
User/Food
Order
Payment
Frontend
Kafka/RabbitMQ

Kịch bản demo

1.  User login
2.  Xem món
3.  Đặt hàng (REST)
4.  Payment chạy ngầm (Event)
5.  Notification hiển thị

------------------------------Hết------------------------------

---------------------------------------------------------------------------------------------------------------------------
Bộ môn: Kỹ thuật phần mềm

19

