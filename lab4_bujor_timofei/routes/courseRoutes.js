const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { checkId, validateCourse } = require('../middleware/validateData');

router.get('/', courseController.index);
router.get('/new', courseController.newForm);
router.post('/', validateCourse, courseController.create);
router.get('/:id', checkId, courseController.show);
router.get('/:id/edit', checkId, courseController.editForm);
router.post('/:id/edit', checkId, validateCourse, courseController.update);
router.post('/:id/delete', checkId, courseController.remove);

module.exports = router;
