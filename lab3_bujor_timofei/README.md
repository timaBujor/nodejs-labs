# Лабораторная работа №3 — Веб-приложение на Express.js, EJS и middleware

**Студент:** Bujor Timofei, группа IAFR2302
**GitHub:** https://github.com/timaBujor/nodejs-labs/tree/main/lab3_bujor_timofei

## Тема
Система управления учебными курсами: просмотр, добавление, редактирование, удаление, поиск и фильтрация курсов.

## Запуск
```
npm install
node app.js
```
Приложение: http://localhost:3000

## Структура (MVC)
- `models/courseModel.js` — массив курсов и операции с ними
- `controllers/courseController.js` — обработка запросов
- `routes/courseRoutes.js` — маршруты
- `middleware/logger.js` — логирование запросов
- `middleware/validateCourse.js` — валидация формы
- `views/` — EJS-шаблоны (courses, partials, 404, error)
- `public/css/style.css` — оформление

## Маршруты
| Метод | URL | Назначение |
|---|---|---|
| GET | / | Перенаправление на /courses |
| GET | /courses | Список курсов (?search=, ?semester=) |
| GET | /courses/new | Форма добавления |
| POST | /courses | Сохранение нового курса |
| GET | /courses/:id | Просмотр курса |
| GET | /courses/:id/edit | Форма редактирования |
| POST | /courses/:id/edit | Сохранение изменений |
| POST | /courses/:id/delete | Удаление курса |
| * | неизвестный URL | Страница 404 |
