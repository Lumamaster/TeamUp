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

router.get('/user/get/:id', async (req, res) => {
    const userId = req.params.id;
    if(userId.length !== 24){
        console.log("invalid team ID");
        res.status(400).json({err:"Invalid team ID"}).send();
        return;
    }

    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const userdb = client.db("Users");

            /* Find the user with the passed in id */
            var user = userdb.collection('user').findOne({
                "_id":ObjectID(userId)
            });

            /* Return this user's time array */
            user.then(function (result) {
                res.status(200).json({schedule:result.schedule});
                console.log(result.schedule);
                client.close();
                return;
            }).catch(function (err) {
                res.status(400).json({err:err});
                console.log(err);
                client.close();
                return;
            });

            
        });
    } catch(err) {
        console.error(err);
    } finally{}

});

router.get('/:id', async (req,res) => {

    /* Check that the team id is valid */
    const teamId = req.params.id;
    if(teamId.length !== 24){
        console.log("invalid team ID");
        res.status(400).json({err:"Invalid team ID"}).send();
        return;
    }

    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const userdb = client.db("Users");

            /* Find all users that have an element with this teamID in their curTeams array */
            var users = userdb.collection('user').find({
                curTeams: { $all: [
                    { "$elemMatch" : { id: ObjectID(teamId) } }
                ] }
            }).toArray();

            /* find all values that are marked as free (1) for everyone */
            users.then(function (result) {
                var timeArr = result[0].schedule;
                for (var i = 1; i < result.length; i++) {
                    if (result[i] == false) {
                        timeArr[i] = false;
                    }
                };

                res.status(200).json({schedule:timeArr, message:'found common times'});
                client.close();
                return;
            }).catch(function (err) {
                console.log(err);
                res.status(400).json({err:err});
                client.close();
                return;
            });
            
        });
    } catch(err) {
        console.error(err);
    } finally{}

});

router.post('/user/set/:id', async (req, res) => {
    const userId = req.params.id;
    const freeTimes = req.body.schedule;

    if(userId.length !== 24){
        console.log("invalid team ID");
        res.status(400).json({err:"Invalid team ID"}).send();
        return;
    }

    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const userdb = client.db("Users");

            db.collection('user').updateOne(
                { _id:ObjectId(userId) },
                {
                    $set: { schedule: freeTimes }
                }
            ).then(function (result) {
                res.status(200).json({success:'free times updated'});
                console.log('free times updated');
                client.close();
                return;
            }).catch(function (err) {
                res.status(400).json({err:err});
                console.log(err);
                client.close();
                return;
            });
            
            
        });
    } catch(err) {
        console.error(err);
    } finally{}

});

module.exports = router;