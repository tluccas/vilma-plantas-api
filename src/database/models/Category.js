import { Model, DataTypes } from 'sequelize';

export default class Category extends Model {
    static init(sequelize) {
        super.init(
            {
                nome: DataTypes.STRING,

                description: DataTypes.TEXT,
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