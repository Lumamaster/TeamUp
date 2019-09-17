const express = require('express');
const mongo = require('mongodb').MongoClient;
const router = express.Router();
const dbconfig = require('../db_config.json');

router.use(express.json());
router.post('/', async (req,res) => {
    
    const {email, password} = req.body;
    if(!email || !password) res.status(400).json({err:"Missing email or password"}).send();
    
    //TODO: hash password before sending it to database
    try {
        const client = await mongo.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true });
        
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
            res.status(200).send();

        // The user is not found    
        } else if (result == 0) {
            client.close();
            res.status(404).json({err:"The specified user was not found"});

        // More than one user is found    
        } else {
            console.log('non zero or 1 query value: ' + result);
            client.close();
            res.sendStatus(500);
            console.error("Found >1 user with given username and password")
        }
    } catch(err) {
        console.error(err);
    } finally{}
})

module.exports = router;