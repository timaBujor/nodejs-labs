const { Op, fn, col, literal } = require('sequelize');
const { Teacher, Course } = require('../models');
const { httpError } = require('../middleware/errorHandler');
const { logAdminAction, formatDate } = require('../middleware/logger');

function getTeachers() {
    return Teacher.findAll({ order: [['name', 'ASC']] });
}

function courseData(body) {
    return {
        title: body.title,
        credits: Number(body.credits),
        semester: Number(body.semester),
        description: body.description,
        teacherId: Number(body.teacherId)
    };
}

// GET /courses  (?search=...&teacherId=...&semester=...) — фильтрация в SQL через where
async function index(req, res, next) {
    try {
        const search = (req.query.search || '').trim();
        const teacherId = req.query.teacherId || '';
        const semester = req.query.semester || '';

        const where = {};
        if (search) where.title = { [Op.iLike]: `%${search}%` };
        if (/^\d+$/.test(teacherId)) where.teacherId = Number(teacherId);
        if (/^\d+$/.test(semester)) where.semester = Number(semester);

        const courses = await Course.findAll({
            where,
            include: Teacher,
            order: [['title', 'ASC']]
        });
        const teachers = await getTeachers();

        res.render('courses/index', {
            title: 'Список курсов',
            courses, teachers, search, teacherId, semester
        });
    } catch (err) {
        next(err);
    }
}

// GET /courses/new
async function newForm(req, res, next) {
    try {
        res.render('courses/create', {
            title: 'Новый курс', course: {}, teachers: await getTeachers(), errors: []
        });
    } catch (err) {
        next(err);
    }
}

// POST /courses
async function create(req, res, next) {
    try {
        const course = await Course.create(courseData(req.body));
        logAdminAction(req, 'CREATE', 'Course', course.id);

        // WebSocket: уведомление всем открытым клиентам
        const teacher = await Teacher.findByPk(course.teacherId);
        req.app.get('io').emit('courseCreated', {
            id: course.id,
            title: course.title,
            teacher: teacher ? teacher.name : '—',
            createdAt: formatDate(course.createdAt)
        });

        res.redirect('/courses');
    } catch (err) {
        next(err);
    }
}

// GET /courses/:id
async function show(req, res, next) {
    try {
        const course = await Course.findByPk(req.params.id, { include: Teacher });
        if (!course) return next(httpError(404, 'Курс не найден'));

        res.render('courses/details', { title: course.title, course });
    } catch (err) {
        next(err);
    }
}

// GET /courses/:id/edit
async function editForm(req, res, next) {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return next(httpError(404, 'Курс не найден'));

        res.render('courses/edit', {
            title: 'Редактирование курса', course, teachers: await getTeachers(), errors: []
        });
    } catch (err) {
        next(err);
    }
}

// POST /courses/:id/edit
async function update(req, res, next) {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return next(httpError(404, 'Курс не найден'));

        await course.update(courseData(req.body));
        logAdminAction(req, 'UPDATE', 'Course', course.id);
        res.redirect(`/courses/${course.id}`);
    } catch (err) {
        next(err);
    }
}

// POST /courses/:id/delete
async function remove(req, res, next) {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return next(httpError(404, 'Курс не найден'));

        await course.destroy();
        logAdminAction(req, 'DELETE', 'Course', course.id);
        res.redirect('/courses');
    } catch (err) {
        next(err);
    }
}

// GET /statistics — все подсчёты выполняет база данных
async function statistics(req, res, next) {
    try {
        const teachersCount = await Teacher.count();
        const coursesCount = await Course.count();

        const bySemester = await Course.findAll({
            attributes: ['semester', [fn('COUNT', col('id')), 'count']],
            group: ['semester'],
            order: [['semester', 'ASC']],
            raw: true
        });

        const byTeacher = await Teacher.findAll({
            attributes: ['id', 'name', [fn('COUNT', col('Courses.id')), 'coursesCount']],
            include: [{ model: Course, attributes: [] }],
            group: ['Teacher.id'],
            order: [[literal('"coursesCount"'), 'DESC'], ['name', 'ASC']],
            raw: true
        });

        const topTeacher = byTeacher.length > 0 && Number(byTeacher[0].coursesCount) > 0
            ? byTeacher[0]
            : null;

        res.render('statistics', {
            title: 'Статистика',
            teachersCount, coursesCount, bySemester, byTeacher, topTeacher
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { index, newForm, create, show, editForm, update, remove, statistics };
