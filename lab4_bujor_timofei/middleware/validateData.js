const { Op } = require('sequelize');
const { Teacher, Course } = require('../models');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function checkId(req, res, next) {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
        return res.status(404).render('404', { title: '404', url: req.originalUrl });
    }
    next();
}

async function validateTeacher(req, res, next) {
    try {
        const data = {
            name: (req.body.name || '').trim(),
            email: (req.body.email || '').trim().toLowerCase(),
            department: (req.body.department || '').trim(),
            academicDegree: (req.body.academicDegree || '').trim()
        };
        const id = req.params.id ? Number(req.params.id) : null;
        const errors = [];

        if (!data.name) errors.push('Имя преподавателя обязательно');
        if (!data.email) errors.push('Email обязателен');
        else if (!EMAIL_REGEX.test(data.email)) errors.push('Некорректный формат email');
        if (!data.department) errors.push('Кафедра обязательна');
        if (!data.academicDegree) errors.push('Учёная степень обязательна');

        if (id && !(await Teacher.findByPk(id))) {
            return res.status(404).render('404', { title: '404', url: req.originalUrl });
        }

        if (data.email && EMAIL_REGEX.test(data.email)) {
            const where = { email: data.email };
            if (id) where.id = { [Op.ne]: id };
            if (await Teacher.findOne({ where })) {
                errors.push('Преподаватель с таким email уже существует');
            }
        }

        if (errors.length > 0) {
            const view = id ? 'teachers/edit' : 'teachers/create';
            return res.status(400).render(view, {
                title: id ? 'Редактирование преподавателя' : 'Новый преподаватель',
                teacher: { id, ...data },
                errors
            });
        }

        req.teacherData = data;
        next();
    } catch (err) {
        next(err);
    }
}

async function validateCourse(req, res, next) {
    try {
        const raw = {
            title: (req.body.title || '').trim(),
            credits: (req.body.credits || '').trim(),
            semester: (req.body.semester || '').trim(),
            description: (req.body.description || '').trim(),
            teacherId: (req.body.teacherId || '').trim()
        };
        const id = req.params.id ? Number(req.params.id) : null;
        const errors = [];

        const credits = Number(raw.credits);
        const semester = Number(raw.semester);
        const teacherId = Number(raw.teacherId);

        if (!raw.title) errors.push('Название дисциплины обязательно');
        if (raw.credits === '' || !Number.isInteger(credits) || credits <= 0) {
            errors.push('Количество кредитов должно быть положительным целым числом');
        }
        if (raw.semester === '' || !Number.isInteger(semester) || semester < 1 || semester > 8) {
            errors.push('Семестр должен находиться в диапазоне от 1 до 8');
        }
        if (!raw.description) errors.push('Описание дисциплины обязательно');

        if (id && !(await Course.findByPk(id))) {
            return res.status(404).render('404', { title: '404', url: req.originalUrl });
        }

        if (!raw.teacherId) {
            errors.push('Выберите преподавателя');
        } else if (!Number.isInteger(teacherId) || !(await Teacher.findByPk(teacherId))) {
            errors.push('Выбранный преподаватель не существует');
        }

        if (errors.length > 0) {
            const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });
            const view = id ? 'courses/edit' : 'courses/create';
            return res.status(400).render(view, {
                title: id ? 'Редактирование курса' : 'Новый курс',
                course: { id, ...raw },
                teachers,
                errors
            });
        }

        req.courseData = { title: raw.title, credits, semester, description: raw.description, teacherId };
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = { checkId, validateTeacher, validateCourse };
