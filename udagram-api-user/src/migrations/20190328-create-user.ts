'use strict';
module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.createTable('User', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      passwordHash: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface: any, _Sequelize: any) => {
    return queryInterface.dropTable('User');
  },
};
