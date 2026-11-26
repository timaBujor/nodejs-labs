const bcrypt = require('bcrypt');
const { User } = require('../models');
const { httpError } = require('../middleware/errorHandler');

// GET /register
function registerForm(req, res) {
    if (req.session.user) return res.redirect('/profile');
    res.render('auth/register', { title: 'Регистрация', errors: [], form: {} });
}

// POST /register
async function register(req, res, next) {
    try {
        const rounds = Number(process.env.BCRYPT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(req.body.password, rounds);

        // Роль всегда 'user' — даже если кто-то добавит role=admin в запрос
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: 'user'
        });

        res.redirect('/login?registered=1');
    } catch (err) {
        next(err);
    }
}

// GET /login
function loginForm(req, res) {
    if (req.session.user) return res.redirect('/profile');
    res.render('auth/login', {
        title: 'Вход',
        errors: [],
        form: {},
        registered: req.query.registered === '1'
    });
}

// POST /login
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        // Общее сообщение: не раскрываем, существует ли email
        const valid = user && await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).render('auth/login', {
                title: 'Вход',
                errors: ['Неверный email или пароль'],
                form: { email },
                registered: false
            });
        }

        user.lastLogin = new Date();
        await user.save();

        // Новая сессия (защита от подмены сессии), пароль в сессию не кладём
        req.session.regenerate((err) => {
            if (err) return next(err);
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            };
            req.session.save((err2) => {
                if (err2) return next(err2);
                res.redirect('/profile');
            });
        });
    } catch (err) {
        next(err);
    }
}

// POST /logout
function logout(req, res, next) {
    req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
}

// GET /profile
async function profile(req, res, next) {
    try {
        const user = await User.findByPk(req.session.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) return next(httpError(404, 'Пользователь не найден'));

        res.render('profile', { title: 'Профиль', user, session: req.session });
    } catch (err) {
        next(err);
    }
}

module.exports = { registerForm, register, loginForm, login, logout, profile };
