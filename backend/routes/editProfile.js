// TODO: this should occur on click of a "submit" button
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');
const dbconfig = require('../db_config.json');
const verify = require('../verifyjwt');

router.use(verify);
router.use(express.json());

router.post('/update', async (req, res) => {
    const username = req.body.username;
    const id = req.token.id;
    const bio = req.body.bio;
    const schedule = req.body.schedule;

    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const db = client.db("Users");
        
            var user = db.collection('user').find({
                _id:ObjectId(id)
            }).toArray();
    
            user.then(function (result) {
                db.collection('user').updateOne(
                    { _id:ObjectId(id) },
                    {
                        $set: { username: username, bio: bio, schedule: schedule }
                    }
                ).then(function (r) {
                    res.status(200).send("profile changed successfully");
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
                client.close();
            });
            
        });
    } catch (err) {
        console.log(error);
        res.status(400).json({err:error});
        client.close();
    }
})

router.post('/addskill', async (req, res) => {

    const {skill} = req.body;
    const {id} = req.token;
    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const db = client.db("Users");
        
            var user = db.collection('user').find({
                _id:ObjectId(id)
            }).toArray();
    
            user.then(function (result) {
                var skillArr = result[0].skills;
                for (curSkill of skillArr) {
                    console.log('cur ' + curSkill);
                    console.log('ski ' + skill);
                    if (curSkill == skill) {
                        res.status(400).json({message:'Skill already in your profile'});
                        client.close();
                        return;
                    }
                }
                skillArr.push(skill);
                console.log(skill);
                console.log(skillArr);
                db.collection('user').updateOne(
                    { _id:ObjectId(id) },
                    {
                        $set: { skills: skillArr }
                    }
                ).then(function (r) {
                    var success = 'Skill added successfully';
                    res.status(200).json({message:success});
                    client.close();
                    return;
                }).catch(function (error) {
                    console.log(error);
                    res.status(400).json({err:error});
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
    } catch (err) {
        console.log(error);
        res.status(400).json({err:error});
        client.close();
        return;
    }
})


router.post('/removeskill', async (req, res) => {

    console.log(req.body)
    const {skill} = req.body;
    const {id} = req.token;
    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const db = client.db("Users");
        
            var user = db.collection('user').find({
                _id:ObjectId(id)
            }).toArray();
    
            var removed = false;
            user.then(function (result) {
                var skillArr = result[0].skills;
                for (var i = 0; i < skillArr.length; i++) {
                    //console.log(skill, skillArr[i])
                    if (skillArr[i] == skill) {
                        skillArr.splice(i, 1);
                        removed = true;
                        break;
                    }
                }
                if (!removed) {
                    res.status(400).json({err:'Skill not on your profile'});
                    client.close();
                    return;
                }
                db.collection('user').updateOne(
                    { _id:ObjectId(id) },
                    {
                        $set: { skills: skillArr }
                    }
                )
                res.status(200).json({message:'Skill removed successfully'});
                client.close();
                return;
            }).catch(function (err) {
                console.log(err);
                res.status(400).json({err:err});
                client.close();
                return;
            });
        });
    } catch (err) {
        console.log(error);
        res.status(400).json({err:error});
        return;
    }
})

module.exports = router;
