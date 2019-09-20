const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const cookie = require('../cookies');
const dbconfig = require('../db_config.json');

router.use(express.json());
router.post('/', async(req,res) => {
    if(cookie.readCookie("") == null) {
        // Redirect to login page
        res.status(400).json({message:"not logged in"})
        return;
    }

    // Listing all active teams
    try{
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true}, function(err,client){
            assert.equal(null, err);
            const db = client.db("Teams");

            res.locals.teamlist = db.collection('team').find({alive: true}).toArray();

            client.close();
        });
    } catch(err) {
        console.log(error);
        res.status(400).json({err:error})
    }
});

router.post('/teamsearch', async(req,res) => {
    if(cookie.readCookie("") == null) {
        //Redirect to login page
        res.status(400).json({message:"not logged in"})
        return;
    }

    // Searching team
    try{
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology:true}, function(err, client){
            assert.equal(null, err);
            const db = client.db("Teams");

            // Filtering to look for the search string
            res.locals.teamlist = db.collection('team').find(
                {$and: 
                    [{$or: [{teamName: /req.searchteam/},
                           {owner: /req.searchteam/},
                           {teamMembers: /req.searchteam/},
                           {info: /req.searchteam/},
                           {requestedSkills: /req.searchteam/}]}, 
                    {alive:true}]
                });

            client.close();
        });
    } catch(err){
        console.log(error);
        res.status(400).json({err:error});
    }

    // Filter teams based on class
    try{
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
            assert.equal(null, err);
            const db = client.db("Teams");

            // Looking for class = the filter string
            res.locals.teamlist = db.collection('team').find(
                {$and:
                    [{class: req.searchteam},
                    {alive: true}]
                });

            client.close();
        });
    } catch(err){
        console.log(error);
        res.status(400).json({err:error});
    }

    // Filter teams based on open or restricted
    try{
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
            assert.equal(null, err);
            const db = client.db("Teams");

            // Looking for open = the filter string
            res.locals.teamlist = db.collection('team').find(
                {$and: 
                    [{open: req.searchteams},
                      {alive: true}]
                });

            client.close();
        });
    } catch(err){
        console.log(error);
        res.status(400).json({err:error});
    }

    

});

module.exports = router;