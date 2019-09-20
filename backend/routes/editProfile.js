// TODO: this should occur on click of a "submit" button
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const cookie = require('../cookies');
const dbconfig = require('../db_config.json');

router.use(express.json());
router.post('/user/profile/edit/addskill', async (req, res) => {
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
                skillArr.push(skill);
                db.collection('user').updateOne(
                    { email: email },
                    {
                        $set: { skills: skillArr }
                    }
                )
                res.status(200).json({message:"skill added successfully"});
            }).catch(function (err) {
                console.log(err);
                res.status(400).json({err:err});
            });
            client.close();
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
    
            user.then(function (result) {
                var skillArr = result[0].skills;
                for (var i = 0; i < skillArr.length; i++) {
                    if (skillArr[i] == skill) {
                        skillArr.splice(i, 1);
                        break;
                    }
                }
                db.collection('user').updateOne(
                    { email: email },
                    {
                        $set: { skills: skillArr }
                    }
                )
                res.status(200).json({message:"skill added successfully"});
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
