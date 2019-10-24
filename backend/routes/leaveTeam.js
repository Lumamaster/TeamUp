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

    //const {teamId} = req.params;
    if(teamID.length !== 24){
        res.status(400).json({err:"Invalid team ID"}).send();
        return;
    }

    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const userdb = client.db("Users");
            const teamdb = client.db("Teams");
        
            // TODO: get teamname from button click
            var mongo = require('mongodb');
            var mongoID = ObjectId(teamID);
        
            // Get array of users with matching id
            var user = userdb.collection('user').find({
                _id:ObjectId(userID)
            }).toArray();
        
            // Get array of teams with matching id
            var team = teamdb.collection('team').find({
                _id: mongoID
            }).toArray();
        
            team.then(function (result) {
        
                // Check for empty result
                if (result.length == 0) {
                    //console.log(result);
                    //console.log('no team with that id exists');
                    res.status(400).json({err:"no team with that id exists"});
                    client.close();
                    return;
                }
        
                //console.log(result);
                var ownerLeft = result[0].owner.id === userID;
                // Remove this member's name from that team
                var memberArr = result[0].teamMembers.filter(member => member.id !== userID);
                if(memberArr.length === result[0].teamMembers.length) {
                    //Nothing was removed therefore the user was not part of the team
                    res.status(400).json({err:'You are not part of that team'});
                    client.close();
                    return;
                }
                for (var i = 0; i < memberArr.length; i++) {
                    if (memberArr[i].id === userID) {
                        if (result[0].owner.id === userID) {
                            ownerLeft = true;
                        }
                        memberArr.splice(i, 1);
                        break;
                    }
                }
        
                // After removing this member, if the team is now empty, it no longer exists
                // However, it needs to be kept in database for prevTeams
                if (memberArr.length === 0) {
                    teamdb.collection('team').updateOne(
                        { _id: mongoID },
                        {
                            $inc: {numMembers: -1},
                            $set: { teamMembers: memberArr }
                        }
                    )
        
                // If the team isn't empty, simply update the array
                } else {
                    /*if (ownerLeft) {
                        var newOwner = memberArr[0];
                        //console.log(newOwner)
                        teamdb.collection('team').updateOne(
                            { _id: mongoID },
                            {
                                $inc: {numMembers: -1},
                                $set: { teamMembers: memberArr, owner: newOwner }
                            }
                        )
                    } else {
                        teamdb.collection('team').updateOne(
                            { _id: mongoID },
                            {
                                $inc: {numMembers: -1},
                                $set: { teamMembers: memberArr }
                            }
                        )
                    }*/
                    teamdb.collection('team').updateOne(
                        { _id: mongoID },
                        {
                            $inc: {numMembers: -1},
                            $set: { teamMembers: memberArr }
                        }
                    )
                    
                }


                user.then(function (userResult) {
                    var removed = false; 
                    var teamArr = userResult[0].curTeams;
                    var prevArr = userResult[0].prevTeams;
            
                    // Remove the team from your curTeam array
                    // Add team to prevTeam array
                    for (var i = 0; i < teamArr.length; i++) {
                        if (teamArr[i].id == teamID) {
                            prevArr.push(teamArr[i]);
                            teamArr.splice(i, 1);
                            removed = true;
                            break;
                        }
                    }
            
                    // If you weren't removed from anything, you were never a part of that team
                    if (removed == false) {
                        //console.log('you are not part of a team with that id');
                        res.status(400).json({err:'You are not part of that team'});
                        client.close();
                        return;
                    }
            
                    // Update both the current and prev arrays
                    userdb.collection('user').updateOne(
                        { _id:ObjectId(userID) },
                        {
                            $set: { curTeams: teamArr, prevTeams: prevArr }
                        }
                    )
                    res.status(200).json({message:"successfully removed from team"});
                    client.close();
                }).catch(function (error) {
                    console.log(error);
                    res.status(400).json({err:error});
                    client.close();
                });
            });
        });
    } catch (err) {
        console.log(err);
        client.close();
    }
})

module.exports = router;
