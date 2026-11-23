const { Op, fn, col, literal } = require('sequelize');
const { Teacher, Course } = require('../models');

function notFound(req, res) {
    res.status(404).render('404', { title: '404', url: req.originalUrl });
}

function getTeachers() {
    return Teacher.findAll({ order: [['name', 'ASC']] });
}

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

async function newForm(req, res, next) {
    try {
        const teachers = await getTeachers();
        res.render('courses/create', { title: 'Новый курс', course: {}, teachers, errors: [] });
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        await Course.create(req.courseData);
        res.redirect('/courses');
    } catch (err) {
        if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeForeignKeyConstraintError') {
            const errors = err.errors ? err.errors.map(e => e.message) : ['Выбранный преподаватель не существует'];
            return res.status(400).render('courses/create', {
                title: 'Новый курс', course: req.courseData, teachers: await getTeachers(), errors
            });
        }
        next(err);
    }
}

async function show(req, res, next) {
    try {
        const course = await Course.findByPk(req.params.id, { include: Teacher });
        if (!course) return notFound(req, res);

        res.render('courses/details', { title: course.title, course });
    } catch (err) {
        next(err);
    }
}

async function editForm(req, res, next) {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return notFound(req, res);

        res.render('courses/edit', {
            title: 'Редактирование курса', course, teachers: await getTeachers(), errors: []
        });
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return notFound(req, res);

        await course.update(req.courseData);
        res.redirect(`/courses/${course.id}`);
    } catch (err) {
        if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeForeignKeyConstraintError') {
            const errors = err.errors ? err.errors.map(e => e.message) : ['Выбранный преподаватель не существует'];
            return res.status(400).render('courses/edit', {
                title: 'Редактирование курса',
                course: { id: req.params.id, ...req.courseData },
                teachers: await getTeachers(),
                errors
            });
        }
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return notFound(req, res);

        await course.destroy();
        res.redirect('/courses');
    } catch (err) {
        next(err);
    }
}

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
