const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// TODO: email, username, and password values need to come from textboxes
var email = "burns140@purdue.edu";
var password = "V4lidPassword$";

// Url to connect to server
const url = 'mongodb+srv://sburns:cheebs13@cluster0-wwsap.mongodb.net/test?retryWrites=true&w=majority';

// Create Connection
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
    assert.equal(null, err);
    const db = client.db("Users");

    var cursor = db.collection('user').find({
        $or: [ {email: email}, {username: username} ]
    });

    var cursor = db.collection('user').find({
        email: email,
        password: password
    });

    cursor.count().then(function(result) {
        
        // The user is found
        if (result == 1) {
            console.log('logging in');
            createCookie(username, email, 3);
            client.close();
            return;

        // The user is not found    
        } else if (result == 0) {
            console.log('incorrect username or password');
            client.close();
            return;

        // More than one user is found    
        } else {
            console.log('non zero or 1 query value: ' + result);
            client.close();
            return;
        }
    });
});