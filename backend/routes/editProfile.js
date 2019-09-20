// TODO: this should occur on click of a "submit" button
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const cookie = require('../cookies');
const dbconfig = require('../db_config.json');

router.use(express.json());
router.post('/addskill', async (req, res) => {
    /* if (cookie.readCookie("") == null) {
        // TODO: redirect to login page
        res.status(400).json({message:"not logged in"});
        return;
    } */

    const {email, skill} = req.body;
    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const db = client.db("Users");
        
            var user = db.collection('user').find({
                email: email
            }).toArray();
    
            user.then(function (result) {
                var skillArr = result[0].skills;
                for (curSkill of skillArr) {
                    console.log('cur ' + curSkill);
                    console.log('ski ' + skill);
                    if (curSkill == skill) {
                        res.status(400).send("skill already in your profile");
                        client.close();
                        return;
                    }
                }
                skillArr.push(skill);
                console.log(skill);
                console.log(skillArr);
                db.collection('user').updateOne(
                    { email: email },
                    {
                        $set: { skills: skillArr }
                    }
                ).then(function (r) {
                    res.status(200).send("skill added successfully");
                    client.close();
                    return;
                }).catch(function (error) {
                    console.log(error);
                    res.status(400).send(error);
                    client.close();
                    return;
                });
                //res.status(200).json({message:"skill added successfully"});
                
            }).catch(function (err) {
                console.log(err);
                res.status(400).json({err:err});
            });
            
        });
    } catch (err) {
        console.log(error);
        res.status(400).json({err:error});
    }
})


router.post('/removeskill', async (req, res) => {
/*    if (cookie.readCookie("") == null) {

        // TODO: redirect to login page
        res.status(400).json({message:"not logged in"});
        return;
    } */

    const {email, skill} = req.body;
    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const db = client.db("Users");
        
            var user = db.collection('user').find({
                email: email
            }).toArray();
    
            var removed = false;
            user.then(function (result) {
                var skillArr = result[0].skills;
                for (var i = 0; i < skillArr.length; i++) {
                    if (skillArr[i] == skill) {
                        skillArr.splice(i, 1);
                        removed = true;
                        break;
                    }
                }
                if (!removed) {
                    res.status(400).send("skill not on your profile");
                    client.close();
                    return;
                }
                db.collection('user').updateOne(
                    { email: email },
                    {
                        $set: { skills: skillArr }
                    }
                )
                //res.status(200).json({message:"skill added successfully"});
                res.status(200).send("skill removed successfully");
                client.close();
            }).catch(function (err) {
                console.log(err);
                res.status(400).json({err:err});
                client.close();
            });
        });
    } catch (err) {
        console.log(error);
        res.status(400).json({err:error});
    }
})

module.exports = router;
