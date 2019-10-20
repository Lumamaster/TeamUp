const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const assert = require('assert');
const verify = require('../verifyjwt');
const dbconfig = require('../db_config.json');

router.use(express.urlencoded({extended:false}));
router.use(verify);
router.use(express.json());
router.post('/:id', async(req,res) => {

    const user = req.token;
    const teamId = req.params.id;

    const {teamName, info, requestedSkills, open, course, maxMembers} =  req.body;
    //console.log(req.body)

    // Update team data
    try{

        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true}, async function(err,client){
            assert.equal(null, err);
            const db = client.db("Teams");
            const userdb = client.db("Users");


        // Update team data on the database
        const foundTeam = db.collection('team').findOne({_id:ObjectId(teamId)});
        if(!foundTeam) {
            res.status(404).json({err:"Couldn't find that team"})
        
        }
        foundTeam.then(function(result){
            console.log(result.owner.id);
            console.log(user);
            if(result.owner.id !== user.id) {
                res.status(401).json({err:"You are not the owner of that team."});
                client.close();
                return;
            }

            db.collection('team').updateOne({_id: ObjectId(teamId)}, 
        { $set: {teamName: teamName,
            info: info,
            requestedSkills: requestedSkills,
            open: open,
            course: course,
            maxMembers: maxMembers
                          }}
        ).then(function(result){

            /*if(addMembers){
            var teamSplit = addMembers.split(',');
                teamSplit.forEach(element => {
                var user = userdb.collection('user').find({
                email: element
                }).toArray(); 
        
                user.then(function (result) {
                    userdb.collection('user').updateOne(
                        { email:element },
                        {
                         $push: { invites: {id: teamId, name: teamName} }
                        }
                )}).catch(function(err){
                    console.log(err);
                });});
            }*/

            res.status(200).send("team edited successfully");
            client.close();
        }).catch(function(err){   
            console.log(err);
            res.status(401).json({err:"didn't work"});
        });

        }).catch(function(err){
            console.log(err);
            res.status(401).json({err:"didn't work"});
        });
        console.log("justalog");
        

        
        });

    } catch(err){
        console.log(error);
        res.status(400).json({err:error});
    }



});

module.exports = router;