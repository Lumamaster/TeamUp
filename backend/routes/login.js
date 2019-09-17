const express = require('express');
const mongo = require('mongodb').MongoClient;
const router = express.Router();
const dbconfig = require('../db_config.json');

router.use(express.json());
router.post('/', async (req,res) => {
    //console.log(req.body);
    const {email, password} = req.body;
    if(!email || !password) res.sendStatus(400);
    //let x = await loginUser(email, password);
    //console.log(x)
    //TODO: hash password before sending it to database
    try {
        const client = await mongo.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true });
        //console.log(client);
        const db = client.db("Users");
        var cursor = db.collection('user').find({
            email: email,
            password: password
        });
        let result = await cursor.count();
        
        // The user is found
        if (result == 1) {
            client.close();
            /* TODO: Get information about the user to be passed back in response */
            out = true;
            res.sendStatus(200);

        // The user is not found    
        } else if (result == 0) {
            client.close();
            res.sendStatus(404);

        // More than one user is found    
        } else {
            console.log('non zero or 1 query value: ' + result);
            client.close();
            res.sendStatus(500);
        }
    } catch(err) {
        console.error(err);
    } finally{}
})

module.exports = router;