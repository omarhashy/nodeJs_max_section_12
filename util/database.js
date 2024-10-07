const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'omar', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
