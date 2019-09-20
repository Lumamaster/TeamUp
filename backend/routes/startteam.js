const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const cookie = require('../cookies');
const dbconfig = require('../db_config.json');

router.use(express.json());
router.post('/', async(req,res) => {
    /*if(cookie.readCookie("") == null) {
        // Redirect to login page
        res.status(400).json({message:"not logged in"})
        return;
    }*/

    const {teamName, teamMembers, owner, info, requestedSkills, numMembers, open, course, maxMembers} =  req.body;
    var thisteamid;

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

            

            // Insert team object to the database
            db.collection('team').insertOne(team).then(function(item){
                console.log('Team created succesfully');
                //teamadded = {teamName , item.insertedId};
                //console.log(team._id);     
                       
                res.status(200).send('Team created successfully');
                client.close();
            }).catch(function(err){
                console.log('Could not add team to database');
                res.status(400).json({err:err});
            });


            

            // Update currTeams on owner's database
            /*client.db("Users").collection('user').update({email: owner}, {$addToSet: {curTeams: teamadded}});
            client.close();*/
            
        });
    } catch(err) {
        console.error(err);
    } finally{}
});

module.exports = router;