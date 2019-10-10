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
router.get('/:id', async (req,res) => {

    /* Check that the team id is valid */
    const teamId = req.params.id;
    if(teamId.length !== 24){
        console.log("invalid team ID");
        res.status(400).json({err:"Invalid team ID"}).send();
        return;
    }

    try {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
            assert.equal(null, err);
            const userdb

            /* Find all users that have an element with this teamID in their curTeams array */
            var users = userdb.collection('user').find({
                curTeams: { $all: [
                    { "$elemMatch" : { id: ObjectID(teamId) } }
                ] }
            }).toArray();

            /* find all values that are marked as free (1) for everyone */
            users.then(function (result) {
                var timeArr = result[0].times;
                for (var i = 1; i < result.length; i++) {
                    if (result[i] == 0) {
                        timeArr[i] = 0;
                    }
                };

                res.status(200).json({times:timeArr, message:'found common times'});
                client.close();
                return;
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

});

module.exports = router;