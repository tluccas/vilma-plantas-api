import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

export default class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        role: {
          type: DataTypes.STRING,
          defaultValue: 'customer',
        },

        password_hash: {
          type: DataTypes.VIRTUAL,
          get() {
            return this.password;
          },
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        underscored: true,
        hooks: {
          beforeCreate: async (user) => {
            if (user.password) {
              user.password = await bcrypt.hash(user.password, 10);
            }
          },

          beforeUpdate: async (user) => {
            if (user.changed('password')) {
              user.password = await bcrypt.hash(user.password, 10);
            }
          },
        },
      },
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Pedido, { 
        foreignKey: 'user_id', 
        as: 'pedidos' 
    });

    this.hasMany(models.Endereco, {
        foreignKey: 'user_id',
        as: 'enderecos',
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}
