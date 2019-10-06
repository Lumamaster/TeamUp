const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const router = express.Router();
const dbconfig = require('../db_config.json');
const verify = require('../verifyjwt');
const assert = require('assert');
const jwt = require('jsonwebtoken');

router.use(verify);
router.use(express.json());
router.get('/:id', async (req,res) => {

    /* Check that the team id is valid */
    const {theirId} = req.params;
    if(theirId.length !== 24){
        res.status(400).json({err:"Invalid user ID"}).send();
        return;
    }

    const reviewText = req.body.review;

    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const db = client.db("Users");
    
            var user = db.collection('user').findOne({
                "_id":ObjectID(theirId)
            }).toArray();

            /* Push the new review onto the array of reviews */
            user.then(function (result) {
                db.collection('user').updateOne(
                    { _id:ObjectId(theirId) },
                    {
                        $push: { reviews: reviewText }
                    }
                ).then(function (r) {
                    var success = 'review added';
                    console.log(success);
                    res.status(200).json({message: success});
                    client.close();
                    return;
                }).catch(function (error) {
                    console.log(error);
                    res.status(400).send(error);
                    client.close();
                    return;
                });
            });
            
        });
    } catch(err) {
        console.error(err);
    } finally{}

})

module.exports = router;