const { Sequelize } = require('sequelize');  
require('dotenv').config();

// Create Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    }
);

// Test database connection
sequelize.authenticate()
    .then(() => console.log('✅ Database connected successfully!'))
    .catch(err => console.error('❌ Database connection error:', err));

module.exports = sequelize;
