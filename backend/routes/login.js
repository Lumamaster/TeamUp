const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();
const dbconfig = require('../db_config.json');
const cookie = require('../cookies.js');
const assert = require('assert');

router.use(express.json());
router.post('/', async (req,res) => {
    
    const {email, password} = req.body;
    if(!email || !password) res.status(400).json({err:"Missing email or password"});
    
    //TODO: hash password before sending it to database
    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const db = client.db("Users");
    
            var cursor = db.collection('user').find({
                email: email,
                password: password
            });
    
            cursor.count().then(function(result) {
                
                // The user is found
                if (result == 1) {
                    console.log('logging in');
                    res.status(200).json({message:"logged in successfully"});
                    cookie.createCookie(username, email, 3);
                    client.close();
                    /* TODO: Get information about the user to be passed back in response */
                // The user is not found    
                } else if (result == 0) {
                    console.log('incorrect username or password');
                    res.status(400).json({err:"incorrect username or password"});
                    client.close();
                // More than one user is found    
                } else {
                    console.log('non zero or 1 query value: ' + result);
                    client.close();
                    return false;
                }
            });
        });
    } catch(err) {
        console.error(err);
    } finally{}
})

module.exports = router;
