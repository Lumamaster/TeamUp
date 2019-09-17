// TODO: this should occur on click of a "submit" button

function addskill(email, skill) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
        assert.equal(null, err);
        const db = client.db("Users");
    
        var user = db.collection('user').find({
            email: email
        }).toArray();

        user.then(function (result) {
            console.log(result[0]);
            console.log(result[0].skills);
            var skillArr = result[0].skills;
            skillArr.push(skill);
            console.log(skillArr);
        });
        //console.log(user);
        var skills = user.name;        
    
        /*db.collection('user').updateOne(
            { email: email },
            {
                $set: { bio: bio, password: password, name: name, curTeams: curTeams, skills: skills }
            }
        )*/
        client.close();
    });
}

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

/* if (readCookie("") == null) {
    // TODO: redirect to login page
    return;
} */

// TODO: get values from textbox
var email = "burns140@purdue.edu";
var password = "password";
var name = "name";
var curTeams = ["curteam1", "curteam2"];
var skills = ["i have no skills"];
var bio = "lolbio";

// Url to connect to server
const url = 'mongodb+srv://sburns:cheebs13@cluster0-wwsap.mongodb.net/test?retryWrites=true&w=majority';

addskill(email, "crying");
// Create Connection
/*MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
    assert.equal(null, err);
    const db = client.db("Users");

    db.collection('user').updateOne(
        { email: email },
        {
            $set: { bio: bio, password: password, name: name, curTeams: curTeams, skills: skills }
        }
    )
    client.close();
});*/