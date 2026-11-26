# Лабораторная работа №3 — Веб-приложение на Express.js, EJS и middleware

**Студент:** Bujor Timofei, группа IAFR2302
**GitHub:** https://github.com/timaBujor/nodejs-labs/tree/main/lab3_bujor_timofei

## Тема
Система управления учебными курсами: просмотр, добавление, редактирование, удаление, поиск и фильтрация курсов. Данные хранятся в массиве.

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

## Страницы
| Назначение | Адрес |
|---|---|
| Главная (перенаправляет на список) | http://localhost:3000/ |
| Список курсов | http://localhost:3000/courses |
| Поиск по названию | http://localhost:3000/courses?search=node |
| Поиск по преподавателю | http://localhost:3000/courses?search=ivan |
| Фильтр по семестру | http://localhost:3000/courses?semester=1 |
| Поиск + семестр | http://localhost:3000/courses?search=node&semester=3 |
| Ничего не найдено | http://localhost:3000/courses?search=zzz |
| Форма добавления | http://localhost:3000/courses/new |
| Просмотр курса | http://localhost:3000/courses/1 |
| Форма редактирования | http://localhost:3000/courses/1/edit |
| Курс не найден (404) | http://localhost:3000/courses/999 |
| Неизвестная страница (404) | http://localhost:3000/abc |

## Действия форм (POST, отправляются кнопками на страницах)
| Метод | Адрес | Назначение |
|---|---|---|
| POST | http://localhost:3000/courses | Сохранение нового курса |
| POST | http://localhost:3000/courses/1/edit | Сохранение изменений |
| POST | http://localhost:3000/courses/1/delete | Удаление курса |