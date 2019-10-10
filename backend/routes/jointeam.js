const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');
const router = express.Router();
const dbconfig = require('../db_config.json');
const verify = require('../verifyjwt');
const assert = require('assert');

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
                return;
            }
            if(user.length === 0 || user.length > 1 || team.length > 1) {
                res.status(500).send()
                return;
            }
            team = team[0]
            user = user[0]

            let isInTeam = false;
            //console.log(user)
            user.curTeams.forEach(team => {
                if(team.id === teamID) {
                    res.status(400).send({err:"You are already in that team."})
                    isInTeam = true;
                }
            })
            if(isInTeam) return;

            if(!team.alive) {
                res.status(400).send({err:"That team is no longer active."})
                return;
            }

            if(team.numMembers === team.maxMembers) {
                res.status(400).json({err:"That team is full."})
            }
            
            if(team.open) {
                //Join the team
                /*let obj = {id:userID, username:user.username}
                let newMembersArr = team.teamMembers;*/
                //newMembersArr.push(obj);
                let teamupdate = teamdb.collection('team').findOneAndUpdate({_id:ObjectId(teamID)},{
                    $inc: {numMembers: 1},
                    $push: {teamMembers: {
                        id:userID,
                        username:user.username
                    }}
                })
                let userupdate = userdb.collection('user').findOneAndUpdate({_id:ObjectId(userID)},{
                    $pull: {prevTeams: {
                        id:teamID,
                        name:team.teamName
                    }},
                    $push: {curTeams: {
                        id:teamID,
                        name:team.teamName
                    }}
                })
                await Promise.all([teamupdate,userupdate])
                res.status(200).send();
                return;
            } else {
                //Request to join the team
            }
        });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
        return;
    }
})

module.exports = router;
