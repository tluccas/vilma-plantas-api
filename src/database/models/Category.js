import { Model, DataTypes } from 'sequelize';

export default class Category extends Model {
    static init(sequelize) {
        super.init(
            {
                nome: DataTypes.STRING,

                descricao: DataTypes.TEXT,
            },

            {
                sequelize,
                modelName: "Categoria",
                tableName: "categorias",
                underscored: true,
            }
        );
        return this;  
    }

    static associate(models) {
        this.hasMany(models.Produto, {
            foreignKey: 'categoria_id',
            as: 'produtos',
        });
    }
}