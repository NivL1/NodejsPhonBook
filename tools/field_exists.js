

class FieldExist { 

    constructor (fields) {
        this.fields = fields;
    }

    exists(field) {
        if(this.fields.hasOwnProperty(`${field}`) && this.fields[`${field}`]) {
            return true;
        }
        return false;
    }
}

export default FieldExist;