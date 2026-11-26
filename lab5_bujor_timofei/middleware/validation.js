const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { User, Teacher, Course } = require('../models');
const { httpError } = require('./errorHandler');

const MSG_EMAIL_TAKEN = 'Email уже зарегистрирован';
const MSG_TEACHER_EMAIL_TAKEN = 'Преподаватель с таким email уже существует';

// Список уникальных сообщений об ошибках express-validator
function getErrors(req) {
    const result = validationResult(req);
    return [...new Set(result.array().map(e => e.msg))];
}

// ID в URL должен быть целым положительным числом, иначе 404
function checkId(req, res, next) {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
        return next(httpError(404, 'Запись не найдена'));
    }
    next();
}

// ===================== Регистрация =====================
const registerRules = [
    body('name').trim()
        .notEmpty().withMessage('Имя обязательно').bail()
        .isLength({ min: 2 }).withMessage('Имя должно содержать минимум два символа'),
    body('email').trim().toLowerCase()
        .notEmpty().withMessage('Email обязателен').bail()
        .isEmail().withMessage('Некорректный формат email'),
    body('password')
        .notEmpty().withMessage('Пароль обязателен').bail()
        .isLength({ min: 6 }).withMessage('Пароль должен содержать минимум шесть символов'),
    body('confirmPassword')
        .notEmpty().withMessage('Подтвердите пароль').bail()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Пароль и подтверждение не совпадают')
];

async function handleRegister(req, res, next) {
    try {
        const errors = getErrors(req);
        let status = 400;

        // Уникальность email -> 409 Conflict
        if (!errors.some(m => m.toLowerCase().includes('email'))) {
            if (await User.findOne({ where: { email: req.body.email } })) {
                errors.push(MSG_EMAIL_TAKEN);
                status = 409;
            }
        }

        if (errors.length === 0) return next();

        // Пароль обратно в форму не возвращаем
        res.status(status).render('auth/register', {
            title: 'Регистрация',
            errors,
            form: { name: req.body.name, email: req.body.email }
        });
    } catch (err) {
        next(err);
    }
}

// ===================== Вход =====================
const loginRules = [
    body('email').trim().toLowerCase()
        .notEmpty().withMessage('Email обязателен').bail()
        .isEmail().withMessage('Некорректный формат email'),
    body('password')
        .notEmpty().withMessage('Пароль обязателен')
];

function handleLogin(req, res, next) {
    const errors = getErrors(req);
    if (errors.length === 0) return next();

    res.status(400).render('auth/login', {
        title: 'Вход',
        errors,
        form: { email: req.body.email },
        registered: false
    });
}

// ===================== Преподаватель =====================
const teacherRules = [
    body('name').trim().notEmpty().withMessage('Имя преподавателя обязательно'),
    body('email').trim().toLowerCase()
        .notEmpty().withMessage('Email обязателен').bail()
        .isEmail().withMessage('Некорректный формат email'),
    body('department').trim().notEmpty().withMessage('Кафедра обязательна'),
    body('academicDegree').trim().notEmpty().withMessage('Учёная степень обязательна')
];

async function handleTeacher(req, res, next) {
    try {
        const id = req.params.id ? Number(req.params.id) : null;

        // При редактировании преподаватель должен существовать
        if (id && !(await Teacher.findByPk(id))) {
            return next(httpError(404, 'Преподаватель не найден'));
        }

        const errors = getErrors(req);
        let status = 400;

        // Email не должен принадлежать другому преподавателю -> 409
        if (!errors.some(m => m.toLowerCase().includes('email'))) {
            const where = { email: req.body.email };
            if (id) where.id = { [Op.ne]: id };
            if (await Teacher.findOne({ where })) {
                errors.push(MSG_TEACHER_EMAIL_TAKEN);
                status = 409;
            }
        }

        if (errors.length === 0) return next();

        res.status(status).render(id ? 'teachers/edit' : 'teachers/create', {
            title: id ? 'Редактирование преподавателя' : 'Новый преподаватель',
            teacher: {
                id,
                name: req.body.name,
                email: req.body.email,
                department: req.body.department,
                academicDegree: req.body.academicDegree
            },
            errors
        });
    } catch (err) {
        next(err);
    }
}

// ===================== Курс =====================
const courseRules = [
    body('title').trim().notEmpty().withMessage('Название дисциплины обязательно'),
    body('credits').trim()
        .isInt({ min: 1 }).withMessage('Количество кредитов должно быть положительным целым числом'),
    body('semester').trim()
        .isInt({ min: 1, max: 8 }).withMessage('Семестр должен находиться в диапазоне от 1 до 8'),
    body('description').trim().notEmpty().withMessage('Описание дисциплины обязательно'),
    body('teacherId').trim()
        .notEmpty().withMessage('Выберите преподавателя').bail()
        .isInt({ min: 1 }).withMessage('Выбранный преподаватель не существует')
];

async function handleCourse(req, res, next) {
    try {
        const id = req.params.id ? Number(req.params.id) : null;

        // При редактировании курс должен существовать
        if (id && !(await Course.findByPk(id))) {
            return next(httpError(404, 'Курс не найден'));
        }

        const errors = getErrors(req);

        // Выбранный преподаватель должен существовать в базе
        if (/^\d+$/.test(req.body.teacherId) && !(await Teacher.findByPk(req.body.teacherId))) {
            errors.push('Выбранный преподаватель не существует');
        }

        if (errors.length === 0) return next();

        const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });
        res.status(400).render(id ? 'courses/edit' : 'courses/create', {
            title: id ? 'Редактирование курса' : 'Новый курс',
            course: {
                id,
                title: req.body.title,
                credits: req.body.credits,
                semester: req.body.semester,
                description: req.body.description,
                teacherId: req.body.teacherId
            },
            teachers,
            errors
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    checkId,
    validateRegister: [...registerRules, handleRegister],
    validateLogin: [...loginRules, handleLogin],
    validateTeacher: [...teacherRules, handleTeacher],
    validateCourse: [...courseRules, handleCourse]
};
