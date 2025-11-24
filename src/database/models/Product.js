import { Model, DataTypes } from 'sequelize';

export default class Product extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },

                description: {
                    type: DataTypes.TEXT,
                },

                price: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false,
                },

                stock: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                category_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
            },

            {
                sequelize,
                modelName: "Product",
                tableName: "products",
                underscored: true,
            }
        );
        return this;  
    }

    static associate(models) {
        this.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'category',
        });
    }
}