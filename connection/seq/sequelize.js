import Sequelize from "sequelize";

var my_sql_host = process.env.MYSQL_HOST || "localhost";
var my_sql_port = process.env.MYSQL_PORT || "3306";
var my_sql_user = process.env.MYSQL_USER || "root";
var my_sql_pass = process.env.MYSQL_PASS || "password";
var my_sql_db   = process.env.MYSQL_DB   || "rise_db";

const sequalize = new Sequelize(my_sql_db, my_sql_user, my_sql_pass, {
    dialect: "mysql",
    host: my_sql_host,
    port: my_sql_port
});

export default sequalize;
