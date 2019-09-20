const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const router = express.Router();
const dbconfig = require('../db_config.json');
const cookie = require('../cookies.js');
const assert = require('assert');

router.use(express.json());
router.get('/:id', async (req,res) => {
    
    const {id} = req.params;
    //console.log(id)

    if(id.length !== 24){
        res.status(400).json({err:"Invalid user ID"}).send();
        return;
    }
    //if(!email || !password) res.status(400).json({err:"Missing email or password"});

    //TODO: hash password before sending it to database
    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const db = client.db("Users");
    
            var cursor = db.collection('user').findOne({
                "_id":ObjectID(id)
            }, (err, result) => {
                if(err) {
                    res.status(500).send();
                    console.error(err);
                    return;
                }
                if(!result) {
                    res.sendStatus(404);
                    return;
                } else {
                    res.status(200).json(result).send();
                    return;
                }
            });
        });
    } catch(err) {
        console.error(err);
    } finally{}
})

router.get('/', (req,res) => {
    const id = '5d8261b40dbb7a3e681b286f';  //test user
    //TODO get id from cookie

    if(id.length !== 24){
        res.status(400).json({err:"Invalid user ID"}).send();
        return;
    }
    //if(!email || !password) res.status(400).json({err:"Missing email or password"});

    //TODO: hash password before sending it to database
    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const db = client.db("Users");
    
            var cursor = db.collection('user').findOne({
                "_id":ObjectID(id)
            }, (err, result) => {
                if(err) {
                    res.status(500).send();
                    console.error(err);
                    return;
                }
                if(!result) {
                    res.sendStatus(404);
                    return;
                } else {
                    res.status(200).json(result);
                    return;
                }
            });
        });
    } catch(err) {
        console.error(err);
    } finally{}
})

module.exports = router;
