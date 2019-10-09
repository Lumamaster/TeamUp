const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');
const verify = require('../verifyjwt');
const dbconfig = require('../db_config.json');

router.use(verify);
router.use(express.json());
router.post('/:id', async(req,res) => {

    const user = req.token;
    const teamId = req.params.id;

    const {teamName, teamMembers, info, requestedSkills, numMembers, open, course, maxMembers} =  req.body;

    // Update team data
    try{

        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true}, async function(err,client){
            assert.equal(null, err);
            const db = client.db("Teams");

            // Create team object to be updated
        var team = {
            teamName: teamName,
            teamMembers: teamMembers,
            info: info,
            requestedSkills: requestedSkills,
            numMembers: numMembers,
            open: open,
            alive: true,
            course: course,
            maxMembers: maxMembers
        };

        // Update team data on the database
        const foundTeam = await db.collection('team').findOne({_id:ObjectId(teamId)});
        if(!foundTeam) {
            res.status(404).json({err:"Couldn't find that team"})
        }
        console.log(foundTeam.owner);
        console.log(user);
        if(foundTeam.owner.id !== user.id) {
            res.status(401).json({err:"You are not the owner of that team."});
            client.close();
            return;
        }
        await db.collection('team').updateOne({_id: ObjectId(teamId)}, {
            $set: team
        });

        res.status(200).send();
        client.close();
        });

    } catch(err){
        console.log(error);
        res.status(400).json({err:error});
    }
});

module.exports = router;