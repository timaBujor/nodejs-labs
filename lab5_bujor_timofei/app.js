require('dotenv').config(); // загрузка переменных из .env

const http = require('http');
const express = require('express');
const session = require('express-session');
const { Server } = require('socket.io');

const { sequelize } = require('./models');
const seedIfEmpty = require('./models/seed');
const { requestLogger, formatDate } = require('./middleware/logger');
const { setCurrentUser, isAuthenticated } = require('./middleware/auth');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const { statistics } = require('./controllers/courseController');

const app = express();
const PORT = process.env.PORT || 3000;

// Данные студента и форматирование дат — доступны во всех шаблонах
app.locals.student = { name: 'Bujor Timofei', group: 'IAFR2302' };
app.locals.formatDate = formatDate;

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(requestLogger);                           // morgan: терминал + logs/requests.log
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => { req.body = req.body || {}; next(); }); // Express 5: body может быть undefined
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,                                // не пересохранять без изменений
    saveUninitialized: false,                     // не создавать сессию для гостей
    cookie: {
        maxAge: 1000 * 60 * 60,                   // 1 час
        httpOnly: true                            // cookie недоступна из JavaScript
    }
}));
app.use(setCurrentUser);                          // res.locals.currentUser

// Маршруты
app.get('/', (req, res) => res.redirect('/courses'));
app.use('/', authRoutes);
app.use('/courses', courseRoutes);
app.use('/teachers', teacherRoutes);
app.get('/statistics', isAuthenticated, statistics);

// Обработка ошибок
app.use(notFound);      // 404 — после всех маршрутов
app.use(errorHandler);  // центральный обработчик — последним

// HTTP-сервер + Socket.IO
const server = http.createServer(app);
const io = new Server(server);
app.set('io', io); // доступ в контроллерах: req.app.get('io')

io.on('connection', (socket) => {
    console.log(`WebSocket client connected: ${socket.id}`);
});

// Запуск: проверка .env -> подключение к БД -> таблицы -> сервер
async function start() {
    if (!process.env.SESSION_SECRET) {
        console.error('В файле .env не указан SESSION_SECRET');
        process.exitCode = 1;
        return;
    }
    try {
        await sequelize.authenticate();
        console.log('Database connection established');

        await sequelize.sync(); // создаёт недостающие таблицы (в т.ч. Users), данные не удаляет
        await seedIfEmpty();

        server.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Не удалось подключиться к базе данных PostgreSQL.');
        console.error('Проверьте, что PostgreSQL запущен, база node_courses создана,');
        console.error('а параметры в файле .env указаны верно.');
        console.error('Причина:', err.message);
        process.exitCode = 1;
    }
}

start();
