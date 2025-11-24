import { Model, DataTypes } from 'sequelize';

export default class Category extends Model {
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
            },

            {
                sequelize,
                modelName: "Category",
                tableName: "categories",
                underscored: true,
            }
        );
        return this;  
    }

    static associate(models) {
        this.hasMany(models.Product, {
            foreignKey: 'category_id',
            as: 'products',
        });
    }
}