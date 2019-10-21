const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const router = express.Router();
const dbconfig = require('../db_config.json');
const verify = require('../verifyjwt');
const assert = require('assert');
const jwt = require('jsonwebtoken');

router.use(verify);
router.use(express.json());
router.use(express.urlencoded({extended:false}));
router.post('/:id', async (req,res) => {

    // Confirm a valid team ID
    const teamId = req.params.id;
    
    if(teamId.length !== 24){
        res.status(400).json({err:"Invalid team ID"}).send();
        return;
    }

    const userToKick = req.body.kick;       // ID of user to kick from team

    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const userdb = client.db("Users");
            const teamdb = client.db("Teams");

            var team = teamdb.collection('team').find({
                "_id":ObjectID(teamId)
            }).toArray();

            var user = userdb.collection('user').find({
                "_id":ObjectID(userToKick)
            }).toArray();

            team.then(function (result) {
                memberArr = result[0].teamMembers;
                var kicked = false;

                /* Find member with kick ID and remove him from member array */
                for (var i = 0; i < memberArr.length; i++) {
                    if (memberArr[i].id == userToKick) {
                        kicked = true;
                        memberArr.splice(i, 1);
                        break;
                    }
                }

                /* If nobody was kicked, return an error */
                if (!kicked) {
                    var err = 'user with that id not in that team';
                    console.log(err);
                    res.status(400).json({err:err});
                    client.close();
                    return;
                }

                /* Set the member array of the team to the array with kicked member removed */
                teamdb.collection('team').updateOne(            
                    { _id: ObjectID(teamId) },
                    {
                        $set: { teamMembers: memberArr}
                    }
                ).then(function (updated) {
                    console.log('team userarray updated');
                    user.then(function (result) {

                        /* Remove this team from the kicked users curTeam Array */
                        var curArr = result[0].curTeams;
                        var oldteam = null;
                        for (var i = 0; i < curArr.length; i++) {
                            if (curArr[i].id == teamId) {
                                oldteam = curArr[i];
                                curArr.splice(i, 1);
                                break;
                            }
                        }
        
                        /* Set the new curTeams without this team and push this team onto prevTeams */
                        userdb.collection('user').updateOne(        
                            { _id: ObjectID(userToKick) },
                            {
                                $set: { curTeams: curArr },
                                $push: { prevTeams: oldteam } 
                            }
                        ).then(function (result) {
                            console.log('successfully changed cur and prev teams');
                            res.status(200).json({message:'successfully kicked user'});
                            client.close();
                            return;
                        }).catch(function (err) {
                            console.log(err);
                            res.status(400).json({err:err});
                            client.close();
                            return;
                        })

                    }).catch(function (error) {
                        console.log(error);
                        res.status(400).json({err:error});
                        client.close();
                        return;
                    });

                }).catch(function (err) {
                    console.log(err);
                    res.status(400).json({err:err});
                    client.close();
                    return;
                });

            }).catch(function (err) {
                console.log(err);
                res.status(400).json({err:err});
                client.close();
                return;
            });
            
            
        });
    } catch(err) {
        console.error(err);
    } finally{}

})

module.exports = router;