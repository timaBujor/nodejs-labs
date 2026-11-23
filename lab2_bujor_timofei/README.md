# Лабораторная работа №2 — REST API на Express.js

**Студент:** Bujor Timofei, группа IAFR2302
**GitHub:** https://github.com/timaBujor/nodejs-labs/tree/main/lab2_bujor_timofei

## Запуск
npm install
node app.js → http://localhost:3000

## Структура (MVC)
models/ — данные, controllers/ — логика, routes/ — маршруты, middleware/logger.js — логирование

## Маршруты
| Метод | URL | Назначение |
|---|---|---|
| GET | /api/books | Все книги (фильтры ?genre=, ?year=) |
| GET | /api/books/search?title= | Поиск по части названия |
| GET | /api/books/:id | Книга по ID |
| POST | /api/books | Добавить книгу (201 / 400) |
| PATCH | /api/books/:id | Изменить книгу |
| DELETE | /api/books/:id | Удалить книгу |
| GET | /api/authors | Все авторы |
| GET | /api/authors/:id | Автор по ID |
| GET | /api/authors/:id/books | Книги автора |
| GET | /api/statistics | Статистика |
| * | неизвестный URL | 404 Route not found |
