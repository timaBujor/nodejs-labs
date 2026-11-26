const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Имя обязательно' }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Email уже зарегистрирован' },
        validate: {
            isEmail: { msg: 'Некорректный формат email' }
        }
    },
    // Хранится только bcrypt-hash, никогда открытый пароль
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user'
    },
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true
    }
    // createdAt и updatedAt Sequelize добавляет автоматически
});

module.exports = User;
