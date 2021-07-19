import Sequelize from "sequelize";
import sequelize from "../connection/seq/sequelize.js";


const Address = sequelize.define("Address", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        city: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        street: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        house_num: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        floor: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        apartment: {
            type: Sequelize.STRING,
            allowNull: true,
        },
});

export default Address;