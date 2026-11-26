# Лабораторная работа №2 — REST API на Express.js

**Студент:** Bujor Timofei, группа IAFR2302
**GitHub:** https://github.com/timaBujor/nodejs-labs/tree/main/lab2_bujor_timofei

## Запуск
```
npm install
node app.js
```
Сервер: http://localhost:3000

## Структура (MVC)
`models/` — данные, `controllers/` — логика, `routes/` — маршруты, `middleware/logger.js` — логирование

## GET-запросы (открываются в браузере)
| Назначение | Адрес |
|---|---|
| Все книги | http://localhost:3000/api/books |
| Книга по ID | http://localhost:3000/api/books/2 |
| Книга не найдена (404) | http://localhost:3000/api/books/99 |
| Фильтр по жанру | http://localhost:3000/api/books?genre=fantasy |
| Фильтр по году | http://localhost:3000/api/books?year=2008 |
| Жанр + год | http://localhost:3000/api/books?genre=fantasy&year=1937 |
| Поиск по названию | http://localhost:3000/api/books/search?title=node |
| Все авторы | http://localhost:3000/api/authors |
| Автор по ID | http://localhost:3000/api/authors/1 |
| Книги автора | http://localhost:3000/api/authors/1/books |
| Статистика | http://localhost:3000/api/statistics |
| Неизвестный маршрут (404) | http://localhost:3000/abc |

## POST / PATCH / DELETE (через Thunder Client или Postman)
| Метод | Адрес | Body (JSON) | Код |
|---|---|---|---|
| POST | http://localhost:3000/api/books | `{"title":"Clean Architecture","authorId":3,"genre":"programming","year":2017}` | 201 |
| POST | http://localhost:3000/api/books | `{"title":"No fields"}` | 400 |
| POST | http://localhost:3000/api/books | `{"title":"X","authorId":99,"genre":"x","year":2000}` | 400 (автор не существует) |
| PATCH | http://localhost:3000/api/books/1 | `{"year":1938}` | 200 |
| DELETE | http://localhost:3000/api/books/2 | — | 200 |
| DELETE | http://localhost:3000/api/books/2 (повторно) | — | 404 |

Каждый запрос логируется в терминале в формате: `METHOD | URL | DD.MM.YYYY HH:MM`