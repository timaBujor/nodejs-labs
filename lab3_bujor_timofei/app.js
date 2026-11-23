const express = require('express');
const logger = require('./middleware/logger');
const courseRoutes = require('./routes/courseRoutes');

const app = express();
const PORT = 3000;

app.locals.student = {
    name: 'Bujor Timofei',
    group: 'IAFR2302'
};

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public'));               
app.use(logger);                                 

app.get('/', (req, res) => res.redirect('/courses'));
app.use('/courses', courseRoutes);

app.use((req, res) => {
    res.status(404).render('404', { title: '404', url: req.originalUrl });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Ошибка',
        message: 'Произошла внутренняя ошибка сервера. Попробуйте позже.'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
