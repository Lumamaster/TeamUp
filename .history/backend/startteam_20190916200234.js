const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Get Current User
var currUser = readCookie(name);

// Redirect to home page if not logged in
if(currUser == null){
    console.log('not logged in');
    window.location.href = "/"
}

// Get Team details
var teamName = document.getElementById("teamname").value;
var teamOpen = document.getElementById("open").value;
var teamMax = document.getElementById("maxnum").value;
var teamSkill = document.getElementById("teamskills").value;

// Url to connect to server
const url = 'mongodb+srv://sburns:cheebs13@cluster0-wwsap.mongodb.net/test?retryWrites=true&w=majority';

// Create MongoDB Connection
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
    assert.equal(null, err);
    const db = client.db("Teams");

    db.collection('team').insertOne({
        name: teamName,
        open: teamOpen,
        max: teamMax,
        skill: teamSkill
    }).then(function(){
        console.log('Team successfully created');
        client.close();
    }).catch(function(err){
        console.log('Team creation failed');
        console.log(err);
    })
       
})