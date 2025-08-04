'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bancos', {
      LINEA_CAP2: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      REFERENCIA: {
        type: Sequelize.STRING(17),
        allowNull: false,
        primaryKey: true,
      },
      VENCE: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      IMPORTE: {
        type: Sequelize.DECIMAL(20, 6),
        allowNull: false,
        defaultValue: 0.000000
      },
      NOMBRE: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      CALLE: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      COLONIA: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      CONG: {
        type: Sequelize.INTEGER(3,0),
        allowNull: false,
        defaultValue: 0
      },
      REGION: {
        type: Sequelize.INTEGER(2,0),
        allowNull: false,
        defaultValue: 0
      },
      MANZ: {
        type: Sequelize.INTEGER(3,0),
        allowNull: false,
        defaultValue: 0
      },
      LOTE: {
        type: Sequelize.INTEGER(3,0),
        allowNull: false,
        defaultValue: 0
      },
      NIVEL: {
        type: Sequelize.INTEGER(2,0),
        allowNull: false,
        defaultValue: 0
      },
      DEPTO: {
        type: Sequelize.INTEGER(3,0),
        allowNull: false,
        defaultValue: 0
      },
      TIPO_PRED: {
        type: Sequelize.INTEGER(1,0),
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bancos');
  }
};