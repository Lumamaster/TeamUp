const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const cookie = require('../cookies');
const dbconfig = require('../db_config.json');

router.use(express.json());
router.post('/', async(req,res) => {
    if(cookie.readCookie("") == null) {
        // Redirect to login page
        res.status(400).json({message:"not logged in"})
        return;
    }

    const {teamid, teamName, teamMembers, owner, info, requestedSkills, numMembers, open, course, maxMembers} =  req.body;

    // Update team data
    try{

        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true}, function(err,client){
            assert.equal(null, err);
            const db = client.db("Teams");

            // Create team object to be updated
        var team = {
            teamName: teamName,
            teamMembers: teamMembers,
            owner: owner,
            info: info,
            requestedSkills: requestedSkills,
            numMembers: numMembers,
            open: open,
            alive: true,
            course: course,
            maxMembers: maxMembers
        };

        // Update team data on the database
        db.collection('team').update({_id: teamid}, {team});

        client.close();
        });

    } catch(err){
        console.log(error);
        res.status(400).json({err:error});
    }
});

module.exports = router;