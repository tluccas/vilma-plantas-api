import { Model, DataTypes } from 'sequelize';

export default class Order extends Model {

    static init(sequelize) {
        super.init({

            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            total_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },

            status: {
                type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered'),
                allowNull: false,
                defaultValue: 'pending',
            }
            },
            {
                sequelize,
                modelName: 'Order',
                tableName: 'orders',
                underscored: true,
            }
        );
        return this;
    }

    static associate(models){
        this.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
        });

        this.hasMany(models.OrderItem, {
            foreignKey: 'order_id',
            as: 'order_items',
        });
    }
}