const Course = require('../models/courseModel');

function notFound(req, res) {
    res.status(404).render('404', { title: '404', url: req.originalUrl });
}

function index(req, res) {
    const search = (req.query.search || '').trim();
    const semester = req.query.semester || '';

    const courses = Course.getAll(search, semester);

    res.render('courses/index', {
        title: 'Список курсов',
        courses,
        search,
        semester
    });
}

function newForm(req, res) {
    res.render('courses/create', {
        title: 'Новый курс',
        course: {},
        errors: []
    });
}

function create(req, res) {
    Course.create(req.courseData);
    res.redirect('/courses');
}

function show(req, res) {
    const course = Course.getById(req.params.id);
    if (!course) return notFound(req, res);

    res.render('courses/details', { title: course.title, course });
}

function editForm(req, res) {
    const course = Course.getById(req.params.id);
    if (!course) return notFound(req, res);

    res.render('courses/edit', {
        title: 'Редактирование курса',
        course,
        errors: []
    });
}

function update(req, res) {
    const course = Course.update(req.params.id, req.courseData);
    if (!course) return notFound(req, res);

    res.redirect(`/courses/${course.id}`);
}

function remove(req, res) {
    const deleted = Course.remove(req.params.id);
    if (!deleted) return notFound(req, res);

    res.redirect('/courses');
}

module.exports = { index, newForm, create, show, editForm, update, remove };
