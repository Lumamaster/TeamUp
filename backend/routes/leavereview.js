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

            user.then(function (result) {
                var reviewArr = result[0].reviews;
                reviewArr.push(reviewText);
                db.collection('user').updateOne(
                    { _id:ObjectId(theirId) },
                    {
                        $set: { reviews: reviewArr }
                    }
                ).then(function (r) {
                    res.status(200).send("review added successfully");
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