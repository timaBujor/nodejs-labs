require('dotenv').config(); 
const express = require('express');
const { sequelize } = require('./models');
const seedIfEmpty = require('./models/seed');
const logger = require('./middleware/logger');
const courseRoutes = require('./routes/courseRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const { statistics } = require('./controllers/courseController');

const app = express();
const PORT = process.env.PORT || 3000;

app.locals.student = {
    name: 'Bujor Timofei',
    group: 'IAFR2302'
};


app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(logger);

app.get('/', (req, res) => res.redirect('/courses'));
app.use('/courses', courseRoutes);
app.use('/teachers', teacherRoutes);
app.get('/statistics', statistics);

app.use((req, res) => {
    res.status(404).render('404', { title: '404', url: req.originalUrl });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('error', {
        title: 'Ошибка',
        message: 'Произошла внутренняя ошибка сервера. Попробуйте позже.'
    });
});

async function start() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established');

        await sequelize.sync(); 
        await seedIfEmpty();

        app.listen(PORT, () => {
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
