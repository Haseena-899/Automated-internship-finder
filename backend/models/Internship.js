const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Internship = sequelize.define('Internship', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    skills_required: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdAt: {  
        type: DataTypes.DATE,
        field: 'createdAt'
    },
    updatedAt: {  
        type: DataTypes.DATE,
        field: 'updatedAt'
    }
}, {
    timestamps: true,
    freezeTableName: true
});

module.exports = Internship;
