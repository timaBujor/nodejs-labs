const sequelize = require('../config/database');
const Teacher = require('./Teacher');
const Course = require('./Course');
const User = require('./User');

// Связь One-to-Many: один преподаватель -> много курсов
Teacher.hasMany(Course, {
    foreignKey: 'teacherId',
    onDelete: 'RESTRICT' // база не даст удалить преподавателя с курсами
});

Course.belongsTo(Teacher, {
    foreignKey: 'teacherId'
});

module.exports = { sequelize, Teacher, Course, User };
