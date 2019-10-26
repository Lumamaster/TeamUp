const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');
const router = express.Router();
const dbconfig = require('../db_config.json');
const verify = require('../verifyjwt');
const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;


router.use(verify);
router.use(express.json());
router.use(express.urlencoded({extended:false}));
router.get('/:id', async (req,res) => {

    const teamID = req.params.id
    const userID = req.token.id

    if(teamID.length !== 24) {
        res.status(400).json({err:"Invalid team ID"})
        return;
    }
    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, async function(err, client) {
            assert.equal(null, err);
            const userdb = client.db("Users");
            const teamdb = client.db("Teams");
        
            // TODO: get teamname from button click
            var mongoID = ObjectId(teamID);
        
            // Get array of users with matching email. Should be size 1.
            var user = await (userdb.collection('user').find({
                _id:ObjectId(userID)
            }).toArray());
        
            // Get array of users with matching name. Should be size 1.
            var team = await (teamdb.collection('team').find({
                _id: mongoID
            }).toArray());

            if(team.length === 0) {
                res.status(404).json({err:"Couldn't find that team"})
                client.close();
                return;
            }
            if(user.length === 0 || user.length > 1 || team.length > 1) {
                res.status(500).send()
                client.close();
                return;
            }
            team = team[0]
            user = user[0]

            /*let isInTeam = false;
            //console.log(user)
            user.curTeams.forEach(curTeam => {
                if(curTeam.id === teamID) {
                    res.status(400).json({err:"You are already in that team."})
                    isInTeam = true;
                }
            })
            if(isInTeam) {
                client.close();
                return;
            }*/
            if(!team.alive) {
                res.status(400).json({err:"That team is no longer active."});
                client.close();
                return;
            }

            if(team.numMembers === team.maxMembers) {
                res.status(400).json({err:"That team is full."});
                client.close();
                return;
            }
            
            //Join the team
            let obj = {id:userID, username:user.username}
            let newMembersArr = team.teamMembers;
            //newMembersArr.push(obj);
            var teamupdate = teamdb.collection('team').updateOne({_id:ObjectId(teamID)},{
                $inc: {numMembers: 1},
                $push: {teamMembers: {
                    id:ObjectId(userID),
                    username:user.username
                },
                chat: {
                    sender: req.token.name || req.token.username || req.token.id,
                    senderId: req.token.id,
                    type:'join'
                }}
            })
            req.app.io.to(teamID).emit('message', {
                sender: req.token.name || req.token.username || req.token.id,
                senderId: req.token.id,
                type:'join'
            })
            // Checking if team is full and notifying if it is
            let teamcheck = await teamdb.collection('team').findOne({_id:ObjectId(teamID)})
            //console.log(teamcheck.numMembers, teamcheck.maxMembers);
            if(teamcheck.numMembers === teamcheck.maxMembers){
                // Team is now full, alert
                teamdb.collection('team').updateOne({_id:ObjectId(teamID)}, {
                    $push: {
                        chat: {
                            type:'full'
                        }
                    }
                })
                req.app.io.to(teamID).emit('message', {
                    type:'full'
                })
            }
            var userupdate = userdb.collection('user').updateOne({_id:ObjectId(userID)},{
                $pull: {prevTeams: {
                    id:ObjectId(teamID),
                    name:team.teamName
                }},
                $push: {curTeams: {
                    id:ObjectId(teamID),
                    name:team.teamName
                }}
            })
            
            await Promise.all([teamupdate,userupdate])
            res.status(200).send("user joined notified");
            client.close();
            return;

            /*if(team.open) {
                //Join the team
                /*let obj = {id:userID, username:user.username}
                let newMembersArr = team.teamMembers;
                //newMembersArr.push(obj);
                var teamupdate = teamdb.collection('team').updateOne({_id:ObjectId(teamID)},{
                    $inc: {numMembers: 1},
                    $push: {teamMembers: {
                        id:ObjectId(userID),
                        username:user.username
                    },
                    chat: {
                        sender: req.token.name || req.token.username || req.token.id,
                        senderId: req.token.id,
                        type:'join'
                    }}
                })
                req.app.io.to(teamID).emit('message', {
                    sender: req.token.name || req.token.username || req.token.id,
                    senderId: req.token.id,
                    type:'join'
                })
                // Checking if team is full and notifying if it is
                let teamcheck = await teamdb.collection('team').findOne({_id:ObjectId(teamID)})
                //console.log(teamcheck.numMembers, teamcheck.maxMembers);
                if(teamcheck.numMembers === teamcheck.maxMembers){
                    // Team is now full, alert
                    teamdb.collection('team').updateOne({_id:ObjectId(teamID)}, {
                        $push: {
                            chat: {
                                type:'full'
                            }
                        }
                    })
                    req.app.io.to(teamID).emit('message', {
                        type:'full'
                    })
                }
                var userupdate = userdb.collection('user').updateOne({_id:ObjectId(userID)},{
                    $pull: {prevTeams: {
                        id:ObjectId(teamID),
                        name:team.teamName
                    }},
                    $push: {curTeams: {
                        id:ObjectId(teamID),
                        name:team.teamName
                    }}
                })
                
                await Promise.all([teamupdate,userupdate])
                res.status(200).send("user joined notified");
                client.close();
                return;
            } else {
                //Request to join the team
                let teamupdate = teamdb.collection('team').updateOne({_id: teamID},
                    {$addToSet:{reqReceived: userID}},
                    {$push: {
                        chat: {
                            sender: req.token.name || req.token.username || req.token.id,
                            senderId: req.token.id,
                            type:'req'
                        }
                    }})
                req.app.io.to(teamID).emit('message', {
                    sender: req.token.name || req.token.username || req.token.id,
                    senderId: req.token.id,
                    type:'req'
                })
                await Promise.all([teamupdate,userupdate])
                res.status(200).send("user requested notified");
                client.close();
                return;
            }*/
        });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
        client.close();
        return;
    }
})

module.exports = router;
