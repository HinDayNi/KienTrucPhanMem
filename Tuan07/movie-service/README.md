# movie-service (:8082)

CRUD phim, không phát event (đề bài: không cần event phức tạp).

## Endpoint

| Method | Path                | Auth   | Mô tả                              |
| ------ | ------------------- | ------ | ---------------------------------- |
| GET    | `/movies?page&size` | Public | List có phân trang (`{items, page, size, total}`) |
| GET    | `/movies/{id}`      | Public | Chi tiết 1 phim                    |
| POST   | `/movies`           | ADMIN  | Tạo phim                           |
| PUT    | `/movies/{id}`      | ADMIN  | Cập nhật phim                      |

Qua gateway: `/api/movies/...`. JWT decode tại service (HS256, cùng secret với user-service).

## Env

| Biến              | Default                                |
| ----------------- | -------------------------------------- |
| `DB_HOST/PORT`    | `localhost:5432`                       |
| `DB_USERNAME`     | `movieticket`                          |
| `DB_PASSWORD`     | `movieticket`                          |
| `JWT_SECRET`      | (giống user-service & các service khác)|

## Run local

```bash
./mvnw spring-boot:run
```

## Seed

5 phim demo được seed qua Flyway `V1__init.sql`:
Inception, Oppenheimer, Dune: Part Two, Spider-Man: Across the Spider-Verse, The Godfather.

## Test

```bash
./mvnw test
```
