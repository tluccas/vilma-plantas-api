import { Sequelize } from "sequelize";
import config from "../config/database.js";
import User from "./models/User.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import OrderItem from "./models/OrderItem.js";
import Category from "./models/Category.js";
import Address from "./models/Address.js";
import Image from "./models/Image.js";


const models = [
    User,
    Product,
    Order,
    OrderItem,
    Category,
    Address,
    Image,
];

class DataBase{
    constructor(){
        this.connection = new Sequelize(config);
        this.init();
    }

    init(){
        models.forEach((model) => model.init(this.connection));

        models.forEach((model) => {
            if (model.associate) {
                model.associate(this.connection.models);
            }
        });
    }
}

const database = new DataBase();

const { connection: sequelize } = database;

export { database, sequelize };
export default {
    User,
    Product,
    Order,
    OrderItem,
    Category,
    Address,
    Image,
};
