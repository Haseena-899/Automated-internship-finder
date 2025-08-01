const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // ✅ Ensure correct database connection import

const Student = sequelize.define('Student', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true // ✅ Ensures only valid email addresses are stored
        }
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    skills: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'students', // ✅ Ensures the table name remains `students`
    timestamps: true, // ✅ Enables `createdAt` & `updatedAt`
    underscored: true, // ✅ Maps `createdAt` → `created_at`, `updatedAt` → `updated_at`
    freezeTableName: true, // ✅ Prevents Sequelize from pluralizing table names
    charset: 'utf8mb4', // ✅ Supports special characters
    collate: 'utf8mb4_unicode_ci'
});

module.exports = Student;
