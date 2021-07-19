import Sequelize from "sequelize";
import sequelize from "../connection/seq/sequelize.js";


const Contact = sequelize.define("Contact", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false,
        },
});

export default Contact;