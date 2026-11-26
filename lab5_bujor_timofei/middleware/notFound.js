const { httpError } = require('./errorHandler');

// Подключается после всех маршрутов: сюда попадают неизвестные URL
function notFound(req, res, next) {
    next(httpError(404, 'Страница не найдена'));
}

module.exports = notFound;
