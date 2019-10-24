const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const assert = require('assert');
const verify = require('../verifyjwt');
const dbconfig = require('../db_config.json');

router.use(express.json());
router.use(verify);
router.post('/', async(req,res) => {

    const {teamName, teamMembers, info, requestedSkills, open, course, maxMembers} =  req.body;
    //TODO: Handle sending invites to other team members
    const owner = {
        id: ObjectId(req.token.id),
        username: req.token.username || req.token.name || req.token.id
    } //has id and username stored
    let thisteamid;
    let thisteamname;

    // Add team to database
    try{
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true}, function(err,client){
            assert.equal(null, err);
            const db = client.db("Teams");
            const userdb = client.db("Users");

    

            // Create team object to be added
            var team = {
                teamName: teamName,
                teamMembers: [owner],
                owner: owner,
                info: info,
                requestedSkills: requestedSkills || [],
                numMembers: 1,
                open: open,
                alive: true,
                course: course,
                maxMembers: 500,
                chat: []
            };

            

            // Insert team object to the database
            db.collection('team').insertOne(team).then(function(item){
                //console.log('Team created succesfully');
                //teamadded = {teamName , item.insertedId}; 
                thisteamid = item.insertedId;
                thisteamname = item.ops[0].teamName;

                userdb.collection('user').updateOne(
                    {_id: ObjectId(owner.id)},
                    {$push:{
                        curTeams: {
                            id:item.insertedId,
                            name:item.ops[0].teamName
                        }
                    }}
                ).catch(function(err){
                        console.log(err);
                        console.log('err update1');
                        res.status(400).json({err:err});
                        client.close();
                        return;
                });

                teamMembers.forEach(element => {
                    var user = userdb.collection('user').find({
                        email: element
                    }).toArray(); 

        
                    user.then(function (result) {
                        userdb.collection('user').updateOne(
                            { email:element },
                            {
                            $push: { invites: {id: item.insertedId, name: item.ops[0].teamName} }
                            }
                        ).then(function (r) {
                            console.log('success');
                            //res.status(200).send('Team created successfully');
                            //client.close();
                        }).catch(function (err) {
                            console.log(err);
                            res.status(400).json({err:err});
                            client.close();
                        });
                    }).catch(function(err){
                        res.status(400).json({err:err});
                        console.log(err);
                        client.close();
                    });
                });
                
            })
            .then(() => {
                //console.log("Done!", thisteamid,thisteamname)
                res.status(200).json({
                    id:thisteamid,
                    name:thisteamname
                });
                //client.close();
            }).catch(function(err){
                console.log('Could not add team to database');
                console.log(err);
                res.status(400).json({err:err});
            });
            

            // Update currTeams on owner's database
            /*client.db("Users").collection('user').update({email: owner}, {$addToSet: {curTeams: teamadded}});
            client.close();*/
            
        });
    } catch(err) {
        console.error(err);
    }
});

module.exports = router;