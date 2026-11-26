# Лабораторная работа №5 — Аутентификация, авторизация и защита Express-приложения

**Студент:** Bujor Timofei, группа IAFR2302
**GitHub:** https://github.com/timaBujor/nodejs-labs/tree/main/lab5_bujor_timofei

## Тема
Система управления учебными курсами (продолжение лабы 4) с пользователями, ролями `user`/`admin`, сессиями, валидацией, централизованной обработкой ошибок, логированием и WebSocket-уведомлениями.

## Технологии
Node.js, Express.js, PostgreSQL, Sequelize, EJS, bcrypt, express-session, express-validator, morgan, socket.io, dotenv.

## Запуск
1. Создайте в PostgreSQL базу данных `node_courses`.
2. Скопируйте `.env.example` в `.env` и заполните: пароль PostgreSQL и `SESSION_SECRET`.
3. Установите зависимости и запустите:
```
npm install
node app.js
```
Приложение: http://localhost:3000

### Создание администратора
Зарегистрируйтесь на http://localhost:3000/register, затем в pgAdmin выполните:
```sql
UPDATE "Users" SET role = 'admin' WHERE email = 'ваш@email.com';
```
и войдите заново.

## Права доступа
| Действие | Гость | User | Admin |
|---|---|---|---|
| Просмотр курсов и преподавателей, поиск, фильтры | ✓ | ✓ | ✓ |
| Профиль, статистика | — | ✓ | ✓ |
| Добавление / редактирование / удаление курсов и преподавателей | — | — | ✓ |

Права проверяются middleware `isAuthenticated` и `isAdmin` на маршрутах, а не только скрытием кнопок.

## Структура
- `models/User.js` — пользователь (пароль хранится как bcrypt-hash, роль по умолчанию `user`)
- `controllers/authController.js`, `routes/authRoutes.js` — регистрация, вход, выход, профиль
- `middleware/auth.js` — `isAuthenticated`, `isAdmin`, `res.locals.currentUser`
- `middleware/validation.js` — правила express-validator для всех форм
- `middleware/notFound.js`, `middleware/errorHandler.js` — централизованная обработка ошибок (400, 401, 403, 404, 409, 500)
- `middleware/logger.js` — morgan (терминал + `logs/requests.log`), журнал действий администратора
- `public/js/notifications.js` — клиент Socket.IO (уведомление `courseCreated`)

## Аутентификация
| Назначение | Доступ | Адрес |
|---|---|---|
| Регистрация | все | http://localhost:3000/register |
| Вход | все | http://localhost:3000/login |
| Профиль | user, admin | http://localhost:3000/profile |

## Курсы
| Назначение | Доступ | Адрес |
|---|---|---|
| Список курсов | все | http://localhost:3000/courses |
| Поиск по названию | все | http://localhost:3000/courses?search=node |
| Фильтр по преподавателю | все | http://localhost:3000/courses?teacherId=1 |
| Фильтр по семестру | все | http://localhost:3000/courses?semester=1 |
| Комбинированный фильтр | все | http://localhost:3000/courses?search=web&teacherId=1&semester=1 |
| Просмотр курса | все | http://localhost:3000/courses/1 |
| Форма добавления курса | admin | http://localhost:3000/courses/new |
| Форма редактирования | admin | http://localhost:3000/courses/1/edit |

## Преподаватели
| Назначение | Доступ | Адрес |
|---|---|---|
| Список преподавателей | все | http://localhost:3000/teachers |
| Преподаватель и его курсы | все | http://localhost:3000/teachers/1 |
| Форма добавления | admin | http://localhost:3000/teachers/new |
| Форма редактирования | admin | http://localhost:3000/teachers/1/edit |

## Прочее
| Назначение | Доступ | Адрес |
|---|---|---|
| Статистика | user, admin | http://localhost:3000/statistics |
| Курс не найден (404) | все | http://localhost:3000/courses/999 |
| Неизвестная страница (404) | все | http://localhost:3000/abc |

## Действия форм (POST, отправляются кнопками на страницах)
| Метод | Адрес | Доступ | Назначение |
|---|---|---|---|
| POST | http://localhost:3000/register | все | Создание пользователя |
| POST | http://localhost:3000/login | все | Вход |
| POST | http://localhost:3000/logout | все | Выход |
| POST | http://localhost:3000/courses | admin | Сохранение курса |
| POST | http://localhost:3000/courses/1/edit | admin | Сохранение изменений курса |
| POST | http://localhost:3000/courses/1/delete | admin | Удаление курса |
| POST | http://localhost:3000/teachers | admin | Сохранение преподавателя |
| POST | http://localhost:3000/teachers/1/edit | admin | Сохранение изменений преподавателя |
| POST | http://localhost:3000/teachers/1/delete | admin | Удаление преподавателя |

## Проверка защиты маршрута (скрытие кнопки ≠ защита)
Войти как user, открыть F12 → Console и выполнить:
```js
fetch('/courses/1/delete', {method:'POST'}).then(r => console.log(r.status))
```
Результат: `403`, курс не удаляется.