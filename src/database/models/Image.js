import { Model, DataTypes } from 'sequelize';

export default class Image extends Model {
  static init(sequelize) {
    super.init(
      {
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        url: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Image',
        tableName: 'images',
        underscored: true,
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
  }
}
