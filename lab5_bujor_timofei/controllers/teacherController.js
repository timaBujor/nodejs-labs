const { Teacher, Course } = require('../models');
const { httpError } = require('../middleware/errorHandler');
const { logAdminAction } = require('../middleware/logger');

function teacherData(body) {
    return {
        name: body.name,
        email: body.email,
        department: body.department,
        academicDegree: body.academicDegree
    };
}

// GET /teachers
async function index(req, res, next) {
    try {
        const teachers = await Teacher.findAll({
            include: [{ model: Course, attributes: ['id'] }],
            order: [['name', 'ASC']]
        });
        res.render('teachers/index', { title: 'Преподаватели', teachers });
    } catch (err) {
        next(err);
    }
}

// GET /teachers/new
function newForm(req, res) {
    res.render('teachers/create', { title: 'Новый преподаватель', teacher: {}, errors: [] });
}

// POST /teachers
async function create(req, res, next) {
    try {
        const teacher = await Teacher.create(teacherData(req.body));
        logAdminAction(req, 'CREATE', 'Teacher', teacher.id);
        res.redirect('/teachers');
    } catch (err) {
        next(err);
    }
}

// GET /teachers/:id — курсы получаем через связь (include)
async function show(req, res, next) {
    try {
        const teacher = await Teacher.findByPk(req.params.id, {
            include: [{ model: Course }],
            order: [[Course, 'title', 'ASC']]
        });
        if (!teacher) return next(httpError(404, 'Преподаватель не найден'));

        res.render('teachers/details', { title: teacher.name, teacher });
    } catch (err) {
        next(err);
    }
}

// GET /teachers/:id/edit
async function editForm(req, res, next) {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) return next(httpError(404, 'Преподаватель не найден'));

        res.render('teachers/edit', { title: 'Редактирование преподавателя', teacher, errors: [] });
    } catch (err) {
        next(err);
    }
}

// POST /teachers/:id/edit
async function update(req, res, next) {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) return next(httpError(404, 'Преподаватель не найден'));

        await teacher.update(teacherData(req.body));
        logAdminAction(req, 'UPDATE', 'Teacher', teacher.id);
        res.redirect(`/teachers/${teacher.id}`);
    } catch (err) {
        next(err);
    }
}

// POST /teachers/:id/delete — нельзя удалить преподавателя с курсами
async function remove(req, res, next) {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) return next(httpError(404, 'Преподаватель не найден'));

        if (await teacher.countCourses() > 0) {
            return next(httpError(409, 'Невозможно удалить преподавателя, у которого есть курсы'));
        }

        await teacher.destroy();
        logAdminAction(req, 'DELETE', 'Teacher', teacher.id);
        res.redirect('/teachers');
    } catch (err) {
        next(err);
    }
}

module.exports = { index, newForm, create, show, editForm, update, remove };
