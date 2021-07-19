import FieldExists from "../tools/field_exists.js";


class ContactsManager {

    constructor(DB) {
        this.DBHandler = DB.con;
    }

    getAll(fields, cb) {
        this.DBHandler.getAll(fields, cb);
    }

    add(fields, cb) {
        this.DBHandler.add(fields, cb);
    }

    edit(fields, cb) {
        this.DBHandler.edit(fields,cb);
    }

    delete(fields, cb) {
        this.DBHandler.delete(fields, cb);
    }

    find(fields, cb) {
        this.DBHandler.find(fields, cb);
    }

    setDb(cb) {
        this.DBHandler.setDb(cb);
    }
}

export default ContactsManager;