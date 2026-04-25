-- Tạo 4 database cho 4 service (DB-per-service)
-- Notification Service không cần DB ở giai đoạn 1 (theo ADR-005).

CREATE DATABASE user_db;
CREATE DATABASE movie_db;
CREATE DATABASE booking_db;
CREATE DATABASE payment_db;
