const express = require('express');
const router = express.Router();
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const assert = require('assert');
const verify = require('../verifyjwt');
const dbconfig = require('../db_config.json');

router.use(express.json());
router.use(verify);
router.post('/', async(req,res) => {

    const {teamName, info, requestedSkills, tags, open, course, maxMembers} =  req.body;
    //TODO: Handle sending invites to other team members
    const owner = req.token //has id and username stored
    var thisteamid;

    // Add team to database
    try{
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true}, function(err,client){
            assert.equal(null, err);
            const db = client.db("Teams");

            // Create team object to be added
            var team = {
                teamName: teamName,
                teamMembers: [owner],
                owner: owner,
                info: info,
                requestedSkills: [requestedSkills],
                numMembers: 1,
                open: open,
                alive: true,
                course: course,
                maxMembers: maxMembers,
                chat: []
            };

            

            // Insert team object to the database
            db.collection('team').insertOne(team).then(function(item){
                //console.log('Team created succesfully');
                //teamadded = {teamName , item.insertedId};    
                client.db("Users").collection('user').updateOne(
                    {_id: mongodb.ObjectId(owner.id)},
                    {$push:{
                        curTeams: {
                            id:item.insertedId,
                            name:item.ops[0].teamName
                        }
                    }}
                ).catch(function(err){
                    console.log(err);
                    res.status(400).json({err:err});
                });
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