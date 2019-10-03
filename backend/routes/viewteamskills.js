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
router.get('/:id', async (req,res) => {

    const {teamId} = req.params;
    if(teamId.length !== 24){
        res.status(400).json({err:"Invalid team ID"}).send();
        return;
    }

    const reviewText = req.body.review;

    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const userdb = client.db("Users");
            const teamdb

            var team = teamdb.collection('team').findOne({
                "_id":ObjectID(teamId)
            }).toArray();

            team.then(function (result) {
                var memberArr = result[0].teamMembers;
                var totalSkillArr = [];
                for (curMember of memberArr) {
                    var user = db.collection('user').findOne({
                        "_id":ObjectID(curMember.id)
                    }).toArray();

                    user.then(function (userResult) {
                        userSkillArr = userResult[0].skills
                    })
                }
            })

            

            user.then(function (result) {
                var reviewArr = result[0].reviews;
                reviewArr.push(reviewText);
                db.collection('user').updateOne(
                    { _id:ObjectId(theirId) },
                    {
                        $set: { reviews: reviewArr }
                    }
                ).then(function (r) {
                    res.status(200).send("review added successfully");
                    client.close();
                    return;
                }).catch(function (error) {
                    console.log(error);
                    res.status(400).send(error);
                    client.close();
                    return;
                });
            });
            
        });
    } catch(err) {
        console.error(err);
    } finally{}

})

module.exports = router;