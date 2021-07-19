import express from 'express';
const router = express.Router();
import serialize from 'serialize-javascript';
import ContactsManager from '../manager/contacts_manager.js';
import Connection from '../connection/connection.js';

const ContactManger = new ContactsManager(new Connection("MySQL"));

//setDb
router.get('/setDb', (req, res) => {
    const data = ContactManger.setDb(function(err){
        const response = getResponse(res, err);
        insetApiLog(req, response, err, "contacts/setDb");
        res.send(response);
    });
});

//getAll contacts with pagination
router.get('/getAll', (req, res) => {
    const data = ContactManger.getAll(req.body, function(err, results){
        const response = getResponse(res, results, err);
        insetApiLog(req, response, err, "contacts/getAll");
        res.send(response);
    });
});

//add contact
router.post('/add', (req, res) => {
    const data = ContactManger.add(req.body, function(err){
        const response = getResponse(res, [], err);
        insetApiLog(req, response, err, "contacts/add");
        res.send(response);
    });
});

//edit contact
router.post('/edit', (req, res) => {
    const data = ContactManger.edit(req.body, function(err, results){
        const response = getResponse(res, results, err);
        insetApiLog(req, response, err, "contacts/edit");
        res.send(response);   
    });
});

//delete contact
router.post('/delete', (req, res) => {
    const data = ContactManger.delete(req.body, function(err){
        const response = getResponse(res, [], err);
        insetApiLog(req, response, err, "contacts/delete");
        res.send(response);
    });
});

//find contact
router.post('/find', (req, res) => {
    const data = ContactManger.find(req.body, function(err, results){
        const response = getResponse(res, results, err);
        // considering scale -> not saving log. 
        // insetApiLog(req, response, err, "contacts/find");
        res.send(response);   
    });
});

function getResponse(res, data, error) {
    var success = error ? false : true;
    const returnArr = {
        success : success,
        data    : data, 
        error   : error,
    };
    return returnArr;
}

function insetApiLog(request, respose, error, method) {
    const time = + new Date();
    const insert_obj = {
        request: "'" + serialize(request.body) + "'",
        response: "'" + serialize(respose) + "'",
        error: "'" + serialize(error) + "'", 
        method: "'" + method + "'",
        ip: "'" + request.connection.remoteAddress + "'",
        insert_ts: time,
        last_update: time
    }
    ContactManger.DBHandler.log("tb_api_log", insert_obj, function(insert_id) {
        return;
    });
}

export default router;