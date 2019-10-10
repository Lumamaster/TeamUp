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
router.use(express.urlencoded({extended:false}));
router.post('/:id', async (req,res) => {

    /* Check that the team id is valid */
    const theirId = req.params.id;
    if(theirId.length !== 24){
        res.status(400).json({err:"Invalid user ID"}).send();
        return;
    }

    const reviewText = req.body.review;
    console.log(reviewText);

    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const db = client.db("Users");

            db.collection('user').updateOne(
                { _id:ObjectID(theirId) },
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
                res.status(400).json({err:error});
                client.close();
                return;
            });
            
        });
    } catch(err) {
        console.error(err);
    } finally{}

})

module.exports = router;