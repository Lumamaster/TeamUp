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
router.get('/unblock/:id', async (req,res) => {

    const {theirId} = req.params;
    const myId = req.token.id;

    /* Check that the ids are valid */
    if(theirId.length !== 24 || myId.length != 24){
        res.status(400).json({err:"Invalid user ID"}).send();
        return;
    }
    

    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const userdb = client.db("Users");

            var them = userdb.collection('user').findOne({
                "_id":ObjectID(theirId)
            }).toArray();

            var me = userdb.collection('user').findOne({
                "_id":ObjectID(myId)
            }).toArray();


            them.then(function (result) {
                var theirBlocked = result[0].blockedBy;

                /* remove me from their blockedby array */
                for (var i = 0; i < theirBlocked.length; i++) {
                    if (theirBlocked[i].id == myId) {
                        theirBlocked.splice(i, 1);
                        break;
                    }
                }
                userdb.collection('user').updateOne(            
                    { _id: ObjectID(theirId) },
                    {
                        $set: { blockedBy: theirBlocked }
                    }
                ).then(function (result) {
                    me.then(function (r) {
                        var myBlocked = r[0].blockedUsers;

                        /* remove them from my blockedusers array */
                        for (var i = 0; i < myBlocked.length; i++) {
                            if (myBlocked[i].id == theirId) {
                                myBlocked.splice(i, 1);
                                break;
                            }
                        }

                        userdb.collection('user').updateOne(
                            { _id: ObjectID(myId) },
                            {
                                $set: { blockedUsers: myBlocked }
                            }
                        ).then(function (r) {
                            var success = 'unblocked successfully';
                            console.log(success);
                            res.status(200).json({message:success});
                            client.close();
                            return;
                        }).catch(function (err) {
                            console.log(err);
                            res.status(400).json({err:err});
                            client.close();
                            return;
                        });
                    }).catch(function (err) {
                        console.log(err);
                        res.status(400).json({err:err});
                        client.close();
                        return;
                    });
                }).catch(function (err) {
                    console.log(err);
                    res.status(400).json({err:err});
                    client.close();
                    return;
                });
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

})



router.get('/block/:id', async (req,res) => {

    const {theirId} = req.params;
    const myId = req.token.id;

    /* Check that the ids are valid */
    if(theirId.length !== 24 || myId.length != 24){
        res.status(400).json({err:"Invalid user ID"}).send();
        return;
    }
    

    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const userdb = client.db("Users");

            /* Add me to the list of people who have blocked them */
            userdb.collection('user').updateOne(
                { _id: ObjectID(theirId) },
                {
                    $addToSet: {blockedBy: myId }
                }
            ).then(function (result) {
                console.log('succesfully added to their blockedby');

                /* Add them to the list of people that I have blocked */
                userdb.collection('user').updateOne(
                    { _id: ObjectID(myId) },
                    {
                        $addToSet: {blockedUsers: theirId }
                    }
                ).then(function (r) {
                    console.log('successfully added them to blockedUsers');
                    res.status(200).json({message:'successfully added to lists'});
                    client.close();
                    return;
                }).catch(function (err) {
                    console.log(err);
                    res.status(400).json({err:err});
                    client.close();
                    return;
                });
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

})

module.exports = router;