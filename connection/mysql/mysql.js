import mysql from "mysql2";
import DBSetup from "../../setup/db_setup.js";
import FieldExists from "../../tools/field_exists.js";
import MySqlDbAccess from "./mysql_db_access.js";

const limit = 10;
const missing_data_error = {
    num     : 152,
    message : "data is missing"
}
const db_error = {
    num     : 150,
    message : "database error"
}

const config_contact_fields = [ "first_name", "last_name", "phone" ];
const config_address_fields = [ "city", "street", "house_num", "floor", "apartment" ];

var my_sql_host = process.env.MYSQL_HOST || "localhost";
var my_sql_port = process.env.MYSQL_PORT || "3306";
var my_sql_user = process.env.MYSQL_USER || "root";
var my_sql_pass = process.env.MYSQL_PASS || "password";
var my_sql_db   = process.env.MYSQL_DB   || "rise_db";

// -------------------------------------------------------- //

class MySql extends MySqlDbAccess {

    constructor() {
        super();
        this.DBSetup = new DBSetup(
        my_sql_host,
        my_sql_port,
        my_sql_user,
        my_sql_pass,
        my_sql_db
        );
        this.db = this.connect();
    }

    connect() {
        console.log(this.DBSetup.host);
        console.log(this.DBSetup.password);
        console.log(this.DBSetup.scheme);
        console.log(this.DBSetup.port);
        console.log(this.DBSetup.user);

        const con = mysql.createConnection({
            host: this.DBSetup.host,
            port: this.DBSetup.port,
            user: this.DBSetup.user,
            password: this.DBSetup.password,
            database: this.DBSetup.scheme,
        });

        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
        });
        return con;
    }


    getAll(fields, cb) {
        const MyTool = new FieldExists(fields);
        var page = MyTool.exists("page") ? this.DB.escape(fields.page) : '0';
        page = page.match(/\d+/)[0]; // get number from string
        let offset = page * limit;
        const query = `SELECT Contact.id, first_name, last_name, phone, city, street, house_num, floor, apartment 
                        FROM tb_contact Contact
                        LEFT JOIN tb_address Address ON Contact.id = Address.contact_id
                        WHERE is_deleted = 0
                        limit ${limit} OFFSET ${offset}`;
        this.runQuery(query, function(error, data) {
            if(error) {
                cb (db_error);
            } else {
                cb(null, data);
            }
        });
    }

    add(fields, cb) {
        var main_obj = {};
        var ad_obj = {};
        main_obj = this.getInsertFields(fields, config_contact_fields);
        ad_obj = this.getInsertFields(fields.addressArr, config_address_fields);

        //validate mendatory field is being set
        const MyTool = new FieldExists(fields);
        if( !MyTool.exists("first_name") || !MyTool.exists("last_name") || !MyTool.exists("phone") ) {
                cb(missing_data_error);
                return;
        }

        const time = + new Date();
        main_obj['insert_ts'] = time;
        main_obj['last_update'] = time;

        var self = this;
        const contact_id = this.insert('tb_contact', main_obj, function (insert_id) {
            ad_obj['insert_ts'] = time;
            ad_obj['last_update'] = time;
            ad_obj['contact_id'] = insert_id;

            self.insert('tb_address', ad_obj, function (insert_id) {
                return;
            });
        });

        cb(null);
    }

    edit(fields, cb) {
        const MyTool = new FieldExists(fields);
        const time = + new Date();
        var main_updateArr = this.getUpdateFields(fields, config_contact_fields);
        var ad_updateArr = this.getUpdateFields(fields.addressArr, config_address_fields);

        //validate mendatory field is being set
        if( !MyTool.exists("contact_id") || (main_updateArr.length === 0 && ad_updateArr.length === 0) ) {
            cb (missing_data_error, []);
            return
        }

        const contact_id = this.escape(fields.contact_id);

        if(main_updateArr.length > 0) {
            main_updateArr.push(`last_update = ${time}`);
            try{
                this.update('tb_contact', main_updateArr, `id = ${contact_id}`)
            } catch (err) {

            }
        }
        if(ad_updateArr.length >0) {
            ad_updateArr.push(`last_update = ${time}`);
            try{
                this.update('tb_address', ad_updateArr, `contact_id = ${contact_id}`)
            } catch {

            }
        }
        cb(null);
    }

    delete(fields, cb) {
        const MyTool = new FieldExists(fields);
        if( !MyTool.exists("contact_id")) {
            cb (missing_data_error, []);
            return;
        }
        const contact_id = this.escape(fields.contact_id);

        const query = `UPDATE tb_contact
                SET is_deleted = 1
                WHERE id = ${contact_id}`;

        this.runQuery(query, function(error, data) {
            if(error) {
                cb (db_error);
            } else {
                cb(null);
            }
        });
    }

    //TODO:: implement search algorithm
    find(fields, cb) {
        //validate mendatory field is being set
        const MyTool = new FieldExists(fields);
        if( !MyTool.exists("search")) {
            cb (missing_data_error, []);
            return;
        }
        const search = this.escape(fields.search).split("'").join('');

        const query = `SELECT Contact.id, first_name, last_name, phone, city, street, house_num, floor, apartment 
                        FROM tb_contact Contact
                        LEFT JOIN tb_address Address ON Contact.id = Address.contact_id
                        WHERE is_deleted = 0 
                        AND ( CONCAT(Contact.first_name, ' ' , Contact.last_name) like '%${search}%'
                        OR phone like '%${search}%' )`;

        this.runQuery(query, function(error, data) {
            if(error) {
                cb (db_error);
            } else {
                cb(null, data);
            }
        });
    }

    log(tb_name, object, cb) {
        this.insert(tb_name, object, cb);
    }

    setDb(cb) {
        var self = this;
        const query = "CREATE TABLE IF NOT EXISTS `tb_contact` ( `id` int(11) unsigned NOT NULL AUTO_INCREMENT, `first_name` varchar(255) NOT NULL, `last_name` varchar(255) NOT NULL, `phone` varchar(255) NOT NULL, `is_deleted` tinyint(3) NOT NULL DEFAULT 0, `insert_ts` varchar(255) NOT NULL, `last_update` varchar(255) NOT NULL, PRIMARY KEY (`id`), KEY `is_deleted` (`is_deleted`), KEY `first_name` (`first_name`), KEY `last_name` (`last_name`), KEY `phone` (`phone`)) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8";
        this.runQuery(query, function(error, data) {
            if(error) {
                cb (db_error);
            } else {
                const query = "CREATE TABLE IF NOT EXISTS `tb_address` ( `id` int(11) unsigned NOT NULL AUTO_INCREMENT, `contact_id` int(11) NOT NULL, `city` varchar(255) NOT NULL, `street` varchar(255) NOT NULL, `house_num` varchar(255) NOT NULL, `floor` varchar(255) NOT NULL, `apartment` varchar(255) NOT NULL, `insert_ts` varchar(255) NOT NULL, `last_update` varchar(255) NOT NULL, PRIMARY KEY (`id`), KEY `contact_id` (`contact_id`)) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8";
                self.runQuery(query, function(error, data) {
                    if(error) {
                        cb (db_error);
                    } else {
                        const query = "CREATE TABLE IF NOT EXISTS `tb_api_log` ( `id` int(11) unsigned NOT NULL AUTO_INCREMENT, `request` longtext NOT NULL, `response` longtext NOT NULL, `error` varchar(255) NOT NULL, `method` varchar(255) NOT NULL, `ip` varchar(255) NOT NULL, `insert_ts` varchar(255) NOT NULL, `last_update` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8";
                        self.runQuery(query, function(error, data) {
                            if(error) {
                                cb (db_error);
                            } else {
                                cb(null);
                            }
                        });
                    }
                });
            }
        });
    }

}

console.log("db login credentials: ", my_sql_host, my_sql_user, my_sql_pass, my_sql_db);
export default MySql;
