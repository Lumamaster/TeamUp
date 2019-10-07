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

    /* Check that the team id is valid */
    const {teamId} = req.params;
    if(teamId.length !== 24){
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
                    { "$elemMatch" : { id: teamId} }
                ] }
            }).toArray();

            /* Iterate through all the skills of each member and add them to an array. 
               To avoid the case of duplicates if two users share common skills, only add skills 
               that are not already in the array */
            users.then(function (membersArr) {
                var allSkills = [];
                for (member of membersArr) {
                    var curSkills = member.skills;
                    for (skill of curSkills) {
                        if (!allSkills.includes(skill)) {
                            allSkills.push(skill);
                        }
                    }
                }

                console.log('skill array returned');
                res.status(200).json({allSkills:allSkills, message:'skill array returned'});        /* Send the array that has all distinct skills in it */
                client.close();
            }).catch(function (err) {
                console.log(err);
                res.status(400).json({err:err});
                client.close();
            });
            
        });
    } catch(err) {
        console.error(err);
    } finally{}

});

module.exports = router;