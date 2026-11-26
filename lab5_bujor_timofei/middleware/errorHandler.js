// Ошибка с HTTP-кодом: next(httpError(404, 'Курс не найден'))
class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

function httpError(status, message) {
    return new HttpError(status, message);
}

const DEFAULT_MESSAGES = {
    400: 'Некорректные данные',
    401: 'Необходимо выполнить вход',
    403: 'Недостаточно прав для выполнения действия',
    404: 'Страница или запись не найдена',
    409: 'Конфликт данных',
    500: 'Внутренняя ошибка сервера. Попробуйте позже.'
};

const TITLES = {
    400: 'Некорректные данные',
    401: 'Требуется вход',
    403: 'Доступ запрещён',
    404: 'Не найдено',
    409: 'Конфликт',
    500: 'Ошибка сервера'
};

// Централизованный обработчик ошибок — подключается последним
function errorHandler(err, req, res, next) {
    let status = err.status || 500;
    let message = err.message;

    // Ошибки Sequelize -> понятные коды без технических деталей
    if (err.name === 'SequelizeUniqueConstraintError') {
        status = 409;
        message = err.errors && err.errors[0] ? err.errors[0].message : DEFAULT_MESSAGES[409];
    } else if (err.name === 'SequelizeValidationError') {
        status = 400;
        message = err.errors.map(e => e.message).join('; ');
    } else if (err.name === 'SequelizeForeignKeyConstraintError') {
        status = 409;
        message = 'Операция нарушает связь между записями';
    }

    // Для 500 пользователю — только общее сообщение, подробности — в терминал
    if (status >= 500) {
        console.error('SERVER ERROR:', err);
        message = DEFAULT_MESSAGES[500];
    }
    if (!message) message = DEFAULT_MESSAGES[status] || DEFAULT_MESSAGES[500];

    if (res.headersSent) return next(err);

    res.status(status);

    if (status === 404) {
        return res.render('404', { title: '404', url: req.originalUrl, message });
    }
    if (status === 403) {
        return res.render('403', { title: '403', message });
    }
    res.render('error', { title: TITLES[status] || 'Ошибка', status, message });
}

module.exports = errorHandler;
module.exports.httpError = httpError;
module.exports.HttpError = HttpError;
