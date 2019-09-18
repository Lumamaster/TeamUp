const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// TODO: email, username, and password values need to come from textboxes
var email = "burns140@purdue.edu";
var password = "";

if (email == "") {
    console.log('must enter an email address');
    return false;
}

if (password == "") {
    console.log('must enter a password');
    return false;
}

// Url to connect to server
const url = 'mongodb+srv://sburns:cheebs13@cluster0-wwsap.mongodb.net/test?retryWrites=true&w=majority';

// Create Connection
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
    assert.equal(null, err);
    const db = client.db("Users");

    var cursor = db.collection('user').find({
        email: email,
    });

    var cursorArr = cursor.toArray();

    cursor.count().then(function(result) {
        
        // The user is found
        if (result == 1) {
            cursorArr.then(function (result) {
                if (result[0].password == password) {
                    console.log('logging in');
                    client.close();
                    //createCookie(username, email, 3);
                    /* TODO: Get information about the user to be passed back in response */
                    // TODO: reroute user
                    return true;
                } else {
                    console.log('incorrect password');
                    return false;
                }
            }).catch(function (err) {
                console.log(err);
            });
            return;




            if (cursorArr[0].password == password) {
                console.log('logging in');
                client.close();
                //createCookie(username, email, 3);
                /* TODO: Get information about the user to be passed back in response */
                // TODO: reroute user
                return true;
            } else {
                console.log('incorrect password');
                return false;
            }                

        // The user is not found    
        } else if (result == 0) {
            console.log('No account with that email exists');
            client.close();
            return false;

        // More than one user is found    
        } else {
            console.log('non zero or 1 query value: ' + result);
            client.close();
            return false;
        }
    });
});