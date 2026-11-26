# Лабораторная работа №1 — Простой HTTP-сервер на Node.js

**Студент:** Bujor Timofei, группа IAFR2302
**GitHub:** https://github.com/timaBujor/nodejs-labs/tree/main/lab1_bujor_timofei

## Запуск
```
node app.js
```
Сервер: http://localhost:3000

## Маршруты
| Метод | Адрес | Результат |
|---|---|---|
| GET | http://localhost:3000/ | Приветствие |
| GET | http://localhost:3000/about | Информация о приложении |
| GET | http://localhost:3000/student | Имя, фамилия, группа |
| GET | http://localhost:3000/api/student | Данные студента (JSON) |
| GET | http://localhost:3000/time | Текущая дата и время |
| GET | http://localhost:3000/api/courses | Список дисциплин (JSON) |
| GET | http://localhost:3000/random | Случайное число 1–100 (свой маршрут) |
| GET | http://localhost:3000/test | 404 - Page not found (status 404) |

Каждый запрос логируется в терминале в формате: `METHOD | URL | DD.MM.YYYY HH:MM`