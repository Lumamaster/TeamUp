const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();
const dbconfig = require('../db_config.json');
const cookie = require('../cookies.js');
const assert = require('assert');
const verify = require('../verifyjwt');

router.use(express.json());
router.use(verify);
router.post('/', async (req,res) => {

    const {email} = req.body;
    try {
        // Create Connection
        MongoClient.connect(dbconfig.url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, client) {
            assert.equal(null, err);
            const db = client.db("Users");

            var cursor = db.collection('user').find({
                email: email,
            });

            var arr = cursor.toArray();

            cursor.count().then(function (result) {

                // The user is found
                if (result == 1) {
                    console.log('user found');
                    arr.then(function (result2) {
                        console.log(result2[0]);
                        res.status(200).json({message:'user found', user:result2[0]});
                        client.close();
                        return;
                    }).catch(function (err2) {
                        console.log(err2);
                        res.status(400).send(err2);
                        client.close();
                        return;
                    });
                    

                    // The user is not found
                } else if (result == 0) {
                    console.log('user not found');
                    res.status(400).json({err:'user not found'});
                    client.close();
                    return;

                    // More than one user is found
                } else {
                    console.log('multiple users found: ' + result);
                    client.close();
                    return;
                }
            });
        });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
    

})

module.exports = router;