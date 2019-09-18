const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb+srv://sburns:cheebs13@cluster0-wwsap.mongodb.net/test?retryWrites=true&w=majority';

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
    assert.equal(null, err);
    const userdb = client.db("Users");
    const teamdb = client.db("Teams");

    // TODO: get teamname from button click
    var teamName = "teamname";
    var teamID = "5d81144f674cf64604bc75c5";
    var mongo = require('mongodb');
    var mongoID = new mongo.ObjectID(teamID);
    var email = "burns140@purdue.edu";

    // Get array of users with matching email. Should be size 1.
    var user = userdb.collection('user').find({
        email: email
    }).toArray();

    // Get array of users with matching name. Should be size 1.
    // TODO: change to use team _id
    var team = teamdb.collection('team').find({
        _id: mongoID
    }).toArray();

    team.then(function (result) {

        // Check for empty result
        if (result.length == 0) {
            console.log('no team with that name exists');
            return;
        }

        // Remove this member's name from that team
        var memberArr = result[0].teamMembers;
        for (var i = 0; i < memberArr.length; i++) {
            if (memberArr[i] == email) {
                memberArr.splice(i, 1);
            }
        }

        // After removing this member, if the team is now empty, it no longer exists
        // However, it needs to be kept in database for prevTeams
        if (memberArr.length == 0) {
            teamdb.collection('team').updateOne(
                { _id: mongoID },
                {
                    $set: { teamMembers: memberArr, alive: false }
                }
            )

        // If the team isn't empty, simply update the array
        } else {
            teamdb.collection('team').updateOne(
                { _id: mongoID },
                {
                    $set: { teamMembers: memberArr }
                }
            )
        }

        user.then(function (userResult) {
            var removed = false; 
            var teamArr = userResult[0].curTeams;
            var prevArr = userResult[0].prevTeams;
    
            // Remove the team from your curTeam array
            for (var i = 0; i < teamArr.length; i++) {
                if (teamArr[i].id == teamID) {
    
                    var teamPair = {
                        teamName: teamName,
                        id: teamID
                    }
    
                    prevArr.push(teamPair);
                    teamArr.splice(i, 1);
                    removed = true;
                }
            }
    
            // If you weren't removed from anything, you were never a part of that team
            if (removed == false) {
                console.log('you are not part of a team with that name');
                return;
            }
    
            // Update both the current and prev arrays
            userdb.collection('user').updateOne(
                { email: email },
                {
                    $set: { curTeams: teamArr, prevTeams: prevArr }
                }
            )
        }).catch(function(error) {
            console.log(error);
        });
    }).catch(function(error) {
        console.log(error);
    });

    

});