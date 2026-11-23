const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { checkId, validateTeacher } = require('../middleware/validateData');

router.get('/', teacherController.index);
router.get('/new', teacherController.newForm);
router.post('/', validateTeacher, teacherController.create);
router.get('/:id', checkId, teacherController.show);
router.get('/:id/edit', checkId, teacherController.editForm);
router.post('/:id/edit', checkId, validateTeacher, teacherController.update);
router.post('/:id/delete', checkId, teacherController.remove);

module.exports = router;
