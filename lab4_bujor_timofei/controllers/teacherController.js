const { Teacher, Course } = require('../models');

function notFound(req, res) {
    res.status(404).render('404', { title: '404', url: req.originalUrl });
}

function sequelizeMessages(err) {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        return err.errors.map(e => e.message);
    }
    return null;
}

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

function newForm(req, res) {
    res.render('teachers/create', { title: 'Новый преподаватель', teacher: {}, errors: [] });
}

async function create(req, res, next) {
    try {
        await Teacher.create(req.teacherData);
        res.redirect('/teachers');
    } catch (err) {
        const messages = sequelizeMessages(err);
        if (messages) {
            return res.status(400).render('teachers/create', {
                title: 'Новый преподаватель', teacher: req.teacherData, errors: messages
            });
        }
        next(err);
    }
}

async function show(req, res, next) {
    try {
        const teacher = await Teacher.findByPk(req.params.id, {
            include: [{ model: Course }],
            order: [[Course, 'title', 'ASC']]
        });
        if (!teacher) return notFound(req, res);

        res.render('teachers/details', { title: teacher.name, teacher, error: null });
    } catch (err) {
        next(err);
    }
}

async function editForm(req, res, next) {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) return notFound(req, res);

        res.render('teachers/edit', { title: 'Редактирование преподавателя', teacher, errors: [] });
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) return notFound(req, res);

        await teacher.update(req.teacherData);
        res.redirect(`/teachers/${teacher.id}`);
    } catch (err) {
        const messages = sequelizeMessages(err);
        if (messages) {
            return res.status(400).render('teachers/edit', {
                title: 'Редактирование преподавателя',
                teacher: { id: req.params.id, ...req.teacherData },
                errors: messages
            });
        }
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const teacher = await Teacher.findByPk(req.params.id, { include: [{ model: Course }] });
        if (!teacher) return notFound(req, res);

        const coursesCount = await teacher.countCourses();
        if (coursesCount > 0) {
            return res.status(400).render('teachers/details', {
                title: teacher.name,
                teacher,
                error: 'Невозможно удалить преподавателя, у которого есть курсы'
            });
        }

        await teacher.destroy();
        res.redirect('/teachers');
    } catch (err) {
        next(err);
    }
}

module.exports = { index, newForm, create, show, editForm, update, remove };
