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
Приложение: http://localhost:3000

Таблицы `Teachers` и `Courses` создаются автоматически (`sequelize.sync()`), начальные данные добавляются, если таблицы пустые.

## Структура (MVC)
- `config/database.js` — подключение Sequelize к PostgreSQL
- `models/` — модели `Teacher`, `Course`, связи (`index.js`), начальные данные (`seed.js`)
- `controllers/` — логика курсов, преподавателей и статистики
- `routes/` — маршруты `/courses` и `/teachers`
- `middleware/logger.js` — логирование запросов
- `middleware/validateData.js` — валидация форм и проверка ID
- `views/` — EJS-шаблоны
- `public/css/style.css` — оформление

## Курсы
| Назначение | Адрес |
|---|---|
| Главная (перенаправляет на курсы) | http://localhost:3000/ |
| Список курсов | http://localhost:3000/courses |
| Поиск по названию | http://localhost:3000/courses?search=node |
| Фильтр по преподавателю | http://localhost:3000/courses?teacherId=1 |
| Фильтр по семестру | http://localhost:3000/courses?semester=1 |
| Комбинированный фильтр | http://localhost:3000/courses?search=web&teacherId=1&semester=1 |
| Форма добавления курса | http://localhost:3000/courses/new |
| Просмотр курса | http://localhost:3000/courses/1 |
| Форма редактирования | http://localhost:3000/courses/1/edit |
| Курс не найден (404) | http://localhost:3000/courses/999 |
| Некорректный ID (404) | http://localhost:3000/courses/abc |

## Преподаватели
| Назначение | Адрес |
|---|---|
| Список преподавателей | http://localhost:3000/teachers |
| Форма добавления | http://localhost:3000/teachers/new |
| Преподаватель и его курсы | http://localhost:3000/teachers/1 |
| Форма редактирования | http://localhost:3000/teachers/1/edit |
| Преподаватель не найден (404) | http://localhost:3000/teachers/999 |

## Прочее
| Назначение | Адрес |
|---|---|
| Статистика | http://localhost:3000/statistics |
| Неизвестная страница (404) | http://localhost:3000/xyz |

## Действия форм (POST, отправляются кнопками на страницах)
| Метод | Адрес | Назначение |
|---|---|---|
| POST | http://localhost:3000/courses | Сохранение курса |
| POST | http://localhost:3000/courses/1/edit | Сохранение изменений курса |
| POST | http://localhost:3000/courses/1/delete | Удаление курса |
| POST | http://localhost:3000/teachers | Сохранение преподавателя |
| POST | http://localhost:3000/teachers/1/edit | Сохранение изменений преподавателя |
| POST | http://localhost:3000/teachers/1/delete | Удаление (запрещено, если есть курсы) |