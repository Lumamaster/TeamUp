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

// Accept invite
router.get('/acceptrequest/:id/:teamid', (req, res) => {
    
    const reqUserId = req.param.id;  // the user id that sent the request
    const teamId = req.params.teamid; // the team id that has the request
    const userId = req.token.id; // the user id of the current user

    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const userdb = client.db("Users");
            const teamdb = client.db("Teams");

            // Removing the request
            /*teamdb.collection('team').update(
                {"_id":ObjectID(teamId)},
                {$pull: {reqReceived: {$eq: reqUserId }}}
            )*/

            // Adding user to teamMembers, updating numMembers
            userdb.collection('user').findOne({
                "_id":ObjectID(reqUserId)
            }).then(function(result){
                teamdb.collection('team').update(
                    {"_id": ObjectID(teamId)},
                    {$addToSet: {teamMembers: {id: reqUserId, username: result.userName}}}, 
                    {$inc: {numMembers: 1}},
                    {$push: {chat: {
                        sender: req.token.name || req.token.username || req.token.id,
                        senderId: req.token.id,
                        type:'join'
                    }}}
                );
            });
            req.app.io.to(teamId).emit('message', {
                sender: req.token.name || req.token.username || req.token.id,
                senderId: req.token.id,
                type:'join'
            })
            
            client.close();
        });
    } catch(err) {
        console.error(err);
    } finally{}

})

// Decline Invite

router.get('/declinerequest/:id/:teamid', (req, res) => {
    
    const reqUserId = req.param.id;  // the user id that sent the request
    const teamId = req.params.teamid; // the team id that has the request
    const userId = req.token.id; // the user id of the current user

    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const userdb = client.db("Users");
            const teamdb = client.db("Teams");

            // Removing the join request
            userdb.collection('user').update(
                {"_id":ObjectID(teamId)},
                {$pull: {reqReceived: {$eq: reqUserId}}}
            )
            
            client.close();
        });
    } catch(err) {
        console.error(err);
    } finally{}
})

module.exports = router;