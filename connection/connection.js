import MySql from "./mysql/mysql.js";
import SeqMySql from "./seq/seq_mysql.js";


class Connection {
    
    constructor(option) {
        if(option == "MySQL") {
            this.con = new MySql;
        } 
        else if(option == "SeqMySQL")
        {
            this.con = new SeqMySql;
        }
    }

}

export default Connection;