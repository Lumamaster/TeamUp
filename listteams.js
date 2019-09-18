function listteams() {

    const MongoClient = require('mongodb').MongoClient;
    const assert = require('assert');

    // Url to connect to server
    const url = 'mongodb+srv://sburns:cheebs13@cluster0-wwsap.mongodb.net/test?retryWrites=true&w=majority';

    // Create Connection
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, client) {
        assert.equal(null, err);
        const db = client.db("Teams");

        var cursor = db.collection('team').find({
            name: 1,
        });

        cursor.count().then(function (result) {

            // no teams
            if (result == 0) {
                console.log('no teams found');
                client.close();
                return null;

                // teams are found
            } else {
                console.log('teams found: ' + result);
                client.close();
                return cursor.toArray;
            }
        });
    });
}