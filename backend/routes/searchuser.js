const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();
const dbconfig = require('../db_config.json');
const assert = require('assert');
const verify = require('../verifyjwt');

router.use(express.json());
router.use(verify);
router.get('/:search', async (req,res) => {

    try {
        // Create Connection
        MongoClient.connect(dbconfig.url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, client) {
            assert.equal(null, err);
            const db = client.db("Users");

            var cursor = db.collection('user').find({
                $or: [
                    {email:{$regex: req.params.search}},
                    {username:{$regex: req.params.search}},
                    {name:{$regex: req.params.search}}
                ]
            }, {projection: {
                password: false
            }});

            var arr = cursor.toArray();

            cursor.count().then(function (result) {

                // The user is found
                if (result > 0) {
                    //console.log('user found');
                    arr.then(function (result2) {
                        //console.log(result2[0]);
                        res.status(200).json(result2);
                        client.close();
                        return;
                    }).catch(function (err2) {
                        console.log(err2);
                        res.status(400).send(err2);
                        client.close();
                        return;
                    });
                    // The user is not found
                } else {
                    //console.log('user not found');
                    res.status(400).json({err:'user not found'});
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


router.get('/', async (req,res) => {

    try {
        // Create Connection
        MongoClient.connect(dbconfig.url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, client) {
            assert.equal(null, err);
            const db = client.db("Users");

            var cursor = db.collection('user').find({});

            var arr = cursor.toArray();

            cursor.count().then(function (result) {

                // The user is found
                if (result > 0) {
                    //console.log('user found');
                    arr.then(function (result2) {
                        //console.log(result2[0]);
                        res.status(200).json(result2);
                        client.close();
                        return;
                    }).catch(function (err2) {
                        console.log(err2);
                        res.status(400).send(err2);
                        client.close();
                        return;
                    });
                    // The user is not found
                } else {
                    //console.log('user not found');
                    res.status(400).json({err:'no users'});
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