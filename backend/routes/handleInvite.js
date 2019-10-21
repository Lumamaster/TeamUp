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

/* Accept invite */
router.get('/acceptinvite/:id', (req, res) => {
    const teamId = req.params.id; // the team id to join by accepting invite
    const userId = req.token.id; // the user id of the current user

    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const userdb = client.db("Users");
            const teamdb = client.db("Teams");

            userdb.collection('user').updateOne(
                {_id: ObjectID(userId)},
                {$pull: { invites: { id: teamId}}}
            ).then(function (r) {
                userdb.collection('user').findOne({
                    "_id":ObjectID(userId)
                }).then(function (result) {
                    teamdb.collection('team').updateOne(
                        {"_id": ObjectID(teamId)},
                        
                        {$addToSet: {teamMembers: {id: userId, username: result.username}}, 
                        $inc: {numMembers: 1},
                        $push: {chat: {
                            sender: req.token.name || req.token.username || req.token.id,
                            senderId: req.token.id,
                            type:'join'
                        }}}
                        
                    ).then(function (r) {
                        teamdb.collection('team').findOne({
                            "_id":ObjectID(teamId)
                        }).then(function (result) {
                            var teampair = {
                                id: ObjectID(teamId),
                                name: result.teamName
                            }
                            userdb.collection('user').updateOne(
                                {_id: ObjectID(userId)},
                                {$addToSet: {curTeams: teampair}}
                            ).then(function (result) {
                                res.status(200).send('accepted invite successfully');
                                client.close();
                            }).catch(function (err) {
                                console.log(err);
                                res.status(400).json({err:err});
                                client.close();
                            });
                        }).catch(function (err) {
                            console.log(err);
                            res.status(400).json({err:err});
                            client.close();
                        });
                        
                    });
                    req.app.io.to(teamId).emit('message', {
                        sender: req.token.name || req.token.username || req.token.id,
                        senderId: req.token.id,
                        type:'join'
                    });
                }).catch(function (err) {
                    console.log(err);
                    res.status(400).json({err:err});
                    client.close();
                    return;
                })
            }).catch(function (err) {
                console.log(err);
                res.status(400).json({err:err});
                client.close();
                return;
            });
        });
    } catch(err) {
        console.error(err);
        res.status(400).json({err:err});
    } finally{}
})


// Decline Invite

router.get('/declineinvite/:id', (req, res) => {
    
    const teamId = req.params.id; // the team id invite to decline
    const userId = req.token.id; // the user id of the current user

    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const userdb = client.db("Users");

            // Removing the invite
            userdb.collection('user').updateOne(
                {_id: ObjectID(userId)},
                {$pull: { invites: { id: ObjectID(teamId)}}}
            ).then(function (result) {
                res.status(200).json({message:'declined successfully'});
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
        res.status(400).json({err:err});
    } finally{}
})

module.exports = router;