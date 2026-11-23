# Лабораторная работа №4 — CRUD-приложение с PostgreSQL и Sequelize

**Студент:** Bujor Timofei, группа IAFR2302
**GitHub:** https://github.com/timaBujor/nodejs-labs/tree/main/lab4_bujor_timofei

## Тема
Система управления учебными курсами: преподаватели и курсы хранятся в PostgreSQL, связь One-to-Many (один преподаватель — много курсов).

## Технологии
Node.js, Express.js, PostgreSQL, Sequelize, EJS, dotenv, архитектура MVC.

## Запуск
1. Создайте в PostgreSQL базу данных `node_courses`.
2. Скопируйте `.env.example` в `.env` и укажите свой пароль от PostgreSQL.
3. Установите зависимости и запустите:
```
npm install
node app.js
```
Приложение: http://localhost:3000. Таблицы `Teachers` и `Courses` создаются автоматически (`sequelize.sync()`), начальные данные добавляются, если таблицы пустые.

## Структура (MVC)
- `config/database.js` — подключение Sequelize к PostgreSQL
- `models/` — модели `Teacher`, `Course`, связи (`index.js`), начальные данные (`seed.js`)
- `controllers/` — логика курсов, преподавателей и статистики
- `routes/` — маршруты `/courses` и `/teachers`
- `middleware/logger.js` — логирование запросов
- `middleware/validateData.js` — валидация форм и проверка ID
- `views/` — EJS-шаблоны
- `public/css/style.css` — оформление

## Маршруты
| Метод | URL | Назначение |
|---|---|---|
| GET | / | Перенаправление на /courses |
| GET | /courses | Список курсов (?search=, ?teacherId=, ?semester=) |
| GET | /courses/new | Форма добавления курса |
| POST | /courses | Сохранение курса |
| GET | /courses/:id | Просмотр курса |
| GET | /courses/:id/edit | Форма редактирования |
| POST | /courses/:id/edit | Сохранение изменений |
| POST | /courses/:id/delete | Удаление курса |
| GET | /teachers | Список преподавателей |
| GET | /teachers/new | Форма добавления преподавателя |
| POST | /teachers | Сохранение преподавателя |
| GET | /teachers/:id | Преподаватель и его курсы |
| GET | /teachers/:id/edit | Форма редактирования |
| POST | /teachers/:id/edit | Сохранение изменений |
| POST | /teachers/:id/delete | Удаление (запрещено, если есть курсы) |
| GET | /statistics | Статистика |
| * | неизвестный URL | Страница 404 |
