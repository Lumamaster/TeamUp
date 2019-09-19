const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const cookie = require('../cookies');
const dbconfig = require('../db_config.json');

router.use(express.json());
router.post('/startteam', async(req,res) => {
    if(cookie.readCookie("") == null) {
        // Redirect to login page
        res.status(400).json({message:"not logged in"})
        return;
    }

    const {teamName, teamMembers, owner, info, requestedSkills, numMembers, open, course, maxMembers} =  req.body;

    // Add team to database
    try{
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true}, function(err,client){
            assert.equal(null, err);
            const db = client.db("Teams");

            // Create team object to be added
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

            var teamadded;

            // Insert team object to the database
            db.collection('team').insertOne(team, function(err, result){
                if(err) console.log('Could not add team to database')
                // else team was succesfully added to the database
                var teamid = result._id;
                teamadded = {teamName , teamid};
            });

            // Update currTeams on owner's database
            client.db("Users").collection('user').update({email: owner}, {$addToSet: {curTeams: teamadded}});

            client.close();
        });
    } catch(err) {
        console.log(error);
        res.status(400).json({err:error});
    }
});