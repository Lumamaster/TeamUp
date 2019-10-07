const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const router = express.Router();
const assert = require('assert');
const dbconfig = require('../db_config.json');
const verify = require('../verifyjwt');
const assert = require('assert');
const jwt = require('jsonwebtoken');

router.use(express.urlencoded({extended:false}));

router.use(verify);
router.use(express.json());
router.get('/:id/invite', async (req, res) => {
    const {id} = req.params; // id of the user you want to invite
    const owner = req.token; // current user who wants to invite people

    if(id.length !== 24){
        res.status(400).json({err:"Invalid user ID"}).send();
        return;
    }

    try{
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){

            assert.equal(null, err);
            const db = client.db("Teams");

            db.collection('team').find({
                $and:
                [{owner: owner},
                {alive: true}]
            }).toArray()
            ,then(teams => {
                //console.log(teams);
                client.close();
                res.status(200).json(teams);
                return;
            })

        });
    } catch(err){
        console.log(error);
        res.status(400).json({err:error});
    }
});

router.get('/:id/invite/:teamid', async (req, res) => {

    const {id, teamid, teamname} = req.query; // id of the user you want to invite and the team to invite to

    try{
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
            assert.equal(null, err);
            const db = client.db("Users");

            var user = db.collection('user').find({
                _id:ObjectId(id)
            }).toArray(); 
        
            user.then(function (result) {
                db.collection('user').updateOne(
                    { _id:ObjectId(id) },
                    {
                        $push: { invites: {id: teamid, name: teamname} }
                    }
                ).then(function (r) {
                    res.status(200).send("added invite successfully");
                    client.close();
                    return;
                }).catch(function (error) {
                    console.log(error);
                    res.status(400).send(error);
                    client.close();
                    return;
                });

        }).catch(function (err) {
                console.log(err);
                res.status(400).json({err:err});
            })});
    } catch(err){
        console.log(error);
        res.status(400).json({err:error});
    }

})