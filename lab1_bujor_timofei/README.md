# Лабораторная работа №1 — Простой HTTP-сервер на Node.js

**Студент:** Bujor Timofei, группа IAFR2302
**GitHub:** https://github.com/timaBujor/nodejs-labs/tree/main/lab1_bujor_timofei

## Запуск
node app.js → http://localhost:3000

## Маршруты
| Метод | URL | Результат |
|---|---|---|
| GET | / | Приветствие |
| GET | /about | Информация о приложении |
| GET | /student | Имя, фамилия, группа |
| GET | /api/student | Данные студента (JSON) |
| GET | /time | Текущая дата и время |
| GET | /api/courses | Список дисциплин (JSON) |
| GET | /random | Случайное число 1–100 (свой маршрут) |
| * | любой другой | 404 - Page not found (status 404) |

Каждый запрос логируется в формате: `METHOD | URL | DD.MM.YYYY HH:MM`