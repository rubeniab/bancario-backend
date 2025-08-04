'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class banco extends Model {
    static associate(models) {
      // define association here
    }
  }
  banco.init({
    LINEA_CAP2: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    REFERENCIA: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    }, 
    VENCE: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }, 
    IMPORTE: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }, 
    NOMBRE: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    CALLE: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    COLONIA: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    CONG: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
    REGION: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
    MANZ: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
    LOTE: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
    NIVEL: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
    DEPTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }, 
    TIPO_PRED: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, 

  }, {
    sequelize,
    modelName: 'banco',
  });
  return banco;
};