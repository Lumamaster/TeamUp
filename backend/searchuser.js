function searchUser(username) {

    const MongoClient = require('mongodb').MongoClient;
    const assert = require('assert');

    // Url to connect to server
    const url = 'mongodb+srv://sburns:cheebs13@cluster0-wwsap.mongodb.net/test?retryWrites=true&w=majority';

    // Create Connection
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, client) {
        assert.equal(null, err);
        const db = client.db("Users");

        var cursor = db.collection('user').find({
            username: username,
        });

        cursor.count().then(function (result) {

            // The user is found
            if (result == 1) {
                console.log('user found');
                client.close();
                return cursor.next;

                // The user is not found
            } else if (result == 0) {
                console.log('user not found');
                client.close();
                return null;

                // More than one user is found
            } else {
                console.log('multiple users found: ' + result);
                client.close();
                return cursor.toArray;
            }
        });
    });
}