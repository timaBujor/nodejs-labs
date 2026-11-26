const { httpError } = require('./errorHandler');

// Делает данные пользователя доступными во всех EJS-шаблонах
function setCurrentUser(req, res, next) {
    res.locals.currentUser = req.session.user || null;
    next();
}

// Аутентификация: пользователь вошёл в систему?
function isAuthenticated(req, res, next) {
    if (req.session.user) return next();

    // Страницы (GET) -> на форму входа, действия (POST и др.) -> 401
    if (req.method === 'GET') return res.redirect('/login');
    next(httpError(401, 'Необходимо выполнить вход'));
}

// Авторизация: пользователь вошёл И является администратором?
function isAdmin(req, res, next) {
    if (!req.session.user) {
        return isAuthenticated(req, res, next);
    }
    if (req.session.user.role !== 'admin') {
        return next(httpError(403, 'Это действие доступно только администратору'));
    }
    next();
}

module.exports = { setCurrentUser, isAuthenticated, isAdmin };
