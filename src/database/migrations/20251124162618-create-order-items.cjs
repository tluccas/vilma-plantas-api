'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('order_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',},
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',},
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface) {
    return queryInterface.dropTable('order_items');
  }
};
