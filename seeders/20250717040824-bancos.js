'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('bancos', [
      {
        LINEA_CAP2: '0010000000100000243084287               ',
        REFERENCIA: '00100000001000002',
        VENCE: '2025-07-31',
        IMPORTE: 9729.920000,
        NOMBRE: 'ESCOTO LARA BERTHA                      ',
        CALLE: '3 CARABELAS ESQ V CARRANZA              ',
        COLONIA: '                                        ',
        CONG: 1,
        REGION: 0,
        MANZ: 0,
        LOTE: 1,
        NIVEL: 0,
        DEPTO: 0,
        TIPO_PRED: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    // para eliminar los datos insertados si haces rollback
    await queryInterface.bulkDelete('bancos', null, {})
  }
};
