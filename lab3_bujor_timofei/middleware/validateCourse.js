const Course = require('../models/courseModel');

function validateCourse(req, res, next) {
    const title = (req.body.title || '').trim();
    const teacher = (req.body.teacher || '').trim();
    const description = (req.body.description || '').trim();
    const creditsRaw = (req.body.credits || '').trim();
    const semesterRaw = (req.body.semester || '').trim();

    const credits = Number(creditsRaw);
    const semester = Number(semesterRaw);

    const errors = [];

    if (!title) errors.push('Название дисциплины обязательно');
    if (!teacher) errors.push('Имя преподавателя обязательно');
    if (creditsRaw === '' || isNaN(credits) || credits <= 0) {
        errors.push('Количество кредитов должно быть положительным числом');
    }
    if (semesterRaw === '' || !Number.isInteger(semester) || semester < 1 || semester > 8) {
        errors.push('Семестр должен быть целым числом в диапазоне от 1 до 8');
    }
    if (!description) errors.push('Описание дисциплины обязательно');

    const formData = {
        title,
        teacher,
        credits: creditsRaw,
        semester: semesterRaw,
        description
    };

    if (errors.length > 0) {
        if (req.params.id) {
            const existing = Course.getById(req.params.id);
            if (!existing) {
                return res.status(404).render('404', { title: '404', url: req.originalUrl });
            }
            return res.status(400).render('courses/edit', {
                title: 'Редактирование курса',
                course: { id: existing.id, ...formData },
                errors
            });
        }
        return res.status(400).render('courses/create', {
            title: 'Новый курс',
            course: formData,
            errors
        });
    }

    req.courseData = { title, teacher, credits, semester, description };
    next();
}

module.exports = validateCourse;
