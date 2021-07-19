import Contact from "../../models/contacts.js";
import Address from "../../models/address.js";

class SeqMySql {
    
    constructor() {

    }

    //TODO:: implementation
    getAll(fields, cb){

    }

    //TODO:: implementation
    add(fields, cb) {
        //muck data
        const contactFields = {first_name: "MUCK", last_name: "MUCK", phone:"22@222222"};
        Contact.create(contactFields)
            .then( customer => {
                const addressFields = {city: "MUCK", street:"MUCK", apartment: 2};
                Address.create(addressFields)
            }).then( address => {
                console.log(address);
            });    
        cb(null);
    }

    //TODO:: implementation
    edit(fields, cb) {
        cb(null);
    }

    //TODO:: implementation
    delete(fields, cb) {
        cb(null);
    }

    //TODO:: implementation
    find(fields, cb) {
        cb(null, []);
    }

    //TODO:: implementation
    log(tb_name, object, cb) {
        cb(null);
    }

    //TODO:: implementation
    setDb(cb) {
        cb(null);
    }
}

export default SeqMySql;