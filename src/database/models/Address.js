import { Model, DataTypes } from "sequelize";

export default class Address extends Model {
    static init(sequelize) {
        super.init({ 
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                street: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                city: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                state: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                zip_code: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                country: { //Apenas BRASIL por enquanto
                    type: DataTypes.STRING,
                    allowNull: false,
                    defaultValue: "BR",
                },
            },
            {
                sequelize,
                modelName: "Address",
                tableName: "addresses",
                underscored: true,
                timestamps: true,
            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
        });
    }
}