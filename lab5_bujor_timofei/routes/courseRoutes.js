const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { isAdmin } = require('../middleware/auth');
const { checkId, validateCourse } = require('../middleware/validation');

// Просмотр — всем; изменение — только admin (isAdmin стоит ДО валидации)
// ВАЖНО: /new стоит выше /:id, иначе "new" примется за id
router.get('/', courseController.index);
router.get('/new', isAdmin, courseController.newForm);
router.post('/', isAdmin, validateCourse, courseController.create);
router.get('/:id', checkId, courseController.show);
router.get('/:id/edit', isAdmin, checkId, courseController.editForm);
router.post('/:id/edit', isAdmin, checkId, validateCourse, courseController.update);
router.post('/:id/delete', isAdmin, checkId, courseController.remove);

module.exports = router;
