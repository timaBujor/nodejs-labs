const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { isAdmin } = require('../middleware/auth');
const { checkId, validateTeacher } = require('../middleware/validation');

// Просмотр — всем; изменение — только admin
router.get('/', teacherController.index);
router.get('/new', isAdmin, teacherController.newForm);
router.post('/', isAdmin, validateTeacher, teacherController.create);
router.get('/:id', checkId, teacherController.show);
router.get('/:id/edit', isAdmin, checkId, teacherController.editForm);
router.post('/:id/edit', isAdmin, checkId, validateTeacher, teacherController.update);
router.post('/:id/delete', isAdmin, checkId, teacherController.remove);

module.exports = router;
