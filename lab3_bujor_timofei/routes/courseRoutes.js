const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const validateCourse = require('../middleware/validateCourse');

// ВАЖНО: /new стоит выше /:id, иначе "new" примется за id
router.get('/', courseController.index);
router.get('/new', courseController.newForm);
router.post('/', validateCourse, courseController.create);
router.get('/:id', courseController.show);
router.get('/:id/edit', courseController.editForm);
router.post('/:id/edit', validateCourse, courseController.update);
router.post('/:id/delete', courseController.remove);

module.exports = router;
