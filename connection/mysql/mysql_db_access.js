import {
    Unauthorized,
    BadRequest,
    Forbidden,
    NotFound,
    Conflict,
    UnprocessableEntity,
    InternalServerError,
  } from "../../error/errors.js"; // my collection of custom exceptions

class MySqlDbAccess {

    constructor() {

    }

    
    runQuery(query, cb) {
    this.db.query(query, (error, rows, fields) => {
        if (error) {
            cb(error);
        } else {
            cb(null, rows);
        }
    });
    }

    //get escaped insert fields
    //TODO:: define as a tool
    getInsertFields(fields, config_fields_array) {
        var fields_obj = {};
        for (const field_name of config_fields_array) {
                if (fields.hasOwnProperty(`${field_name}`)) {
                fields_obj[`${field_name}`] = this.escape(fields[`${field_name}`]);
            }
        }
        return fields_obj;
    }

    //insert to table by fields. return inserted id at cb function
    insert(tb_name, fields, cb) {
        var keys = [];
        var values = [];
        for (const [key, value] of Object.entries(fields)) {
            keys.push(key);
            values.push(value);
        }
        const name_fields = keys.join();
        const value_fields = values.join();

        const query = `INSERT INTO ${tb_name} (${name_fields})
                            VALUES (${value_fields})`;
        var call_back = cb;
        this.db.query(query, (error, rows, fields) => {
            if (error) {
                throw new InternalServerError("MySql Error");
            }
            call_back(rows.insertId);
        });
        return true;
    }

    //get update fields
    getUpdateFields(fields, config_fields_array) {
        var fieldsArray = [];
        for (const field_name of config_fields_array) {
            if (fields.hasOwnProperty(`${field_name}`)) {
                fieldsArray.push(
                    `${field_name} = ${this.escape(fields[`${field_name}`])}`
            );
        }
    }
    return fieldsArray;
    }

    update(tb_name, fields, where_str) {
        const set_fields = fields.join();

        const query = `UPDATE ${tb_name} 
                            SET ${set_fields}
                            WHERE ${where_str}`;
        this.db.query(query, (error, rows, fields) => {
            if (error) {
                throw new InternalServerError("MySql Error");
            }
        });
        return true;
    }

    escape(value) {
        return this.db.escape(value);
    }
    
}

export default MySqlDbAccess;