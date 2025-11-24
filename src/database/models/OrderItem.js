import { Model, DataTypes } from "sequelize";

export default class OrderItem extends Model {
    static init(sequelize) {
        super.init(
            {
                order_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                product_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                price: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false,
                },
            },

            {
                sequelize,
                modelName: "OrderItem",
                tableName: "order_items",
                underscored: true,
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Order, {
            foreignKey: "order_id",
            as: "order",
        });

        this.belongsTo(models.Product, {
            foreignKey: "product_id",
            as: "product",
        });
    }
}