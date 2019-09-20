const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();
const dbconfig = require('../db_config.json');
const cookie = require('../cookies.js');
const assert = require('assert');
const jwt = require('jsonwebtoken');

router.use(express.json());
router.post('/', async (req,res) => {
    
    const {email, password} = req.body;
    //if(!email || !password) res.status(400).json({err:"Missing email or password"});
    if (!email || !password) {
        res.status(400).send('missing email or password');
        return;
    }

    //TODO: hash password before sending it to database
    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const db = client.db("Users");
    
            var cursor = db.collection('user').find({
                email: email,
                password: password
            });
    
<<<<<<< HEAD
            cursor.count().then(function(result) {
                
                // The user is found
                if (result == 1) {
                    console.log('logging in');
                    //res.status(200).json({message:"logged in successfully"});
                    res.status(200).send('logged in successfully');
                    client.close();
                    /* TODO: Get information about the user to be passed back in response */
                // The user is not found    
                } else if (result == 0) {
                    console.log('incorrect email or password');
                    //res.status(400).json({err:"incorrect email or password"});
                    res.status(400).send('incorrect email or password');
                    client.close();
                // More than one user is found    
=======
            cursor.toArray().then(result => {
                //console.log(result)
                if(result.length === 0) {
                    res.status(404).json({err:"Incorrect username or password"})
                    return;
                } else if(result.length === 1) {
                    const token = jwt.sign({
                        data: {
                            id: result[0]._id,
                            username: result[0].username
                        }
                    }, dbconfig.jwt_key, { expiresIn: '1d' })
                    res.status(200).send(token)
                    return;
>>>>>>> b7d1a65860888e0cc3b753459a32ee7394fe29e9
                } else {
                    res.status(500).json({err:"Server error"})
                    return;
                }
            })
        });
    } catch(err) {
        console.error(err);
    } finally{}
})

module.exports = router;
